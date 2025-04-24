import React from 'react';
import Head from 'next/head';
import BlogComponent from '../../components/BlogComponent/BlogComponent';

// Example data - in a real app, this would come from an API
const mockArticles = [
  {
    id: 1,
    title: 'كيف اذاكر لاختبار القدرات؟',
    excerpt: 'اختبار القدرات هو اختبار مهم جدا لطلاب المرحلة الثانوية وضمان تقديم الطالب افضل ما لديه في الاختبار...',
    image: '/images/blog/article1.jpg',
    date: '07/12/2024',
    category: 'preparation'
  },
  {
    id: 2,
    title: 'كيف اتحضر لاختبار القدرات؟',
    excerpt: 'في هذه المقالة سنتكلم عن افضل الطرق التي تمكنك من تسهيل اختبار القدرات وتكون جاهزًا تمام لبدء الاختبار...',
    image: '/images/blog/article2.jpg',
    date: '07/12/2024',
    category: 'preparation'
  },
  {
    id: 3,
    title: 'كيف اتحضر لاختبار القدرات؟',
    excerpt: 'في هذه المقالة سنتكلم عن افضل الطرق التي تمكنك من تسهيل اختبار القدرات وتكون جاهزًا تمام لبدء الاختبار...',
    image: '/images/blog/article3.jpg',
    date: '07/12/2024',
    category: 'tips'
  },
  {
    id: 4,
    title: 'كيف اتحضر لاختبار القدرات؟',
    excerpt: 'في هذه المقالة سنتكلم عن افضل الطرق التي تمكنك من تسهيل اختبار القدرات وتكون جاهزًا تمام لبدء الاختبار...',
    image: '/images/blog/article4.jpg',
    date: '07/12/2024',
    category: 'tips'
  },
  {
    id: 5,
    title: 'كيف اتحضر لاختبار القدرات؟',
    excerpt: 'في هذه المقالة سنتكلم عن افضل الطرق التي تمكنك من تسهيل اختبار القدرات وتكون جاهزًا تمام لبدء الاختبار...',
    image: '/images/blog/article5.jpg',
    date: '07/12/2024',
    category: 'preparation'
  },
  {
    id: 6,
    title: 'كيف اتحضر لاختبار القدرات؟',
    excerpt: 'في هذه المقالة سنتكلم عن افضل الطرق التي تمكنك من تسهيل اختبار القدرات وتكون جاهزًا تمام لبدء الاختبار...',
    image: '/images/blog/article6.jpg',
    date: '07/12/2024',
    category: 'experience'
  },
  {
    id: 7,
    title: 'كيف اتحضر لاختبار القدرات؟',
    excerpt: 'في هذه المقالة سنتكلم عن افضل الطرق التي تمكنك من تسهيل اختبار القدرات وتكون جاهزًا تمام لبدء الاختبار...',
    image: '/images/blog/article7.jpg',
    date: '07/12/2024',
    category: 'experience'
  },
  {
    id: 8,
    title: 'كيف اتحضر لاختبار القدرات؟',
    excerpt: 'في هذه المقالة سنتكلم عن افضل الطرق التي تمكنك من تسهيل اختبار القدرات وتكون جاهزًا تمام لبدء الاختبار...',
    image: '/images/blog/article8.jpg',
    date: '07/12/2024',
    category: 'faq'
  },
  {
    id: 9,
    title: 'كيف اتحضر لاختبار القدرات؟',
    excerpt: 'في هذه المقالة سنتكلم عن افضل الطرق التي تمكنك من تسهيل اختبار القدرات وتكون جاهزًا تمام لبدء الاختبار...',
    image: '/images/blog/article9.jpg',
    date: '07/12/2024',
    category: 'faq'
  },
];

const mockCategories = [
  {
    id: 'preparation',
    name: 'تحضير للقدرات'
  },
  {
    id: 'tips',
    name: 'نصائح وارشادات'
  },
  {
    id: 'experience',
    name: 'تجارب طلاب'
  },
  {
    id: 'faq',
    name: 'الأسئلة الشائعة'
  }
];

export default function Blog() {
  return (
    <>
      <Head>
        <meta name="description" content="مقالات تعليمية وإرشادية عن اختبارات القدرات والتحصيلي" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <main>
        <BlogComponent 
          articles={mockArticles} 
          categories={mockCategories} 
        />
      </main>
    </>
  );
}