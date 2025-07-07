import React, { useState } from 'react'
import { Modal, Form, Select, Input, Upload, Button, message, Table } from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import { postAuthRouteAPI } from '../../../services/apisService'
import { getNewToken } from '../../../services/fireBaseAuthService'
import styles from './ModelForUploadExamResults.module.scss'

const { TextArea } = Input

const ModelForUploadExamResults = ({
    isModelForUploadExamResults,
    setIsModelForUploadExamResults,
    getExamResultsList,
    examList
}) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [uploadedResults, setUploadedResults] = useState([])
    const [selectedExam, setSelectedExam] = useState(null)

    const handleCancel = () => {
        setIsModelForUploadExamResults(false)
        form.resetFields()
        setUploadedResults([])
        setSelectedExam(null)
    }

    const handleExamChange = (examId) => {
        setSelectedExam(examId)
        form.setFieldsValue({ examId })
    }

    const handleFileUpload = (info) => {
        const { fileList } = info
        const results = fileList.map(file => ({
            uid: file.uid,
            name: file.name,
            status: file.status,
            file: file.originFileObj
        }))
        setUploadedResults(results)
    }

    const handleManualEntry = () => {
        const newResult = {
            uid: Date.now(),
            studentName: '',
            studentId: '',
            score: '',
            notes: '',
            examDate: new Date().toISOString().split('T')[0]
        }
        setUploadedResults([...uploadedResults, newResult])
    }

    const handleManualResultChange = (uid, field, value) => {
        const updatedResults = uploadedResults.map(result => 
            result.uid === uid ? { ...result, [field]: value } : result
        )
        setUploadedResults(updatedResults)
    }

    const handleRemoveResult = (uid) => {
        const updatedResults = uploadedResults.filter(result => result.uid !== uid)
        setUploadedResults(updatedResults)
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            
            // Validate form
            const values = await form.validateFields()
            
            if (uploadedResults.length === 0) {
                message.error('يرجى إضافة نتائج اختبار واحدة على الأقل')
                return
            }

            // Prepare data for upload
            const formData = new FormData()
            formData.append('examId', selectedExam)
            formData.append('routeName', 'uploadExamResults')

            // Add results data
            const resultsData = uploadedResults.map(result => ({
                studentName: result.studentName,
                studentId: result.studentId,
                score: parseFloat(result.score),
                notes: result.notes,
                examDate: result.examDate
            }))
            formData.append('results', JSON.stringify(resultsData))

            // Add files if any
            uploadedResults.forEach((result, index) => {
                if (result.file) {
                    formData.append(`files`, result.file)
                }
            })

            await postAuthRouteAPI(formData)
            
            message.success('تم رفع نتائج الاختبار بنجاح')
            handleCancel()
            getExamResultsList()
        } catch (error) {
            console.error('Error uploading exam results:', error)
            if (error?.response?.status === 401) {
                await getNewToken()
                handleSubmit()
            } else {
                message.error('فشل في رفع نتائج الاختبار')
            }
        } finally {
            setLoading(false)
        }
    }

    const manualEntryColumns = [
        {
            title: 'اسم الطالب',
            dataIndex: 'studentName',
            key: 'studentName',
            render: (text, record) => (
                <Input
                    placeholder="اسم الطالب"
                    value={text}
                    onChange={(e) => handleManualResultChange(record.uid, 'studentName', e.target.value)}
                />
            )
        },
        {
            title: 'رقم الطالب',
            dataIndex: 'studentId',
            key: 'studentId',
            render: (text, record) => (
                <Input
                    placeholder="رقم الطالب"
                    value={text}
                    onChange={(e) => handleManualResultChange(record.uid, 'studentId', e.target.value)}
                />
            )
        },
        {
            title: 'الدرجة',
            dataIndex: 'score',
            key: 'score',
            render: (text, record) => (
                <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="الدرجة"
                    value={text}
                    onChange={(e) => handleManualResultChange(record.uid, 'score', e.target.value)}
                />
            )
        },
        {
            title: 'الملاحظات',
            dataIndex: 'notes',
            key: 'notes',
            render: (text, record) => (
                <TextArea
                    placeholder="ملاحظات (اختياري)"
                    value={text}
                    onChange={(e) => handleManualResultChange(record.uid, 'notes', e.target.value)}
                    rows={2}
                />
            )
        },
        {
            title: 'تاريخ الاختبار',
            dataIndex: 'examDate',
            key: 'examDate',
            render: (text, record) => (
                <Input
                    type="date"
                    value={text}
                    onChange={(e) => handleManualResultChange(record.uid, 'examDate', e.target.value)}
                />
            )
        },
        {
            title: 'الإجراءات',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveResult(record.uid)}
                    title="حذف"
                />
            )
        }
    ]

    return (
        <Modal
            title="رفع نتائج الاختبار"
            open={isModelForUploadExamResults}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    إلغاء
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    loading={loading}
                    onClick={handleSubmit}
                >
                    رفع النتائج
                </Button>
            ]}
            width={800}
            className={styles.uploadModal}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="examId"
                    label="اختر الاختبار"
                    rules={[{ required: true, message: 'يرجى اختيار الاختبار' }]}
                >
                    <Select
                        placeholder="اختر الاختبار"
                        onChange={handleExamChange}
                    >
                        {examList.map(exam => (
                            <Select.Option key={exam.key} value={exam.value}>
                                {exam.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <div className={styles.uploadSection}>
                    <h3>رفع ملف النتائج</h3>
                    <Upload
                        multiple
                        fileList={uploadedResults.filter(r => r.file)}
                        onChange={handleFileUpload}
                        beforeUpload={() => false}
                        accept=".xlsx,.xls,.csv"
                    >
                        <Button icon={<UploadOutlined />}>اختر ملف النتائج</Button>
                    </Upload>
                    <p className={styles.uploadHint}>
                        يدعم الملفات: Excel (.xlsx, .xls) أو CSV
                    </p>
                </div>

                <div className={styles.manualEntrySection}>
                    <div className={styles.sectionHeader}>
                        <h3>إدخال النتائج يدوياً</h3>
                        <Button type="dashed" onClick={handleManualEntry}>
                            إضافة نتيجة
                        </Button>
                    </div>
                    
                    {uploadedResults.filter(r => !r.file).length > 0 && (
                        <Table
                            columns={manualEntryColumns}
                            dataSource={uploadedResults.filter(r => !r.file)}
                            pagination={false}
                            size="small"
                            rowKey="uid"
                        />
                    )}
                </div>

                <div className={styles.summarySection}>
                    <h4>ملخص النتائج:</h4>
                    <p>عدد النتائج المضافة: {uploadedResults.length}</p>
                    {uploadedResults.length > 0 && (
                        <div className={styles.resultsPreview}>
                            {uploadedResults.map((result, index) => (
                                <div key={result.uid} className={styles.resultItem}>
                                    <span>{index + 1}. {result.studentName || result.name}</span>
                                    <span>{result.score}%</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Form>
        </Modal>
    )
}

export default ModelForUploadExamResults 