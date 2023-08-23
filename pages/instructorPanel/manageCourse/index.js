import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Spinner from '../../../components/CommonComponents/spinner';
import styles from '../../../styles/InstructorPanelStyleSheets/ManageCourse.module.scss'
import Link from 'next/link';

function Index() {
    const storeData = useSelector((state) => state?.globalStore);
    const isUserInstructor = storeData?.isUserInstructor
    const [selectCourseType, setSelectCourseType] = useState('')
    return (
        <>
            {!isUserInstructor ?
                <div className='flex justify-center items-center'>
                    <Spinner />
                </div>
                :
                <>
                    {selectCourseType == '' &&
                        <div className='maxWidthDefault'>
                            <h1 className={`head2 py-12`}>اختر نوع الدورة</h1>
                            <div className={styles.courseTypesList}>
                                <Link href={"/instructorPanel/manageCourse/physical"} className={`${styles.courseTypeWrapper} normalLinkText`} >حضورية</Link>
                                <Link href={"/instructorPanel/manageCourse/onDemand"} className={`${styles.courseTypeWrapper} normalLinkText`} >مسجلة</Link>
                                <Link href={"/instructorPanel/manageCourse/online"} className={`${styles.courseTypeWrapper} normalLinkText`} >مباشرة</Link>
                            </div>
                        </div>
                    }
                </>
            }
        </>
    )
}

export default Index