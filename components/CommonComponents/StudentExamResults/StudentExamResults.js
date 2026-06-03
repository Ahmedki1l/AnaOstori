import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from './StudentExamResults.module.scss'
import { examResultService } from '../../../services/examResultService'
import { getRouteAPI } from '../../../services/apisService'
import { getNewToken } from '../../../services/fireBaseAuthService';
import Spinner from '../spinner'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { fullDate } from '../../../constants/DateConverter'
import ExamResults from '../../ExamComponents/ExamResults'
import ReviewAnswers from '../../ExamComponents/ReviewAnswers'
import ExamSectionsReview from '../../ExamComponents/ExamSectionsReview'

const StudentExamResults = () => {
  const router = useRouter()
  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [selectedExam, setSelectedExam] = useState(null)
  const [selectedResult, setSelectedResult] = useState(null)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentView, setCurrentView] = useState('folders') // 'folders', 'exams', 'results', 'details', 'reviewSection', 'reviewAnswers'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [reviewQuestions, setReviewQuestions] = useState([])
  const [examData, setExamData] = useState([])
  const [totalTime, setTotalTime] = useState(0)
  const [fetchedQuestions, setFetchedQuestions] = useState([])
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
  // examId the student asked to retake; non-null shows the confirm dialog.
  const [retakeTarget, setRetakeTarget] = useState(null)

  useEffect(() => {
    fetchFolders()
  }, [])

  // Fetch questions when details or reviewAnswers view is active and questions are needed
  useEffect(() => {
    if ((currentView === 'details' || currentView === 'reviewAnswers') && selectedResult?.reviewQuestions?.length > 0 && fetchedQuestions.length === 0) {
      const questionIds = selectedResult.reviewQuestions.map(q => q.questionId)
      fetchQuestionsByIds(questionIds).then(questions => {
        setFetchedQuestions(questions)
      })
    }
  }, [currentView, selectedResult, fetchedQuestions.length])

  // Reset fetched questions when changing results
  useEffect(() => {
    setFetchedQuestions([])
  }, [selectedResult])

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

  const fetchFolders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await examResultService.getAllStudentExamResults()

      console.log('API Response:', response) // Debug log

      // The API returns data in response.data.data structure
      if (response?.data?.data && Array.isArray(response.data.data)) {
        console.log('Setting folders:', response.data.data) // Debug log
        setFolders(response.data.data)
      } else {
        console.warn('Invalid data structure received:', response)
        setFolders([])
        setError('بيانات غير صحيحة من الخادم')
      }
    } catch (error) {
      console.error('Error fetching exam results:', error)
      setError('فشل في جلب نتائج الاختبارات')
      setFolders([])
    } finally {
      setLoading(false)
    }
  }

  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder)
    setSelectedExam(null)
    setSelectedResult(null)
    setCurrentView('exams')
  }

  const handleExamSelect = (exam) => {
    setSelectedExam(exam)
    setSelectedResult(null)
    setCurrentView('results')
  }

  const handleResultSelect = (result) => {
    setSelectedResult(result)
    setCurrentView('details')
  }

  const goBackToFolders = () => {
    setSelectedFolder(null)
    setSelectedExam(null)
    setSelectedResult(null)
    setCurrentView('folders')
  }

  const goBackToExams = () => {
    setSelectedExam(null)
    setSelectedResult(null)
    setCurrentView('exams')
  }

  const goBackToResults = () => {
    setSelectedResult(null)
    setSelectedQuestion(null)
    setCurrentView('results')
  }

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question)
    setCurrentView('questionReview')
  }

  const goBackToDetails = () => {
    setSelectedQuestion(null)
    setCurrentView('details')
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
    // Navigate back to exam or show retake options
    setCurrentView('results')
  }

  // Retake flow: confirm first, then navigate to the exam runner, which starts
  // a fresh attempt (new attemptId) without overwriting previous results.
  const requestRetake = (examId) => {
    if (examId) setRetakeTarget(examId)
  }

  const cancelRetake = () => setRetakeTarget(null)

  const confirmRetake = () => {
    const examId = retakeTarget
    setRetakeTarget(null)
    if (examId) router.push(`/myCourse/exam?examId=${examId}`)
  }

  const renderRetakeModal = () => {
    if (!retakeTarget) return null
    return (
      <div className={styles.retakeOverlay} onClick={cancelRetake}>
        <div className={styles.retakeDialog} onClick={(e) => e.stopPropagation()}>
          <h3>إعادة الاختبار</h3>
          <p>سيتم بدء محاولة جديدة لهذا الاختبار، وستُحفظ نتيجتها بجانب محاولاتك السابقة. هل تريد المتابعة؟</p>
          <div className={styles.retakeDialogActions}>
            <button className={styles.retakeCancelButton} onClick={cancelRetake}>إلغاء</button>
            <button className={styles.retakeConfirmButton} onClick={confirmRetake}>بدء محاولة جديدة</button>
          </div>
        </div>
      </div>
    )
  }

  const handleFinishReview = () => {
    setCurrentView('details')
  }

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index)
    setCurrentView('reviewAnswers')
  }

  // Safety check - ensure we have valid data structure
  if (!loading && !error && (!Array.isArray(folders) || folders.length === 0)) {
    return (
      <div className={styles.emptyContainer}>
        <AllIconsComponenet iconName="examIcon" height={64} width={64} color="#d9d9d9" />
        <h3>لا توجد نتائج اختبارات</h3>
        <p>لم تقم بأداء أي اختبارات بعد</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner borderwidth={7} width={6} height={6} />
        <p>جاري تحميل نتائج الاختبارات...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AllIconsComponenet iconName="warningIcon" height={48} width={48} color="#ff4d4f" />
        <h3>حدث خطأ</h3>
        <p>{error}</p>
        <button onClick={fetchFolders} className={styles.retryButton}>
          إعادة المحاولة
        </button>
      </div>
    )
  }

  // Folders View
  if (currentView === 'folders') {
    // Safety check to ensure folders is an array
    if (!Array.isArray(folders)) {
      return (
        <div className={styles.errorContainer}>
          <AllIconsComponenet iconName="warningIcon" height={48} width={48} color="#ff4d4f" />
          <h3>خطأ في البيانات</h3>
          <p>بيانات غير صحيحة، يرجى إعادة المحاولة</p>
          <button onClick={fetchFolders} className={styles.retryButton}>
            إعادة المحاولة
          </button>
        </div>
      )
    }

    if (folders.length === 0) {
      return (
        <div className={styles.emptyContainer}>
          <AllIconsComponenet iconName="examIcon" height={64} width={64} color="#d9d9d9" />
          <h3>لا توجد نتائج اختبارات</h3>
          <p>لم تقم بأداء أي اختبارات بعد</p>
        </div>
      )
    }

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>نتائج الاختبارات</h1>
          <p>اختر المجلد لعرض الاختبارات والنتائج</p>
        </div>

        <div className={styles.foldersGrid}>
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={styles.folderCard}
              onClick={() => handleFolderSelect(folder)}
            >
              <div className={styles.folderIcon}>
                <AllIconsComponenet iconName="folderIcon" height={32} width={32} color="#3b82f6" />
              </div>
              <div className={styles.folderInfo}>
                <h3>{folder.name}</h3>
                <p>{folder.examCount} اختبار</p>
                <p className={styles.folderDescription}>{folder.description}</p>
              </div>
              <div className={styles.folderArrow}>
                <AllIconsComponenet iconName="arrowLeftIcon" height={20} width={20} color="#6b7280" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Exams View
  if (currentView === 'exams') {
    // Safety check to ensure selectedFolder and exams exist
    if (!selectedFolder || !Array.isArray(selectedFolder.exams)) {
      return (
        <div className={styles.errorContainer}>
          <AllIconsComponenet iconName="warningIcon" height={48} width={48} color="#ff4d4f" />
          <h3>خطأ في البيانات</h3>
          <p>بيانات الاختبارات غير متوفرة، يرجى العودة للمجلدات</p>
          <button onClick={goBackToFolders} className={styles.retryButton}>
            العودة للمجلدات
          </button>
        </div>
      )
    }

    return (
      <div className={styles.container}>
        {/* <div className={styles.topNavigation}>
          <button onClick={() => router.push('/myCourse')} className={styles.homeButton}>
            <AllIconsComponenet iconName="homeIcon" height={20} width={20} color="#F26722" />
            العودة لدوراتي
          </button>
        </div> */}
        <div className={styles.navigationHeader}>
          <button onClick={goBackToFolders} className={styles.backButton}>
            <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="white" />
            العودة للمجلدات
          </button>
          <h2>{selectedFolder.name}</h2>
        </div>

        <div className={styles.examsGrid}>
          {selectedFolder.exams.map((exam) => (
            <div
              key={exam.id}
              className={styles.examCard}
              onClick={() => handleExamSelect(exam)}
            >
              <div className={styles.examIcon}>
                <AllIconsComponenet iconName="examIcon" height={24} width={24} color="#8b5cf6" />
              </div>
              <div className={styles.examInfo}>
                <h3>{exam.name}</h3>
                <p>{exam.resultCount} نتيجة</p>
                <p className={styles.examDescription}>{exam.description}</p>
              </div>
              <div className={styles.examArrow}>
                <AllIconsComponenet iconName="arrowLeftIcon" height={20} width={20} color="#6b7280" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Results View
  if (currentView === 'results') {
    // Safety check to ensure selectedExam and results exist
    if (!selectedExam || !Array.isArray(selectedExam.results)) {
      return (
        <div className={styles.errorContainer}>
          <AllIconsComponenet iconName="warningIcon" height={48} width={48} color="#ff4d4f" />
          <h3>خطأ في البيانات</h3>
          <p>بيانات النتائج غير متوفرة، يرجى العودة للاختبارات</p>
          <button onClick={goBackToExams} className={styles.retryButton}>
            العودة للاختبارات
          </button>
        </div>
      )
    }

    return (
      <div className={styles.container}>
        {/* <div className={styles.topNavigation}>
          <button onClick={() => router.push('/myCourse')} className={styles.homeButton}>
            <AllIconsComponenet iconName="homeIcon" height={20} width={20} color="#F26722" />
            العودة لدوراتي
          </button>
        </div> */}
        <div className={styles.navigationHeader}>
          <button onClick={goBackToExams} className={styles.backButton}>
            <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="white" />
            العودة للاختبارات
          </button>
          <h2>{selectedExam.name}</h2>
        </div>

        <div className={styles.resultsGrid}>
          {selectedExam.results.map((result, index) => (
            <div key={result.id} className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <div className={styles.examInfo}>
                  <h3>
                    نتيجة الاختبار
                    <span className={styles.attemptBadge}>
                      المحاولة {result.attemptNumber || (selectedExam.results.length - index)}
                    </span>
                  </h3>
                  <p className={styles.examDate}>
                    تاريخ الاختبار: {fullDate(result.examDate)}
                  </p>
                </div>
                <div className={styles.scoreSection}>
                  <div className={styles.scoreCircle} style={{ borderColor: result.status === 'pass' ? '#52c41a' : '#ff4d4f' }}>
                    <span className={styles.scoreText}>{result.score}%</span>
                  </div>
                  <div className={styles.statusBadge} style={{ backgroundColor: result.status === 'pass' ? '#52c41a' : '#ff4d4f' }}>
                    {result.status === 'pass' ? 'ناجح' : 'راسب'}
                  </div>
                </div>
              </div>

              <div className={styles.resultDetails}>
                <div className={styles.detailRow}>
                  <span>إجمالي الأسئلة:</span>
                  <span>{result.totalQuestions}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>الإجابات الصحيحة:</span>
                  <span className={styles.correct}>{result.correctAnswers}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>الإجابات الخاطئة:</span>
                  <span className={styles.incorrect}>{result.wrongAnswers}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>الأسئلة غير المجاب عليها:</span>
                  <span className={styles.unanswered}>{result.unansweredQuestions}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>الوقت المستغرق:</span>
                  <span>{result.timeSpent}</span>
                </div>
              </div>

              <div className={styles.resultActions}>
                <button
                  className={styles.viewDetailsButton}
                  onClick={() => handleResultSelect(result)}
                >
                  عرض التفاصيل الكاملة
                </button>
                <button
                  className={styles.reviewButton}
                  onClick={() => {
                    setSelectedResult(result)
                    setCurrentView('reviewSection')
                  }}
                >
                  مراجعة الأسئلة
                </button>
                <button
                  className={styles.retakeButton}
                  onClick={() => requestRetake(selectedExam.id)}
                >
                  إعادة الاختبار
                </button>
              </div>
            </div>
          ))}
        </div>
        {renderRetakeModal()}
      </div>
    )
  }

  // Details View - Using ExamResults component
  if (currentView === 'details' && selectedResult) {
    // Check if we have new structure (sections with nested questions) or old structure (flat reviewQuestions)
    const hasNewStructure = selectedResult.sections &&
      selectedResult.sections.length > 0 &&
      selectedResult.sections[0].questions &&
      selectedResult.sections[0].questions.length > 0;

    // Prepare data for ExamResults component
    let reviewQuestions = [];

    if (hasNewStructure) {
      // Extract reviewQuestions from nested structure
      reviewQuestions = selectedResult.sections.flatMap(section =>
        section.questions.map(q => ({
          questionId: q.questionId,
          selectedAnswer: q.selectedAnswer,
          isCorrect: q.isCorrect,
          isMarked: q.isMarked,
          answered: q.answered,
          timeSpent: q.timeSpent
        }))
      );
    } else {
      // Use flat reviewQuestions (old structure)
      reviewQuestions = selectedResult.reviewQuestions || [];
    }

    const totalTime = selectedResult.totalTime?.toString() || "0";

    // Create elapsedTime array for each section
    // Try to get time from sections first (new structure), then fall back to sectionDetails
    let elapsedTime = [];
    if (hasNewStructure && selectedResult.sections) {
      elapsedTime = selectedResult.sections.map(section => section.time?.toString() || "0");
    } else if (selectedResult.sectionDetails) {
      elapsedTime = selectedResult.sectionDetails.map(section => section.time?.toString() || "0");
    } else {
      elapsedTime = ["0"];
    }

    // Use fetched questions if available, otherwise create mock data
    let examData = []
    if (fetchedQuestions.length > 0) {
      // Use real question data with skills from the questions themselves
      examData = fetchedQuestions.map((question, index) => {
        // Determine which section this question belongs to based on its position
        const sectionIndex = Math.floor(index / Math.ceil(fetchedQuestions.length / (selectedResult.sectionDetails?.length || selectedResult.sections?.length || 1)))
        const section = selectedResult.sectionDetails?.[sectionIndex] || selectedResult.sections?.[sectionIndex]

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
        const sectionIndex = Math.floor(index / Math.ceil(reviewQuestions.length / (selectedResult.sectionDetails?.length || selectedResult.sections?.length || 1)))
        const section = selectedResult.sectionDetails?.[sectionIndex] || selectedResult.sections?.[sectionIndex]

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
    let questionsCounter = 0;

    const mockCurrentExam = {
      ...selectedExam,
      sections: selectedResult.sectionDetails?.map((section, index) => {
        // Find questions that belong to this section based on their position in the reviewQuestions array
        const questionsPerSection = Math.ceil(reviewQuestions.length / selectedResult.sectionDetails.length)
        const totalSectionQuestions = section.numberOfQuestions;
        const startIndex = questionsCounter;
        // The endIndex is NOT included in the subarray returned by slice (slice is exclusive of endIndex)
        const endIndex = startIndex + totalSectionQuestions;
        questionsCounter += totalSectionQuestions;
        // Get the questions for this section (endIndex is exclusive)
        const sectionQuestions = examData.slice(startIndex, endIndex)

        return {
          title: section.title || `القسم ${index + 1}`,
          questions: sectionQuestions,
          score: section.score || 0,
          totalQuestions: section.numberOfQuestions || sectionQuestions.length,
          time: section.time || "00:00"
          // Skills are handled at the question level, not section level
        }
      }) || [{
        title: "القسم الأول",
        questions: examData,
        score: 0,
        totalQuestions: examData.length,
        time: "00:00"
        // Skills are handled at the question level, not section level
      }]
    }

    console.log("🚀 ~ Details View ~ mockCurrentExam:", mockCurrentExam)

    return (
      <div className={styles.resultsContainer}>
        {/* <div className={styles.topNavigation}>
          <button onClick={() => router.push('/myCourse')} className={styles.homeButton}>
            <AllIconsComponenet iconName="homeIcon" height={20} width={20} color="#F26722" />
            العودة لدوراتي
          </button>
        </div> */}
        <div className={styles.navigationHeader}>
          <button onClick={goBackToResults} className={styles.backButton}>
            <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="white" />
            العودة للنتائج
          </button>
          <h2>تفاصيل النتيجة</h2>
        </div>

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
              return {
                ...reviewQuestion,
                id: reviewQuestion.questionId
              } || {
                questionId: question._id || question.id,
                selectedAnswer: null,
                answered: false,
                isMarked: false
              }
            })
          )}
          onReviewAnswers={handleShowReviewSection}
          onRetakeExam={() => requestRetake(selectedExam?.id)}
          hideRetakeButton={false}
          savedSections={selectedResult.sections}
          savedSectionDetails={selectedResult.sectionDetails}
        />
        {renderRetakeModal()}
      </div>
    )
  }

  // Review Section View
  if (currentView === 'reviewSection' && selectedResult) {
    // Check if we have new structure with nested questions
    const hasNewStructure = selectedResult.sections &&
      selectedResult.sections.length > 0 &&
      selectedResult.sections[0].questions &&
      selectedResult.sections[0].questions.length > 0;

    let questions = [];

    if (hasNewStructure) {
      // Extract questions from nested structure
      questions = selectedResult.sections.flatMap(section => section.questions);
    } else {
      // Use flat reviewQuestions (old structure)
      questions = selectedResult.reviewQuestions || [];
    }

    let questionsCounter = 0;
    console.log("🚀 ~ Review Section ~ questions:", questions)
    console.log("🚀 ~ Review Section ~ fetchedQuestions:", fetchedQuestions)
    console.log("🚀 ~ Review Section ~ hasNewStructure:", hasNewStructure)
    console.log("🚀 ~ Review Section ~ selectedResult.sections:", selectedResult.sections)
    console.log("🚀 ~ Review Section ~ selectedResult.sectionDetails:", selectedResult.sectionDetails)

    // Use sections from new structure if available, otherwise use sectionDetails
    const sectionsToUse = hasNewStructure ? selectedResult.sections : selectedResult.sectionDetails;

    // Create examData structure for ExamSectionsReview
    const examData = sectionsToUse?.map((section, index) => {
      const totalSectionQuestions = section.numberOfQuestions || section.questions?.length || 0;
      const startIndex = questionsCounter;
      const endIndex = startIndex + totalSectionQuestions;

      // Get the questions for this section (endIndex is exclusive)
      questionsCounter += totalSectionQuestions;
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

    questionsCounter = 0;
    // Create reviewQuestions structure for ExamSectionsReview
    const reviewQuestions = sectionsToUse?.map((section, index) => {
      const totalSectionQuestions = section.numberOfQuestions || section.questions?.length || 0;
      const startIndex = questionsCounter;
      const endIndex = startIndex + totalSectionQuestions;

      // Get the questions for this section (endIndex is exclusive)
      const sectionQuestions = questions.slice(startIndex, endIndex)
      questionsCounter += totalSectionQuestions;

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
    const examSections = sectionsToUse?.map((section, index) => ({
      title: section.title || `القسم ${index + 1}`,
      // Add other section properties as needed
    })) || [{
      title: "القسم الأول"
    }]

    // Create elapsedTime array - use time from sections if available
    const elapsedTime = sectionsToUse?.map((section, index) => {
      // Use time from section, with fallback to default
      return section.time?.toString() || "00:05"
    }) || ["00:05"]

    console.log("🚀 ~ Review Section ~ examData:", examData)
    console.log("🚀 ~ Review Section ~ reviewQuestions:", reviewQuestions)

    const handleQuestionClick = (sectionIndex, questionIndex) => {
      // Calculate global question index by summing questions in previous sections
      let globalIndex = questionIndex;
      for (let i = 0; i < sectionIndex; i++) {
        const sectionQuestions = selectedResult.sectionDetails?.[i]?.numberOfQuestions ||
          selectedResult.sections?.[i]?.questions?.length || 0;
        globalIndex += sectionQuestions;
      }
      setCurrentView('reviewAnswers')
      setSelectedQuestion(globalIndex)
      setCurrentQuestionIndex(globalIndex) // Update the current question index for ReviewAnswers
    }

    const handleRetakeExam = () => {
      // Handle retake exam logic
      console.log('Retake exam clicked')
    }

    const handleViewResults = () => {
      // Handle view results logic
      setCurrentView('details')
    }

    return (
      <div className={styles.resultsContainer}>
        <div className={styles.navigationHeader}>
          <button onClick={goBackToDetails} className={styles.backButton}>
            <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="white" />
            العودة للتفاصيل
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
    )
  }

  // Review Answers View
  if (currentView === 'reviewAnswers' && selectedResult) {
    // Check if we have new structure with nested questions
    const hasNewStructure = selectedResult.sections &&
      selectedResult.sections.length > 0 &&
      selectedResult.sections[0].questions &&
      selectedResult.sections[0].questions.length > 0;

    let reviewQuestions = [];

    if (hasNewStructure) {
      // Extract questions from nested structure
      reviewQuestions = selectedResult.sections.flatMap(section => section.questions);
    } else {
      // Use flat reviewQuestions (old structure)
      reviewQuestions = selectedResult.reviewQuestions || [];
    }

    // Use sections from new structure if available, otherwise use sectionDetails
    const sectionsToUse = hasNewStructure ? selectedResult.sections : selectedResult.sectionDetails;

    // Create question structure with fetched data and proper section assignment
    const questionsWithData = reviewQuestions.map((reviewQuestion, index) => {
      const fetchedQuestion = fetchedQuestions.find(q => q._id === reviewQuestion.questionId)

      // Determine which section this question belongs to
      const sectionIndex = Math.floor(index / Math.ceil(reviewQuestions.length / (sectionsToUse?.length || 1)))
      const section = sectionsToUse?.[sectionIndex]

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

    const section = { title: selectedExam?.name || 'الاختبار' }

    if (isLoadingQuestions) {
      return (
        <div className={styles.resultsContainer}>
          {/* <div className={styles.topNavigation}>
            <button onClick={() => router.push('/myCourse')} className={styles.homeButton}>
              <AllIconsComponenet iconName="homeIcon" height={20} width={20} color="#F26722" />
              العودة لدوراتي
            </button>
          </div> */}
          <div className={styles.navigationHeader}>
            <button onClick={goBackToDetails} className={styles.backButton}>
              <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="white" />
              العودة للتفاصيل
            </button>
            <h2>مراجعة الأسئلة</h2>
          </div>
          <div className={styles.loadingContainer}>
            <Spinner />
            <p>جاري تحميل الأسئلة...</p>
          </div>
        </div>
      )
    }

    return (
      <div className={styles.resultsContainer}>
        {/* <div className={styles.topNavigation}>
          <button onClick={() => router.push('/myCourse')} className={styles.homeButton}>
            <AllIconsComponenet iconName="homeIcon" height={20} width={20} color="#F26722" />
            العودة لدوراتي
          </button>
        </div> */}
        <div className={styles.navigationHeader}>
          <button onClick={goBackToDetails} className={styles.backButton}>
            <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="white" />
            العودة للتفاصيل
          </button>
          <h2>مراجعة الأسئلة</h2>
        </div>

        <ReviewAnswers
          CurrentExam={selectedExam}
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
        />
      </div>
    )
  }

  // Question Review View
  if (currentView === 'questionReview' && selectedQuestion) {
    return (
      <div className={styles.resultsContainer}>
        {/* <div className={styles.topNavigation}>
          <button onClick={() => router.push('/myCourse')} className={styles.homeButton}>
            <AllIconsComponenet iconName="homeIcon" height={20} width={20} color="#F26722" />
            العودة لدوراتي
          </button>
        </div> */}
        <div className={styles.navigationHeader}>
          <button onClick={goBackToDetails} className={styles.backButton}>
            <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="white" />
            العودة للتفاصيل
          </button>
          <h2>مراجعة السؤال</h2>
        </div>

        <div className={styles.questionReviewContainer}>
          <div className={styles.questionHeader}>
            <div className={styles.questionStatus}>
              <span className={`${styles.statusBadge} ${selectedQuestion.isCorrect ? styles.correct : styles.incorrect}`}>
                {selectedQuestion.isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
              </span>
            </div>
          </div>

          <div className={styles.questionContent}>
            <h3>السؤال:</h3>
            <div className={styles.questionText}>
              {selectedQuestion.questionText || 'نص السؤال غير متوفر'}
            </div>

            {selectedQuestion.questionImage && (
              <div className={styles.questionImage}>
                <img src={selectedQuestion.questionImage} alt="صورة السؤال" />
              </div>
            )}
          </div>

          <div className={styles.answersSection}>
            <h3>الخيارات:</h3>
            <div className={styles.answersList}>
              {selectedQuestion.options && selectedQuestion.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={`${styles.answerOption} ${option.isCorrect ? styles.correctAnswer :
                    option.id === selectedQuestion.selectedAnswer ? styles.selectedAnswer :
                      styles.otherAnswer
                    }`}
                >
                  <div className={styles.answerContent}>
                    <span className={styles.optionLabel}>
                      {String.fromCharCode(65 + optionIndex)}. {/* A, B, C, D */}
                    </span>
                    <span className={styles.optionText}>
                      {option.text || option}
                    </span>
                  </div>
                  <div className={styles.answerIndicators}>
                    {option.isCorrect && (
                      <span className={styles.correctIndicator}>✓ الإجابة الصحيحة</span>
                    )}
                    {option.id === selectedQuestion.selectedAnswer && !option.isCorrect && (
                      <span className={styles.wrongIndicator}>✗ إجابتك</span>
                    )}
                    {option.id === selectedQuestion.selectedAnswer && option.isCorrect && (
                      <span className={styles.correctIndicator}>✓ إجابتك الصحيحة</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.explanationSection}>
            <h3>التفسير:</h3>
            <div className={styles.explanationText}>
              {selectedQuestion.explanation || 'لا يوجد تفسير متوفر لهذا السؤال'}
            </div>
          </div>

          <div className={styles.questionMetadata}>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>الوقت المستغرق:</span>
              <span className={styles.metadataValue}>
                {selectedQuestion.timeSpent || 'غير محدد'}
              </span>
            </div>
            {selectedQuestion.isMarked && (
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>الحالة:</span>
                <span className={styles.metadataValue}>
                  <span className={styles.markedBadge}>مُعلّم للمراجعة</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default StudentExamResults
