import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'antd';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { FormItem } from '../../antDesignCompo/FormItem';
import InputTextArea from '../../antDesignCompo/InputTextArea';
import styles from './CourseInfo.module.scss'
import UploadFile from '../../CommonComponents/UploadFile/UploadFile';
import CheckBox from '../../antDesignCompo/CheckBox';
import Input from '../../antDesignCompo/Input';
import Select from '../../antDesignCompo/Select';
import { createCourseByInstructorAPI, createCourseDetailsMetaDataAPI, createCourseMetaDataAPI } from '../../../services/apisService';
import { signOutUser } from '../../../services/fireBaseAuthService';
import SelectIcon from '../../antDesignCompo/SelectIcon';

const { Option } = Select;

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

const courseDetailsInitial = {
    title: '',
    text: '',
    link: '',
    seprateText: '',
    seprateTextLink: '',
}

const courseDetailsMetaDataInitials = {
    link: '',
    text: '',
    textSeprate: '',
    linkToSeprateText: '',
}



const CourseInfo = ({ setShowExtraNavItem, setCreateCourseApiRes, courseType, setSelectedItem }) => {

    const storeData = useSelector((state) => state?.globalStore);
    const catagories = storeData?.catagories;
    const curriculumIds = storeData?.curriculumIds
    const [showCourseMetaDataFields, setShowCourseMetaDataFields] = useState(false)
    const [courseData, setCourseData] = useState(CourseInitial)
    const [imageUploadResponceData, setImageUploadResponceData] = useState();
    const [discountedPrice, setDiscountedPrice] = useState(false)
    const [groupDiscountEligible, setGroupDiscountEligible] = useState(false)
    const [courseDetails, setCourseDetails] = useState([courseDetailsInitial])
    const [courseDetailsMetaData, setCourseDetailsMetaData] = useState([courseDetailsMetaDataInitials])
    const [iconValue, setIconValue] = useState('')
    const [newcreatedCourse, setNewCreatedCourse] = useState()
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const catagoriesItem = catagories.map((obj) => {
        return {
            key: obj.id,
            label: obj.name,
            value: obj.id
        };
    });
    const curriculum = curriculumIds.map((obj) => {
        return {
            key: obj.id,
            label: obj.name,
            value: obj.id
        }
    })
    const onFinishCreateCourse = async (values) => {
        console.log(values);
        values.pictureKey = imageUploadResponceData?.key,
            values.pictureBucket = imageUploadResponceData?.bucket,
            values.pictureMime = imageUploadResponceData?.mime,
            values.groupDiscountEligible = groupDiscountEligible;
        values.type = courseType

        delete values.priceForTwo;
        delete values.PriceForThreeorMore;

        console.log(values);
        let body = {
            data: values,
            accessToken: storeData?.accessToken
        }
        await createCourseByInstructorAPI(body).then((res) => {
            setShowExtraNavItem(true)
            setShowCourseMetaDataFields(true)
            setCreateCourseApiRes(res.data)
            setNewCreatedCourse(res.data)
            console.log(res);
        }).catch((error) => {
            console.log(error);
            if (error?.response?.status == 401) {
                signOutUser()
                dispatch({
                    type: 'EMPTY_STORE'
                });
            }
        })
    };

    const onFinishAddCourseExtraDetails = async (values) => {
        const arrayOfValues = Object.values(values).map(obj => obj);
        console.log(arrayOfValues);
        let courseMetadata = arrayOfValues.map((obj, index) => {
            return {
                order: (`${index + 1}`),
                title: obj.cd_title,
                content: obj.cd_content,
                link: obj.cd_link,
                tailLinkName: obj.cd_tailLinkName,
                tailLink: obj.cd_tailLink,
            }
        })

        let courseDetailMetadata = arrayOfValues.map((obj, index) => {
            return {
                order: (`${index + 1}`),
                icon: obj.cdmd_icon,
                text: obj.cdmd_text,
                link: obj.cdmd_link,
                tailLinkName: obj.cdmd_textSeprate,
                tailLink: obj.cdmd_linkToSeprateText,
            }
        })
        console.log(courseMetadata);
        console.log(courseDetailMetadata);
        let body1 = {
            data: {
                data: courseDetailMetadata,
                courseId: newcreatedCourse.id
            },
            accessToken: storeData?.accessToken
        }
        let body2 = {
            data: {
                data: courseMetadata,
                courseId: newcreatedCourse.id
            },
            accessToken: storeData?.accessToken
        }
        // await createCourseCardMetaDataAPI (body).then((res)=>{
        //     console.log(res.data);
        // }).catch((error)=>{
        //     console.log(error);
        // })
        try {
            const courseDetailMetaDataReq = createCourseDetailsMetaDataAPI(body1)
            const courseMetaDataReq = createCourseMetaDataAPI(body2)
            const [courseDetailMetaData, courseMetaData] = await Promise.all([courseDetailMetaDataReq, courseMetaDataReq])
            setShowExtraNavItem(true)
            setSelectedItem(2)
            form.resetFields()
            console.log(courseDetailMetaData, courseMetaData);
        } catch (error) {
            console.log(error);
        }
    }

    const onChangeCheckBox = (e, checkboxName) => {
        console.log(checkboxName);
        console.log(e);
        if (checkboxName == 'discount') {
            setDiscountedPrice(e.target.checked)
        }
        else {
            setGroupDiscountEligible(e.target.checked)
        }
    }
    const handleAdd = (arrayName) => {
        if (arrayName == 'courseDetails') {
            setCourseDetails(courseDetails => [...courseDetails, JSON.parse(JSON.stringify(courseDetailsInitial))])
        } else {
            setCourseDetailsMetaData(courseDetailsMetaData => [...courseDetailsMetaData, JSON.parse(JSON.stringify(courseDetailsMetaDataInitials))])
        }
    }
    const handleRemove = (arrayName, id) => {
        if (id == 0) return
        if (arrayName == 'courseDetails') {
            let filteredData = [...courseDetails]
            console.log(filteredData);
            filteredData.splice(id, 1)
            setCourseDetails(filteredData)
        } else {
            let filteredData = [...courseDetailsMetaData]
            filteredData.splice(id, 1)
            setCourseDetailsMetaData(filteredData)
        }
    }

    const handleChange = (value) => {
        setAddMultipleIcon(`selected ${value}`);
        console.log(handleChange);
    };

    return (
        <div>
            <Form form={form} onFinish={onFinishCreateCourse}>
                <div className='px-6'>
                    <FormItem
                        name={'name'}
                        rules={[{ required: true }]}  >
                        <Input
                            placeholder="عنوان الدورة"
                            value={courseData.name} />
                    </FormItem>
                    <FormItem
                        name={'catagoryId'}
                        rules={[{ required: true }]} >
                        <Select
                            placeholder="اختر تصنيف الدورة"
                            value={courseData.catagoryId}
                            OptionData={catagoriesItem} />
                    </FormItem>
                    <FormItem
                        name={'curriculumId'}
                        rules={[{ required: true }]}  >
                        <Select
                            placeholder="اختر تصنيف الدورة"
                            value={courseData.curriculumId}
                            OptionData={curriculum}
                            filterOption={false} />
                    </FormItem>
                    <FormItem
                        name={'shortDescription'}
                        rules={[{ required: true }]}>
                        <InputTextArea
                            height={274}
                            width={549}
                            placeholder="وصف الدورة"
                            value={courseData.shortDescription}>
                        </InputTextArea>
                    </FormItem>
                    <p className={styles.uploadImageHeader}>صورة الدورة</p>
                    <div className={styles.imageUploadWrapper}>
                        <UploadFile
                            setImageUploadResponceData={setImageUploadResponceData}
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
                                    placeholder="الرياض، حي الياسمين"
                                    value={courseData.locationName} />
                            </FormItem>
                            <FormItem
                                name={'location'}
                                rules={[{ required: true }]}  >
                                <Input
                                    height={47}
                                    width={247}
                                    placeholder="hyperlink(optional)"
                                    value={courseData.location} />
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
                                    placeholder="قيمة التقييم"
                                    value={courseData.reviewRate} />
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
                                    placeholder="قيمة عدد الخريجين"
                                    value={courseData.numberOfGrarduates} />
                            </FormItem>
                        </div>
                    </div>
                    <p className={styles.bottomInputText}>تسعيرة الدورة</p>
                    <div style={{ display: 'flex' }}>
                        <FormItem
                            name={'price'}
                            rules={[{ required: true }]}>
                            <Input
                                placeholder="سعر الدورة للشخص"
                                value={courseData.price}
                            />
                        </FormItem>
                        {discountedPrice &&
                            <FormItem
                                name={'discount'}
                                rules={[{ required: true }]}  >
                                <Input
                                    value={courseData.discount}
                                    placeholder="السعر بعد الخصم للشخص"
                                />
                            </FormItem>
                        }
                    </div>
                    {groupDiscountEligible &&
                        <div className='flex'>
                            <div>
                                <FormItem
                                    name={'priceForTwo'}
                                    rules={[{ required: true }]} >
                                    <Input
                                        value={courseData.price * 2}
                                        placeholder="سعر الدورة لشخصين"
                                    />
                                </FormItem>
                                <FormItem
                                    name={'PriceForThreeorMore'}
                                    rules={[{ required: true }]} >
                                    <Input
                                        value={courseData.price * 3}
                                        placeholder="سعر الدورة لثلاثة اشخاص واكثر"
                                    />
                                </FormItem>
                            </div>
                            {discountedPrice &&
                                <div>
                                    <FormItem
                                        name={'discountForTwo'}
                                        rules={[{ required: true }]}  >
                                        <Input
                                            value={courseData.discountForTwo}
                                            placeholder="السعر بعد الخصم لشخصين"
                                        />
                                    </FormItem>
                                    <FormItem
                                        name={'discountForThreeOrMore'}
                                        rules={[{ required: true }]}  >
                                        <Input
                                            value={courseData.discountForThreeOrMore}
                                            placeholder="السعر بعد الخصم لثلاثة اشخاص او اكثر"
                                        />
                                    </FormItem>
                                </div>}
                        </div>
                    }
                    <FormItem>
                        <CheckBox
                            label={'الدورة تحتوي على خصم'}
                            onChange={(e) => onChangeCheckBox(e, 'discount')}
                        />
                    </FormItem>
                    <FormItem>
                        <CheckBox
                            label={'امكانية التسجيل كمجموعات'}
                            onChange={(e) => onChangeCheckBox(e, 'groupDiscountEligible')}
                        />
                    </FormItem>
                    {!showCourseMetaDataFields &&
                        <FormItem>
                            <div className={styles.saveCourseBtnBox}>
                                <button className='primarySolidBtn' htmltype='submit' >حفظ ومتابعة</button>
                            </div>
                        </FormItem>
                    }
                </div>
            </Form >
            <Form onFinish={onFinishAddCourseExtraDetails}>
                {showCourseMetaDataFields &&
                    <>
                        <div className={styles.borderline}>
                            <div className="w-[95%] p-6">
                                <div>
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                                            <p className={styles.secDetails}>تفاصيل الدورة</p>
                                            <p className={styles.addDetails} onClick={() => handleAdd('courseDetails')}>+ إضافة</p>
                                        </div>
                                        {courseDetails?.map((field, index) => ([
                                            <div className={styles.courseDetails} key={`courseDetails${index}`}>
                                                <div style={{ margin: '10px' }} >
                                                    <div className='flex justify-center items-center h-100'>  <AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#FFCD3C'} ></AllIconsComponenet></div>
                                                </div>
                                                <FormItem
                                                    name={[index, 'cd_title']}
                                                    marginleft={'0'}
                                                    rules={[{ required: true }]} >
                                                    <Input
                                                        height={47}
                                                        width={211}
                                                        placeholder="العنوان"
                                                        value={field.title} />
                                                </FormItem>
                                                <FormItem
                                                    name={[index, 'cd_content']}
                                                    marginleft={'0'}
                                                    rules={[{ required: true }]} >
                                                    <Input
                                                        height={47}
                                                        width={216}
                                                        placeholder="النص"
                                                        value={field.content} />
                                                </FormItem>
                                                <FormItem
                                                    name={[index, 'cd_link']}
                                                    marginleft={'0'}>
                                                    <Input
                                                        height={47}
                                                        width={216}
                                                        placeholder="النص"
                                                        value={field.link} />
                                                </FormItem>
                                                <FormItem
                                                    name={[index, 'cd_tailLinkName']}
                                                    marginleft={'0'}
                                                >
                                                    <Input
                                                        height={47}
                                                        width={216}
                                                        placeholder="نص منفصل"
                                                        value={field.seprateText} />
                                                </FormItem>
                                                <FormItem
                                                    name={[index, 'cd_tailLink']}
                                                    marginleft={'0'}
                                                >
                                                    <Input
                                                        height={47}
                                                        width={216}
                                                        placeholder="رابط للنص المنفصل"
                                                        value={field.seprateTextLink} />
                                                </FormItem>
                                                <div className={styles.deleteIconWrapper} >
                                                    <div className='flex justify-center items-center h-100' onClick={() => handleRemove('courseDetails', index)}>  <AllIconsComponenet iconName={'deletecourse'} height={700} width={700} color={'#FFCD3C'} ></AllIconsComponenet></div>
                                                </div>
                                            </div>
                                        ]))}
                                    </>
                                </div>
                            </div>
                        </div>

                        <div className={styles.borderline}>
                            <div className="w-[95%] p-6">
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p className={styles.secDetails}>تفاصيل ثانية</p>
                                        <p className={styles.addDetails} onClick={() => handleAdd('courseDetailsMetaData')} >+ إضافة</p>
                                    </div>
                                    {courseDetailsMetaData?.map((field, index) => (
                                        <div className={styles.courseDetails} key={`courseDetailsMetaData${index}`}>
                                            <div style={{ margin: '10px' }} >
                                                <div className='flex justify-center items-center h-100'><AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#FFCD3C'}></AllIconsComponenet></div>
                                            </div>
                                            <FormItem
                                                name={[index, 'cdmd_icon']}
                                                marginleft={'0'}
                                                rules={[{ required: true }]} >
                                                <SelectIcon
                                                    value={iconValue}
                                                    setIconValue={setIconValue}
                                                />
                                            </FormItem>
                                            <FormItem
                                                name={[index, 'cdmd_text']}
                                                marginleft={'0'}
                                                rules={[{ required: true }]} >
                                                <Input
                                                    height={47}
                                                    width={295}
                                                    placeholder="النص"
                                                    value={field.text} />
                                            </FormItem>
                                            <FormItem
                                                name={[index, 'cdmd_link']}
                                                marginleft={'0'}
                                            >
                                                <Input
                                                    height={47}
                                                    width={284}
                                                    placeholder="النص"
                                                    value={field.link} />
                                            </FormItem>
                                            <FormItem
                                                name={[index, 'cdmd_textSeprate']}
                                                marginleft={'0'}
                                            >
                                                <Input
                                                    height={47}
                                                    width={216}
                                                    placeholder="نص منفصل"
                                                    value={field.textSeprate} />
                                            </FormItem>
                                            <FormItem
                                                name={[index, 'cdmd_linkToSeprateText']}
                                                marginleft={'0'}
                                            >
                                                <Input
                                                    height={47}
                                                    width={216}
                                                    placeholder="رابط للنص المنفصل"
                                                    value={field.linkToSeprateText} />
                                            </FormItem>
                                            <div className={styles.deleteIconWrapper} >
                                                <div className='flex justify-center items-center h-100' onClick={() => handleRemove("courseDetailsMetaData", index)}>  <AllIconsComponenet iconName={'deletecourse'} height={700} width={700} color={'#FFCD3C'} ></AllIconsComponenet></div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            </div>
                        </div>
                        <div className="w-[95%] p-6">
                            <div className='flex'>
                                <div className={styles.saveCourseBtnBox} >
                                    {<button className={`primarySolidBtn `} htmltype='submit'>حفظ</button>}
                                </div>
                                <div className={`${styles.saveCourseBtnBox} mr-2`}>
                                    <button className={`primaryStrockedBtn`} >نشر الدورة</button>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </Form>
        </div >
    )
}

export default CourseInfo