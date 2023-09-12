
import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './ModelForAddInstructor.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import { FormItem } from '../antDesignCompo/FormItem'
import Input from '../antDesignCompo/Input'
import InputTextArea from '../antDesignCompo/InputTextArea'
import { createInstroctorAPI, editInstroctorAPI, getInstructorListAPI, uploadFileAPI } from '../../services/apisService'
import { deleteNullFromObj, stringUpdation } from '../../constants/DataManupulation'
import { useDispatch } from 'react-redux'
import Spinner from '../CommonComponents/spinner'
import { uploadFileSevices } from '../../services/UploadFileSevices'


const ModelForAddInstructor = ({
    isModelForAddInstructor,
    setIsModelForAddInstructor,
    isEdit,
    instructorDetails,
    setEditInstructor,
}) => {

    const [instructorForm] = Form.useForm();

    useEffect(() => {
        instructorForm.setFieldsValue(instructorDetails)
        if (instructorDetails?.phone) {
            instructorForm.setFieldValue('phone', instructorDetails?.phone?.replace("966", "0"))
        }
        setFileName(instructorDetails?.avatarKey)
    }, [])


    const [fileName, setFileName] = useState()
    const [fileUploadResponceData, setFileUploadResponceData] = useState()
    const dispatch = useDispatch()
    const [uploadLoader, setUploadLoader] = useState(false)

    const getFileKey = async (e) => {
        setUploadLoader(true)
        await uploadFileSevices(e.target.files[0]).then((res) => {
            const uploadFileBucket = res.split('.')[0].split('//')[1]
            const uploadFileKey = res.split('?')[0].split('/')[3]
            const uploadFileType = e.target.files[0].type
            setFileUploadResponceData({
                key: uploadFileKey,
                bucket: uploadFileBucket,
                mime: uploadFileType,
            })
            setFileName(e.target.files[0].name)
            setUploadLoader(false)
        }).catch((error) => {
            console.log(error);
            setUploadLoader(false)
        })
    }

    const getInstructorListReq = async () => {
        await getInstructorListAPI().then((res) => {
            dispatch({
                type: 'SET_INSTRUCTOR',
                instructorList: res?.data,
            })
        }).catch((err) => {
            console.log(err);
        })
    }

    const onFinish = (values) => {
        if (isEdit) {
            editInstructor(values)
        } else {
            addInstructor(values)
        }
    };

    const addInstructor = async (values) => {
        if (values.phone) {
            values.phone = values.phone.replace(/[0-9]/, "966")
        }
        if (fileUploadResponceData) {
            values.avatarKey = fileUploadResponceData.key
            values.avatarBucket = fileUploadResponceData.bucket
            values.avatarMime = fileUploadResponceData.mime
        }
        deleteNullFromObj(values)
        await createInstroctorAPI(values).then((res) => {
            instructorForm.resetFields()
            getInstructorListReq()
            setFileUploadResponceData()
            setIsModelForAddInstructor(false)
        }).catch((error) => {
            console.log(error);
        })
    }

    const editInstructor = async (values) => {
        values.id = instructorDetails.id
        if (values.phone) {
            values.phone = values.phone.replace(/[0-9]/, "966")
        }
        if (fileUploadResponceData) {
            values.avatarKey = fileUploadResponceData.key
            values.avatarBucket = fileUploadResponceData.bucket
            values.avatarMime = fileUploadResponceData.mime
        }
        deleteNullFromObj(values)
        await editInstroctorAPI(values).then((res) => {
            instructorForm.resetFields()
            getInstructorListReq()
            setFileName()
            setFileUploadResponceData()
            setIsModelForAddInstructor(false)
        }).catch((error) => {
            console.log(error);
        })
    }

    const isModelClose = () => {
        instructorForm.resetFields()
        setEditInstructor()
        setIsModelForAddInstructor(false)
    }
    const handleRemoveFile = () => {
        setFileName()
        setFileUploadResponceData()
    }

    return (
        <div>
            <Modal
                className='addAppoinmentModal'
                open={isModelForAddInstructor}
                onCancel={isModelClose}
                closeIcon={false}
                footer={false}>

                <div className={styles.modalHeader}>
                    <button onClick={isModelClose} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                    <p className={`fontBold ${styles.addInstructor}`}>إضافة مدرب</p>
                </div>
                <div dir='rtl'>
                    <Form form={instructorForm} onFinish={onFinish}>
                        <div className={styles.createAppointmentFields}>
                            <FormItem
                                name={'name'}
                                rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder='اسم المدرب'
                                />
                            </FormItem>
                            <FormItem
                                name={'email'}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder='الايميل'
                                />
                            </FormItem>
                            <FormItem
                                name={'phone'}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder='رقم الجوال'
                                />
                            </FormItem>
                            <FormItem
                                name={'role'}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder='المنصب'
                                />
                            </FormItem>
                            <p className={`mb-3 fontBold ${styles.addInstructor}`}>الملف التعريفي</p>
                            <div className={styles.uploadVideoWrapper}>
                                <input type={'file'} id='uploadFileInput' className={styles.uploadFileInput} disabled={uploadLoader} onChange={getFileKey} />
                                <label htmlFor='uploadFileInput' className='cursor-pointer'>
                                    <div className={styles.IconWrapper} >
                                        <div className={styles.uploadFileWrapper}>
                                            <AllIconsComponenet iconName={'uploadFile'} height={20} width={20} color={'#6D6D6D'} />
                                        </div>
                                        <p>ارفق الملف</p>
                                    </div>
                                </label>
                                {fileName &&
                                    <div className={styles.uploadFileNameWrapper}>
                                        <div className={styles.closeIconWrapper} onClick={() => handleRemoveFile()}>
                                            <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#FF0000'} />
                                        </div>
                                        {stringUpdation(fileName, 20)}
                                    </div>
                                }
                                {uploadLoader &&
                                    <Spinner borderwidth={2.5} width={1.5} height={1.5} margin={0.5} />
                                }
                            </div>
                        </div>
                        <div className={styles.instructorFieldBorderBottom}>
                            <div className={styles.createAppointmentBtnBox}>
                                <button key='modalFooterBtn' className={styles.AddFolderBtn} type={'submit'} >حفظ</button>
                            </div>
                            {/* {isEdit &&
                                <div className={styles.deleteVideoBtn}>
                                    <button className='deleteBtn' type={'submit'} onClick={() => handleDeleteItems()}>حذف المدرب</button>
                                </div>
                            } */}
                        </div>
                    </Form>
                </div>
            </Modal>
        </div >
    )
}

export default ModelForAddInstructor

