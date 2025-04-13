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
    const [difficulty, setDifficulty] = useState("");
    const [skills, setSkills] = useState([]);
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
            setQuestionType(selectedQuestion.questionType || '');
            if (selectedQuestion.options && selectedQuestion.options.length > 0) {
                setOptions(selectedQuestion.options);
            }
            setCorrectAnswer(selectedQuestion.correctAnswer || '');
            setContextType(selectedQuestion.contextType || '');
            setContextDescription(selectedQuestion.contextDescription || '');
            if (selectedQuestion.imageUrl) {
                setImagePreview(selectedQuestion.imageUrl);
            }
            setDifficulty(selectedQuestion.difficulty);
            setSkills(selectedQuestion.skills);
        } else {
            // Reset state when there's no selected question (i.e. new question)
            setQuestionText('');
            setQuestionType('');
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
            folderId: selectedFolder?._id,
            type: "questions",
            skills: skills,
            difficulty: difficulty
        };

        // Determine route name and add id property if updating an existing question
        let routeName = 'createItem';

        // Build the complete payload for postRouteAPI
        const dataPayload = {
            routeName,
            ...questionData
        };
        console.log("🚀 ~ handleSubmit ~ dataPayload:", dataPayload);


        // Submit the API call using promise chaining to match the "addItemToFolder" style
        await postRouteAPI(dataPayload).then((res) => {
            toast.success(
                selectedQuestion
                    ? questionToastMsgConst.updateQuestionSuccessMsg
                    : questionToastMsgConst.addQuestionSuccessMsg,
                { rtl: true }
            );
            getQuestionsList(selectedFolder._id, "questions");
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
                        getQuestionsList(selectedFolder._id, "questions");
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

    // Handle editing a skill's text
    const handleSkillChange = (index, value) => {
        const updatedSkills = skills.map((skill, i) =>
            i === index ? { ...skill, text: value } : skill
        );
        setSkills(updatedSkills);
    };

    // Add a new skill to the end of the array.
    const handleAddSkill = () => {
        const newId = skills.length > 0 ? skills[skills.length - 1].id + 1 : 1;
        setSkills([...skills, { id: newId, text: '' }]);
    };

    // Remove a specific skill by its index.
    const handleRemoveSkill = (indexToRemove) => {
        setSkills(skills.filter((_, index) => index !== indexToRemove));
    };

    // Remove the last skill from the array.
    const handleRemoveLastSkill = () => {
        if (skills.length) {
            setSkills(skills.slice(0, -1));
        }
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
                        <label className={styles.label}>نص السؤال</label>
                        <textarea
                            className={styles.textarea}
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            placeholder="أدخل نص السؤال هنا"
                            rows={3}
                        />
                    </div>
                    
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

                    <div className={styles.formGroup}>
                        <label className={styles.label}>صعوبة السؤال</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            placeholder="سهل"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>المهارات</label>
                        {skills.map((skill, index) => (
                            <div key={skill.id} className={styles.skillRow}>
                                <div className={styles.optionLabel}>{index + 1}</div>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={skill.text}
                                    onChange={(e) => handleSkillChange(index, e.target.value)}
                                    placeholder="أضف المهارة هنا"
                                />
                                <button
                                    type="button"
                                    className={styles.removeButton}
                                    onClick={() => handleRemoveSkill(index)}
                                >
                                    &#x2715; {/* Cross icon */}
                                </button>
                            </div>
                        ))}
                        <div className={styles.buttonGroup}>
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className={styles.addButton}
                            >
                                &#43; {/* Plus icon */}
                            </button>
                            <button
                                type="button"
                                onClick={handleRemoveLastSkill}
                                className={styles.removeLastButton}
                                disabled={skills.length === 0}
                            >
                                &#x2212; {/* Minus sign */}
                            </button>
                        </div>
                    </div>

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
