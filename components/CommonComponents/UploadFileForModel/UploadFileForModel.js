import React, { useState } from 'react'
import styles from './UploadFileForModel.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { stringUpdation } from '../../../constants/DataManupulation'
import { uploadFileSevices } from '../../../services/UploadFileSevices'
import Spinner from '../spinner'

const UploadFileForModel = ({ fileName, setFileName, fileType, accept, uploadResData, placeHolderName }) => {
    const [uploadLoader, setUploadLoader] = useState(false)
    const [uploadedFileName, setUploadedFileName] = useState(fileName)

    const getFileKey = async (e) => {
        setUploadLoader(true)
        await uploadFileSevices(e.target.files[0]).then((res) => {
            const uploadFileBucket = res.split('.')[0].split('//')[1]
            const uploadFileKey = res.split('?')[0].split('/')[3]
            const uploadFileType = e.target.files[0].type
            uploadResData({
                key: uploadFileKey,
                bucket: uploadFileBucket,
                mime: uploadFileType,
            })
            setUploadedFileName(e.target.files[0].name)
            setFileName(e.target.files[0].name)
            setUploadLoader(false)
        }).catch((error) => {
            console.log(error);
            setUploadLoader(false)
        })
    }
    const handleRemoveFile = () => {
        setUploadedFileName()
        uploadResData()
    }

    return (
        <div className={styles.uploadVideoWrapper}>
            <input id={` uploadFileInput_${accept}`} type={'file'} accept={fileType} className={styles.uploadFileInput} disabled={uploadLoader} onChange={getFileKey} />
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
    )
}

export default UploadFileForModel