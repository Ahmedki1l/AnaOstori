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
import { duration } from '@mui/material';

// Helper function to compute visible pages (max 15)
const getVisiblePages = (currentPage, totalPages, maxVisible = 15) => {
    const pages = [];
    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        const half = Math.floor(maxVisible / 2);
        let start = currentPage - half;
        let end = currentPage + half;
        if (start < 1) {
            start = 1;
            end = maxVisible;
        }
        if (end > totalPages) {
            end = totalPages;
            start = totalPages - maxVisible + 1;
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
    }
    return pages;
};

/**
 * Generate a random alphanumeric string.
 * @param {number} length — desired length of the ID (default 8).
 * @returns {string}
 */
const generateId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

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
    const [sections, setSections] = useState(() => {
        if (selectedExam?.sections) {
            // If editing, prefill from the existing exam
            return selectedExam.sections.map(sec => ({
                id: generateId(10),
                title: sec.title,
                duration: sec.duration,
                expanded: true,
                questions: []  // we’ll fetch the full question objects in useEffect
            }));
        }

        // New exam: start with one empty section
        return [{
            id: generateId(10),
            title: 'القسم الأول',
            duration: 5,
            expanded: true,
            questions: []
        }];
    });

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

    // Add this function to fetch questions by their IDs
    const fetchQuestionsByIds = async (questionIds) => {
        if (!questionIds || questionIds.length === 0) return [];
        const payload = {
            routeName: 'getItem',
            type: 'questions',
            page: 1,
            limit: itemsPerPage,
            ids: questionIds
        };
        try {
            const response = await getRouteAPI(payload);
            if (response?.data) {
                return response.data.data;
            }
        } catch (error) {
            if (error?.response?.status === 401) {
                await getNewToken();
                const response = await getRouteAPI(payload);
                if (response?.data) {
                    return response.data.data;
                }
            } else {
                toast.error('حدث خطأ أثناء جلب الأسئلة');
                console.log(error);
            }
        }
        return [];
    };

    // If editing, prefill fields and selected exam questions
    useEffect(() => {
        if (selectedExam) {
            console.log("🚀 ~ useEffect ~ selectedExam:", selectedExam);
            setExamTitle(selectedExam.title || '');
            setExamInstructions(selectedExam.instructions || '');
            setExamDuration(selectedExam.duration || '');
            setExamDate(selectedExam.date || '');
            if (selectedExam.coverImage) {
                setCoverImagePreview(selectedExam.coverImage);
            }

            Promise.all(
                selectedExam.sections.map(async (sec) => {
                    const fetched = await fetchQuestionsByIds(sec.questions);
                    return {
                        id: uuid(),
                        title: sec.title,
                        expanded: true,
                        questions: fetched
                    };
                })
            ).then(prefilled => setSections(prefilled));

            if (selectedExam.type) {
                setExamType(selectedExam.type);
            }
        } else {
            setExamTitle('');
            setExamInstructions('');
            setExamDuration('');
            setExamDate('');
            setCoverImageFile(null);
            setCoverImagePreview('');
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
        const exists = examQuestions.find(q => q._id === question._id);
        if (!exists) {
            toast.success("تمت إضافة السؤال");
        } else {
            toast.info("هذا السؤال مُضاف مسبقاً");
        }
    };

    // Remove a question from the exam list using its ID
    const removeExamQuestion = (questionId) => {
        toast.info("تم إزالة السؤال من الامتحان");
    };

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageInput, setPageInput] = useState(1);
    const [itemsPerPage] = useState(10);
    const [questions, setQuestions] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Function to fetch questions from API
    const fetchQuestions = async (page = 1, searchQuery = null) => {
        setLoading(true);
        const payload = {
            routeName: 'getItem',
            page,
            limit: itemsPerPage,
            type: 'questions',
            isForExams: true
        };

        if (selectedFolderId !== 'all') {
            payload.folderId = selectedFolderId;
        }

        if (searchQuery) {
            payload.search = searchQuery;
        }

        try {
            const response = await getRouteAPI(payload);
            if (response?.data) {
                setQuestions(response.data.data);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            if (error?.response?.status === 401) {
                await getNewToken();
                const response = await getRouteAPI(payload);
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

    // Effect to fetch questions on page change or folder filter change
    useEffect(() => {
        setPageInput(currentPage);
        fetchQuestions(currentPage);
    }, [currentPage, selectedFolderId]);

    const getfolderList = async () => {
        setFolders([]);
        setLoading(true);
        let data = {
            routeName: 'getFolderByType',
            type: "questions"
        };

        await getAuthRouteAPI(data).then((res) => {
            setFolders(res.data.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)));
            setLoading(false);
        }).catch(async (error) => {
            if (error?.response?.status === 401) {
                await getNewToken().then(async () => {
                    await getAuthRouteAPI(data).then(res => {
                        setFolders(res.data.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)));
                        setLoading(false);
                    });
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
            setLoading(false);
        });
    };

    useEffect(() => {
        getfolderList();
    }, []);

    useEffect(() => {
        console.log("🚀 ~ questions:", questions);
    }, [questions]);

    // Handle drag and drop reordering of exam questions
    const onDragEnd = (result) => {
        if (!result.destination) return;
        const newOrder = Array.from(examQuestions);
        const [removed] = newOrder.splice(result.source.index, 1);
        newOrder.splice(result.destination.index, 0, removed);
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
            sections: sections.map(sec => ({
                title: sec.title,
                duration: sec.duration,
                questions: sec.questions.map(q => q._id)
            })),
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
                getExamsList(selectedFolder?._id);
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
                    getExamsList(selectedFolder?._id);
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

    // Toggle expand/collapse
    function toggleExpand(idx) {
        const s = [...sections];
        s[idx].expanded = !s[idx].expanded;
        setSections(s);
    }

    // Add a fresh section
    function addSection() {
        setSections([
            ...sections,
            { id: generateId(10), title: `Section ${sections.length + 1}`, duration: 5, expanded: true, questions: [] }
        ]);
    }

    // Remove section
    function removeSection(idx) {
        setSections(sections.filter((_, i) => i !== idx));
    }

    // Add existing question object q to section idx
    function addToSection(idx, q) {
        const s = [...sections];
        if (!s[idx].questions.find(x => x._id === q._id)) {
            s[idx].questions.push(q);
            setSections(s);
        }
    }

    // Remove by questionId
    function removeFromSection(idx, questionId) {
        const s = [...sections];
        s[idx].questions = s[idx].questions.filter(q => q._id !== questionId);
        setSections(s);
    }

    // Handle reordering in one section
    function reorderInSection(idx, result) {
        if (!result.destination) return;
        const s = [...sections];
        const list = Array.from(s[idx].questions);
        const [moved] = list.splice(result.source.index, 1);
        list.splice(result.destination.index, 0, moved);
        s[idx].questions = list;
        setSections(s);
    }

    // When clicking “New Question” inside a section
    function openNewQuestionModal(idx) {
        setEditingQuestion({ forSection: idx });
        setIsAddQuestionSubModalOpen(true);
    }

    // After new question created:
    function handleNewQuestionCreated(newQ) {
        const s = [...sections];
        s[editingQuestion.forSection].questions.push(newQ);
        setSections(s);
        setIsAddQuestionSubModalOpen(false);
    }


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

                    <div className={styles.sectionsContainer}>

                        {sections.map((sec, idx) => (
                            <div key={sec.id} className={styles.section}>

                                {/* Section Header */}
                                <div className={styles.sectionHeader}>
                                    <div className={styles.sectionDivHeaders}>
                                        <h3>
                                            عنوان القسم
                                        </h3>
                                        <input
                                            type="text"
                                            value={sec.title}
                                            onChange={e => {
                                                const newSecs = [...sections];
                                                newSecs[idx].title = e.target.value;
                                                setSections(newSecs);
                                            }}
                                            className={styles.sectionTitleInput}
                                        />
                                    </div>

                                    <div className={styles.sectionDivHeaders}>
                                        <h3>
                                            المدة الزمنية
                                        </h3>
                                        <input
                                            type="number"
                                            value={sec.duration}
                                            onChange={e => {
                                                const newSecs = [...sections];
                                                newSecs[idx].duration = e.target.value;
                                                setSections(newSecs);
                                            }}
                                            className={styles.sectionDurationInput}
                                        />
                                    </div>


                                    <button
                                        className={`${styles.toggleButton} ${sec.expanded ? styles.expanded : ''}`}
                                        onClick={() => toggleExpand(idx)}
                                    />
                                    <button
                                        className={styles.removeSectionButton}
                                        onClick={() => removeSection(idx)}
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Section Body */}
                                {sec.expanded && (
                                    <div className={styles.sectionBody}>

                                        {/* — Drag & Drop for questions within this section — */}
                                        <DragDropContext onDragEnd={result => reorderInSection(idx, result)}>
                                            <Droppable droppableId={sec.id}>
                                                {provided => (
                                                    <ul ref={provided.innerRef} {...provided.droppableProps}>
                                                        {sec.questions.map((q, qIdx) => (
                                                            <Draggable key={q._id} draggableId={q._id} index={qIdx}>
                                                                {prov => (
                                                                    <li
                                                                        ref={prov.innerRef}
                                                                        {...prov.draggableProps}
                                                                        {...prov.dragHandleProps}
                                                                        className={styles.questionItem}
                                                                    >
                                                                        {q.text}
                                                                        <button
                                                                            className={styles.removeQuestionButton}
                                                                            onClick={() => removeFromSection(idx, q._id)}
                                                                        >
                                                                            –
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
                                                        defaultValue={searchQuery}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                setSearchQuery(e.target.value);
                                                                fetchQuestions(1, e.target.value);
                                                            }
                                                        }}
                                                        onBlur={(e) => {
                                                            setSearchQuery(e.target.value);
                                                            fetchQuestions(1, e.target.value);
                                                        }}
                                                    />
                                                    <select
                                                        className={styles.folderSelect}
                                                        value={selectedFolderId}
                                                        onChange={(e) => {
                                                            const folderId = e.target.value;
                                                            setSelectedFolderId(folderId);
                                                        }}
                                                    >
                                                        <option value="all">كل المجلدات</option>
                                                        {folders.map(folder => (
                                                            <option key={folder._id} value={folder._id}>
                                                                {folder.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {questions.length > 0 ? (
                                                    <>
                                                        <ul className={styles.availableQuestions}>
                                                            {questions.map((question) => (
                                                                <li key={question.id} className={styles.questionItem}>
                                                                    <span>{question.text}</span>
                                                                    <button
                                                                        className={styles.addButton}
                                                                        onClick={() => addToSection(idx, question)}
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
                                                                {getVisiblePages(currentPage, totalPages).map(pageNum => (
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
                                                                            const page = parseInt(pageInput, 10);
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
                                            </div>

                                        </div>



                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add another empty section */}
                        <button onClick={addSection} className={styles.addSectionBtn}>
                            + إضافة قسم
                        </button>
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