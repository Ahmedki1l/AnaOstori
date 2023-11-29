import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import styles from '../../../../../styles/InstructorPanelStyleSheets/CreateCourse.module.scss'
import CourseInfo from '../../../../../components/CreateCourseComponent/CourseInfo/CourseInfo';
import Appointment from '../../../../../components/CreateCourseComponent/Appointments/Appointment';
import ExternalCourseCard from '../../../../../components/CreateCourseComponent/ExternalCourseCard/ExternalCourseCard';
import TestsResults from '../../../../../components/CreateCourseComponent/TestsResults/TestResults';
import TheStudents from '../../../../../components/CreateCourseComponent/TheStudents/TheStudents';
import Attendance from '../../../../../components/CreateCourseComponent/Attendance/Attendance';
import { useSelector } from 'react-redux';
import { getAuthRouteAPI } from '../../../../../services/apisService';
import { useDispatch } from 'react-redux';
import BackToPath from '../../../../../components/CommonComponents/BackToPath';
import { getNewToken } from '../../../../../services/fireBaseAuthService';

export default function Index() {
    // const { courseType, courseId } = useRouter().query
    const courseId = useRouter().query.courseId
    const courseType = useRouter().query.courseType
    const [selectedItem, setSelectedItem] = useState(1);
    const storeData = useSelector((state) => state?.globalStore);
    const dispatch = useDispatch();
    const isCourseEdit = storeData?.isCourseEdit;
    const editCourseData = storeData?.editCourseData;
    const [showExtraNavItem, setShowExtraNavItem] = useState(isCourseEdit == true)
    const [createCourseApiRes, setCreateCourseApiRes] = useState()
    const courseName = isCourseEdit ? editCourseData?.name : createCourseApiRes?.name ? createCourseApiRes?.name : undefined
    const handleItemSelect = (id) => {
        setSelectedItem(id)
    }

    const getAllAvailability = async () => {
        console.log("value");
        if (!courseId) {
            return;
        }
        let body = {
            routeName: 'availabilityByCourse',
            courseId: courseId,
            gender: "all"
        }
        await getAuthRouteAPI(body).then(res => {
            console.log("res", res);
            dispatch({
                type: 'SET_AllAVAILABILITY',
                availabilityList: res?.data.sort((a, b) => a.createdAt - b.createdAt),
            })
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getAuthRouteAPI(body).then(res => {
                        dispatch({
                            type: 'SET_AllAVAILABILITY',
                            availabilityList: res?.data,
                        })
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }
    useEffect(() => {
        getAllAvailability();
    }, [courseId]);

    return (
        <>
            <div className={styles.headerWrapper}>
                <div className='maxWidthDefault px-4'>
                    <div>
                        <BackToPath
                            backpathForPage={true}
                            backPathArray={
                                [
                                    { lable: 'صفحة الأدمن الرئيسية', link: `/instructorPanel` },
                                    { lable: 'إدارة وإضافة الدورات', link: '/instructorPanel/manageCourse' },
                                    { lable: courseName ? courseName : courseType == "physical" ? 'الدورات الحضورية' : courseType == "online" ? 'الدورات المباشرة' : 'الدورات المسجلة', link: null },
                                    // {lable: courseName ? courseName : courseType == "on-demand" ? 'الدورات المسجلة' : '', link: null }
                                ]
                            }
                        />
                    </div>
                    <h1 className={`head2 ${styles.createCourseHeaderText}`}>
                        {courseName ? courseName : courseType == "physical" ? 'الدورات الحضورية' : courseType == "online" ? 'الدورات المباشرة' : 'الدورات المسجلة'}
                    </h1>
                    <div>
                        <div className={styles.navItems}>
                            <p onClick={() => handleItemSelect(1)} className={selectedItem == 1 ? styles.activeItem : ""}>معلومات الدورة </p>
                            {showExtraNavItem &&
                                <>
                                    <p onClick={() => handleItemSelect(2)} className={selectedItem == 2 ? styles.activeItem : ""}>بطاقة الدورة الخارجية</p>
                                    {courseType != "onDemand" && <p onClick={() => handleItemSelect(3)} className={selectedItem == 3 ? styles.activeItem : ""}>المواعيد</p>}
                                    <p onClick={() => handleItemSelect(4)} className={selectedItem == 4 ? styles.activeItem : ""}>الطلاب</p>
                                    <p onClick={() => handleItemSelect(5)} className={selectedItem == 5 ? styles.activeItem : ""}>نتائج الاختبارات</p>
                                    {courseType != "onDemand" && <p onClick={() => handleItemSelect(6)} className={selectedItem == 6 ? styles.activeItem : ""}>الحضور والغياب</p>}
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.bodyWrapper}>
                <div className='maxWidthDefault p-4'>
                    <div className={styles.bodysubWrapper}>
                        {selectedItem == 1 &&
                            <CourseInfo
                                setShowExtraNavItem={setShowExtraNavItem}
                                setCreateCourseApiRes={setCreateCourseApiRes}
                                courseType={courseType}
                                setSelectedItem={setSelectedItem}
                            />}
                        {selectedItem == 2 && <ExternalCourseCard createCourseApiRes={createCourseApiRes} setSelectedItem={setSelectedItem} />}
                        {selectedItem == 3 && courseType != "on-demand" && <Appointment courseId={courseId} courseType={courseType} getAllAvailability={getAllAvailability} />}
                        {selectedItem == 4 && <TheStudents courseId={courseId} courseType={courseType} />}
                        {selectedItem == 5 && <TestsResults courseId={courseId} courseType={courseType} />}
                        {selectedItem == 6 && <Attendance courseId={courseId} />}
                    </div>
                </div >
            </div >
        </>
    )
}


