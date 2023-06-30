import React from 'react';
import { Modal } from 'antd';
import styles from './ModelForDeleteItems.module.scss'

const ModelForDeleteItems = ({
    ismodelForDeleteItems,
    setIsmodelForDeleteItems,
}
) => {

    const handleDeleteItems = () => {
        setIsmodelForDeleteItems(false);
    };

    return (
        <>
            <Modal className='addAppoinmentModal'
                closeIcon={false}
                footer={false}
                open={ismodelForDeleteItems}
                onCancel={() => setIsmodelForDeleteItems(false)}
            >
                <div dir='rtl'>
                    <div className={styles.deleteItemsModalHeader}>
                        <p className={`fontBold ${styles.deleteItemsText}`}>إضافة فيديو</p>
                    </div>
                    <p className={styles.deleteVideoText}>هل انت متأكد من انك تريد حذف هذا الفيديو؟</p>
                    <div className={styles.AppointmentFieldBorderBottom}>
                        <div className={styles.confirmVideoBtn}>
                            <button className='deleteBtn' type={'submit'} onClick={handleDeleteItems}>تأكيد حذف الفيديو</button>
                        </div>
                        <div>
                            <button className={styles.ignoreVideoBtn} type={'submit'}>تراجع</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>

    );
}

export default ModelForDeleteItems