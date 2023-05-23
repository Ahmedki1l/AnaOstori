import { useRouter } from 'next/router';
import React from 'react'
import styles from '../../../../../styles/InstructorPanelStyleSheets/CreateCourse.module.scss'


export default function Index() {
    const { courseType, createCourse } = useRouter().query
    console.log(courseType, createCourse);
    return (
        <>
            <div className={styles.headerWrapper}>
                <div className='maxWidthDefault px-4'>
                    <h1 className={`head2 ${styles.createCourseHeaderText}`}>
                        {courseType == "physicalCourse" ? "إنشاء دورة حضورية" : courseType == "onlineCourse" ? "إنشاء دورة مباشرة" : "إنشاء دورة مسجلة"}
                    </h1>
                    <p className={`fontBold ${styles.courseInfoText}`}>معلومات الدورة </p>
                </div>
            </div>
            <div className={styles.bodyWrapper}>
                <div className='maxWidthDefault p-4'>
                    <div className={styles.bodysubWrapper}>
                        <div className='formInputBox'>
                            <input className='formInput' id="courseName" type="text" title="courseName" placeholder=' ' />
                            <label className='formLabel' htmlFor="courseName">عنوان الدورة</label>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
