import { useRouter } from 'next/router';
import React, { use, useState } from 'react'
import styles from '../../../../../styles/InstructorPanelStyleSheets/CreateCourse.module.scss'
import CourseInfo from '../../../../../components/CreateCourseComponent/CourseInfo/CourseInfo';
import Appointment from '../../../../../components/CreateCourseComponent/Appointments/Appointment';
import ExternalCourseCard from '../../../../../components/CreateCourseComponent/ExternalCourseCard/ExternalCourseCard';
import TestsResults from '../../../../../components/CreateCourseComponent/TestsResults/TestResults';
import TheStudents from '../../../../../components/CreateCourseComponent/TheStudents/TheStudents';
import Attendance from '../../../../../components/CreateCourseComponent/Attendance/Attendance';
import { useSelector } from 'react-redux';

const CourseInitial =
{
    name: "",
    shortDescription: "",
    cardDescription: "",
    curriculumId: "",
    pictureKey: "",
    pictureBucket: "",
    pictureMime: "",
    videoKey: "",
    videoBucket: "",
    videoMime: "",
    coursePlanKey: "",
    coursePlanBucket: "",
    coursePlanMime: "",
    reviewRate: "",
    numberOfGrarduates: "",
    price: "",
    discount: "",
    locationName: "",
    location: "",
    link: "",
    type: "",
    catagoryId: "",
    groupDiscountEligible: "",
    discountForTwo: "",
    discountForThreeOrMore: "",
}



export default function Index(props, accept) {
    const storeData = useSelector((state) => state?.globalStore);
    const isCourseEdit = storeData?.isCourseEdit;
    const { courseType, courseId } = useRouter().query
    const [selectedItem, setSelectedItem] = useState(1);
    const [showExtraNavItem, setShowExtraNavItem] = useState(isCourseEdit == true)
    const [createCourseApiRes, setCreateCourseApiRes] = useState()
    // const courseId = '65ab9b76-e59f-4a36-a28d-46f18f1383eb'

    const handleItemSelect = (id) => {
        setSelectedItem(id)
    }

    return (
        <>
            <div className={styles.headerWrapper}>
                <div className='maxWidthDefault px-4'>
                    <h1 className={`head2 ${styles.createCourseHeaderText}`}>
                        {courseType == "physical" ? "إنشاء دورة حضورية" : courseType == "online" ? "إنشاء دورة مباشرة" : courseType == "onDemand" ? "إنشاء دورة مسجلة" : ""}
                    </h1>
                    <div>
                        <div className={styles.navItems}>
                            <p onClick={() => handleItemSelect(1)} className={selectedItem == 1 ? styles.activeItem : ""}>معلومات الدورة </p>
                            {showExtraNavItem &&
                                <>
                                    <p onClick={() => handleItemSelect(2)} className={selectedItem == 2 ? styles.activeItem : ""}>بطاقة الدورة الخارجية</p>
                                    <p onClick={() => handleItemSelect(3)} className={selectedItem == 3 ? styles.activeItem : ""}>المواعيد</p>
                                    <p onClick={() => handleItemSelect(4)} className={selectedItem == 4 ? styles.activeItem : ""}>الطلاب</p>
                                    <p onClick={() => handleItemSelect(5)} className={selectedItem == 5 ? styles.activeItem : ""}>نتائج الاختبارات</p>
                                    <p onClick={() => handleItemSelect(6)} className={selectedItem == 6 ? styles.activeItem : ""}>الحضور والغياب</p>
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
                        {selectedItem == 3 && <Appointment courseId={courseId} courseType={courseType} />}
                        {selectedItem == 4 && <TheStudents />}
                        {selectedItem == 5 && <TestsResults />}
                        {selectedItem == 6 && <Attendance courseId={courseId} courseType={courseType} />}
                    </div>
                </div >
            </div >
        </>
    )
}



