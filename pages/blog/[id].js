import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BlogDetail from '../../components/BlogComponent/BlogDetail';
import axios from 'axios'

export async function getServerSideProps(context) {
  const { id } = context.query

  try {
    // 1) fetch all articles & categories in parallel
    const [artsRes, catsRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-any`, {
        params: { collection: 'BlogArticles' }
      }),
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-any`, {
        params: { collection: 'BlogCategories' }
      })
    ])

    const articles = artsRes.data;
    const categories = catsRes.data;

    // 2) find the one matching this page’s id
    const article = articles.find(a => String(a._id) === String(id))
    if (!article) {
      return { notFound: true }
    }

    // 3) pick up to 3 others as “related”
    const relatedArticles = articles
      .filter(a => String(a._id) !== String(id))
      .slice(0, 3)

    const newsReq = axios.post(`${process.env.API_BASE_URL}/route`, { routeName: 'listNewsBar' })
    const catagoriesReq = axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=categoriesNoAuth`)
    const homeReviewsReq = axios.post(`${process.env.API_BASE_URL}/route`, { routeName: `allReviews` })
    const homeMetaDataReq = axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=homeMetaData`)
    // const [news, catagories, homeMetaData] = await Promise.all([
    const [news, catagories, homeReviews, homeMetaData] = await Promise.all([
      newsReq,
      catagoriesReq,
      homeReviewsReq,
      homeMetaDataReq
    ])
    return {
      // props: {
      // 	catagories: catagories.data,
      // 	homeMetaData: homeMetaData.data,
      // 	news: news.data,
      // 	params: params
      // }

      props: {
        news: news.data,
        catagories: catagories.data,
        homeReviews: homeReviews.data,
        homeMetaData: homeMetaData.data,
        article,
        relatedArticles
      }
    };
  } catch (err) {
    console.error('Blog detail fetch error:', err)
    return { notFound: true }
  }
}

const BlogDetailPage = (props) => {
  const article = props.article;
  const relatedArticles = props.relatedArticles;
  const categories = props.catagories;
  

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">المقال غير موجود</h1>
        <button
          onClick={() => router.push('/blog')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          العودة للمدونة
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{article.title} | منصة أنا أسطوري</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        {article.heroImage && <meta property="og:image" content={article.heroImage} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <BlogDetail
          article={article}
          relatedArticles={relatedArticles}
          catagories={categories}
        />
      </main>
    </>
  );
};

export default BlogDetailPage;