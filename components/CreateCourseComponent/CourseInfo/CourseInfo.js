import React, { useEffect, useState } from 'react';
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

const CourseInfo = ({ setShowExtraNavItem, setCreateCourseApiRes, courseType, setSelectedItem }) => {

    const storeData = useSelector((state) => state?.globalStore);
    const isCourseEdit = storeData?.isCourseEdit;
    const editCourseData = storeData?.editCourseData;
    const catagories = storeData?.catagories;
    const curriculumIds = storeData?.curriculumIds
    const [showCourseMetaDataFields, setShowCourseMetaDataFields] = useState(isCourseEdit)
    const [courseData, setCourseData] = useState(CourseInitial)
    const [imageUploadResponceData, setImageUploadResponceData] = useState();
    const [discountedPrice, setDiscountedPrice] = useState(false)
    const [groupDiscountEligible, setGroupDiscountEligible] = useState(false)
    const [newcreatedCourse, setNewCreatedCourse] = useState()
    const [courseForm] = Form.useForm();
    const dispatch = useDispatch();


    useEffect(() => {
        if (isCourseEdit) {
            courseForm.setFieldsValue(editCourseData)
        }
    }, [])

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
        if (!showCourseMetaDataFields) {
            values.pictureKey = imageUploadResponceData?.key,
                values.pictureBucket = imageUploadResponceData?.bucket,
                values.pictureMime = imageUploadResponceData?.mime,
                values.groupDiscountEligible = groupDiscountEligible;
            values.type = courseType

            delete values.priceForTwo;
            delete values.PriceForThreeorMore;

            let body = {
                data: values,
                accessToken: storeData?.accessToken
            }
            await createCourseByInstructorAPI(body).then((res) => {
                setShowExtraNavItem(true)
                setShowCourseMetaDataFields(true)
                setCreateCourseApiRes(res.data)
                setNewCreatedCourse(res.data)
                courseForm.setFieldValue('icon', "clockIcon")
            }).catch((error) => {
                console.log(error);
                if (error?.response?.status == 401) {
                    signOutUser()
                    dispatch({
                        type: 'EMPTY_STORE'
                    });
                }
            })
        } else {
            let courseMetadata = values.courseMetaData.map((obj, index) => {
                return {
                    order: (`${index + 1}`),
                    title: obj.title,
                    content: obj.content,
                    link: obj.link,
                    tailLinkName: obj.tailLinkName,
                    tailLink: obj.tailLink,
                }
            })

            let courseDetailMetadata = values.courseDetailsMetaData.map((obj, index) => {
                return {
                    order: (`${index + 1}`),
                    icon: obj.icon,
                    text: obj.text,
                    link: obj.link,
                    textSeprate: obj.textSeprate,
                    linkToSeprateText: obj.linkToSeprateText,
                }
            })

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
            try {
                const courseDetailMetaDataReq = createCourseDetailsMetaDataAPI(body1)
                const courseMetaDataReq = createCourseMetaDataAPI(body2)
                const [courseDetailsMetaData, courseMetaData] = await Promise.all([courseDetailMetaDataReq, courseMetaDataReq])
                setShowExtraNavItem(true)
                setSelectedItem(2)
                courseForm.resetFields()
            } catch (error) {
                console.log(error);
            }
        }
    }

    const onChangeCheckBox = (e, checkboxName) => {
        if (checkboxName == 'discount') {
            setDiscountedPrice(e.target.checked)
        }
        else {
            setGroupDiscountEligible(e.target.checked)
        }
    }

    return (
        <div>
            <Form form={courseForm} onFinish={onFinishCreateCourse} >
                <div className='px-6'>

                    <FormItem
                        name={'name'}
                        rules={[{ required: true, message: 'Please Enter Course Name' }]}  >
                        <Input
                            placeholder="عنوان الدورة"
                            value={courseData.name}
                        />
                    </FormItem>
                    <FormItem
                        name={'catagoryId'}
                        rules={[{ required: true, message: 'Please Enter Course CatagoryId' }]} >
                        <Select
                            placeholder="اختر تصنيف الدورة"
                            value={courseData.catagoryId}
                            OptionData={catagoriesItem} />
                    </FormItem>
                    <FormItem
                        name={'curriculumId'}
                        rules={[{ required: true, message: 'Please Enter CurriculumId' }]}  >
                        <Select
                            placeholder="اختر تصنيف الدورة"
                            value={courseData.curriculumId}
                            OptionData={curriculum}
                            filterOption={false} />
                    </FormItem>
                    <FormItem
                        name={'shortDescription'}>
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
                                <div className={styles.dropDownArrowWrapper}><AllIconsComponenet iconName={'dropDown'} height={24} width={24} color={'#000000'} /></div>
                                <div className='flex justify-center items-center h-100'> <AllIconsComponenet iconName={'location'} height={24} width={24} color={'#000000'} /></div>
                            </div>
                            <div className={styles.detailDataWrapper}>
                                <p>تقدم الدورة في</p>
                            </div>
                            <FormItem
                                name={'locationName'}
                                rules={[{ required: true, message: 'Please Enter LocationName' }]} >
                                <Input
                                    height={47}
                                    width={247}
                                    placeholder="الرياض، حي الياسمين"
                                    value={courseData.locationName} />
                            </FormItem>
                            <FormItem
                                name={'location'}
                                rules={[{ required: true, message: 'Please Enter Location Link' }]}  >
                                <Input
                                    height={47}
                                    width={247}
                                    placeholder="hyperlink(optional)"
                                    value={courseData.location} />
                            </FormItem>
                        </div>
                        <div className='flex'>
                            <div className={styles.IconWrapper} >
                                <div className={styles.dropDownArrowWrapper}><AllIconsComponenet iconName={'dropDown'} height={24} width={24} color={'#000000'} /></div>
                                <div className='flex justify-center items-center h-100'>  <AllIconsComponenet iconName={'star'} height={24} width={24} color={'#FFCD3C'} ></AllIconsComponenet></div>
                            </div>
                            <div className={styles.detailDataWrapper}>
                                <p>تقييم الدورة</p>
                            </div>
                            <FormItem
                                name={'reviewRate'}
                                rules={[{ required: true, message: 'Please Enter Review Rate' }]} >
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
                                rules={[{ required: true, message: 'Please Enter NumberOfGrarduates' }]} >
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
                            rules={[{ required: true, message: 'Please Enter Course Price' }]}>
                            <Input
                                placeholder="سعر الدورة للشخص"
                                value={courseData.price}
                            />
                        </FormItem>
                        {discountedPrice &&
                            <FormItem
                                name={'discount'}
                                rules={[{ required: true, message: 'Please Enter Discount' }]}  >
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
                                    rules={[{ required: true, message: 'Please Enter Price For Two' }]} >
                                    <Input
                                        value={courseData.price * 2}
                                        placeholder="سعر الدورة لشخصين"
                                    />
                                </FormItem>
                                <FormItem
                                    name={'PriceForThreeorMore'}
                                    rules={[{ required: true, message: 'Please Enter Price For Three' }]} >
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
                                        rules={[{ required: true, message: 'Please Enter Discount For Two' }]}  >
                                        <Input
                                            value={courseData.discountForTwo}
                                            placeholder="السعر بعد الخصم لشخصين"
                                        />
                                    </FormItem>
                                    <FormItem
                                        name={'discountForThreeOrMore'}
                                        rules={[{ required: true, message: 'please Enter discount for three' }]}  >
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
                        <div className={styles.saveCourseBtnBox}>
                            <button className='primarySolidBtn' htmltype='submit' >حفظ ومتابعة</button>
                        </div>
                    }
                </div>
                {showCourseMetaDataFields &&
                    <>
                        <div className={styles.borderline}>
                            <div className="w-[95%] p-6">
                                <div>
                                    <Form.List name="courseMetaData" initialValue={[{}]}>
                                        {(field, { add, remove }) => (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                                                    <p className={styles.secDetails}>تفاصيل الدورة</p>
                                                    <p className={styles.addDetails} onClick={() => add()}>+ إضافة</p>
                                                </div>
                                                {field.map(({ name, key, ...restField }) => (
                                                    <div className={styles.courseDetails} key={key}>
                                                        <FormItem>
                                                            <div style={{ margin: '10px' }} >
                                                                <div className='flex justify-center items-center h-100'><AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#FFCD3C'} /></div>
                                                            </div>
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'title']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Please Enter Title'
                                                                },
                                                            ]}
                                                        >
                                                            <Input placeholder="العنوان" width={216} height={47} />
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'content']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Please Enter Content'
                                                                },
                                                            ]}
                                                        >
                                                            <Input placeholder="النص" width={216} height={47} />
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'link']}
                                                        >
                                                            <Input placeholder="رابط" width={216} height={47} />
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'tailLinkName']}
                                                        >
                                                            <Input placeholder="نص منفصل" width={216} height={47} />
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'tailLink']}
                                                            rules={[
                                                                {
                                                                    required: field?.tailLinkName ? true : false,
                                                                    message: 'Please Enter tailLink'
                                                                },
                                                            ]}
                                                        >
                                                            <Input placeholder="نص منفصل" width={216} height={47} />
                                                        </FormItem>
                                                        <div className={styles.deleteIconWrapper} >
                                                            <div className='flex justify-center items-center h-100' onClick={() => remove(name)}><AllIconsComponenet iconName={'deletecourse'} height={700} width={700} color={'#FFCD3C'} /></div>
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
                                <div>
                                    <Form.List name="courseDetailsMetaData" initialValue={[{}]}>
                                        {(field, { add, remove }) => (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                                                    <p className={styles.secDetails}> تفاصيل ثانية</p>
                                                    <p className={styles.addDetails} onClick={() => add()}>+ إضافة</p>
                                                </div>
                                                {field.map(({ name, key, ...restField }) => (
                                                    <div className={styles.courseDetails} key={key}>
                                                        <FormItem>
                                                            <div style={{ margin: '10px' }} >
                                                                <div className='flex justify-center items-center h-100'><AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#FFCD3C'} /></div>
                                                            </div>
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'icon']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Please Select Icon'
                                                                },
                                                            ]}
                                                        >
                                                            <SelectIcon />
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'text']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Please Enter Text'
                                                                },
                                                            ]}
                                                        >
                                                            <Input placeholder="النص" width={295} height={47} />
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'link']}
                                                        >
                                                            <Input placeholder="رابط" width={284} height={47} />
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'tailLink']}
                                                        >
                                                            <Input placeholder="نص منفصل" width={216} height={47} />
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'tailLinkName']}
                                                        >
                                                            <Input placeholder="رابط للنص المنفصل" width={216} height={47} />
                                                        </FormItem>
                                                        <div className={styles.deleteIconWrapper} >
                                                            <div className='flex justify-center items-center h-100' onClick={() => remove(name)}><AllIconsComponenet iconName={'deletecourse'} height={700} width={700} color={'#FFCD3C'} /></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </Form.List>
                                </div>
                            </div>
                        </div>
                        <div className="w-[95%] p-6" >
                            <div className='flex'>
                                <div className={styles.saveCourseBtnBox} >
                                    {<button className={`primarySolidBtn `} htmltype='submit'>حفظ</button>}
                                </div>
                                <div className={`${styles.saveCourseBtnBox} mr-2`}>
                                    <button className={`primaryStrockedBtn`} >نشر الدورة</button>
                                </div>
                            </div>
                        </div >
                    </>
                }
            </Form >
        </div >
    )
}

export default CourseInfo