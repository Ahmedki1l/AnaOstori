import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
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
        { id: 'أ', text: '', images: [] },
        { id: 'ب', text: '', images: [] },
        { id: 'ج', text: '', images: [] },
        { id: 'د', text: '', images: [] }
    ]);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [contextType, setContextType] = useState('');
    const [contextDescription, setContextDescription] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
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
            if (selectedQuestion.imageUrl) {
                setImagePreview(selectedQuestion.imageUrl);
            }
        } else {
            // Reset state when there's no selected question (i.e. new question)
            setQuestionText('');
            setQuestionType('multipleChoice');
            setOptions([
                { id: 'أ', text: '', images: [] },
                { id: 'ب', text: '', images: [] },
                { id: 'ج', text: '', images: [] },
                { id: 'د', text: '', images: [] }
            ]);
            setCorrectAnswer('');
            setContextType('');
            setContextDescription('');
            setImageFiles([]);
            setImagePreviews([]);
        }
    }, [selectedQuestion]);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    const validateForm = () => {
        if (!questionText.trim()) {
            setFormError('يرجى إدخال نص السؤال');
            return false;
        }
        if (questionType === 'multipleChoice') {
            const emptyOptions = options.filter(option => !option.text.trim());
            if (emptyOptions.length > 0) {
                setFormError('يرجى إدخال جميع الخيارات');
                return false;
            }
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

        // Prepare the question data payload
        const questionData = {
            text: questionText,
            questionType: questionType,
            context: contextType,
            contextDescription: contextDescription,
            questionImages: imageFiles,
            options: options,
            correctAnswer: correctAnswer,
            folderId: selectedFolder?.id,
            type: "questions",
        };

        // Determine route name and add id property if updating an existing question
        let routeName = 'createItem';

        // Build the complete payload for postRouteAPI
        const dataPayload = {
            routeName,
            ...questionData
        };

        // Submit the API call using promise chaining to match the "addItemToFolder" style
        await postRouteAPI(dataPayload).then((res) => {
            toast.success(
                selectedQuestion
                    ? questionToastMsgConst.updateQuestionSuccessMsg
                    : questionToastMsgConst.addQuestionSuccessMsg,
                { rtl: true }
            );
            getQuestionsList(selectedFolder.id);
            onCloseModal();
        }).catch(async (error) => {
            if (error?.response?.status === 401) {
                await getNewToken().then(async () => {
                    await postRouteAPI(dataPayload).then(() => {
                        toast.success(
                            selectedQuestion
                                ? questionToastMsgConst.updateQuestionSuccessMsg
                                : questionToastMsgConst.addQuestionSuccessMsg,
                            { rtl: true }
                        );
                        getQuestionsList(selectedFolder.id);
                        onCloseModal();
                    });
                }).catch((err) => {
                    console.error("Error during token refresh retry:", err);
                });
            } else {
                toast.error(
                    selectedQuestion
                        ? 'حدث خطأ أثناء تحديث السؤال'
                        : 'حدث خطأ أثناء إضافة السؤال',
                    { rtl: true }
                );
            }
        });

        // Optionally reset form fields if necessary, e.g., questionForm.resetFields();
        setLoading(false);
    };

    const handleOptionImageUpload = (optionIndex, event) => {
        const file = event.target.files[0];
        if (file) {
            // Create a temporary URL (for preview) or upload the file as needed.
            const imageUrl = URL.createObjectURL(file);
            setOptions(prevOptions => {
                const newOptions = [...prevOptions];
                // Ensure the images array exists:
                if (!newOptions[optionIndex].images) {
                    newOptions[optionIndex].images = [];
                }
                newOptions[optionIndex].images.push(imageUrl);
                return newOptions;
            });
        }
    };

    const handleRemoveOptionImage = (optionIndex, imgIndex) => {
        setOptions(prevOptions => {
            const newOptions = [...prevOptions];
            newOptions[optionIndex].images = newOptions[optionIndex].images.filter((_, i) => i !== imgIndex);
            return newOptions;
        });
    };

    // Handler to update the images array when file input changes
    const handleImageChange = (e) => {
        // Convert selected files into an array:
        const files = Array.from(e.target.files);
        // Map each file to a preview URL
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        // Append these to our existing states
        setImageFiles((prevFiles) => [...prevFiles, ...files]);
        setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };

    // Handler to remove an image by index
    const handleRemoveImage = (index) => {
        setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    };

    return (
        <Modal
            open={isModelForAddQuestionOpen}
            onCancel={onCloseModal}
            footer={null}
            closeIcon={null}
            className={styles.modalContainer}
        >
            <div className={styles.dialogContainer}>
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        {selectedQuestion ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
                    </h3>
                    <button type="button" className={styles.closeButton} onClick={onCloseModal}>
                        <AllIconsComponenet iconName={'closeicon'} height={24} width={24} />
                    </button>
                </div>
                <div className={styles.content}>
                    {formError && <div className={styles.errorMessage}>{formError}</div>}
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
                                    {/* New: Option images section */}
                                    <div className={styles.optionImages}>
                                        <label className={styles.label}>صور الخيار:</label>
                                        <div className={styles.imagesContainer}>
                                            {option.images && option.images.map((img, imgIndex) => (
                                                <div key={imgIndex} className={styles.imageWrapper}>
                                                    <img
                                                        src={img}
                                                        alt={`Option ${option.id} image ${imgIndex}`}
                                                        className={styles.imagePreview}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveOptionImage(index, imgIndex)}
                                                    >
                                                        حذف الصورة
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleOptionImageUpload(index, e)}
                                        />
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
                                multiple  // Enable multiple file selection
                            />
                            <label htmlFor="question-image" className={styles.fileLabel}>
                                <AllIconsComponenet iconName={'uploadFile'} height={24} width={24} />
                                <span>اختر صورة</span>
                            </label>
                            {imagePreviews && imagePreviews.length > 0 && (
                                <div className={styles.imagePreviewContainer}>
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className={styles.imagePreview}>
                                            <img src={preview} alt={`Preview ${index}`} />
                                            <button
                                                type="button"
                                                className={styles.removeImage}
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                <AllIconsComponenet iconName={'closeicon'} height={16} width={16} />
                                            </button>
                                        </div>
                                    ))}
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
            </div>
        </Modal>
    );
};

export default ModelForAddQuestion;
