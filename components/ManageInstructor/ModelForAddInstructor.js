
import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './ModelForAddInstructor.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import { FormItem } from '../antDesignCompo/FormItem'
import Input from '../antDesignCompo/Input'
import { createInstroctorAPI, editInstroctorAPI, getInstructorListAPI, uploadFileAPI } from '../../services/apisService'
import { deleteNullFromObj } from '../../constants/DataManupulation'
import UploadFileForModel from '../CommonComponents/UploadFileForModel/UploadFileForModel'
import { toast } from 'react-toastify'
import { adminPanelInstructorConst, createAndEditBtnText, toastErrorMessage, toastSuccessMessage } from '../../constants/ar'
import { getNewToken } from '../../services/fireBaseAuthService'
import CustomButton from '../CommonComponents/CustomButton'


const ModelForAddInstructor = ({
    isModelForAddInstructor,
    setIsModelForAddInstructor,
    isEdit,
    instructorDetails,
    setEditInstructor,
    getInstructorListReq,
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
    const [showBtnLoader, setShowBtnLoader] = useState(false)

    const onFinish = (values) => {
        if (isEdit) {
            editInstructor(values)
        } else {
            addInstructor(values)
        }
    };

    const apiSuccessRes = (msg) => {
        toast.success(msg)
        instructorForm.resetFields()
        getInstructorListReq()
        setFileUploadResponceData()
        setIsModelForAddInstructor(false)
    }

    const addInstructor = async (values) => {
        setShowBtnLoader(true)
        if (values.phone) {
            values.phone = values.phone.replace(/[0-9]/, "966")
        }
        if (avatarUploadResData) {
            values.avatarKey = avatarUploadResData?.key
            values.avatarBucket = avatarUploadResData?.bucket
            values.avatarMime = avatarUploadResData?.mime
        } else {
            values.ProfileFileKey = fileUploadResponceData?.key
            values.ProfileFileBucket = fileUploadResponceData?.bucket
            values.ProfileFileMime = fileUploadResponceData?.mime
        }
        deleteNullFromObj(values)
        await createInstroctorAPI(values).then((res) => {
            setShowBtnLoader(false)
            apiSuccessRes(toastSuccessMessage.instuctorCreateSuccessMsg)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await createInstroctorAPI(values).then(res => {
                        apiSuccessRes(toastSuccessMessage.instuctorCreateSuccessMsg)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
            toast.error(toastErrorMessage.tryAgainErrorMsg)
            console.log(error);
            setShowBtnLoader(false)
        })
    }

    const editInstructor = async (values) => {
        setShowBtnLoader(true)
        values.id = instructorDetails.id
        if (values.phone) {
            values.phone = values.phone.replace(/[0-9]/, "966")
        }
        if (avatarUploadResData) {
            values.avatarKey = avatarUploadResData?.key
            values.avatarBucket = avatarUploadResData?.bucket
            values.avatarMime = avatarUploadResData?.mime
        } else {
            values.ProfileFileKey = fileUploadResponceData?.key
            values.ProfileFileBucket = fileUploadResponceData?.bucket
            values.ProfileFileMime = fileUploadResponceData?.mime
        }
        deleteNullFromObj(values)
        await editInstroctorAPI(values).then((res) => {
            setShowBtnLoader(false)
            setFileName()
            apiSuccessRes(toastSuccessMessage.instuctorUpdateSuccessMsg)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await editInstroctorAPI(values).then(res => {
                        setFileName()
                        apiSuccessRes(toastSuccessMessage.instuctorUpdateSuccessMsg)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
            else {
                toast.error(toastErrorMessage.tryAgainErrorMsg)
            }
            setShowBtnLoader(false)
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
                    <p className={`fontBold ${styles.addInstructor}`}>{isEdit ? adminPanelInstructorConst.editInstructorTitle : adminPanelInstructorConst.addInstuctorTitle}</p>
                </div>
                <div dir='rtl'>
                    <Form form={instructorForm} onFinish={onFinish}>
                        <div className={styles.createAppointmentFields}>
                            <FormItem
                                name={'name'}
                                rules={[{ required: true, message: adminPanelInstructorConst.instructorNameErrorMsg }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={adminPanelInstructorConst.instructorName}
                                />
                            </FormItem>
                            <FormItem
                                name={'email'}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={adminPanelInstructorConst.instructorEmail}
                                />
                            </FormItem>
                            <FormItem
                                name={'phone'}
                                rules={[{ required: true, message: adminPanelInstructorConst.instructorPhoneNoErrorMsg }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={adminPanelInstructorConst.instructorPhoneNo}
                                />
                            </FormItem>
                            <FormItem
                                name={'role'}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={adminPanelInstructorConst.instructorRole}
                                />
                            </FormItem>

                            <p className={`mb-3 fontBold ${styles.addInstructor}`}>{adminPanelInstructorConst.instructorPhoto}</p>
                            <UploadFileForModel
                                fileName={instructorDetails?.avatarKey}
                                setFileName={setFileName}
                                uploadResData={setAvtarUploadResData}
                                fileType={'.jpg , .png'}
                                accept={"image"}
                                placeHolderName={'ارفق الصورة'}
                                setShowBtnLoader={setShowBtnLoader}
                            />

                            <p className={`mb-3 fontBold ${styles.addInstructor}`}>{adminPanelInstructorConst.instructorFile}</p>
                            <UploadFileForModel
                                fileName={instructorDetails?.ProfileFileKey}
                                setFileName={setFileName}
                                uploadResData={setFileUploadResponceData}
                                fileType={'.pdf , .doc , .docx'}
                                accept={"file"}
                                placeHolderName={'ارفق الملف'}
                                setShowBtnLoader={setShowBtnLoader}
                            />

                        </div>
                        <div className={styles.instructorFieldBorderBottom}>
                            <div className={styles.createInstructorBtnBox}>
                                <CustomButton
                                    btnText={isEdit ? createAndEditBtnText.saveBtnText : createAndEditBtnText.addBtnText}
                                    width={80}
                                    height={37}
                                    showLoader={showBtnLoader}
                                    fontSize={16}
                                    fileUploadResponceData={fileUploadResponceData}
                                />
                            </div>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div >
    )
}

export default ModelForAddInstructor

