import React from 'react'
import { useSelector } from 'react-redux'
import styles from '../../styles/InstructorPanelStyleSheets/InstructorPanel.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import Link from 'next/link'

export default function Index() {
    const storeData = useSelector(state => state.globalStore)
    const instructorName = storeData?.viewProfileData?.firstName
    return (
        <div className='maxWidthDefault'>
            <h1 className={`${styles.instructorName} fontBold`}> <span className='fontMedium'> حياك الله</span> {instructorName}</h1>
            <div className='flex flex-wrap p-4'>
                <Link href={'/instructorPanel/manageCategories'} className={`${styles.dashboardItemWrapper} normalLinkText`}>
                    <AllIconsComponenet width={45} height={45} iconName='plus' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>إضافة وتعديل المجالات</p>
                </Link>
                <Link href={'/instructorPanel/manageCourse'} className={`${styles.dashboardItemWrapper} normalLinkText`}>
                    <AllIconsComponenet width={45} height={45} iconName='plus' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>إضافة وتعديل الدورات</p>
                </Link>
                <Link href={'/instructorPanel/manageLibrary?folderType=video'} className={`${styles.dashboardItemWrapper} normalLinkText`}>
                    <AllIconsComponenet width={68} height={68} iconName='libraryIcon' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>إدارة المكتبة الرقمية</p>
                </Link>
                <Link href={'/instructorPanel/manageInstructor'} className={`${styles.dashboardItemWrapper} normalLinkText`}>
                    <AllIconsComponenet width={68} height={68} iconName='instructorIcon' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>إضافة وإدارة المدربين</p>
                </Link>
                <Link href={'/instructorPanel/manageNews'} className={`${styles.dashboardItemWrapper} normalLinkText`}>
                    <AllIconsComponenet width={45} height={45} iconName='plus' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>إضافة وتعديل الشريط التسويقي</p>
                </Link>
            </div>
        </div>
    )
}
