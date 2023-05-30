import { useRouter } from 'next/router';
import React, { useState } from 'react'
import styles from '../../../../../styles/InstructorPanelStyleSheets/CreateCourse.module.scss'
import AllIconsComponenet from '../../../../../Icons/AllIconsComponenet';
import { useSelector } from 'react-redux';
import Select from '../../../../../components/antDesignCompo/Select';
import { Dropdown, Form, Space } from 'antd';
import { FormItem } from '../../../../../components/antDesignCompo/FormItem';
import Input from '../../../../../components/antDesignCompo/Input';
import CheckBox from '../../../../../components/antDesignCompo/CheckBox';
import InputTextArea from '../../../../../components/antDesignCompo/InputTextArea';
import { PlusOutlined } from '@ant-design/icons';
import { Dialog, DialogContent } from '@mui/material';
import * as LinkConst from '../../../../../constants/LinkConst';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Upload from '../../../../../components/antDesignCompo/Upload';
import UploadFile from '../../../../../components/CommonComponents/UploadFile/UploadFile';
import CourseInfo from '../../../../../components/CreateCourseComponent/CourseInfo/CourseInfo';

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
    const { courseType, createCourse } = useRouter().query
    const storeData = useSelector((state) => state?.globalStore);
    const catagories = storeData?.catagories;
    const curriculumIds = storeData?.curriculumIds
    const [selectedItem, setSelectedItem] = useState(1);
    const [showExtraNavItem, setShowExtraNavItem] = useState(false)
    const [showCourseMetaDataFields, setShowCourseMetaDataFields] = useState(false)
    const [imageList, setImageList] = useState([]);
    // const [courseDetailObj, setCourseDetailObj] = useState([
    //     {
    //         title: '',
    //         text: '',
    //         link: '',
    //         seprateText: '',
    //         seprateTextLink: '',
    //     }
    // ])
    // const [courseDetailsMetaData, setCourseDetailsMetaData] = useState([
    //     {
    //         text: '',
    //         link: '',
    //         textSeprate: '',
    //         linkToSeprateText: '',
    //     }
    // ])

    const [courseData, setCourseData] = useState(CourseInitial)



    const catagoriesItem = catagories.map(function (obj) {
        return {
            label: obj.name,
            value: obj.id
        };
    });
    const curriculum = curriculumIds.map(function (obj) {
        return {
            label: obj.name,
            value: obj.id
        }
    })
    console.log("curriculum", curriculum);

    const onFinish = (values) => {
        console.log(values);
        setShowExtraNavItem(true)
        setShowCourseMetaDataFields(true)
    };
    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };
    const handleItemSelect = (id) => {
        setSelectedItem(id)
    }
    const handleCreateCourse = () => {
    }




    return (

        <>
            <div className={styles.headerWrapper}>
                <div className='maxWidthDefault px-4'>
                    <h1 className={`head2 ${styles.createCourseHeaderText}`}>
                        {courseType == "physicalCourse" ? "إنشاء دورة حضورية" : courseType == "onlineCourse" ? "إنشاء دورة مباشرة" : "إنشاء دورة مسجلة"}
                    </h1>

                    <div>
                        <div className={styles.navItems}>

                            <p onClick={() => handleItemSelect(1)} className={selectedItem == 1 && styles.activeItem}>معلومات الدورة </p>

                            {showExtraNavItem &&
                                <>
                                    <p onClick={() => handleItemSelect(2)} className={selectedItem == 2 && styles.activeItem}>بطاقة الدورة الخارجية</p>
                                    <p onClick={() => handleItemSelect(3)} className={selectedItem == 3 && styles.activeItem}>المواعيد</p>
                                    <p onClick={() => handleItemSelect(4)} className={selectedItem == 4 && styles.activeItem}>الطلاب</p>
                                    <p onClick={() => handleItemSelect(5)} className={selectedItem == 5 && styles.activeItem}>نتائج الاختبارات</p>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.bodyWrapper}>
                <div className='maxWidthDefault p-4'>
                    <div className={styles.bodysubWrapper}>
                        {selectedItem == 1 && <CourseInfo />}
                        {selectedItem == 2 && <Appointments />}
                        {selectedItem == 3 && <ExternalCourseCard />}
                        {selectedItem == 4 && <TestsResults />}
                        {selectedItem == 5 && <TheStudents />}

                    </div>
                </div >
            </div >
        </>
    )
}