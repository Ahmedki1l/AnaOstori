import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import styles from './ModelForAddQuestion.module.scss';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import { postRouteAPI } from '../../services/apisService';
import { getNewToken } from '../../services/fireBaseAuthService';
import { questionsConst } from '../../constants/adminPanelConst/questionsBank/questionsConst';
import { toast } from 'react-toastify';

const ModelForAddQuestion = ({
    isModelForAddQuestionOpen,
    selectedQuestion,
    selectedFolder,
    getQuestionsList,
    onCloseModal,
    existingItemName = []
}) => {
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('multipleChoice');
    const [options, setOptions] = useState([
        { id: 'أ', text: '' },
        { id: 'ب', text: '' },
        { id: 'ج', text: '' },
        { id: 'د', text: '' }
    ]);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [contextType, setContextType] = useState('');
    const [contextDescription, setContextDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const { questionToastMsgConst } = questionsConst;

    useEffect(() => {
        if (selectedQuestion) {
            setQuestionText(selectedQuestion.text || '');
            setQuestionType(selectedQuestion.questionType || 'multipleChoice');

            if (selectedQuestion.options && selectedQuestion.options.length > 0) {
                setOptions(selectedQuestion.options);
            }

            setCorrectAnswer(selectedQuestion.correctAnswer || '');
            setContextType(selectedQuestion.contextType || '');
            setContextDescription(selectedQuestion.contextDescription || '');

            // If there's an image, set the preview
            if (selectedQuestion.imageUrl) {
                setImagePreview(selectedQuestion.imageUrl);
            }
        }
    }, [selectedQuestion]);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        if (!questionText.trim()) {
            setFormError('يرجى إدخال نص السؤال');
            return false;
        }

        if (questionType === 'multipleChoice') {
            // Check if all options have content
            const emptyOptions = options.filter(option => !option.text.trim());
            if (emptyOptions.length > 0) {
                setFormError('يرجى إدخال جميع الخيارات');
                return false;
            }

            // Check if a correct answer is selected
            if (!correctAnswer) {
                setFormError('يرجى تحديد الإجابة الصحيحة');
                return false;
            }
        }

        setFormError('');
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            // Prepare the question data
            const questionData = {
                text: questionText,
                questionType: questionType,
                options: questionType === 'multipleChoice' ? options : [],
                correctAnswer: correctAnswer,
                contextType: contextType,
                contextDescription: contextDescription,
                folderId: selectedFolder?.id
            };

            // If editing an existing question
            if (selectedQuestion) {
                questionData.id = selectedQuestion.id;

                const updateParams = {
                    routeName: 'updateQuestionHandler',
                    ...questionData
                };

                await postRouteAPI(updateParams).then((res) => {
                    toast.success(questionToastMsgConst.updateQuestionSuccessMsg, { rtl: true });
                    getQuestionsList(selectedFolder.id);
                    onCloseModal();
                }).catch(async (error) => {
                    if (error?.response?.status === 401) {
                        await getNewToken().then(async () => {
                            await postRouteAPI(updateParams).then(() => {
                                toast.success(questionToastMsgConst.updateQuestionSuccessMsg, { rtl: true });
                                getQuestionsList(selectedFolder.id);
                                onCloseModal();
                            });
                        });
                    } else {
                        toast.error('حدث خطأ أثناء تحديث السؤال', { rtl: true });
                    }
                });
            } else {
                // Creating a new question
                const createParams = {
                    routeName: 'createQuestionHandler',
                    ...questionData
                };

                await postRouteAPI(createParams).then((res) => {
                    toast.success(questionToastMsgConst.addQuestionSuccessMsg, { rtl: true });
                    getQuestionsList(selectedFolder.id);
                    onCloseModal();
                }).catch(async (error) => {
                    if (error?.response?.status === 401) {
                        await getNewToken().then(async () => {
                            await postRouteAPI(createParams).then(() => {
                                toast.success(questionToastMsgConst.addQuestionSuccessMsg, { rtl: true });
                                getQuestionsList(selectedFolder.id);
                                onCloseModal();
                            });
                        });
                    } else {
                        toast.error('حدث خطأ أثناء إضافة السؤال', { rtl: true });
                    }
                });
            }
        } catch (error) {
            console.error("Error submitting question:", error);
            toast.error('حدث خطأ أثناء معالجة السؤال', { rtl: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={isModelForAddQuestionOpen} as={Fragment}>
            <Dialog as="div" className={styles.dialog} onClose={onCloseModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className={styles.backdrop} />
                </Transition.Child>

                <div className={styles.container}>
                    <div className={styles.dialogContainer}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={styles.dialogPanel}>
                                <div className={styles.header}>
                                    <Dialog.Title as="h3" className={styles.title}>
                                        {selectedQuestion ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className={styles.closeButton}
                                        onClick={onCloseModal}
                                    >
                                        <AllIconsComponenet iconName={'closeicon'} height={24} width={24} />
                                    </button>
                                </div>

                                <div className={styles.content}>
                                    {formError && (
                                        <div className={styles.errorMessage}>
                                            {formError}
                                        </div>
                                    )}

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>نوع السؤال</label>
                                        <select
                                            className={styles.select}
                                            value={questionType}
                                            onChange={(e) => setQuestionType(e.target.value)}
                                        >
                                            <option value="multipleChoice">متعدد الخيارات</option>
                                            <option value="contextual">سياقي</option>
                                            <option value="numerical">عددي</option>
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>نص السؤال</label>
                                        <textarea
                                            className={styles.textarea}
                                            value={questionText}
                                            onChange={(e) => setQuestionText(e.target.value)}
                                            placeholder="أدخل نص السؤال هنا"
                                            rows={3}
                                        />
                                    </div>

                                    {questionType === 'contextual' && (
                                        <>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>نوع السياق</label>
                                                <input
                                                    type="text"
                                                    className={styles.input}
                                                    value={contextType}
                                                    onChange={(e) => setContextType(e.target.value)}
                                                    placeholder="مثال: الخطأ السياقي"
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.label}>وصف السياق</label>
                                                <textarea
                                                    className={styles.textarea}
                                                    value={contextDescription}
                                                    onChange={(e) => setContextDescription(e.target.value)}
                                                    placeholder="أدخل وصف السياق هنا"
                                                    rows={3}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {questionType === 'multipleChoice' && (
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>الخيارات</label>
                                            {options.map((option, index) => (
                                                <div key={option.id} className={styles.optionRow}>
                                                    <div className={styles.optionLabel}>{option.id}</div>
                                                    <input
                                                        type="text"
                                                        className={styles.input}
                                                        value={option.text}
                                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                                        placeholder={`الخيار ${option.id}`}
                                                    />
                                                    <div className={styles.optionRadio}>
                                                        <input
                                                            type="radio"
                                                            id={`correct-${option.id}`}
                                                            name="correctAnswer"
                                                            checked={correctAnswer === option.id}
                                                            onChange={() => setCorrectAnswer(option.id)}
                                                        />
                                                        <label htmlFor={`correct-${option.id}`}>الإجابة الصحيحة</label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>إضافة صورة (اختياري)</label>
                                        <div className={styles.imageUpload}>
                                            <input
                                                type="file"
                                                id="question-image"
                                                className={styles.fileInput}
                                                onChange={handleImageChange}
                                                accept="image/*"
                                            />
                                            <label htmlFor="question-image" className={styles.fileLabel}>
                                                <AllIconsComponenet iconName={'uploadFile'} height={24} width={24} />
                                                <span>اختر صورة</span>
                                            </label>
                                            {imagePreview && (
                                                <div className={styles.imagePreview}>
                                                    <img src={imagePreview} alt="Preview" />
                                                    <button
                                                        type="button"
                                                        className={styles.removeImage}
                                                        onClick={() => {
                                                            setImageFile(null);
                                                            setImagePreview('');
                                                        }}
                                                    >
                                                        <AllIconsComponenet iconName={'closeicon'} height={16} width={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
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
                                        ) : selectedQuestion ? (
                                            'حفظ التغييرات'
                                        ) : (
                                            'إضافة'
                                        )}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ModelForAddQuestion;