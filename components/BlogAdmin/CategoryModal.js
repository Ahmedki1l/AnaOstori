// src/components/BlogAdmin/CategoryModal.js
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import styles from './CategoryModal.module.scss'

export default function CategoryModal({ category, onSave, onClose }) {
    const [name, setName] = useState(category?.title || '')
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        if (!name.trim()) {
            toast.warn('الرجاء إدخال اسم التصنيف')
            return
        }

        setLoading(true)
        try {
            const base = process.env.NEXT_PUBLIC_API_BASE_URL
            let res
            if (category?._id) {
                // update existing
                res = await axios.put(
                    `${base}/update-category`,
                    { categoryId: category._id, name }
                )
                toast.success('تم تحديث التصنيف بنجاح')
            } else {
                // create new
                res = await axios.post(
                    `${base}/create-category`,
                    { name }
                )
                toast.success('تم إضافة التصنيف بنجاح')
            }
            onSave(res.data)
            onClose()
        } catch (err) {
            console.error('Category save error:', err)
            toast.error('حدث خطأ أثناء الحفظ، حاول مرة أخرى')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose} dir="rtl">
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose}>✕</button>
                <h2 className={styles.title}>
                    {category?._id ? 'تعديل تصنيف' : 'إضافة تصنيف'}
                </h2>
                <div className={styles.formGroup}>
                    <label>اسم التصنيف:</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={loading}
                    />
                </div>
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
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'جاري الحفظ…' : 'حفظ'}
                    </button>
                </div>
            </div>
        </div>
    )
}
