import React, { useEffect, useState } from 'react'
import styles from '../../../../styles/InstructorPanelStyleSheets/CourseListComponent.module.scss'
import { useRouter } from 'next/router'
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet'
import { useDispatch, useSelector } from 'react-redux'
import * as LinkConst from '../../../../constants/LinkConst';
import { getAllCourseByInstructor, updateCourseDetailsAPI } from '../../../../services/apisService'
import { fullDate } from '../../../../constants/DateConverter'
import { signOutUser } from '../../../../services/fireBaseAuthService'
import Image from 'next/legacy/image'
import Switch from '../../../../components/antDesignCompo/Switch'

export default function Index() {

    const router = useRouter()
    const courseType = router.query.courseType
    const [allPhysicalCourses, setAllPhysicalCourses] = useState([])
    const baseUrl = LinkConst.File_Base_Url2
    const dispatch = useDispatch();
    const storeData = useSelector((state) => state?.globalStore);

    const handleRoute = () => {
        router.push(`/instructorPanel/manageCourse/${courseType}/createCourse`)

        dispatch({ type: 'SET_EDIT_COURSE_DATA', editCourseData: {} })
        dispatch({ type: 'SET_IS_COURSE_EDIT', isCourseEdit: false })
    }

    useEffect(() => {
        const getAllCourse = async () => {
            let body = {
                accessToken: storeData?.accessToken,
                courseType: courseType
            }
            await getAllCourseByInstructor(body).then(res => {
                setAllPhysicalCourses(res?.data)
            }).catch(error => {
                console.log(error);
                if (error?.response?.status == 401) {
                    signOutUser()
                    dispatch({
                        type: 'EMPTY_STORE'
                    });
                }
            })
        }
        getAllCourse()
    }, [storeData?.accessToken, courseType])

    const handleEditCourse = (course) => {
        dispatch({ type: 'SET_EDIT_COURSE_DATA', editCourseData: course })
        dispatch({ type: 'SET_IS_COURSE_EDIT', isCourseEdit: true })
        router.push({
            pathname: (`/instructorPanel/manageCourse/${courseType}/editCourse`),
            query: { courseId: course?.id }
        })
    }
    const onChange = async (checked, courseId) => {
        let body = {
            data: { published: checked },
            courseId: courseId,
            accessToken: storeData?.accessToken
        }
        console.log(body);
        await updateCourseDetailsAPI(body).then((res) => {
            console.log(res);
        }).catch((error) => {
            console.log(error)
        })
    };

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
                                                    <Image src={course.pictureKey ? `${baseUrl}/${course.pictureKey}` : '/images/anaOstori.png'} alt="Course Cover Image" layout="fill" objectFit="cover" priority />
                                                </div>
                                                <div className={styles.skillCourseDetails}>
                                                    <p className={`fontBold ${styles.courseNameHeader}`}>{course.name}</p>
                                                    <div className={styles.coursePrice}>   <p>{course?.price} ر.س للشخص</p>
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
                                                <Switch defaultChecked={course.published} onChange={(e) => onChange(e, course.id)} size={'small'}></Switch>
                                                <p style={{ marginRight: '3px' }}> نشر</p>
                                            </div>
                                        </td>
                                        <td>{fullDate(course.createdAt)}</td>
                                        <td>{fullDate(course.updatedAt)}</td>
                                        <td>
                                            <div className={styles.publishedCourseDetails} >
                                                <AllIconsComponenet iconName={'personegroup'} height={18} width={24} />
                                                <p>30 طالب</p>
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
                    <div className={styles.tableBodyArea}>
                        <div className={styles.noDataManiArea} >
                            <div className={styles.noDataSubArea} >
                                <AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
                                <p className='fontBold py-2'>ما أنشئت اي دورة</p>
                                <div className={styles.createCourseBtnBox}>
                                    <button className='primarySolidBtn'>إنشاء دورة</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
