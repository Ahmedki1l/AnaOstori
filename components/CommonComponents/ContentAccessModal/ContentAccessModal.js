import { Modal } from 'antd'
import React from 'react'
import styles from './ContentAccessModal.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'

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
                className='addAppoinmentModal'
                open={isModelForcontentAccess}
                onCancel={isModelClose}
                closeIcon={false}
                footer={false}>
                <div style={{ padding: '15px' }}>
                    <div className={styles.modalHeader}>
                        <button onClick={isModelClose} className={styles.closebutton}>
                            <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                        <p className={`fontBold ${styles.headeText}`}>توضيح</p>
                    </div>
                    <p className={styles.modalParaText}>
                        حاليًا محتوى الدورة مخفي، وراح يجيك اشعار اول ما نفعل المحتوى
                    </p>
                    <div className={`${styles.buttonModalDiv} flex justify-center items-center`}>
                        <button className={`primarySolidBtn ${styles.cancelBtn}`} onClick={isModelClose}>تمام</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ContentAccessModal