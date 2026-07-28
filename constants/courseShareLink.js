import { toast } from 'react-toastify'
import { toastSuccessMessage } from './ar'

// روابط مشاركة الدورات — تُستخدم في صفحات إدارة الدورات
// Share links for courses — used by the instructor panel course management pages.

// الدورات العادية: /{اسم-الدورة}/{اسم-المجال}
// Regular courses are addressed by display name, matching the navigation built in
// components/TypesOfCourseComponents/PhysicalCourseCard.js
export const courseShareUrl = (course) => {
    const courseName = course?.name
    const catagoryName = course?.catagory?.name
    if (!courseName || !catagoryName) return null
    return `${window.location.origin}/${courseName.replace(/ /g, '-')}/${catagoryName.replace(/ /g, '-')}`
}

// الدورات المخصصة: صفحة واحدة تعرض كل الدورات، لذلك نمرر المعرف كـ query param
// Custom courses all live on a single page, so the course is identified by a query param.
export const customeCourseShareUrl = (courseId) => {
    return `${window.location.origin}/customeCourses?courseId=${courseId}`
}

export const copyShareUrl = async (url) => {
    if (!url) {
        toast.error('تعذر إنشاء رابط لهذه الدورة', { rtl: true, })
        return
    }
    try {
        // navigator.clipboard is undefined on non-HTTPS hosts and throws synchronously
        if (!navigator.clipboard) throw new Error('Clipboard API unavailable')
        await navigator.clipboard.writeText(url)
        toast.success(toastSuccessMessage.copiedMsg, { rtl: true, })
    } catch (error) {
        console.error(`Failed to copy ${url} to clipboard: ${error}`)
        toast.error('فشل نسخ الرابط', { rtl: true, })
    }
}
