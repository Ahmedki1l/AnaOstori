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


const ModelForAddItemLibrary = ({
    isModelForAddItemOpen,
    setIsModelForAddItemOpen,
    selectedFolder,
    folderType,
    selectedFolderId,
    selectedItem,
    onCloseModal,
}) => {

    const [ItemDetailsForm] = Form.useForm();
    const isEdit = selectedFolder != undefined ? true : false
    const [uploadLoader, setUploadLoader] = useState(false)
    const [fileName, setFileName] = useState()
    const [fileUploadResponceData, setFileUploadResponceData] = useState()

    useEffect(() => {
        ItemDetailsForm.setFieldsValue(selectedItem)
        setFileName(selectedItem?.linkKey)
    }, [selectedItem])

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
            body.linkKey = e.examLink
        }
        const data = {
            folderId: selectedFolderId ? selectedFolderId : selectedFolder?.id,
            data: body
        }
        await addItemToFolderAPI(data).then((res) => {
            onCloseModal(selectedFolderId ? selectedFolderId : selectedFolder?.id)
        }).catch((error) => {
            console.log(error);
        })
        ItemDetailsForm.resetFields()
        setIsModelForAddItemOpen(false);
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
            body.linkKey = e.examLink
        }
        const data = {
            data: body
        }
        await updateItemToFolderAPI(data).then((res) => {
            onCloseModal(selectedFolderId ? selectedFolderId : selectedFolder?.id)
        }).catch((error) => {
            console.log(error);
        })
        ItemDetailsForm.resetFields()
        setIsModelForAddItemOpen(false);
    }

    const onModelClose = () => {
        setIsModelForAddItemOpen(false)
    }

    const handleRemoveFile = () => {
        setFileName()
        setFileUploadResponceData()
    }
    return (
        <>
            <Modal
                className='addAppoinmentModal'
                open={isModelForAddItemOpen}
                // onCancel={() => onModelClose()}
                closeIcon={false}
                footer={false}>

                <div className={styles.modalHeader}>
                    <button onClick={() => onModelClose()} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                    <p className={`fontBold ${styles.createappointment}`}>إضافة فيديو</p>
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
                                <div className={styles.uploadVideoWrapper}>
                                    <input type={'file'} id='uploadFileInput' className={styles.uploadFileInput} disabled={uploadLoader} onChange={getFileKey} />
                                    <label htmlFor='uploadFileInput' className='cursor-pointer'>
                                        <div className={styles.IconWrapper}>
                                            <div className={styles.uploadFileWrapper}>
                                                <AllIconsComponenet iconName={'uploadFile'} height={20} width={20} color={'#6D6D6D'} />
                                            </div>
                                            <p>ارفق الملف</p>
                                        </div>
                                    </label>
                                    {fileName &&
                                        <div className={styles.uploadFileNameWrapper}>
                                            <div className={styles.closeIconWrapper} onClick={() => handleRemoveFile()}><AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#FF0000'} /></div>
                                            {fileName}
                                        </div>
                                    }
                                    {uploadLoader &&
                                        <Spinner borderwidth={2.5} width={1.5} height={1.5} margin={0.5} />
                                    }
                                </div>
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
                                        name={'linkKey'}
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
                                {folderType !== "quiz" && <button key='modalFooterBtn' className={`primarySolidBtn ${styles.AddFolderBtn}`} type={'submit'} disabled={fileName ? false : true} >{isEdit ? "حفظ" : "إنشاء"}</button>}
                                {folderType == "quiz" && <button key='modalFooterBtn' className={`primarySolidBtn ${styles.AddFolderBtn}`} type={'submit'} >{isEdit ? "حفظ" : "إنشاء"}</button>}
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