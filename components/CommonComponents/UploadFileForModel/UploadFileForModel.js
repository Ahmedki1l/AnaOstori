import React, { useState } from 'react'
import styles from './UploadFileForModel.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { stringUpdation } from '../../../constants/DataManupulation'
import { uploadFileSevices } from '../../../services/UploadFileSevices'
import Spinner from '../spinner'
import { adminPanelCategoryConst } from '../../../constants/adminPanelConst/categoryConst/categoryConst'
import { PDFDocument } from 'pdf-lib';

const UploadFileForModel = ({ fileName, setFileName, fileType, accept, uploadResData, placeHolderName, setShowBtnLoader, uploadfileError, setVideoDuration, disabledInput }) => {
    const [uploadLoader, setUploadLoader] = useState(false)
    const [uploadedFileName, setUploadedFileName] = useState(fileName)

    console.log(accept);

    const getFileKey = async (e) => {
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

            // Count the number of pages in the PDF file.
            const pageCount = await getPageCount(pdfBytes);
            console.log(pageCount);
            // Do something with the page count, such as display it to the user or store it in a database.
        }
        setUploadLoader(true)
        setShowBtnLoader(true)
        await uploadFileSevices(file).then((res) => {
            const uploadFileBucket = res.split('.')[0].split('//')[1]
            const uploadFileKey = res.split('?')[0].split('/')[3]
            const uploadFileType = file.type
            uploadResData({
                key: uploadFileKey,
                bucket: uploadFileBucket,
                mime: uploadFileType,
            })
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
                    <Spinner borderwidth={2.5} width={1.5} height={1.5} margin={0.5} />
                }
            </div>
            {(uploadfileError && !uploadedFileName) &&
                <div>
                    <p style={{ color: 'red' }}>{adminPanelCategoryConst.categoryPhotoErrorMsg}</p>
                </div>
            }
        </>
    )
}

export default UploadFileForModel