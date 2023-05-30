import React, { useState } from 'react';
import { useSelector, } from 'react-redux';
import { Dropdown, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Dialog, DialogContent } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { FormItem } from '../../antDesignCompo/FormItem';
import InputTextArea from '../../antDesignCompo/InputTextArea';
import styles from './CourseInfo.module.scss'
import Upload from '../../antDesignCompo/Upload';
import UploadFile from '../../CommonComponents/UploadFile/UploadFile';
import CheckBox from '../../antDesignCompo/CheckBox';
import Input from '../../antDesignCompo/Input';
import Select from '../../antDesignCompo/Select';



const CourseInfo = () => {
    const storeData = useSelector((state) => state?.globalStore);
    const catagories = storeData?.catagories;
    const curriculumIds = storeData?.curriculumIds
    const [showExtraNavItem, setShowExtraNavItem] = useState(false)
    const [showCourseMetaDataFields, setShowCourseMetaDataFields] = useState(false)
    const [imageList, setImageList] = useState([]);


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

    const handleCreateCourse = () => {
    }

    return (
        <div>
            <Form onFinish={onFinish}>
                <div className='px-6'>
                    <FormItem
                        name={'name'}
                        rules={[{ required: true }]}  >
                        <Input
                            placeholder="عنوان الدورة" />
                    </FormItem>
                    <FormItem
                        name={'catagoryId'}
                        rules={[{ required: true }]} >
                        <Select
                            placeholder="اختر تصنيف الدورة"
                            OptionData={catagoriesItem} />
                    </FormItem>
                    <FormItem
                        name={'curriculumId'}
                        rules={[{ required: true }]}  >
                        <Select
                            placeholder="اختر تصنيف الدورة"
                            OptionData={curriculum}
                            filterOption={false} />
                    </FormItem>
                    <FormItem
                        name={'shortDescription'}
                        rules={[{ required: true }]}>
                        <InputTextArea
                            height={274}
                            width={549}
                            placeholder="وصف الدورة">
                        </InputTextArea>
                    </FormItem>

                    <p className={styles.uploadImageHeader}>صورة الدورة</p>

                    <div className={styles.imageUploadWrapper}>
                        <Upload
                            listType={"picture-card"}
                            label={'ارفق الصورة هنا'}
                            setUploadFileList={setImageList}
                            accept={"file"}
                        />
                    </div>


                    <p className={styles.uploadImageHeader}>صورة الدورة</p>
                    <div className={styles.imageUploadWrapper}>
                        <UploadFile
                            accept={"image"}
                            label={'ارفق الفيديو هنا'}
                        />
                    </div>

                    <p className={styles.uploadImageHeader}>فيديو الدورة</p>
                    <div className={styles.imageUploadWrapper}>
                        <UploadFile
                            accept={"video"}
                            label={'ارفق الفيديو هنا'}
                        />
                    </div>


                    <div style={{ marginTop: '20px' }}>
                        <div className='flex'>
                            <div className={styles.IconWrapper} >
                                <div className={styles.dropDownArrowWrapper}><AllIconsComponenet iconName={'dropDown'} height={24} width={24} color={'#000000'}></AllIconsComponenet></div>
                                <div className='flex justify-center items-center h-100'> <AllIconsComponenet iconName={'location'} height={24} width={24} color={'#000000'} ></AllIconsComponenet></div>
                            </div>
                            <div className={styles.detailDataWrapper}>
                                <p>تقدم الدورة في</p>
                            </div>
                            <FormItem
                                name={'locationName'}
                                rules={[{ required: true }]} >
                                <Input
                                    height={47}
                                    width={247}
                                    placeholder="الرياض، حي الياسمين" />
                            </FormItem>
                            <FormItem
                                name={'location'}
                                rules={[{ required: true }]}  >
                                <Input
                                    height={47}
                                    width={247}
                                    placeholder="hyperlink(optional)" />
                            </FormItem>

                        </div>
                        <div className='flex'>
                            <div className={styles.IconWrapper} >
                                <div className={styles.dropDownArrowWrapper}><AllIconsComponenet iconName={'dropDown'} height={24} width={24} color={'#000000'}></AllIconsComponenet></div>
                                <div className='flex justify-center items-center h-100'>  <AllIconsComponenet iconName={'star'} height={24} width={24} color={'#FFCD3C'} ></AllIconsComponenet></div>
                            </div>
                            <div className={styles.detailDataWrapper}>
                                <p>تقييم الدورة</p>
                            </div>
                            <FormItem
                                name={'reviewRate'}
                                rules={[{ required: true }]} >
                                <Input
                                    height={47}
                                    width={247}
                                    placeholder="قيمة التقييم" />
                            </FormItem>

                        </div>
                        <div className='flex'>
                            <div className={styles.IconWrapper} >
                                <div className={styles.dropDownArrowWrapper}><AllIconsComponenet iconName={'dropDown'} height={24} width={24} color={'#000000'}></AllIconsComponenet></div>
                                <div className='flex justify-center items-center h-100'><AllIconsComponenet iconName={'graduate'} height={24} width={24} color={'#000000'} ></AllIconsComponenet></div>
                            </div>
                            <div className={styles.detailDataWrapper}>
                                <p>عدد الخريجين</p>
                            </div>
                            <FormItem
                                name={'numberOfGrarduates'}
                                rules={[{ required: true }]} >
                                <Input
                                    height={47}
                                    width={247}
                                    placeholder="قيمة عدد الخريجين" />
                            </FormItem>
                        </div>
                    </div>
                    <p className={styles.bottomInputText}>تسعيرة الدورة</p>
                    <FormItem
                        name={'price'}
                        rules={[{ required: true }]}>
                        <Input placeholder="سعر الدورة للشخص" />
                    </FormItem>
                    <FormItem
                        name={'discount'} >
                        <CheckBox label={'الدورة تحتوي على خصم'} />
                    </FormItem>
                    <FormItem name={'groupDiscountEligible'} >
                        <CheckBox
                            label={'امكانية التسجيل كمجموعات'} />
                    </FormItem>
                    {!showCourseMetaDataFields &&
                        <FormItem>
                            <div className={styles.saveCourseBtnBox}>
                                <button className='primarySolidBtn' htmltype='submit' onClick={() => handleCreateCourse()}>حفظ ومتابعة</button>
                            </div>
                        </FormItem>
                    }
                </div>
                {showCourseMetaDataFields &&
                    <>
                        <div className={styles.borderline}>
                            <div className="w-[95%] p-6">
                                <div>
                                    <Form.List name="courseDetails">
                                        {(fields, { add, remove }) => (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                                                    <p className={styles.secDetails}>تفاصيل الدورة</p>
                                                    <p className={styles.addDetails} onClick={() => add()}>+ إضافة</p>
                                                </div>
                                                {fields.map((field, index) => (
                                                    <div className={styles.courseDetails}>
                                                        <div style={{ margin: '10px' }} >
                                                            <div className='flex justify-center items-center h-100'>  <AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#FFCD3C'} ></AllIconsComponenet></div>
                                                        </div>
                                                        <FormItem
                                                            name={[index, 'title']}
                                                            marginleft={'0'}
                                                            rules={[{ required: true }]} >
                                                            <Input
                                                                height={47}
                                                                width={211}
                                                                placeholder="العنوان" />
                                                        </FormItem>
                                                        <FormItem
                                                            name={[index, 'text']}
                                                            marginleft={'0'}
                                                            rules={[{ required: true }]} >
                                                            <Input
                                                                height={47}
                                                                width={216}
                                                                placeholder="النص" />
                                                        </FormItem>
                                                        <FormItem
                                                            name={[index, 'link']}
                                                            marginleft={'0'}
                                                            rules={[{ required: true }]} >
                                                            <Input
                                                                height={47}
                                                                width={216}
                                                                placeholder="النص" />
                                                        </FormItem>
                                                        <FormItem
                                                            name={[index, 'seprateText']}
                                                            marginleft={'0'}
                                                            rules={[{ required: true }]} >
                                                            <Input
                                                                height={47}
                                                                width={216}
                                                                placeholder="نص منفصل" />
                                                        </FormItem>
                                                        <FormItem
                                                            name={[index, 'seprateTextLink']}
                                                            marginleft={'0'}
                                                            rules={[{ required: true }]} >
                                                            <Input
                                                                height={47}
                                                                width={216}
                                                                placeholder="رابط للنص المنفصل" />
                                                        </FormItem>
                                                        <div className={styles.DeleteIconWrapper} >
                                                            <div className='flex justify-center items-center h-100' onClick={() => remove(index)}>  <AllIconsComponenet iconName={'deletecourse'} height={700} width={700} color={'#FFCD3C'} ></AllIconsComponenet></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </Form.List>
                                </div>
                            </div>
                        </div>

                        <div className={styles.borderline}>
                            <div className="w-[95%] p-6">
                                <Form.List name="courseDetailsMetaData">
                                    {(fields, { add, remove }) => (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <p className={styles.secDetails}>تفاصيل ثانية</p>
                                                <p className={styles.addDetails} onClick={() => add()} >+ إضافة</p>
                                            </div>
                                            {fields.map((field, index) => (
                                                <div className={styles.courseDetails}>
                                                    <div style={{ margin: '10px' }} >
                                                        <div className='flex justify-center items-center h-100'>  <AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#FFCD3C'} ></AllIconsComponenet></div>
                                                    </div>
                                                    <div className={styles.IconWrapper} >
                                                        <div className={styles.dropDownArrowWrapper}><AllIconsComponenet iconName={'dropDown'} height={24} width={24} color={'#000000'}></AllIconsComponenet></div>
                                                        <div className='flex justify-center items-center h-100'><AllIconsComponenet iconName={'graduate'} height={24} width={24} color={'#000000'} ></AllIconsComponenet></div>
                                                    </div>
                                                    <FormItem
                                                        name={[index, 'text']}
                                                        marginleft={'0'}
                                                        rules={[{ required: true }]} >
                                                        <Input
                                                            height={47}
                                                            width={295}
                                                            placeholder="النص" />
                                                    </FormItem>
                                                    <FormItem
                                                        name={[index, 'link']}
                                                        marginleft={'0'}
                                                        rules={[{ required: true }]} >
                                                        <Input
                                                            height={47}
                                                            width={284}
                                                            placeholder="النص" />
                                                    </FormItem>
                                                    <FormItem
                                                        name={[index, 'textSeprate']}
                                                        marginleft={'0'}
                                                        rules={[{ required: true }]} >
                                                        <Input
                                                            height={47}
                                                            width={216}
                                                            placeholder="نص منفصل" />
                                                    </FormItem>
                                                    <FormItem
                                                        name={[index, 'linkToSeprateText']}
                                                        marginleft={'0'}
                                                        rules={[{ required: true }]} >
                                                        <Input
                                                            height={47}
                                                            width={216}
                                                            placeholder="رابط للنص المنفصل" />
                                                    </FormItem>
                                                    <div className={styles.DeleteIconWrapper} >
                                                        <div className='flex justify-center items-center h-100' onClick={() => remove(index)}>  <AllIconsComponenet iconName={'deletecourse'} height={700} width={700} color={'#FFCD3C'} ></AllIconsComponenet></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </Form.List>
                            </div>
                        </div>
                    </>
                }
                {showCourseMetaDataFields &&
                    <div className="w-[95%] p-6">
                        <div className='flex'>
                            <div className={styles.saveCourseBtnBox} >
                                <button className={`primarySolidBtn `} htmltype='submit' >حفظ</button>
                            </div>
                            <div className={`${styles.saveCourseBtnBox} mr-2`}>
                                <button className={`primaryStrockedBtn`} >نشر الدورة</button>
                            </div>
                        </div>
                    </div>
                }
            </Form>
        </div>
    )
}

export default CourseInfo