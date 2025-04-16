import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Spinner from '../../../components/CommonComponents/spinner';
import { getAuthRouteAPI, getRouteAPI, postAuthRouteAPI } from '../../../services/apisService';
// import { getAuthRouteAPI } from '../../../services/apisService';
// import { getNewToken } from '../../../services/fireBaseAuthService';
import styles from '../../../styles/ExamPage.module.scss';
import ExamIntroduction from '../../../components/ExamComponents/ExamIntroduction';
import ExamSections from '../../../components/ExamComponents/ExamSections';
import ExamQuestions from '../../../components/ExamComponents/ExamQuestions';
import ReviewSection from '../../../components/ExamComponents/ReviewSection';
import ReviewQuestion from '../../../components/ExamComponents/ReviewQuestion';
import ExamResults from '../../../components/ExamComponents/ExamResults';
import ExamSectionsReview from '../../../components/ExamComponents/ExamSectionsReview';
import ReviewAnswers from '../../../components/ExamComponents/ReviewAnswers';

const ExamPage = () => {
    const router = useRouter();
    const { examId } = router.query;

    const [loading, setLoading] = useState(false);
    const [examData, setExamData] = useState(null);
    const [selectedExam, setSelectedExam] = useState();
    const [examQuestions, setExamQuestions] = useState();
    const [examStage, setExamStage] = useState('introduction');
    const [examTimer, setExamTimer] = useState('25:00');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionAnswers, setQuestionAnswers] = useState({});
    const [markedQuestions, setMarkedQuestions] = useState([]);

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
                id: 1,
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
                id: 2,
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
                id: 3,
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
                id: 4,
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

    const [displayExamData, setDisplayExamData] = useState(mockExamData);

    const initialReviewQuestions = mockExamData2.questions.map((question, index) => ({
        id: question._id,
        answered: false,
        isMarked: false,
        selectedAnswer: null
    }));
    console.log("🚀 ~ initialReviewQuestions ~ mockExamData2:", mockExamData2);
    console.log("🚀 ~ initialReviewQuestions ~ initialReviewQuestions:", initialReviewQuestions);

    const [reviewQuestions, setReviewQuestions] = useState(initialReviewQuestions);

    console.log("🚀 ~ ExamPage ~ reviewQuestions:", reviewQuestions);

    useEffect(() => {
        if (examId) {
            fetchQuestions();
        }
    }, [examId]);

    useEffect(() => {
        const initialReviewQuestions2 = mockExamData2.questions.map((question, index) => ({
            id: question._id,
            answered: false,
            isMarked: false,
            selectedAnswer: null
        }));

        setReviewQuestions(initialReviewQuestions2);

    }, [mockExamData2]);

    useEffect(() => {
        if (selectedExam) {
            setMockExamData({
                title: selectedExam.title || "عنوان الاختبار هنا",
                duration: (selectedExam.duration ? `${selectedExam.duration}:00` : "25:00"),
                subTitle: "تعليمات الاختبار",
                instructions:
                    selectedExam.instructions ||
                    "(هذا النص قابل للتعديل. هنا تكتب توضيح …)"
            });
            setMockExamData1({
                title: selectedExam.title || "عنوان الاختبار هنا",
                duration: (selectedExam.duration ? `${selectedExam.duration}:00` : "25:00"),
                subTitle: "القسم الأول",
                details: [
                    {
                        iconName: "questionIcon",
                        title: `عدد الأسئلة: ${selectedExam.questions.length || 5} سؤال`,
                    },
                    {
                        iconName: "clockIcon",
                        title: `مدة الاختبار: ${(selectedExam.duration ? `${selectedExam.duration}` : "25")} دقيقة`,
                    },
                ]
            })
            const fetchWithAsync = async () => {
                const questions = await fetchQuestionsByIds(selectedExam?.questions);
                setExamQuestions(questions);
                setMockExamData2({
                    questions: questions
                });
                setReviewSpecificQuestions({
                    questions: questions
                });
            }
            fetchWithAsync();
        }
    }, [selectedExam]);

    useEffect(() => {
        setDisplayExamData(mockExamData);
    }, [mockExamData]);

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
            limit: 10,
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

    // // Mock questions for review section
    // const mockReviewQuestions = [
    //     { id: 1, answered: false, isMarked: true },
    //     { id: 2, answered: true, isMarked: true },
    //     { id: 3, answered: false, isMarked: true },
    //     { id: 4, answered: false, isMarked: false },
    //     { id: 5, answered: false, isMarked: false },
    // ];



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
            ],
            conclusion: "يمكنك أيضًا النقر فوق رقم سؤال لربطه مباشرة بموقعه في الاختبار."
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


    const handleIntroductionBtn = () => {
        setDisplayExamData(mockExamData1);
        setExamStage('sections');
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

    const handleFinishReview = () => {
        setExamStage('results');
    };

    const handleQuestionClick = (index) => {
        console.log("🚀 ~ handleQuestionClick ~ index:", index);
        setCurrentQuestionIndex(index);
        setExamStage('reviewQuestion');
    };

    const handleMarkQuestion = () => {
        const updatedQuestions = [...reviewQuestions];
        if (updatedQuestions[currentQuestionIndex]) {
            updatedQuestions[currentQuestionIndex].isMarked = !updatedQuestions[currentQuestionIndex].isMarked;
            console.log('Marking question', currentQuestionIndex);

            setReviewQuestions(updatedQuestions);
        }
    };

    console.log("examQuestions: ", examQuestions);
    console.log("selectedExam: ", selectedExam);

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
                    CurrentExam={selectedExam}
                    examData={displayExamData}
                    onCompleteExam={handleCompleteExam}
                    currentTime={examTimer}
                    reviewQuestions={reviewQuestions}
                    setReviewQuestions={setReviewQuestions}
                />
            )}

            {examStage === 'review' && (
                <ReviewSection
                    title={reviewSectionTexts.title}
                    examTitle={reviewSectionTexts.examTitle}
                    currentTime={reviewSectionTexts.currentTime}
                    instructionsTitle={reviewSectionTexts.instructionsTitle}
                    instructions={reviewSectionTexts.instructions}
                    sectionTitle={reviewSectionTexts.sectionTitle}
                    questions={reviewQuestions}
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
                />
            )}

            {examStage === 'reviewQuestion' && (
                <ReviewQuestion
                    CurrentExam={selectedExam}
                    examData={reviewSpecificQuestions}
                    onCompleteExam={handleCompleteExam}
                    currentTime={examTimer}
                    reviewQuestions={reviewQuestions}
                    setReviewQuestions={setReviewQuestions}
                    currentQuestionIndex={currentQuestionIndex}
                    showReviewSection={() => { setExamStage('review'); }}
                    finishReview={() => { setExamStage('results'); }}
                />
            )}

            {examStage === 'results' && (
                <ExamResults
                    examData={examData}
                    onReviewAnswers={() => setExamStage('sectionsReview')}
                    onRetakeExam={() => setExamStage('introduction')}
                />
            )}

            {examStage === 'sectionsReview' && (
                <ExamSectionsReview
                    examData={examData}
                    onRetakeExam={() => setExamStage('introduction')}
                    onViewResults={() => setExamStage('review')}
                    handleQuestionClick={() => setExamStage('reviewAnswers')}
                />
            )}

            {examStage === 'reviewAnswers' && (
                <ReviewAnswers
                    examData={reviewSpecificQuestions}
                    onCompleteExam={handleCompleteExam}
                    currentTime={examTimer}
                    reviewQuestions={reviewQuestions}
                    setReviewQuestions={setReviewQuestions}
                    currentQuestionIndex={currentQuestionIndex}
                    showReviewSection={() => { }}
                    finishReview={() => { }}
                />
            )}
        </div>
    );
};

export default ExamPage;