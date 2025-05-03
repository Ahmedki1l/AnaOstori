import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BlogList from '../../../components/BlogAdmin/BlogList'
import CategoryList from '../../../components/BlogAdmin/CategoryList'
import styles from '../../../styles/AdminBlogsPage.module.scss';

export default function AdminBlogsPage() {
  const [view, setView] = useState('blogs') // or 'categories'
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [artsRes, catsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-any`, {
            params: { collection: 'BlogArticles' }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-any`, {
            params: { collection: 'BlogCategories' }
          })
        ])
      setBlogs(artsRes.data)
      setCategories(catsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    
    fetchAll()
  }, [])

  if (loading) return <p>جاري التحميل…</p>

  return (
    <div className={styles.container}>
      <h1>إدارة المدونة</h1>
      <div className={styles.header}>
        <button
          className={`${styles.tabButton} ${
            view === 'blogs' ? styles.tabButtonActive : ''
          }`}
          onClick={() => setView('blogs')}
        >
          المقالات
        </button>
        <button
          className={`${styles.tabButton} ${
            view === 'categories' ? styles.tabButtonActive : ''
          }`}
          onClick={() => setView('categories')}
        >
          التصنيفات
        </button>
      </div>
      {view==='blogs'
        ? <BlogList blogs={blogs} setBlogs={setBlogs} categories={categories} refresh={fetchAll}/>
        : <CategoryList categories={categories} setCategories={setCategories} refresh={fetchAll}/>
      }
    </div>
  )
}
