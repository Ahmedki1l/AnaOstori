import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import styles from './ModelForViewExamResults.module.scss';
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

    // Fetch questions when modal opens and we have examResult data
    useEffect(() => {
        if (isModelForViewExamResults && examResult?.reviewQuestions?.length > 0 && fetchedQuestions.length === 0) {
            const questionIds = examResult.reviewQuestions.map(q => q.questionId)
            fetchQuestionsByIds(questionIds).then(questions => {
                setFetchedQuestions(questions)
            })
        }
    }, [isModelForViewExamResults, examResult, fetchedQuestions.length])

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

    // Back button handlers for each view
    const handleBackToDetails = () => {
        setCurrentView('details')
    }

    const handleBackToReviewSection = () => {
        setCurrentView('reviewSection')
    }

    // Details View - Using ExamResults component
    if (currentView === 'details' && examResult) {
        // Prepare data for ExamResults component
        const reviewQuestions = examResult.reviewQuestions || []
        const totalTime = examResult.totalTime || 0

        // Create elapsedTime array for each section based on sectionDetails
        const elapsedTime = examResult.sectionDetails?.map(sectionDetail => sectionDetail.time) ||
            examResult.sections?.map(() => examResult.timeSpent || "00:00") || []

        // Use fetched questions if available, otherwise create mock data
        let examData = []
        if (fetchedQuestions.length > 0) {
            console.log("🚀 ~ Details View ~ fetchedQuestions:", fetchedQuestions)
            console.log("🚀 ~ Details View ~ fetchedQuestions[0]:", fetchedQuestions[0])
            // Use real question data with proper section assignment based on sectionDetails
            examData = fetchedQuestions.map((question, index) => {
                // Find which section this question belongs to based on sectionDetails
                let sectionIndex = 0
                let questionCount = 0

                // Determine section based on cumulative question count from sectionDetails
                for (let i = 0; i < examResult.sectionDetails?.length; i++) {
                    const sectionDetail = examResult.sectionDetails[i]
                    if (index < questionCount + sectionDetail.numberOfQuestions) {
                        sectionIndex = i
                        break
                    }
                    questionCount += sectionDetail.numberOfQuestions
                }

                const sectionDetail = examResult.sectionDetails?.[sectionIndex]
                // Get the corresponding section from the sections array to access skills
                const sectionWithSkills = examResult.sections?.[sectionIndex]

                // Find the corresponding review question to get the correct answer
                const reviewQuestion = reviewQuestions.find(rq => rq.questionId === question._id || rq.questionId === question.id)

                return {
                    ...question,
                    _id: question._id || question.id,
                    id: question._id || question.id, // Ensure both _id and id are set
                    section: sectionDetail?.title || `القسم ${sectionIndex + 1}`,
                    lesson: question.lesson || sectionDetail?.title || `الدرس ${sectionIndex + 1}`,
                    // Ensure we have the correct answer - use from fetched question or determine from review
                    correctAnswer: question.correctAnswer || question.answer || (reviewQuestion?.isCorrect ? reviewQuestion.selectedAnswer : "أ"),
                    // Use skills from the sections array, fallback to question skills, then default
                    skills: sectionWithSkills?.skills?.map(skill => ({ text: skill.title })) ||
                        question.skills ||
                        [{ text: "مهارة أساسية" }]
                }
            })
        } else {
            console.log("🚀 ~ Details View ~ reviewQuestions:", reviewQuestions)
            // Create mock data structure with proper section assignment based on sectionDetails
            examData = reviewQuestions.map((reviewQuestion, index) => {
                // Find which section this question belongs to based on sectionDetails
                let sectionIndex = 0
                let questionCount = 0

                // Determine section based on cumulative question count from sectionDetails
                for (let i = 0; i < examResult.sectionDetails?.length; i++) {
                    const sectionDetail = examResult.sectionDetails[i]
                    if (index < questionCount + sectionDetail.numberOfQuestions) {
                        sectionIndex = i
                        break
                    }
                    questionCount += sectionDetail.numberOfQuestions
                }

                const sectionDetail = examResult.sectionDetails?.[sectionIndex]
                // Get the corresponding section from the sections array to access skills
                const sectionWithSkills = examResult.sections?.[sectionIndex]

                return {
                    _id: reviewQuestion.questionId,
                    id: reviewQuestion.questionId,
                    text: `السؤال ${index + 1}`,
                    correctAnswer: reviewQuestion.isCorrect ? reviewQuestion.selectedAnswer : "أ",
                    section: sectionDetail?.title || `القسم ${sectionIndex + 1}`,
                    lesson: sectionDetail?.title || `الدرس ${sectionIndex + 1}`,
                    // Use skills from the sections array
                    skills: sectionWithSkills?.skills?.map(skill => ({ text: skill.title })) ||
                        [{ text: "مهارة أساسية" }]
                }
            })
        }

        console.log("🚀 ~ Details View ~ examData:", examData)
        console.log("🚀 ~ Details View ~ examResult.sections:", examResult.sections)
        console.log("🚀 ~ Details View ~ reviewQuestions:", reviewQuestions)

        // Show loading state if questions are being fetched
        if (isLoadingQuestions) {
            return (
                <Modal
                    title={`تفاصيل نتيجة الاختبار - ${examResult.studentName}`}
                    open={isModelForViewExamResults}
                    onCancel={handleCancel}
                    width="60vw"
                    footer={null}
                    style={{ top: 10 }}
                    bodyStyle={{ height: 'calc(100vh - 100px)', overflowY: 'auto' }}
                    className={styles.modalOverrides}
                >
                    <div className={styles.resultsContainer}>
                        <div className={styles.navigationHeader}>
                            <button onClick={handleCancel} className={styles.backButton}>
                                <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="white" />
                                العودة للنتائج
                            </button>
                            <h2>تفاصيل النتيجة</h2>
                        </div>
                        <div className={styles.loadingContainer}>
                            <Spinner />
                            <p>جاري تحميل الأسئلة...</p>
                        </div>
                    </div>
                </Modal>
            )
        }

        // Create CurrentExam with proper sections structure based on sectionDetails
        const mockCurrentExam = {
            ...examResult,
            sections: examResult.sectionDetails?.map((sectionDetail, index) => {
                // Find questions that belong to this section based on sectionDetails
                let startIndex = 0
                for (let i = 0; i < index; i++) {
                    startIndex += examResult.sectionDetails[i].numberOfQuestions
                }
                const endIndex = startIndex + sectionDetail.numberOfQuestions

                // Get the questions for this section
                const sectionQuestions = examData.slice(startIndex, endIndex)

                return {
                    title: sectionDetail.title || `القسم ${index + 1}`,
                    questions: sectionQuestions,
                    score: sectionDetail.score || 0,
                    totalQuestions: sectionDetail.numberOfQuestions || sectionQuestions.length
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
        console.log("🚀 ~ Details View ~ mockCurrentExam:", mockCurrentExam)

        // Create the final data structures for ExamResults
        const examDataForResults = mockCurrentExam.sections.map(section => section.questions)
        const reviewQuestionsForResults = mockCurrentExam.sections.map(section =>
            section.questions.map(question => {
                const reviewQuestion = reviewQuestions.find(rq =>
                    rq.questionId === question._id || rq.questionId === question.id
                )
                return {
                    id: question._id || question.id, // ExamResults expects 'id' field
                    questionId: question._id || question.id,
                    selectedAnswer: reviewQuestion?.selectedAnswer || null,
                    answered: reviewQuestion?.answered || false,
                    isMarked: reviewQuestion?.isMarked || false
                }
            })
        )

        console.log("🚀 ~ Details View ~ examDataForResults:", examDataForResults)
        console.log("🚀 ~ Details View ~ reviewQuestionsForResults:", reviewQuestionsForResults)
        console.log("🚀 ~ Details View ~ examDataForResults[0]:", examDataForResults[0])
        console.log("🚀 ~ Details View ~ reviewQuestionsForResults[0]:", reviewQuestionsForResults[0])

        return (
            <Modal
                title={`تفاصيل نتيجة الاختبار - ${examResult.studentName}`}
                open={isModelForViewExamResults}
                onCancel={handleCancel}
                width="60vw"
                footer={null}
                style={{ top: 10 }}
                bodyStyle={{ height: 'calc(100vh - 100px)', overflowY: 'auto' }}
                className={styles.modalOverrides}
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
                        examData={examDataForResults}
                        CurrentExam={mockCurrentExam}
                        reviewQuestions={reviewQuestionsForResults}
                        onReviewAnswers={handleShowReviewSection}
                        onRetakeExam={handleRetakeExam}
                        hideRetakeButton={true}
                        savedSections={examResult.sections}
                        savedSectionDetails={examResult.sectionDetails}
                    />
                </div>
            </Modal>
        )
    }

    // Review Section View
    if (currentView === 'reviewSection' && examResult) {
        const questions = examResult.reviewQuestions || []

        console.log("🚀 ~ Review Section ~ questions:", questions)
        console.log("🚀 ~ Review Section ~ fetchedQuestions:", fetchedQuestions)
        console.log("🚀 ~ Review Section ~ examResult.sections:", examResult.sections)

        // Create examData structure for ExamSectionsReview based on sectionDetails
        const examData = examResult.sectionDetails?.map((sectionDetail, index) => {
            // Find questions that belong to this section based on sectionDetails
            let startIndex = 0
            for (let i = 0; i < index; i++) {
                startIndex += examResult.sectionDetails[i].numberOfQuestions
            }
            const endIndex = startIndex + sectionDetail.numberOfQuestions

            // Get the questions for this section
            const sectionQuestions = questions.slice(startIndex, endIndex)

            return sectionQuestions.map((question, questionIndex) => {
                // Find the corresponding fetched question
                const fetchedQuestion = fetchedQuestions.find(fq =>
                    fq._id === question.questionId || fq.id === question.questionId
                )

                console.log(`🚀 ~ Section ${index} Question ${questionIndex} ~ question:`, question)
                console.log(`🚀 ~ Section ${index} Question ${questionIndex} ~ question keys:`, Object.keys(question))
                console.log(`🚀 ~ Section ${index} Question ${questionIndex} ~ fetchedQuestion:`, fetchedQuestion)
                console.log(`🚀 ~ Section ${index} Question ${questionIndex} ~ correctAnswer from fetched:`, fetchedQuestion?.correctAnswer)
                console.log(`🚀 ~ Section ${index} Question ${questionIndex} ~ correctAnswer from question:`, question.correctAnswer)
                console.log(`🚀 ~ Section ${index} Question ${questionIndex} ~ answer from question:`, question.answer)

                return {
                    ...fetchedQuestion,
                }
            })
        }) || [questions.map((question, index) => {
            const fetchedQuestion = fetchedQuestions.find(fq =>
                fq._id === question.questionId || fq.id === question.questionId
            )

            console.log(`🚀 ~ Fallback Question ${index} ~ question:`, question)
            console.log(`🚀 ~ Fallback Question ${index} ~ fetchedQuestion:`, fetchedQuestion)
            console.log(`🚀 ~ Fallback Question ${index} ~ correctAnswer:`, fetchedQuestion?.correctAnswer)

            return {
                ...fetchedQuestion,
            }
        })]

        // Create reviewQuestions structure for ExamSectionsReview based on sectionDetails
        const reviewQuestions = examResult.sectionDetails?.map((sectionDetail, index) => {
            // Find questions that belong to this section based on sectionDetails
            let startIndex = 0
            for (let i = 0; i < index; i++) {
                startIndex += examResult.sectionDetails[i].numberOfQuestions
            }
            const endIndex = startIndex + sectionDetail.numberOfQuestions

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

        // Create examSections structure based on sectionDetails
        const examSections = examResult.sectionDetails?.map((sectionDetail, index) => ({
            title: sectionDetail.title || `القسم ${index + 1}`,
            // Add other section properties as needed
        })) || [{
            title: "القسم الأول"
        }]

        // Create elapsedTime array based on sectionDetails
        const elapsedTime = examResult.sectionDetails?.map((sectionDetail, index) => {
            return sectionDetail.time || "00:05" // Use actual time from sectionDetails
        }) || ["00:05"]

        console.log("🚀 ~ Review Section ~ examData:", examData)
        console.log("🚀 ~ Review Section ~ reviewQuestions:", reviewQuestions)

        // Show loading state if questions are being fetched
        if (isLoadingQuestions) {
            return (
                <Modal
                    title={`مراجعة الأقسام - ${examResult.studentName}`}
                    open={isModelForViewExamResults}
                    onCancel={handleCancel}
                    width="85vw"
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
                        <div className={styles.loadingContainer}>
                            <Spinner />
                            <p>جاري تحميل الأسئلة...</p>
                        </div>
                    </div>
                </Modal>
            )
        }

        const handleQuestionClick = (sectionIndex, questionIndex) => {
            // Calculate global question index based on sectionDetails
            let globalIndex = 0
            for (let i = 0; i < sectionIndex; i++) {
                globalIndex += examResult.sectionDetails?.[i]?.numberOfQuestions || 0
            }
            globalIndex += questionIndex
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
                width="60vw"
                footer={null}
                style={{ top: 10 }}
                bodyStyle={{ height: 'calc(100vh - 100px)', overflowY: 'auto' }}
                className={styles.modalOverrides}
            >
                <div className={styles.resultsContainer}>
                    <div className={styles.navigationHeader}>
                        <button onClick={handleBackToDetails} className={styles.backButton}>
                            <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="white" />
                            العودة للنتائج
                        </button>
                        <h2>مراجعة الأقسام</h2>
                    </div>
                    <ExamSectionsReview
                        examData={examData}
                        elapsedTime={elapsedTime}
                        reviewQuestions={reviewQuestions}
                        examSections={examSections}
                        onRetakeExam={handleRetakeExam}
                        onViewResults={handleViewResults}
                        handleQuestionClick={handleQuestionClick}
                        canRetakeExam={false}
                    />
                </div>
            </Modal>
        )
    }

    // Review Answers View
    if (currentView === 'reviewAnswers' && examResult) {
        const reviewQuestions = examResult.reviewQuestions || []

        // Create question structure with fetched data and proper section assignment based on sectionDetails
        const questionsWithData = reviewQuestions.map((reviewQuestion, index) => {
            const fetchedQuestion = fetchedQuestions.find(q => q._id === reviewQuestion.questionId)

            // Find which section this question belongs to based on sectionDetails
            let sectionIndex = 0
            let questionCount = 0

            // Determine section based on cumulative question count from sectionDetails
            for (let i = 0; i < examResult.sectionDetails?.length; i++) {
                const sectionDetail = examResult.sectionDetails[i]
                if (index < questionCount + sectionDetail.numberOfQuestions) {
                    sectionIndex = i
                    break
                }
                questionCount += sectionDetail.numberOfQuestions
            }

            const sectionDetail = examResult.sectionDetails?.[sectionIndex]

            // Get the corresponding section from the sections array to access skills
            const sectionWithSkills = examResult.sections?.[sectionIndex]

            if (fetchedQuestion) {
                return {
                    ...fetchedQuestion,
                    // Ensure we have the correct structure for ReviewAnswers component
                    _id: fetchedQuestion._id,
                    id: fetchedQuestion._id, // ReviewAnswers expects both _id and id
                    section: sectionDetail?.title || `القسم ${sectionIndex + 1}`,
                    // Use skills from the sections array, fallback to question skills, then default
                    skills: sectionWithSkills?.skills?.map(skill => ({ text: skill.title })) ||
                        fetchedQuestion.skills ||
                        [{ text: "مهارة أساسية" }]
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
                section: sectionDetail?.title || `القسم ${sectionIndex + 1}`,
                // Use skills from the sections array
                skills: sectionWithSkills?.skills?.map(skill => ({ text: skill.title })) ||
                    [{ text: "مهارة أساسية" }]
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
                    width="90vw"
                    footer={null}
                    style={{ top: 5 }}
                    bodyStyle={{ height: 'calc(100vh - 80px)', overflowY: 'auto', padding: '20px' }}
                    className={styles.modalOverrides}
                >
                    <div className={styles.resultsContainer} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div className={styles.navigationHeader}>
                            <button onClick={handleBackToReviewSection} className={styles.backButton}>
                                <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="white" />
                                العودة للأقسام
                            </button>
                            <h2>مراجعة الأسئلة</h2>
                        </div>
                        <div className={styles.loadingContainer} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div>
                                <Spinner />
                                <p>جاري تحميل الأسئلة...</p>
                            </div>
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
                width="60vw"
                footer={null}
                style={{ top: 5 }}
                bodyStyle={{ height: 'calc(100vh - 80px)', overflowY: 'auto', padding: '20px' }}
                className={styles.modalOverrides}
            >
                <div className={styles.resultsContainer} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div className={styles.navigationHeader}>
                        <button onClick={handleBackToReviewSection} className={styles.backButton}>
                            <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="white" />
                            العودة للأقسام
                        </button>
                        <h2>مراجعة الأسئلة</h2>
                    </div>
                    <div style={{ flex: 1, height: '100%', overflow: 'auto' }}>
                        <ReviewAnswers
                            CurrentExam={examResult}
                            examData={{ questions: questionsWithData }}
                            onCompleteExam={() => { }}
                            currentTime="00:00"
                            reviewQuestions={reviewQuestionsForComponent}
                            setReviewQuestions={() => { }}
                            currentQuestionIndex={currentQuestionIndex}
                            showReviewSection={() => setCurrentView('reviewSection')}
                            finishReview={handleFinishReview}
                            showResults={handleShowResults}
                            section={section}
                            hideResultsButton={true}
                            hideRetakeButton={true}
                            className={styles.reviewAnswersContainer}
                        />
                    </div>
                </div>
            </Modal>
        )
    }

    return null
};

export default ModelForViewExamResults; 
