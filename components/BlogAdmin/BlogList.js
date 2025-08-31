import React, { useState } from 'react'
import axios from 'axios'
import BlogModal from './BlogModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import styles from './BlogList.module.scss';
import { formatFullDate } from '../../constants/DateConverter';
import { toast } from 'react-toastify';

export default function BlogList({ blogs, setBlogs, categories, refresh }) {
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [creating, setCreating] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleCreate = async data => {
    refresh();
  }

  const handleUpdate = async (id, data) => {
    refresh();
  }

  const handleDelete = async id => {
    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/delete-blog`,
        {
          data: { 
            blogId: id 
          }
        }
      );
      
      if (response.status === 200) {
        // Update local state
        setBlogs(bs => bs.filter(b => b._id !== id));
        toast.success('تم حذف المقال بنجاح', { rtl: true });
        refresh();
      }
    } catch (error) {
      console.error('Delete blog failed:', error);
      
      // Handle different error status codes
      if (error.response?.status === 404) {
        toast.error('المقال غير موجود', { rtl: true });
      } else if (error.response?.status === 400) {
        toast.error('معرف المقال غير صحيح', { rtl: true });
      } else if (error.response?.status === 500) {
        toast.error('حدث خطأ في الخادم، يرجى المحاولة مرة أخرى', { rtl: true });
      } else if (error.response?.status === 405) {
        toast.error('طريقة الطلب غير مسموحة', { rtl: true });
      } else if (!error.response) {
        toast.error('خطأ في الاتصال بالشبكة، يرجى التحقق من اتصال الإنترنت', { rtl: true });
      } else {
        toast.error('فشل في حذف المقال، يرجى المحاولة مرة أخرى', { rtl: true });
      }
    } finally {
      setDeleteLoading(false);
      setDeleting(null);
    }
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.addButton}
        onClick={() => setCreating(true)}
      >
        + إضافة مقال
      </button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>العنوان</th>
            <th className={styles.th}>التصنيف</th>
            <th className={styles.th}>تاريخ الإنشاء</th>
            <th className={styles.th}>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map(b => (
            <tr key={b._id} className={styles.trHover}>
              <td className={styles.td}>{b.title}</td>
              <td className={styles.td}>
                {categories.find(c => c._id === b.categoryId)?.title}
              </td>
              <td className={styles.td}>
                {formatFullDate(b.createdAt)}
              </td>
              <td className={styles.td}>
                <div className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => setEditing(b)}
                  >
                    تعديل
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => setDeleting(b)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? 'جاري الحذف...' : 'حذف'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {creating && (
        <BlogModal
          categories={categories}
          onSave={data => { handleCreate(data); setCreating(false) }}
          onClose={() => {setCreating(false); handleUpdate()}}
        />
      )}
      {editing && (
        <BlogModal
          blog={editing}
          categories={categories}
          onSave={data => { handleUpdate(editing._id, data); setEditing(null) }}
          onClose={() => {setEditing(null); handleUpdate()}}
        />
      )}
      {deleting && (
        <ConfirmDeleteModal
          title={`حذف المقال "${deleting.title}"؟`}
          onConfirm={() => handleDelete(deleting._id)}
          onClose={() => setDeleting(null)}
          isLoading={deleteLoading}
        />
      )}
    </div>
  )
}
