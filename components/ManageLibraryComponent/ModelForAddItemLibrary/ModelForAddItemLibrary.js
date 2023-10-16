import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import styles from './ModelForAddItemLibrary.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { FormItem } from '../../antDesignCompo/FormItem';
import Input from '../../antDesignCompo/Input';
import InputTextArea from '../../antDesignCompo/InputTextArea';
import { postRouteAPI } from '../../../services/apisService';
import { getNewToken } from '../../../services/fireBaseAuthService';
import UploadFileForModel from '../../CommonComponents/UploadFileForModel/UploadFileForModel';
import CustomButton from '../../CommonComponents/CustomButton'
import { toast } from 'react-toastify';
import { commonLibraryConst, pdfFileConst, quizConst, videoFileConst } from '../../../constants/adminPanelConst/manageLibraryConst/manageLibraryConst';

const ModelForAddItemLibrary = ({
    isModelForAddItemOpen,
    selectedFolder,
    folderType,
    selectedFolderId,
    selectedItem,
    onCloseModal,
    onDelete,
    getItemList,
    existingItemName,
    cancleUpload
}) => {
    const [ItemDetailsForm] = Form.useForm();
    const isEdit = selectedItem?.id ? true : false
    const [fileName, setFileName] = useState()
    const [fileUploadResponceData, setFileUploadResponceData] = useState()
    const [showBtnLoader, setShowBtnLoader] = useState(false)
    const [uploadfileError, setUploadFileError] = useState(false)
    const [videoDuration, setVideoDuration] = useState()
    const { videoToastMsgConst, addVideoModelConst } = videoFileConst
    const { pdfToastMsgConst, addPdfModelConst } = pdfFileConst
    const { examToastMsgConst, addExamModelConst } = quizConst

    useEffect(() => {
        if (!isEdit) return
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
        if (existingItemName.includes(e.name)) {
            toast.error(commonLibraryConst.nameDuplicateErrorMsg)
            return
        }
        if (!fileUploadResponceData && folderType !== "quiz") {
            setUploadFileError(true)
            return
        }
        let body = {}
        if (folderType !== "quiz") {
            body.name = e.name
            body.description = e.description
            body.type = folderType
            body.linkKey = fileUploadResponceData?.key
            body.linkBucket = fileUploadResponceData?.bucket
            body.linkMime = fileUploadResponceData?.mime
            body.previewAvailable = true
            folderType == "video" ? body.duration = Number(Math.floor(videoDuration)) : null
        }
        else {
            body.name = e.name
            body.description = e.description
            body.type = folderType
            body.previewAvailable = true
            body.numberOfQuestions = e.numberOfQuestions
            body.quizLink = e.quizLink
        }
        const data = {
            routeName: 'createItem',
            folderId: selectedFolderId ? selectedFolderId : selectedFolder?.id,
            ...body
        }
        await postRouteAPI(data).then((res) => {
            toast.success(folderType == "video" ? videoToastMsgConst.addVideoSuccessMsg :
                folderType == "quiz" ? examToastMsgConst.addExamSuccessMsg :
                    pdfToastMsgConst.addPdfSuccessMsg)
            getItemList(selectedFolderId ? selectedFolderId : selectedFolder?.id)
            onCloseModal()
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postRouteAPI(data).then(res => {
                        toast.success(folderType == "video" ? videoToastMsgConst.addVideoSuccessMsg :
                            folderType == "quiz" ? examToastMsgConst.addExamSuccessMsg :
                                pdfToastMsgConst.addPdfSuccessMsg)
                        getItemList(selectedFolderId ? selectedFolderId : selectedFolder?.id)
                        onCloseModal()
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
        ItemDetailsForm.resetFields()
    }

    const editFolderItems = async (e) => {
        if (existingItemName.includes(e.name)) {
            toast.error(commonLibraryConst.nameDuplicateErrorMsg)
            return
        }
        if (!fileUploadResponceData) {
            setUploadFileError(true)
        }
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
            routeName: 'updateItemHandler',
            ...body
        }
        await postRouteAPI(data).then((res) => {
            toast.success(folderType == "video" ? videoToastMsgConst.updateVideoSuccessMsg :
                folderType == "quiz" ? examToastMsgConst.updateExamSuccessMsg :
                    pdfToastMsgConst.updatePdfSuccessMsg)
            getItemList(selectedFolderId ? selectedFolderId : selectedFolder?.id)
            onCloseModal()
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postRouteAPI(data).then(res => {
                        toast.success(folderType == "video" ? videoToastMsgConst.updateVideoSuccessMsg :
                            folderType == "quiz" ? examToastMsgConst.updateExamSuccessMsg :
                                pdfToastMsgConst.updatePdfSuccessMsg)
                        getItemList(selectedFolderId ? selectedFolderId : selectedFolder?.id)
                        onCloseModal()
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
        onCloseModal()
    }

    const handleDeleteItems = () => {
        onDelete()
        onCloseModal()
    };

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
                    {!isEdit &&
                        <p className={`fontBold ${styles.createappointment}`}>
                            {folderType == 'video' ? addVideoModelConst.addVideoModelTitle
                                : folderType == 'quiz' ? addExamModelConst.addExamModelTitle
                                    : addPdfModelConst.addPdfModelTitle}
                        </p>}
                    {isEdit &&
                        <p className={`fontBold ${styles.createappointment}`}>
                            {folderType == 'video' ? addVideoModelConst.editVideoModelTitle
                                : folderType == 'quiz' ? addExamModelConst.editExamModelTitle
                                    : addPdfModelConst.editPdfModelTitle}
                        </p>}
                </div>
                <div dir='rtl'>
                    <Form form={ItemDetailsForm} onFinish={onFinish}>
                        <div className={styles.createAppointmentFields}>
                            <FormItem
                                name={'name'}
                                rules={[{ required: true, message: commonLibraryConst.nameErrorMsg }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={folderType == 'video' ? addVideoModelConst.videoTitleInputPlaceholder
                                        : folderType == "quiz" ? addExamModelConst.examTitleInputPlaceholder
                                            : addPdfModelConst.pdfTitleInputPlaceholder}
                                />
                            </FormItem>

                            <FormItem
                                name={'description'}
                                rules={[{ required: true, message: commonLibraryConst.discriptionErrorMsg }]}
                            >
                                <InputTextArea
                                    fontSize={16}
                                    height={76}
                                    width={352}
                                    placeholder={folderType == 'video' ? addVideoModelConst.videoDiscriptionInputPlaceholder
                                        : folderType == "quiz" ? addExamModelConst.examDiscriptionInputPlaceholder
                                            : addPdfModelConst.pdfDiscriptionInputPlaceholder}
                                />
                            </FormItem>
                            {folderType !== "quiz" &&
                                <>
                                    <p className={styles.uploadFileText}>{folderType == 'video' ? addVideoModelConst.videoFileInputPlaceholder : addPdfModelConst.pdfFileInputPlaceholder}</p>
                                    <UploadFileForModel
                                        fileName={selectedItem?.linkKey}
                                        setFileName={setFileName}
                                        uploadResData={setFileUploadResponceData}
                                        fileType={folderType == 'video' ? '.mp4, .mov, .avi, .wmv, .fly, .webm, .mkv' : '.pdf , .doc , .docx'}
                                        accept={folderType == 'video' ? "video" : "file"}
                                        placeHolderName={folderType == 'video' ? addVideoModelConst.videoAttachedBtnText : addPdfModelConst.pdfAttachedBtnText}
                                        setShowBtnLoader={setShowBtnLoader}
                                        setVideoDuration={setVideoDuration}
                                        uploadfileError={uploadfileError}
                                        cancleUpload={cancleUpload}
                                    />
                                </>
                            }
                            {folderType == "quiz" &&
                                <>
                                    <FormItem
                                        name={'numberOfQuestions'}
                                        rules={[{ required: true, message: addExamModelConst.examNoOfQueInputError }]}
                                    >
                                        <Input
                                            fontSize={16}
                                            width={352}
                                            height={40}
                                            placeholder={addExamModelConst.examNoOfQueInputPlaceholder}
                                        />
                                    </FormItem>
                                    <p className={styles.uploadFileText}>{addExamModelConst.examLinkTitle}</p>
                                    <FormItem
                                        name={'quizLink'}
                                        rules={[{ required: true, message: 'exam link is required' }]}
                                    >
                                        <Input
                                            fontSize={16}
                                            width={352}
                                            height={40}
                                            placeholder={addExamModelConst.examLinkInputPlaceholder}
                                        />
                                    </FormItem>
                                </>
                            }
                        </div>
                        <div className={styles.AppointmentFieldBorderBottom}>
                            <div className='pt-2'>
                                <CustomButton
                                    btnText={isEdit ? commonLibraryConst.updateBtnText : commonLibraryConst.addBtnText}
                                    width={80}
                                    height={37}
                                    showLoader={showBtnLoader}
                                    fontSize={16}
                                    fileUploadResponceData={fileUploadResponceData}
                                />
                            </div>
                            {/* {isEdit &&
                                <div className={styles.deleteVideoBtn}>
                                    <button className='deleteBtn' type={'submit'} onClick={() => handleDeleteItems()} disabled={showBtnLoader}>حذف الفيديو</button>
                                </div>
                            } */}
                        </div>
                    </Form>
                </div>
            </Modal>
        </>
    );
}

export default ModelForAddItemLibrary;