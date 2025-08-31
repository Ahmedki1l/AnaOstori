import React, { useState } from 'react'
import axios from 'axios'
import CategoryModal from './CategoryModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import styles from './CategoryList.module.scss';
import { toast } from 'react-toastify';

export default function CategoryList({ categories, setCategories, refresh }) {
    const [editing, setEditing] = useState(null)
    const [deleting, setDeleting] = useState(null)
    const [creating, setCreating] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleCreate = async data => {
        // Update local state immediately
        setCategories(prev => [data, ...prev]);
        // Then refresh from server to ensure consistency
        refresh();
    }
    
    const handleUpdate = async (id, data) => {
        // Update local state immediately
        setCategories(prev => prev.map(category => 
            category._id === id ? { ...category, ...data } : category
        ));
        // Then refresh from server to ensure consistency
        refresh();
    }
    
    const handleDelete = async id => {
        setDeleteLoading(true);
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/delete-category`,
                {
                    data: { categoryId: id }
                }
            );
            
            if (response.status === 200) {
                // Update local state
                setCategories(cs => cs.filter(c => c._id !== id));
                toast.success('تم حذف التصنيف بنجاح', { rtl: true });
                // No need to call refresh() here since we already updated local state
            }
        } catch (error) {
            console.error('Delete category failed:', error);
            
            // Handle different error status codes
            if (error.response?.status === 404) {
                toast.error('التصنيف غير موجود', { rtl: true });
            } else if (error.response?.status === 400) {
                toast.error('معرف التصنيف غير صحيح', { rtl: true });
            } else if (error.response?.status === 500) {
                toast.error('حدث خطأ في الخادم، يرجى المحاولة مرة أخرى', { rtl: true });
            } else if (error.response?.status === 405) {
                toast.error('طريقة الطلب غير مسموحة', { rtl: true });
            } else if (!error.response) {
                toast.error('خطأ في الاتصال بالشبكة، يرجى التحقق من اتصال الإنترنت', { rtl: true });
            } else {
                toast.error('فشل في حذف التصنيف، يرجى المحاولة مرة أخرى', { rtl: true });
            }
        } finally {
            setDeleteLoading(false);
            setDeleting(null);
        }
    }

    return (
        <div className={styles.container}>
            <button className={styles.addButton} onClick={() => setCreating(true)}>
                + إضافة تصنيف
            </button>
            <ul className={styles.list}>
                {categories.map(c => (
                    <li key={c._id} className={styles.listItem}>
                        {c.title}
                        <div className={styles.actions}>
                            <button className={styles.editBtn} onClick={() => setEditing(c)}>تعديل</button>
                            <button 
                                className={styles.deleteBtn} 
                                onClick={() => setDeleting(c)}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? 'جاري الحذف...' : 'حذف'}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {creating && <CategoryModal onSave={d => { handleCreate(d); setCreating(false) }} onClose={() => setCreating(false)} />}
            {editing && <CategoryModal category={editing} onSave={d => { handleUpdate(editing._id, d); setEditing(null) }} onClose={() => setEditing(null)} />}
            {deleting && (
                <ConfirmDeleteModal 
                    title={`حذف التصنيف "${deleting.title}"؟`} 
                    onConfirm={() => handleDelete(deleting._id)} 
                    onClose={() => setDeleting(null)}
                    isLoading={deleteLoading}
                />
            )}
        </div>
    )
}
