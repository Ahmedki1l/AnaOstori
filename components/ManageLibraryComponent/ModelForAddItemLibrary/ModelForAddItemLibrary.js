import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import styles from './ModelForAddItemLibrary.module.scss'
import { useSelector } from 'react-redux';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { FormItem } from '../../antDesignCompo/FormItem';
import Input from '../../antDesignCompo/Input';
import InputTextArea from '../../antDesignCompo/InputTextArea';
import { addItemToFolderAPI, uploadFileAPI } from '../../../services/apisService';

const ModelForAddItemLibrary = ({
    isModelForAddItemOpen,
    setIsModelForAddItemOpen,
    selectedFolder,
    folderType,
    selectedFolderId,
    selectedItem,
}) => {

    const [form] = Form.useForm();
    const storeData = useSelector((state) => state?.globalStore);
    const isEdit = selectedFolder != undefined ? true : false
    const [uploadLoader, setUploadLoader] = useState(false)
    const [fileName, setFileName] = useState()
    const [fileUploadResponceData, setFileUploadResponceData] = useState()
    const [closebutton, setCloseButton] = useState(true)

    useEffect(() => {
        form.setFieldValue('fileTitle', selectedItem?.name)
        form.setFieldValue('fileDescription', selectedItem?.description)
        setFileName(selectedItem?.linkKey)
    }, [selectedItem])

    const getFileKey = async (e) => {
        setUploadLoader(true)
        setFileName(e.target.files[0].name)
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        const data = {
            formData,
            accessToken: storeData?.accessToken
        }
        await uploadFileAPI(data).then((res) => {
            setFileUploadResponceData(res.data)
            setUploadLoader(false)
        }).catch((error) => {
            console.log(error);
            setUploadLoader(false)
        })
    }

    const addItemToFolder = async (e) => {
        const { key, bucket, mime } = fileUploadResponceData
        const body = {
            name: e.fileTitle,
            description: e.fileDescription,
            type: "file",
            linkKey: key,
            linkBucket: bucket,
            linkMime: mime,
            previewAvailable: true,
        }
        console.log(body);
        const data = {
            accessToken: storeData?.accessToken,
            folderId: selectedFolderId ? selectedFolderId : selectedFolder?.id,
            data: body
        }
        await addItemToFolderAPI(data).then((res) => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        })
        form.resetFields()
        setIsModelForAddItemOpen(false);
    }
    const handleRemoveFile = () => {
        setFileName([])
        setFileUploadResponceData([])
        setCloseButton(false)
    }
    return (
        <>
            <Modal
                className='addAppoinmentModal'
                open={isModelForAddItemOpen}
                onCancel={() => setIsModelForAddItemOpen(false)}
                closeIcon={false}
                footer={false}>

                <div className={styles.modalHeader}>
                    <button onClick={() => setIsModelForAddItemOpen(false)} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                    <p className={`fontBold ${styles.createappointment}`}>إضافة فيديو</p>
                </div>
                <div dir='rtl'>
                    <Form form={form} onFinish={addItemToFolder}>
                        <div className={styles.createAppointmentFields}>
                            <FormItem
                                name={'fileTitle'}
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
                                name={'fileDescription'}>
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
                                        <div className={styles.IconWrapper} >
                                            <div className={styles.uploadFileWrapper}>
                                                <AllIconsComponenet iconName={'uploadFile'} height={20} width={20} color={'#6D6D6D'} />
                                            </div>
                                            <p>ارفق الملف</p>
                                        </div>
                                    </label>
                                    {console.log(fileName)}
                                    {fileName && <div className={styles.uploadFileNameWrapper}>
                                        {closebutton && <div className={styles.closeIconWrapper} onClick={() => handleRemoveFile()}><AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#FF0000'} /></div>}
                                        {fileName}
                                    </div>}
                                </div>
                            }
                            {folderType == "quiz" &&
                                <>
                                    <div className="flex">
                                        <div>
                                            <FormItem
                                                name={'questions'}
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
                                                name={'passed'}
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
                                        name={'examLink'}
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
                        {console.log(fileUploadResponceData)}
                        <div className={styles.AppointmentFieldBorderBottom}>
                            <div className={styles.createAppointmentBtnBox}>
                                <button key='modalFooterBtn' className='primarySolidBtn' type={'submit'} disabled={fileUploadResponceData?.key == undefined ? true : false} >{isEdit ? "حفظ" : "إنشاء"}</button>
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