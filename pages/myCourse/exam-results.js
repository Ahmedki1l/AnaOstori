import React from 'react'
import Head from 'next/head'
import StudentExamResults from '../../components/CommonComponents/StudentExamResults/StudentExamResults'

const ExamResultsPage = () => {
  return (
    <>
      <Head>
        <title>نتائج الاختبارات - أنا أوستوري</title>
        <meta name="description" content="عرض نتائج الاختبارات الخاصة بك" />
      </Head>
      
      <div style={{ padding: '1rem' }}>
        {/* <div style={{ marginBottom: '1rem' }}>
          <a 
            href="/myCourse" 
            style={{ 
              color: '#F26722', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            ← العودة لدوراتي
          </a>
        </div> */}
        <StudentExamResults />
      </div>
    </>
  )
}

export default ExamResultsPage
