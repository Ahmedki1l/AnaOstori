import axios from "axios";
import { uploadFileAPI } from "../services/apisService"

const fileToBinary = (file) => {
    console.log(file);
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => { resolve(event.target.result) };
        reader.onerror = (error) => { reject(error) };
        reader.readAsBinaryString(file);
    });
};


export const uploadFile = async (file) => {
    console.log(file);
    const binaryData = await fileToBinary(file);

    const videoType = file.type.split('/')[1]
    let body = {
        type: "signedUrl",
        extention: videoType
    }
    await uploadFileAPI(body).then(async (res) => {
        const signedUrl = res.data.signedUrl
        console.log(signedUrl);
        console.log(binaryData);
        await axios.put(signedUrl, binaryData, {
            headers: {
                'Content-Type': 'application/octet-stream',
            }
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }).catch((error) => {
        console.log(error);
    })
}

