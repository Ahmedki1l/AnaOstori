import { Modal } from 'antd';
import React from 'react'
import styled from 'styled-components';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';

const StylesModal = styled(Modal)`
    .ant-modal-close{
        display:none;
    }
    .ant-modal-content{
        border-radius: 5px;
        padding: 0px;
        overflow:hidden;
    }
    .ant-modal-body {
        height: 800px;
    }
`
const ModalForVideo = ({
    videoModalOpen,
    setVideoModalOpen,
    sourceFile
}) => {

    const handleClose = () => {
        setVideoModalOpen(false);
    };

    return (
        <StylesModal
            footer={false}
            closeIcon={false}
            open={videoModalOpen}
            width={1200}
            onCancel={handleClose}
        >
            <div className='videoCloseIcon' onClick={handleClose}>
                <AllIconsComponenet iconName={'closeicon'} height={16} width={16} color={'#FFFFFF'} />
            </div>
            <video controls width="100%" height="100%">
                <source src={sourceFile} type="video/mp4" />
            </video>
        </StylesModal>
    )
}

export default ModalForVideo