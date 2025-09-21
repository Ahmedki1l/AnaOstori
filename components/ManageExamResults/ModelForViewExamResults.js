import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import styles from '../../styles/ExamPage.module.scss'; // Using styles from ExamResults
import { getRouteAPI } from '../../services/apisService'
import { getNewToken } from '../../services/fireBaseAuthService'
import ExamResults from '../ExamComponents/ExamResults'
import ReviewAnswers from '../ExamComponents/ReviewAnswers'
import ExamSectionsReview from '../ExamComponents/ExamSectionsReview'
import Spinner from '../CommonComponents/spinner'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'

const ModelForViewExamResults = ({
    isModelForViewExamResults,
    setIsModelForViewExamResults,
    examResult
}) => {
    const [currentView, setCurrentView] = useState('details') // 'details', 'reviewSection', 'reviewAnswers'
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [fetchedQuestions, setFetchedQuestions] = useState([])
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)

    const handleCancel = () => {
        setIsModelForViewExamResults(false);
        setCurrentView('details')
        setCurrentQuestionIndex(0)
        setFetchedQuestions([])
    };

    // Fetch questions when reviewAnswers or reviewSection view is active and questions are needed
    useEffect(() => {
        if ((currentView === 'reviewAnswers' || currentView === 'reviewSection') && examResult?.reviewQuestions?.length > 0 && fetchedQuestions.length === 0) {
            const questionIds = examResult.reviewQuestions.map(q => q.questionId)
            fetchQuestionsByIds(questionIds).then(questions => {
                setFetchedQuestions(questions)
            })
        }
    }, [currentView, examResult, fetchedQuestions.length])

    // Reset fetched questions when modal opens/closes
    useEffect(() => {
        if (isModelForViewExamResults) {
            setFetchedQuestions([])
        }
    }, [isModelForViewExamResults])

    // Function to fetch questions by their IDs
    const fetchQuestionsByIds = async (questionIds) => {
        if (!questionIds || questionIds.length === 0) return []
        
        setIsLoadingQuestions(true)
        const payload = {
            routeName: 'getItem',
            type: 'questions',
            page: 1,
            limit: questionIds.length,
            ids: questionIds
        }
        
        try {
            const response = await getRouteAPI(payload)
            if (response?.data) {
                return response.data.data
            }
        } catch (error) {
            if (error?.response?.status === 401) {
                await getNewToken()
                const response = await getRouteAPI(payload)
                if (response?.data) {
                    return response.data.data
                }
            } else {
                console.error('Error fetching questions:', error)
            }
        } finally {
            setIsLoadingQuestions(false)
        }
        return []
    }

    if (!examResult) {
        return null;
    }

    // Navigation handlers for exam components
    const handleShowReviewSection = () => {
        setCurrentView('reviewSection')
    }

    const handleShowReviewAnswers = () => {
        setCurrentView('reviewAnswers')
    }

    const handleShowResults = () => {
        setCurrentView('details')
    }

    const handleRetakeExam = () => {
        // Not applicable for instructor view
        console.log('Retake exam not applicable for instructor view')
    }

    const handleFinishReview = () => {
        setCurrentView('details')
    }

    const handleQuestionClick = (index) => {
        setCurrentQuestionIndex(index)
        setCurrentView('reviewAnswers')
    }

    // Details View - Using ExamResults component
    if (currentView === 'details' && examResult) {
        // Prepare data for ExamResults component
        const reviewQuestions = examResult.reviewQuestions || []
        const totalTime = examResult.totalTime || 0
        
        // Create elapsedTime array for each section based on sectionDetails
        const elapsedTime = examResult.sectionDetails?.map(section => section.time) || 
                           examResult.sections?.map(() => "00:00") || []

        // Create flattened examData array - ExamResults component handles section grouping internally
        const examData = reviewQuestions.map((reviewQuestion, index) => {
            const fetchedQuestion = fetchedQuestions.find(fq => 
                fq._id === reviewQuestion.questionId || fq.id === reviewQuestion.questionId
            )
            
            if (fetchedQuestion) {
                return {
                    ...fetchedQuestion,
                    section: fetchedQuestion.section || examResult.sections?.[0]?.title || "القسم الأول",
                    lesson: fetchedQuestion.lesson || examResult.sections?.[0]?.title || "الدرس الأول",
                    skills: fetchedQuestion.skills || [{ text: "مهارة أساسية" }]
                }
            } else {
                return {
                    _id: reviewQuestion.questionId,
                    id: reviewQuestion.questionId,
                    text: `السؤال ${index + 1}`,
                    correctAnswer: reviewQuestion.isCorrect ? reviewQuestion.selectedAnswer : "أ",
                    section: examResult.sections?.[0]?.title || "القسم الأول",
                    lesson: examResult.sections?.[0]?.title || "الدرس الأول",
                    skills: [{ text: "مهارة أساسية" }]
                }
            }
        })

        // Create CurrentExam with basic structure - ExamResults will handle the rest
        const mockCurrentExam = {
            ...examResult,
            sections: examResult.sections || [{ title: "القسم الأول" }]
        }

        // Create flattened reviewQuestions array
        const reviewQuestionsFlat = reviewQuestions.map(reviewQuestion => ({
            questionId: reviewQuestion.questionId,
            selectedAnswer: reviewQuestion.selectedAnswer,
            answered: reviewQuestion.answered,
            isMarked: reviewQuestion.isMarked
        }))

        return (
            <Modal
                title={`تفاصيل نتيجة الاختبار - ${examResult.studentName}`}
                open={isModelForViewExamResults}
                onCancel={handleCancel}
                width="95vw"
                footer={null}
                style={{ top: 10 }}
                bodyStyle={{ height: 'calc(100vh - 100px)', overflowY: 'auto' }}
            >
                <div className={styles.resultsContainer}>
                    <div className={styles.navigationHeader}>
                        <button onClick={handleCancel} className={styles.backButton}>
                            <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="white" />
                            العودة للنتائج
                        </button>
                        <h2>تفاصيل النتيجة</h2>
                    </div>
                    <ExamResults
                        elapsedTime={elapsedTime}
                        totalTime={totalTime}
                        examData={[examData]}
                        CurrentExam={mockCurrentExam}
                        reviewQuestions={[reviewQuestionsFlat]}
                        onReviewAnswers={handleShowReviewSection}
                        onRetakeExam={handleRetakeExam}
                        hideRetakeButton={true}
                    />
            </div>
            </Modal>
        )
    }

    // Review Section View
    if (currentView === 'reviewSection' && examResult) {
        const questions = examResult.reviewQuestions || []
        
        // Create flattened examData array - ExamSectionsReview component handles section grouping
        const examData = questions.map((reviewQuestion, index) => {
            const fetchedQuestion = fetchedQuestions.find(fq => 
                fq._id === reviewQuestion.questionId || fq.id === reviewQuestion.questionId
            )
            
            if (fetchedQuestion) {
                return {
                    ...fetchedQuestion,
                    _id: fetchedQuestion._id,
                    id: fetchedQuestion._id
                }
            } else {
                return {
                    _id: reviewQuestion.questionId,
                    id: reviewQuestion.questionId,
                    text: `السؤال ${index + 1}`,
                    correctAnswer: "أ"
                }
            }
        })

        // Create flattened reviewQuestions array
        const reviewQuestionsFlat = questions.map(reviewQuestion => ({
            id: reviewQuestion.questionId,
            selectedAnswer: reviewQuestion.selectedAnswer,
            isMarked: reviewQuestion.isMarked || false,
            answered: reviewQuestion.answered || false,
            isCorrect: reviewQuestion.isCorrect || false
        }))

        // Create examSections structure
        const examSections = examResult.sections?.map((section, index) => ({
            title: section.title || `القسم ${index + 1}`
        })) || [{ title: "القسم الأول" }]

        // Create elapsedTime array based on sectionDetails
        const elapsedTime = examResult.sectionDetails?.map(section => section.time) || 
                           examResult.sections?.map(() => "00:05") || ["00:05"]

        const handleQuestionClick = (sectionIndex, questionIndex) => {
            // Calculate global question index
            const questionsPerSection = Math.ceil(questions.length / (examResult.sections?.length || 1))
            const globalIndex = sectionIndex * questionsPerSection + questionIndex
            setCurrentView('reviewAnswers')
            setCurrentQuestionIndex(globalIndex)
        }

        const handleRetakeExam = () => {
            // Not applicable for instructor view
            console.log('Retake exam not applicable for instructor view')
        }

        const handleViewResults = () => {
            // Handle view results logic
            setCurrentView('details')
        }

    return (
        <Modal
                title={`مراجعة الأقسام - ${examResult.studentName}`}
            open={isModelForViewExamResults}
            onCancel={handleCancel}
                width="95vw"
                footer={null}
                style={{ top: 10 }}
                bodyStyle={{ height: 'calc(100vh - 100px)', overflowY: 'auto' }}
        >
            <div className={styles.resultsContainer}>
                    <div className={styles.navigationHeader}>
                        <button onClick={handleCancel} className={styles.backButton}>
                            <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="white" />
                            العودة للنتائج
                        </button>
                        <h2>مراجعة الأقسام</h2>
                    </div>
                    <ExamSectionsReview
                        examData={[examData]}
                        elapsedTime={elapsedTime}
                        reviewQuestions={[reviewQuestionsFlat]}
                        examSections={examSections}
                        onRetakeExam={handleRetakeExam}
                        onViewResults={handleViewResults}
                        handleQuestionClick={handleQuestionClick}
                    />
                </div>
            </Modal>
        )
    }

    // Review Answers View
    if (currentView === 'reviewAnswers' && examResult) {
        const reviewQuestions = examResult.reviewQuestions || []

        // Create question structure with fetched data - ReviewAnswers component handles the rest
        const questionsWithData = reviewQuestions.map((reviewQuestion, index) => {
            const fetchedQuestion = fetchedQuestions.find(q => q._id === reviewQuestion.questionId)
            
            if (fetchedQuestion) {
                return {
                    ...fetchedQuestion,
                    _id: fetchedQuestion._id,
                    id: fetchedQuestion._id,
                    section: fetchedQuestion.section || examResult.sections?.[0]?.title || "القسم الأول",
                    lesson: fetchedQuestion.lesson || examResult.sections?.[0]?.title || "الدرس الأول",
                    skills: fetchedQuestion.skills || [{ text: "مهارة أساسية" }]
                }
            }
            
            // Fallback if question not found
            return {
                _id: reviewQuestion.questionId,
                id: reviewQuestion.questionId,
                text: `السؤال ${index + 1} - جاري التحميل...`,
                type: "multipleChoice",
                options: [
                    { id: "أ", text: "الخيار أ" },
                    { id: "ب", text: "الخيار ب" },
                    { id: "ج", text: "الخيار ج" },
                    { id: "د", text: "الخيار د" }
                ],
                correctAnswer: "أ",
                section: examResult.sections?.[0]?.title || "القسم الأول",
                lesson: examResult.sections?.[0]?.title || "الدرس الأول",
                skills: [{ text: "مهارة أساسية" }]
            }
        })

        // Create separate reviewQuestions array for ReviewAnswers component
        const reviewQuestionsForComponent = reviewQuestions.map((reviewQuestion, index) => ({
            id: reviewQuestion.questionId,
            selectedAnswer: reviewQuestion.selectedAnswer,
            answered: reviewQuestion.answered,
            isMarked: reviewQuestion.isMarked
        }))

        const section = { title: examResult.examName || 'الاختبار' }

        if (isLoadingQuestions) {
            return (
                <Modal
                    title={`مراجعة الأسئلة - ${examResult.studentName}`}
                    open={isModelForViewExamResults}
                    onCancel={handleCancel}
                    width="95vw"
                    footer={null}
                    style={{ top: 10 }}
                    bodyStyle={{ height: 'calc(100vh - 100px)', overflowY: 'auto' }}
                >
                    <div className={styles.resultsContainer}>
                        <div className={styles.navigationHeader}>
                            <button onClick={handleCancel} className={styles.backButton}>
                                <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="white" />
                                العودة للنتائج
                            </button>
                            <h2>مراجعة الأسئلة</h2>
                        </div>
                        <div className={styles.loadingContainer}>
                            <Spinner />
                            <p>جاري تحميل الأسئلة...</p>
                        </div>
                    </div>
                </Modal>
            )
        }

        return (
            <Modal
                title={`مراجعة الأسئلة - ${examResult.studentName}`}
                open={isModelForViewExamResults}
                onCancel={handleCancel}
                width="95vw"
                footer={null}
                style={{ top: 10 }}
                bodyStyle={{ height: 'calc(100vh - 100px)', overflowY: 'auto' }}
            >
                <div className={styles.resultsContainer}>
                    <div className={styles.navigationHeader}>
                        <button onClick={handleCancel} className={styles.backButton}>
                            <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="white" />
                            العودة للنتائج
                        </button>
                        <h2>مراجعة الأسئلة</h2>
                            </div>
                    <ReviewAnswers
                        CurrentExam={examResult}
                        examData={{ questions: questionsWithData }}
                        onCompleteExam={() => {}}
                        currentTime="00:00"
                        reviewQuestions={reviewQuestionsForComponent}
                        setReviewQuestions={() => {}}
                        currentQuestionIndex={currentQuestionIndex}
                        showReviewSection={() => setCurrentView('reviewSection')}
                        finishReview={handleFinishReview}
                        showResults={handleShowResults}
                        section={section}
                        hideResultsButton={true}
                        hideRetakeButton={true}
                    />
                </div>
            </Modal>
        )
    }

    return null
};

export default ModelForViewExamResults; 
