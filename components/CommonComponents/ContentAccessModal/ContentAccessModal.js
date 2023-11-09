import { Modal } from 'antd'
import React from 'react'
import styles from './ContentAccessModal.module.scss'
import { contentAccessPopUPConst } from '../../../constants/ar'
import styled from 'styled-components'

const StylesModal = styled(Modal)`
    .ant-modal-content {
        padding: 0;
        border-radius: 4px;
    }

`

const ContentAccessModal = ({
    isModelForcontentAccess,
    setIsModelforcontentAccess
}) => {

    const isModelClose = () => {
        setIsModelforcontentAccess(false)
    }

    return (
        <StylesModal
            open={isModelForcontentAccess}
            onCancel={isModelClose}
            closeIcon={false}
            width={358}
            centered={true}
            footer={false}>
            <div style={{ padding: '15px' }}>
                <p className={`fontBold ${styles.headeText}`}>{contentAccessPopUPConst.modalHeaderText}</p>
                <p className={styles.modalParaText}>{contentAccessPopUPConst.modalDetailText}</p>
                <div className={`${styles.buttonModalDiv} flex justify-center items-center`}>
                    <button className={`primarySolidBtn ${styles.cancelBtn}`} onClick={isModelClose}>{contentAccessPopUPConst.ctaBtnText}</button>
                </div>
            </div>
        </StylesModal>
    )
}

export default ContentAccessModal