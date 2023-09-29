import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'antd';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { FormItem } from '../../antDesignCompo/FormItem';
import InputTextArea from '../../antDesignCompo/InputTextArea';
import styles from './CourseInfo.module.scss'
import CheckBox from '../../antDesignCompo/CheckBox';
import Input from '../../antDesignCompo/Input';
import Select from '../../antDesignCompo/Select';
import { createCourseByInstructorAPI, deleteCourseTypeAPI, updateCourseDetailsAPI, updateCourseDetailsMetaDataAPI, updateCourseMetaDataAPI } from '../../../services/apisService';
import { getNewToken, signOutUser } from '../../../services/fireBaseAuthService';
import SelectIcon from '../../antDesignCompo/SelectIcon';
import { toast } from 'react-toastify';
import { deleteNullFromObj, mediaUrl } from '../../../constants/DataManupulation';
import { toastErrorMessage, toastSuccessMessage } from '../../../constants/ar';
import * as PaymentConst from '../../../constants/PaymentConst'
import Switch from '../../antDesignCompo/Switch';
import UploadFile from '../../CommonComponents/UploadFileForCourse/UploadFile';
import CustomButton from '../../CommonComponents/CustomButton';
import { useRouter } from 'next/router';


const CourseInfo = ({ setShowExtraNavItem, setCreateCourseApiRes, courseType }) => {

    const storeData = useSelector((state) => state?.globalStore);
    const isCourseEdit = storeData?.isCourseEdit;
    const editCourseData = storeData?.editCourseData;
    const catagories = storeData?.catagories;
    const curriculumIds = storeData?.curriculumIds
    const [showCourseMetaDataFields, setShowCourseMetaDataFields] = useState(isCourseEdit)
    const [imageUploadResponceData, setImageUploadResponceData] = useState();
    const [videoUploadResponceData, setVideooUploadResponceData] = useState();
    const [discountForOne, setDiscountForOne] = useState(isCourseEdit ? ((editCourseData?.discount == null) ? false : true) : false)
    const [groupDiscountEligible, setGroupDiscountEligible] = useState(isCourseEdit ? editCourseData?.groupDiscountEligible : false)
    const [showLoader, setShowLoader] = useState(false);
    const [courseInfoForm] = Form.useForm();
    const dispatch = useDispatch();
    const [discountValue, setDiscountValue] = useState()
    const [englishCourse, setEnglishCourse] = useState(isCourseEdit ? editCourseData?.language == 'en' : false)
    const iosProductIdList = PaymentConst.iosProductIdList
    const router = useRouter()

    useEffect(() => {
        if (isCourseEdit) {
            courseInfoForm.setFieldsValue(editCourseData)
        }
    }, [courseInfoForm, isCourseEdit, editCourseData])
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

    const createCourseApiSuccessRes = (res) => {
        toast.success(toastSuccessMessage.courseCreatedSuccessMsg)
        setShowExtraNavItem(true)
        setShowCourseMetaDataFields(true)
        setCreateCourseApiRes(res.data)
        setShowLoader(false)
        dispatch({ type: 'SET_EDIT_COURSE_DATA', editCourseData: res.data })
        dispatch({ type: 'SET_IS_COURSE_EDIT', isCourseEdit: true })
        router.push({
            pathname: (`/instructorPanel/manageCourse/${courseType}/editCourse`),
            query: { courseId: res.data?.id }
        })
    }

    const createCourse = async (values) => {
        setShowExtraNavItem(false)
        if (!showCourseMetaDataFields) {
            values.pictureKey = imageUploadResponceData?.key
            values.pictureBucket = imageUploadResponceData?.bucket
            values.pictureMime = imageUploadResponceData?.mime
            values.videoKey = videoUploadResponceData?.key
            values.videoBucket = videoUploadResponceData?.bucket
            values.videoMime = videoUploadResponceData?.mime
            values.groupDiscountEligible = groupDiscountEligible
            values.type = courseType == "onDemand" ? "on-demand" : courseType
            values.language = englishCourse ? "en" : "ar"
            values.isPurchasable = false
            values.published = false
            if (courseType != "physical") {
                const iosPriceLabel = iosProductIdList.find((obj) => obj.value == values.iosPriceId ? obj.label : null)
                const iosDiscountLabel = iosProductIdList.find((obj) => obj.value == values.iosDiscountId ? obj.label : null)
                const iosDiscountForTwoLabel = iosProductIdList.find((obj) => obj.value == values.iosDiscountForTwoId ? obj.label : null)
                const iosDiscountForThreeLabel = iosProductIdList.find((obj) => obj.value == values.iosDiscountForThreeOrMoreId ? obj.label : null)

                values.iosPrice = iosPriceLabel.label
                if (discountForOne) {
                    values.iosDiscount = iosDiscountLabel.label
                }
                if (groupDiscountEligible) {
                    values.iosDiscountForTwo = iosDiscountForTwoLabel.label
                    values.iosDiscountForThreeOrMore = iosDiscountForThreeLabel.label
                }
            }

            delete values.priceForTwo;
            delete values.PriceForThreeorMore;

            let body = {
                data: values,
            }
            await createCourseByInstructorAPI(body).then((res) => {
                createCourseApiSuccessRes(res)
            }).catch(async (error) => {
                console.log(error);
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await createCourseByInstructorAPI(body).then((res) => {
                            createCourseApiSuccessRes(res)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
                setShowLoader(false)
            })
        }
    }

    const editCourse = async (values) => {
        setShowLoader(true)
        let courseMetaData = values.courseMetaData.map((obj, index) => {
            delete obj.createdAt
            delete obj.updatedAt
            obj.order = `${index + 1}`
            obj.courseId = editCourseData.id
            deleteNullFromObj(obj)
            return obj
        })
        const courseMetaDataBody = {
            data: {
                data: courseMetaData
            },
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
        const courseDetailsMetaDataBody = {
            data: {
                data: courseDetailsMetaData,
            },
        }

        if (groupDiscountEligible == false) {
            values.discountForThreeOrMore = 0
            values.discountForTwo = 0
        }

        if (discountForOne == false) {
            values.discount = null
        }

        values.pictureKey = imageUploadResponceData?.key
        values.pictureBucket = imageUploadResponceData?.bucket
        values.pictureMime = imageUploadResponceData?.mime
        values.videoKey = videoUploadResponceData?.key
        values.videoBucket = videoUploadResponceData?.bucket
        values.videoMime = videoUploadResponceData?.mime
        values.groupDiscountEligible = groupDiscountEligible
        values.language = englishCourse ? "en" : "ar"
        values.type = courseType == "onDemand" ? "on-demand" : courseType

        const iosPriceLabel = iosProductIdList.find((obj) => obj.value == values.iosPriceId ? obj.label : null)
        const iosDiscountLabel = iosProductIdList.find((obj) => obj.value == values.iosDiscountId ? obj.label : null)
        const iosDiscountForTwoLabel = iosProductIdList.find((obj) => obj.value == values.iosDiscountForTwoId ? obj.label : null)
        const iosDiscountForThreeLabel = iosProductIdList.find((obj) => obj.value == values.iosDiscountForThreeOrMoreId ? obj.label : null)

        if (courseType != "physical") {
            values.iosPrice = iosPriceLabel.label

            if (discountForOne) {
                values.iosDiscount = iosDiscountLabel.label
            }
            if (groupDiscountEligible) {
                values.iosDiscountForTwo = iosDiscountForTwoLabel.label
                values.iosDiscountForThreeOrMore = iosDiscountForThreeLabel.label
            }
        }

        delete values.discountForOne
        delete values.courseMetaData;
        delete values.courseDetailsMetaData;

        const courseBody = {
            data: values,
            courseId: editCourseData?.id,
        }

        try {
            const promiseArray = [];

            promiseArray.push(updateCourseDetailsAPI(courseBody));

            if (courseMetaDataBody.data.data.length > 0) {
                promiseArray.push(updateCourseMetaDataAPI(courseMetaDataBody));
            }
            if (courseDetailsMetaDataBody.data.data.length > 0) {
                promiseArray.push(updateCourseDetailsMetaDataAPI(courseDetailsMetaDataBody));
            }
            const [editCourse, editCourseMetaData, editCourseDetailsMetadata] = await Promise.all(promiseArray);

            let editCourseData;

            if (courseDetailsMetaDataBody.data.data.length === 0 && courseMetaDataBody.data.data.length > 0) {
                editCourseData = editCourseMetaData.data;
            } else if (courseMetaDataBody.data.data.length === 0 && courseDetailsMetaDataBody.data.data.length > 0) {
                editCourseData = editCourseDetailsMetadata.data;
            } else if (courseMetaDataBody.data.data.length === 0 && courseDetailsMetaDataBody.data.data.length === 0) {
                editCourseData = editCourse.data;
            } else {
                editCourseData = editCourseDetailsMetadata.data;
            }
            dispatch({ type: 'SET_EDIT_COURSE_DATA', editCourseData });
            toast.success(toastSuccessMessage.courseDetailUpdateMsg);
            setShowLoader(false);
        } catch (error) {
            setShowLoader(false);
            console.log(error);

            if (error?.response?.status === 401) {
                signOutUser();
                dispatch({
                    type: 'EMPTY_STORE'
                });
            } else {
                toast.error(toastErrorMessage.tryAgainErrorMsg);
            }
        }
    }

    const deleteCourseDetails = async (index, remove, name, deleteFieldName) => {
        setShowLoader(true)
        let data = { ...editCourseData }
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
            }
            await deleteCourseTypeAPI(body).then((res) => {
                data.courseMetaData.splice(index, 1)
                remove(name)
                dispatch({ type: 'SET_EDIT_COURSE_DATA', editCourseData: res.data })
                setShowLoader(false)
            }).catch((error) => {
                setShowLoader(false)
                console.log(error);
            })
        }
    }

    const onChangeCheckBox = (e, checkboxName) => {
        if (checkboxName == 'discount') {
            setDiscountForOne(e.target.checked);
            if (!e.target.checked) {
                setDiscountValue('');
            }
            courseInfoForm.resetFields(['discount', 'androidDiscount', 'iosDiscountId'])
        } else {
            setGroupDiscountEligible(e.target.checked);
            if (!e.target.checked) {
                setDiscountValue('');
            }
            courseInfoForm.resetFields(['discountForTwo', 'discountForThreeOrMore', 'androidDiscountForTwo', 'androidDiscountForThreeOrMore', 'iosDiscountForTwoId', 'iosDiscountForThreeOrMoreId'])
        }
    };

    const onChangeCourseChkBox = (e) => {
        setEnglishCourse(e.target.checked)
    }
    const handleToggleChange = async (e, params) => {
        let body = {
            data: params == "published" ? { published: e } : { isPurchasable: e },
            courseId: editCourseData.id,
        }
        await updateCourseDetailsAPI(body).then((res) => {
            toast.success('course updated successfully')
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await updateCourseDetailsAPI(body).then((res) => {
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }

    return (
        <div>
            <Form form={courseInfoForm} onFinish={onFinishCreateCourse} >
                <div className='px-6'>
                    <FormItem
                        name={'name'}
                        rules={[{ required: true, message: 'ادخل عنوان الدورة' }]}>
                        <Input
                            placeholder="عنوان الدورة"
                        />
                    </FormItem>
                    <FormItem
                        name={'catagoryId'}
                        rules={[{ required: true, message: 'اختر تصنيف الدورة' }]} >
                        <Select
                            placeholder="اختر تصنيف الدورة"
                            OptionData={catagoriesItem} />
                    </FormItem>
                    <FormItem
                        name={'curriculumId'}
                        rules={[{ required: true, message: 'اختر مقرر الدورة' }]}  >
                        <Select
                            placeholder="اختر تصنيف الدورة"
                            OptionData={curriculum}
                            filterOption={false} />
                    </FormItem>
                    <FormItem
                        name={'englishCourse'}
                    >
                        <CheckBox
                            label={' الدورة انجليزية'}
                            defaultChecked={englishCourse}
                            onChange={(e) => onChangeCourseChkBox(e, 'englishCourse')}
                        />
                    </FormItem>
                    <FormItem
                        name={'shortDescription'}>
                        <InputTextArea
                            height={274}
                            width={549}
                            placeholder="وصف الدورة"
                        >
                        </InputTextArea>
                    </FormItem>
                    <p className={styles.uploadImageHeader}>صورة الدورة</p>
                    <div>
                        <UploadFile
                            coursePictureUrl={mediaUrl(editCourseData?.pictureBucket, editCourseData?.pictureKey)}
                            courseVideoUrl={''}
                            setUploadFileData={setImageUploadResponceData}
                            accept={"image"}
                            type={'.jpg , .png'}
                            label={'ارفق الفيديو هنا'}
                        />
                    </div>
                    <p className={styles.uploadImageHeader}>فيديو الدورة</p>
                    <div>
                        <UploadFile
                            coursePictureUrl={isCourseEdit ? mediaUrl(editCourseData?.pictureBucket, editCourseData?.pictureKey) : mediaUrl(imageUploadResponceData?.bucket, imageUploadResponceData?.key)}
                            courseVideoUrl={mediaUrl(editCourseData?.videoBucket, editCourseData?.videoKey)}
                            accept={"video"}
                            label={'ارفق الفيديو هنا'}
                            type={'.mp4, .mov, .avi, .wmv, .fly, .webm, .mkv '}
                            setUploadFileData={setVideooUploadResponceData}
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
                                />
                            </FormItem>
                            {/* <FormItem
                                name={'location'}
                                rules={[{ required: true, message: 'ضع رابط الموقع' }]}  >
                                <Input
                                    height={47}
                                    width={247}
                                    placeholder="hyperlink(optional)"
                                    />
                            </FormItem> */}
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
                                />
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
                                />
                            </FormItem>
                        </div>
                    </div>
                </div>
                <div className={styles.borderline}>
                    <div className="w-[95%] p-6">
                        <p className={styles.secDetails}>تسعيرة الدورة</p>
                        <FormItem
                            name={'discount'}
                        >
                            <CheckBox
                                label={'الدورة تحتوي على خصم'}
                                defaultChecked={discountForOne}
                                onChange={(e) => onChangeCheckBox(e, 'discount')}
                            />
                        </FormItem>
                        {courseType != 'onDemand' &&
                            <FormItem
                                name={'groupDiscountEligible'}
                            >
                                <CheckBox
                                    label={'امكانية التسجيل كمجموعات'}
                                    defaultChecked={groupDiscountEligible}
                                    onChange={(e) => onChangeCheckBox(e, 'groupDiscountEligible')}
                                />
                            </FormItem>
                        }
                        <div className={styles.checkBoxHead}>
                            <div className='pl-2'>
                                <AllIconsComponenet iconName={'mobileWebDevice'} height={24} width={24} color={'#2D2E2D'} />
                            </div>
                            {courseType == 'physical' &&
                                <>
                                    <div>
                                        <AllIconsComponenet iconName={'androidStore'} height={24} width={24} color={'#2D2E2D'} />
                                    </div>
                                    <div className='pr-2'>
                                        <AllIconsComponenet iconName={'appleStore'} height={24} width={24} color={'#2D2E2D'} />
                                    </div>
                                </>
                            }
                            <p className={styles.chechBoxHeadText}>تسعيرة الدورة</p>
                        </div>
                        <div className='flex'>
                            <FormItem
                                name={'price'}
                                rules={[{ required: true, message: 'ادخل سعر الدورة' }]}>
                                <Input
                                    placeholder='السعر لشخص واحد'
                                />
                            </FormItem>
                            {discountForOne &&
                                <FormItem
                                    name={'discount'}
                                    rules={[{ required: true, message: 'ادخل سعر   الدورة بعد الخصم' }]}  >
                                    <Input
                                        placeholder='السعر بعد الخصم'
                                    />
                                </FormItem>
                            }
                        </div>
                        {groupDiscountEligible &&
                            <div className='flex'>
                                <div>
                                    <FormItem
                                        name={'discountForTwo'}
                                        rules={[{ required: true, message: 'ادخل سعر الدورة لشخصين' }]} >
                                        <Input
                                            placeholder='السعر لشخصين'
                                        />
                                    </FormItem>
                                    <FormItem
                                        name={'discountForThreeOrMore'}
                                        rules={[{ required: true, message: 'ادخل سعر الدورة لـ3 اشخاص' }]} >
                                        <Input
                                            placeholder='السعر لـ3 أشخاص أو أكثر'
                                        />
                                    </FormItem>
                                </div>
                            </div>
                        }
                        {courseType != 'physical' &&
                            <>
                                <div className={styles.checkBoxHead}>
                                    <AllIconsComponenet iconName={'androidStore'} height={24} width={24} color={'#2D2E2D'} />
                                    <p className={styles.chechBoxHeadText}>تسعيرة الدورة</p>
                                </div>
                                <div className='flex'>
                                    <FormItem
                                        name={'androidPrice'}
                                        rules={[{ required: true, message: 'ادخل سعر الدورة' }]}>
                                        <Input
                                            placeholder="سعر الدورة للشخص"
                                        />
                                    </FormItem>
                                    {discountForOne &&
                                        <FormItem
                                            name={'androidDiscount'}
                                            rules={[{ required: true, message: 'ادخل سعر   الدورة بعد الخصم' }]}  >
                                            <Input
                                                placeholder="السعر بعد الخصم للشخص"
                                            />
                                        </FormItem>
                                    }
                                </div>
                                {groupDiscountEligible &&
                                    <div className='flex'>
                                        <div>
                                            <FormItem
                                                name={'androidDiscountForTwo'}
                                                rules={[{ required: true, message: 'ادخل سعر الدورة لشخصين' }]} >
                                                <Input
                                                    placeholder="سعر الدورة لشخصين"
                                                />
                                            </FormItem>
                                            <FormItem
                                                name={'androidDiscountForThreeOrMore'}
                                                rules={[{ required: true, message: 'ادخل سعر الدورة لـ3 اشخاص' }]} >
                                                <Input
                                                    placeholder="سعر الدورة لثلاثة اشخاص واكثر"
                                                />
                                            </FormItem>
                                        </div>
                                    </div>
                                }
                                <div className={styles.checkBoxHead}>
                                    <AllIconsComponenet iconName={'appleStore'} height={24} width={24} color={'#2D2E2D'} />
                                    <p className={styles.chechBoxHeadText}>تسعيرة الدورة</p>
                                </div>
                                <div className='flex'>
                                    <FormItem
                                        name={'iosPriceId'}
                                        rules={[{ required: true, message: 'ادخل سعر الدورة' }]}>
                                        <Select
                                            placeholder="سعر الدورة للشخص"
                                            OptionData={iosProductIdList}
                                        />
                                    </FormItem>

                                    {discountForOne &&
                                        <FormItem
                                            name={'iosDiscountId'}
                                            rules={[{ required: true, message: 'ادخل سعر   الدورة بعد الخصم' }]}  >
                                            <Select
                                                placeholder="السعر بعد الخصم للشخص"
                                                OptionData={iosProductIdList}
                                            />
                                        </FormItem>
                                    }
                                </div>
                                {groupDiscountEligible &&
                                    <div className='flex'>
                                        <div>
                                            <FormItem
                                                name={'iosDiscountForTwoId'}
                                                rules={[{ required: true, message: 'ادخل سعر الدورة لشخصين' }]} >
                                                <Select
                                                    placeholder="سعر الدورة لشخصين"
                                                    OptionData={iosProductIdList}
                                                />
                                            </FormItem>
                                            <FormItem
                                                name={'iosDiscountForThreeOrMoreId'}
                                                rules={[{ required: true, message: 'ادخل سعر الدورة لـ3 اشخاص' }]} >
                                                <Select
                                                    placeholder="سعر الدورة لثلاثة اشخاص واكثر"
                                                    OptionData={iosProductIdList}
                                                />
                                            </FormItem>
                                        </div>
                                    </div>
                                }
                            </>
                        }
                        {!showCourseMetaDataFields &&
                            <div className={styles.saveCourseBtnBox}>
                                <button className='primarySolidBtn' htmltype='submit' >حفظ ومتابعة</button>
                            </div>
                        }
                    </div>
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
                                                                <div className='flex justify-center items-center h-100'>
                                                                    <AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#2D2E2D'} />
                                                                </div>
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
                                                            <div className='flex justify-center items-center h-100 cursor-pointer' onClick={() => { deleteCourseDetails(index, remove, name, "courseMeta") }}>
                                                                <AllIconsComponenet iconName={'deletecourse'} height={18} width={14} color={'#2D2E2D'} />
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
                                                                <div className='flex justify-center items-center h-100'><AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#2D2E2D'} /></div>
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
                                                            <div className='flex justify-center items-center h-100 cursor-pointer' onClick={() => { deleteCourseDetails(index, remove, name, "courseDetails") }}>
                                                                <AllIconsComponenet iconName={'deletecourse'} height={18} width={14} color={'#2D2E2D'} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </Form.List>
                                </div>
                                <div className={styles.publishedCourseDetails}>
                                    <Switch defaultChecked={editCourseData?.published} onChange={handleToggleChange} params={'published'} />
                                    <p style={{ marginRight: '3px' }}>نشر الدورة</p>
                                </div>
                                <div className={`pt-2 ${styles.publishedCourseDetails}`}>
                                    <Switch defaultChecked={editCourseData?.isPurchasable} onChange={handleToggleChange} params={'isPurchasable'} />
                                    <p style={{ marginRight: '3px' }}>إغلاق صفحة الدورة</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-[95%] px-6" >
                            <div className='flex'>
                                <CustomButton
                                    width={80}
                                    height={37}
                                    showLoader={showLoader}
                                    btnText='حفظ'
                                    fontSize={16}
                                />
                            </div>
                        </div>
                    </>
                }
            </Form>
        </div>
    )
}
export default CourseInfo