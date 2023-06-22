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
import { createCourseByInstructorAPI, createCourseDetailsMetaDataAPI, createCourseMetaDataAPI, deleteCourseTypeAPI, updateCourseDetailsAPI, updateCourseDetailsMetaDataAPI, updateCourseMetaDataAPI } from '../../../services/apisService';
import { signOutUser } from '../../../services/fireBaseAuthService';
import SelectIcon from '../../antDesignCompo/SelectIcon';
import { toast } from 'react-toastify';
import Image from 'next/image'
import loader from '../../../public/icons/loader.svg'
import { deleteNullFromObj } from '../../../constants/DataManupulation';


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
    const [showLoader, setShowLoader] = useState(false);
    const [courseForm] = Form.useForm();
    const dispatch = useDispatch();

    console.log(isCourseEdit);

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
        setShowLoader(true)
        if (isCourseEdit) {
            editCourse(values)
        } else {
            createCourse(values)
        }
    }


    const createCourse = async (values) => {
        setShowExtraNavItem(false)
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
                setShowExtraNavItem(false)
                setShowCourseMetaDataFields(true)
                setCreateCourseApiRes(res.data)
                setNewCreatedCourse(res.data)
                setShowLoader(false)
            }).catch((error) => {
                console.log(error);
                setShowLoader(false)
                if (error?.response?.status == 401) {
                    signOutUser()
                    dispatch({
                        type: 'EMPTY_STORE'
                    });
                }
            })
        } else {
            let courseDetailMetadata = values.courseDetailsMetaData.map((obj, index) => {
                return { ...obj, order: (`${index + 1}`) }

            })
            let courseMetadata = values.courseMetaData.map((obj, index) => {
                return { ...obj, order: (`${index + 1}`) }
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
            console.log(body1, body2);
            try {
                const courseDetailMetaDataReq = createCourseDetailsMetaDataAPI(body1)
                const courseMetaDataReq = createCourseMetaDataAPI(body2)
                const [courseDetailsMetaData, courseMetaData] = await Promise.all([courseDetailMetaDataReq, courseMetaDataReq])
                setShowExtraNavItem(true)
                setSelectedItem(2)
                setShowLoader(false)
                courseForm.resetFields()
            } catch (error) {
                setShowLoader(false)
                console.log(error);
                if (error?.response?.status == 401) {
                    signOutUser()
                    dispatch({
                        type: 'EMPTY_STORE'
                    });
                }
            }
        }
    }

    const editCourse = async (values) => {
        console.log(values);
        console.log(editCourseData.courseDetailsMetaData);

        let courseMetaData = values.courseMetaData.map((obj, index) => {
            delete obj.createdAt
            delete obj.updatedAt
            obj.order = `${index + 1}`
            obj.courseId = editCourseData.id
            deleteNullFromObj(obj)
            return obj
        })
        let body2 = {
            data: {
                data: courseMetaData
            },
            accessToken: storeData?.accessToken
        }

        let courseDetailsMetaData = values.courseDetailsMetaData.map((obj, index) => {
            delete obj.createdAt
            delete obj.updatedAt
            delete obj.grayedText
            obj.order = `${index + 1}`
            obj.courseId = editCourseData.id
            deleteNullFromObj(obj)
            return obj
        })
        let body3 = {
            data: {
                data: courseDetailsMetaData,
            },
            accessToken: storeData?.accessToken
        }

        console.log("body2", body2);
        console.log("body3", body3);

        delete values.courseMetaData;
        delete values.courseDetailsMetaData;

        values.pictureKey = imageUploadResponceData?.key,
            values.pictureBucket = imageUploadResponceData?.bucket,
            values.pictureMime = imageUploadResponceData?.mime,
            values.groupDiscountEligible = groupDiscountEligible;
        values.type = courseType


        let body1 = {
            data: values,
            courseId: editCourseData.id,
            accessToken: storeData?.accessToken
        }
        console.log("body1", body1);
        try {
            const editCourseReq = updateCourseDetailsAPI(body1)
            const editCourseMetadataReq = updateCourseMetaDataAPI(body2)
            const editCourseDetailsMetaDataReq = updateCourseDetailsMetaDataAPI(body3)

            const [editCourse, editCourseMetaData, editCourseDetailsMetadata] = await Promise.all([editCourseReq, editCourseMetadataReq, editCourseDetailsMetaDataReq])

            console.log(editCourseMetaData);
            dispatch({ type: 'SET_EDIT_COURSE_DATA', editCourseData: editCourseMetaData.data })

            toast.success("تم تحديث تفاصيل الدورة بنجاح")
            setShowLoader(false)
        }
        catch (error) {
            setShowLoader(false)
            console.log(error);
            if (error?.response?.status == 401) {
                signOutUser()
                dispatch({
                    type: 'EMPTY_STORE'
                });
            } else {
                toast.error("حصلت مشكلة ما، أعد المحاولة لاحقًا");
            }
        }
    }

    const deleteCourseDetails = async (index, remove, name, deleteFieldName) => {
        setShowLoader(true)
        let data = { ...editCourseData }
        console.log(data);
        console.log(data.courseMetaData[index]);
        console.log(data.courseDetailsMetaData[index]);

        if ((deleteFieldName == 'courseMeta' && data.courseMetaData[index]?.id == undefined) || (deleteFieldName == 'courseDetails' && data.courseDetailsMetaData[index]?.id == undefined)) {
            remove(name)
            setShowLoader(false)
        } else {
            let body = {
                data: {
                    type: deleteFieldName,
                    courseId: editCourseData.id,
                    id: deleteFieldName == 'courseDetails' ? data.courseDetailsMetaData[index]?.id : data.courseMetaData[index]?.id
                },
                accessToken: storeData?.accessToken
            }
            console.log(body);
            await deleteCourseTypeAPI(body).then((res) => {
                data.courseMetaData.splice(index, 1)
                remove(name)
                dispatch({ type: 'SET_EDIT_COURSE_DATA', editCourseData: res.data })
                setShowLoader(false)
                console.log(storeData);
                console.log(isCourseEdit);
                console.log(res);
            }).catch((error) => {
                setShowLoader(false)
                console.log(error);
            })
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
                        rules={[{ required: true, message: 'ادخل عنوان الدورة' }]}  >
                        <Input
                            placeholder="عنوان الدورة"
                            value={courseData.name}
                        />
                    </FormItem>
                    <FormItem
                        name={'catagoryId'}
                        rules={[{ required: true, message: 'اختر تصنيف الدورة' }]} >
                        <Select
                            placeholder="اختر تصنيف الدورة"
                            value={courseData.catagoryId}
                            OptionData={catagoriesItem} />
                    </FormItem>
                    <FormItem
                        name={'curriculumId'}
                        rules={[{ required: true, message: 'اختر مقرر الدورة' }]}  >
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
                                rules={[{ required: true, message: '	حدد الموقع' }]} >
                                <Input
                                    height={47}
                                    width={247}
                                    placeholder="الرياض، حي الياسمين"
                                    value={courseData.locationName} />
                            </FormItem>
                            <FormItem
                                name={'location'}
                                rules={[{ required: true, message: 'ضع رابط الموقع' }]}  >
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
                                rules={[{ required: true, message: 'ادخل تقييم الدورة' }]} >
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
                                rules={[{ required: true, message: 'ادخل رقم الخريجين' }]} >
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
                            rules={[{ required: true, message: 'ادخل سعر الدورة' }]}>
                            <Input
                                placeholder="سعر الدورة للشخص"
                                value={courseData.price}
                            />
                        </FormItem>
                        {discountedPrice &&
                            <FormItem
                                name={'discount'}
                                rules={[{ required: true, message: 'ادخل سعر   الدورة بعد الخصم' }]}  >
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
                                    rules={[{ required: true, message: 'ادخل سعر الدورة لشخصين' }]} >
                                    <Input
                                        value={courseData.price * 2}
                                        placeholder="سعر الدورة لشخصين"
                                    />
                                </FormItem>
                                <FormItem
                                    name={'PriceForThreeorMore'}
                                    rules={[{ required: true, message: 'ادخل سعر الدورة لـ3 اشخاص' }]} >
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
                                        rules={[{ required: true, message: 'ادخل سعر   الدورة لشخصين بعد الخصم' }]}  >
                                        <Input
                                            value={courseData.discountForTwo}
                                            placeholder="السعر بعد الخصم لشخصين"
                                        />
                                    </FormItem>
                                    <FormItem
                                        name={'discountForThreeOrMore'}
                                        rules={[{ required: true, message: 'ادخل سعر   الدورة لـ3 اشخاص بعد الخصم' }]}  >
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
                                                {field.map(({ name, key, ...restField }, index) => (
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
                                                                    message: 'ادخل العنوان'
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
                                                                    message: 'ادخل الوصف'
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
                                                                    message: 'ادخل الرابط المنصل'
                                                                },
                                                            ]}
                                                        >
                                                            <Input placeholder="نص منفصل" width={216} height={47} />
                                                        </FormItem>
                                                        <div className={styles.deleteIconWrapper} >
                                                            <div className='flex justify-center items-center h-100'
                                                                onClick={() => {
                                                                    deleteCourseDetails(index, remove, name, "courseMeta")
                                                                }}>
                                                                <AllIconsComponenet iconName={'deletecourse'} height={700} width={700} color={'#FFCD3C'} />
                                                            </div>
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
                                                {field.map(({ name, key, ...restField }, index) => (
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
                                                                    message: 'اختر الأيقونة'
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
                                                                    message: 'ادخل النص'
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
                                                            <div className='flex justify-center items-center h-100' onClick={() => {
                                                                deleteCourseDetails(index, remove, name, "courseDetails")
                                                            }}><AllIconsComponenet iconName={'deletecourse'} height={700} width={700} color={'#FFCD3C'} /></div>
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
                                    <button className='primarySolidBtn flex items-center' htmltype='submit' disabled={showLoader}>{showLoader ? <Image src={loader} width={30} height={30} alt={'loader'} /> : ""}حفظ</button>
                                </div>
                                <div className={`${styles.saveCourseBtnBox} mr-2`}>
                                    <button className={`primaryStrockedBtn`} >نشر الدورة</button>
                                </div>
                            </div>
                        </div >
                    </>
                }
            </Form>
        </div >
    )
}
export default CourseInfo