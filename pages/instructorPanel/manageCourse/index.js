import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Spinner from '../../../components/CommonComponents/spinner';
import styles from '../../../styles/InstructorPanelStyleSheets/ManageCourse.module.scss'
import Link from 'next/link';
import Image from 'next/legacy/image';
import BackToPath from '../../../components/CommonComponents/BackToPath';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { typeOfCourseConst } from '../../../constants/adminPanelConst/courseConst/courseConst';

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
                            <div className='px-2'>
                                <BackToPath
                                    backPathArray={
                                        [
                                            { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel' },
                                            { lable: 'إضافة وتعديل الدورات', link: null },
                                        ]
                                    }
                                />
                            </div>
                            <h1 className={`font-medium text-2xl py-12 px-4`}>اختر نوع الدورة</h1>
                            <div className={styles.courseTypesList}>
                                <Link href={"/instructorPanel/manageCourse/physical"} className={`${styles.courseTypeWrapper} normalLinkText`}>
                                    <AllIconsComponenet iconName={'locationDoubleColor'} height={50} width={50} color={'#000000'} />
                                    <p className={`${styles.dashboardItemName}`}>{typeOfCourseConst.physical}</p>
                                </Link>
                                <Link href={"/instructorPanel/manageCourse/online"} className={`${styles.courseTypeWrapper} normalLinkText`} >
                                    <AllIconsComponenet iconName={'onlineDoubleColorIcon'} height={50} width={50} color={'#000000'} />
                                    <p className={`${styles.dashboardItemName}`}>{typeOfCourseConst.online}</p>
                                </Link>
                                <Link href={"/instructorPanel/manageCourse/onDemand"} className={`${styles.courseTypeWrapper} normalLinkText`} >
                                    <AllIconsComponenet iconName={'televisonDoubleColorIcon'} height={50} width={50} color={'#000000'} />
                                    <p className={`${styles.dashboardItemName}`}>{typeOfCourseConst.onDemand}</p>
                                </Link>
                            </div>
                        </div>
                    }
                </>
            }
        </>
    )
}

export default Index