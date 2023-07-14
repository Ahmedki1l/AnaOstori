import React from 'react';
import { Modal } from 'antd';
import styles from './ModelForDeleteItems.module.scss'

const ModelForDeleteItems = ({
    ismodelForDeleteItems,
    onCloseModal,
    tableDataType,
    folderType,
}
) => {
    console.log(tableDataType, folderType);
    const deleteModalProps = {
        folder: {
            messageText: "هل انت متأكد من انك تريد حذف هذا المجلد؟",
            btnText: "تأكيد حذف المجلد",
            title: "حذف مجلد"
        },
        video: {
            messageText: "هل انت متأكد من انك تريد حذف هذا الفيديو؟",
            btnText: "تأكيد حذف الفيديو",
            title: "حذف فيديو"
        },
        file: {
            messageText: "هل انت متأكد من انك تريد حذف هذا الملف؟",
            btnText: "تأكيد حذف الملف",
            title: "حذف ملف"
        },
        quiz: {
            messageText: "هل انت متأكد من انك تريد حذف هذا الاختبار؟",
            btnText: "تأكيد حذف الاختبار",
            title: "حذف اختبار"
        },
        items: {
            messageText: "هل انت متأكد من انك تريد إزالة هذا العنصر؟",
            btnText: "تأكيد إزالة العنصر",
            title: "إزالة عنصر"
        }
    }

    const handleDeleteItems = () => {
        onCloseModal()
    };

    const modelHeading = tableDataType == "folder" ? deleteModalProps.folder.title : deleteModalProps[folderType].title
    const deleteMsg = tableDataType == "folder" ? deleteModalProps.folder.messageText : deleteModalProps[folderType].messageText
    const deleteBtnText = tableDataType == "folder" ? deleteModalProps.folder.btnText : deleteModalProps[folderType].btnText


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