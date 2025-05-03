import React, { useState } from 'react'
import axios from 'axios'
import BlogModal from './BlogModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import styles from './BlogList.module.scss';
import { formatFullDate } from '../../constants/DateConverter';

export default function BlogList({ blogs, setBlogs, categories }) {
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [creating, setCreating] = useState(false)

  const refresh = () => {
    // refetch or just keep local state
  }

  const handleCreate = async data => {
    const res = await axios.post('/blogs', data)
    setBlogs(bs => [res.data, ...bs])
  }

  const handleUpdate = async (id, data) => {
    const res = await axios.put(`/blogs/${id}`, data)
    setBlogs(bs => bs.map(b => b._id === id ? res.data : b))
  }

  const handleDelete = async id => {
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/delete-blog`,
      { blogId: id }
    );
    setBlogs(bs => bs.filter(b => b._id !== id))
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
          onClose={() => setCreating(false)}
        />
      )}
      {editing && (
        <BlogModal
          blog={editing}
          categories={categories}
          onSave={data => { handleUpdate(editing._id, data); setEditing(null) }}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmDeleteModal
          title={`حذف المقال "${deleting.title}"؟`}
          onConfirm={() => { handleDelete(deleting._id); setDeleting(null) }}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
