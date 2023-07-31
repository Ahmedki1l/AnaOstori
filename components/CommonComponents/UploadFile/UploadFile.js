import React from 'react'
import styles from './UploadFile.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { useSelector } from 'react-redux'
import { uploadFileAPI } from '../../../services/apisService'

const UploadFile = ({ label, accept, setImageUploadResponceData }) => {

    const storeData = useSelector((state) => state?.globalStore);


    const handleUploadFile = async (e) => {
        console.log("video", e);
        let formData = new FormData();
        formData.append("file", e.target.files[0]);

        const data = {
            formData,
            accessToken: storeData?.accessToken
        }
        console.log("data", data);
        await uploadFileAPI(data).then((res) => {
            console.log(res);
            setImageUploadResponceData(res.data)
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