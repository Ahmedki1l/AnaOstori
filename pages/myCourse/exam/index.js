import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../../components/CommonComponents/spinner';
import { getAuthRouteAPI, getRouteAPI, postAuthRouteAPI } from '../../../services/apisService';
import { getNewToken } from '../../../services/fireBaseAuthService';
import { examResultService } from '../../../services/examResultService';
import styles from '../../../styles/ExamPage.module.scss';
import ExamIntroduction from '../../../components/ExamComponents/ExamIntroduction';
import ExamSections from '../../../components/ExamComponents/ExamSections';
import ExamQuestions from '../../../components/ExamComponents/ExamQuestions';
import ReviewSection from '../../../components/ExamComponents/ReviewSection';
import ReviewQuestion from '../../../components/ExamComponents/ReviewQuestion';
import ExamResults from '../../../components/ExamComponents/ExamResults';
import ExamSectionsReview from '../../../components/ExamComponents/ExamSectionsReview';
import ReviewAnswers from '../../../components/ExamComponents/ReviewAnswers';
import { toast } from 'react-toastify';

/**
 * Enhanced Distraction Detection System
 * 
 * This exam page implements a sophisticated distraction detection system with:
 * 
 * 1. 3-Strike Rule:
 *    - Each distraction event starts a 3-second timer
 *    - If the distraction continues for 3 seconds, it counts as 1 strike
 *    - After 3 strikes, the exam is immediately terminated
 * 
 * 2. 30-Second Continuous Distraction Detection:
 *    - If distraction continues for 30 seconds without interruption
 *    - The exam is terminated immediately regardless of strike count
 * 
 * 3. Distraction Detection Methods:
 *    - Page visibility changes (tab switching)
 *    - Window blur/focus events
 *    - Route changes within the app
 * 
 * 4. Visual Indicators:
 *    - Fixed warning banner showing current strikes
 *    - Timer indicator showing distraction status
 *    - Color-coded warnings (orange → red)
 * 
 * 5. Automatic Cleanup:
 *    - Timers are cleared when user returns to exam
 *    - All timers are cleaned up on component unmount
 */

