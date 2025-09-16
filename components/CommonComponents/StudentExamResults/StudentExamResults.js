import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from './StudentExamResults.module.scss'
import { examResultService } from '../../../services/examResultService'
import { getRouteAPI } from '../../../services/apisService'
import { getNewToken } from '../../../lib/metaData'
import Spinner from '../spinner'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { fullDate } from '../../../constants/DateConverter'
import ExamResults from '../../ExamComponents/ExamResults'
import ReviewAnswers from '../../ExamComponents/ReviewAnswers'
import ReviewSection from '../../ExamComponents/ReviewSection'

const StudentExamResults = () => {
  const router = useRouter()
  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [selectedExam, setSelectedExam] = useState(null)
  const [selectedResult, setSelectedResult] = useState(null)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentView, setCurrentView] = useState('folders') // 'folders', 'exams', 'results', 'details', 'questionReview', 'reviewSection', 'reviewAnswers'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [reviewQuestions, setReviewQuestions] = useState([])
  const [examData, setExamData] = useState([])
  const [elapsedTime, setElapsedTime] = useState([])
  const [totalTime, setTotalTime] = useState(0)
  const [fetchedQuestions, setFetchedQuestions] = useState([])
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)

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
          {selectedExam.results.map((result) => (
            <div key={result.id} className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <div className={styles.examInfo}>
                  <h3>نتيجة الاختبار</h3>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Details View - Using ExamResults component
  if (currentView === 'details' && selectedResult) {
    // Prepare data for ExamResults component
    const reviewQuestions = selectedResult.reviewQuestions || []
    const totalTime = selectedResult.totalTime || 0
    
    // Create elapsedTime array for each section
    const elapsedTime = selectedResult.sections?.map(() => selectedResult.timeSpent || "00:00") || []

    // Use fetched questions if available, otherwise create mock data
    let examData = []
    if (fetchedQuestions.length > 0) {
      // Use real question data with skills from the questions themselves
      examData = fetchedQuestions.map((question, index) => {
        // Determine which section this question belongs to based on its position
        const sectionIndex = Math.floor(index / Math.ceil(fetchedQuestions.length / (selectedResult.sections?.length || 1)))
        const section = selectedResult.sections?.[sectionIndex]
        
        return {
          ...question,
          section: section?.title || `القسم ${sectionIndex + 1}`,
          lesson: question.lesson || `الدرس ${Math.floor(index / 5) + 1}`,
          // Use skills from the question itself - let ExamResults component handle the processing
          skills: question.skills || [{ text: "مهارة أساسية" }]
        }
      })
    } else {
      // Create mock data structure with proper section assignment
      examData = reviewQuestions.map((reviewQuestion, index) => {
        // Determine which section this question belongs to based on its position
        const sectionIndex = Math.floor(index / Math.ceil(reviewQuestions.length / (selectedResult.sections?.length || 1)))
        const section = selectedResult.sections?.[sectionIndex]
        
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
      ...selectedExam,
      sections: selectedResult.sections?.map((section, index) => {
        // Find questions that belong to this section based on their position in the reviewQuestions array
        const questionsPerSection = Math.ceil(reviewQuestions.length / selectedResult.sections.length)
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
          reviewQuestions={[reviewQuestions]}
          onReviewAnswers={handleShowReviewSection}
          onRetakeExam={handleRetakeExam}
          hideRetakeButton={true}
        />
      </div>
    )
  }

  // Review Section View
  if (currentView === 'reviewSection' && selectedResult) {
    const questions = selectedResult.reviewQuestions || []
    const questionItems = questions.map((question, index) => ({
      id: index,
      answered: question.answered || false,
      isMarked: question.isMarked || false
    }))

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
          <h2>مراجعة الأقسام</h2>
        </div>

        <ReviewSection
          title="مراجعة الأسئلة"
          examTitle={selectedExam?.name || 'الاختبار'}
          currentTime="00:00"
          instructionsTitle="تعليمات المراجعة"
          instructions={{
            intro: ['يمكنك مراجعة جميع الأسئلة أو الأسئلة المميزة أو غير المكتملة'],
            list: [
              'انقر على أي سؤال للانتقال إليه مباشرة',
              'استخدم الأزرار أدناه لتصفية الأسئلة',
              'يمكنك العودة للنتائج في أي وقت'
            ],
            conclusion: 'تأكد من مراجعة جميع الأسئلة قبل إنهاء المراجعة'
          }}
          sectionTitle="أسئلة الاختبار"
          questions={questionItems}
          buttonLabels={{
            reviewMarked: 'مراجعة المميزة',
            reviewIncomplete: 'مراجعة غير المكتملة',
            reviewAll: 'مراجعة الكل',
            finishReview: 'إنهاء المراجعة',
            markQuestion: 'تمييز السؤال'
          }}
          questionLabel="سؤال"
          incompleteLabel="غير مكتمل"
          completeLabel="مكتمل"
          onReviewAll={() => setCurrentView('reviewAnswers')}
          onReviewIncomplete={() => setCurrentView('reviewAnswers')}
          onReviewMarked={() => setCurrentView('reviewAnswers')}
          onFinishReview={handleFinishReview}
          onQuestionClick={handleQuestionClick}
          onMarkQuestion={() => {}}
          formatTime={(time) => time}
          timeLeft={0}
          CurrentExam={selectedExam}
          hideMarkedButton={true}
          hideIncompleteButton={true}
        />
      </div>
    )
  }

  // Review Answers View
  if (currentView === 'reviewAnswers' && selectedResult) {
    const reviewQuestions = selectedResult.reviewQuestions || []

    // Create question structure with fetched data and proper section assignment
    const questionsWithData = reviewQuestions.map((reviewQuestion, index) => {
      const fetchedQuestion = fetchedQuestions.find(q => q._id === reviewQuestion.questionId)
      
      // Determine which section this question belongs to
      const sectionIndex = Math.floor(index / Math.ceil(reviewQuestions.length / (selectedResult.sections?.length || 1)))
      const section = selectedResult.sections?.[sectionIndex]
      
      if (fetchedQuestion) {
        return {
          ...fetchedQuestion,
          selectedAnswer: reviewQuestion.selectedAnswer,
          answered: reviewQuestion.answered,
          isMarked: reviewQuestion.isMarked,
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
        selectedAnswer: reviewQuestion.selectedAnswer,
        answered: reviewQuestion.answered,
        isMarked: reviewQuestion.isMarked,
        section: section?.title || `القسم ${sectionIndex + 1}`,
        skills: [{ text: "مهارة أساسية" }] // Default skill until question is fetched
      }
    })

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
          onCompleteExam={() => {}}
          currentTime="00:00"
          reviewQuestions={questionsWithData}
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
                  className={`${styles.answerOption} ${
                    option.isCorrect ? styles.correctAnswer : 
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
