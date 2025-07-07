import React from 'react'
import { Modal, Descriptions, Tag, Divider, Timeline, Card } from 'antd'
import { WarningOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons'
import { fullDate } from '../../constants/DateConverter'
import styles from './ModelForViewTermination.module.scss'

const ModelForViewTermination = ({
    isModelForViewTermination,
    setIsModelForViewTermination,
    termination
}) => {
    const handleCancel = () => {
        setIsModelForViewTermination(false)
    }

    if (!termination) return null

    const getDistractionTypeColor = (type) => {
        const colors = {
            'tab_hidden': 'red',
            'window_blur': 'orange',
            'route_change': 'purple',
            'continuous_distraction': 'volcano',
            'default': 'blue'
        }
        return colors[type] || colors.default
    }

    const formatDistractionTime = (timestamp) => {
        if (!timestamp) return 'غير محدد'
        const date = new Date(timestamp)
        return date.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    const getDistractionTypeLabel = (type) => {
        const labels = {
            'tab_hidden': 'إخفاء التبويب',
            'window_blur': 'ترك النافذة',
            'route_change': 'تغيير الصفحة',
            'continuous_distraction': 'تشتيت مستمر',
            'default': 'تشتيت آخر'
        }
        return labels[type] || labels.default
    }

    return (
        <Modal
            title={
                <div className={styles.modalTitle}>
                    <WarningOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                    تفاصيل انتهاء الاختبار
                </div>
            }
            open={isModelForViewTermination}
            onCancel={handleCancel}
            footer={[
                <button key="close" className="secondaryBtn" onClick={handleCancel}>
                    إغلاق
                </button>
            ]}
            width={800}
            className={styles.viewTerminationModal}
        >
            <div className={styles.terminationDetails}>
                {/* Student Information */}
                <div className={styles.studentSection}>
                    <h3>معلومات الطالب</h3>
                    <div className={styles.studentInfo}>
                        <div className={styles.studentAvatar}>
                            <img 
                                src={termination.studentAvatar || '/images/default-avatar.png'} 
                                alt="Student Avatar"
                                onError={(e) => {
                                    e.target.src = '/images/default-avatar.png'
                                }}
                            />
                        </div>
                        <div className={styles.studentDetails}>
                            <h4>{termination.studentName}</h4>
                            <p>رقم الطالب: {termination.studentId || 'غير محدد'}</p>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* Exam Information */}
                <div className={styles.examSection}>
                    <h3>معلومات الاختبار</h3>
                    <Descriptions column={2} size="small">
                        <Descriptions.Item label="اسم الاختبار">
                            {termination.examName}
                        </Descriptions.Item>
                        <Descriptions.Item label="سبب الانتهاء">
                            <Tag color="red" icon={<WarningOutlined />}>
                                {termination.reason || 'تم إنهاء الاختبار'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="تاريخ الانتهاء">
                            {fullDate(termination.terminationTimestamp)}
                        </Descriptions.Item>
                        <Descriptions.Item label="وقت الانتهاء">
                            <span className={styles.terminationTime}>
                                <ClockCircleOutlined /> 
                                {termination.timeToTermination ? `${Math.round(termination.timeToTermination / 1000)} ثانية` : 'غير محدد'}
                            </span>
                        </Descriptions.Item>
                    </Descriptions>
                </div>

                <Divider />

                {/* Distraction Analytics */}
                <div className={styles.analyticsSection}>
                    <h3>تحليل التشتيت</h3>
                    <div className={styles.analyticsGrid}>
                        <Card className={styles.analyticsCard}>
                            <div className={styles.analyticsItem}>
                                <span className={styles.analyticsLabel}>عدد التحذيرات:</span>
                                <span className={styles.strikesCount}>
                                    {termination.distractionStrikes}/3
                                </span>
                            </div>
                        </Card>
                        <Card className={styles.analyticsCard}>
                            <div className={styles.analyticsItem}>
                                <span className={styles.analyticsLabel}>إجمالي أحداث التشتيت:</span>
                                <span className={styles.eventsCount}>
                                    {termination.totalDistractionEvents || termination.distractionEvents?.length || 0}
                                </span>
                            </div>
                        </Card>
                        <Card className={styles.analyticsCard}>
                            <div className={styles.analyticsItem}>
                                <span className={styles.analyticsLabel}>أنواع التشتيت:</span>
                                <div className={styles.distractionTypes}>
                                    {termination.distractionTypes && termination.distractionTypes.length > 0 ? 
                                        termination.distractionTypes.map((type, index) => (
                                            <Tag key={index} color={getDistractionTypeColor(type)} size="small">
                                                {getDistractionTypeLabel(type)}
                                            </Tag>
                                        )) : (
                                            <span className={styles.noTypes}>غير محدد</span>
                                        )
                                    }
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Distraction Timeline */}
                {termination.distractionEvents && termination.distractionEvents.length > 0 && (
                    <>
                        <Divider />
                        <div className={styles.timelineSection}>
                            <h3>جدول زمني لأحداث التشتيت</h3>
                            <Timeline
                                items={termination.distractionEvents.map((event, index) => ({
                                    key: index,
                                    color: getDistractionTypeColor(event.type),
                                    children: (
                                        <div className={styles.timelineItem}>
                                            <div className={styles.timelineHeader}>
                                                <Tag color={getDistractionTypeColor(event.type)}>
                                                    {getDistractionTypeLabel(event.type)}
                                                </Tag>
                                                <span className={styles.timelineTime}>
                                                    {formatDistractionTime(event.time || event.timestamp)}
                                                </span>
                                            </div>
                                            {event.data && Object.keys(event.data).length > 0 && (
                                                <div className={styles.timelineData}>
                                                    <small>بيانات إضافية: {JSON.stringify(event.data)}</small>
                                                </div>
                                            )}
                                        </div>
                                    )
                                }))}
                            />
                        </div>
                    </>
                )}

                {/* Termination Summary */}
                <Divider />
                <div className={styles.summarySection}>
                    <h3>ملخص الانتهاء</h3>
                    <div className={styles.summaryContent}>
                        <p>
                            <strong>سبب الانتهاء:</strong> {termination.reason || 'تم إنهاء الاختبار تلقائياً'}
                        </p>
                        <p>
                            <strong>عدد التحذيرات:</strong> {termination.distractionStrikes} من أصل 3
                        </p>
                        <p>
                            <strong>إجمالي أحداث التشتيت:</strong> {termination.totalDistractionEvents || termination.distractionEvents?.length || 0} حدث
                        </p>
                        {termination.timeToTermination && (
                            <p>
                                <strong>الوقت حتى الانتهاء:</strong> {Math.round(termination.timeToTermination / 1000)} ثانية
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ModelForViewTermination 