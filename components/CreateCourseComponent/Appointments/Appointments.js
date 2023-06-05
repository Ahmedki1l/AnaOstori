import { useRouter } from 'next/router'
import React from 'react'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import styles from './Appointments.module.scss'


const Appointments = () => {

    const router = useRouter()
    const courseType = router.query.courseType
    const allPhysicalCourses = []
    const handleRoute = () => {
        router.push('/instructorPanel/manageCourse/physical/createCourse')
    }

    return (
        <div className='maxWidthDefault px-4'>
            <div className='flex justify-between items-center'>
                <h1 className={`head2 py-8`}>
                    {courseType == "physical" ? "الدورات الحضورية " : courseType == "online" ? "الدورات المباشرة" : "الدورات المسجلة "}
                </h1>
                <div className={styles.createCourseBtnBox}>
                    <button className='primarySolidBtn' onClick={() => handleRoute()}>إنشاء دورة</button>
                </div>
            </div>
            <div>
                <table className={styles.tableArea}>
                    <thead className={styles.tableHeaderArea}>
                        <tr>
                            <th className={`${styles.tableHeadText} ${styles.appointTableHead1}`}>بيانات الفترة</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>المدرب</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead3}`}>تاريخ الإنشاء</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead4}`}>اخر تعديل</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead5}`}>الطلاب المسجلين</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead6}`}>الإجراءات</th>
                        </tr>
                    </thead>
                    {allPhysicalCourses.length > 0 &&
                        <tbody className={styles.tableBodyArea}>
                            {allPhysicalCourses.map((course, index) => {
                                return (
                                    <tr key={`tableRow${index}`}>
                                        <td className={`${styles.tableBodyText} ${styles.tableBody1}`}></td>
                                        <td className={`${styles.tableBodyText} ${styles.tableBody2}`}></td>
                                        <td className={`${styles.tableBodyText} ${styles.tableBody3}`}></td>
                                        <td className={`${styles.tableBodyText} ${styles.tableBody4}`}></td>
                                        <td className={`${styles.tableBodyText} ${styles.tableBody5}`}></td>
                                        <td className={`${styles.tableBodyText} ${styles.tableBody6}`}></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    }
                </table>
                {allPhysicalCourses.length == 0 &&
                    <div className={styles.tableBodyArea}>
                        <div className={styles.noDataManiArea} >
                            <div className={styles.noDataSubArea} >
                                <AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
                                <p className='fontBold py-2'>ما أنشئت أي موعد</p>
                                <div className={styles.createCourseBtnBox}>
                                    <button className='primarySolidBtn'>إنشاء موعد</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Appointments;