import React, { useState } from 'react'
import { Modal, Button, Alert, Divider, Checkbox, Typography } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons'
import styles from '../../styles/InstructorPanelStyleSheets/ManageExamResults.module.scss'

const { Text } = Typography

const ModelForDeleteFolder = ({ 
    isModelForDeleteFolder, 
    setIsModelForDeleteFolder, 
    selectedFolderForAction, 
    onDeleteConfirm,
    loading = false
}) => {
    const [forceDelete, setForceDelete] = useState(false)
    const [error, setError] = useState(null)

    const handleDelete = async () => {
        try {
            await onDeleteConfirm(forceDelete)
        } catch (error) {
            setError(error.message || 'حدث خطأ أثناء حذف المجلد')
        }
    }

    const handleCancel = () => {
        if (!loading) {
            setIsModelForDeleteFolder(false)
            setForceDelete(false)
            setError(null)
        }
    }

    const hasExams = selectedFolderForAction?.examCount > 0

    return (
        <Modal
            title={
                <div className={styles.modalTitle}>
                    <DeleteOutlined className={styles.modalIcon} />
                    <span>حذف المجلد</span>
                </div>
            }
            open={isModelForDeleteFolder}
            onCancel={handleCancel}
            footer={null}
            width={600}
            centered
            className={styles.deleteFolderModal}
            maskClosable={!loading}
            closable={!loading}
        >
            <div className={styles.modalContent}>
                {/* Warning Alert */}
                <Alert
                    message="تنبيه مهم"
                    description="سيتم حذف المجلد نهائياً. هذا الإجراء لا يمكن التراجع عنه."
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    className={styles.warningAlert}
                />

                {/* Folder Info Section */}
                <div className={styles.folderInfoSection}>
                    <h4>معلومات المجلد</h4>
                    <div className={styles.folderDetails}>
                        <div className={styles.folderDetail}>
                            <span className={styles.label}>اسم المجلد:</span>
                            <span className={styles.value}>{selectedFolderForAction?.name}</span>
                        </div>
                        <div className={styles.folderDetail}>
                            <span className={styles.label}>النوع:</span>
                            <span className={styles.value}>
                                {selectedFolderForAction?.type === 'simulationExam' ? 'اختبارات محاكية' : selectedFolderForAction?.type}
                            </span>
                        </div>
                        <div className={styles.folderDetail}>
                            <span className={styles.label}>عدد الاختبارات:</span>
                            <span className={styles.value}>
                                {selectedFolderForAction?.examCount || 0} اختبار
                            </span>
                        </div>
                        <div className={styles.folderDetail}>
                            <span className={styles.label}>تاريخ الإنشاء:</span>
                            <span className={styles.value}>
                                {new Date(selectedFolderForAction?.createdAt).toLocaleDateString('ar-SA')}
                            </span>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* Delete Options */}
                {hasExams && (
                    <div className={styles.deleteOptionsSection}>
                        <h4>خيارات الحذف</h4>
                        <div className={styles.deleteOptionsList}>
                            <div className={styles.deleteOptionItem}>
                                <Checkbox
                                    checked={forceDelete}
                                    onChange={(e) => setForceDelete(e.target.checked)}
                                    disabled={loading}
                                >
                                    <span className={styles.deleteOptionLabel}>حذف قسري</span>
                                    <span className={styles.deleteOptionDescription}>
                                        حذف المجلد مع جميع الاختبارات والنتائج الموجودة فيه
                                    </span>
                                </Checkbox>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Warning */}
                {hasExams && !forceDelete && (
                    <Alert
                        message="تحذير: المجلد يحتوي على اختبارات"
                        description={`المجلد "${selectedFolderForAction?.name}" يحتوي على ${selectedFolderForAction?.examCount} اختبار. لا يمكن حذفه إلا باستخدام خيار الحذف القسري.`}
                        type="error"
                        showIcon
                        icon={<WarningOutlined />}
                        className={styles.contentWarningAlert}
                    />
                )}

                {/* Force Delete Warning */}
                {forceDelete && hasExams && (
                    <Alert
                        message="تحذير: حذف قسري"
                        description={`سيتم حذف المجلد "${selectedFolderForAction?.name}" مع جميع ${selectedFolderForAction?.examCount} اختبار والنتائج المرتبطة بها. هذا الإجراء لا يمكن التراجع عنه.`}
                        type="error"
                        showIcon
                        icon={<WarningOutlined />}
                        className={styles.forceDeleteWarningAlert}
                    />
                )}

                {/* Info Alert */}
                <Alert
                    message="ملاحظة مهمة"
                    description="بعد الحذف، لن يتمكن أي مستخدم من الوصول إلى هذا المجلد أو محتوياته."
                    type="info"
                    showIcon
                    icon={<InfoCircleOutlined />}
                    className={styles.infoAlert}
                />

                {/* Error Display */}
                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        className={styles.errorAlert}
                    />
                )}

                {/* Action Buttons */}
                <div className={styles.modalActions}>
                    <Button
                        onClick={handleCancel}
                        disabled={loading}
                        className={styles.cancelButton}
                    >
                        إلغاء
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={handleDelete}
                        loading={loading}
                        disabled={hasExams && !forceDelete}
                        icon={<DeleteOutlined />}
                        className={styles.deleteButton}
                    >
                        {loading ? 'جاري الحذف...' : 'حذف المجلد'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ModelForDeleteFolder
