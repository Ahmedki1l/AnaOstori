import React, { useEffect, useState } from 'react'
import styles from './UploadFileForModel.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { stringUpdation } from '../../../constants/DataManupulation'
import { uploadFileSevices } from '../../../services/UploadFileSevices'
import Spinner from '../spinner'
import { adminPanelCategoryConst } from '../../../constants/adminPanelConst/categoryConst/categoryConst'
import { PDFDocument } from 'pdf-lib';
import { pdfFileConst, videoFileConst } from '../../../constants/adminPanelConst/manageLibraryConst/manageLibraryConst'
import axios from "axios";

const UploadFileForModel = ({
    fileName,
    setFileName,
    fileType,
    accept,
    uploadResData,
    placeHolderName,
    setShowBtnLoader,
    uploadfileError,
    setVideoDuration,
    disabledInput,
    cancleUpload
}) => {
    const [uploadLoader, setUploadLoader] = useState(false)
    const [uploadedFileName, setUploadedFileName] = useState(fileName)
    const [uploadProgress, setUploadProgress] = useState(0)
    const source = axios.CancelToken.source();

    useEffect(() => {
        console.log(cancleUpload);
        if (cancleUpload) {
            source.cancel('Upload cancelled by user');
        }
    }, [cancleUpload])

    const getFileKey = async (e) => {
        setUploadedFileName()
        let file = e.target.files[0];
        if (accept == 'video') {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                setVideoDuration(video.duration);
            };
            video.src = URL.createObjectURL(file);
        }
        if (accept == 'file') {
            const pdfBytes = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });

            const pageCount = await getPageCount(pdfBytes);
        }
        setUploadLoader(true)
        setShowBtnLoader(true)

        const onUploadProgress = (percentCompleted) => {
            setUploadProgress(percentCompleted)
        }

        await uploadFileSevices(file, onUploadProgress, source.token).then((res) => {
            const uploadFileBucket = res.split('.')[0].split('//')[1]
            const uploadFileKey = res.split('?')[0].split('/')[3]
            const uploadFileType = file.type
            uploadResData({
                key: uploadFileKey,
                bucket: uploadFileBucket,
                mime: uploadFileType,
            })
            setUploadProgress(0)
            setUploadedFileName(file.name)
            setFileName(file.name)
            setUploadLoader(false)
            setShowBtnLoader(false)
        }).catch((error) => {
            console.log(error);
            setUploadLoader(false)
            setShowBtnLoader(false)
        })
    }

    const cancelUpload = () => {
        source.cancel('Upload cancelled by user');
    }

    const handleRemoveFile = () => {
        setUploadedFileName()
        uploadResData()
    }

    async function getPageCount(pdfFile) {
        const doc = await PDFDocument.load(pdfFile);
        return doc.getPageCount();
    }
    return (
        <>
            <div className={disabledInput ? styles.disabledUploadVideoWrapper : styles.uploadVideoWrapper}>
                <input id={` uploadFileInput_${accept}`} type={'file'} accept={fileType} className={styles.uploadFileInput} disabled={disabledInput || uploadLoader} onChange={getFileKey} />
                <label htmlFor={` uploadFileInput_${accept}`} className='cursor-pointer'>
                    <div className={styles.IconWrapper} >
                        <div className={styles.uploadFileWrapper}>
                            <AllIconsComponenet iconName={'uploadFile'} height={20} width={20} color={'#6D6D6D'} />
                        </div>
                        <p>{placeHolderName}</p>
                    </div>
                </label>
                {uploadedFileName &&
                    <div className={styles.uploadFileNameWrapper}>
                        <div className={styles.closeIconWrapper} onClick={() => handleRemoveFile()}>
                            <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#FF0000'} />
                        </div>
                        {stringUpdation(uploadedFileName, 20)}
                    </div>
                }
                {uploadLoader &&
                    <div className='flex items-center'>
                        <p className='px-2'>% {uploadProgress}</p>
                        <Spinner borderwidth={2.5} width={1.5} height={1.5} margin={0.5} />
                    </div>
                }
            </div>
            {(uploadfileError && !uploadedFileName) &&
                <div>
                    <p style={{ color: 'red' }}>{accept == 'video' ? videoFileConst.addVideoModelConst.videoFileInputError
                        : accept == 'file' ? pdfFileConst.addPdfModelConst.pdfFileInputError
                            : adminPanelCategoryConst.categoryPhotoErrorMsg}</p>
                </div>
            }
        </>
    )
}

export default UploadFileForModel