import React, { useState } from 'react'
import axios from 'axios'
import CategoryModal from './CategoryModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import styles from './CategoryList.module.scss';

export default function CategoryList({ categories, setCategories, refresh }) {
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
        await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/delete-category`,
            { categoryId: id }
        );
        setCategories(cs => cs.filter(c => c._id !== id))
        refresh();
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
                            <button className={styles.deleteBtn} onClick={() => setDeleting(c)}>حذف</button>
                        </div>
                    </li>
                ))}
            </ul>
            {creating && <CategoryModal onSave={d => { handleCreate(d); setCreating(false) }} onClose={() => setCreating(false)} />}
            {editing && <CategoryModal category={editing} onSave={d => { handleUpdate(editing._id, d); setEditing(null) }} onClose={() => setEditing(null)} />}
            {deleting && <ConfirmDeleteModal title={`حذف التصنيف "${deleting.name}"؟`} onConfirm={() => { handleDelete(deleting._id); setDeleting(null) }} onClose={() => setDeleting(null)} />}
        </div>
    )
}
