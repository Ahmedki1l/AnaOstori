import React from 'react'
import Head from 'next/head'
import StudentExamResults from '../../components/CommonComponents/StudentExamResults/StudentExamResults'
import BackToPath from '../../components/CommonComponents/BackToPath'

const ExamResultsPage = () => {
  return (
    <>
      <Head>
        <title>نتائج الاختبارات - أنا أوستوري</title>
        <meta name="description" content="عرض نتائج الاختبارات الخاصة بك" />
      </Head>
      
      <div style={{ padding: '1rem' }}>
        <BackToPath />
        <StudentExamResults />
      </div>
    </>
  )
}

export default ExamResultsPage
