import React, { useState, useEffect } from 'react'
import { Modal, Select, Checkbox, Button, Alert, Spin, Divider } from 'antd'
import { CopyOutlined, FolderOutlined, InfoCircleOutlined } from '@ant-design/icons'
import styles from '../../styles/InstructorPanelStyleSheets/ManageExamResults.module.scss'

const { Option } = Select

const ModelForCopyExam = ({ 
    isModelForCopyExam, 
    setIsModelForCopyExam, 
    selectedExamForAction, 
    folderList, 
    onCopyConfirm 
}) => {
    const [destinationFolderId, setDestinationFolderId] = useState(null)
    const [options, setOptions] = useState({
        keepOriginal: true,
        copyResults: false
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Reset form when modal opens
    useEffect(() => {
        if (isModelForCopyExam) {
            setDestinationFolderId(null)
            setOptions({
                keepOriginal: true,
                copyResults: false
            })
            setError(null)
        }
    }, [isModelForCopyExam])

    const handleCopy = async () => {
        if (!destinationFolderId) {
            setError('يرجى اختيار مجلد الهدف')
            return
        }

        setLoading(true)
        setError(null)

        try {
            await onCopyConfirm(destinationFolderId, options)
        } catch (error) {
            // Handle different types of errors
            if (error.message.includes('انتهت صلاحية الجلسة')) {
                setError('انتهت صلاحية الجلسة. يرجى إعادة تسجيل الدخول.')
            } else if (error.message.includes('خطأ في الاتصال')) {
                setError('خطأ في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى.')
            } else {
                setError(error.message || 'حدث خطأ أثناء نسخ الاختبار')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        if (!loading) {
            setIsModelForCopyExam(false)
        }
    }

    const availableFolders = folderList.filter(folder => 
        folder._id !== selectedExamForAction?.folderId
    )

    return (
        <Modal
            title={
                <div className={styles.modalTitle}>
                    <CopyOutlined className={styles.modalIcon} />
                    <span>نسخ الاختبار</span>
                </div>
            }
            open={isModelForCopyExam}
            onCancel={handleCancel}
            footer={null}
            width={600}
            centered
            className={styles.copyModal}
            maskClosable={!loading}
            closable={!loading}
        >
            <div className={styles.modalContent}>
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
                    </div>
                </div>

                <Divider />

                {/* Destination Folder Selection */}
                <div className={styles.folderSelectionSection}>
                    <h4>اختر مجلد الهدف</h4>
                    <Select
                        placeholder="اختر المجلد الذي تريد نسخ الاختبار إليه"
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

                {/* Copy Options */}
                <div className={styles.optionsSection}>
                    <h4>خيارات النسخ</h4>
                    <div className={styles.optionsList}>
                        <div className={styles.optionItem}>
                            <Checkbox
                                checked={options.keepOriginal}
                                onChange={(e) => setOptions(prev => ({ ...prev, keepOriginal: e.target.checked }))}
                                disabled={loading}
                            >
                                <span className={styles.optionLabel}>الاحتفاظ بالاختبار الأصلي</span>
                                <span className={styles.optionDescription}>
                                    سيتم نسخ الاختبار مع الاحتفاظ بالنسخة الأصلية
                                </span>
                            </Checkbox>
                        </div>
                        
                        <div className={styles.optionItem}>
                            <Checkbox
                                checked={options.copyResults}
                                onChange={(e) => setOptions(prev => ({ ...prev, copyResults: e.target.checked }))}
                                disabled={loading}
                            >
                                <span className={styles.optionLabel}>نسخ نتائج الاختبارات</span>
                                <span className={styles.optionDescription}>
                                    سيتم نسخ جميع نتائج الطلاب مع الاختبار
                                </span>
                            </Checkbox>
                        </div>
                    </div>
                </div>

                {/* Info Alert */}
                <Alert
                    message="ملاحظة مهمة"
                    description="سيتم نسخ الاختبار مع جميع الأسئلة والإعدادات. قد يستغرق هذا الأمر بعض الوقت حسب حجم الاختبار."
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
                        onClick={handleCopy}
                        loading={loading}
                        disabled={!destinationFolderId || availableFolders.length === 0}
                        icon={<CopyOutlined />}
                        className={styles.copyButton}
                    >
                        {loading ? 'جاري النسخ...' : 'نسخ الاختبار'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ModelForCopyExam
