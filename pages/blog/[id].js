import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BlogDetail from '../../components/BlogComponent/BlogDetail';
import axios from 'axios';

export async function getServerSideProps(context) {
    const params = context.query
    try {
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
            props: {
                news: news.data,
                catagories: catagories.data,
                homeReviews: homeReviews.data,
                homeMetaData: homeMetaData.data,
                params: params
            }
        };
    } catch (error) {
        console.log(error);
        return {
            notFound: true,
        };
    }

}

// This would come from your API in a real implementation
const mockArticleData = {
  id: '1',
  title: 'كيف أتحضر لاختبار القدرات؟',
  date: '07/12/2024',
  heroImage: '/images/blog/exam-preparation.jpg',
  excerpt: 'اختبار القدرات هو اختبار مهم جدا لطلاب المرحلة الثانوية وضمان تقديم الطالب افضل ما لديه في الاختبار يستعد للاختبار بالطريقة الصحيحة',
  tableOfContents: [
    { title: 'كيف أتحضر لاختبار القدرات؟', highlighted: true },
    { title: '1- استعد قبل الاختبار بفترة كافية', highlighted: false },
    { title: '2- أعرف طريقة الاختبار', highlighted: false },
    { title: '3- رتب جدول للمذاكرة', highlighted: false },
    { title: '4- التأسيس الصحيح للجزء الكمي', highlighted: false },
    { title: 'الخلاصة', highlighted: false },
  ],
  content: [
    {
      type: 'paragraph',
      text: 'اختبار القدرات هو اختبار مهم جدا لطلاب المرحلة الثانوية وضمان تقديم الطالب افضل ما عنده في الاختبار يستعد للاختبار بالطريقة الصحيحة'
    },
    {
      type: 'paragraph',
      text: 'وهنا سنتحدث عن اهم سؤال في القدرات وهو كيف استعد لاختبار القدرات بالطريقة الصحيحة؟'
    },
    {
      type: 'heading',
      text: '1- استعد قبل الاختبار بفترة كافية'
    },
    {
      type: 'paragraph',
      text: 'مهم جدا الاستعداد قبل الاختبار بفترة كافية بشكل عام كلما استعدبت ابكر كل ما تمرنت على المسائل والافكار اكثر وهذا يؤدي بدرجة اكبر نجاحك، طبعا الموضوع يعتمد على الطالب، منك من يحتاج اكثر من شهر للاستعداد، وبعض الطلاب يدرسون القدرات بين شهرين او ثلاثة اشهر.'
    },
    {
      type: 'heading',
      text: '2- أعرف طريقة الاختبار'
    },
    {
      type: 'paragraph',
      text: 'لازم تكون عارف ايش هو اختبار القدرات وايش نمط الاسئلة وكم سؤال وكم الوقت موعد الاختبار واين اختبار واخيرا وين في مودحساتك؟'
    },
    {
      type: 'paragraph',
      text: 'بتحصل الاجابة على كل هذه الاسئلة في التعريف باختبار القدرات'
    },
    {
      type: 'heading',
      text: '3- رتب جدول للمذاكرة'
    },
    {
      type: 'paragraph',
      text: 'تحب المذاكرة بطريقة متوازنة ولا تشتت نفسك، اعمل لك جدول وحدد كم درس تذاكر اليوم والتزم بالجدول'
    },
    {
      type: 'paragraph',
      text: 'حمل جداول سنذكرها هنا'
    },
    {
      type: 'image',
      src: '/images/blog/schedule.jpg',
      alt: 'جدول مذاكرة',
      caption: 'مثال على جدول المذاكرة لاختبار القدرات'
    },
    {
      type: 'heading',
      text: '4- التأسيس الصحيح للجزء الكمي'
    },
    {
      type: 'paragraph',
      text: 'القسم الكمي لاختبار القدرات يركز على الاستنتاج والقياس ويحتاج الى معلومات رياضية بسيطة، ضروري على الطالب مراجعة الاساسيات'
    },
    {
      type: 'paragraph',
      text: 'الرياضية قبل الدخول للاختبار في ملفنا ستجد جميع الدروس المقررة في قياس على شكل ملخص مكتوب وبشكل مبسط مع تمارين لكل درس'
    },
    {
      type: 'highlight',
      text: 'تذكر أن النجاح في اختبار القدرات يتطلب التحضير المنظم والتدريب المستمر. لا تتردد في طلب المساعدة من معلميك أو البحث عن موارد إضافية إذا واجهتك صعوبات.'
    }
  ],
  summary: [
    '1- استعد قبل الاختبار بفترة كافية',
    '2- اعرف طريقة الاختبار',
    '3- رتب جدول للمذاكرة والتزم به',
    '4- التأسيس الصحيح للجزء الكمي',
    '5- حل الاسئلة السابقة (كمي ولفظي)',
    '6- الثقة بالنفس',
    '7- الاستمرار'
  ]
};

// Mock related articles
const mockRelatedArticles = [
  {
    id: '2',
    title: 'أفضل استراتيجيات حل اختبار القدرات',
    excerpt: 'تعرف على افضل الاستراتيجيات التي يمكن اتباعها لتحقيق أعلى درجة في اختبار القدرات...',
    image: '/images/blog/article2.jpg',
    date: '05/12/2024'
  },
  {
    id: '3',
    title: 'كيف أتغلب على قلق الاختبار؟',
    excerpt: 'نصائح عملية للتغلب على القلق والتوتر قبل وأثناء اختبار القدرات...',
    image: '/images/blog/article3.jpg',
    date: '01/12/2024'
  },
  {
    id: '4',
    title: 'أخطاء شائعة يجب تجنبها في اختبار القدرات',
    excerpt: 'تعرف على الأخطاء الشائعة التي يقع فيها الطلاب أثناء اختبار القدرات وكيفية تجنبها...',
    image: '/images/blog/article4.jpg',
    date: '20/11/2024'
  }
];

const BlogDetailPage = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const catagories = props?.catagories ? props?.catagories : []
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // In a real app, you would fetch the article data from an API
    // This is just a mock implementation
    const fetchArticle = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real app, you would fetch the article with the given ID
        // For now, we'll just return our mock data
        setArticle(mockArticleData);
        setRelatedArticles(mockRelatedArticles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching article:', error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

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
          catagories={catagories}
        />
      </main>
    </>
  );
};

export default BlogDetailPage;