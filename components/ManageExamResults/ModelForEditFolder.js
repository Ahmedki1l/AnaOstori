import React, { useState, useEffect } from 'react'
import { Modal, Input, Checkbox, Button, Alert, Divider, Form } from 'antd'
import { EditOutlined, FolderOutlined, InfoCircleOutlined } from '@ant-design/icons'
import styles from '../../styles/InstructorPanelStyleSheets/ManageExamResults.module.scss'

const { TextArea } = Input

const ModelForEditFolder = ({ 
    isModelForEditFolder, 
    setIsModelForEditFolder, 
    selectedFolderForAction, 
    onUpdateConfirm,
    loading = false
}) => {
    const [form] = Form.useForm()
    const [error, setError] = useState(null)

    // Reset form when modal opens
    useEffect(() => {
        if (isModelForEditFolder && selectedFolderForAction) {
            form.setFieldsValue({
                name: selectedFolderForAction.name || '',
                description: selectedFolderForAction.description || '',
                isActive: selectedFolderForAction.isActive !== false
            })
            setError(null)
        }
    }, [isModelForEditFolder, selectedFolderForAction, form])

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields()
            await onUpdateConfirm(values)
        } catch (error) {
            if (error.errorFields) {
                setError('يرجى إدخال جميع البيانات المطلوبة')
            } else {
                setError(error.message || 'حدث خطأ أثناء تحديث المجلد')
            }
        }
    }

    const handleCancel = () => {
        if (!loading) {
            setIsModelForEditFolder(false)
            form.resetFields()
            setError(null)
        }
    }

    return (
        <Modal
            title={
                <div className={styles.modalTitle}>
                    <EditOutlined className={styles.modalIcon} />
                    <span>تعديل المجلد</span>
                </div>
            }
            open={isModelForEditFolder}
            onCancel={handleCancel}
            footer={null}
            width={600}
            centered
            className={styles.editFolderModal}
            maskClosable={!loading}
            closable={!loading}
        >
            <div className={styles.modalContent}>
                {/* Folder Info Section */}
                <div className={styles.folderInfoSection}>
                    <h4>معلومات المجلد</h4>
                    <div className={styles.folderDetails}>
                        <div className={styles.folderDetail}>
                            <span className={styles.label}>النوع:</span>
                            <span className={styles.value}>
                                <FolderOutlined style={{ marginLeft: 4 }} />
                                {selectedFolderForAction?.type === 'simulationExam' ? 'اختبارات محاكية' : selectedFolderForAction?.type}
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

                {/* Edit Form */}
                <Form
                    form={form}
                    layout="vertical"
                    className={styles.editForm}
                >
                    <Form.Item
                        name="name"
                        label="اسم المجلد"
                        rules={[
                            { required: true, message: 'يرجى إدخال اسم المجلد' },
                            { min: 2, message: 'يجب أن يكون الاسم 2 أحرف على الأقل' },
                            { max: 100, message: 'يجب أن لا يتجاوز الاسم 100 حرف' }
                        ]}
                    >
                        <Input
                            placeholder="أدخل اسم المجلد"
                            size="large"
                            disabled={loading}
                            className={styles.formInput}
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="وصف المجلد (اختياري)"
                    >
                        <TextArea
                            placeholder="أدخل وصف المجلد"
                            rows={3}
                            disabled={loading}
                            className={styles.formTextarea}
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        name="isActive"
                        valuePropName="checked"
                    >
                        <Checkbox disabled={loading}>
                            <span className={styles.checkboxLabel}>المجلد نشط</span>
                            <span className={styles.checkboxDescription}>
                                المجلدات النشطة فقط ستظهر للمستخدمين
                            </span>
                        </Checkbox>
                    </Form.Item>
                </Form>

                {/* Info Alert */}
                <Alert
                    message="ملاحظة مهمة"
                    description="سيتم تحديث المجلد فوراً. التغييرات ستظهر لجميع المستخدمين."
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
                        onClick={handleUpdate}
                        loading={loading}
                        icon={<EditOutlined />}
                        className={styles.updateButton}
                    >
                        {loading ? 'جاري التحديث...' : 'تحديث المجلد'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ModelForEditFolder
