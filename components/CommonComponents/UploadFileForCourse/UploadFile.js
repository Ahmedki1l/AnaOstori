import React, { useState } from 'react'
import styles from './UploadFile.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { uploadFileSevices } from '../../../services/UploadFileSevices'
import Spinner from '../spinner'
import CoverImg from '../CoverImg'
import VideoThumnail from '../../CourseDescriptionPageComponents/DetailsHeader/Common/VideoThumnail'
import { mediaUrl } from '../../../constants/DataManupulation'

const UploadFile = ({ label, accept, setUploadFileData, coursePictureUrl, courseVideoUrl, type }) => {

    const [showLoader, setShowLoader] = useState(false);
    const [isFileExist, setIsFileExist] = useState(accept == 'image' ? (coursePictureUrl ? true : false) : (courseVideoUrl ? true : false))
    const [pictureUrl, setPictureUrl] = useState(coursePictureUrl)
    const [videoUrl, setVideoUrl] = useState(courseVideoUrl)

    const handleUploadFile = async (e) => {
        setShowLoader(true)
        await uploadFileSevices(e.target.files[0]).then((res) => {
            const uploadFileBucket = res.split('.')[0].split('//')[1]
            const uploadFileKey = res.split('?')[0].split('/')[3]
            const uploadFileType = e.target.files[0].type
            console.log(uploadFileBucket, uploadFileKey, uploadFileType);
            setUploadFileData({
                key: uploadFileKey,
                bucket: uploadFileBucket,
                mime: uploadFileType,
            })
            if (accept == 'image') {
                setPictureUrl(mediaUrl(uploadFileBucket, uploadFileKey))
            } else {
                setVideoUrl(mediaUrl(uploadFileBucket, uploadFileKey))
            }
            setIsFileExist(true)
            setShowLoader(false)
        }).catch((error) => {
            console.log(error);
            setShowLoader(false)
        })

    }

    return (
        <>
            {isFileExist ?
                <>
                    {accept === 'image' ?
                        <div className={styles.imageUploadWrapper}>
                            <div className={styles.closeIconWrapper} onClick={() => setIsFileExist(false)}>
                                <AllIconsComponenet height={10} width={10} iconName={'closeicon'} color={'#ffffff'} />
                            </div>
                            <CoverImg height={177} url={pictureUrl} />
                        </div>
                        :
                        <div className={styles.imageUploadWrapper}>
                            <div className={styles.closeIconWrapper} onClick={() => setIsFileExist(false)}>
                                <AllIconsComponenet height={10} width={10} iconName={'closeicon'} color={'#ffffff'} />
                            </div>
                            <VideoThumnail
                                lang={'ar'}
                                pictureUrl={coursePictureUrl}
                                videoUrl={videoUrl}
                                thumnailHeight={177}
                            />
                        </div>
                    }
                </>
                :
                <>
                    <input disabled={showLoader} type='file' id={`upload${accept}`} accept={type} className={styles.uploadFileInput} onChange={handleUploadFile} />
                    <label htmlFor={`upload${accept}`} className={styles.imageUploadWrapper}>
                        {showLoader &&
                            <div className={styles.loaderWrapper}>
                                <Spinner borderwidth={4} width={3} height={3} margin={0.5} />
                            </div>
                        }
                        <AllIconsComponenet iconName={'uploadFile'} height={38.37} width={57} color={'#808080a6'}></AllIconsComponenet>
                        <p className={styles.uploadimagetext}>{label}</p>
                    </label>
                </>
            }
        </>
    )
}

export default UploadFile