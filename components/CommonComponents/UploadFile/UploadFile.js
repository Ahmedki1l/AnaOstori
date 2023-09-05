import React from 'react'
import styles from './UploadFile.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { uploadFileAPI } from '../../../services/apisService'

const UploadFile = ({ label, accept, setImageUploadResponceData }) => {

    const handleUploadFile = async (e) => {
        console.log(e);
        // let formData = new FormData();
        // formData.append("file", e.target.files[0]);
        // const data = {
        //     formData,
        // }
        // await uploadFileAPI(data).then((res) => {
        //     setImageUploadResponceData(res.data)
        // }).catch((error) => {
        //     console.log(error);
        // })
        const videoType = e.target.files[0].type.split('/')[1]
        let body = {
            type: "signedUrl",
            extention: videoType
        }
        await uploadFileAPI(body).then((res) => {
            const signedUrl = res.data.signedUrl.split('?')[0]
            console.log(signedUrl);
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <>
            <input type='file' id={`upload${accept}`} accept={`${accept}/*`} className={styles.uploadFileInput} onChange={handleUploadFile} />
            <label htmlFor={`upload${accept}`} className={styles.imageUploadWrapper}>
                <AllIconsComponenet iconName={'uploadFile'} height={38.37} width={57} color={'#808080a6'}></AllIconsComponenet>
                <p className={styles.uploadimagetext}>{label}</p>
            </label>
        </>
    )
}

export default UploadFile