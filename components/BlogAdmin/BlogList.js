import React, { useState } from 'react'
import axios from 'axios'
import BlogModal from './BlogModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import styles from './BlogList.module.scss';
import { formatFullDate } from '../../constants/DateConverter';

export default function BlogList({ blogs, setBlogs, categories, refresh }) {
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [creating, setCreating] = useState(false)

  const handleCreate = async data => {
    refresh();
  }

  const handleUpdate = async (id, data) => {
    refresh();
  }

  const handleDelete = async id => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/delete-blog`,
      { blogId: id }
    );
    setBlogs(bs => bs.filter(b => b._id !== id))
    refresh();
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
                  >
                    حذف
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
          onConfirm={() => { handleDelete(deleting._id); setDeleting(null) }}
          onClose={() => {setDeleting(null); handleUpdate()}}
        />
      )}
    </div>
  )
}
