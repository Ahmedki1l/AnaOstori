import { Modal } from 'antd'
import React from 'react'
import styles from './ContentAccessModal.module.scss'
import { contentAccessPopUPConst } from '../../../constants/ar'

const ContentAccessModal = ({
    isModelForcontentAccess,
    setIsModelforcontentAccess
}) => {

    const isModelClose = () => {
        setIsModelforcontentAccess(false)
    }

    return (
        <div>
            <Modal
                className={'addAppoinmentModal'}
                open={isModelForcontentAccess}
                onCancel={isModelClose}
                closeIcon={false}
                footer={false}>
                <div style={{ padding: '15px' }}>
                    <p className={`fontBold ${styles.headeText}`}>{contentAccessPopUPConst.modalHeaderText}</p>
                    <p className={styles.modalParaText}>{contentAccessPopUPConst.modalDetailText}</p>
                    <div className={`${styles.buttonModalDiv} flex justify-center items-center`}>
                        <button className={`primarySolidBtn ${styles.cancelBtn}`} onClick={isModelClose}>{contentAccessPopUPConst.ctaBtnText}</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ContentAccessModal