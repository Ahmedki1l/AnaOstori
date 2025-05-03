import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import BlogComponent from '../../components/BlogComponent/BlogComponent';

export default function Blog() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // hit your generic get-any for both collections in parallel
        const [artsRes, catsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-any`, {
            params: { collection: 'BlogArticles' }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-any`, {
            params: { collection: 'BlogCategories' }
          })
        ])
        setArticles(artsRes.data)
        setCategories(catsRes.data)
      } catch (err) {
        console.error('Error fetching blog data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>جاري تحميل المقالات...</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <meta name="description" content="مقالات تعليمية وإرشادية عن اختبارات القدرات والتحصيلي" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <main>
        <BlogComponent 
          articles={articles} 
          categories={categories} 
        />
      </main>
    </>
  );
}