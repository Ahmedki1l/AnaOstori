import React, { useEffect, useState } from 'react'
import styles from './UploadFileForCourseReviews.module.scss'
import { studentFeedBackConst } from '../../../constants/adminPanelConst/manageStudentFeedBackConst/manageStudentFeedBackConst'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import CoverImg from '../CoverImg';
import { uploadFileSevices } from '../../../services/UploadFileSevices';
import Spinner from '../spinner';
import { mediaUrl } from '../../../constants/DataManupulation';

const UploadFileForCourseReviews = ({
    type,
    uploadFileData,
    setUploadFileData,
    pictureBucket,
    pictureKey,
    index,
}) => {
    console.log(uploadFileData);
    useEffect(() => {
        if (uploadFileData[index]?.contentFileKey) {
            setPictureUrl(mediaUrl(uploadFileData[index]?.contentFileMime, uploadFileData[index]?.contentFileKey))
        }
    }, [])
    const [isFileExist, setIsFileExist] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadLoader, setUploadLoader] = useState(false)
    const [pictureUrl, setPictureUrl] = useState(pictureKey ? mediaUrl(pictureBucket, pictureKey) : null)
    const [hideImageWrapper, setHideImageWrapper] = useState(true)

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
            uploadFileData[index].contentFileMime = uploadFileBucket
            uploadFileData[index].contentFileBucket = uploadFileType
            setUploadFileData(uploadFileData)
            // setUploadFileData([{
            //     key: uploadFileKey,
            //     bucket: uploadFileBucket,
            //     mime: uploadFileType,
            // }, ...uploadFileData])
            setPictureUrl(mediaUrl(uploadFileBucket, uploadFileKey))
        }).catch((err) => {
            console.log(err)
        })
        setIsFileExist(true)
    }
    const handleCloseImagePreview = () => {
        setIsFileExist(false)
        setUploadLoader(false)
        setHideImageWrapper(false)
        // setUploadFileData(uploadFileData.filter((item, i) => i != index))
    }
    return (
        <>
            {hideImageWrapper &&
                <div className='flex'>
                    <div className='mt-2'>
                        <AllIconsComponenet iconName={'dragIcon'} height={24} width={24} color={'#0000008a'} />
                    </div>
                    <div className={`m-2 ${styles.addItems}`}>
                        <>
                            {isFileExist ?
                                <>
                                    <div className={styles.imageUploadWrapper}>
                                        <div className={styles.closeIconWrapper} onClick={() => handleCloseImagePreview()}>
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
            }
        </>
    )
}

export default UploadFileForCourseReviews

