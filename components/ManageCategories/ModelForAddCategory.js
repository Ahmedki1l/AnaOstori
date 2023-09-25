

import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './ModelForAddCategory.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import { FormItem } from '../antDesignCompo/FormItem';
import Input from '../antDesignCompo/Input';
import InputTextArea from '../antDesignCompo/InputTextArea';
import Switch from '../antDesignCompo/Switch';
import { createCatagoryAPI, editCatagoryAPI, getCatagoriesAPI } from '../../services/apisService';
import Spinner from '../CommonComponents/spinner';
import { useDispatch } from 'react-redux';
import { stringUpdation } from '../../constants/DataManupulation';
import { uploadFileSevices } from '../../services/UploadFileSevices';
import { toast } from 'react-toastify';
import { adminPanelCategoryConst, createAndEditBtnText, inputErrorMessages, toastSuccessMessage } from '../../constants/ar';
import { getNewToken } from '../../services/fireBaseAuthService';

const ModelForAddCategory = ({
    isModelForAddCategory,
    setIsModelForAddCategory,
    isEdit,
    editCategory,
    setEditCategory,
}) => {

    const [categoryForm] = Form.useForm();
    useEffect(() => {
        categoryForm.setFieldsValue(editCategory)
        setFileName(editCategory?.pictureKey)
    }, [])
    const [fileName, setFileName] = useState()
    const [fileUploadResponceData, setFileUploadResponceData] = useState()
    const [uploadLoader, setUploadLoader] = useState(false)
    const [isCatagoryPublished, setIsCatagoryPublished] = useState(isEdit ? editCategory.published : false)
    const dispatch = useDispatch()


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

    const getCategoryListReq = async () => {
        await getCatagoriesAPI().then((res) => {
            dispatch({
                type: 'SET_CATAGORIES',
                catagories: res.data
            });
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getCatagoriesAPI().then(res => {
                        dispatch({
                            type: 'SET_CATAGORIES',
                            catagories: res.data
                        });
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }

    const onFinish = (values) => {
        if (isEdit) {
            editCategoryDetail(values)
        } else {
            addCategory(values)
        }
    };

    const apiSuccessRes = (msg) => {
        toast.success(msg)
        categoryForm.resetFields()
        setIsModelForAddCategory(false)
        getCategoryListReq()
    }

    const addCategory = async (values) => {
        values.order = Number(values.order)
        if (fileUploadResponceData) {
            values.pictureKey = fileUploadResponceData.key
            values.pictureBucket = fileUploadResponceData.bucket
            values.pictureMime = fileUploadResponceData.mime
        }
        await createCatagoryAPI(values).then((res) => {
            apiSuccessRes(toastSuccessMessage.addCategoryMsg)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await createCatagoryAPI(values).then(res => {
                        apiSuccessRes(toastSuccessMessage.addCategoryMsg)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
            else {
                toast.error(error.response.data.errors[0].message)
            }
        })
    }

    const editCategoryDetail = async (values) => {
        values.id = editCategory.id
        values.published = isCatagoryPublished
        if (fileUploadResponceData) {
            values.pictureKey = fileUploadResponceData.key
            values.pictureBucket = fileUploadResponceData.bucket
            values.pictureMime = fileUploadResponceData.mime
        }
        await editCatagoryAPI(values).then((res) => {
            apiSuccessRes(toastSuccessMessage.updateCategoryMsg)
            setFileName()
            setFileUploadResponceData()
        }).catch(async (error) => {
            console.log(error);
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await editCatagoryAPI(values).then(res => {
                        apiSuccessRes(toastSuccessMessage.updateCategoryMsg)
                        setFileName()
                        setFileUploadResponceData()
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
            else {
                toast.error(error.response.data.errors[0].message)
            }
        })
    }

    const onChange = async (checked) => {
        if (checked == true) {
            toast.success(toastSuccessMessage.showCategoryMsg)
        } else {
            toast.success(toastSuccessMessage.hideCategoryMsg)
        }
        setIsCatagoryPublished(checked)
    };

    const isModelClose = () => {
        categoryForm.resetFields()
        setEditCategory()
        setIsModelForAddCategory(false)
    }

    const handleRemoveFile = () => {
        setFileName()
        setFileUploadResponceData()
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
                    <p className={`fontBold ${styles.addCategory}`}>{isEdit ? adminPanelCategoryConst.editCategoryTitle : adminPanelCategoryConst.addCategoryTitle}</p>
                </div>
                <div dir='rtl'>
                    <Form form={categoryForm} onFinish={onFinish}>
                        <div className={styles.createAppointmentFields}>
                            <FormItem
                                name={'name'}
                                rules={[{ required: true, message: adminPanelCategoryConst.categoryNameErrorMsg }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={adminPanelCategoryConst.title}
                                />
                            </FormItem>
                            <FormItem
                                name={'order'}
                                rules={[{ required: true, message: adminPanelCategoryConst.selectOrderErrorMsg }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={adminPanelCategoryConst.orderID}
                                />
                            </FormItem>
                            <FormItem
                                name={'description'}
                                rules={[{ required: true, message: adminPanelCategoryConst.categoryDiscriptionErrorMsg }]}
                            >
                                <InputTextArea
                                    fontSize={16}
                                    height={132}
                                    width={352}
                                    placeholder={adminPanelCategoryConst.description}
                                />
                            </FormItem>
                            <p className={`mb-3 fontBold ${styles.addInstructor}`}>{adminPanelCategoryConst.categoryPhoto}</p>
                            <div className={styles.uploadVideoWrapper}>
                                <input type={'file'} id='uploadFileInput' className={styles.uploadFileInput} disabled={uploadLoader} onChange={getFileKey} />
                                <label htmlFor='uploadFileInput' className='cursor-pointer'>
                                    <div className={styles.IconWrapper}>
                                        <div className={styles.uploadFileWrapper}>
                                            <AllIconsComponenet iconName={'uploadFile'} height={20} width={20} color={'#6D6D6D'} />
                                        </div>
                                        <p>ارفق الصورة</p>
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
                            {isEdit &&
                                <div className='flex items-center mb-2'>
                                    <Switch defaultChecked={isCatagoryPublished} onChange={onChange} ></Switch>
                                    <p className={styles.recordedcourse}>{adminPanelCategoryConst.categorySwitch}</p>
                                </div>
                            }
                        </div>

                        <div className={styles.AppointmentFieldBorderBottom}>
                            <div className={styles.createAppointmentBtnBox}>
                                <button key='modalFooterBtn' className={styles.AddFolderBtn} type={'submit'}>{isEdit ? createAndEditBtnText.saveBtnText : createAndEditBtnText.addBtnText}</button>
                            </div>
                        </div>
                    </Form>
                </div>
            </Modal >
        </div >
    )
}

export default ModelForAddCategory


