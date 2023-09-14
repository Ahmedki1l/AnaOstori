
import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './ModelForAddInstructor.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import { FormItem } from '../antDesignCompo/FormItem'
import Input from '../antDesignCompo/Input'
import { createInstroctorAPI, editInstroctorAPI, getInstructorListAPI, uploadFileAPI } from '../../services/apisService'
import { deleteNullFromObj } from '../../constants/DataManupulation'
import { useDispatch } from 'react-redux'
import UploadFileForModel from '../CommonComponents/UploadFileForModel/UploadFileForModel'


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
    const [avatarUploadResData, setAvtarUploadResData] = useState()
    const [fileUploadResponceData, setFileUploadResponceData] = useState()
    const dispatch = useDispatch()
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
        if (avatarUploadResData) {
            values.avatarKey = avatarUploadResData.key
            values.avatarBucket = avatarUploadResData.bucket
            values.avatarMime = avatarUploadResData.mime
        } else {
            values.ProfileFileKey = fileUploadResponceData.key
            values.ProfileFileBucket = fileUploadResponceData.bucket
            values.ProfileFileMime = fileUploadResponceData.mime
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
        if (avatarUploadResData) {
            values.avatarKey = avatarUploadResData.key
            values.avatarBucket = avatarUploadResData.bucket
            values.avatarMime = avatarUploadResData.mime
        } else {
            values.ProfileFileKey = fileUploadResponceData.key
            values.ProfileFileBucket = fileUploadResponceData.bucket
            values.ProfileFileMime = fileUploadResponceData.mime
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
                    <p className={`fontBold ${styles.addInstructor}`}>{isEdit ? 'تعديل بيانات المدرب' : 'إضافة مدرب'}</p>
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

                            <p className={`mb-3 fontBold ${styles.addInstructor}`}>صورة المدرب</p>
                            <UploadFileForModel
                                fileName={instructorDetails?.avatarKey}
                                setFileName={setFileName}
                                uploadResData={setAvtarUploadResData}
                                fileType={'.jpg , .png'}
                                accept={"image"}
                                placeHolderName={'ارفق الصورة'}
                            />

                            <p className={`mb-3 fontBold ${styles.addInstructor}`}>الملف التعريفي</p>
                            <UploadFileForModel
                                fileName={instructorDetails?.ProfileFileKey}
                                setFileName={setFileName}
                                uploadResData={setFileUploadResponceData}
                                fileType={'.pdf , .doc , .docx'}
                                accept={"file"}
                                placeHolderName={'ارفق الملف'}
                            />

                        </div>
                        <div className={styles.instructorFieldBorderBottom}>
                            <div className={styles.createAppointmentBtnBox}>
                                <button key='modalFooterBtn' className={styles.AddFolderBtn} type={'submit'} >حفظ</button>
                            </div>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div >
    )
}

export default ModelForAddInstructor

