import { useRouter } from 'next/router';
import React from 'react'
import styles from '../../../../../styles/InstructorPanelStyleSheets/CreateCourse.module.scss'
import { Input, Select, Space } from 'antd';
import AllIconsComponenet from '../../../../../Icons/AllIconsComponenet';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

export default function Index() {
    const { courseType, createCourse } = useRouter().query
    const catagories = useSelector((state) => state?.globalStore.catagories);
    console.log("catagories", catagories);

    const catagoriesItem = catagories.map(function (obj) {
        return {
            label: obj.name,
            value: obj.id
        };
    });


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
                    </div>
                </div>
            </div >
        </>
    )
}
