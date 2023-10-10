import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styles from '../../styles/InstructorPanelStyleSheets/InstructorPanel.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import Link from 'next/link'
import ManageAppVersionModel from '../../components/ManageAppVersion/ManageAppVersionModel'

export default function Index() {
    const storeData = useSelector(state => state.globalStore)
    const instructorName = storeData?.viewProfileData?.firstName

    const [isModelForAppVersion, setIsModelforAppVersion] = useState(false)

    const handleOpenAppVersionModel = () => {
        setIsModelforAppVersion(true)
    }

    return (
        <div className='maxWidthDefault'>
            <h1 className={`${styles.instructorName} fontBold`}> <span className='fontMedium'> حياك الله</span> {instructorName}</h1>
            <div className='flex flex-wrap p-4'>
                <Link href={'/instructorPanel/manageCategories'} className={`${styles.dashboardItemWrapper} normalLinkText`}>
                    <AllIconsComponenet width={39} height={39} iconName='manageCatagory' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>إضافة وإدارة المجالات</p>
                </Link>
                <Link href={'/instructorPanel/manageCourse'} className={`${styles.dashboardItemWrapper} normalLinkText`}>
                    <AllIconsComponenet width={39} height={39} iconName='manageCourse' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>إضافة وتعديل الدورات</p>
                </Link>
                <Link href={'/instructorPanel/manageLibrary?folderType=video'} className={`${styles.dashboardItemWrapper} normalLinkText`}>
                    <AllIconsComponenet width={39} height={39} iconName='manageLibrary' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>إدارة المكتبة الرقمية</p>
                </Link>
                <Link href={'/instructorPanel/manageInstructor'} className={`${styles.dashboardItemWrapper} normalLinkText`}>
                    <AllIconsComponenet width={39} height={39} iconName='manageInstructor' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>إضافة وإدارة المدربين</p>
                </Link>
                <Link href={'/instructorPanel/managePurchaseOrder'} className={`${styles.dashboardItemWrapper} normalLinkText`}>
                    <AllIconsComponenet width={39} height={39} iconName='managePurchaseOrder' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>استعلام ومتابعة الحجوزات</p>
                </Link>
                <Link href={'/instructorPanel/manageNews'} className={`${styles.dashboardItemWrapper} normalLinkText`}>
                    <AllIconsComponenet width={39} height={39} iconName='manageNews' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>إضافة وتعديل النص التسويقي</p>
                </Link>
                <div onClick={handleOpenAppVersionModel} className={`${styles.dashboardItemWrapper} normalLinkText`}>
                    <AllIconsComponenet width={39} height={39} iconName='manageAppVersion' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>تحديث نُسخ التطبيق</p>
                </div>
                {/* <Link href={'/instructorPanel/manageStudentFeedBack'} className={`${styles.dashboardItemWrapper} normalLinkText`}>
                    <AllIconsComponenet width={39} height={39} iconName='manageStudentFeedBack' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>إضافة وتعديل تجارب الطلاب</p>
                </Link> */}
                <Link href={'/instructorPanel/manageUserList'} className={`${styles.dashboardItemWrapper} normalLinkText`}>
                    <AllIconsComponenet width={39} height={39} iconName='manageUsers' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>إدارة بيانات المستخدمين</p>
                </Link>
                {/* <Link href={'/instructorPanel/manageCouponCourse'} className={`${styles.dashboardItemWrapper} normalLinkText`}>
                    <AllIconsComponenet width={39} height={39} iconName='manageCoupons' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>إضافة وتعديل كوبونات الخصم</p>
                </Link> */}

            </div>

            {isModelForAppVersion &&
                <ManageAppVersionModel
                    isModelForAppVersion={isModelForAppVersion}
                    setIsModelforAppVersion={setIsModelforAppVersion}
                />}
        </div>
    )
}
