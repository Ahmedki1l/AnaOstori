

import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './ModelForAddCategory.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import { FormItem } from '../antDesignCompo/FormItem';
import Input from '../antDesignCompo/Input';
import InputTextArea from '../antDesignCompo/InputTextArea';
import Switch from '../antDesignCompo/Switch';
import { uploadFileAPI } from '../../services/apisService';
import Spinner from '../CommonComponents/spinner';

const ModelForAddCategory = ({
    isModelForAddCategory,
    setIsModelForAddCategory,
    isEdit,
    categoriesDetails,
}) => {

    console.log(categoriesDetails);

    useEffect(() => {
        form.setFieldsValue(categoriesDetails)
    }, [categoriesDetails])

    const [form] = Form.useForm();
    const [fileName, setFileName] = useState()
    const [fileUploadResponceData, setFileUploadResponceData] = useState()
    const [uploadLoader, setUploadLoader] = useState(false)


    const getFileKey = async (e) => {
        setUploadLoader(true)
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        const data = {
            formData,
        }
        await uploadFileAPI(data).then((res) => {
            setUploadLoader(false)
            setFileUploadResponceData(res.data)
            setFileName(e.target.files[0].name)
        }).catch((error) => {
            console.log(error);
            setUploadLoader(false)
        })
    }

    const getCategoryListReq = async () => {
        await getInstructorListAPI().then((res) => {
            dispatch({
                type: 'SET_CATAGORIES',
                catagoriesList: res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }
    const onFinish = (values) => {
        if (isEdit) {
            editCategory(values)
        } else {
            addCategory(values)
        }
        getCategoryListReq()
    };

    const addCategory = (values) => {
        console.log(values);
        form.resetFields()
        setIsModelForAddCategory(false)
    }

    const editCategory = async (values) => {
        console.log(values);
    }

    const handleDelete = (values) => {
        console.log(values);
    };

    const onChange = (checked) => {
        console.log(`switch to ${checked}`);
    };

    const isModelClose = () => {
        form.resetFields()
        setIsModelForAddCategory(false)
    }

    return (
        <div>
            <Modal
                className='addAppoinmentModal'
                open={isModelForAddCategory}
                onCancel={isModelClose}
                closeIcon={false}
                footer={false}>

                <div className={styles.modalHeader}>
                    <button onClick={isModelClose} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                    <p className={`fontBold ${styles.addCategory}`}>إضافة مجال</p>
                </div>
                <div dir='rtl'>
                    <Form form={form} onFinish={onFinish}>
                        <div className={styles.createAppointmentFields}>
                            <FormItem
                                name={'name'}
                                rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder="عنوان المجال"
                                />
                            </FormItem>
                            <FormItem
                                name={'order'}
                                rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder="الترتيب"
                                />
                            </FormItem>
                            <FormItem
                                name={'description'}>
                                <InputTextArea
                                    fontSize={16}
                                    height={132}
                                    width={352}
                                    placeholder="الوصف"
                                />
                            </FormItem>
                            <p className={`mb-3 fontBold ${styles.addInstructor}`}>صورة المجال</p>
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
                                        <div className={styles.closeIconWrapper} onClick={() => handleRemoveFile()}>
                                            <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#FF0000'} />
                                        </div>
                                        {fileName}
                                    </div>
                                }
                                {uploadLoader &&
                                    <Spinner borderwidth={2.5} width={1.5} height={1.5} margin={0.5} />
                                }
                            </div>
                            <div className='flex items-center mb-2'>
                                <Switch defaultChecked onChange={onChange} ></Switch>
                                <p className={styles.recordedcourse}>إظهار المجال</p>
                            </div>
                        </div>

                        <div className={styles.AppointmentFieldBorderBottom}>
                            <div className={styles.createAppointmentBtnBox}>
                                <button key='modalFooterBtn' className={styles.AddFolderBtn} type={'submit'}>حفظ</button>
                            </div>
                            {isEdit &&
                                <div className={styles.deleteVideoBtn}>
                                    <button className='deleteBtn' type={'submit'} onClick={handleDelete}>حذف المدرب</button>
                                </div>
                            }
                        </div>
                    </Form>
                </div>
            </Modal >
        </div >
    )
}

export default ModelForAddCategory