import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { FormItem } from '../antDesignCompo/FormItem'
import Input from '../antDesignCompo/Input'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import styles from './ModelForStudentFeedBack.module.scss'
import { studentFeedBackConst } from '../../constants/adminPanelConst/manageStudentFeedBackConst/manageStudentFeedBackConst'
import Select from '../antDesignCompo/Select'
import { useSelector } from 'react-redux'
import { postAuthRouteAPI } from '../../services/apisService'
import { getNewToken } from '../../services/fireBaseAuthService'
import UploadFileForCourseReviews from '../CommonComponents/UploadFileForCourseReviews/UploadFileForCourseReviews'

const ModelForStudentFeedBack = ({
    isModelForStudentFeedBack,
    setIsModelForStudentFeedBack,
    getStudetnFeedBackList,
    editStudetReviews,
    setEditStudetReviews
}) => {

    const [reviewsForm] = Form.useForm()
    const storeData = useSelector((state) => state?.globalStore);
    const [selectCatagoryName, setSelectCatagoryName] = useState()
    const [uploadFileData, setUploadFileData] = useState([])
    const [editReviewData, setEditReviewData] = useState(editStudetReviews)

    const course = storeData.catagories.flatMap((item) => {
        return item.courses.map((subItem) => {
            return { value: subItem.id, label: subItem.name };
        });
    })
    useEffect(() => {
        if (editReviewData) {
            reviewsForm.setFieldsValue(editReviewData)
            handleCatagorySelect(editReviewData.courseId)
        }
        if (editReviewData?.ReviewMedia?.length > 0) {
            setUploadFileData(editReviewData?.ReviewMedia)
        }
        if (editReviewData?.ReviewMedia?.length == 0) {
            let data = [...uploadFileData]
            data.push(JSON.parse(JSON.stringify({
                contentFileKey: '',
                contentFileMime: '',
                contentFileBucket: ''
            })))
            setUploadFileData(data)
        }

    }, [editReviewData])


    const isModelClose = () => {
        setIsModelForStudentFeedBack(false)
        setEditStudetReviews()
    }
    const uploadReviewMediaValidate = () => {
        if (editReviewData && (editReviewData?.ReviewMedia?.length !== uploadFileData.length)) {
            return false;
        }

        for (let i = 0; i < editReviewData?.ReviewMedia.length; i++) {
            if (editReviewData?.ReviewMedia[i].contentFileKey !== uploadFileData[i].contentFileKey) {
                return false;
            }
        }
        return;
    }
    const handleCreateReviewMedia = async () => {
        if (!uploadReviewMediaValidate) return
        let newData = uploadFileData.map((item) => {
            return {
                contentFileKey: item.contentFileKey,
                contentFileMime: item.contentFileMime,
                contentFileBucket: item.contentFileBucket,
                courseReviewId: editReviewData?.id,
            }
        })
        let createReviewMedia = {
            routeName: 'createReviewMedia',
            data: newData
        }
        await postAuthRouteAPI(createReviewMedia).then((res) => {
            setIsModelForStudentFeedBack(false)
            getStudetnFeedBackList();
        }).catch(async (err) => {
            console.log(err);
        })
    }
    const onFinish = async (values) => {
        // if (editReviewData?.fullName == values?.fullName || editReviewData?.courseId == values?.courseId) {
        //     setIsModelForStudentFeedBack(false)
        //     return
        // }
        values.rate = '5';
        if (!editReviewData && uploadFileData.length == 0) {
            let createReviewBody = {
                routeName: 'createCourseReview',
                ...values,
            }
            await postAuthRouteAPI(createReviewBody).then(async (res) => {
                setEditReviewData(res.data)
                setEditStudetReviews(res.data)
                let data = [...uploadFileData]
                data.push(JSON.parse(JSON.stringify({
                    contentFileKey: '',
                    contentFileMime: '',
                    contentFileBucket: ''
                })))
                setUploadFileData(data)
            }).catch(async (err) => {
                console.log(err);
            })
        } else {
            if (editReviewData?.fullName !== values?.fullName || editReviewData?.courseId !== values?.courseId) {
                let updateReviewBody = {
                    routeName: 'updateCourseReview',
                    ...values,
                    id: editReviewData?.id,
                }
                await postAuthRouteAPI(updateReviewBody).then(async (res) => {
                    setEditReviewData(res.data)
                    setEditStudetReviews(res.data)
                }).catch(async (err) => {
                    console.log(err);
                })
            } else {
                handleCreateReviewMedia()
            }
        }
    }

    const handleSelectCourse = (value) => {
        handleCatagorySelect(value)
    }

    const handleCatagorySelect = (value) => {
        storeData.catagories.map((item) => {
            return item.courses.map((subItem) => {
                if (subItem.id === value) {
                    setSelectCatagoryName(item.name)
                }
            })
        })
    }
    const addMedia = () => {
        if (uploadFileData[0].contentFileBucket == '') {
            return
        }
        if (uploadFileData.length > 3) {
            return
        }
        let data = [...uploadFileData]
        data.push(JSON.parse(JSON.stringify({
            contentFileKey: '',
            contentFileMime: '',
            contentFileBucket: ''
        })))
        setUploadFileData(data)
    }
    return (
        <div>
            <Modal
                className='addAppoinmentModal'
                open={isModelForStudentFeedBack}
                onCancel={isModelClose}
                closeIcon={false}
                footer={false}
            >
                <div className={styles.modalHeader}>
                    <button onClick={isModelClose} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                    <p className={`fontBold ${styles.studentFeedBackTitle}`}>{editStudetReviews ? studentFeedBackConst.editStudentFeedBackTitle : studentFeedBackConst.addStudentFeedBackTitle}</p>
                </div>
                <div dir='rtl'>
                    <Form form={reviewsForm} onFinish={onFinish}>
                        <div className={styles.studentFeedBackFields}>
                            <p className={`fontMedium text-lg`}>{studentFeedBackConst.studentName}</p>
                            <FormItem
                                name={'fullName'}
                                rules={[{ required: true, message: 'ereruhgie' }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={47}
                                    placeholder={studentFeedBackConst.studentNamePlaceHolder}
                                />
                            </FormItem>
                            <p className={`fontMedium text-lg`}>{studentFeedBackConst.selectCategories}</p>
                            <FormItem
                                name={'courseId'}
                                rules={[{ required: true, message: 'selectCategories' }]}
                            >
                                <Select
                                    fontSize={16}
                                    width={352}
                                    height={47}
                                    placeholder={studentFeedBackConst.selectCategories}
                                    OptionData={course}
                                    onChange={handleSelectCourse}
                                />
                            </FormItem>
                            {/* <div className={styles.courseNames}>
                                {selectCatagoryName}
                            </div> */}
                            {uploadFileData.length > 0 &&
                                <div className={styles.addSectionArea}>
                                    <p className={`fontMedium text-lg`}>{studentFeedBackConst.addFeedBackPhoto}</p>
                                    <p className={styles.addSections} onClick={() => addMedia()}>{studentFeedBackConst.addPhotoBtnText}</p >
                                </div>
                            }
                            {uploadFileData.length > 0 &&
                                <>
                                    {uploadFileData.map((item, index) => {
                                        return (
                                            <UploadFileForCourseReviews
                                                key={`reviewMedia${index}`}
                                                type={'image/*'}
                                                uploadFileData={uploadFileData}
                                                setUploadFileData={setUploadFileData}
                                                index={index}
                                            />
                                        )
                                    })}
                                </>
                            }
                        </div>
                        <div className='p-1'>
                            <div className={styles.studetnFeedBackBtnBox}>
                                <button className='primarySolidBtn'>{editStudetReviews ? studentFeedBackConst.saveBtnText : studentFeedBackConst.addBtnText}</button>
                            </div>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    )
}

export default ModelForStudentFeedBack
