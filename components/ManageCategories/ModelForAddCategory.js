

import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './ModelForAddCategory.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import { FormItem } from '../antDesignCompo/FormItem';
import Input from '../antDesignCompo/Input';
import InputTextArea from '../antDesignCompo/InputTextArea';
import Switch from '../antDesignCompo/Switch';
import { editCatagoryAPI, postRouteAPI } from '../../services/apisService';
import { toast } from 'react-toastify';
import { createAndEditBtnText } from '../../constants/ar';
import { getNewToken } from '../../services/fireBaseAuthService';
import UploadFileForModel from '../CommonComponents/UploadFileForModel/UploadFileForModel';
import CustomButton from '../../components/CommonComponents/CustomButton'
import { adminPanelCategoryConst } from '../../constants/adminPanelConst/categoryConst/categoryConst';

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
    const [uploadfileError, setUploadFileError] = useState(false)
    const [fileName, setFileName] = useState()

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
    const apiSuccessRes = (msg) => {
        toast.success(msg)
        categoryForm.resetFields()
        setIsModelForAddCategory(false)
        getCategoryListReq()
    }

    const addCategory = async (values) => {
        if (!fileUploadResponceData) {
            setUploadFileError(true)
        } else {
            setShowBtnLoader(true)
            values.order = Number(values.order)
            values.routeName = "createCategory"
            if (fileUploadResponceData) {
                values.pictureKey = fileUploadResponceData.key
                values.pictureBucket = fileUploadResponceData.bucket
                values.pictureMime = fileUploadResponceData.mime
            }
            setUploadFileError(false)
            await postRouteAPI(values).then((res) => {
                setShowBtnLoader(false)
                apiSuccessRes(adminPanelCategoryConst.addCategoryMsg)
            }).catch(async (error) => {
                console.log(error);
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await postRouteAPI(values).then(res => {
                            apiSuccessRes(adminPanelCategoryConst.addCategoryMsg)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
                else {
                    toast.error(error.response.data.errors[0].message == "order must be unique" && adminPanelCategoryConst.sameOrderIdErrorMsg)
                }
                setShowBtnLoader(false)
            })
        }
    }

    const editCategoryDetail = async (values) => {
        if (!fileUploadResponceData && !editCategory.pictureKey) {
            setUploadFileError(true)
        } else {
            setShowBtnLoader(true)
            values.id = editCategory.id
            values.published = isCatagoryPublished

            if (values.order == editCategory.order) delete values.order
            if (values.name == editCategory.name) delete values.name
            if (values.description == editCategory.description) delete values.description

            if (fileUploadResponceData) {
                values.pictureKey = fileUploadResponceData.key
                values.pictureBucket = fileUploadResponceData.bucket
                values.pictureMime = fileUploadResponceData.mime
            }
            setUploadFileError(false)
            values.routeName = "updateCategory"
            await postRouteAPI(values).then((res) => {
                setShowBtnLoader(false)
                setFileUploadResponceData()
                // getCategoryListReq()
                apiSuccessRes(adminPanelCategoryConst.updateCategoryMsg)
            }).catch(async (error) => {
                console.log(error);
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await editCatagoryAPI(values).then(res => {
                            apiSuccessRes(adminPanelCategoryConst.updateCategoryMsg)
                            setFileUploadResponceData()
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
                else if (error?.response?.data?.errors?.length > 0) {
                    toast.error(error?.response?.data?.errors[0]?.message)
                }
                setShowBtnLoader(false)
            })
        }
    }

    const onChange = async (checked) => {
        // if (checked == true) {
        //     toast.success(adminPanelCategoryConst.showCategoryMsg)
        // } else {
        //     toast.success(adminPanelCategoryConst.hideCategoryMsg)
        // }
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
                                setFileName={setFileName}
                                uploadResData={setFileUploadResponceData}
                                fileType={'.jpg , .png'}
                                accept={"image"}
                                placeHolderName={adminPanelCategoryConst.categoryPhotoInput}
                                setShowBtnLoader={setShowBtnLoader}
                                uploadfileError={uploadfileError}
                            />
                            {isEdit &&
                                <div className='flex items-center my-2'>
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
                            />
                        </div>
                    </Form>
                </div>
            </Modal >
        </div >
    )
}

export default ModelForAddCategory


