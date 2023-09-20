import React, { useEffect, useState } from 'react'
import styles from '../../../../styles/InstructorPanelStyleSheets/CourseListComponent.module.scss'
import { useRouter } from 'next/router'
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCourseByInstructor, updateCourseDetailsAPI } from '../../../../services/apisService'
import { fullDate } from '../../../../constants/DateConverter'
import { getNewToken, signOutUser } from '../../../../services/fireBaseAuthService'
import Image from 'next/legacy/image'
import Switch from '../../../../components/antDesignCompo/Switch'
import { mediaUrl } from '../../../../constants/DataManupulation'
import BackToPath from '../../../../components/CommonComponents/BackToPath'
import Empty from '../../../../components/CommonComponents/Empty'

export default function Index() {

    const router = useRouter()
    const courseType = router.query.courseType
    const [allPhysicalCourses, setAllPhysicalCourses] = useState([])
    const dispatch = useDispatch();

    const handleRoute = () => {
        router.push(`/instructorPanel/manageCourse/${courseType}/createCourse`)

        dispatch({ type: 'SET_EDIT_COURSE_DATA', editCourseData: {} })
        dispatch({ type: 'SET_IS_COURSE_EDIT', isCourseEdit: false })
    }

    useEffect(() => {
        const getAllCourse = async () => {
            let body = {
                courseType: courseType == "onDemand" ? "on-demand" : courseType,
            }
            await getAllCourseByInstructor(body).then(res => {
                setAllPhysicalCourses(res?.data)
            }).catch(async (error) => {
                console.log(error);
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await getAllCourseByInstructor(body).then(res => {
                            setAllPhysicalCourses(res?.data)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
            })
        }
        getAllCourse()
    }, [courseType])

    const handleEditCourse = (course) => {
        dispatch({ type: 'SET_EDIT_COURSE_DATA', editCourseData: course })
        dispatch({ type: 'SET_IS_COURSE_EDIT', isCourseEdit: true })
        router.push({
            pathname: (`/instructorPanel/manageCourse/${courseType}/editCourse`),
            query: { courseId: course?.id }
        })
    }

    const handleCoursePublished = async (checked, courseId) => {
        let body = {
            data: { published: checked },
            courseId: courseId,
        }
        await updateCourseDetailsAPI(body).then((res) => {
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await updateCourseDetailsAPI(body).then(res => {
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    };

    return (
        <div className='maxWidthDefault px-4'>
            <div>
                <BackToPath
                    backpathForPage={true}
                    backPathArray={
                        [
                            { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel' },
                            { lable: 'إدارة وإضافة الدورات', link: '/instructorPanel/manageCourse/' },
                            { lable: 'الدورات الحضورية', link: null }
                        ]
                    }
                />
            </div>
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
                            <th className={`${styles.tableHeadText} ${styles.tableHead1}`}>بيانات الدورة</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>حالة النشر</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead3}`}>تاريخ الإنشاء</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead4}`}>اخر تعديل</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead5}`}>إجمالي المشتركين</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead6}`}>الإجراءات</th>
                        </tr>
                    </thead>

                    {allPhysicalCourses.length > 0 &&
                        <tbody className={styles.tableBodyArea}>
                            {allPhysicalCourses.map((course, index) => {
                                return (
                                    <tr key={`tableRow${index}`} className={styles.tableRow}>
                                        <td>
                                            <div className='flex'>
                                                <div className={styles.courseInfoImage}>
                                                    <Image src={course.pictureKey ? mediaUrl(course.pictureBucket, course.pictureKey) : '/images/anaOstori.png'} alt="Course Cover Image" layout="fill" objectFit="cover" priority />
                                                </div>
                                                <div className={styles.skillCourseDetails}>
                                                    <h1 className={`fontBold ${styles.courseNameHeader}`}>{course.name}</h1>
                                                    <div className={styles.coursePrice}>
                                                        <p>{course?.price} ر.س للشخص</p>
                                                        {course?.groupDiscountEligible ?
                                                            <p>500 ر.س شخصين ، 70 ر.س لـ 3 اشخاص او اكثر</p>
                                                            :
                                                            <p>{course.price * 2} ر.س شخصين ، {course.price * 3} ر.س لـ 3 اشخاص او اكثر</p>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.publishedCourseDetails}>
                                                <Switch defaultChecked={course.published} onChange={handleCoursePublished} params={course.id}
                                                />
                                                <p style={{ marginRight: '3px' }}> نشر</p>
                                            </div>
                                        </td>
                                        <td>{fullDate(course.createdAt)}</td>
                                        <td>{fullDate(course.updatedAt)}</td>
                                        <td>
                                            <div className={styles.publishedCourseDetails} >
                                                <AllIconsComponenet iconName={'personegroup'} height={18} width={24} />
                                                <p>{course.studentCount} طالب</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div onClick={() => handleEditCourse(course)}>
                                                <AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#000000'} />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    }
                </table>

                {allPhysicalCourses.length == 0 &&
                    <Empty buttonText={'إنشاء دورة'} emptyText={'ما أنشئت اي دورة'} containerhight={500} onClick={() => handleRoute()} />
                }
            </div>
        </div>
    )
}
