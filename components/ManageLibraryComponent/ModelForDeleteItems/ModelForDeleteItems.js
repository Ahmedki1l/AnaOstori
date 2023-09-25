import React from 'react';
import { Modal } from 'antd';
import styles from './ModelForDeleteItems.module.scss'

const ModelForDeleteItems = ({
    ismodelForDeleteItems,
    onCloseModal,
    deleteItemType,
    onDelete,
}
) => {
    const deleteModalProps = {
        folder: {
            title: 'تأكيد حذف المجلد',
            messageText: 'متأكد انك تبي تحذف المجلد؟',
            btnText: 'تأكيد الحذف',
        },
        video: {
            title: 'تأكيد حذف الفيديو',
            messageText: 'متأكد انك تبي تحذف الفيديو؟',
            btnText: 'تأكيد الحذف',
        },
        file: {
            title: 'تأكيد حذف الملف',
            messageText: 'متأكد انك تبي تحذف الملف؟',
            btnText: 'تأكيد الحذف',
        },
        quiz: {
            title: 'تأكيد حذف الاختبار',
            messageText: 'متأكد انك تبي تحذف الاختبار؟',
            btnText: 'تأكيد الحذف',
        },
        section: {
            title: 'تأكيد حذف القسم',
            messageText: 'متأكد انك تبي تحذف القسم؟',
            btnText: 'تأكيد الحذف',
        },
        sectionItem: {
            title: "إزالة عنصر",
            messageText: "هل انت متأكد من انك تريد إزالة هذا العنصر؟",
            btnText: "تأكيد إزالة العنصر",
        },
        curriculum: {
            title: 'تأكيد حذف المقرر',
            messageText: 'متأكد انك تبي تحذف المقرر؟',
            btnText: 'تأكيد الحذف',
        },
        category: {
            title: "حذف مقرر",
            messageText: "هل انت متأكد من انك تريد حذف هذا المقرر؟",
            btnText: "تأكيد حذف المقرر",
        },
        instructor: {
            title: "حذف مقرر",
            messageText: "هل انت متأكد من انك تريد حذف هذا المقرر؟",
            btnText: "تأكيد حذف المقرر",
        }
    }

    const handleDeleteItems = () => {
        onDelete()
        onCloseModal()
    };

    const modelHeading = deleteModalProps[deleteItemType].title
    const deleteMsg = deleteModalProps[deleteItemType].messageText
    const deleteBtnText = deleteModalProps[deleteItemType].btnText


    return (
        <>
            <Modal className='addAppoinmentModal'
                closeIcon={false}
                footer={false}
                open={ismodelForDeleteItems}
                onCancel={() => onCloseModal()}
            >
                <div dir='rtl'>
                    <div className={styles.deleteItemsModalHeader}>
                        <p className={`fontBold ${styles.deleteItemsText}`}>{modelHeading}</p>
                    </div>
                    <p className={styles.deleteVideoText}>{deleteMsg}</p>
                    <div className={styles.AppointmentFieldBorderBottom}>
                        <div className={styles.confirmVideoBtn}>
                            <button className='deleteBtn' onClick={() => handleDeleteItems()}>{deleteBtnText}</button>
                        </div>
                        <div>
                            <button className={styles.ignoreVideoBtn} onClick={() => onCloseModal()}>تراجع</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>

    );
}

export default ModelForDeleteItems