import React from 'react'
import { useSelector } from 'react-redux'
import styles from '../../styles/InstructorPanel.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'

export default function Index() {
    const storeData = useSelector(state => state.globalStore)
    const instructorName = storeData?.viewProfileData?.firstName
    console.log(storeData);
    return (
        <div className='maxWidthDefault'>
            <h1 className={`${styles.instructorName} fontBold`}> <span className='fontMedium'> حياك الله</span> {instructorName}</h1>
            <div className='flex p-4'>
                <div className={styles.dashboardItemWrapper}>
                    <AllIconsComponenet width={45} height={45} iconName='plus' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>إضافة وتعديل الدورات</p>
                </div>
                <div className={styles.dashboardItemWrapper}>
                    <AllIconsComponenet width={68} height={68} iconName='libraryIcon' color={'#000000'} />
                    <p className={`fontMedium ${styles.dashboardItemName}`}>إدارة المكتبة الرقمية</p>
                </div>
            </div>
        </div>
    )
}
