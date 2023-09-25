

import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './ModelForAddCategory.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import { FormItem } from '../antDesignCompo/FormItem';
import Input from '../antDesignCompo/Input';
import InputTextArea from '../antDesignCompo/InputTextArea';
import Switch from '../antDesignCompo/Switch';
import { createCatagoryAPI, editCatagoryAPI } from '../../services/apisService';
import { toast } from 'react-toastify';
import { adminPanelCategoryConst, createAndEditBtnText, inputErrorMessages, toastSuccessMessage } from '../../constants/ar';
import { getNewToken } from '../../services/fireBaseAuthService';
import UploadFileForModel from '../CommonComponents/UploadFileForModel/UploadFileForModel';
import CustomButton from '../../components/CommonComponents/CustomButton'

const ModelForAddCategory = ({
    isModelForAddCategory,
    setIsModelForAddCategory,
    isEdit,
    editCategory,
    setEditCategory,
    getCategoryListReq,
}) => {

    const [categoryForm] = Form.useForm();
    const [fileUploadResponceData, setFileUploadResponceData] = useState()
    const [showBtnLoader, setShowBtnLoader] = useState(false)
    const [isCatagoryPublished, setIsCatagoryPublished] = useState(isEdit ? editCategory.published : false)

    useEffect(() => {
        categoryForm.setFieldsValue(editCategory)
    }, [])

    const onFinish = (values) => {
        if (isEdit) {
            editCategoryDetail(values)
        } else {
            addCategory(values)
        }
    };
    console.log(fileUploadResponceData);
    const apiSuccessRes = (msg) => {
        toast.success(msg)
        categoryForm.resetFields()
        setIsModelForAddCategory(false)
        getCategoryListReq()
    }

    const addCategory = async (values) => {
        setShowBtnLoader(true)
        values.order = Number(values.order)
        if (fileUploadResponceData) {
            values.pictureKey = fileUploadResponceData.key
            values.pictureBucket = fileUploadResponceData.bucket
            values.pictureMime = fileUploadResponceData.mime
        }
        await createCatagoryAPI(values).then((res) => {
            setShowBtnLoader(false)
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
        setShowBtnLoader(true)
        values.id = editCategory.id
        values.published = isCatagoryPublished
        if (fileUploadResponceData) {
            values.pictureKey = fileUploadResponceData.key
            values.pictureBucket = fileUploadResponceData.bucket
            values.pictureMime = fileUploadResponceData.mime
        }
        await editCatagoryAPI(values).then((res) => {
            setShowBtnLoader(false)
            getCategoryListReq()
            setFileUploadResponceData()
            apiSuccessRes(toastSuccessMessage.updateCategoryMsg)
        }).catch(async (error) => {
            console.log(error);
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await editCatagoryAPI(values).then(res => {
                        apiSuccessRes(toastSuccessMessage.updateCategoryMsg)
                        setFileUploadResponceData()
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
            else {
                toast.error(error.response.data.errors[0].message)
            }
            setShowBtnLoader(false)
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
                            <UploadFileForModel
                                fileName={editCategory?.pictureKey}
                                uploadResData={setFileUploadResponceData}
                                fileType={'.jpg , .png'}
                                accept={"file"}
                                placeHolderName={'ارفق الملف'}
                                setShowBtnLoader={setShowBtnLoader}
                            />
                            {isEdit &&
                                <div className='flex items-center mb-2'>
                                    <Switch defaultChecked={isCatagoryPublished} onChange={onChange} ></Switch>
                                    <p className={styles.recordedcourse}>{adminPanelCategoryConst.categorySwitch}</p>
                                </div>
                            }
                        </div>

                        <div className={styles.AppointmentFieldBorderBottom}>
                            <CustomButton
                                btnText={isEdit ? createAndEditBtnText.saveBtnText : createAndEditBtnText.addBtnText}
                                width={80}
                                height={37}
                                showLoader={showBtnLoader}
                                fontSize={16}
                                fileUploadResponceData={fileUploadResponceData}
                            />
                        </div>
                    </Form>
                </div>
            </Modal >
        </div >
    )
}

export default ModelForAddCategory


