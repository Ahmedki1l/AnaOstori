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
import { postAuthRouteAPI, postRouteAPI } from '../../../services/apisService';
import { getNewToken } from '../../../services/fireBaseAuthService';
import SelectIcon from '../../antDesignCompo/SelectIcon';
import { toast } from 'react-toastify';
import { mediaUrl } from '../../../constants/DataManupulation';
import { toastErrorMessage, toastSuccessMessage } from '../../../constants/ar';
import * as PaymentConst from '../../../constants/PaymentConst'
import Switch from '../../antDesignCompo/Switch';
import UploadFile from '../../CommonComponents/UploadFileForCourse/UploadFile';
import CustomButton from '../../CommonComponents/CustomButton';
import { useRouter } from 'next/router';
import { courseToastSuccessMessage, createCoursePageConst, onDemandCourseConst, onlineCourseConst, physicalCourseConst } from '../../../constants/adminPanelConst/courseConst/courseConst';


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

    const curriculum = curriculumIds.filter((obj) => obj.itemCount != 0).map((obj) => {
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
        toast.success(toastSuccessMessage.courseCreatedSuccessMsg, { rtl: true, })
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
            values.locationName = courseType == "onDemand" ? 'بجودة عالية' : values.locationName
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
            if (courseType == "physical") {
                values.androidPrice = values.price
                values.iosPrice = values.price
                if (discountForOne) {
                    values.androidDiscount = values.discount
                    values.iosDiscount = values.discount
                }
                if (groupDiscountEligible) {
                    values.androidDiscountForTwo = values.discountForTwo
                    values.androidDiscountForThreeOrMore = values.discountForThreeOrMore
                    values.iosDiscountForTwo = values.discountForTwo
                    values.iosDiscountForThreeOrMore = values.discountForThreeOrMore
                }
            }
            if (courseType == "online") {
                values.androidPrice = values.price
                if (discountForOne) {
                    values.androidDiscount = values.discount
                }
                if (groupDiscountEligible) {
                    values.androidDiscountForTwo = values.discountForTwo
                    values.androidDiscountForThreeOrMore = values.discountForThreeOrMore
                }
            }

            let body = {
                routeName: 'createCourseByInstructor',
                type: courseType,
                ...values
            }
            await postAuthRouteAPI(body).then((res) => {
                createCourseApiSuccessRes(res)
            }).catch(async (error) => {
                console.log(error);
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await postAuthRouteAPI(body).then((res) => {
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
            obj.courseId = editCourseData?.id
            obj.tailLinkName = obj.tailLinkName ? obj.tailLinkName : null
            obj.tailLink = obj.tailLink ? obj.tailLink : null
            obj.link = obj.link ? obj.link : null
            obj.content = obj.content ? obj.content : null
            return obj
        })
        const courseMetaDataBody = {
            routeName: 'updateCourseMetaData',
            data: courseMetaData
        }
        let courseDetailsMetaData = values.courseDetailsMetaData.map((obj, index) => {
            delete obj.createdAt
            delete obj.updatedAt
            delete obj.grayedText
            obj.order = `${index + 1}`
            obj.courseId = editCourseData?.id
            obj.tailLinkName = obj.tailLinkName ? obj.tailLinkName : null
            obj.tailLink = obj.tailLink ? obj.tailLink : null
            obj.link = obj.link ? obj.link : null
            return obj
        })
        const courseDetailsMetaDataBody = {
            routeName: 'updateCourseDetailsMetaData',
            data: courseDetailsMetaData,
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
        delete values.courseMetaData
        delete values.courseDetailsMetaData

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
        if (courseType == "physical") {
            values.androidPrice = values.price
            values.iosPrice = values.price
            if (discountForOne) {
                values.androidDiscount = values.discount
                values.iosDiscount = values.discount
            }
            if (groupDiscountEligible) {
                values.androidDiscountForTwo = values.discountForTwo
                values.androidDiscountForThreeOrMore = values.discountForThreeOrMore
                values.iosDiscountForTwo = values.discountForTwo
                values.iosDiscountForThreeOrMore = values.discountForThreeOrMore
            }
        }
        if (courseType == "online") {
            values.androidPrice = values.price
            if (discountForOne) {
                values.androidDiscount = values.discount
            }
            if (groupDiscountEligible) {
                values.androidDiscountForTwo = values.discountForTwo
                values.androidDiscountForThreeOrMore = values.discountForThreeOrMore
            }
        }

        const courseBody = {
            ...values,
            id: editCourseData?.id,
            routeName: 'updateCourse'
        }

        try {
            const promiseArray = [];

            promiseArray.push(postAuthRouteAPI(courseBody));

            if (courseMetaDataBody.data.length > 0) {
                promiseArray.push(postRouteAPI(courseMetaDataBody));
            }
            if (courseDetailsMetaDataBody.data.length > 0) {
                promiseArray.push(postRouteAPI(courseDetailsMetaDataBody));
            }
            const [editCourse, editCourseMetaData, editCourseDetailsMetadata] = await Promise.all(promiseArray);

            let editCourseData;

            if (courseDetailsMetaDataBody.data.length === 0 && courseMetaDataBody.data.length > 0) {
                editCourseData = editCourseMetaData?.data;
            } else if (courseMetaDataBody.data.length === 0 && courseDetailsMetaDataBody.data.length > 0) {
                editCourseData = editCourseDetailsMetadata?.data;
            } else if (courseMetaDataBody.data.length === 0 && courseDetailsMetaDataBody.data.length === 0) {
                editCourseData = editCourse.data;
            } else {
                editCourseData = editCourse.data;
                editCourseData.courseMetaData = editCourseMetaData.data.courseMetaData;
                editCourseData.courseDetailsMetaData = editCourseDetailsMetadata.data.courseDetailsMetaData;
            }
            dispatch({ type: 'SET_EDIT_COURSE_DATA', editCourseData });
            toast.success(toastSuccessMessage.courseDetailUpdateMsg, { rtl: true, });
            setShowLoader(false);
        } catch (error) {
            setShowLoader(false);
            console.log(error);
            if (error?.response?.status === 401) {
                async function reAuthenticate() {
                    await getNewToken().then(async (token) => {
                        const promiseArray = [];

                        promiseArray.push(postAuthRouteAPI(courseBody));

                        if (courseMetaDataBody.data.length > 0) {
                            promiseArray.push(postRouteAPI(courseMetaDataBody));
                        }
                        if (courseDetailsMetaDataBody.data.length > 0) {
                            promiseArray.push(postRouteAPI(courseDetailsMetaDataBody));
                        }
                        const [editCourse, editCourseMetaData, editCourseDetailsMetadata] = await Promise.all(promiseArray);

                        let editCourseData;

                        if (courseDetailsMetaDataBody.data.length === 0 && courseMetaDataBody.data.length > 0) {
                            editCourseData = editCourseMetaData?.data;
                        } else if (courseMetaDataBody.data.length === 0 && courseDetailsMetaDataBody.data.length > 0) {
                            editCourseData = editCourseDetailsMetadata?.data;
                        } else if (courseMetaDataBody.data.length === 0 && courseDetailsMetaDataBody.data.length === 0) {
                            editCourseData = editCourse.data;
                        } else {
                            editCourseData = editCourseDetailsMetadata.data;
                            editCourseData.courseDetailsMetaData = editCourseDetailsMetadata.data.courseDetailsMetaData;
                        }
                        dispatch({ type: 'SET_EDIT_COURSE_DATA', editCourseData });
                        toast.success(toastSuccessMessage.courseDetailUpdateMsg, { rtl: true, });
                        setShowLoader(false);
                    })
                }

            } else {
                toast.error(toastErrorMessage.tryAgainErrorMsg, { rtl: true, });
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
                routeName: 'deleteCourse',
                type: deleteFieldName,
                courseId: editCourseData.id,
                id: deleteFieldName == 'courseDetails' ? data.courseDetailsMetaData[index]?.id : data.courseMetaData[index]?.id
            }
            await postAuthRouteAPI(body).then((res) => {
                data.courseMetaData.splice(index, 1)
                remove(name)
                dispatch({ type: 'SET_EDIT_COURSE_DATA', editCourseData: res.data })
                setShowLoader(false)
            }).catch(async (error) => {
                setShowLoader(false)
                console.log(error);
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await postAuthRouteAPI(body).then((res) => {
                            data.courseMetaData.splice(index, 1)
                            remove(name)
                            dispatch({ type: 'SET_EDIT_COURSE_DATA', editCourseData: res.data })
                            setShowLoader(false)
                        }).catch(error => {
                            console.log(error);
                        });
                    })
                }
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
            id: editCourseData.id,
            routeName: 'updateCourse'
        }
        params == "published" ? body.published = e : body.isPurchasable = e
        await postAuthRouteAPI(body).then((res) => {
            if (params == "published") {
                if (e) {
                    toast.success(courseToastSuccessMessage.toMakeCoursePublished, { rtl: true, })
                } else {
                    toast.success(courseToastSuccessMessage.toMakeCourseNotPublished, { rtl: true, })
                }
            } else {
                if (e) {
                    toast.success(courseToastSuccessMessage.toMakeCoursePurchasable, { rtl: true, })
                } else {
                    toast.success(courseToastSuccessMessage.toMakeCourseNotPurchasable, { rtl: true, })
                }
            }
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postAuthRouteAPI(body).then((res) => {
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <div>
            <Form form={courseInfoForm} onFinish={onFinishCreateCourse} >
                <div className='px-6'>
                    <FormItem
                        name={'name'}
                        rules={[{ required: true, message: createCoursePageConst.courseTitleInputErrorMsg }]}>
                        <Input
                            placeholder={createCoursePageConst.courseTitleInputPlaceHolder}
                        />
                    </FormItem>
                    <FormItem
                        name={'catagoryId'}
                        rules={[{ required: true, message: createCoursePageConst.selectCatagoryInputErrorMsg }]} >
                        <Select
                            placeholder={createCoursePageConst.selectCatagoryInputPlaceHolder}
                            OptionData={catagoriesItem}
                            filterOption={filterOption}
                        />
                    </FormItem>
                    <FormItem
                        name={'curriculumId'}
                        rules={[{ required: true, message: createCoursePageConst.selectCurriculumInputErrorMsg }]}  >
                        <Select
                            placeholder={createCoursePageConst.selectCurriculumInputPlaceHolder}
                            OptionData={curriculum}
                            filterOption={filterOption}
                        />
                    </FormItem>
                    <FormItem
                        name={'englishCourse'}
                    >
                        <CheckBox
                            disabled
                            label={' الدورة انجليزية'}
                            defaultChecked={englishCourse}
                            onChange={(e) => onChangeCourseChkBox(e, 'englishCourse')}
                        />
                    </FormItem>
                    <FormItem
                        name={'shortDescription'}
                        rules={[{ required: true, message: createCoursePageConst.addDiscriptionInputErrorMsg }]}
                    >
                        <InputTextArea
                            height={274}
                            width={549}
                            placeholder={createCoursePageConst.addDiscriptionInputPlaceHolder}
                        >
                        </InputTextArea>
                    </FormItem>
                    <p className={styles.uploadImageHeader}>{createCoursePageConst.attachPhotoHeadTitle}</p>
                    <div>
                        <UploadFile
                            pictureBucket={editCourseData?.pictureBucket}
                            pictureKey={editCourseData?.pictureKey}
                            courseVideoUrl={''}
                            setUploadFileData={setImageUploadResponceData}
                            accept={"image"}
                            type={'.jpg , .png'}
                            label={createCoursePageConst.attachPhotoInputPlaceHolder}
                        />
                    </div>
                    <p className={styles.uploadImageHeader}>{createCoursePageConst.attachVideoHeadTitle}</p>
                    <div>
                        <UploadFile
                            pictureBucket={isCourseEdit ? editCourseData?.pictureBucket : imageUploadResponceData?.bucket}
                            pictureKey={isCourseEdit ? editCourseData?.pictureKey : imageUploadResponceData?.key}
                            videoBucket={editCourseData?.videoBucket}
                            videoKey={editCourseData?.videoKey}
                            accept={"video"}
                            label={createCoursePageConst.attachVideoInputPlaceHolder}
                            type={'.mp4, .mov, .avi, .wmv, .fly, .webm, .mkv '}
                            setUploadFileData={setVideooUploadResponceData}
                        />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <div className='flex'>
                            <div className={styles.IconWrapper} >
                                <div className={styles.dropDownArrowWrapper}>
                                    <AllIconsComponenet iconName={'dropDown'} height={24} width={24} color={'#000000'} /></div>
                                <div className='flex justify-center items-center h-100'>
                                    <AllIconsComponenet iconName={courseType == "onDemand" ? 'newLiveTVIcon' : 'locationDoubleColor'} height={26} width={24} color={'#FFFFFF'} /></div>
                            </div>
                            <div className={styles.detailDataWrapper}>
                                <p>{courseType == 'physical' ? physicalCourseConst.locationFixedText :
                                    courseType == 'onDemand' ? onDemandCourseConst.locationFixedText
                                        : onlineCourseConst.locationFixedText}
                                </p>
                            </div>
                            {courseType == "onDemand" ?
                                <div className={styles.detailDataWrapper} style={{ marginBottom: '20px' }}>
                                    <p>{onDemandCourseConst.locationInputPlaceHolder}</p>
                                </div>
                                :
                                <FormItem
                                    name={'locationName'}
                                    rules={[{ required: true, message: courseType == "physical" ? physicalCourseConst.locationInputErrorMsg : onlineCourseConst.locationInputErrorMsg }]} >
                                    <Input
                                        height={47}
                                        width={247}
                                        placeholder={courseType == "physical" ? physicalCourseConst.locationInputPlaceHolder : onlineCourseConst.locationInputPlaceHolder}
                                    />
                                </FormItem>}
                        </div>
                        <div className='flex'>
                            <div className={styles.IconWrapper} >
                                <div className={styles.dropDownArrowWrapper}><AllIconsComponenet iconName={'dropDown'} height={24} width={24} color={'#000000'} /></div>
                                <div className='flex justify-center items-center h-100'>  <AllIconsComponenet iconName={'starDoubleColoredIcon'} height={24} width={24} color={'#FFCD3C'} ></AllIconsComponenet></div>
                            </div>
                            <div className={styles.detailDataWrapper}>
                                <p>{courseType == 'physical' ? physicalCourseConst.rateFixedText :
                                    courseType == 'onDemand' ? onDemandCourseConst.rateFixedText
                                        : onlineCourseConst.rateFixedText}</p>
                            </div>
                            <FormItem
                                name={'reviewRate'}
                                rules={[{
                                    required: true, message: courseType == 'physical' ? physicalCourseConst.rateInputError :
                                        courseType == 'onDemand' ? onDemandCourseConst.rateInputError
                                            : onlineCourseConst.rateInputError
                                }]} >
                                <Input
                                    height={47}
                                    width={247}
                                    placeholder={courseType == 'physical' ? physicalCourseConst.rateInputPlaceHolder :
                                        courseType == 'onDemand' ? onDemandCourseConst.rateInputPlaceHolder
                                            : onlineCourseConst.rateInputPlaceHolder}
                                />
                            </FormItem>
                        </div>
                        <div className='flex'>
                            <div className={styles.IconWrapper} >
                                <div className={styles.dropDownArrowWrapper}><AllIconsComponenet iconName={'dropDown'} height={24} width={24} color={'#000000'}></AllIconsComponenet></div>
                                <div className='flex justify-center items-center h-100'><AllIconsComponenet iconName={'personDoubleColoredIcon'} height={20} width={24} backColor={'#FFFFFF'} color={'#FFFFFF'}></AllIconsComponenet></div>
                            </div>
                            <div className={styles.detailDataWrapper}>
                                <p>{courseType == 'physical' ? physicalCourseConst.enrolledFixedText :
                                    courseType == 'onDemand' ? onDemandCourseConst.enrolledFixedText
                                        : onlineCourseConst.enrolledFixedText}
                                </p>
                            </div>
                            <FormItem
                                name={'numberOfGrarduates'}
                                rules={[{
                                    required: true, message: courseType == 'physical' ? physicalCourseConst.enrolledInputErrorMsg :
                                        courseType == 'onDemand' ? onDemandCourseConst.enrolledInputErrorMsg
                                            : onlineCourseConst.enrolledInputErrorMsg
                                }]} >
                                <Input
                                    height={47}
                                    width={247}
                                    placeholder={courseType == 'physical' ? physicalCourseConst.enrolledInputPlaceHolder :
                                        courseType == 'onDemand' ? onDemandCourseConst.enrolledInputPlaceHolder
                                            : onlineCourseConst.enrolledInputPlaceHolder}
                                />
                            </FormItem>
                        </div>
                    </div>
                </div>
                <div className={styles.borderline}>
                    <div className="w-[95%] p-6">
                        <p className={styles.secDetails}>{createCoursePageConst.priceSectionHeadTitle}</p>
                        <FormItem
                            name={'discount'}
                        >
                            <CheckBox
                                label={createCoursePageConst.checkboxCourseDiscount}
                                defaultChecked={discountForOne}
                                onChange={(e) => onChangeCheckBox(e, 'discount')}
                            />
                        </FormItem>
                        {courseType != 'onDemand' &&
                            <FormItem
                                name={'groupDiscountEligible'}
                            >
                                <CheckBox
                                    label={createCoursePageConst.checkboxCourseDiscountForGroup}
                                    defaultChecked={groupDiscountEligible}
                                    onChange={(e) => onChangeCheckBox(e, 'groupDiscountEligible')}
                                />
                            </FormItem>
                        }
                        {courseType == 'physical' ?
                            <>
                                <div className={styles.checkBoxHead}>
                                    <div>
                                        <AllIconsComponenet iconName={'appleStore'} height={24} width={24} color={'#2D2E2D'} />
                                    </div>
                                    <div className='px-2'>
                                        <AllIconsComponenet iconName={'mobileWebDevice'} height={24} width={24} color={'#2D2E2D'} />
                                    </div>
                                    <div >
                                        <AllIconsComponenet iconName={'androidStore'} height={24} width={24} color={'#2D2E2D'} />
                                    </div>
                                    <p className={styles.chechBoxHeadText}>{createCoursePageConst.priceLabelForAndroidIosWeb}</p>
                                </div>
                                <div className='flex'>
                                    <FormItem
                                        name={'price'}
                                        rules={[{ required: true, message: createCoursePageConst.priceForOneUserInputError }]}>
                                        <Input
                                            placeholder={createCoursePageConst.priceForOneUserInputPlaceHolder}
                                        />
                                    </FormItem>
                                    {discountForOne &&
                                        <FormItem
                                            name={'discount'}
                                            rules={[{ required: true, message: physicalCourseConst.inputForDiscountedPricePlaceHolder }]}  >
                                            <Input
                                                placeholder={physicalCourseConst.inputForDiscountedPricePlaceHolder}
                                            />
                                        </FormItem>
                                    }
                                </div>
                                {groupDiscountEligible &&
                                    <div className='flex'>
                                        <div>
                                            <FormItem
                                                name={'discountForTwo'}
                                                rules={[{ required: true, message: physicalCourseConst.priceForTwoInputErrorMsg }]} >
                                                <Input
                                                    placeholder={physicalCourseConst.priceForTwoInputPlaceHolder}
                                                />
                                            </FormItem>
                                            <FormItem
                                                name={'discountForThreeOrMore'}
                                                rules={[{ required: true, message: physicalCourseConst.priceForGroupInputErrorMsg }]} >
                                                <Input
                                                    placeholder={physicalCourseConst.priceForGroupInputPlaceHolder}
                                                />
                                            </FormItem>
                                        </div>
                                    </div>
                                }
                            </>
                            :
                            courseType == 'online' ?
                                <>
                                    <div className={styles.checkBoxHead}>
                                        <div className='px-2'>
                                            <AllIconsComponenet iconName={'mobileWebDevice'} height={24} width={24} color={'#2D2E2D'} />
                                        </div>
                                        <div>
                                            <AllIconsComponenet iconName={'androidStore'} height={24} width={24} color={'#2D2E2D'} />
                                        </div>
                                        <p className={styles.chechBoxHeadText}>{onlineCourseConst.priceLabelForAdndroidAndWeb}</p>
                                    </div>
                                    <div className='flex'>
                                        <FormItem
                                            name={'price'}
                                            rules={[{ required: true, message: onlineCourseConst.priceInputErrorMsg }]}>
                                            <Input
                                                placeholder={onlineCourseConst.priceInputPlaceHolder}
                                            />
                                        </FormItem>
                                        {discountForOne &&
                                            <FormItem
                                                name={'discount'}
                                                rules={[{ required: true, message: onlineCourseConst.inputForDiscountedPriceErrorMsg }]}  >
                                                <Input
                                                    placeholder={onlineCourseConst.inputForDiscountedPricePlaceHolder}
                                                />
                                            </FormItem>
                                        }
                                    </div>
                                    {groupDiscountEligible &&
                                        <div>
                                            <FormItem
                                                name={'discountForTwo'}
                                                rules={[{ required: true, message: onlineCourseConst.priceForTwoInputErrorMsg }]} >
                                                <Input
                                                    placeholder={onlineCourseConst.priceForTwoInputPlaceHolder}
                                                />
                                            </FormItem>
                                            <FormItem
                                                name={'discountForThreeOrMore'}
                                                rules={[{ required: true, message: onlineCourseConst.priceForGroupInputErrorMsg }]} >
                                                <Input
                                                    placeholder={onlineCourseConst.priceForGroupInputPlaceHolder}
                                                />
                                            </FormItem>
                                        </div>
                                    }
                                    <div className={styles.checkBoxHead}>
                                        <AllIconsComponenet iconName={'appleStore'} height={24} width={24} color={'#2D2E2D'} />
                                        <p className={styles.chechBoxHeadText}>{onlineCourseConst.pricelabelForAppleUser}</p>
                                    </div>
                                    <div className='flex'>
                                        <FormItem
                                            name={'iosPriceId'}
                                            rules={[{ required: true, message: createCoursePageConst.priceForOneUserInputError }]}>
                                            <Select
                                                placeholder={createCoursePageConst.priceForOneUserInputPlaceHolder}
                                                OptionData={iosProductIdList}
                                            />
                                        </FormItem>
                                        {discountForOne &&
                                            <FormItem
                                                name={'iosDiscountId'}
                                                rules={[{ required: true, message: onlineCourseConst.inputForDiscountedPriceErrorMsg }]}  >
                                                <Select
                                                    placeholder={onlineCourseConst.inputForDiscountedPricePlaceHolder}
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
                                                    rules={[{ required: true, message: onlineCourseConst.priceForTwoInputErrorMsg }]}  >
                                                    <Select
                                                        placeholder={onlineCourseConst.priceForTwoInputPlaceHolder}
                                                        OptionData={iosProductIdList}
                                                    />
                                                </FormItem>
                                                <FormItem
                                                    name={'iosDiscountForThreeOrMoreId'}
                                                    rules={[{ required: true, message: onlineCourseConst.priceForGroupInputErrorMsg }]}  >
                                                    <Select
                                                        placeholder={onlineCourseConst.priceForGroupInputPlaceHolder}
                                                        OptionData={iosProductIdList}
                                                    />
                                                </FormItem>
                                            </div>
                                        </div>
                                    }
                                </>
                                :
                                <>
                                    <div className={styles.checkBoxHead}>
                                        <AllIconsComponenet iconName={'mobileWebDevice'} height={24} width={24} color={'#2D2E2D'} />
                                        <p className={styles.chechBoxHeadText}>{createCoursePageConst.priceLabelForMobileWebUser}</p>
                                    </div>
                                    <div className='flex'>
                                        <FormItem
                                            name={'price'}
                                            rules={[{ required: true, message: createCoursePageConst.priceForOneUserInputError }]}>
                                            <Input
                                                placeholder={createCoursePageConst.priceForOneUserInputPlaceHolder}
                                            />
                                        </FormItem>
                                        {discountForOne &&
                                            <FormItem
                                                name={'discount'}
                                                rules={[{ required: true, message: createCoursePageConst.priceForOneUserInputError }]}  >
                                                <Input
                                                    placeholder={onDemandCourseConst.inputForDiscountedPricePlaceHolder}
                                                />
                                            </FormItem>
                                        }
                                    </div>
                                    <div className={styles.checkBoxHead}>
                                        <AllIconsComponenet iconName={'androidStore'} height={24} width={24} color={'#2D2E2D'} />
                                        <p className={styles.chechBoxHeadText}>{createCoursePageConst.priceLabelForAndroidUser}</p>
                                    </div>
                                    <div className='flex'>
                                        <FormItem
                                            name={'androidPrice'}
                                            rules={[{ required: true, message: createCoursePageConst.priceForOneUserInputError }]}>
                                            <Input
                                                placeholder={createCoursePageConst.priceForOneUserInputPlaceHolder}
                                            />
                                        </FormItem>
                                        {discountForOne &&
                                            <FormItem
                                                name={'androidDiscount'}
                                                rules={[{ required: true, message: createCoursePageConst.priceForOneUserInputError }]}  >
                                                <Input
                                                    placeholder={onDemandCourseConst.inputForDiscountedPricePlaceHolder}
                                                />
                                            </FormItem>
                                        }
                                    </div>
                                    <div className={styles.checkBoxHead}>
                                        <AllIconsComponenet iconName={'appleStore'} height={24} width={24} color={'#2D2E2D'} />
                                        <p className={styles.chechBoxHeadText}>{createCoursePageConst.priceLabelForIosUser}</p>
                                    </div>
                                    <div className='flex'>
                                        <FormItem
                                            name={'iosPriceId'}
                                            rules={[{ required: true, message: createCoursePageConst.priceForOneUserInputError }]}>
                                            <Select
                                                placeholder={createCoursePageConst.priceForOneUserInputPlaceHolder}
                                                OptionData={iosProductIdList}
                                            />
                                        </FormItem>
                                        {discountForOne &&
                                            <FormItem
                                                name={'iosDiscountId'}
                                                rules={[{ required: true, message: createCoursePageConst.priceForOneUserInputError }]}  >
                                                <Select
                                                    placeholder={onDemandCourseConst.inputForDiscountedPricePlaceHolder}
                                                    OptionData={iosProductIdList}
                                                />
                                            </FormItem>
                                        }
                                    </div>
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
                                                    <p className={styles.secDetails}>{createCoursePageConst.metaDataTitleForCourse}</p>
                                                    <p className={styles.addDetails} onClick={() => add()}>+ إضافة</p>
                                                </div>
                                                {field.map(({ name, key, ...restField }, index) => (
                                                    <div className={styles.courseDetails} key={key}>
                                                        <FormItem>
                                                            <div className='mt-2'>
                                                                <AllIconsComponenet iconName={'dragIcon'} height={27} width={27} color={'#808080a6'} />
                                                            </div>
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'title']}
                                                            rules={[{
                                                                required: true,
                                                                message: createCoursePageConst.metadataCourseTitleErrorMsg
                                                            },
                                                            ]}
                                                        >
                                                            <Input placeholder={createCoursePageConst.metadataCourseTitlePlaceHolder} width={216} height={47} />
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'content']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: createCoursePageConst.metadataTextInputErrorMsg
                                                                },
                                                            ]}
                                                        >
                                                            <Input placeholder={createCoursePageConst.metadataTextInputPlaceHolder} width={216} height={47} />
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'link']}
                                                        >
                                                            <Input placeholder={createCoursePageConst.metadataLinkInputPlaceHolder} width={216} height={47} />
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'tailLinkName']}
                                                        >
                                                            <Input placeholder={createCoursePageConst.metadataSeparateTextInputPlaceHolder} width={216} height={47} />
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'tailLink']}
                                                        >
                                                            <Input placeholder={createCoursePageConst.metadataLinkSeperatedTextInputPlaceHolder} width={216} height={47} />
                                                        </FormItem>
                                                        <div className={`${styles.deleteIconWrapper} cursor-pointer`} onClick={() => { deleteCourseDetails(index, remove, name, "courseMeta") }}>
                                                            <div className='flex justify-center items-center h-100 cursor-pointer' >
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
                                                            <div className='mt-2'>
                                                                <AllIconsComponenet iconName={'dragIcon'} height={27} width={27} color={'#808080a6'} />
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
                                                                    message: createCoursePageConst.metadataTextInputErrorMsg
                                                                },
                                                            ]}
                                                        >
                                                            <Input placeholder={createCoursePageConst.metadataTextInputPlaceHolder} width={295} height={47} />
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'link']}
                                                        >
                                                            <Input placeholder={createCoursePageConst.metadataLinkInputPlaceHolder} width={284} height={47} />
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'tailLinkName']}
                                                        >
                                                            <Input placeholder={createCoursePageConst.metadataSeparateTextInputPlaceHolder} width={216} height={47} />
                                                        </FormItem>
                                                        <FormItem
                                                            {...restField}
                                                            name={[name, 'tailLink']}
                                                        >
                                                            <Input placeholder={createCoursePageConst.metadataLinkSeperatedTextInputPlaceHolder} width={216} height={47} />
                                                        </FormItem>
                                                        <div className={`${styles.deleteIconWrapper} cursor-pointer`} >
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
                                    <p style={{ marginRight: '3px' }}>{createCoursePageConst.publishSwitchLabel}</p>
                                </div>
                                <div className={`pt-2 ${styles.publishedCourseDetails}`}>
                                    <Switch defaultChecked={editCourseData?.isPurchasable} onChange={handleToggleChange} params={'isPurchasable'} />
                                    <p style={{ marginRight: '3px' }}>{createCoursePageConst.ableToPurchaseSwitchLabel}</p>
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
            </Form >
        </div >
    )
}
export default CourseInfo