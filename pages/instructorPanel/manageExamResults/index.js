import React, { useEffect, useState } from 'react'
import styles from '../../../styles/InstructorPanelStyleSheets/ManageExamResults.module.scss'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import { Table, Select, Input, Button, message, Tabs, Tag, Tooltip } from 'antd'
import { UploadOutlined, DownloadOutlined, EyeOutlined, WarningOutlined, ClockCircleOutlined } from '@ant-design/icons'
import Empty from '../../../components/CommonComponents/Empty'
import { postAuthRouteAPI, postRouteAPI, getRouteAPI } from '../../../services/apisService'
import { getNewToken } from '../../../services/fireBaseAuthService'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import ModelForDeleteItems from '../../../components/ManageLibraryComponent/ModelForDeleteItems/ModelForDeleteItems'
import { fullDate } from '../../../constants/DateConverter'
import ModelForUploadExamResults from '../../../components/ManageExamResults/ModelForUploadExamResults'
import ModelForViewExamResults from '../../../components/ManageExamResults/ModelForViewExamResults'
import ModelForViewTermination from '../../../components/ManageExamResults/ModelForViewTermination'

const { Search } = Input

const Index = () => {
    const [examResultsList, setExamResultsList] = useState([])
    const [examTerminationsList, setExamTerminationsList] = useState([])
    const [isModelForUploadExamResults, setIsModelForUploadExamResults] = useState(false)
    const [isModelForViewExamResults, setIsModelForViewExamResults] = useState(false)
    const [isModelForViewTermination, setIsModelForViewTermination] = useState(false)
    const [selectedExamResult, setSelectedExamResult] = useState(null)
    const [isModelForDeleteItems, setIsModelForDeleteItems] = useState(false)
    const [examList, setExamList] = useState([])
    const [selectedExam, setSelectedExam] = useState(null)
    const [loading, setLoading] = useState(false)
    const [terminationsLoading, setTerminationsLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [terminationsSearchText, setTerminationsSearchText] = useState('')
    const [activeTab, setActiveTab] = useState('results')

    const tableColumns = [
        {
            title: 'اسم الطالب',
            dataIndex: 'studentName',
            key: 'studentName',
            render: (text, record) => (
                <div className={styles.studentInfo}>
                    <div className={styles.studentAvatar}>
                        <img 
                            src={record.studentAvatar || '/images/default-avatar.png'} 
                            alt="Student Avatar"
                            onError={(e) => {
                                e.target.src = '/images/default-avatar.png'
                            }}
                        />
                    </div>
                    <span>{text}</span>
                </div>
            )
        },
        {
            title: 'اسم الاختبار',
            dataIndex: 'examName',
            key: 'examName',
        },
        {
            title: 'الدرجة',
            dataIndex: 'score',
            key: 'score',
            render: (score, record) => (
                <span className={`${styles.score} ${score >= 60 ? styles.pass : styles.fail}`}>
                    {score}%
                </span>
            )
        },
        {
            title: 'الحالة',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <div className={styles.statusContainer}>
                    <span className={`${styles.status} ${status === 'pass' ? styles.passStatus : styles.failStatus}`}>
                        {status === 'pass' ? 'ناجح' : 'راسب'}
                    </span>
                    {record.isTerminated && (
                        <span className={styles.terminatedBadge} title={record.terminationReason}>
                            منتهي
                        </span>
                    )}
                </div>
            )
        },
        {
            title: 'تاريخ الاختبار',
            dataIndex: 'examDate',
            key: 'examDate',
            render: (date) => fullDate(date)
        },
        {
            title: 'تاريخ الرفع',
            dataIndex: 'uploadDate',
            key: 'uploadDate',
            render: (date) => fullDate(date)
        },
        {
            title: 'الإجراءات',
            key: 'actions',
            render: (_, record) => (
                <div className={styles.actions}>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewExamResult(record)}
                        title="عرض التفاصيل"
                    />
                    <Button
                        type="text"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownloadResult(record)}
                        title="تحميل النتيجة"
                    />
                    <Button
                        type="text"
                        danger
                        icon={<AllIconsComponenet iconName={'newDeleteIcon'} height={16} width={16} color={'#ff4d4f'} />}
                        onClick={() => handleDeleteExamResult(record)}
                        title="حذف النتيجة"
                    />
                </div>
            )
        }
    ]

    const terminationsTableColumns = [
        {
            title: 'اسم الطالب',
            dataIndex: 'studentName',
            key: 'studentName',
            render: (text, record) => (
                <div className={styles.studentInfo}>
                    <div className={styles.studentAvatar}>
                        <img 
                            src={record.studentAvatar || '/images/default-avatar.png'} 
                            alt="Student Avatar"
                            onError={(e) => {
                                e.target.src = '/images/default-avatar.png'
                            }}
                        />
                    </div>
                    <span>{text}</span>
                </div>
            )
        },
        {
            title: 'اسم الاختبار',
            dataIndex: 'examName',
            key: 'examName',
        },
        {
            title: 'سبب الانتهاء',
            dataIndex: 'reason',
            key: 'reason',
            render: (reason) => (
                <Tag color="red" icon={<WarningOutlined />}>
                    {reason || 'تم إنهاء الاختبار'}
                </Tag>
            )
        },
        {
            title: 'عدد التحذيرات',
            dataIndex: 'distractionStrikes',
            key: 'distractionStrikes',
            render: (strikes) => (
                <span className={styles.strikesCount}>
                    {strikes}/3
                </span>
            )
        },
        {
            title: 'عدد أحداث التشتيت',
            dataIndex: 'totalDistractionEvents',
            key: 'totalDistractionEvents',
            render: (events) => (
                <span className={styles.eventsCount}>
                    {events || 0}
                </span>
            )
        },
        {
            title: 'أنواع التشتيت',
            dataIndex: 'distractionTypes',
            key: 'distractionTypes',
            render: (types) => (
                <div className={styles.distractionTypes}>
                    {types && types.length > 0 ? types.map((type, index) => (
                        <Tag key={index} color="orange" size="small">
                            {type}
                        </Tag>
                    )) : (
                        <span className={styles.noTypes}>غير محدد</span>
                    )}
                </div>
            )
        },
        {
            title: 'وقت الانتهاء',
            dataIndex: 'timeToTermination',
            key: 'timeToTermination',
            render: (time) => (
                <span className={styles.terminationTime}>
                    <ClockCircleOutlined /> {time ? `${Math.round(time / 1000)}s` : 'غير محدد'}
                </span>
            )
        },
        {
            title: 'تاريخ الانتهاء',
            dataIndex: 'terminationTimestamp',
            key: 'terminationTimestamp',
            render: (date) => fullDate(date)
        },
        {
            title: 'الإجراءات',
            key: 'actions',
            render: (_, record) => (
                <div className={styles.actions}>
                    <Tooltip title="عرض تفاصيل التشتيت">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewTermination(record)}
                            title="عرض التفاصيل"
                        />
                    </Tooltip>
                    <Tooltip title="حذف سجل الانتهاء">
                        <Button
                            type="text"
                            danger
                            icon={<AllIconsComponenet iconName={'newDeleteIcon'} height={16} width={16} color={'#ff4d4f'} />}
                            onClick={() => handleDeleteTermination(record)}
                            title="حذف السجل"
                        />
                    </Tooltip>
                </div>
            )
        }
    ]

    useEffect(() => {
        getExamList()
        if (activeTab === 'results') {
            getExamResultsList()
        } else if (activeTab === 'terminations') {
            getExamTerminationsList()
        }
    }, [activeTab])

    const getExamList = async () => {
        try {
            const body = {
                routeName: 'getItemByCourseId',
                type: 'quiz'
            }
            const response = await getRouteAPI(body)
            const exams = response.data?.map(exam => ({
                key: exam.id,
                label: exam.name,
                value: exam.id,
            }))
            setExamList(exams)
        } catch (error) {
            console.error('Error fetching exam list:', error)
            if (error?.response?.status === 401) {
                await getNewToken()
                getExamList()
            }
        }
    }

    const getExamResultsList = async () => {
        setLoading(true)
        try {
            const body = {
                routeName: 'getExamResults',
                examId: selectedExam
            }
            const response = await postRouteAPI(body)
            
            // Handle the new backend response structure
            const responseData = response.data || response.body ? JSON.parse(response.body || response.data) : response
            
            if (!responseData.success) {
                throw new Error(responseData.message || 'Failed to fetch exam results')
            }
            
            const results = responseData.data?.map(result => ({
                ...result,
                key: result._id || result.id, // MongoDB uses _id, but we need id for table
                id: result._id || result.id, // Ensure we have both _id and id
                studentName: result.student?.fullName || result.student?.firstName || 'Unknown Student',
                studentAvatar: result.student?.avatar,
                studentId: result.student?.id || result.studentId,
                examName: result.exam?.name || result.examData?.examName || 'Unknown Exam',
                examId: result.exam?.id || result.examId,
                score: result.score || result.examData?.score || 0,
                status: (result.score || result.examData?.score || 0) >= 60 ? 'pass' : 'fail',
                examDate: result.examDate || result.examData?.examDate,
                uploadDate: result.createdAt || result.uploadDate,
                isTerminated: result.isTerminated || false,
                terminationReason: result.terminationReason || null,
                submissionType: result.submissionType || (result.isTerminated ? 'terminated' : 'completed'),
                // Additional fields from the new structure
                totalQuestions: result.totalQuestions || result.examData?.totalQuestions,
                correctAnswers: result.correctAnswers || result.examData?.correctAnswers,
                wrongAnswers: result.wrongAnswers || result.examData?.wrongAnswers,
                timeSpent: result.timeSpent || result.examData?.timeSpent,
                totalTime: result.totalTime || result.examData?.totalTime,
                sections: result.sections || [],
                sectionDetails: result.sectionDetails || [],
                distractionEvents: result.distractionEvents || [],
                distractionStrikes: result.distractionStrikes || 0
            }))
            setExamResultsList(results || [])
        } catch (error) {
            console.error('Error fetching exam results:', error)
            if (error?.response?.status === 401) {
                await getNewToken()
                getExamResultsList()
            } else {
                message.error('فشل في جلب نتائج الاختبارات')
            }
        } finally {
            setLoading(false)
        }
    }

    const getExamTerminationsList = async () => {
        setTerminationsLoading(true)
        try {
            const body = {
                routeName: 'getExamTerminations',
                examId: selectedExam,
                page: 1,
                limit: 100
            }
            const response = await postRouteAPI(body)
            
            // Handle the new backend response structure
            const responseData = response.data || response.body ? JSON.parse(response.body || response.data) : response
            
            if (!responseData.success) {
                throw new Error(responseData.message || 'Failed to fetch exam terminations')
            }
            
            const terminations = responseData.data?.map(termination => ({
                ...termination,
                key: termination._id || termination.id,
                id: termination._id || termination.id,
                studentName: termination.student?.fullName || termination.student?.firstName || 'Unknown Student',
                studentAvatar: termination.student?.avatar,
                studentId: termination.student?.id || termination.studentId,
                examName: termination.exam?.name || 'Unknown Exam',
                examId: termination.exam?.id || termination.examId,
                reason: termination.reason || 'تم إنهاء الاختبار',
                distractionStrikes: termination.distractionStrikes || 0,
                totalDistractionEvents: termination.totalDistractionEvents || termination.distractionEvents?.length || 0,
                distractionTypes: termination.distractionTypes || [],
                timeToTermination: termination.timeToTermination || 0,
                terminationTimestamp: termination.terminationTimestamp || termination.createdAt,
                distractionEvents: termination.distractionEvents || []
            }))
            setExamTerminationsList(terminations || [])
        } catch (error) {
            console.error('Error fetching exam terminations:', error)
            if (error?.response?.status === 401) {
                await getNewToken()
                getExamTerminationsList()
            } else {
                message.error('فشل في جلب سجلات انتهاء الاختبارات')
            }
        } finally {
            setTerminationsLoading(false)
        }
    }

    const handleExamChange = (examId) => {
        setSelectedExam(examId)
        if (examId) {
            if (activeTab === 'results') {
                getExamResultsList()
            } else if (activeTab === 'terminations') {
                getExamTerminationsList()
            }
        } else {
            setExamResultsList([])
            setExamTerminationsList([])
        }
    }

    const handleSearch = (value) => {
        setSearchText(value)
    }

    const handleTerminationsSearch = (value) => {
        setTerminationsSearchText(value)
    }

    const handleUploadExamResults = () => {
        setIsModelForUploadExamResults(true)
    }

    const handleViewExamResult = (record) => {
        setSelectedExamResult(record)
        setIsModelForViewExamResults(true)
    }

    const handleDownloadResult = async (record) => {
        try {
            const body = {
                routeName: 'downloadExamResult',
                resultId: record._id || record.id // Use MongoDB ObjectId
            }
            const response = await postRouteAPI(body)
            
            // Handle the new backend response structure
            const responseData = response.data || response.body ? JSON.parse(response.body || response.data) : response
            
            if (!responseData.success) {
                throw new Error(responseData.message || 'Failed to download exam result')
            }
            
            // Handle file download
            const blob = new Blob([responseData.data || responseData], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `exam-result-${record.studentName}-${record.examName}.pdf`
            link.click()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            message.error('فشل في تحميل النتيجة')
            console.error('Error downloading result:', error)
        }
    }

    const handleDeleteExamResult = (record) => {
        setSelectedExamResult(record)
        setIsModelForDeleteItems(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            const body = {
                routeName: 'deleteExamResult',
                resultId: selectedExamResult._id || selectedExamResult.id // Use MongoDB ObjectId
            }
            await postAuthRouteAPI(body)
            message.success('تم حذف النتيجة بنجاح')
            getExamResultsList()
            setIsModelForDeleteItems(false)
        } catch (error) {
            message.error('فشل في حذف النتيجة')
            console.error('Error deleting result:', error)
            if (error?.response?.status === 401) {
                await getNewToken()
                handleDeleteConfirm()
            }
        }
    }

    const handleViewTermination = (record) => {
        setSelectedExamResult(record)
        setIsModelForViewTermination(true)
    }

    const handleDeleteTermination = (record) => {
        setSelectedExamResult(record)
        setIsModelForDeleteItems(true)
    }

    const handleDeleteTerminationConfirm = async () => {
        try {
            const body = {
                routeName: 'deleteExamTermination',
                terminationId: selectedExamResult._id || selectedExamResult.id
            }
            await postAuthRouteAPI(body)
            message.success('تم حذف سجل الانتهاء بنجاح')
            getExamTerminationsList()
            setIsModelForDeleteItems(false)
        } catch (error) {
            message.error('فشل في حذف سجل الانتهاء')
            console.error('Error deleting termination:', error)
            if (error?.response?.status === 401) {
                await getNewToken()
                handleDeleteTerminationConfirm()
            }
        }
    }

    const filteredResults = examResultsList.filter(result =>
        result.studentName?.toLowerCase().includes(searchText.toLowerCase()) ||
        result.examName?.toLowerCase().includes(searchText.toLowerCase())
    )

    const filteredTerminations = examTerminationsList.filter(termination =>
        termination.studentName?.toLowerCase().includes(terminationsSearchText.toLowerCase()) ||
        termination.examName?.toLowerCase().includes(terminationsSearchText.toLowerCase()) ||
        termination.reason?.toLowerCase().includes(terminationsSearchText.toLowerCase())
    )

    const customEmptyComponent = (
        <Empty 
            emptyText={'لا توجد نتائج اختبارات'} 
            containerhight={400} 
            buttonText={'رفع نتائج اختبار'} 
            onClick={handleUploadExamResults} 
        />
    )

    const customEmptyTerminationsComponent = (
        <Empty 
            emptyText={'لا توجد سجلات انتهاء اختبارات'} 
            containerhight={400} 
            buttonText={null} 
            onClick={null} 
        />
    )

    return (
        <div className='maxWidthDefault px-4'>
            <div style={{ height: 30 }}>
                <BackToPath
                    backpathForPage={true}
                    backPathArray={[
                        { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                        { lable: 'إدارة نتائج الاختبارات', link: null },
                    ]}
                />
            </div>

            <div className={styles.examResultsHeadArea}>
                <h1 className={`head2`}>إدارة نتائج الاختبارات</h1>
                <div className={styles.createExamResultsBtnBox}>
                    <button className='primarySolidBtn' onClick={handleUploadExamResults}>
                        رفع نتائج اختبار
                    </button>
                </div>
            </div>

            <div className={styles.filtersArea}>
                <div className={styles.filterGroup}>
                    <label>اختر الاختبار:</label>
                    <Select
                        placeholder="اختر الاختبار"
                        style={{ width: 200 }}
                        onChange={handleExamChange}
                        allowClear
                    >
                        {examList.map(exam => (
                            <Select.Option key={exam.key} value={exam.value}>
                                {exam.label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>

            <Tabs
                className={styles.tabContainer}
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: 'results',
                        label: (
                            <span>
                                <span>نتائج الاختبارات</span>
                                {examResultsList.length > 0 && (
                                    <Tag color="blue" style={{ marginLeft: 8 }}>
                                        {examResultsList.length}
                                    </Tag>
                                )}
                            </span>
                        ),
                        children: (
                            <div>
                                <div className={styles.filtersArea}>
                                    <div className={styles.filterGroup}>
                                        <label>بحث:</label>
                                        <Search
                                            placeholder="ابحث باسم الطالب أو الاختبار"
                                            style={{ width: 300 }}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            allowClear
                                        />
                                    </div>
                                </div>

                                <Table
                                    columns={tableColumns}
                                    dataSource={filteredResults}
                                    loading={loading}
                                    locale={{ emptyText: customEmptyComponent }}
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: true,
                                        showQuickJumper: true,
                                        showTotal: (total, range) => `${range[0]}-${range[1]} من ${total} نتيجة`
                                    }}
                                />
                            </div>
                        )
                    },
                    {
                        key: 'terminations',
                        label: (
                            <span>
                                <span>سجلات انتهاء الاختبارات</span>
                                {examTerminationsList.length > 0 && (
                                    <Tag color="red" style={{ marginLeft: 8 }}>
                                        {examTerminationsList.length}
                                    </Tag>
                                )}
                            </span>
                        ),
                        children: (
                            <div>
                                <div className={styles.filtersArea}>
                                    <div className={styles.filterGroup}>
                                        <label>بحث:</label>
                                        <Search
                                            placeholder="ابحث باسم الطالب أو الاختبار أو سبب الانتهاء"
                                            style={{ width: 300 }}
                                            onChange={(e) => handleTerminationsSearch(e.target.value)}
                                            allowClear
                                        />
                                    </div>
                                </div>

                                <Table
                                    columns={terminationsTableColumns}
                                    dataSource={filteredTerminations}
                                    loading={terminationsLoading}
                                    locale={{ emptyText: customEmptyTerminationsComponent }}
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: true,
                                        showQuickJumper: true,
                                        showTotal: (total, range) => `${range[0]}-${range[1]} من ${total} سجل انتهاء`
                                    }}
                                />
                            </div>
                        )
                    }
                ]}
            />

            {isModelForUploadExamResults && (
                <ModelForUploadExamResults
                    isModelForUploadExamResults={isModelForUploadExamResults}
                    setIsModelForUploadExamResults={setIsModelForUploadExamResults}
                    getExamResultsList={getExamResultsList}
                    examList={examList}
                />
            )}

            {isModelForViewExamResults && (
                <ModelForViewExamResults
                    isModelForViewExamResults={isModelForViewExamResults}
                    setIsModelForViewExamResults={setIsModelForViewExamResults}
                    examResult={selectedExamResult}
                />
            )}

            {isModelForViewTermination && (
                <ModelForViewTermination
                    isModelForViewTermination={isModelForViewTermination}
                    setIsModelForViewTermination={setIsModelForViewTermination}
                    termination={selectedExamResult}
                />
            )}

            {isModelForDeleteItems && (
                <ModelForDeleteItems
                    ismodelForDeleteItems={isModelForDeleteItems}
                    onCloseModal={() => setIsModelForDeleteItems(false)}
                    deleteItemType={activeTab === 'results' ? 'examResult' : 'examTermination'}
                    onDelete={activeTab === 'results' ? handleDeleteConfirm : handleDeleteTerminationConfirm}
                />
            )}
        </div>
    )
}

export default Index 