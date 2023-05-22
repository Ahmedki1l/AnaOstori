import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Spinner from '../../../components/CommonComponents/spinner';
import styles from './manageCourse.module.scss'
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
                                <p className={styles.courseTypeWrapper} onClick={() => setSelectCourseType('physical')}>حضورية</p>
                                <p className={styles.courseTypeWrapper} onClick={() => setSelectCourseType('onDemand')}>مسجلة</p>
                                <p className={styles.courseTypeWrapper} onClick={() => setSelectCourseType('online')}>مباشرة</p>
                            </div>
                        </div>
                    }
                </>

            }
        </>
    )
}

export default Index