
import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './ModelForAddInstructor.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import { FormItem } from '../antDesignCompo/FormItem'
import Input from '../antDesignCompo/Input'
import { createInstroctorAPI, editInstroctorAPI, routeAPI } from '../../services/apisService'
import { deleteNullFromObj } from '../../constants/DataManupulation'
import UploadFileForModel from '../CommonComponents/UploadFileForModel/UploadFileForModel'
import { toast } from 'react-toastify'
import { createAndEditBtnText, toastErrorMessage } from '../../constants/ar'
import { getNewToken } from '../../services/fireBaseAuthService'
import CustomButton from '../CommonComponents/CustomButton'
import { instructorConst } from '../../constants/adminPanelConst/instructorConst'

const ModelForAddInstructor = ({
    isModelForAddInstructor,
    setIsModelForAddInstructor,
    isEdit,
    instructorDetails,
    setEditInstructor,
    getInstructorListReq,
}) => {

    const [instructorForm] = Form.useForm();
    const [fileName, setFileName] = useState()
    const [avatarUploadResData, setAvtarUploadResData] = useState()
    const [fileUploadResponceData, setFileUploadResponceData] = useState()
    const [showBtnLoader, setShowBtnLoader] = useState(false)

    useEffect(() => {
        instructorForm.setFieldsValue(instructorDetails)
        if (instructorDetails?.phone) {
            instructorForm.setFieldValue('phone', instructorDetails?.phone?.replace("966", "0"))
        }
        if (instructorDetails?.avatarKey) {
            setAvtarUploadResData({
                key: instructorDetails.avatarKey,
                bucket: instructorDetails.avatarBucket,
                mime: instructorDetails.avatarMime
            })
        }
        if (instructorDetails?.ProfileFileKey) {
            setFileUploadResponceData({
                key: instructorDetails.ProfileFileKey,
                bucket: instructorDetails.ProfileFileBucket,
                mime: instructorDetails.ProfileFileMime
            })
        }
        setFileName(instructorDetails?.avatarKey)
    }, [])


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
        setIsModelForAddInstructor(false)
    }

    const addInstructor = async (values) => {
        setShowBtnLoader(true)
        if (avatarUploadResData) {
            values.avatarKey = avatarUploadResData?.key
            values.avatarBucket = avatarUploadResData?.bucket
            values.avatarMime = avatarUploadResData?.mime
        }
        if (fileUploadResponceData) {
            values.ProfileFileKey = fileUploadResponceData?.key
            values.ProfileFileBucket = fileUploadResponceData?.bucket
            values.ProfileFileMime = fileUploadResponceData?.mime
        }
        deleteNullFromObj(values)
        let body = {
            routeName: "createInstructor",
            ...values
        }
        await routeAPI(body).then((res) => {
            setShowBtnLoader(false)
            apiSuccessRes(instructorConst.successAddedNewInstructorToast)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await routeAPI(body).then(res => {
                        apiSuccessRes(instructorConst.successAddedNewInstructorToast)
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
        if (avatarUploadResData) {
            values.avatarKey = avatarUploadResData?.key
            values.avatarBucket = avatarUploadResData?.bucket
            values.avatarMime = avatarUploadResData?.mime
        }
        if (fileUploadResponceData) {
            values.ProfileFileKey = fileUploadResponceData?.key
            values.ProfileFileBucket = fileUploadResponceData?.bucket
            values.ProfileFileMime = fileUploadResponceData?.mime
        }
        deleteNullFromObj(values)
        values.id = instructorDetails.id
        let body = {
            routeName: "updateInstructorHandler",
            ...values
        }
        await routeAPI(body).then((res) => {
            setShowBtnLoader(false)
            setFileName()
            apiSuccessRes(instructorConst.successNewInstructorUpdatedToast)
            instructorForm.resetFields()
        }).catch(async (error) => {
            setShowBtnLoader(false)
            console.log(error);
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await routeAPI(body).then(res => {
                        setFileName()
                        apiSuccessRes(instructorConst.successNewInstructorUpdatedToast)
                        setShowBtnLoader(false)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
            else {
                toast.error(toastErrorMessage.tryAgainErrorMsg)
            }
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
                    <p className={`fontBold ${styles.addInstructor}`}>{isEdit ? instructorConst.editInstuctorTitle : instructorConst.addInstuctorTitle}</p>
                </div>
                <div dir='rtl'>
                    <Form form={instructorForm} onFinish={onFinish}>
                        <div className={styles.createAppointmentFields}>
                            <FormItem
                                name={'name'}
                                rules={[{ required: true, message: instructorConst.instructorNameErrorMsg }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={instructorConst.instructorName}
                                />
                            </FormItem>
                            <FormItem
                                name={'role'}
                                rules={[{ required: true, message: instructorConst.instructorRoleErrorMsg }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={instructorConst.instructorRole}
                                />
                            </FormItem>
                            <p className={`my-2 ${styles.addInstructor}`} style={{ fontWeight: 'bold' }}>{instructorConst.instructorPhoto}</p>
                            <div className='mt-1'>
                                <UploadFileForModel
                                    fileName={instructorDetails?.avatarKey}
                                    setFileName={setFileName}
                                    uploadResData={setAvtarUploadResData}
                                    fileType={'.jpg , .png'}
                                    accept={"image"}
                                    placeHolderName={instructorConst.atachPhoto}
                                    setShowBtnLoader={setShowBtnLoader}
                                />
                            </div>
                            <p className={`my-3 ${styles.addInstructor}`} style={{ fontWeight: 'bold' }}>{instructorConst.instructorFileIntro}</p>
                            <div className='mb-5'>
                                <UploadFileForModel
                                    fileName={instructorDetails?.ProfileFileKey}
                                    setFileName={setFileName}
                                    uploadResData={setFileUploadResponceData}
                                    fileType={'.pdf , .doc , .docx'}
                                    accept={"file"}
                                    placeHolderName={instructorConst.attachFile}
                                    setShowBtnLoader={setShowBtnLoader}
                                />
                            </div>
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
        </div>
    )
}

export default ModelForAddInstructor

