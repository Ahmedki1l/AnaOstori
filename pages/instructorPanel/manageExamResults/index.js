import React, { useEffect, useState } from 'react'

/**
 * ⚠️ IMPORTANT: Before pushing to production, set TESTING_MODE = false
 * This file has temporary authentication bypass for testing purposes
 */
import styles from '../../../styles/InstructorPanelStyleSheets/ManageExamResults.module.scss'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import { Table, Select, Input, Button, Tag, Tooltip } from 'antd'
import { UploadOutlined, DownloadOutlined, EyeOutlined, WarningOutlined, ClockCircleOutlined, ArrowRightOutlined } from '@ant-design/icons'
import Empty from '../../../components/CommonComponents/Empty'
import { getAuthRouteAPI, postAuthRouteAPI, postRouteAPI, getRouteAPI } from '../../../services/apisService'
import { getNewToken } from '../../../services/fireBaseAuthService'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { fullDate } from '../../../constants/DateConverter'
import Spinner from '../../../components/CommonComponents/spinner'
import dynamic from 'next/dynamic'

import ModelForDeleteItems from '../../../components/ManageLibraryComponent/ModelForDeleteItems/ModelForDeleteItems';
import ModelForUploadExamResults from '../../../components/ManageExamResults/ModelForUploadExamResults';
import ModelForViewExamResults from '../../../components/ManageExamResults/ModelForViewExamResults';
import ModelForViewTermination from '../../../components/ManageExamResults/ModelForViewTermination';
import ModelForCopyExam from '../../../components/ManageExamResults/ModelForCopyExam';
import ModelForMoveExam from '../../../components/ManageExamResults/ModelForMoveExam';
import ModelForEditFolder from '../../../components/ManageExamResults/ModelForEditFolder';
import ModelForDeleteFolder from '../../../components/ManageExamResults/ModelForDeleteFolder';
import { Tabs } from 'antd';

// TEMPORARY: Disable authentication for testing
const TESTING_MODE = false

// Mock data for testing
const generateMockData = () => {
    const mockExams = [
        { key: '1', label: 'اختبار الرياضيات', value: '1' },
        { key: '2', label: 'اختبار العلوم', value: '2' },
        { key: '3', label: 'اختبار اللغة العربية', value: '3' }
    ]

    const mockResults = [
        {
            id: '1',
            studentName: 'أحمد محمد',
            examName: 'اختبار الرياضيات',
            score: 85,
            status: 'pass',
            examDate: '2024-01-15',
            uploadDate: '2024-01-15T10:30:00Z',
            isTerminated: false
        },
        {
            id: '2',
            studentName: 'فاطمة علي',
            examName: 'اختبار العلوم',
            score: 45,
            status: 'fail',
            examDate: '2024-01-16',
            uploadDate: '2024-01-16T14:20:00Z',
            isTerminated: true,
            terminationReason: 'تم إنهاء الاختبار بسبب التشتيت'
        }
    ]

    const mockTerminations = [
        {
            id: '1',
            studentName: 'فاطمة علي',
            examName: 'اختبار العلوم',
            reason: 'تم إنهاء الاختبار بسبب التشتيت',
            distractionStrikes: 3,
            totalDistractionEvents: 5,
            distractionTypes: ['tab_hidden', 'window_blur'],
            timeToTermination: 1800000, // 30 minutes in milliseconds
            terminationTimestamp: '2024-01-16T14:20:00Z'
        }
    ]

    return { mockExams, mockResults, mockTerminations }
}

const { Search } = Input

const BRAND_ORANGE = '#F26722';

