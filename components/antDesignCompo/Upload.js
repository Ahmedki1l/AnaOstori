/* eslint-disable */
import React, { useState } from 'react'
import { Modal, Upload as AntdUpload } from 'antd';
import styled from 'styled-components'
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import { uploadFileAPI, uploadProfileImage } from '../../services/apisService';


const AntdUploadStyle = styled(AntdUpload)`
`
const Upload = ({
    listType,
    label,
    setUploadFileList,
    accept,
    ...rest
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    const handleCancel = () => setPreviewOpen(false);

    const handleChange = async ({ fileList: newFileList }) => {
        // console.log(newFileList[0]?.originFileObj);
        // setFileList(newFileList)
        // setUploadFileList(newFileList)
        let formData = new FormData();
        formData.append("file", newFileList[0]?.originFileObj);

        const data = {
            formData,
        }
        console.log("data", data);
        await uploadFileAPI(data).then((res) => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        })

    }

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file) => {
        console.log(file);
        if (!file.url && !file.preview) {
            console.log(file);
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    return (
        <>
            <AntdUploadStyle
                {...rest}
                accept={accept}
                listType={listType}
                fileList={fileList}
                onPreview={(file) => handlePreview(file)}
                onChange={handleChange}
            >
                {fileList.length >= 1 ? null :
                    <div>
                        <AllIconsComponenet iconName={'uploadFile'} height={38.37} width={57} color={'#808080a6'} ></AllIconsComponenet>
                        <p>{label}</p>
                    </div>
                }
            </AntdUploadStyle>
            <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
                {accept == "image/*" ?
                    <img
                        alt="example"
                        style={{
                            width: '100%',
                        }}
                        src={previewImage}
                    />
                    :
                    <video src={previewImage} controls />
                }
            </Modal>
        </>
    )
}
export default Upload
