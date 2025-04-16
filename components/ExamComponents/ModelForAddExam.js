import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getAuthRouteAPI, getRouteAPI, postAuthRouteAPI } from '../../services/apisService';
import ModelForAddQuestion from './ModelForAddQuestion'; // reused for new question creation with folder functionality
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import { postRouteAPI } from '../../services/apisService';
import { getNewToken } from '../../services/fireBaseAuthService';
import { toast } from 'react-toastify';
import { uploadFileSevices } from '../../services/UploadFileSevices';
import styles from './ModelForAddExam.module.scss';

const ModelForAddExam = ({
    isModelForAddExamOpen,
    selectedExam,            // if editing an exam, pass it here
    selectedFolder,          // exam folder reference (if applicable)
    getExamsList,            // callback to refresh exams list
    onCloseModal,
    existingExamNames = [],
    existingQuestions = []   // available questions (object with at least { id, text })
}) => {
    // Exam details
    const [examTitle, setExamTitle] = useState('');
    const [examInstructions, setExamInstructions] = useState('');
    const [examDuration, setExamDuration] = useState('');
    const [examDate, setExamDate] = useState('');
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState('');
    // Add exam type state
    const [examType, setExamType] = useState('');

    // Manage exam questions (to be arranged)
    const [examQuestions, setExamQuestions] = useState([]);
    const [folders, setFolders] = useState([]);

    // Loading and error state
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');

    // Sub-modal state for creating a new question in exam context
    const [isAddQuestionSubModalOpen, setIsAddQuestionSubModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const { examToastMsgConst } = {
        examToastMsgConst: {
            addExamSuccessMsg: "تم إضافة الامتحان بنجاح",
            updateExamSuccessMsg: "تم تحديث الامتحان بنجاح"
        }
    };

    // If editing, prefill fields and selected exam questions
    useEffect(() => {
        if (selectedExam) {
            setExamTitle(selectedExam.title || '');
            setExamInstructions(selectedExam.instructions || '');
            setExamDuration(selectedExam.duration || '');
            setExamDate(selectedExam.date || '');
            if (selectedExam.coverImage) {
                setCoverImagePreview(selectedExam.coverImage);
            }
            if (selectedExam.questions) {
                setExamQuestions(selectedExam.questions);
            }
        } else {
            setExamTitle('');
            setExamInstructions('');
            setExamDuration('');
            setExamDate('');
            setCoverImageFile(null);
            setCoverImagePreview('');
            setExamQuestions([]);
        }
    }, [selectedExam]);

    const validateForm = () => {
        if (!examTitle.trim()) {
            setFormError('يرجى إدخال عنوان الامتحان');
            return false;
        }
        setFormError('');
        return true;
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setCoverImagePreview(previewUrl);
        }
    };

    // Add an existing question (from available list) to the exam
    const addExistingQuestion = (question) => {
        const exists = examQuestions.find(q => q.id === question.id);
        if (!exists) {
            setExamQuestions([...examQuestions, question]);
            toast.success("تمت إضافة السؤال");
        } else {
            toast.info("هذا السؤال مُضاف مسبقاً");
        }
    };

    // Remove a question from the exam list using its ID
    const removeExamQuestion = (questionId) => {
        setExamQuestions(examQuestions.filter(q => q.id !== questionId));
        toast.info("تم إزالة السؤال من الامتحان");
    };
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageInput, setPageInput] = useState(1);
    const [itemsPerPage] = useState(10);
    const [questions, setQuestions] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState('all');    
    // Function to fetch questions from API
    const fetchQuestions = async (page = 1) => {
        setLoading(true);
        try {
            const payload = {
                routeName: 'getItems',
                page,
                limit: itemsPerPage,
                type: 'questions'
            }

            if(selectedFolderId !== 'all') {
                payload.folderId = selectedFolderId;
            }

            const response = await getRouteAPI(payload);

            if (response?.data) {
                setQuestions(response.data.data);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            if (error?.response?.status === 401) {
                await getNewToken();
                const response = await getRouteAPI({
                    routeName: 'getItem',
                    page,
                    limit: itemsPerPage,
                    type: 'questions'
                });

                if (response?.data) {
                    setQuestions(response.data.data);
                    setTotalPages(response.data.totalPages);
                }
            } else {
                toast.error('حدث خطأ أثناء جلب الأسئلة');
            }
        }
        setLoading(false);
    };

    // Effect to fetch questions on page change
    useEffect(() => {
        fetchQuestions(currentPage);
    }, [currentPage, selectedFolderId]);

    const getfolderList = async () => {
        setFolders([])
        setLoading(true)
        let data = {
            routeName: 'getFolderByType',
            type: "simulationExam"
        }

        await getAuthRouteAPI(data).then((res) => {
            setFolders(res.data.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)));
            setLoading(false)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getAuthRouteAPI(data).then(res => {
                        setFolders(res.data.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)));
                        setLoading(false)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
            setLoading(false)
        })
    }

    useEffect(() => {
        getfolderList();
    }, [])

    // Handle drag and drop reordering of exam questions
    const onDragEnd = (result) => {
        if (!result.destination) return;
        const newOrder = Array.from(examQuestions);
        const [removed] = newOrder.splice(result.source.index, 1);
        newOrder.splice(result.destination.index, 0, removed);
        setExamQuestions(newOrder);
    };

    // Callback when a new question is successfully created in the sub-modal
    const handleNewQuestionCreated = (newQuestion) => {
        // Add the new question directly to the exam question list
        setExamQuestions([...examQuestions, newQuestion]);
        setIsAddQuestionSubModalOpen(false);
    };

    // Submission handler to prepare payload and post data
    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);

        let coverImageUrl = coverImagePreview;
        if (coverImageFile) {
            try {
                coverImageUrl = await uploadFileSevices(coverImageFile, () => { }, null, "exams");
            } catch (error) {
                toast.error("فشل تحميل صورة الغلاف");
                setLoading(false);
                return;
            }
        }

        const examData = {
            title: examTitle,
            instructions: examInstructions,
            duration: examDuration,
            // date: examDate,
            coverImage: coverImageUrl,
            folderId: selectedFolder?._id,
            questions: examQuestions.map(q => q.id),
            examType: examType,
            type: "simulationExam"
        };

        let routeName = 'createItem';
        if (selectedExam) {
            routeName = 'updateItemHandler';
            examData.id = selectedExam._id;
        }

        const dataPayload = { routeName, ...examData };
        try {
            await postRouteAPI(dataPayload).then(() => {
                toast.success(
                    selectedExam ? examToastMsgConst.updateExamSuccessMsg : examToastMsgConst.addExamSuccessMsg,
                    { rtl: true }
                );
                getExamsList(selectedFolder?._id, "simulationExam");
                onCloseModal();
            });
        } catch (error) {
            if (error?.response?.status === 401) {
                await getNewToken();
                await postRouteAPI(dataPayload).then(() => {
                    toast.success(
                        selectedExam ? examToastMsgConst.updateExamSuccessMsg : examToastMsgConst.addExamSuccessMsg,
                        { rtl: true }
                    );
                    getExamsList(selectedFolder?._id, "simulationExam");
                    onCloseModal();
                });
            } else {
                toast.error(
                    selectedExam ? 'حدث خطأ أثناء تحديث الامتحان' : 'حدث خطأ أثناء إضافة الامتحان',
                    { rtl: true }
                );
            }
        }
        setLoading(false);
    };

    return (
        <Modal
            open={isModelForAddExamOpen}
            onCancel={onCloseModal}
            footer={null}
            closeIcon={null}
            width={1000}
        >
            <div className={styles.dialogContainer}>
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        {selectedExam ? 'تعديل الامتحان' : 'إضافة امتحان جديد'}
                    </h3>
                    <button type="button" className={styles.closeButton} onClick={onCloseModal}>
                        <AllIconsComponenet iconName={'closeicon'} height={24} width={24} />
                    </button>
                </div>
                <div className={styles.content}>
                    {formError && <div className={styles.errorMessage}>{formError}</div>}
                    {/* Exam Details */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>عنوان الامتحان</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={examTitle}
                            onChange={(e) => setExamTitle(e.target.value)}
                            placeholder="أدخل عنوان الامتحان هنا"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>تعليمات الامتحان</label>
                        <textarea
                            className={styles.textarea}
                            value={examInstructions}
                            onChange={(e) => setExamInstructions(e.target.value)}
                            placeholder="أدخل تعليمات الامتحان هنا"
                            rows={3}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>مدة الامتحان</label>
                        <input
                            type="number"
                            className={styles.input}
                            value={examDuration}
                            onChange={(e) => setExamDuration(e.target.value)}
                            placeholder="مثال: 90 دقيقة"
                        />
                    </div>
                    {/* <div className={styles.formGroup}>
                        <label className={styles.label}>تاريخ الامتحان</label>
                        <input
                            type="date"
                            className={styles.input}
                            value={examDate}
                            onChange={(e) => setExamDate(e.target.value)}
                        />
                    </div> */}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>نوع الامتحان</label>
                        <select
                            className={styles.input}
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                        >
                            <option value="">اختر نوع الامتحان</option>
                            <option value="simulationExam">امتحان محاكاة</option>
                            <option value="practiceExam">امتحان تدريبي</option>
                            <option value="finalExam">امتحان نهائي</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>صورة الغلاف (اختياري)</label>
                        <div className={styles.imageUpload}>
                            <input
                                type="file"
                                id="exam-cover-image"
                                className={styles.fileInput}
                                onChange={handleCoverImageChange}
                                accept="image/*"
                            />
                            <label htmlFor="exam-cover-image" className={styles.fileLabel}>
                                <AllIconsComponenet iconName={'uploadFile'} height={24} width={24} />
                                <span>اختر صورة الغلاف</span>
                            </label>
                            {coverImagePreview && (
                                <div className={styles.imagePreviewContainer}>
                                    <div className={styles.imagePreview}>
                                        <img src={coverImagePreview} alt="Preview" />
                                        <button
                                            type="button"
                                            className={styles.removeImage}
                                            onClick={() => {
                                                setCoverImageFile(null);
                                                setCoverImagePreview('');
                                            }}
                                        >
                                            &#x2715;
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Exam Questions Section */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>أسئلة الامتحان</label>
                        {/* Available Questions List */}
                        <div className={styles.availableQuestionsContainer}>
                            <h4 className={styles.subTitle}>اختر من الأسئلة الموجودة</h4>

                            {/* Search and Filter Section */}
                            <div className={styles.searchFilterContainer}>
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder="ابحث عن سؤال بالعنوان..."
                                    onChange={(e) => {
                                        // Add search logic here
                                    }}
                                />
                                <select
                                    className={styles.folderSelect}
                                    value={selectedFolderId}
                                    onChange={(e) => {
                                        // Add folder filter logic here
                                        const folderId = e.target.value;
                                        setSelectedFolderId(folderId);
                                    }}
                                >
                                    <option value='all'>كل المجلدات</option>
                                    {folders.map(folder => (
                                        <option key={folder._id} value={folder._id}>
                                            {folder.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {existingQuestions.length > 0 ? (
                                <>
                                    <ul className={styles.availableQuestions}>
                                        {existingQuestions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((question) => (
                                            <li key={question.id} className={styles.questionItem}>
                                                <span>{question.text}</span>
                                                <button
                                                    className={styles.addButton}
                                                    onClick={() => addExistingQuestion(question)}
                                                >
                                                    إضافة
                                                </button>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className={styles.pagination}>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            السابق
                                        </button>

                                        <div className={styles.pageNumbers}>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={currentPage === pageNum ? styles.activePage : ''}
                                                >
                                                    {pageNum}
                                                </button>
                                            ))}
                                        </div>

                                        <div className={styles.pageJump}>
                                            <input
                                                type="number"
                                                min={1}
                                                max={totalPages}
                                                value={pageInput}
                                                onChange={(e) => setPageInput(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const page = parseInt(pageInput);
                                                        if (page >= 1 && page <= totalPages) {
                                                            setCurrentPage(page);
                                                        }
                                                    }
                                                }}
                                            />
                                            <span>من {totalPages}</span>
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            التالي
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p className={styles.noQuestionsText}>لا توجد أسئلة متوفرة</p>
                            )}

                            <button
                                className={styles.createQuestionButton}
                                onClick={() => {
                                    setEditingQuestion(null);
                                    setIsAddQuestionSubModalOpen(true);
                                }}
                            >
                                إنشاء سؤال جديد
                            </button>
                        </div>                        {examQuestions.length > 0 && (
                            <div className={styles.selectedQuestionsSection}>
                                <h4 className={styles.subTitle}>الأسئلة المحددة (اسحب لترتيبها)</h4>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="examQuestions">
                                        {(provided) => (
                                            <ul
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={styles.examQuestionsList}
                                            >
                                                {examQuestions.map((question, index) => (
                                                    <Draggable key={question.id} draggableId={question.id} index={index}>
                                                        {(provided) => (
                                                            <li
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={styles.examQuestionItem}
                                                            >
                                                                <span>{question.text}</span>
                                                                <button
                                                                    className={styles.removeQuestionButton}
                                                                    onClick={() => removeExamQuestion(question.id)}
                                                                >
                                                                    <AllIconsComponenet iconName={'cross'} height={16} width={16} />
                                                                </button>
                                                            </li>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </ul>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCloseModal}
                        disabled={loading}
                    >
                        إلغاء
                    </button>
                    <button
                        type="button"
                        className={styles.saveButton}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className={styles.loading}>جاري المعالجة...</span>
                        ) : selectedExam ? (
                            'حفظ التغييرات'
                        ) : (
                            'إضافة'
                        )}
                    </button>
                </div>
            </div>
            {/* New Question Sub-Modal */}
            {isAddQuestionSubModalOpen && (
                <ModelForAddQuestion
                    isModelForAddQuestionOpen={isAddQuestionSubModalOpen}
                    selectedQuestion={editingQuestion}
                    selectedFolder={selectedFolder}
                    getQuestionsList={() => { }}
                    onCloseModal={() => setIsAddQuestionSubModalOpen(false)}
                    existingItemName={existingQuestions.map(q => q.text)}
                    onSaveNewQuestion={handleNewQuestionCreated}
                />
            )}
        </Modal>
    );
};

export default ModelForAddExam;