const Index = () => {
    const [examResultsList, setExamResultsList] = useState([])
    const [examTerminationsList, setExamTerminationsList] = useState([])
    const [isModelForUploadExamResults, setIsModelForUploadExamResults] = useState(false)
    const [isModelForViewExamResults, setIsModelForViewExamResults] = useState(false)
    const [isModelForViewTermination, setIsModelForViewTermination] = useState(false)
    const [selectedExamResult, setSelectedExamResult] = useState(null)
    const [isModelForDeleteItems, setIsModelForDeleteItems] = useState(false)
    const [isCopyExamModal, setIsCopyExamModal] = useState(false)
    const [isMoveExamModal, setIsMoveExamModal] = useState(false)
    const [selectedExamForAction, setSelectedExamForAction] = useState(null)
    const [actionType, setActionType] = useState(null) // 'copy' or 'move'
    const [folderList, setFolderList] = useState([])
    const [examList, setExamList] = useState([])
    const [selectedFolder, setSelectedFolder] = useState(null)
    const [selectedExam, setSelectedExam] = useState(null)
    const [loadingFolders, setLoadingFolders] = useState(false)
    const [loadingExams, setLoadingExams] = useState(false)
    const [loading, setLoading] = useState(false)
    const [terminationsLoading, setTerminationsLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [terminationsSearchText, setTerminationsSearchText] = useState('')
    const [activeTab, setActiveTab] = useState('results')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalResults, setTotalResults] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPrevPage, setHasPrevPage] = useState(false)
    // Folder Management States
    const [isEditFolderModal, setIsEditFolderModal] = useState(false)
    const [isDeleteFolderModal, setIsDeleteFolderModal] = useState(false)
    const [selectedFolderForAction, setSelectedFolderForAction] = useState(null)
    const [folderFormData, setFolderFormData] = useState({
        name: '',
        description: '',
        isActive: true
    })
    const [folderActionLoading, setFolderActionLoading] = useState(false)

    const tableColumns = [
        {
            title: 'اسم الطالب',
            dataIndex: 'studentName',
            key: 'studentName',
            render: (text, record) => (
                <div className={styles.studentInfo}>
                    {/* <div className={styles.studentAvatar}>
                        <img 
                            src={record.studentAvatar || '/images/default-avatar.png'} 
                            alt="Student Avatar"
                            onError={(e) => {
                                e.target.src = '/images/default-avatar.png'
                            }}
                        />
                    </div> */}
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
                    {/* <div className={styles.studentAvatar}>
                        <img 
                            src={record.studentAvatar || '/images/default-avatar.png'} 
                            alt="Student Avatar"
                            onError={(e) => {
                                e.target.src = '/images/default-avatar.png'
                            }}
                        />
                    </div> */}
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
        if (!selectedFolder && !selectedExam) {
            fetchSimulationExamFolders();
        }
    }, [selectedFolder, selectedExam]);

    useEffect(() => {
        if (selectedFolder && !selectedExam) {
            fetchExamsInFolder(selectedFolder._id);
        }
    }, [selectedFolder, selectedExam]);

    useEffect(() => {
        if (selectedExam) {
            getExamResultsList(selectedExam, currentPage, pageSize)
            getExamTerminationsList(selectedExam)
        }
        // eslint-disable-next-line
    }, [selectedExam, currentPage, pageSize, activeTab])

    const fetchSimulationExamFolders = async () => {
        setLoadingFolders(true)
        setSelectedFolder(null)
        setSelectedExam(null)
        setExamList([])
        try {
            const data = {
                routeName: 'getFolderByType',
                type: 'simulationExam',
                page: 1,
                limit: 1000 // Fetch all folders
            }
            const res = await getAuthRouteAPI(data)
            setFolderList(res.data.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
        } catch (error) {
            await getNewToken().then(async () => {
                const data = {
                    routeName: 'getFolderByType',
                    type: 'simulationExam',
                    page: 1,
                    limit: 1000 // Fetch all folders
                }
                const res = await getAuthRouteAPI(data)
                setFolderList(res.data.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
            }).catch(error => {
                console.error("Error:", error);
            });
        } finally {
            setLoadingFolders(false)
        }
    }

    const fetchExamsInFolder = async (folderId) => {
        setLoadingExams(true)
        setSelectedExam(null)
        try {
            const body = {
                routeName: 'getItem',
                folderId: folderId,
                type: 'simulationExam',
                page: 1,
                limit: 1000 // Fetch all exams
            }
            const res = await getRouteAPI(body)
            setExamList(res.data.data.filter(item => item !== null).sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
        } catch (error) {
            await getNewToken().then(async () => {
                const body = {
                    routeName: 'getItem',
                    folderId: folderId,
                    type: 'simulationExam',
                    page: 1,
                    limit: 1000 // Fetch all exams
                }
                const res = await getRouteAPI(body)
                setExamList(res.data.data.filter(item => item !== null).sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
            }).catch(error => {
                console.error("Error:", error);
            });
        } finally {
            setLoadingExams(false)
        }
    }

    const handleFolderClick = (folder) => {
        setSelectedFolder(folder);
        setExamList([]);
        setSelectedExam(null);
        setExamResultsList([]);
        setExamTerminationsList([]);
    };
    const handleExamClick = (exam) => {
        setSelectedExam(exam._id);
        setExamResultsList([]);
        setExamTerminationsList([]);
    };
    const handleBackToFolders = () => {
        setSelectedFolder(null);
        setExamList([]);
        setSelectedExam(null);
        setExamResultsList([]);
        setExamTerminationsList([]);
    };
    const handleBackToExams = () => {
        setSelectedExam(null);
        setExamResultsList([]);
        setExamTerminationsList([]);
    };

    const getExamResultsList = async (examId, page = currentPage, limit = pageSize) => {
        setLoading(true)
        try {
            const body = {
                routeName: 'getExamResults',
                examId: examId,
                page,
                limit
            }
            const response = await getRouteAPI(body)

            // Handle the new backend response structure
            const responseData = response.data || JSON.parse(response.data)

            if (!responseData.success) {
                throw new Error(responseData.message || 'Failed to fetch exam results')
            }

            const results = responseData.data?.map(result => {
                // Check if we have new structure with nested questions
                const hasNewStructure = result.sections &&
                    result.sections.length > 0 &&
                    result.sections[0].questions &&
                    result.sections[0].questions.length > 0;

                // Extract reviewQuestions if not available (for backward compatibility)
                let reviewQuestions = result.reviewQuestions;
                if (!reviewQuestions && hasNewStructure) {
                    // Extract from nested structure
                    reviewQuestions = result.sections.flatMap(section => section.questions);
                }

                return {
                    ...result,
                    key: result._id,
                    id: result._id,
                    studentName: result.student?.fullName || result.student?.firstName || 'الاسم غير موجود',
                    studentAvatar: result.student?.avatar,
                    studentId: result.student?.id,
                    studentPhone: result.student?.phone,
                    examName: result.examName,
                    examId: result.examId,
                    score: result.score,
                    status: result.status, // use backend status directly
                    examDate: result.examDate,
                    uploadDate: result.createdAt,
                    isTerminated: result.isTerminated,
                    terminationReason: result.terminationReason,
                    submissionType: result.submissionType,
                    totalQuestions: result.totalQuestions,
                    correctAnswers: result.correctAnswers,
                    wrongAnswers: result.wrongAnswers,
                    timeSpent: result.timeSpent,
                    totalTime: result.totalTime,
                    sections: result.sections,
                    sectionDetails: result.sectionDetails,
                    distractionEvents: result.distractionEvents,
                    distractionStrikes: result.distractionStrikes,
                    markedQuestions: result.markedQuestions,
                    unansweredQuestions: result.unansweredQuestions,
                    isCompleted: result.isCompleted,
                    examDuration: result.examDuration,
                    reviewQuestions: reviewQuestions,
                    hasNewStructure: hasNewStructure
                }
            })
            setExamResultsList(results || [])

            // Use pagination data from backend response
            const pagination = responseData.pagination || {}
            setTotalResults(pagination.totalCount || responseData.total || responseData.totalCount || 0)
            setTotalPages(pagination.totalPages || Math.ceil((pagination.totalCount || 0) / pageSize))
            setHasNextPage(pagination.hasNextPage || false)
            setHasPrevPage(pagination.hasPrevPage || false)
            // Sync pageSize if backend returns different limit
            if (pagination.limit && pagination.limit !== pageSize) {
                setPageSize(pagination.limit)
            }
        } catch (error) {
            console.error('Error fetching exam results:', error)
            if (TESTING_MODE) {
                // Use mock data in testing mode
                const { mockResults } = generateMockData()
                const results = mockResults.map(result => ({
                    ...result,
                    key: result.id,
                    studentId: result.id,
                    examId: '1',
                    uploadDate: result.uploadDate,
                    examDate: result.examDate,
                    terminationReason: result.terminationReason || null,
                    submissionType: result.isTerminated ? 'terminated' : 'completed'
                }))
                setExamResultsList(results)
                setTotalResults(results.length)
                console.log('Using mock exam results for testing')
            } else if (error?.response?.status === 401) {
                await getNewToken().then(async () => {
                    getExamResultsList(examId, page, limit)
                }).catch(error => {
                    console.error("Error:", error);
                });
            } else {
                const { message } = await import('antd');
                message.error('فشل في جلب نتائج الاختبارات')
            }
        } finally {
            setLoading(false)
        }
    }

    const getExamTerminationsList = async (examId) => {
        setTerminationsLoading(true)
        try {
            const body = {
                routeName: 'getExamTerminations',
                examId: examId,
                page: 1,
                limit: 100
            }
            const response = await getRouteAPI(body)

            // Handle the new backend response structure
            const responseData = response.data || JSON.parse(response.data)

            if (!response.success) {
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
            if (TESTING_MODE) {
                // Use mock data in testing mode
                const { mockTerminations } = generateMockData()
                const terminations = mockTerminations.map(termination => ({
                    ...termination,
                    key: termination.id,
                    studentId: termination.id,
                    examId: '2',
                    distractionEvents: []
                }))
                setExamTerminationsList(terminations)
                console.log('Using mock terminations data for testing')
            } else if (error?.response?.status === 401) {
                await getNewToken().then(async () => {
                    getExamTerminationsList()
                }).catch(error => {
                    console.error("Error:", error);
                });
            } else {
                const { message } = await import('antd');
                message.error('فشل في جلب سجلات انتهاء الاختبارات')
            }
        } finally {
            setTerminationsLoading(false)
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
            const response = await getRouteAPI(body)

            // Handle the new backend response structure
            const responseData = response.data || JSON.parse(response.data)

            if (!response.success) {
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
            const { message } = await import('antd');
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
            const { message } = await import('antd');
            message.success('تم حذف النتيجة بنجاح')
            getExamResultsList()
            setIsModelForDeleteItems(false)
        } catch (error) {
            const { message } = await import('antd');
            message.error('فشل في حذف النتيجة')
            console.error('Error deleting result:', error)
            if (!TESTING_MODE && error?.response?.status === 401) {
                await getNewToken().then(async () => {
                    handleDeleteConfirm()
                }).catch(error => {
                    console.error("Error:", error);
                });
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
            const { message } = await import('antd');
            message.success('تم حذف سجل الانتهاء بنجاح')
            getExamTerminationsList()
            setIsModelForDeleteItems(false)
        } catch (error) {
            const { message } = await import('antd');
            message.error('فشل في حذف سجل الانتهاء')
            console.error('Error deleting termination:', error)
            if (!TESTING_MODE && error?.response?.status === 401) {
                await getNewToken().then(async () => {
                    handleDeleteTerminationConfirm()
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        }
    }

    const handleCopyExam = (exam) => {
        setSelectedExamForAction(exam)
        setActionType('copy')
        setIsCopyExamModal(true)
    }

    const handleMoveExam = (exam) => {
        setSelectedExamForAction(exam)
        setActionType('move')
        setIsMoveExamModal(true)
    }

    const handleCopyConfirm = async (destinationFolderId, options) => {
        try {
            const res = await getAuthRouteAPI({
                routeName: 'copyExam',
                examId: selectedExamForAction._id,
                sourceFolderId: selectedFolder._id,
                destinationFolderId: destinationFolderId,
                keepOriginal: options.keepOriginal.toString(),
                copyResults: options.copyResults.toString()
            })
            const result = res?.data ?? {}

            if (result.success) {
                const { message } = await import('antd');
                message.success('تم نسخ الاختبار بنجاح')
                setIsCopyExamModal(false)
                setSelectedExamForAction(null)
                setActionType(null)

                // Refresh the current folder to show updated exam count
                fetchExamsInFolder(selectedFolder._id)
            } else {
                // Handle specific error codes
                let errorMessage = 'فشل في نسخ الاختبار'

                switch (result.errorCode) {
                    case 'VALIDATION_ERROR':
                        errorMessage = result.message || 'خطأ في التحقق من البيانات'
                        break
                    case 'PERMISSION_DENIED':
                        errorMessage = result.message || 'غير مصرح: لا تملك الصلاحيات المطلوبة'
                        break
                    case 'NOT_FOUND':
                        errorMessage = result.message || 'الاختبار أو المجلد غير موجود'
                        break
                    case 'BUSINESS_LOGIC_ERROR':
                        errorMessage = result.message || 'لا يمكن نسخ الاختبار إلى نفس المجلد'
                        break
                    default:
                        errorMessage = result.message || errorMessage
                }

                throw new Error(errorMessage)
            }
        } catch (error) {
            const { message } = await import('antd');
            const apiMsg = error?.response?.data?.message
            if (apiMsg) {
                message.error(apiMsg)
            } else if (error?.message) {
                message.error(error.message)
            } else {
                message.error('فشل في نسخ الاختبار')
            }
            console.error('Error copying exam:', error)
        }
    }

    const handleMoveConfirm = async (destinationFolderId) => {
        try {
            const res = await getAuthRouteAPI({
                routeName: 'moveExam',
                examId: selectedExamForAction._id,
                sourceFolderId: selectedFolder._id,
                destinationFolderId: destinationFolderId
            })
            const result = res?.data ?? {}

            if (result.success) {
                const { message } = await import('antd');
                message.success('تم نقل الاختبار بنجاح')
                setIsMoveExamModal(false)
                setSelectedExamForAction(null)
                setActionType(null)

                // Refresh both folders to show updated exam counts
                fetchExamsInFolder(selectedFolder._id)
                fetchSimulationExamFolders()
            } else {
                // Handle specific error codes
                let errorMessage = 'فشل في نقل الاختبار'

                switch (result.errorCode) {
                    case 'VALIDATION_ERROR':
                        errorMessage = result.message || 'خطأ في التحقق من البيانات'
                        break
                    case 'PERMISSION_DENIED':
                        errorMessage = result.message || 'غير مصرح: لا تملك الصلاحيات المطلوبة'
                        break
                    case 'NOT_FOUND':
                        errorMessage = result.message || 'الاختبار أو المجلد غير موجود'
                        break
                    case 'BUSINESS_LOGIC_ERROR':
                        errorMessage = result.message || 'لا يمكن نقل الاختبار إلى نفس المجلد'
                        break
                    default:
                        errorMessage = result.message || errorMessage
                }

                throw new Error(errorMessage)
            }
        } catch (error) {
            const { message } = await import('antd');
            const apiMsg = error?.response?.data?.message
            if (apiMsg) {
                message.error(apiMsg)
            } else if (error?.message) {
                message.error(error.message)
            } else {
                message.error('فشل في نقل الاختبار')
            }
            console.error('Error moving exam:', error)
        }
    }

    // Folder Management Functions
    const handleEditFolder = (folder) => {
        setSelectedFolderForAction(folder)
        setFolderFormData({
            name: folder.name || '',
            description: folder.description || '',
            isActive: folder.isActive !== false
        })
        setIsEditFolderModal(true)
    }

    const handleDeleteFolder = (folder) => {
        setSelectedFolderForAction(folder)
        setIsDeleteFolderModal(true)
    }

    const handleUpdateFolder = async (values) => {
        // values comes from the modal's validated Ant Design form:
        // { name, description, isActive }.
        const formValues = values && typeof values === 'object' ? values : folderFormData
        const name = (formValues?.name ?? '').toString().trim()

        if (!selectedFolderForAction?._id) return

        if (!name) {
            const { message } = await import('antd');
            message.error('يرجى إدخال اسم المجلد')
            return
        }

        setFolderActionLoading(true)
        try {
            const params = {
                routeName: 'updateMongoDBFolder',
                folderId: selectedFolderForAction._id,
                name,
            }
            if (formValues.description !== undefined && formValues.description !== null) {
                params.description = formValues.description
            }
            if (formValues.isActive !== undefined) {
                params.isActive = (formValues.isActive !== false).toString()
            }

            // getAuthRouteAPI concatenates values into the query string without
            // URL-encoding, so we encode here to survive Arabic chars and any
            // reserved characters (& = + #) the instructor may type.
            const encoded = Object.entries(params).reduce((acc, [k, v]) => {
                acc[k] = encodeURIComponent(v)
                return acc
            }, {})

            const res = await getAuthRouteAPI(encoded)
            const result = res?.data ?? {}

            if (result.success) {
                const { message } = await import('antd');
                message.success('تم تحديث المجلد بنجاح')
                setIsEditFolderModal(false)
                setSelectedFolderForAction(null)
                setFolderFormData({ name: '', description: '', isActive: true })
                fetchSimulationExamFolders()
            } else {
                let errorMessage = 'فشل في تحديث المجلد'
                switch (result.errorCode) {
                    case 'VALIDATION_ERROR':
                        errorMessage = result.message || 'خطأ في التحقق من البيانات'
                        break
                    case 'PERMISSION_DENIED':
                        errorMessage = result.message || 'غير مصرح: لا تملك المجلد'
                        break
                    case 'NOT_FOUND':
                        errorMessage = result.message || 'المجلد غير موجود'
                        break
                    default:
                        errorMessage = result.message || errorMessage
                }
                throw new Error(errorMessage)
            }
        } catch (error) {
            const { message } = await import('antd');
            const apiBody = error?.response?.data
            const apiMsg = apiBody?.message
            if (apiMsg) {
                message.error(apiMsg)
            } else if (error?.message) {
                message.error(error.message)
            } else {
                message.error('فشل في تحديث المجلد')
            }
            console.error('Error updating folder:', error)
        } finally {
            setFolderActionLoading(false)
        }
    }

    const handleDeleteFolderConfirm = async (forceDelete = false) => {
        const folderForAction = selectedFolderForAction
        if (!folderForAction?._id) return

        setFolderActionLoading(true)
        try {
            const res = await getAuthRouteAPI({
                routeName: 'deleteMongoDBFolder',
                folderId: folderForAction._id,
                forceDelete: forceDelete ? 'true' : 'false'
            })
            const result = res?.data ?? {}

            if (result.success) {
                const { message } = await import('antd');
                message.success('تم حذف المجلد بنجاح')
                setIsDeleteFolderModal(false)
                setSelectedFolderForAction(null)
                fetchSimulationExamFolders()
                if (selectedFolder && selectedFolder._id === folderForAction._id) {
                    handleBackToFolders()
                }
            } else {
                throw new Error(result.message || 'فشل في حذف المجلد')
            }
        } catch (error) {
            const { message } = await import('antd');
            const apiBody = error?.response?.data
            // FORCE_DELETE_REQUIRED comes back as a 409 (axios rejects) — backfill
            // the live examCount so the modal's "force delete" checkbox appears on
            // rerender for legacy folders whose listing-time examCount was stale
            // or missing. The instructor can then opt in and click delete again
            // without reopening anything.
            if (apiBody?.errorCode === 'FORCE_DELETE_REQUIRED') {
                if (typeof apiBody.examCount === 'number') {
                    setSelectedFolderForAction(prev => prev ? { ...prev, examCount: apiBody.examCount } : prev)
                }
                message.error(apiBody.message || 'المجلد يحتوي على اختبارات. ضع علامة على "حذف قسري" وأعد المحاولة.')
            } else if (apiBody?.message) {
                message.error(apiBody.message)
            } else if (error?.message) {
                message.error(error.message)
            } else {
                message.error('فشل في حذف المجلد')
            }
            console.error('Error deleting folder:', error)
        } finally {
            setFolderActionLoading(false)
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
        <div className='maxWidthDefault px-4' dir="rtl">
            {/* TEMPORARY: Testing Mode Banner */}
            {/* {TESTING_MODE && (
                <div style={{
                    background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
                }}>
                    🧪 وضع الاختبار - تم تعطيل المصادقة مؤقتاً للاختبار
                </div>
            )} */}
            <div className={styles.borderBottomNavbar}>
                <BackToPath
                    backpathForPage={true}
                    backPathArray={[
                        { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                        { lable: 'إدارة نتائج الاختبارات', link: null },
                    ]}
                />
            </div>
            <div className={styles.headerWrapper} style={{ marginBottom: 0 }}>
                <h1 className={`head2 py-8`}>إدارة نتائج الاختبارات</h1>
            </div>
            <div className={styles.bodysubWrapper}>
                {/* Stage 1: Only Folders */}
                {!selectedFolder && !selectedExam && (
                    <div style={{ width: '100%' }}>
                        <h3 className='mb-4' style={{ fontWeight: 700, fontSize: 20 }}>مجلدات الاختبارات المحاكية</h3>
                        {loadingFolders ? (
                            <Spinner />
                        ) : folderList.length === 0 ? (
                            <Empty emptyText={'لا توجد مجلدات اختبارات محاكية'} containerhight={200} />
                        ) : (
                            <table className={styles.tableArea} style={{ width: '100%' }}>
                                <thead className={styles.tableHeaderArea}>
                                    <tr>
                                        <th>اسم المجلد</th>
                                        <th>تاريخ الإنشاء</th>
                                        <th>تاريخ آخر تعديل</th>
                                        <th>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {folderList.map(folder => (
                                        <tr key={folder._id} className={styles.tableRow}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleFolderClick(folder)}>
                                                    <AllIconsComponenet iconName={'newFolderIcon'} height={24} width={24} color={BRAND_ORANGE} />
                                                    <span style={{ marginRight: 8 }}>{folder.name}</span>
                                                </div>
                                            </td>
                                            <td>{fullDate(folder.createdAt)}</td>
                                            <td>{fullDate(folder.updatedAt)}</td>
                                            <td>
                                                <div className={styles.folderActions}>
                                                    <Button
                                                        type="text"
                                                        icon={<AllIconsComponenet iconName={'editIcon'} height={16} width={16} color={'#3b82f6'} />}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleEditFolder(folder)
                                                        }}
                                                        title="تعديل المجلد"
                                                        className={styles.actionButton}
                                                    />
                                                    <Button
                                                        type="text"
                                                        icon={<AllIconsComponenet iconName={'deleteIcon'} height={16} width={16} color={'#ff4d4f'} />}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDeleteFolder(folder)
                                                        }}
                                                        title="حذف المجلد"
                                                        className={styles.actionButton}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
                {/* Stage 2: Only Exams in Folder */}
                {selectedFolder && !selectedExam && (
                    <div style={{ width: '100%' }}>
                        <div style={{ marginBottom: 12 }}>
                            <button
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: BRAND_ORANGE,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    fontSize: 16
                                }}
                                onClick={handleBackToFolders}
                            >
                                <ArrowRightOutlined style={{ marginLeft: 4, color: BRAND_ORANGE }} />
                                العودة إلى المجلدات
                            </button>
                        </div>
                        <h3 className='mb-4' style={{ fontWeight: 700, fontSize: 20 }}>اختبارات مجلد: <span style={{ color: BRAND_ORANGE }}>{selectedFolder.name}</span></h3>
                        {loadingExams ? (
                            <Spinner />
                        ) : examList.length === 0 ? (
                            <Empty emptyText={'لا توجد اختبارات في هذا المجلد'} containerhight={200} />
                        ) : (
                            <table className={styles.tableArea} style={{ width: '100%' }}>
                                <thead className={styles.tableHeaderArea}>
                                    <tr>
                                        <th>اسم الاختبار</th>
                                        <th>تاريخ الإنشاء</th>
                                        <th>تاريخ آخر تعديل</th>
                                        <th>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examList.map(exam => (
                                        <tr key={exam._id} className={styles.tableRow}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleExamClick(exam)}>
                                                    <AllIconsComponenet iconName={'quiz'} height={24} width={24} color={BRAND_ORANGE} />
                                                    <span style={{ marginRight: 8 }}>{exam.title || exam.name}</span>
                                                </div>
                                            </td>
                                            <td>{fullDate(exam.createdAt)}</td>
                                            <td>{fullDate(exam.updatedAt)}</td>
                                            <td>
                                                <div className={styles.examActions}>
                                                    <Button
                                                        type="text"
                                                        icon={<AllIconsComponenet iconName={'copyIcon'} height={16} width={16} color={'#3b82f6'} />}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleCopyExam(exam)
                                                        }}
                                                        title="نسخ الاختبار"
                                                        className={styles.actionButton}
                                                    />
                                                    <Button
                                                        type="text"
                                                        icon={<AllIconsComponenet iconName={'moveIcon'} height={16} width={16} color={'#8b5cf6'} />}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleMoveExam(exam)
                                                        }}
                                                        title="نقل الاختبار"
                                                        className={styles.actionButton}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
                {/* Stage 3: Only Results for Exam */}
                {selectedExam && (
                    <div style={{ width: '100%' }}>
                        <div style={{ marginBottom: 12 }}>
                            <button
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: BRAND_ORANGE,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    fontSize: 16
                                }}
                                onClick={handleBackToExams}
                            >
                                <ArrowRightOutlined style={{ marginLeft: 4, color: BRAND_ORANGE }} />
                                العودة إلى الاختبارات
                            </button>
                        </div>
                        <Tabs
                            className={styles.tabContainer}
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            tabBarGutter={32}
                            tabBarStyle={{
                                direction: 'rtl',
                                borderBottom: `2px solid ${BRAND_ORANGE}`,
                                marginBottom: 50,
                            }}
                            moreIcon={null}
                            items={[
                                {
                                    key: 'results',
                                    label: (
                                        <span
                                            style={{
                                                color: activeTab === 'results' ? BRAND_ORANGE : undefined,
                                                borderBottom: activeTab === 'results' ? `3px solid ${BRAND_ORANGE}` : 'none',
                                                padding: '0 8px',
                                                fontWeight: activeTab === 'results' ? 700 : 500,
                                                background: 'none',
                                                marginLeft: 16,
                                                marginRight: 16,
                                            }}
                                        >
                                            نتائج الاختبارات
                                            {examResultsList.length > 0 && (
                                                <span className={styles.customTabBadge}>
                                                    {examResultsList.length}
                                                </span>
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
                                                        style={{ width: 300, direction: 'rtl', textAlign: 'right' }}
                                                        onChange={(e) => handleSearch(e.target.value)}
                                                        allowClear
                                                    />
                                                </div>
                                            </div>
                                            <div className={styles.paginationWrapper}>
                                                <Table
                                                    columns={tableColumns}
                                                    dataSource={filteredResults}
                                                    loading={loading}
                                                    locale={{ emptyText: customEmptyComponent }}
                                                    pagination={{
                                                        current: currentPage,
                                                        pageSize: pageSize,
                                                        defaultPageSize: 10,
                                                        pageSizeOptions: ['10', '25', '50'],
                                                        total: totalResults,
                                                        showSizeChanger: true,
                                                        showQuickJumper: true,
                                                        showTotal: (total, range) => `${range[0]}-${range[1]} من ${total} نتيجة (صفحة ${currentPage} من ${totalPages})`,
                                                        onChange: (page, newPageSize) => {
                                                            setCurrentPage(page)
                                                            if (newPageSize !== pageSize) {
                                                                setPageSize(newPageSize)
                                                                setCurrentPage(1) // Reset to page 1 when changing page size
                                                            }
                                                        },
                                                        onShowSizeChange: (current, size) => {
                                                            setPageSize(size)
                                                            setCurrentPage(1) // Reset to page 1 when changing page size
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    key: 'terminations',
                                    label: (
                                        <span
                                            style={{
                                                color: activeTab === 'terminations' ? BRAND_ORANGE : undefined,
                                                borderBottom: activeTab === 'terminations' ? `3px solid ${BRAND_ORANGE}` : 'none',
                                                padding: '0 8px',
                                                fontWeight: activeTab === 'terminations' ? 700 : 500,
                                                background: 'none',
                                                marginLeft: 16,
                                                marginRight: 16,
                                            }}
                                        >
                                            سجلات انتهاء الاختبارات
                                            {examTerminationsList.length > 0 && (
                                                <span className={styles.customTabBadge}>
                                                    {examTerminationsList.length}
                                                </span>
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
                                                        style={{ width: 300, direction: 'rtl', textAlign: 'right' }}
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
                    </div>
                )}
            </div>

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

            {isCopyExamModal && (
                <ModelForCopyExam
                    isModelForCopyExam={isCopyExamModal}
                    setIsModelForCopyExam={setIsCopyExamModal}
                    selectedExamForAction={selectedExamForAction}
                    folderList={folderList}
                    onCopyConfirm={handleCopyConfirm}
                />
            )}

            {isMoveExamModal && (
                <ModelForMoveExam
                    isModelForMoveExam={isMoveExamModal}
                    setIsModelForMoveExam={setIsMoveExamModal}
                    selectedExamForAction={selectedExamForAction}
                    folderList={folderList}
                    onMoveConfirm={handleMoveConfirm}
                />
            )}

            {isEditFolderModal && (
                <ModelForEditFolder
                    isModelForEditFolder={isEditFolderModal}
                    setIsModelForEditFolder={setIsEditFolderModal}
                    selectedFolderForAction={selectedFolderForAction}
                    onUpdateConfirm={handleUpdateFolder}
                    loading={folderActionLoading}
                />
            )}

            {isDeleteFolderModal && (
                <ModelForDeleteFolder
                    isModelForDeleteFolder={isDeleteFolderModal}
                    setIsModelForDeleteFolder={setIsDeleteFolderModal}
                    selectedFolderForAction={selectedFolderForAction}
                    onDeleteConfirm={handleDeleteFolderConfirm}
                    loading={folderActionLoading}
                />
            )}
        </div>
    )
}

export default Index 