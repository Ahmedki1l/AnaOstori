import axios from "axios";
import { uploadFileAPI } from "./apisService"

const fileToBinary = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => { resolve(event.target.result) };
        reader.onerror = (error) => { reject(error) };
        reader.readAsArrayBuffer(file);
    });
};


export const uploadFileSevices = async (file, onUploadProgress, cancelToken) => {
    return new Promise(async (resolve, reject) => {
        const binaryData = await fileToBinary(file);
        const fileType = file.type.split('/')[1]
        let body = {
            type: "signedUrl",
            extention: fileType
        }
        await uploadFileAPI(body, cancelToken).then(async (res) => {
            const signedUrl = res.data.signedUrl
            await axios.put(signedUrl, binaryData, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onUploadProgress(percentCompleted);
                },
                cancelToken: cancelToken
            }).then((res) => {
                resolve(signedUrl)
            }).catch((err) => {
                console.log(err);
                reject(err)
            })
        }).catch((error) => {
            console.log(error);
        })
    })
}

