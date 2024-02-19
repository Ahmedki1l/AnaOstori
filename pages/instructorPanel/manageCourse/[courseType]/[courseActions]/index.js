import { useRouter } from 'next/router';
import React, { use, useEffect, useState } from 'react'
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
import { dateRange } from '../../../../../constants/DateConverter';

export default function Index() {

    const courseId = useRouter().query.courseId
    const courseType = useRouter().query.courseType
    const [selectedItem, setSelectedItem] = useState(1);
    const storeData = useSelector((state) => state?.globalStore);
    const dispatch = useDispatch();
    const router = useRouter()
    const isCourseEdit = storeData?.isCourseEdit;
    const editCourseData = storeData?.editCourseData;
    const [showExtraNavItem, setShowExtraNavItem] = useState(isCourseEdit == true)
    const [createCourseApiRes, setCreateCourseApiRes] = useState()
    const courseName = isCourseEdit ? editCourseData?.name : createCourseApiRes?.name ? createCourseApiRes?.name : undefined
    const [availabilityList, setAvailabilityList] = useState([])
    const availabilityId = router?.query?.availabilityId
    const selectedaAvailabilityId = availabilityList?.filter((item) => availabilityId?.includes(item.id))[0]
    const [tabShown, setTabShown] = useState({
        firstTab: false,
        secondTab: false,
        thirdTab: false,
        fourthTab: false,
        fifthTab: false,
        sixthTab: false,
    })
    const handleItemSelect = (id) => {
        setSelectedItem(id)
    }
    const getAllAvailability = async () => {
        if (!courseId) {
            return;
        }
        let body = {
            routeName: 'availabilityByCourse',
            courseId: courseId,
            gender: "all"
        }
        await getAuthRouteAPI(body).then(res => {
            setAvailabilityList(res?.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
            dispatch({
                type: 'SET_AllAVAILABILITY',
                availabilityList: res?.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
            })
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getAuthRouteAPI(body).then(res => {
                        setAvailabilityList(res?.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
                        dispatch({
                            type: 'SET_AllAVAILABILITY',
                            availabilityList: res?.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
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

    useEffect(() => {
        if (router.query.selectedTab) {
            router.query.selectedTab && setSelectedItem(router.query.selectedTab)
        }
        setTabShown({
            firstTab: (router?.query?.courseActions != "appointments" ? true : false),
            secondTab: (router?.query?.courseActions == "editCourse" ? true : false),
            thirdTab: (courseType != 'onDemand' && router?.query?.courseActions == 'editCourse' ? true : false),
            fourthTab: (((courseType == 'onDemand' && router?.query?.courseActions == 'editCourse') || (courseType != 'onDemand' && router?.query?.courseActions == 'appointments')) ? true : false),
            fifthTab: (((courseType == 'onDemand' && router?.query?.courseActions == 'editCourse') || (courseType != 'onDemand' && router?.query?.courseActions == 'appointments')) ? true : false),
            sixthTab: (courseType != 'onDemand' && router?.query?.courseActions == 'appointments' ? true : false),
        })
    }, [router])

    const handleLinkClick = () => {
        router.push(`/instructorPanel/manageCourse/${courseType}/editCourse?courseId=${courseId}`)
        setSelectedItem(3);
    };
    const backPathItemsArray = [
        { lable: 'صفحة الأدمن الرئيسية', handleClick: () => router.push(`/instructorPanel`) },
        { lable: 'إضافة وإدارة الدورات', handleClick: () => router.push('/instructorPanel/manageCourse') },
        {
            lable: courseType == "physical" ? 'الدورات الحضورية' : courseType == "online" ? 'الدورات المباشرة' : 'الدورات المسجلة',
            handleClick: router.query.courseActions == 'appointments' ? handleLinkClick : null
        },
    ]
    if (router?.query?.courseActions == "appointments") {
        backPathItemsArray.push(
            { lable: courseName, handleClick: () => router.push(`/instructorPanel/manageCourse/${courseType}`) },
            { lable: 'تفاصيل الموعد', link: null }
        )
    }
    return (
        <>
            <div className={styles.headerWrapper}>
                <div className='maxWidthDefault px-4'>
                    <BackToPath
                        backpathForTabel={true}
                        backPathArray={backPathItemsArray}
                    />
                    <div className='flex'>
                        <h1 className={`head2 ${styles.createCourseHeaderText}`}>{`${courseName ? `${courseName} ` : courseType == "physical" ? 'الدورات الحضورية' : courseType == "online" ? 'الدورات المباشرة' : 'الدورات المسجلة'}`}</h1>
                        {selectedaAvailabilityId && <h1 className={`head2 mr-2 ${styles.createCourseHeaderText}`}>, {dateRange(selectedaAvailabilityId.dateFrom, selectedaAvailabilityId.dateTo)}</h1>}
                    </div>
                    <div>
                        <div className={styles.navItems}>
                            {tabShown.firstTab && <p onClick={() => handleItemSelect(1)} className={selectedItem == 1 ? styles.activeItem : ""}>معلومات الدورة </p>}
                            <>
                                {tabShown.secondTab && <p onClick={() => handleItemSelect(2)} className={selectedItem == 2 ? styles.activeItem : ""}>بطاقة الدورة الخارجية</p>}
                                {tabShown.thirdTab && <p onClick={() => handleItemSelect(3)} className={selectedItem == 3 ? styles.activeItem : ""}>المواعيد</p>}
                                {tabShown.fourthTab && <p onClick={() => handleItemSelect(4)} className={selectedItem == 4 ? styles.activeItem : ""}>الطلاب</p>}
                                {tabShown.fifthTab && <p onClick={() => handleItemSelect(5)} className={selectedItem == 5 ? styles.activeItem : ""}>نتائج الاختبارات</p>}
                                {tabShown.sixthTab && <p onClick={() => handleItemSelect(6)} className={selectedItem == 6 ? styles.activeItem : ""}>الحضور والغياب</p>}
                            </>
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
                        {selectedItem == 3 && <Appointment setSelectedItem={setSelectedItem} courseId={courseId} courseType={courseType} getAllAvailability={getAllAvailability} availabilityList={availabilityList} />}
                        {selectedItem == 4 && <TheStudents courseId={courseId} courseType={courseType} />}
                        {selectedItem == 5 && <TestsResults courseId={courseId} courseType={courseType} />}
                        {selectedItem == 6 && <Attendance courseId={courseId} />}
                    </div>
                </div >
            </div >
        </>
    )
}


