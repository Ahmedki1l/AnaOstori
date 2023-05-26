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

const { TextArea } = Input;

export default function Index() {
    const { courseType, createCourse } = useRouter().query
    const catagories = useSelector((state) => state?.globalStore.catagories);
    const [selectedItem, setSelectedItem] = useState(1);
    const [showExtraNavItem, setShowExtraNavItem] = useState(false)

    console.log("catagories", catagories);

    const catagoriesItem = catagories.map(function (obj) {
        return {
            label: obj.name,
            value: obj.id
        };
    });
    console.log("catagoriesItem", catagoriesItem);

    const onFinish = (values) => {
        console.log(values);
    };
    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };
    const handleItemSelect = (id) => {
        setSelectedItem(id)
    }
    const handleSubmit = () => {
        setShowExtraNavItem(true)
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
                            <p onClick={() => handleItemSelect(1)} className={selectedItem == 1 && styles.activeItem}>بطاقة الدورة الخارجية</p>
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
                        <Form onFinish={onFinish}>
                            <FormItem
                                name={'name'}
                                rules={[{ required: true }]}
                            >
                                <Input
                                    placeholder="عنوان الدورة"
                                />
                            </FormItem>
                            <FormItem
                                name={'catagoryId'}
                                rules={[{ required: true }]}
                            >
                                <Select
                                    placeholder="اختر تصنيف الدورة"
                                    OptionData={catagoriesItem}
                                // filterOption={false}
                                />
                            </FormItem>
                            <FormItem
                                name={'curriculumId'}
                                rules={[{ required: true }]}
                            >
                                <Select
                                    placeholder="اختر تصنيف الدورة"
                                    OptionData={[
                                        {
                                            label: 'Chirag',
                                            value: 'chirag'
                                        },
                                        {
                                            label: 'Hiren',
                                            value: 'hiren'
                                        },
                                        {
                                            label: 'Mayur',
                                            value: 'mayur'
                                        },
                                        {
                                            label: 'Anand',
                                            value: 'anand'
                                        },
                                    ]}
                                    filterOption={false}
                                />
                            </FormItem>
                            <div className={styles.imageUploadWrapper}></div>

                            <p className={styles.uploadImageHeader}>صورة الدورة</p>

                            <div className={styles.imageUploadWrapper}>
                                <AllIconsComponenet iconName={'uploadFile'} height={38.37} width={57} color={'#808080'} ></AllIconsComponenet>
                                <p className={styles.uploadimagetext}>ارفق الصورة هنا</p>
                            </div>

                            <p className={styles.uploadImageHeader}>فيديو الدورة</p>

                            <div className={styles.imageUploadWrapper}>
                                <AllIconsComponenet iconName={'uploadFile'} height={38.37} width={57} color={'#808080'} ></AllIconsComponenet>
                                <p className={styles.uploadimagetext}>ارفق الفيديو هنا</p>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <div className='flex'>
                                    <div className={styles.IconWrapper} >
                                        <div className={styles.dropDownArrowWrapper}><AllIconsComponenet iconName={'dropDown'} height={24} width={24} color={'#000000'}></AllIconsComponenet></div>
                                        <div> <AllIconsComponenet iconName={'location'} height={24} width={24} color={'#000000'} ></AllIconsComponenet></div>
                                    </div>
                                    <div className={styles.detailDataWrapper}>
                                        <p>تقدم الدورة في</p>
                                    </div>
                                    <FormItem
                                        name={'name'}
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            height={47}
                                            width={247}
                                            placeholder="الرياض، حي الياسمين"
                                        />
                                    </FormItem>
                                    <FormItem
                                        name={'name'}
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            height={47}
                                            width={247}
                                            placeholder="hyperlink(optional)"
                                        />
                                    </FormItem>

                                </div>
                                <div className='flex'>
                                    <div className={styles.IconWrapper} >
                                        <div className={styles.dropDownArrowWrapper}><AllIconsComponenet iconName={'dropDown'} height={24} width={24} color={'#000000'}></AllIconsComponenet></div>
                                        <div> <AllIconsComponenet iconName={'location'} height={24} width={24} color={'#000000'} ></AllIconsComponenet></div>
                                    </div>
                                    <div className={styles.detailDataWrapper}>
                                        <p>تقييم الدورة</p>
                                    </div>
                                    <FormItem
                                        name={'name'}
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            height={47}
                                            width={247}
                                            placeholder="قيمة التقييم"
                                        />
                                    </FormItem>

                                </div>
                                <div className='flex'>
                                    <div className={styles.IconWrapper} >
                                        <div className={styles.dropDownArrowWrapper}><AllIconsComponenet iconName={'dropDown'} height={24} width={24} color={'#000000'}></AllIconsComponenet></div>
                                        <div> <AllIconsComponenet iconName={'location'} height={24} width={24} color={'#000000'} ></AllIconsComponenet></div>
                                    </div>
                                    <div className={styles.detailDataWrapper}>
                                        <p>عدد الخريجين</p>
                                    </div>
                                    <FormItem
                                        name={'name'}
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            height={47}
                                            width={247}
                                            placeholder="قيمة عدد الخريجين"
                                        />
                                    </FormItem>

                                </div>
                            </div>
                            <p className={styles.bottomInputText}>تسعيرة الدورة</p>
                            <FormItem
                                name={'name'}
                                rules={[{ required: true }]}
                            >
                                <Input
                                    placeholder="سعر الدورة للشخص"
                                />
                            </FormItem>
                            <FormItem
                                name={'discount'}
                            >
                                <CheckBox
                                    label={'الدورة تحتوي على خصم'}
                                />
                            </FormItem>
                            <FormItem
                                name={'discount'}
                            >
                                <CheckBox
                                    label={'امكانية التسجيل كمجموعات'}
                                />
                            </FormItem>
                            <FormItem>
                                <div className={styles.saveCourseBtnBox}>
                                    <button className={`primarySolidBtn `} onClick={() => handleSubmit()}>حفظ ومتابعة</button>
                                </div>
                            </FormItem>
                        </Form>
                    </div>
                </div >
            </div >
        </>
    )
}