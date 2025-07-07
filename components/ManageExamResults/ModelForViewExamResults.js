import React from 'react'
import { Modal, Descriptions, Progress, Tag, Divider } from 'antd'
import { fullDate } from '../../../constants/DateConverter'
import styles from './ModelForViewExamResults.module.scss'

const ModelForViewExamResults = ({
    isModelForViewExamResults,
    setIsModelForViewExamResults,
    examResult
}) => {
    const handleCancel = () => {
        setIsModelForViewExamResults(false)
    }

    if (!examResult) return null

    const getStatusColor = (status) => {
        return status === 'pass' ? 'green' : 'red'
    }

    const getScoreColor = (score) => {
        if (score >= 90) return '#52c41a'
        if (score >= 80) return '#1890ff'
        if (score >= 70) return '#faad14'
        if (score >= 60) return '#fa8c16'
        return '#f5222d'
    }

    return (
        <Modal
            title="تفاصيل نتيجة الاختبار"
            open={isModelForViewExamResults}
            onCancel={handleCancel}
            footer={[
                <button key="close" className="secondaryBtn" onClick={handleCancel}>
                    إغلاق
                </button>
            ]}
            width={700}
            className={styles.viewModal}
        >
            <div className={styles.examResultDetails}>
                {/* Student Information */}
                <div className={styles.studentSection}>
                    <h3>معلومات الطالب</h3>
                    <div className={styles.studentInfo}>
                        <div className={styles.studentAvatar}>
                            <img 
                                src={examResult.studentAvatar || '/images/default-avatar.png'} 
                                alt="Student Avatar"
                                onError={(e) => {
                                    e.target.src = '/images/default-avatar.png'
                                }}
                            />
                        </div>
                        <div className={styles.studentDetails}>
                            <h4>{examResult.studentName}</h4>
                            <p>رقم الطالب: {examResult.studentId || 'غير محدد'}</p>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* Exam Information */}
                <div className={styles.examSection}>
                    <h3>معلومات الاختبار</h3>
                    <Descriptions column={2} size="small">
                        <Descriptions.Item label="اسم الاختبار">
                            {examResult.examName}
                        </Descriptions.Item>
                        <Descriptions.Item label="تاريخ الاختبار">
                            {fullDate(examResult.examDate)}
                        </Descriptions.Item>
                        <Descriptions.Item label="تاريخ الرفع">
                            {fullDate(examResult.uploadDate)}
                        </Descriptions.Item>
                        <Descriptions.Item label="الحالة">
                            <Tag color={getStatusColor(examResult.status)}>
                                {examResult.status === 'pass' ? 'ناجح' : 'راسب'}
                            </Tag>
                        </Descriptions.Item>
                        {examResult.isTerminated && (
                            <Descriptions.Item label="سبب الانتهاء">
                                <Tag color="red">
                                    {examResult.terminationReason || 'تم إنهاء الاختبار'}
                                </Tag>
                            </Descriptions.Item>
                        )}
                        <Descriptions.Item label="نوع التقديم">
                            <Tag color={examResult.isTerminated ? 'orange' : 'green'}>
                                {examResult.isTerminated ? 'منتهي تلقائياً' : 'مكتمل'}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </div>

                <Divider />

                {/* Score Details */}
                <div className={styles.scoreSection}>
                    <h3>تفاصيل الدرجة</h3>
                    <div className={styles.scoreDisplay}>
                        <div className={styles.scoreCircle}>
                            <Progress
                                type="circle"
                                percent={examResult.score}
                                format={(percent) => `${percent}%`}
                                strokeColor={getScoreColor(examResult.score)}
                                size={120}
                            />
                        </div>
                        <div className={styles.scoreInfo}>
                            <div className={styles.scoreItem}>
                                <span className={styles.scoreLabel}>الدرجة الكلية:</span>
                                <span className={styles.scoreValue}>{examResult.score}%</span>
                            </div>
                            <div className={styles.scoreItem}>
                                <span className={styles.scoreLabel}>الدرجة المطلوبة للنجاح:</span>
                                <span className={styles.scoreValue}>60%</span>
                            </div>
                            <div className={styles.scoreItem}>
                                <span className={styles.scoreLabel}>الفرق:</span>
                                <span className={`${styles.scoreValue} ${examResult.score >= 60 ? styles.positive : styles.negative}`}>
                                    {examResult.score >= 60 ? '+' : ''}{examResult.score - 60}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Details */}
                {examResult.additionalDetails && (
                    <>
                        <Divider />
                        <div className={styles.additionalSection}>
                            <h3>تفاصيل إضافية</h3>
                            <Descriptions column={1} size="small">
                                {examResult.additionalDetails.map((detail, index) => (
                                    <Descriptions.Item key={index} label={detail.label}>
                                        {detail.value}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                        </div>
                    </>
                )}

                {/* Notes */}
                {examResult.notes && (
                    <>
                        <Divider />
                        <div className={styles.notesSection}>
                            <h3>ملاحظات</h3>
                            <div className={styles.notesContent}>
                                {examResult.notes}
                            </div>
                        </div>
                    </>
                )}

                {/* Section Breakdown */}
                {examResult.sections && examResult.sections.length > 0 && (
                    <>
                        <Divider />
                        <div className={styles.sectionsSection}>
                            <h3>تفصيل الأقسام</h3>
                            <div className={styles.sectionsList}>
                                {examResult.sections.map((section, index) => (
                                    <div key={index} className={styles.sectionItem}>
                                        <div className={styles.sectionHeader}>
                                            <span className={styles.sectionTitle}>{section.title}</span>
                                            <span className={styles.sectionScore}>
                                                {section.score}/{section.totalQuestions}
                                            </span>
                                        </div>
                                        <Progress
                                            percent={Math.round((section.score / section.totalQuestions) * 100)}
                                            size="small"
                                            strokeColor={getScoreColor(Math.round((section.score / section.totalQuestions) * 100))}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Time Information */}
                {examResult.timeSpent && (
                    <>
                        <Divider />
                        <div className={styles.timeSection}>
                            <h3>معلومات الوقت</h3>
                            <Descriptions column={2} size="small">
                                <Descriptions.Item label="الوقت المستغرق">
                                    {examResult.timeSpent}
                                </Descriptions.Item>
                                <Descriptions.Item label="الوقت المحدد">
                                    {examResult.totalTime || 'غير محدد'}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}

export default ModelForViewExamResults 