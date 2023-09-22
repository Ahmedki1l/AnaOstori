import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import styles from './ModelForAddItemLibrary.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { FormItem } from '../../antDesignCompo/FormItem';
import Input from '../../antDesignCompo/Input';
import InputTextArea from '../../antDesignCompo/InputTextArea';
import { addItemToFolderAPI, updateItemToFolderAPI } from '../../../services/apisService';
import Spinner from '../../CommonComponents/spinner';
import { uploadFileSevices } from '../../../services/UploadFileSevices';
import { getNewToken } from '../../../services/fireBaseAuthService';
import UploadFileForModel from '../../CommonComponents/UploadFileForModel/UploadFileForModel';


const ModelForAddItemLibrary = ({
    isModelForAddItemOpen,
    selectedFolder,
    folderType,
    selectedFolderId,
    selectedItem,
    onCloseModal,
}) => {
    const [ItemDetailsForm] = Form.useForm();
    const isEdit = selectedItem?.id ? true : false
    const [fileName, setFileName] = useState()
    const [fileUploadResponceData, setFileUploadResponceData] = useState()

    useEffect(() => {
        ItemDetailsForm.setFieldsValue(selectedItem)
        setFileName(selectedItem?.linkKey)
    }, [selectedItem])

    const onFinish = (values) => {
        if (isEdit) {
            editFolderItems(values)
        } else {
            addItemToFolder(values)
        }
    };

    const addItemToFolder = async (e) => {
        let body = {}
        if (folderType !== "quiz") {
            body.name = e.name
            body.description = e.description
            body.type = folderType
            body.linkKey = fileUploadResponceData?.key
            body.linkBucket = fileUploadResponceData?.bucket
            body.linkMime = fileUploadResponceData?.mime
            body.previewAvailable = true
        }
        else {
            body.name = e.name
            body.description = e.description
            body.type = folderType
            body.previewAvailable = true
            body.numberOfQuestions = e.numberOfQuestions
            body.numberOfQuestionsToPass = e.numberOfQuestionsToPass
            body.quizLink = e.quizLink
        }
        const data = {
            folderId: selectedFolderId ? selectedFolderId : selectedFolder?.id,
            data: body
        }
        await addItemToFolderAPI(data).then((res) => {
            onCloseModal(selectedFolderId ? selectedFolderId : selectedFolder?.id)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await addItemToFolderAPI(data).then(res => {
                        onCloseModal(selectedFolderId ? selectedFolderId : selectedFolder?.id)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
        ItemDetailsForm.resetFields()
    }
    const editFolderItems = async (e) => {
        let body = {}
        if (folderType !== "quiz") {
            body.id = selectedItem.id
            body.name = e.name
            body.description = e.description
            body.type = folderType
            body.linkKey = fileUploadResponceData?.key
            body.linkBucket = fileUploadResponceData?.bucket
            body.linkMime = fileUploadResponceData?.mime
            body.previewAvailable = true
        }
        else {
            body.id = selectedItem.id
            body.name = e.name
            body.description = e.description
            body.type = folderType
            body.previewAvailable = true
            body.numberOfQuestions = e.numberOfQuestions
            body.numberOfQuestionsToPass = e.numberOfQuestionsToPass
            body.quizLink = e.quizLink
        }
        const data = {
            data: body
        }
        await updateItemToFolderAPI(data).then((res) => {
            onCloseModal(selectedFolderId ? selectedFolderId : selectedFolder?.id)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await updateItemToFolderAPI(data).then(res => {
                        onCloseModal(selectedFolderId ? selectedFolderId : selectedFolder?.id)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
        ItemDetailsForm.resetFields()
    }

    const onModelClose = () => {
        ItemDetailsForm.resetFields()
        onCloseModal(selectedFolderId ? selectedFolderId : selectedFolder?.id)
    }

    return (
        <>
            <Modal
                className='addAppoinmentModal'
                open={isModelForAddItemOpen}
                onCancel={() => onModelClose()}
                closeIcon={false}
                footer={false}>

                <div className={styles.modalHeader}>
                    <button onClick={() => onModelClose()} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                    <p className={`fontBold ${styles.createappointment}`}>
                        {folderType == 'video' && isEdit ? 'تعديل الفيديو' : 'إضافة فيديو' ||
                            folderType == 'file' && isEdit ? 'إضافة ملف' : 'إضافة ملف' ||
                                folderType == 'quiz' && isEdit ? 'تعديل الاختبار' : 'إضافة اختبار'
                        }
                    </p>
                    {/* <p className={`fontBold ${styles.createappointment}`}>{folderType == 'video' ? 'إضافة فيديو' : folderType == 'file' ? 'إضافة ملف' : 'إضافة اختبار'}</p> */}
                </div>
                <div dir='rtl'>
                    <Form form={ItemDetailsForm} onFinish={onFinish}>
                        <div className={styles.createAppointmentFields}>
                            <FormItem
                                name={'name'}
                                rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder="عنوان الفيديو"
                                />
                            </FormItem>
                            <FormItem
                                name={'description'}>
                                <InputTextArea
                                    fontSize={16}
                                    height={76}
                                    width={352}
                                    placeholder="وصف الفيديو"
                                />
                            </FormItem>
                            {folderType !== "quiz" &&
                                <UploadFileForModel
                                    fileName={selectedItem?.linkKey}
                                    setFileName={setFileName}
                                    uploadResData={setFileUploadResponceData}
                                    fileType={folderType == 'video' ? '.mp4' : '.pdf , .doc , .docx'}
                                    accept={"image"}
                                    placeHolderName={'ارفق الصورة'}
                                />
                            }
                            {folderType == "quiz" &&
                                <>
                                    <div className="flex">
                                        <div>
                                            <FormItem
                                                name={'numberOfQuestions'}
                                                rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                                            >
                                                <Input
                                                    fontSize={16}
                                                    width={170}
                                                    height={40}
                                                    placeholder="عدد الأسئلة"
                                                />
                                            </FormItem>
                                        </div>
                                        <div>
                                            <FormItem
                                                name={'numberOfQuestionsToPass'}
                                                rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                                            >
                                                <Input
                                                    fontSize={16}
                                                    width={170}
                                                    height={40}
                                                    placeholder="عدد الأسئلة"
                                                />
                                            </FormItem>
                                        </div>
                                    </div>
                                    <FormItem
                                        name={'quizLink'}
                                        rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                                    >
                                        <Input
                                            fontSize={16}
                                            width={352}
                                            height={40}
                                            placeholder="رابط الاختبار"
                                        />
                                    </FormItem>
                                </>
                            }
                        </div>
                        <div className={styles.AppointmentFieldBorderBottom}>
                            <div className={styles.createAppointmentBtnBox}>
                                {folderType !== "quiz" && <button key='modalFooterBtn' className={`primarySolidBtn ${styles.AddFolderBtn}`} type={'submit'} disabled={fileName ? false : true} >{isEdit ? "حفظ" : "إضافة"}</button>}
                                {folderType == "quiz" && <button key='modalFooterBtn' className={`primarySolidBtn ${styles.AddFolderBtn}`} type={'submit'} >{isEdit ? "حفظ" : "إضافة"}</button>}
                            </div>
                            {isEdit &&
                                <div className={styles.deleteVideoBtn}>
                                    <button className='deleteBtn' type={'submit'} >حذف الفيديو</button>
                                </div>
                            }
                        </div>
                    </Form>
                </div>
            </Modal>
        </>
    );
}

export default ModelForAddItemLibrary;