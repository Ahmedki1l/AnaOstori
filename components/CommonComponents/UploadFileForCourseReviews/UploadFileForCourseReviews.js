import React, { use, useEffect, useState } from 'react'
import styles from './UploadFileForCourseReviews.module.scss'
import { studentFeedBackConst } from '../../../constants/adminPanelConst/manageStudentFeedBackConst/manageStudentFeedBackConst'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import CoverImg from '../CoverImg';
import { uploadFileSevices } from '../../../services/UploadFileSevices';
import Spinner from '../spinner';
import { mediaUrl } from '../../../constants/DataManupulation';
import { postAuthRouteAPI } from '../../../services/apisService';

const UploadFileForCourseReviews = ({
    type,
    uploadFileData,
    setUploadFileData,
    index,
}) => {
    const [isFileExist, setIsFileExist] = useState(uploadFileData[index].contentFileKey ? true : false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadLoader, setUploadLoader] = useState(false)
    const [pictureUrl, setPictureUrl] = useState(uploadFileData[index].contentFileKey ? mediaUrl(uploadFileData[index].contentFileBucket, uploadFileData[index].contentFileKey) : null)

    const getFileKey = async (e) => {
        setUploadLoader(true)
        const onUploadProgress = (percentCompleted) => {
            setUploadProgress(percentCompleted)
        }
        let file = e.target.files[0];
        await uploadFileSevices(file, onUploadProgress).then((res) => {
            const uploadFileKey = res.split('?')[0].split('/')[3]
            const uploadFileBucket = res.split('.')[0].split('//')[1]
            const uploadFileType = e.target.files[0].type
            uploadFileData[index].contentFileKey = uploadFileKey
            uploadFileData[index].contentFileMime = uploadFileType
            uploadFileData[index].contentFileBucket = uploadFileBucket
            setUploadProgress(0)
            setUploadFileData(uploadFileData)
            setPictureUrl(mediaUrl(uploadFileBucket, uploadFileKey))
        }).catch((err) => {
            console.log(err)
        })
        setIsFileExist(true)
    }

    return (
        <>
            <div className='flex'>
                <div className='mt-2'>
                    <AllIconsComponenet iconName={'dragIcon'} height={24} width={24} color={'#0000008a'} />
                </div>
                <div className={`m-2 ${styles.addItems}`}>
                    <>
                        {isFileExist ?
                            <>
                                <div className={styles.imageUploadWrapper}>
                                    <div className={styles.closeIconWrapper} onClick={() => setUploadFileData(uploadFileData.filter((item, i) => i !== index))}>
                                        <AllIconsComponenet height={10} width={10} iconName={'closeicon'} color={'#ffffff'} />
                                    </div>

                                    <CoverImg height={177} url={pictureUrl} />
                                </div>
                            </>
                            :
                            <div>
                                <input type='file' id='upload' className={styles.uploadFileInput} accept={type} onChange={getFileKey} />
                                <label htmlFor='upload' className={styles.uploadFileLabel} >
                                    {uploadLoader ?
                                        <>
                                            <Spinner borderwidth={4} width={3} height={3} margin={0.5} />
                                            <p>{uploadProgress}%</p>
                                        </>
                                        : <div className='flex'>
                                            <AllIconsComponenet iconName={'uploadDataIcon'} height={18} width={18} color={'#F26722'} />
                                            <p className='text-base mr-2'>{studentFeedBackConst.uploadPhotoTitle}</p>
                                        </div>
                                    }
                                </label>
                            </div>
                        }
                    </>
                </div>
            </div>
        </>
    )
}

export default UploadFileForCourseReviews

