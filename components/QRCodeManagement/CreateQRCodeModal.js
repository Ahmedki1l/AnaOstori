import React, { useState, useEffect } from 'react'
import { getAuthRouteAPI, getNewToken } from '../../services/apisService'
import { toast } from 'react-toastify'
import styles from './CreateQRCodeModal.module.scss'

export default function CreateQRCodeModal({ onSave, onClose }) {
    const [activeTab, setActiveTab] = useState('manual') // 'manual' or 'course'
    
    // Manual entry fields
    const [bookName, setBookName] = useState('')
    const [url, setUrl] = useState('')
    
    // Course selection fields
    const [selectedCourse, setSelectedCourse] = useState('')
    const [selectedCourseMeta, setSelectedCourseMeta] = useState(null)
    const [courses, setCourses] = useState([])
    const [loadingCourses, setLoadingCourses] = useState(false)
    const [lessons, setLessons] = useState([])
    const [selectedLesson, setSelectedLesson] = useState('')
    const [loadingLessons, setLoadingLessons] = useState(false)
    
    // Loading state
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (activeTab === 'course') {
            fetchCourses()
        }
    }, [activeTab])

    const fetchCourses = async () => {
        setLoadingCourses(true)
        try {
            const response = await getAuthRouteAPI({ routeName: 'categories' })
            const categories = response.data || []
            
            // Flatten courses from all categories
            const allCourses = categories.flatMap(category => 
                (category.courses || []).map(course => ({
                    id: course.id,
                    name: course.name,
                    categoryName: category.name,
                    type: course.type,
                }))
            )
            
            setCourses(allCourses)
        } catch (error) {
            console.error('Error fetching courses:', error)
            if (error?.response?.status === 401) {
                try {
                    await getNewToken()
                    const response = await getAuthRouteAPI({ routeName: 'categories' })
                    const categories = response.data || []
                    const allCourses = categories.flatMap(category => 
                        (category.courses || []).map(course => ({
                            id: course.id,
                            name: course.name,
                            categoryName: category.name,
                            type: course.type,
                        }))
                    )
                    setCourses(allCourses)
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError)
                    toast.error('فشل في تحميل الدورات', { rtl: true })
                }
            } else {
                toast.error('فشل في تحميل الدورات', { rtl: true })
            }
        } finally {
            setLoadingCourses(false)
        }
    }

    const resetLessonState = () => {
        setLessons([])
        setSelectedLesson('')
    }

    const fetchLessonsForCourse = async (course) => {
        if (!course || course.type !== 'on-demand') {
            resetLessonState()
            return
        }

        setLoadingLessons(true)
        setErrors(prev => ({ ...prev, lesson: undefined }))

        const payload = {
            routeName: 'getCourseCurriculum',
            courseId: course.id,
        }

        const request = async () => {
            const response = await getAuthRouteAPI(payload)
            const curriculum = response?.data
            const sectionItems = (curriculum?.sections || [])
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .flatMap((section) => {
                    const items = (section.items || [])
                        .sort((a, b) => (a.sectionItem?.order || 0) - (b.sectionItem?.order || 0))
                        .map((item) => ({
                            id: item.id,
                            name: item.name,
                            sectionName: section.name,
                        }))
                    return items
                })
            setLessons(sectionItems)
        }

        try {
            await request()
        } catch (error) {
            console.error('Error fetching lessons for course:', error)
            if (error?.response?.status === 401) {
                try {
                    await getNewToken()
                    await request()
                } catch (refreshError) {
                    console.error('Token refresh failed while fetching lessons:', refreshError)
                    setErrors(prev => ({
                        ...prev,
                        lesson: 'فشل في تحميل الدروس. يرجى المحاولة مرة أخرى.',
                    }))
                }
            } else {
                setErrors(prev => ({
                    ...prev,
                    lesson: 'فشل في تحميل الدروس. يرجى المحاولة مرة أخرى.',
                }))
            }
        } finally {
            setLoadingLessons(false)
        }
    }

    const validateUrl = (urlString) => {
        try {
            new URL(urlString)
            return true
        } catch (_) {
            return false
        }
    }

    const handleSubmit = async () => {
        setErrors({})
        
        let finalBookName = ''
        let finalUrl = ''

        if (activeTab === 'manual') {
            // Validate manual entry
            if (!bookName.trim()) {
                setErrors({ bookName: 'اسم الكتاب مطلوب' })
                return
            }
            if (!url.trim()) {
                setErrors({ url: 'الرابط مطلوب' })
                return
            }
            if (!validateUrl(url)) {
                setErrors({ url: 'الرابط غير صحيح' })
                return
            }
            
            finalBookName = bookName.trim()
            finalUrl = url.trim()
        } else {
            // Validate course selection
            if (!selectedCourse) {
                setErrors({ course: 'اختر دورة' })
                return
            }
            
            const course = courses.find(c => c.id === selectedCourse)
            if (!course) {
                setErrors({ course: 'الدورة غير موجودة' })
                return
            }

            if (course.type === 'on-demand') {
                if (!selectedLesson) {
                    setErrors({ lesson: 'اختر درساً من الدورة' })
                    return
                }
            }
            
            // Build URL from category and course name with proper encoding
            if (course.type === 'on-demand' && selectedLesson) {
                finalUrl = `${window.location.origin}/myCourse?courseId=${encodeURIComponent(course.id)}&itemId=${encodeURIComponent(selectedLesson)}`
            } else {
                const courseUrlName = course.name.replace(/ /g, '-')
                const categoryUrlName = course.categoryName.replace(/ /g, '-')
                finalUrl = `${window.location.origin}/${encodeURIComponent(courseUrlName)}/${encodeURIComponent(categoryUrlName)}`
            }
            finalBookName = course.name
        }

        setLoading(true)
        try {
            await onSave(finalBookName, finalUrl)
            onClose()
        } catch (error) {
            console.error('Error creating QR code:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        setErrors({})
        // Clear form fields when switching tabs
        if (tab === 'manual') {
            setSelectedCourse('')
            setSelectedCourseMeta(null)
            resetLessonState()
        } else {
            setBookName('')
            setUrl('')
        }
    }

    const handleCourseChange = async (courseId) => {
        setSelectedCourse(courseId)
        setErrors(prev => ({ ...prev, course: undefined }))
        setSelectedLesson('')

        const course = courses.find(c => c.id === courseId) || null
        setSelectedCourseMeta(course || null)

        if (course?.type === 'on-demand') {
            await fetchLessonsForCourse(course)
        } else {
            resetLessonState()
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose} dir="rtl">
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose}>✕</button>
                <h2 className={styles.title}>إنشاء رمز QR جديد</h2>

                {/* Tab Switcher */}
                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tab} ${activeTab === 'manual' ? styles.activeTab : ''}`}
                        onClick={() => handleTabChange('manual')}
                        disabled={loading}
                    >
                        إدخال يدوي
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'course' ? styles.activeTab : ''}`}
                        onClick={() => handleTabChange('course')}
                        disabled={loading}
                    >
                        اختيار دورة
                    </button>
                </div>

                {/* Manual Entry Tab */}
                {activeTab === 'manual' && (
                    <div className={styles.formContainer}>
                        <div className={styles.formGroup}>
                            <label>اسم الكتاب / المادة:</label>
                            <input
                                type="text"
                                value={bookName}
                                onChange={(e) => setBookName(e.target.value)}
                                placeholder="أدخل اسم الكتاب أو المادة"
                                disabled={loading}
                            />
                            {errors.bookName && <span className={styles.error}>{errors.bookName}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>الرابط:</label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                                disabled={loading}
                            />
                            {errors.url && <span className={styles.error}>{errors.url}</span>}
                        </div>
                    </div>
                )}

                {/* Course Selection Tab */}
                {activeTab === 'course' && (
                    <div className={styles.formContainer}>
                        <div className={styles.formGroup}>
                            <label>اختر دورة:</label>
                            {loadingCourses ? (
                                <div className={styles.loadingText}>جاري تحميل الدورات...</div>
                            ) : (
                                <>
                                    <select
                                        value={selectedCourse}
                                        onChange={(e) => handleCourseChange(e.target.value)}
                                        disabled={loading || loadingCourses}
                                    >
                                        <option value="">— اختر دورة —</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.name}{course.type === 'on-demand' ? ' (مسجلة)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.course && <span className={styles.error}>{errors.course}</span>}
                                    {selectedCourseMeta?.type === 'on-demand' && (
                                        <div className={styles.formGroup}>
                                            <label>اختر درساً:</label>
                                            {loadingLessons ? (
                                                <div className={styles.loadingText}>جاري تحميل الدروس...</div>
                                            ) : (
                                                <select
                                                    value={selectedLesson}
                                                    onChange={(e) => setSelectedLesson(e.target.value)}
                                                    disabled={loading || loadingLessons}
                                                >
                                                    <option value="">— اختر درساً —</option>
                                                    {lessons.map((lesson) => (
                                                        <option key={lesson.id} value={lesson.id}>
                                                            {lesson.sectionName ? `${lesson.sectionName} - ${lesson.name}` : lesson.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                            {errors.lesson && <span className={styles.error}>{errors.lesson}</span>}
                                            {!loadingLessons && selectedCourse && lessons.length === 0 && (
                                                <p className={styles.helperText}>لم يتم العثور على دروس لهذه الدورة.</p>
                                            )}
                                        </div>
                                    )}
                                    {selectedCourse && (
                                        <div className={styles.coursePreview}>
                                            <p className={styles.previewLabel}>الرابط المُنشأ:</p>
                                            <p className={styles.previewUrl}>
                                                {(() => {
                                                    const course = courses.find(c => c.id === selectedCourse)
                                                    if (!course) return ''
                                                    if (course.type === 'on-demand' && selectedLesson) {
                                                        return `${window.location.origin}/myCourse?courseId=${encodeURIComponent(course.id)}&itemId=${encodeURIComponent(selectedLesson)}`
                                                    }
                                                    const courseName = course.name.replace(/ /g, '-')
                                                    const categoryName = course.categoryName.replace(/ /g, '-')
                                                    return `${window.location.origin}/${encodeURIComponent(courseName)}/${encodeURIComponent(categoryName)}`
                                                })()}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className={styles.actions}>
                    <button
                        className={styles.cancelBtn}
                        onClick={onClose}
                        disabled={loading}
                    >
                        إلغاء
                    </button>
                    <button
                        className={styles.saveBtn}
                        onClick={handleSubmit}
                        disabled={loading || loadingCourses}
                    >
                        {loading ? 'جاري الإنشاء...' : 'إنشاء'}
                    </button>
                </div>
            </div>
        </div>
    )
}

