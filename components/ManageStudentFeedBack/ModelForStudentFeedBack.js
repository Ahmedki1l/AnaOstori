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
    const [selectedReviewId, setSelectedReviewId] = useState(editStudetReviews ? editStudetReviews.id : '')

    const course = storeData.catagories.flatMap((item) => {
        return item.courses.map((subItem) => {
            return { value: subItem.id, label: subItem.name };
        });
    })
    const editReviewsPictureKey = editStudetReviews?.ReviewMedia.map((item) => {
        return item
    })
    useEffect(() => {
        if (editStudetReviews) {
            reviewsForm.setFieldsValue(editStudetReviews)
            handleCatagorySelect(editStudetReviews.courseId)
        }
    }, [])

    const isModelClose = () => {
        setIsModelForStudentFeedBack(false)
        setEditStudetReviews()
    }

    const onFinish = async (values) => {
        values.rate = '5';
        let data1 = {
            routeName: 'createCourseReview',
            ...values,
        }
        let data2 = {
            routeName: 'updateCourseReview',
            ...values,
            id: editStudetReviews?.id,
        }
        const newData = uploadFileData.map((item) => {
            return {
                ...item,
                courseReviewId: selectedReviewId
            }
        })
        let body1 = {
            routeName: 'createReviewMedia',
            data: newData
        }
        let body2 = {
            routeName: 'updateReviewMedia',
            data: newData,
            id: editStudetReviews?.ReviewMedia.map((item) => item.id)
        }
        await postAuthRouteAPI(editStudetReviews ? data2 : data1).then(async (res) => {
            setSelectedReviewId(res?.data?.id)
            if (uploadFileData.length > 0) {
                await postAuthRouteAPI(editStudetReviews ? body2 : body1).then((res) => {
                    console.log(res);
                    setIsModelForStudentFeedBack(false)
                    getStudetnFeedBackList();
                }).catch((err) => {
                    console.log(err);
                })
            } else {
                let data = [...uploadFileData]
                data.push(JSON.parse(JSON.stringify({
                    contentFileKey: '',
                    contentFileMime: '',
                    contentFileBucket: ''
                })))
                setUploadFileData(data)
            }
        }).catch(async (err) => {
            if (err?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postAuthRouteAPI(body).then((res) => {
                        getStudetnFeedBackList();
                    })
                }).catch(err => {
                    console.error("err:", err);
                })
            }
            console.log(err);
        })
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
        console.log(data);
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
                            <div className={styles.courseNames}>
                                {selectCatagoryName}
                            </div>
                            {uploadFileData.length > 0 &&
                                <div className={styles.addSectionArea}>
                                    <p className={`fontMedium text-lg`}>{studentFeedBackConst.addFeedBackPhoto}</p>
                                    <button style={{ display: 'contents' }} className={styles.addSections} onClick={() => addMedia()}>{studentFeedBackConst.addPhotoBtnText}</button >
                                </div>
                            }
                            {uploadFileData.length > 0 &&
                                <>
                                    {uploadFileData.map((item, index) => {
                                        return (
                                            <UploadFileForCourseReviews
                                                key={`reviewMedia${index}`}
                                                type={'image/*'}
                                                pictureKey={editReviewsPictureKey.map((item) => item.contentFileKey)}
                                                pictureBucket={editReviewsPictureKey.map((item) => item.contentFileBucket)}
                                                uploadFileData={uploadFileData}
                                                setUploadFileData={setUploadFileData}
                                                index={index}
                                            />
                                        )
                                    })}
                                </>}
                        </div>
                        <div className='p-1'>
                            <div className={styles.studetnFeedBackBtnBox}>
                                <button className='primarySolidBtn'>{editStudetReviews ? studentFeedBackConst.saveBtnText : studentFeedBackConst.addBtnText}</button>
                            </div>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div >
    )
}

export default ModelForStudentFeedBack