function useCheatDetection(onCheat, onContinuousCheat) {
    const router = useRouter();
    const isCheatingRef = useRef(false);
    const cheatStartTimeRef = useRef(null);

    useEffect(() => {
        // 1) Page Visibility API
        const handleVisibility = () => {
            if (document.visibilityState === 'hidden') {
                handleCheatEvent('tab_hidden');
            } else {
                // When tab becomes visible again, reset continuous cheating timer
                if (isCheatingRef.current) {
                    isCheatingRef.current = false;
                    if (cheatStartTimeRef.current) {
                        cheatStartTimeRef.current = null;
                    }
                    // Notify that cheating has stopped
                    onContinuousCheat(false);
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        // 2) Window blur (fallback for very old browsers)
        const handleBlur = () => handleCheatEvent('window_blur');
        window.addEventListener('blur', handleBlur);

        // 3) Window focus - reset cheating state when user returns
        const handleFocus = () => {
            if (isCheatingRef.current) {
                isCheatingRef.current = false;
                if (cheatStartTimeRef.current) {
                    cheatStartTimeRef.current = null;
                }
                // Notify that cheating has stopped
                onContinuousCheat(false);
            }
        };
        window.addEventListener('focus', handleFocus);

        // 4) Next.js route change (in-app navigation)
        const handleRoute = (url) => {
            // if they try to navigate inside your app
            handleCheatEvent('route_change', { to: url });
        };
        router.events.on('routeChangeStart', handleRoute);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            router.events.off('routeChangeStart', handleRoute);
        };
    }, [router.events, onCheat, onContinuousCheat]);

    const handleCheatEvent = (type, data = {}) => {
        console.warn('Cheat detected:', type, data);

        // If this is the first cheat event, start the continuous cheating timer
        if (!isCheatingRef.current) {
            isCheatingRef.current = true;
            cheatStartTimeRef.current = Date.now();

            // Notify that continuous cheating has started
            onContinuousCheat(true);
        }

        // Call the original onCheat callback
        onCheat(type, data);
    };
}


const ExamPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const storeData = useSelector((state) => state?.globalStore);
    const accessToken = storeData?.accessToken;
    // Enhanced authentication logic
    useEffect(() => {
        async function checkAuth() {
            if (!accessToken) {
                try {
                    const newToken = await getNewToken();
                    if (newToken) {
                        dispatch({ type: 'ADD_AUTH_TOKEN', accessToken: newToken });
                        return;
                    }
                } catch (err) {
                    // Token refresh failed, proceed to login
                }
                // Save returnUrl and redirect to login
                dispatch({ type: 'SET_RETURN_URL', returnUrl: router.asPath });
                if (router.asPath !== '/login') {
                    router.replace('/login');
                }
            }
        }
        checkAuth();
    }, [accessToken, router, dispatch]);
    
    // NOTE: Do not return early here for !accessToken - hooks must be declared unconditionally.
    // The auth check spinner is rendered at the end of the component, after all hooks.
    const { examId } = router.query;
    const isFirstRun = useRef(true);
    const isAbleToAddTime = useRef(false);
    const sectionsCounterRef = useRef(0);
    const sectionIDRef = useRef(0);

    const [loading, setLoading] = useState(false);
    const [examData, setExamData] = useState(null);
    const [selectedExam, setSelectedExam] = useState();
    const [selectedSectionId, setSelectedSectionId] = useState(0);
    const [selectedSection, setSelectedSection] = useState(null);
    const [examSections, setExamSections] = useState(0);
    const [examQuestions, setExamQuestions] = useState();
    const [allExamQuestions, setAllExamQuestions] = useState([]);
    const [sectionsFinished, setSectionsFinished] = useState([]);
    const [examStage, setExamStage] = useState('introduction');
    const [examTimer, setExamTimer] = useState('25:00');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionAnswers, setQuestionAnswers] = useState({});
    const [markedQuestions, setMarkedQuestions] = useState([]);

    const [selectedSectionidForReview, setSelectedSectionidForReview] = useState([]);

    // Distraction detection
    const [distractionEvents, setDistractionEvents] = useState([]);
    const [distractionStrikes, setDistractionStrikes] = useState(0);
    const [isDistracted, setIsDistracted] = useState(false);
    const [distractionStartTime, setDistractionStartTime] = useState(null);
    const [terminationReason, setTerminationReason] = useState(null);
    const distractionStrikeTimerRef = useRef(null);
    const continuousDistractionTimerRef = useRef(null);

    // Exam result submission
    const [examResultsSubmitted, setExamResultsSubmitted] = useState(false);
    const [submittingResults, setSubmittingResults] = useState(false);
    const [submissionFailed, setSubmissionFailed] = useState(false);

    // callback whenever a "distraction" happens
    const reportDistraction = (type, data = {}) => {
        console.warn('Distraction detected:', type, data);
        const currentTime = Date.now();

        setDistractionEvents(evts => [...evts, { eventType: type, timestamp: new Date(currentTime).toISOString(), ...data }]);

        // If this is the first distraction event, start the 3-second timer
        if (!isDistracted) {
            setIsDistracted(true);
            setDistractionStartTime(currentTime);

            // Set 3-second timer for this distraction event
            distractionStrikeTimerRef.current = setTimeout(() => {
                // After 3 seconds, count this as a strike
                setDistractionStrikes(prev => {
                    const newStrikes = prev + 1;
                    console.warn(`Distraction strike ${newStrikes}/3 recorded`);

                    if (newStrikes >= 3) {
                        console.warn('3 strikes reached - terminating exam');
                        setTerminationReason('three_strikes');
                        // handleExamTermination('three_strikes');
                    }

                    return newStrikes;
                });

                setIsDistracted(false);
                setDistractionStartTime(null);
            }, 3000); // 3 seconds
        }

        // you could also POST this to your backend:
        // postAuthRouteAPI({ routeName:'logDistraction', examId, type, timestamp: currentTime })
    };

    // Cheat/distraction detection disabled — handlers are no-ops
    const handleContinuousDistraction = () => { };

    // Handle exam termination
    const handleExamTermination = async () => {
        console.warn('Exam terminated due to:', terminationReason);

        // Clear all timers
        if (distractionStrikeTimerRef.current) {
            clearTimeout(distractionStrikeTimerRef.current);
        }
        if (continuousDistractionTimerRef.current) {
            clearTimeout(continuousDistractionTimerRef.current);
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        // Submit exam results even if terminated (with termination reason)
        if (!examResultsSubmitted && selectedExam && allReviewQuestions && allExamQuestions) {
            try {
                await submitExamResultsWithTermination();
            } catch (error) {
                console.error('Error submitting terminated exam results:', error);
            }
        }

        // Log the termination to backend
        const terminationData = {
            routeName: 'logExamTermination',
            examId,
            reason: terminationReason,
            distractionEvents,
            distractionStrikes,
            timestamp: Date.now()
        };
        console.log("🚀 ~ handleExamTermination ~ terminationData:", terminationData);

        // Log the termination to backend
        postAuthRouteAPI(terminationData).catch(console.error);

        // Show termination message to user
        toast.error('تم إنهاء الاختبار بسبب التشتيت المتكرر');

        // Force exam to results stage
        if (examStage !== 'results') {
            setExamStage('results');
        }

        // // Align allReviewQuestions to match examData
        // if (selectedExam && allReviewQuestions) {
        //     setAllReviewQuestions(prev => alignAllReviewQuestions(selectedExam.sections, prev));
        // }
    };

    // Kept as a thin wrapper for backward compatibility with handleExamTermination.
    const submitExamResultsWithTermination = async () => {
        return submitExamResults(undefined, {
            isTerminated: true,
            terminationReason: terminationReason
        });
    };

    // Cheat detection disabled
    useCheatDetection(() => { }, () => { });

    // // enable the hook
    // const cheatDetectionCleanup = useRef(null);
    // useEffect(() => {
    //     if (["questions", "review", "reviewQuestion"].includes(examStage)) {
    //         cheatDetectionCleanup.current = useCheatDetection(reportDistraction, handleContinuousDistraction);
    //     } else {
    //         if (cheatDetectionCleanup.current) {
    //             cheatDetectionCleanup.current();
    //             cheatDetectionCleanup.current = null;
    //         }
    //     }
    //     return () => {
    //         if (cheatDetectionCleanup.current) {
    //             cheatDetectionCleanup.current();
    //             cheatDetectionCleanup.current = null;
    //         }
    //     };
    // }, [examStage]);

    // near the top of your component
    // ────── 1) Replace your old examTimer with timeLeft (in seconds) ──────
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef(null);

    // ────── 4) When we transition to 'results', stop timer & compute elapsed ──────
    const [elapsedSeconds, setElapsedSeconds] = useState(null);
    const [elapsedFormatted, setElapsedFormatted] = useState(null);
    const [allElapsedFormatted, setAllElapsedFormatted] = useState([]);

    // format seconds → "MM:SS"
    const formatTime = secs => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Mock exam data for testing (remove this when connecting to real API)
    const [mockExamData, setMockExamData] = useState({
        title: "عنوان الاختبار هنا",
        duration: "25:00",
        subTitle: "تعليمات الاختبار",
        instructions: "(هذا النص قابل للتعديل. هنا تكتب توضيح عن تعليمات الاختبار عشان الطالب يفهم الطريقة وراح تلاحظ انه في بعض الاشياء مختلفة شوي عن تصميم المنصف في القدرات)",
    });

    const [mockExamData1, setMockExamData1] = useState({
        title: "عنوان الاختبار هنا",
        duration: "25:00",
        subTitle: "القسم الأول",
        details: [
            {
                iconName: "questionIcon",
                title: "عدد الأسئلة: 30 سؤال",
            },
            {
                iconName: "clockIcon",
                title: "مدة الاختبار: 25 دقيقة",
            },
        ]
    });

    const [mockExamData2, setMockExamData2] = useState({
        questions: [
            {
                _id: 1,
                text: "الجهل بثقافة الآخرين يشكل تلقائيًا نظرة رديئة عنهم.",
                type: "contextual",
                context: "الخطأ السياقي",
                contextDescription: "في الجملة الآتية أربعة كلمات كل منها مكتوبة بخط غليظ، المطلوب هو تحديد الكلمة التي لا يتفق معناها مع المعنى العام للجملة. (الخطأ ليس لغويًا ولا نحويًا).",
                options: [
                    { id: 'أ', text: 'الجهل' },
                    { id: 'ب', text: 'ثقافة' },
                    { id: 'ج', text: 'تلقائيًا' },
                    { id: 'د', text: 'رديئة' }
                ],
                correctAnswer: 'ج'
            },
            {
                _id: 2,
                text: "الجهل بثقافة الآخرين يشكل تلقائيًا نظرة رديئة عنهم.",
                type: "contextual",
                context: "الخطأ السياقي",
                contextDescription: "في الجملة الآتية أربعة كلمات كل منها مكتوبة بخط غليظ، المطلوب هو تحديد الكلمة التي لا يتفق معناها مع المعنى العام للجملة. (الخطأ ليس لغويًا ولا نحويًا).",
                options: [
                    { id: 'أ', text: 'الجهل' },
                    { id: 'ب', text: 'ثقافة' },
                    { id: 'ج', text: 'تلقائيًا' },
                    { id: 'د', text: 'رديئة' }
                ],
                correctAnswer: 'ج'
            },
            {
                _id: 3,
                text: "الجهل بثقافة الآخرين يشكل تلقائيًا نظرة رديئة عنهم.",
                type: "contextual",
                context: "الخطأ السياقي",
                contextDescription: "في الجملة الآتية أربعة كلمات كل منها مكتوبة بخط غليظ، المطلوب هو تحديد الكلمة التي لا يتفق معناها مع المعنى العام للجملة. (الخطأ ليس لغويًا ولا نحويًا).",
                options: [
                    { id: 'أ', text: 'الجهل' },
                    { id: 'ب', text: 'ثقافة' },
                    { id: 'ج', text: 'تلقائيًا' },
                    { id: 'د', text: 'رديئة' }
                ],
                correctAnswer: 'ج'
            },
            {
                _id: 4,
                text: "الجهل بثقافة الآخرين يشكل تلقائيًا نظرة رديئة عنهم.",
                type: "contextual",
                context: "الخطأ السياقي",
                contextDescription: "في الجملة الآتية أربعة كلمات كل منها مكتوبة بخط غليظ، المطلوب هو تحديد الكلمة التي لا يتفق معناها مع المعنى العام للجملة. (الخطأ ليس لغويًا ولا نحويًا).",
                options: [
                    { id: 'أ', text: 'الجهل' },
                    { id: 'ب', text: 'ثقافة' },
                    { id: 'ج', text: 'تلقائيًا' },
                    { id: 'د', text: 'رديئة' }
                ],
                correctAnswer: 'ج'
            },
        ],
    });

    const [reviewSpecificQuestions, setReviewSpecificQuestions] = useState(mockExamData2);
    const [reviewSpecificQuestionsAnswers, setReviewSpecificQuestionsAnswers] = useState(mockExamData2);

    const [displayExamData, setDisplayExamData] = useState(mockExamData);

    const [reviewQuestions, setReviewQuestions] = useState({});
    const [allReviewQuestions, setAllReviewQuestions] = useState([]);

    useEffect(() => {
        if (examId) {
            fetchQuestions();
        }
    }, [examId]);

    useEffect(() => {
        const initialReviewQuestions2 = mockExamData2.questions.map((question) => ({
            id: question._id,
            answered: false,
            isMarked: false,
            selectedAnswer: null
        }));

        setReviewQuestions(initialReviewQuestions2);

        console.log("🚀 ~ useEffect ~ initialReviewQuestions2:", initialReviewQuestions2);

    }, [mockExamData2]);

    useEffect(() => {
        console.log("🚀 ~ ExamPage ~ allReviewQuestions:", allReviewQuestions);
    }, [allReviewQuestions]);

    useEffect(() => {
        console.log("🚀 ~ ExamPage ~ displayExamData:", displayExamData);
    }, [displayExamData]);

    useEffect(() => {
        if (selectedExam) {
            // format HH:MM for display
            const examDurationDisplay = selectedExam.duration
                ? `${selectedExam.duration}:00`
                : '25:00';

            const sectionDurationDisplay = selectedExam?.sections[selectedSectionId].duration
                ? `${selectedExam?.sections[selectedSectionId].duration}:00`
                : '25:00';

            setMockExamData({
                title: selectedExam.title || "عنوان الاختبار هنا",
                duration: examDurationDisplay,
                subTitle: "تعليمات الاختبار",
                instructions:
                    selectedExam.instructions ||
                    "(هذا النص قابل للتعديل. هنا تكتب توضيح …)"
            });

            // map your new sections shape
            const formattedSections = (selectedExam.sections || []).map(sec => ({
                subTitle: sec.title,
                details: [
                    {
                        iconName: 'questionIcon',
                        title: `عدد الأسئلة: ${sec.questions.length} سؤال`
                    },
                    {
                        iconName: 'clockIcon',
                        title: `مدة القسم: ${sec.duration || 25} دقيقة`
                    }
                ]
            }));

            setExamSections(selectedExam?.sections?.length);

            const fetchWithAsync = async () => {
                const questions = await fetchQuestionsByIds(selectedExam?.sections[selectedSectionId].questions);
                setExamQuestions({
                    questions: questions,
                });
                setAllExamQuestions((prev) => {
                    const exists = prev.some(q => q === questions);
                    if (!exists) {
                        return [...prev, questions];
                    }
                    return prev;
                });
                setSelectedSection(selectedExam?.sections[selectedSectionId]);
                setMockExamData2({
                    questions: questions,
                });
                setReviewSpecificQuestions({
                    questions: questions
                });
            }
            fetchWithAsync();

            setMockExamData1({
                title: selectedExam?.sections[selectedSectionId].title || 'عنوان الاختبار هنا',
                duration: sectionDurationDisplay,
                sections: formattedSections
            });

            setTimeLeft(selectedExam?.sections[selectedSectionId].duration * 60);
        }
    }, [selectedExam, selectedSectionId]);

    useEffect(() => {
        setDisplayExamData(mockExamData);
    }, [mockExamData]);

    useEffect(() => {
        if (examStage == 'questions' || examStage == 'review' || examStage == 'reviewQuestion') {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        isAbleToAddTime.current = true;
                        const isLastSection = selectedSectionId >= selectedExam.sections.length - 1;
                        const alreadyRecorded = sectionsFinished.includes(selectedSectionId);
                        if (!isLastSection) {
                            if (!alreadyRecorded) {
                                setSectionsFinished(prev => [...prev, selectedSectionId]);
                                setAllReviewQuestions(prev => [...prev, reviewQuestions]);
                            }
                            setDisplayExamData(mockExamData1);
                            setExamStage('sections');
                            setSelectedSectionId(selectedSectionId + 1);
                        } else {
                            if (!alreadyRecorded && isFirstRun.current) {
                                setAllReviewQuestions(prev => [...prev, reviewQuestions]);
                                isFirstRun.current = false;
                            }
                            setExamStage('results');
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [examStage, selectedSectionId, selectedExam, sectionsFinished, reviewQuestions]);

    // Cleanup distraction detection timers when exam stage changes or component unmounts
    useEffect(() => {
        return () => {
            if (distractionStrikeTimerRef.current) {
                clearTimeout(distractionStrikeTimerRef.current);
            }
            if (continuousDistractionTimerRef.current) {
                clearTimeout(continuousDistractionTimerRef.current);
            }
        };
    }, [examStage]);

    // Cleanup timers when component unmounts
    useEffect(() => {
        return () => {
            if (distractionStrikeTimerRef.current) {
                clearTimeout(distractionStrikeTimerRef.current);
            }
            if (continuousDistractionTimerRef.current) {
                clearTimeout(continuousDistractionTimerRef.current);
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        console.log("🚀 ~ ExamPage ~ allElapsedFormatted:", allElapsedFormatted);
        console.log("🚀 ~ ExamPage ~ timeLeft:", timeLeft);
    }, [timeLeft, allElapsedFormatted])

    // Log distraction strikes for debugging
    useEffect(() => {
        if (distractionStrikes > 0) {
            console.log(`🚨 Distraction strikes: ${distractionStrikes}/3`);
        }
    }, [distractionStrikes]);

    // Log distraction state for debugging
    useEffect(() => {
        if (isDistracted) {
            console.log('🚨 Distraction detected - 3 second timer started');
        }
    }, [isDistracted]);


    useEffect(() => {
        if (sectionIDRef.current >= 0 && sectionsCounterRef.current < examSections && isAbleToAddTime.current) {
            const initial = (selectedExam?.sections[sectionIDRef.current].duration || 0) * 60;
            console.log("🚀 ~ useEffect ~ selectedSectionId:", sectionIDRef.current);
            console.log("🚀 ~ useEffect ~ initial:", initial);
            console.log("🚀 ~ useEffect ~ timeLeft:", timeLeft);
            const used = initial - timeLeft;
            console.log("🚀 ~ useEffect ~ used:", used);
            setAllElapsedFormatted((prev) => [...prev, formatTime(used)]);
            sectionsCounterRef.current += 1;
            isAbleToAddTime.current = false;
            sectionIDRef.current += 1;
        }

        if (examStage !== 'results') return;

        // FIX: Add the last section's time before stopping the timer
        // We check if we have not yet recorded time for the current section
        if (sectionIDRef.current >= 0 && allElapsedFormatted.length < examSections) {
            const currentSectionIndex = sectionIDRef.current;
            // Use the stored section duration or default 25
            const initial = (selectedExam?.sections[currentSectionIndex]?.duration || 0) * 60;

            // If timeLeft is weirdly larger than initial (shouldn't happen), clamp it
            const validTimeLeft = timeLeft > initial ? initial : timeLeft;
            const used = initial - validTimeLeft;

            console.log("🚀 ~ Last Section Time ~ sectionID:", currentSectionIndex);
            console.log("🚀 ~ Last Section Time ~ initial:", initial);
            console.log("🚀 ~ Last Section Time ~ timeLeft:", timeLeft);
            console.log("🚀 ~ Last Section Time ~ used:", used);

            setAllElapsedFormatted((prev) => {
                // Double check inside state setter to prevent race conditions
                if (prev.length < examSections) {
                    return [...prev, formatTime(used)];
                }
                return prev;
            });
            // Update the counter to reflect we're done with this section
            sectionsCounterRef.current += 1;
        }

        // kill interval if still running
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        // initial total
        const initial = (selectedExam?.duration || 0) * 60;
        const used = initial - timeLeft;
        setElapsedSeconds(used);
        setElapsedFormatted(formatTime(used));
    }, [examStage]);

    // Function to fetch questions from API
    const fetchQuestions = async (page = 1, searchQuery = null) => {
        setLoading(true);
        const payload = {
            routeName: 'getItem',
            page,
            limit: 10,
            type: 'simulationExam',
            itemId: examId,
        };

        if (searchQuery) {
            payload.search = searchQuery;
        }

        try {
            const response = await getRouteAPI(payload);
            if (response?.data) {
                setSelectedExam(response.data.data[0]);
            }
        } catch (error) {
            if (error?.response?.status === 401) {
                await getNewToken();
                const response = await getRouteAPI(payload);
                if (response?.data) {
                    setSelectedExam(response.data.data[0]);
                }
            } else {
                toast.error('حدث خطأ أثناء جلب الأسئلة');
            }
        }
        setLoading(false);
    };

    // Add this function to fetch questions by their IDs
    const fetchQuestionsByIds = async (questionIds) => {
        if (!questionIds || questionIds.length === 0) return [];
        const payload = {
            routeName: 'getItem',
            type: 'questions',
            page: 1,
            limit: 9999,
            ids: questionIds
        };
        try {
            const response = await getRouteAPI(payload);
            if (response?.data) {
                return response.data.data;
            }
        } catch (error) {
            if (error?.response?.status === 401) {
                await getNewToken();
                const response = await getRouteAPI(payload);
                if (response?.data) {
                    return response.data.data;
                }
            } else {
                toast.error('حدث خطأ أثناء جلب الأسئلة');
                console.log(error);
            }
        }
        return [];
    };

    // Review section text content
    const reviewSectionTexts = {
        title: "قسم المراجعة",
        examTitle: "عنوان الاختبار هنا",
        currentTime: examTimer,
        instructionsTitle: "إرشادات",
        instructions: {
            intro: [
                "فيما يلي ملخص لإجاباتك يمكنك مراجعة اسئلتك بثلاث (٣) طرق مختلفة.",
                "الأزرار الموجودة في الركن السفلي الأيسر تطابق هذه الخيارات :"
            ],
            list: [
                "قم بمراجعة كل اسئلتك وإجاباتك.",
                "قم بمراجعة الأسئلة غير المكتملة.",
                "قم بمراجعة الأسئلة المميزة بعلامة للمراجعة. (انقر فوق الرمز \"تمييز\" لتغيير العلامة الخاصة بحالة المراجعة.)"
            ]
        },
        sectionTitle: "الباب الأول",
        buttonLabels: {
            reviewMarked: "مراجعة المميز بعلامة",
            reviewIncomplete: "مراجعة الغير مكتمل",
            reviewAll: "مراجعة الكل",
            finishReview: "انهاء المراجعة، والانتقال للقسم الآخر",
            markQuestion: "تمييز السؤال"
        },
        questionLabel: "سؤال",
        incompleteLabel: "غير مكتمل",
        completeLabel: "مكتمل"
    };


    const handleIntroductionBtn = async () => {
        setLoading(true);
        try {
            const studentId = storeData?.viewProfileData?.id;
            if (!studentId || !examId) {
                toast.error('حدث خطأ في بيانات المستخدم أو الامتحان');
                setLoading(false);
                return;
            }
            const hasTaken = await examResultService.hasStudentTakenExam(examId, studentId);
            if (hasTaken) {
                toast.error('لقد قمت بأداء هذا الاختبار من قبل ولا يمكنك إعادة الدخول.');
                setLoading(false);
                return;
            }
            setDisplayExamData(mockExamData1);
            setExamStage('sections');
        } catch (err) {
            toast.error('حدث خطأ أثناء التحقق من حالة الاختبار.');
        } finally {
            setLoading(false);
        }
    };

    const handleSectionsBtn = () => {
        setDisplayExamData(mockExamData2);
        setExamStage('questions');
    };

    const handleCompleteExam = (answers) => {
        setQuestionAnswers(answers);
        setExamStage('review');
    };

    // Review section handlers
    const handleReviewAll = () => {
        setReviewSpecificQuestions(mockExamData2);
        setExamStage('reviewQuestion');
        setCurrentQuestionIndex(0);
    };

    const handleReviewIncomplete = () => {
        // Find all incomplete questions from reviewQuestions
        const incompleteReviewQuestions = reviewQuestions.filter((q) => !q.answered);

        if (incompleteReviewQuestions.length > 0) {
            // Get the IDs of incomplete questions
            const incompleteIds = incompleteReviewQuestions.map(q => q.id);

            // Filter mockExamData2.questions to get only the incomplete questions
            const incompleteQuestions = {
                questions: mockExamData2.questions.filter(q =>
                    incompleteIds.includes(q._id)
                )
            }

            // Find the index of the first incomplete question in the original questions array
            if (incompleteQuestions.questions.length > 0) {
                // Navigate to the first incomplete question
                setReviewSpecificQuestions(incompleteQuestions);
                setCurrentQuestionIndex(0);
                setExamStage('reviewQuestion');
            }
        } else {
            console.log("No incomplete questions found");
            // Optionally: Add user feedback that there are no incomplete questions
        }
    };

    const handleReviewMarked = () => {
        // Find first marked question
        const markedReviewQuestions = reviewQuestions.filter((q) => q.isMarked);
        console.log("🚀 ~ handleReviewMarked ~ markedReviewQuestions:", markedReviewQuestions);

        if (markedReviewQuestions.length > 0) {
            // Get the IDs of incomplete questions
            const markedIds = markedReviewQuestions.map(q => q.id);

            // Filter mockExamData2.questions to get only the incomplete questions
            const markedQuestions = {
                questions: mockExamData2.questions.filter(q =>
                    markedIds.includes(q._id)
                )
            }
            console.log("🚀 ~ handleReviewMarked ~ markedQuestions:", markedQuestions);

            // Find the index of the first incomplete question in the original questions array
            if (markedQuestions.questions.length > 0) {
                // Navigate to the first incomplete question
                setReviewSpecificQuestions(markedQuestions);
                setCurrentQuestionIndex(0);
                setExamStage('reviewQuestion');
            }
        } else {
            console.log("No marked questions found");
        }
    };

    const handleFinishReview = async () => {
        isAbleToAddTime.current = true;
        const isLastSection = selectedSectionId >= selectedExam.sections.length - 1;
        const alreadyRecorded = sectionsFinished.includes(selectedSectionId);
        if (!isLastSection) {
            if (!alreadyRecorded) {
                setSectionsFinished(prev => [...prev, selectedSectionId]);
                setAllReviewQuestions(prev => [...prev, reviewQuestions]);
            }
            setDisplayExamData(mockExamData1);
            setExamStage('sections');
            setSelectedSectionId(selectedSectionId + 1);
        } else {
            if (!alreadyRecorded && isFirstRun.current) {
                setAllReviewQuestions(prev => [...prev, reviewQuestions]);
                isFirstRun.current = false;
            }
            setExamStage('results');
        }
    };

    const snapshotKey = () => {
        const studentId = storeData?.viewProfileData?.id;
        if (!studentId || !examId) return null;
        return `pendingExamResult:${examId}:${studentId}`;
    };

    // Build the final submit payload from current state. `elapsedOverride` lets
    // callers supply a filled times array without waiting for setState.
    //
    // We merge the in-flight `reviewQuestions` (current section's working state)
    // into `allReviewQuestions[selectedSectionId]` so partial saves include
    // answers from the section the student is currently attempting — not just
    // already-finished sections.
    const buildPayload = (elapsedOverride, options = {}) => {
        const studentId = storeData?.viewProfileData?.id;
        if (!studentId || !examId || !selectedExam) return null;

        const elapsedTimes = elapsedOverride || allElapsedFormatted;
        const filledTimes = [...elapsedTimes];
        while (filledTimes.length < examSections) filledTimes.push('00:00');

        let mergedReviewQuestions = allReviewQuestions;
        const isMidSection = examStage === 'questions' || examStage === 'review' || examStage === 'reviewQuestion';
        const currentSectionReview = Array.isArray(reviewQuestions) ? reviewQuestions : null;
        if (
            isMidSection &&
            currentSectionReview &&
            currentSectionReview.length > 0 &&
            !sectionsFinished.includes(selectedSectionId)
        ) {
            mergedReviewQuestions = [...allReviewQuestions];
            mergedReviewQuestions[selectedSectionId] = currentSectionReview;
        }

        const results = examResultService.prepareExamResults(
            selectedExam,
            mergedReviewQuestions,
            allExamQuestions,
            filledTimes,
            distractionEvents,
            distractionStrikes
        );

        return examResultService.buildExamResultPayload(selectedExam, results, examId, studentId, options);
    };

    const writeSnapshot = (payload) => {
        const key = snapshotKey();
        if (!key || !payload) return;
        try {
            localStorage.setItem(key, JSON.stringify(payload));
        } catch (e) { }
    };

    const clearSnapshot = () => {
        const key = snapshotKey();
        if (!key) return;
        try { localStorage.removeItem(key); } catch (e) { }
    };

    const submitExamResults = async (elapsedOverride, options = {}) => {
        if (submittingResults || examResultsSubmitted) return;

        try {
            setSubmittingResults(true);

            const studentId = storeData?.viewProfileData?.id;
            if (!studentId || !examId) {
                console.error('Missing required data for exam submission:', { studentId, examId });
                return;
            }

            const payload = buildPayload(elapsedOverride, options);
            if (!payload) return;

            writeSnapshot(payload);

            await examResultService.submitExamResultPayload(payload);

            setExamResultsSubmitted(true);
            clearSnapshot();
            toast.success('تم حفظ نتائج الاختبار بنجاح');
        } catch (error) {
            console.error('Error submitting exam results:', error);
            toast.error('حدث خطأ في حفظ نتائج الاختبار.');
            setSubmissionFailed(true);
        } finally {
            setSubmittingResults(false);
        }
    };

    // Fire-and-forget save (used at section boundaries — backend upserts).
    const opportunisticSave = (options = {}) => {
        const payload = buildPayload(undefined, options);
        if (!payload) return;
        writeSnapshot(payload);
        examResultService.submitExamResultPayload(payload).catch(() => { });
    };

    // Manual retry function for failed submissions
    const retrySubmission = () => {
        setSubmissionFailed(false);
        setExamResultsSubmitted(false);
        submitExamResults();
    };

    const handleQuestionClick = (index) => {
        console.log("🚀 ~ handleQuestionClick ~ index:", index);
        setReviewSpecificQuestions(mockExamData2);
        setCurrentQuestionIndex(index);
        setExamStage('reviewQuestion');
    };

    const handleMarkQuestion = () => {
        const updatedQuestions = [...reviewQuestions];
        if (updatedQuestions[currentQuestionIndex]) {
            updatedQuestions[currentIndex].isMarked = !updatedQuestions[currentIndex].isMarked;
            console.log('Marking question', currentIndex);

            setReviewQuestions(updatedQuestions);
        }
    };

    const handleRetakeExam = () => {
        window.location.reload();
    }

    const handleSectionsReviewQuestionClick = async (sectionIndex, qId) => {
        console.log("🚀 ~ handleSectionsReviewQuestionClick ~ sectionIndex:", sectionIndex, qId);
        const fetchWithAsync = async () => {
            const questions = await fetchQuestionsByIds(selectedExam?.sections[sectionIndex].questions);
            console.log("🚀 ~ fetchWithAsync ~ questions:", questions);
            setReviewSpecificQuestionsAnswers({
                questions: questions
            });
            setCurrentQuestionIndex(qId);
            setSelectedSectionidForReview(sectionIndex);
        }
        await fetchWithAsync();
        setExamStage('reviewAnswers');
    }

    useEffect(() => {
        console.log("🚀 ~ ExamPage ~ selectedSectionidForReview:", selectedSectionidForReview);
    }, [selectedSectionidForReview])

    // Utility to pad or initialize allReviewQuestions to match examData
    function alignAllReviewQuestions(examData, allReviewQuestions) {
        if (!examData) return [];
        return examData.map((section, i) => {
            const sectionReviews = allReviewQuestions?.[i] || [];
            return section.questions.map((q, j) => sectionReviews[j] || {
                id: q._id,
                selectedAnswer: null,
                isMarked: false
            });
        });
    }

    // // Before using allReviewQuestions for results/review, always align:
    // useEffect(() => {
    //     if (selectedExam && allReviewQuestions) {
    //         setAllReviewQuestions(prev => alignAllReviewQuestions(selectedExam.sections, prev));
    //     }
    // }, [selectedExam, examStage]);

    // Submit eagerly when the exam reaches the results stage. We fill missing
    // section times with "00:00" rather than waiting — saving the result is
    // strictly more important than capturing exact timing data.
    useEffect(() => {
        if (examStage !== 'results' || examResultsSubmitted) return;
        if (!selectedExam || !allReviewQuestions || !allExamQuestions) return;

        const filledTimes = [...allElapsedFormatted];
        while (filledTimes.length < examSections) filledTimes.push('00:00');

        submitExamResults(filledTimes, { isCompleted: true });
    }, [examStage, examResultsSubmitted, selectedExam, allReviewQuestions, allExamQuestions, examSections]);

    // Continuous local snapshot — keeps the latest payload in localStorage so
    // it can be recovered after a crash, hard navigation, or tab close.
    // Marked isCompleted=false because mid-exam state isn't a finished attempt.
    // `reviewQuestions` is in the deps so per-answer changes update the snapshot;
    // localStorage writes are cheap and the keepalive beacon reads from here.
    useEffect(() => {
        if (!selectedExam || examStage === 'introduction' || examStage === 'sections') return;
        if (examResultsSubmitted) return;
        const isFinal = examStage === 'results';
        const payload = buildPayload(undefined, { isCompleted: isFinal });
        if (payload) writeSnapshot(payload);
    }, [allReviewQuestions, allExamQuestions, allElapsedFormatted, examStage, sectionsFinished, selectedSectionId, selectedExam, reviewQuestions, examResultsSubmitted]);

    // Per-section opportunistic save: fires after sectionsFinished updates
    // (so the closure has the latest allReviewQuestions). Skipped at the
    // results stage — the eager final-submit useEffect handles that path.
    const lastSavedSectionCountRef = useRef(0);
    useEffect(() => {
        if (!selectedExam || examStage === 'results') return;
        if (sectionsFinished.length === 0) return;
        if (sectionsFinished.length <= lastSavedSectionCountRef.current) return;
        lastSavedSectionCountRef.current = sectionsFinished.length;
        opportunisticSave({ isCompleted: false });
    }, [sectionsFinished, examStage, selectedExam, allReviewQuestions]);

    // Best-effort flush on tab close / navigation away / tab hide. Uses the
    // fetch keepalive flag so the request survives the page going away.
    useEffect(() => {
        if (!selectedExam) return;

        const flush = () => {
            if (examResultsSubmitted) return;
            const key = snapshotKey();
            if (!key) return;
            let payload = null;
            try {
                const raw = localStorage.getItem(key);
                if (raw) payload = JSON.parse(raw);
            } catch (e) { }
            if (!payload) payload = buildPayload();
            if (!payload) return;
            examResultService.submitExamResultPayloadKeepalive(payload);
        };

        const onVisibility = () => {
            if (typeof document !== 'undefined' && document.visibilityState === 'hidden') flush();
        };
        const onPageHide = () => flush();
        const onBeforeUnload = () => flush();

        window.addEventListener('beforeunload', onBeforeUnload);
        window.addEventListener('pagehide', onPageHide);
        document.addEventListener('visibilitychange', onVisibility);

        const handleRouteChange = () => flush();
        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
            window.removeEventListener('pagehide', onPageHide);
            document.removeEventListener('visibilitychange', onVisibility);
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [selectedExam, examResultsSubmitted, allReviewQuestions, allExamQuestions, allElapsedFormatted, examStage, examId, storeData?.viewProfileData?.id, router.events]);

    // Early returns AFTER all hooks are declared (required by React rules of hooks)
    if (!accessToken) {
        return <Spinner />;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spinner />
            </div>
        );
    }

    return (
        <div className={styles.examPageContainer}>
            {examStage === 'introduction' && (
                <ExamIntroduction
                    examData={displayExamData}
                    onStartExam={handleIntroductionBtn}
                />
            )}

            {examStage === 'sections' && (
                <ExamSections
                    examData={displayExamData}
                    onStartExam={handleSectionsBtn}
                />
            )}

            {examStage === 'questions' && (
                <ExamQuestions
                    formatTime={formatTime}
                    timeLeft={timeLeft}
                    CurrentExam={selectedExam}
                    examData={examQuestions}
                    onCompleteExam={handleCompleteExam}
                    currentTime={examTimer}
                    reviewQuestions={reviewQuestions}
                    setReviewQuestions={setReviewQuestions}
                    section={selectedExam.sections[selectedSectionId]}
                    cheatStrikes={distractionStrikes}
                    isCheating={isDistracted}
                />
            )}

            {examStage === 'review' && (
                <ReviewSection
                    timeLeft={timeLeft}
                    title={reviewSectionTexts.title}
                    examTitle={reviewSectionTexts.examTitle}
                    currentTime={reviewSectionTexts.currentTime}
                    instructionsTitle={reviewSectionTexts.instructionsTitle}
                    instructions={reviewSectionTexts.instructions}
                    sectionTitle={reviewSectionTexts.sectionTitle}
                    questions={reviewQuestions}
                    CurrentExam={selectedExam}
                    buttonLabels={reviewSectionTexts.buttonLabels}
                    questionLabel={reviewSectionTexts.questionLabel}
                    incompleteLabel={reviewSectionTexts.incompleteLabel}
                    completeLabel={reviewSectionTexts.completeLabel}
                    onReviewAll={handleReviewAll}
                    onReviewIncomplete={handleReviewIncomplete}
                    onReviewMarked={handleReviewMarked}
                    onFinishReview={handleFinishReview}
                    onQuestionClick={handleQuestionClick}
                    onMarkQuestion={handleMarkQuestion}
                    formatTime={formatTime}
                />
            )}

            {examStage === 'reviewQuestion' && (
                <ReviewQuestion
                    formatTime={formatTime}
                    timeLeft={timeLeft}
                    CurrentExam={selectedExam}
                    examData={reviewSpecificQuestions}
                    onCompleteExam={handleCompleteExam}
                    currentTime={examTimer}
                    reviewQuestions={reviewQuestions}
                    setReviewQuestions={setReviewQuestions}
                    currentQuestionIndex={currentQuestionIndex}
                    showReviewSection={() => { setExamStage('review'); }}
                    finishReview={handleFinishReview}
                    section={selectedExam.sections[selectedSectionId]}
                    cheatStrikes={distractionStrikes}
                    isCheating={isDistracted}
                />
            )}

            {examStage === 'results' && (
                <>
                    {/* Submission status feedback */}
                    {submittingResults && (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#fff3cd',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            textAlign: 'center',
                            direction: 'rtl'
                        }}>
                            <span>⏳ جاري حفظ نتائج الاختبار...</span>
                        </div>
                    )}
                    {submissionFailed && !submittingResults && (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#f8d7da',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            textAlign: 'center',
                            direction: 'rtl'
                        }}>
                            <span>❌ فشل في حفظ النتائج. </span>
                            <button
                                onClick={retrySubmission}
                                style={{
                                    backgroundColor: '#F26722',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginRight: '0.5rem'
                                }}
                            >
                                إعادة المحاولة
                            </button>
                        </div>
                    )}
                    {examResultsSubmitted && !submissionFailed && (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#d4edda',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            textAlign: 'center',
                            direction: 'rtl'
                        }}>
                            <span>✅ تم حفظ نتائج الاختبار بنجاح</span>
                        </div>
                    )}
                    <ExamResults
                        elapsedTime={allElapsedFormatted}
                        totalTime={selectedExam.duration + ":00" || "25:00"}
                        examData={allExamQuestions}
                        CurrentExam={selectedExam}
                        reviewQuestions={allReviewQuestions}
                        onReviewAnswers={() => setExamStage('sectionsReview')}
                        onRetakeExam={() => handleRetakeExam()}
                    />
                </>
            )}

            {examStage === 'sectionsReview' && (
                <ExamSectionsReview
                    examData={allExamQuestions}
                    elapsedTime={allElapsedFormatted}
                    reviewQuestions={allReviewQuestions}
                    examSections={selectedExam?.sections}
                    onRetakeExam={() => handleRetakeExam()}
                    onViewResults={() => setExamStage('results')}
                    handleQuestionClick={(i, q) => handleSectionsReviewQuestionClick(i, q)}
                />
            )}

            {examStage === 'reviewAnswers' && (
                <ReviewAnswers
                    examData={reviewSpecificQuestionsAnswers}
                    onCompleteExam={() => setExamStage('sectionsReview')}
                    currentTime={examTimer}
                    reviewQuestions={allReviewQuestions[selectedSectionidForReview || 0]}
                    setReviewQuestions={setReviewQuestions}
                    currentQuestionIndex={currentQuestionIndex}
                    showReviewSection={() => { setExamStage('sectionsReview') }}
                    showResults={() => { setExamStage('results') }}
                    finishReview={() => { }}
                    section={selectedExam.sections[selectedSectionidForReview]}
                />
            )}
        </div>
    );
};

export default ExamPage;