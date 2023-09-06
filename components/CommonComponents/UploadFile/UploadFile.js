import React, { useState } from 'react'
import styles from './UploadFile.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { uploadFileSevices } from '../../../services/UploadFileSevices'
import Spinner from '../../CommonComponents/spinner'

const UploadFile = ({ label, accept, setUploadFileData }) => {
    const [showLoader, setShowLoader] = useState(false);

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
            setShowLoader(false)
        }).catch((error) => {
            console.log(error);
            setShowLoader(false)
        })

    }

    return (
        <>
            <input disabled={showLoader} type='file' id={`upload${accept}`} accept={`${accept}/*`} className={styles.uploadFileInput} onChange={handleUploadFile} />
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
    )
}

export default UploadFile