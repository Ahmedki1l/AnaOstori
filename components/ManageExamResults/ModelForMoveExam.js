import React, { useState, useEffect } from 'react'
import { Modal, Select, Button, Alert, Divider, Typography } from 'antd'
import { SwapOutlined, FolderOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import styles from '../../styles/InstructorPanelStyleSheets/ManageExamResults.module.scss'

const { Option } = Select
const { Text } = Typography

const ModelForMoveExam = ({ 
    isModelForMoveExam, 
    setIsModelForMoveExam, 
    selectedExamForAction, 
    folderList, 
    onMoveConfirm 
}) => {
    const [destinationFolderId, setDestinationFolderId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Reset form when modal opens
    useEffect(() => {
        if (isModelForMoveExam) {
            setDestinationFolderId(null)
            setError(null)
        }
    }, [isModelForMoveExam])

    const handleMove = async () => {
        if (!destinationFolderId) {
            setError('يرجى اختيار مجلد الهدف')
            return
        }

        setLoading(true)
        setError(null)

        try {
            await onMoveConfirm(destinationFolderId)
        } catch (error) {
            // Handle different types of errors
            if (error.message.includes('انتهت صلاحية الجلسة')) {
                setError('انتهت صلاحية الجلسة. يرجى إعادة تسجيل الدخول.')
            } else if (error.message.includes('خطأ في الاتصال')) {
                setError('خطأ في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى.')
            } else {
                setError(error.message || 'حدث خطأ أثناء نقل الاختبار')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        if (!loading) {
            setIsModelForMoveExam(false)
        }
    }

    const availableFolders = folderList.filter(folder => 
        folder._id !== selectedExamForAction?.folderId
    )

    return (
        <Modal
            title={
                <div className={styles.modalTitle}>
                    <SwapOutlined className={styles.modalIcon} />
                    <span>نقل الاختبار</span>
                </div>
            }
            open={isModelForMoveExam}
            onCancel={handleCancel}
            footer={null}
            width={600}
            centered
            className={styles.moveModal}
            maskClosable={!loading}
            closable={!loading}
        >
            <div className={styles.modalContent}>
                {/* Warning Alert */}
                <Alert
                    message="تنبيه مهم"
                    description="سيتم نقل الاختبار من المجلد الحالي إلى المجلد الجديد. هذا الإجراء لا يمكن التراجع عنه."
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    className={styles.warningAlert}
                />

                {/* Exam Info Section */}
                <div className={styles.examInfoSection}>
                    <h4>معلومات الاختبار</h4>
                    <div className={styles.examDetails}>
                        <div className={styles.examDetail}>
                            <span className={styles.label}>اسم الاختبار:</span>
                            <span className={styles.value}>{selectedExamForAction?.title || selectedExamForAction?.name}</span>
                        </div>
                        <div className={styles.examDetail}>
                            <span className={styles.label}>المجلد الحالي:</span>
                            <span className={styles.value}>
                                <FolderOutlined style={{ marginLeft: 4 }} />
                                {selectedExamForAction?.folderName || 'غير محدد'}
                            </span>
                        </div>
                        <div className={styles.examDetail}>
                            <span className={styles.label}>عدد النتائج:</span>
                            <span className={styles.value}>
                                {selectedExamForAction?.resultCount || 0} نتيجة
                            </span>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* Destination Folder Selection */}
                <div className={styles.folderSelectionSection}>
                    <h4>اختر مجلد الهدف</h4>
                    <Select
                        placeholder="اختر المجلد الذي تريد نقل الاختبار إليه"
                        value={destinationFolderId}
                        onChange={setDestinationFolderId}
                        style={{ width: '100%' }}
                        size="large"
                        className={styles.folderSelect}
                        disabled={loading}
                        loading={loading}
                    >
                        {availableFolders.map(folder => (
                            <Option key={folder._id} value={folder._id}>
                                <div className={styles.folderOption}>
                                    <FolderOutlined className={styles.folderIcon} />
                                    <span>{folder.name}</span>
                                    <span className={styles.folderCount}>({folder.examCount || 0} اختبار)</span>
                                </div>
                            </Option>
                        ))}
                    </Select>
                    
                    {availableFolders.length === 0 && (
                        <Alert
                            message="لا توجد مجلدات متاحة"
                            description="يجب إنشاء مجلد جديد أولاً"
                            type="warning"
                            showIcon
                            className={styles.noFoldersAlert}
                        />
                    )}
                </div>

                <Divider />

                {/* Move Effects */}
                <div className={styles.moveEffectsSection}>
                    <h4>آثار النقل</h4>
                    <div className={styles.effectsList}>
                        <div className={styles.effectItem}>
                            <Text type="secondary">• سيتم إزالة الاختبار من المجلد الحالي</Text>
                        </div>
                        <div className={styles.effectItem}>
                            <Text type="secondary">• سيتم نقل جميع نتائج الطلاب مع الاختبار</Text>
                        </div>
                        <div className={styles.effectItem}>
                            <Text type="secondary">• سيتم تحديث إحصائيات كلا المجلدين</Text>
                        </div>
                    </div>
                </div>

                {/* Info Alert */}
                <Alert
                    message="ملاحظة مهمة"
                    description="سيتم نقل الاختبار مع جميع الأسئلة والنتائج والإعدادات. قد يستغرق هذا الأمر بعض الوقت حسب حجم البيانات."
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
                        onClick={handleMove}
                        loading={loading}
                        disabled={!destinationFolderId || availableFolders.length === 0}
                        icon={<SwapOutlined />}
                        className={styles.moveButton}
                    >
                        {loading ? 'جاري النقل...' : 'نقل الاختبار'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ModelForMoveExam
