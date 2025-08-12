import React from 'react'
import { NextSeo } from 'next-seo'
import StudentExamResults from '../../components/CommonComponents/StudentExamResults/StudentExamResults'
import BackToPath from '../../components/CommonComponents/BackToPath'

const ExamResultsPage = () => {
  return (
    <>
      <NextSeo
        title="نتائج الاختبارات | أنا أستوري"
        description="عرض نتائج الاختبارات الخاصة بك"
        canonical="https://anaostori.com/myCourse/exam-results"
      />
      
      <div className="maxWidthDefault">
        <BackToPath 
          paths={[
            { name: 'الرئيسية', href: '/' },
            { name: 'دوراتي', href: '/myCourse' },
            { name: 'نتائج الاختبارات', href: '/myCourse/exam-results' }
          ]}
        />
        
        <StudentExamResults />
      </div>
    </>
  )
}

export default ExamResultsPage
