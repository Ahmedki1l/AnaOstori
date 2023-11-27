import React from 'react';
import { Modal } from 'antd';
import styles from './ModelForDeleteItems.module.scss'
import { curriculumConst, folderConst, pdfFileConst, quizConst, videoFileConst } from '../../../constants/adminPanelConst/manageLibraryConst/manageLibraryConst';
import { instructorConst } from '../../../constants/adminPanelConst/instructorConst';
import { deleteReviewsConst } from '../../../constants/adminPanelConst/manageStudentFeedBackConst/manageStudentFeedBackConst';

const ModelForDeleteItems = ({
    ismodelForDeleteItems,
    onCloseModal,
    deleteItemType,
    onDelete,
}
) => {
    const deleteModalProps = {
        folder: {
            title: folderConst.deleteFolderModelConst.deletePopUpTitle,
            messageText: folderConst.deleteFolderModelConst.deletePopUpText,
            btnText: folderConst.deleteFolderModelConst.deleteBtnText,
        },
        video: {
            title: videoFileConst.deleteVideoModelConst.deletePopUpTitle,
            messageText: videoFileConst.deleteVideoModelConst.deletePopUpText,
            btnText: videoFileConst.deleteVideoModelConst.deleteBtnText,
        },
        file: {
            title: pdfFileConst.deletePdfModelConst.deletePopUpTitle,
            messageText: pdfFileConst.deletePdfModelConst.deletePopUpText,
            btnText: pdfFileConst.deletePdfModelConst.deleteBtnText,
        },
        quiz: {
            title: quizConst.deleteExamModelConst.deletePopUpTitle,
            messageText: quizConst.deleteExamModelConst.deletePopUpText,
            btnText: quizConst.deleteExamModelConst.deleteBtnText,
        },
        section: {
            title: curriculumConst.deleteSectionModelConst.deleteSectionPopUpTitle,
            messageText: curriculumConst.deleteSectionModelConst.deleteSectionPopUpText,
            btnText: curriculumConst.deleteSectionModelConst.deleteSectionBtnText,
        },
        curriculum: {
            title: curriculumConst.curriculumDeleteModelConst.deleteCurriculumPopUpTitle,
            messageText: curriculumConst.curriculumDeleteModelConst.deleteCurriculumPopUpText,
            btnText: curriculumConst.curriculumDeleteModelConst.deleteCurriculumBtnText,
        },
        videoDelete: {
            title: curriculumConst.deleteVideoFromSectionModelConst.deleteVideoPopUpTitle,//'تأكيد عدم تضمين الفيديو',
            messageText: curriculumConst.deleteVideoFromSectionModelConst.deleteVideoPopUpText,// 'متأكد انك ما تبي تضم هذا الفيديو للمقرر؟',
            btnText: curriculumConst.deleteVideoFromSectionModelConst.deleteVideoBtnText,//'اي، ما بضمنه',
        },
        fileDelete: {
            title: curriculumConst.deletePdfFileFromSectionModelConst.deletePdfPopUpTitle, // 'تأكيد عدم تضمين الملف',
            messageText: curriculumConst.deletePdfFileFromSectionModelConst.deletePdfPopUpText, //'متأكد انك ما تبي تضم هذا الملف للمقرر؟',
            btnText: curriculumConst.deletePdfFileFromSectionModelConst.deletePdfBtnText, // 'اي، ما بضمنه',
        },
        quizDelete: {
            title: curriculumConst.deleteExamFromSectionModelConst.deleteExamPopUpTitle, //  'تأكيد عدم تضمين الاختبار',
            messageText: curriculumConst.deleteExamFromSectionModelConst.deleteExamPopUpText, // 'متأكد انك ما تبي تضم هذا الاختبار للمقرر؟',
            btnText: curriculumConst.deleteExamFromSectionModelConst.deleteExamBtnText, // 'اي، ما بضمنه',
        },
        category: {
            title: "حذف مقرر",
            messageText: "هل انت متأكد من انك تريد حذف هذا المقرر؟",
            btnText: "تأكيد حذف المقرر",
        },
        instructor: {
            title: instructorConst.deleteInstructorPopUpTitle,
            messageText: instructorConst.deleteInstructorPopText,
            btnText: instructorConst.deleteInsteuctorBtnText,
        },
        news: {
            title: 'تأكيد حذف نص تسويقي',
            messageText: 'متأكد انك تبي تحذف النص التسويقي؟',
            btnText: 'تأكيد الحذف',
        },
        coupon: {
            title: 'تأكيد حذف الكوبون',
            messageText: 'متأكد انك تبي تحذف الكوبون؟',
            btnText: 'تأكيد الحذف'
        },
        studentReview: {
            title: deleteReviewsConst.title,
            messageText: deleteReviewsConst.messageText,
            btnText: deleteReviewsConst.btnText,
        },
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