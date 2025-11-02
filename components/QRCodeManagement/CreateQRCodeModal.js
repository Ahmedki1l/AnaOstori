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
    const [courses, setCourses] = useState([])
    const [loadingCourses, setLoadingCourses] = useState(false)
    
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
                    categoryName: category.name
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
                            categoryName: category.name
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
            
            // Build URL from category and course name with proper encoding
            const courseUrlName = course.name.replace(/ /g, '-')
            const categoryUrlName = course.categoryName.replace(/ /g, '-')
            finalUrl = `${window.location.origin}/${encodeURIComponent(courseUrlName)}/${encodeURIComponent(categoryUrlName)}`
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
        } else {
            setBookName('')
            setUrl('')
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
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        disabled={loading || loadingCourses}
                                    >
                                        <option value="">— اختر دورة —</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.course && <span className={styles.error}>{errors.course}</span>}
                                    {selectedCourse && (
                                        <div className={styles.coursePreview}>
                                            <p className={styles.previewLabel}>الرابط المُنشأ:</p>
                                            <p className={styles.previewUrl}>
                                                {(() => {
                                                    const course = courses.find(c => c.id === selectedCourse)
                                                    if (!course) return ''
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

