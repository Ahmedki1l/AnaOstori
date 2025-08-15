import React, { useState, useEffect } from 'react'
import styles from './StudentExamResults.module.scss'
import { examResultService } from '../../../services/examResultService'
import Spinner from '../spinner'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { fullDate } from '../../../constants/DateConverter'

const StudentExamResults = () => {
  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [selectedExam, setSelectedExam] = useState(null)
  const [selectedResult, setSelectedResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentView, setCurrentView] = useState('folders') // 'folders', 'exams', 'results', 'details'

  useEffect(() => {
    fetchFolders()
  }, [])

  const fetchFolders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await examResultService.getAllStudentExamResults()
      
      console.log('API Response:', response) // Debug log
      
      if (response?.data && Array.isArray(response.data)) {
        console.log('Setting folders:', response.data) // Debug log
        setFolders(response.data)
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
    setCurrentView('results')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass':
        return '#52c41a'
      case 'fail':
        return '#ff4d4f'
      default:
        return '#faad14'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pass':
        return 'ناجح'
      case 'fail':
        return 'راسب'
      default:
        return 'غير محدد'
    }
  }

  const formatScore = (score) => {
    return `${score}%`
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
        <div className={styles.navigationHeader}>
          <button onClick={goBackToFolders} className={styles.backButton}>
            <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="#6b7280" />
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
        <div className={styles.navigationHeader}>
          <button onClick={goBackToExams} className={styles.backButton}>
            <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="#6b7280" />
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
                  <div className={styles.scoreCircle} style={{ borderColor: getStatusColor(result.status) }}>
                    <span className={styles.scoreText}>{formatScore(result.score)}</span>
                  </div>
                  <div className={styles.statusBadge} style={{ backgroundColor: getStatusColor(result.status) }}>
                    {getStatusText(result.status)}
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

              {result.sections && Array.isArray(result.sections) && result.sections.length > 0 && (
                <div className={styles.sectionsContainer}>
                  <h4>تفاصيل الأقسام</h4>
                  <div className={styles.sectionsList}>
                    {result.sections.map((section, index) => (
                      <div key={index} className={styles.sectionItem}>
                        <div className={styles.sectionHeader}>
                          <span className={styles.sectionTitle}>{section.title}</span>
                          <span className={styles.sectionScore}>
                            {section.score}/{section.totalQuestions}
                          </span>
                        </div>
                        {section.skills && Array.isArray(section.skills) && section.skills.length > 0 && (
                          <div className={styles.skillsList}>
                            {section.skills.map((skill, skillIndex) => (
                              <div key={skillIndex} className={styles.skillItem}>
                                <span>{skill.title}</span>
                                <span>{skill.correctAnswers}/{skill.numberOfQuestions}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.isTerminated && (
                <div className={styles.terminationWarning}>
                  <AllIconsComponenet iconName="warningIcon" height={16} width={16} color="#faad14" />
                  <span>تم إنهاء الاختبار: {result.terminationReason}</span>
                </div>
              )}

              <button 
                className={styles.viewDetailsButton}
                onClick={() => handleResultSelect(result)}
              >
                عرض التفاصيل الكاملة
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Details View (Modal)
  if (currentView === 'details' && selectedResult) {
    return (
      <div className={styles.container}>
        <div className={styles.navigationHeader}>
          <button onClick={goBackToResults} className={styles.backButton}>
            <AllIconsComponenet iconName="arrowRightIcon" height={16} width={16} color="#6b7280" />
            العودة للنتائج
          </button>
          <h2>تفاصيل النتيجة</h2>
        </div>

        <div className={styles.detailedResultContainer}>
          <div className={styles.detailedStats}>
            <h3>إحصائيات مفصلة</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>الدرجة النهائية</span>
                <span className={styles.statValue}>{formatScore(selectedResult.score)}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>الحالة</span>
                <span className={styles.statValue} style={{ color: getStatusColor(selectedResult.status) }}>
                  {getStatusText(selectedResult.status)}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>تاريخ الاختبار</span>
                <span className={styles.statValue}>{fullDate(selectedResult.examDate)}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>الوقت المستغرق</span>
                <span className={styles.statValue}>{selectedResult.timeSpent}</span>
              </div>
            </div>
          </div>

          {selectedResult.reviewQuestions && selectedResult.reviewQuestions.length > 0 && (
            <div className={styles.questionsReview}>
              <h3>مراجعة الأسئلة</h3>
              <div className={styles.questionsList}>
                {selectedResult.reviewQuestions.map((question, index) => (
                  <div key={index} className={styles.questionItem}>
                    <div className={styles.questionHeader}>
                      <span className={styles.questionNumber}>السؤال {index + 1}</span>
                      <span className={`${styles.questionStatus} ${question.isCorrect ? styles.correct : styles.incorrect}`}>
                        {question.isCorrect ? 'صحيح' : 'خاطئ'}
                      </span>
                    </div>
                    {question.isMarked && (
                      <span className={styles.markedBadge}>مُعلّم</span>
                    )}
                    {question.timeSpent && (
                      <span className={styles.timeSpent}>الوقت: {question.timeSpent}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

export default StudentExamResults
