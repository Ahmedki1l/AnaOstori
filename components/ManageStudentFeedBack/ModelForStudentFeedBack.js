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
    const [numberOfMedia, setNumberOfMedia] = useState(0)

    const course = storeData.catagories.flatMap((item) => {
        return item.courses.map((subItem) => {
            return { value: subItem.id, label: subItem.name };
        });
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
        let body = {
            routeName: 'createReviewMedia',
            ...values,
        }
        await postAuthRouteAPI(editStudetReviews ? data2 : data1).then(async (res) => {
            if (uploadFileData) {
                await postAuthRouteAPI(body).then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                })
            }
            setNumberOfMedia(1)
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
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const addMedia = () => {
        if (uploadFileData.length > 3) {
            return
        }

        uploadFileData.push(JSON.parse(JSON.stringify({
            key: '',
            bucket: '',
            type: ''
        })))
        // if (uploadFileData[0].key == '' && uploadFileData[0].bucket == '' && uploadFileData[0].type == '') {
        //     setButtonDisabled(true);
        // } else  {
        //     setNumberOfMedia(numberOfMedia + 1);
        // }
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
                            {numberOfMedia > 0 &&
                                <div className={styles.addSectionArea}>
                                    <p className={`fontMedium text-lg`}>{studentFeedBackConst.addFeedBackPhoto}</p>
                                    <button style={{ display: 'contents' }} className={styles.addSections} disabled={buttonDisabled} onClick={() => addMedia()}>{studentFeedBackConst.addPhotoBtnText}</button >
                                </div>
                            }

                            {numberOfMedia > 0 &&
                                <>
                                    {uploadFileData.map((item, index) => {
                                        return (
                                            <UploadFileForCourseReviews
                                                key={`reviewMedia${index}`}
                                                type={'image/*'}
                                                pictureKey={editStudetReviews?.pictureKey}
                                                pictureBucket={editStudetReviews?.pictureBucket}
                                                uploadFileData={uploadFileData}
                                                setUploadFileData={setUploadFileData}
                                                index={index}
                                            />
                                        )
                                    })}
                                    {/* {Array.from({ length: numberOfMedia + 0 }, (_, index) => (
                                        <>
                                            <UploadFileForCourseReviews
                                                key={index}
                                                type={'image/*'}
                                                pictureKey={editStudetReviews?.pictureKey}
                                                pictureBucket={editStudetReviews?.pictureBucket}
                                                uploadFileData={uploadFileData}
                                                setUploadFileData={setUploadFileData}
                                            />
                                        </>
                                    ))} */}
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