import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import styles from '../../styles/ExamPage.module.scss'; // Using styles from ExamResults
import { getRouteAPI } from '../../services/apisService'
import { getNewToken } from '../../services/fireBaseAuthService'
import ExamResults from '../ExamComponents/ExamResults'
import ReviewAnswers from '../ExamComponents/ReviewAnswers'
import ExamSectionsReview from '../ExamComponents/ExamSectionsReview'
import Spinner from '../CommonComponents/spinner'

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

    // Fetch questions when reviewAnswers view is active and questions are needed
    useEffect(() => {
        if (currentView === 'reviewAnswers' && examResult?.reviewQuestions?.length > 0 && fetchedQuestions.length === 0) {
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
        
        // Create elapsedTime array for each section
        const elapsedTime = examResult.sections?.map(() => examResult.timeSpent || "00:00") || []

        // Use fetched questions if available, otherwise create mock data
        let examData = []
        if (fetchedQuestions.length > 0) {
            // Use real question data with skills from the questions themselves
            examData = fetchedQuestions.map((question, index) => {
                // Determine which section this question belongs to based on its position
                const sectionIndex = Math.floor(index / Math.ceil(fetchedQuestions.length / (examResult.sections?.length || 1)))
                const section = examResult.sections?.[sectionIndex]
                
                return {
                    ...question,
                    section: section?.title || `القسم ${sectionIndex + 1}`,
                    lesson: question.lesson || `الدرس ${Math.floor(index / 5) + 1}`,
                    // Use skills from the question itself, not from section
                    skills: question.skills || [{ text: "مهارة أساسية" }]
                }
            })
        } else {
            // Create mock data structure with proper section assignment
            examData = reviewQuestions.map((reviewQuestion, index) => {
                // Determine which section this question belongs to based on its position
                const sectionIndex = Math.floor(index / Math.ceil(reviewQuestions.length / (examResult.sections?.length || 1)))
                const section = examResult.sections?.[sectionIndex]
                
                return {
                    _id: reviewQuestion.questionId,
                    id: reviewQuestion.questionId,
                    text: `السؤال ${index + 1}`,
                    correctAnswer: reviewQuestion.isCorrect ? reviewQuestion.selectedAnswer : "أ",
                    section: section?.title || `القسم ${sectionIndex + 1}`,
                    lesson: `الدرس ${Math.floor(index / 5) + 1}`,
                    skills: [{ text: "مهارة أساسية" }] // Default skill until questions are fetched
                }
            })
        }

        // Create CurrentExam with proper sections structure based on actual API data
        const mockCurrentExam = {
            ...examResult,
            sections: examResult.sections?.map((section, index) => {
                // Find questions that belong to this section based on their position in the reviewQuestions array
                const questionsPerSection = Math.ceil(reviewQuestions.length / examResult.sections.length)
                const startIndex = index * questionsPerSection
                const endIndex = Math.min((index + 1) * questionsPerSection, reviewQuestions.length)
                
                // Get the questions for this section
                const sectionQuestions = examData.slice(startIndex, endIndex)
                
                return {
                    title: section.title || `القسم ${index + 1}`,
                    questions: sectionQuestions,
                    score: section.score || 0,
                    totalQuestions: section.totalQuestions || sectionQuestions.length
                    // Skills are handled at the question level, not section level
                }
            }) || [{
                title: "القسم الأول",
                questions: examData,
                score: 0,
                totalQuestions: examData.length
                // Skills are handled at the question level, not section level
            }]
        }

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
                    <ExamResults
                        elapsedTime={elapsedTime}
                        totalTime={totalTime}
                        examData={mockCurrentExam.sections.map(section => section.questions)}
                        CurrentExam={mockCurrentExam}
                        reviewQuestions={mockCurrentExam.sections.map(section => 
                            section.questions.map(question => {
                                const reviewQuestion = reviewQuestions.find(rq => 
                                    rq.questionId === question._id || rq.questionId === question.id
                                )
                                return reviewQuestion || {
                                    questionId: question._id || question.id,
                                    selectedAnswer: null,
                                    answered: false,
                                    isMarked: false
                                }
                            })
                        )}
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
        
        // Create examData structure for ExamSectionsReview
        const examData = examResult.sections?.map((section, index) => {
            const questionsPerSection = Math.ceil(questions.length / examResult.sections.length)
            const startIndex = index * questionsPerSection
            const endIndex = Math.min((index + 1) * questionsPerSection, questions.length)
            
            // Get the questions for this section
            const sectionQuestions = questions.slice(startIndex, endIndex)
            
            return sectionQuestions.map((question, questionIndex) => {
                // Find the corresponding fetched question
                const fetchedQuestion = fetchedQuestions.find(fq => 
                    fq._id === question.questionId || fq.id === question.questionId
                )
                
                return {
                    ...fetchedQuestion,
                }
            })
        }) || [questions.map((question, index) => {
            const fetchedQuestion = fetchedQuestions.find(fq => 
                fq._id === question.questionId || fq.id === question.questionId
            )
            
            return {
                ...fetchedQuestion,
            }
        })]

        // Create reviewQuestions structure for ExamSectionsReview
        const reviewQuestions = examResult.sections?.map((section, index) => {
            const questionsPerSection = Math.ceil(questions.length / examResult.sections.length)
            const startIndex = index * questionsPerSection
            const endIndex = Math.min((index + 1) * questionsPerSection, questions.length)
            
            // Get the questions for this section
            const sectionQuestions = questions.slice(startIndex, endIndex)
            
            return sectionQuestions.map((question, questionIndex) => ({
                id: question.questionId || `q_${startIndex + questionIndex}`,
                selectedAnswer: question.selectedAnswer,
                isMarked: question.isMarked || false,
                answered: question.answered || false,
                isCorrect: question.isCorrect || false
            }))
        }) || [questions.map((question, index) => ({
            id: question.questionId || `q_${index}`,
            selectedAnswer: question.selectedAnswer,
            isMarked: question.isMarked || false,
            answered: question.answered || false,
            isCorrect: question.isCorrect || false
        }))]

        // Create examSections structure
        const examSections = examResult.sections?.map((section, index) => ({
            title: section.title || `القسم ${index + 1}`,
            // Add other section properties as needed
        })) || [{
            title: "القسم الأول"
        }]

        // Create elapsedTime array
        const elapsedTime = examResult.sections?.map((section, index) => {
            // Calculate time per section or use default
            return "00:05" // Default time, you can calculate this based on your data
        }) || ["00:05"]

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
                    <ExamSectionsReview
                        examData={examData}
                        elapsedTime={elapsedTime}
                        reviewQuestions={reviewQuestions}
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

        // Create question structure with fetched data and proper section assignment
        const questionsWithData = reviewQuestions.map((reviewQuestion, index) => {
            const fetchedQuestion = fetchedQuestions.find(q => q._id === reviewQuestion.questionId)
            
            // Determine which section this question belongs to
            const sectionIndex = Math.floor(index / Math.ceil(reviewQuestions.length / (examResult.sections?.length || 1)))
            const section = examResult.sections?.[sectionIndex]
            
            if (fetchedQuestion) {
                return {
                    ...fetchedQuestion,
                    // Ensure we have the correct structure for ReviewAnswers component
                    _id: fetchedQuestion._id,
                    id: fetchedQuestion._id, // ReviewAnswers expects both _id and id
                    section: section?.title || `القسم ${sectionIndex + 1}`,
                    // Use skills from the fetched question itself
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
                section: section?.title || `القسم ${sectionIndex + 1}`,
                skills: [{ text: "مهارة أساسية" }] // Default skill until question is fetched
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
