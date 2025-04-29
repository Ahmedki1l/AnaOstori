import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import styles from './ModelForAddQuestion.module.scss';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import { postRouteAPI } from '../../services/apisService';
import { getNewToken } from '../../services/fireBaseAuthService';
import { questionsConst } from '../../constants/adminPanelConst/questionsBank/questionsConst';
import { toast } from 'react-toastify';
import { uploadFileSevices } from '../../services/UploadFileSevices';
import { Language } from '@mui/icons-material';

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

    const languages = [
        "اللغة العربية",
        "اللغة الإنجليزية"
    ]

    const sectionsAR = [
        "قدرات",
        "تحصيلي"
    ];

    const sectionsEN = [
        "GAT",
        "SAAT"
    ];

    const lessonGATAR = [
        "كمي",
        "لفظي"
    ];

    const lessonSAATAR = [
        "كيمياء",
        "رياضيات",
        "فيزياء",
        "أحياء",
    ];

    const lessonGATEN = [
        "Quantitative",
        "Verbal"
    ];

    const lessonSAATEN = [
        "Chemistry",
        "Mathematics",
        "Physics",
        "Biology",
    ];

    const verbalAR = [
        "إكمال الجمل",
        "الخطأ السياقي",
        "التناظر اللفظي",
        "الارتباط والاختلاف",
        "استيعاب المقروء",
        "المفردة الشاذة"
    ];

    const verbalEN = [
        "Analogy",
        "Sentence Completion",
        "Contextual Error",
        "Atypical word",
        "Reading comprehension",
    ];

    const verbalARSkills = verbalAR.map((skill) => {
        return skill;
    });

    const verbalENSkills = verbalEN.map((skill) => {
        return skill;
    });

    const quantitativeAR = [
        "Algebra",
        "Geometry",
        "Arithmetic",
        "Statistics",
        "Comparison",
    ];

    const quantitativeEN = [
        "العمليات الأساسية",
        "الكسور الاعتيادية",
        "الكسور العشرية",
        "أفكار خاصة بالقدرات",
        "النسب والتناسب",
        "الأنسس والمتطابقات",
        "الجذور",
        "المعادلات والمتباينات",
        "الزوايا والمضلعات",
        "المثلث",
        "المضلعات الرباعية",
        "الدائرة",
        "أفكار خاصة بالهندسة",
        "الإحصاء"
    ];

    const quantitativeARSkills = quantitativeAR.map((skill) => {
        return skill;
    });

    const quantitativeENSkills = quantitativeEN.map((skill) => {
        return skill;
    });

    const ALL_SKILLS = [
        ...verbalARSkills,
        ...quantitativeARSkills,
    ];

    // 1️⃣ New state at the top
    const [selectedLanguage, setSelectedLanguage] = useState('اللغة العربية');
    const [availableSections, setAvailableSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');
    const [availableLessons, setAvailableLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState('');
    const [availableSkills, setAvailableSkills] = useState([]);

    // 2️⃣ When section changes, update lessons
    useEffect(() => {
        if (selectedLanguage === 'اللغة العربية') {
            setAvailableSections(sectionsAR);
        } else {
            setAvailableSections(sectionsEN);
        }
        setSelectedLesson('');
        setAvailableSkills([]);
    }, [selectedLanguage]);

    useEffect(() => {
        if (selectedLanguage === 'اللغة العربية') {
            if (selectedSection === 'قدرات') {
                setAvailableLessons(lessonGATAR);
            } else if (selectedSection === 'تحصيلي') {
                setAvailableLessons(lessonSAATAR);
            } else {
                setAvailableLessons([]);
            }
        } else {
            if (selectedSection === 'GAT') {
                setAvailableLessons(lessonGATEN);
            } else if (selectedSection === 'SAAT') {
                setAvailableLessons(lessonSAATEN);
            } else {
                setAvailableLessons([]);
            }
        }
        setSelectedLesson('');
        setAvailableSkills([]);
    }, [selectedSection]);

    // 3️⃣ When lesson changes, update skills
    useEffect(() => {
        if (selectedLanguage === 'اللغة العربية') { 
            if (selectedLesson) {
                if (selectedSection === 'قدرات') {
                    if (selectedLesson === 'كمي') setAvailableSkills(quantitativeARSkills);
                    else if (selectedLesson === 'لفظي') setAvailableSkills(verbalARSkills);
                }
                // else if you have SAAT-specific skills, handle them here...
            } else {
                setAvailableSkills([]);
            }
        } else {
            if (selectedLesson) {
                if (selectedSection === 'GAT') {
                    if (selectedLesson === 'Quantitative') setAvailableSkills(quantitativeENSkills);
                    else if (selectedLesson === 'Verbal') setAvailableSkills(verbalENSkills);
                }
                // else if you have SAAT-specific skills, handle them here...
            } else {
                setAvailableSkills([]);
            }
        }
        setSkills([]); // clear any previously picked skills
    }, [selectedLesson]);

    useEffect(() => {
        if (selectedLesson) {
            let skillsList = [];
            if (selectedSection === 'قدرات') {
                skillsList = selectedLesson === 'كمي'
                    ? quantitativeARSkills
                    : selectedLesson === 'لفظي'
                        ? verbalARSkills
                        : [];
            } else if (selectedSection === 'تحصيلي') {
                // if you have subject-specific arrays for SAAT:
                skillsList = [];
            }
            setAvailableSkills(skillsList);

            // only wipe out skills if this is NOT edit mode:
            if (!selectedQuestion) {
                setSkills([]);
            }
        } else {
            setAvailableSkills([]);
            if (!selectedQuestion) {
                setSkills([]);
            }
        }
    }, [selectedLesson, selectedSection, selectedQuestion]);

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
            if (selectedQuestion.questionImages.length > 0) {
                setImagePreviews(selectedQuestion.questionImages);
            }
            setDifficulty(selectedQuestion.difficulty);

            // ↓↓↓ new ↓↓↓
            const { section = '', lesson = '' } = selectedQuestion;
            setSelectedSection(section);
            // manually populate the lessons dropdown so selectedLesson can bind
            const lessons = section === 'قدرات'
                ? lessonGATAR
                : section === 'تحصيلي'
                    ? lessonSAATAR
                    : [];
            setAvailableLessons(lessons);
            setSelectedLesson(lesson);

            // and finally re-apply the saved skills
            setSkills(selectedQuestion.skills || []);
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
            setSelectedSection('');
            setSelectedLesson('');
            setAvailableLessons([]);
            setAvailableSkills([]);
            setSkills([]);
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

        try {
            const existingImages = imagePreviews.filter(
                (url) =>
                    typeof url === "string" &&
                    url.includes("https://phase2anaostori.s3.eu-central-1.amazonaws.com/questions/")
            );
            // Upload any new files, skipping those that already have the S3 URL from imagePreviews.
            const uploadedNewImages = await Promise.all(
                imageFiles.map(async (file, index) => {
                    // Check if the corresponding preview already has the S3 URL:
                    if (
                        imagePreviews[index] &&
                        imagePreviews[index].includes("https://phase2anaostori.s3.eu-central-1.amazonaws.com/questions/")
                    ) {
                        return imagePreviews[index];
                    }
                    try {
                        const s3Url = await uploadFileSevices(file, () => { }, null, "questions");
                        console.log("🚀 ~ imageFiles.map ~ s3Url:", s3Url);
                        return s3Url;
                    } catch (error) {
                        console.error("Error uploading new question image during update:", error);
                        toast.error("فشل تحميل صورة السؤال الجديدة");
                        return null;
                    }
                })
            );
            const finalQuestionImages = [
                ...existingImages,
                ...uploadedNewImages.filter((url) => url)
            ];

            // --- Process options images ---
            const processedOptions = await Promise.all(
                options.map(async (option) => {
                    if (option.images && option.images.length > 0) {
                        const uploadedOptionImages = await Promise.all(
                            option.images.map(async (imgEntry) => {
                                // If the image entry is already a URL containing the S3 folder, use it directly.
                                if (
                                    typeof imgEntry === "string" &&
                                    imgEntry.includes("https://phase2anaostori.s3.eu-central-1.amazonaws.com/questions/")
                                ) {
                                    return imgEntry;
                                }
                                // Otherwise, if it's a new image object with a file property, upload it.
                                if (typeof imgEntry === "object" && imgEntry.file) {
                                    try {
                                        const s3Url = await uploadFileSevices(imgEntry.file, () => { }, null, "questions");
                                        console.log("🚀 ~ option.images.map ~ s3Url:", s3Url);
                                        return s3Url;
                                    } catch (error) {
                                        console.error("Error uploading option image:", error);
                                        toast.error("فشل تحميل صورة الخيار");
                                        return null;
                                    }
                                }
                                return null;
                            })
                        );
                        return { ...option, images: uploadedOptionImages.filter((url) => url) };
                    }
                    return option;
                })
            );

            console.log("questionsImages: ", finalQuestionImages);
            console.log("optionsImages: ", processedOptions);

            // Prepare payload for API
            const questionData = {
                text: questionText,
                questionType,
                language: selectedLanguage,
                section: selectedSection,
                lesson: selectedLesson,
                context: contextType,
                contextDescription,
                questionImages: finalQuestionImages,
                options: processedOptions,
                correctAnswer,
                folderId: selectedFolder?._id,
                type: "questions",
                skills,
                difficulty
            };

            console.log("selectedQuestion: ", selectedQuestion);

            let routeName = 'createItem';
            if (selectedQuestion) {
                routeName = 'updateItemHandler';
                questionData.id = selectedQuestion._id;
            }

            const dataPayload = {
                routeName,
                ...questionData
            };

            await postRouteAPI(dataPayload).then(() => {
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
        } catch (overallError) {
            console.error("Error during submit:", overallError);
        }

        setLoading(false);
    };


    // Modified handler: store option image file and preview (do not upload yet)
    const handleOptionImageUpload = (optionIndex, event) => {
        const file = event.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setOptions(prevOptions => {
                const newOptions = [...prevOptions];
                if (!newOptions[optionIndex].images) {
                    newOptions[optionIndex].images = [];
                }
                // Instead of storing just a URL, we store an object with the file and preview
                newOptions[optionIndex].images.push({ file, preview: previewUrl });
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

    // Modified handler: store overall question image files and generate preview URLs (do not upload yet)
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImageFiles(prev => [...prev, ...files]);
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const handleRemoveImage = (index) => {
        setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
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
            // className={styles.modalContainer}
            width={1000}
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
                                                &#x2715;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* — language Select — */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>اللغة</label>
                        <select
                            className={styles.input}
                            value={selectedLanguage}
                            onChange={e => setSelectedLanguage(e.target.value)}
                        >
                            {languages.map(sec => (
                                <option key={sec} value={sec}>{sec}</option>
                            ))}
                        </select>
                    </div>

                    {/* — Section Select — */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>القسم</label>
                        <select
                            className={styles.input}
                            value={selectedSection}
                            onChange={e => setSelectedSection(e.target.value)}
                        >
                            <option value="" disabled>اختر القسم</option>
                            {availableSections.map(sec => (
                                <option key={sec} value={sec}>{sec}</option>
                            ))}
                        </select>
                    </div>

                    {/* — Lesson Select — */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>الدرس</label>
                        <select
                            className={styles.input}
                            value={selectedLesson}
                            onChange={e => setSelectedLesson(e.target.value)}
                            disabled={!availableLessons.length}
                        >
                            <option value="" disabled>اختر الدرس</option>
                            {availableLessons.map(lesson => (
                                <option key={lesson} value={lesson}>{lesson}</option>
                            ))}
                        </select>
                    </div>

                    {availableSkills.length > 0 &&
                        <div className={styles.formGroup}>
                            <label className={styles.label}>المهارات</label>

                            {skills.map((skill, index) => {
                                const usedTexts = skills.map(s => s.text).filter(t => t && t !== skill.text);
                                const options = availableSkills.filter(s => !usedTexts.includes(s));

                                return (
                                    <div key={skill.id} className={styles.skillRow}>
                                        <div className={styles.optionLabel}>{index + 1}</div>
                                        <select
                                            className={styles.input}
                                            value={skill.text}
                                            onChange={e => handleSkillChange(index, e.target.value)}
                                        >
                                            <option value="">اختر مهارة...</option>
                                            {options.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        …
                                    </div>
                                );
                            })}

                            <div className={styles.buttonGroup}>
                                <button
                                    type="button"
                                    onClick={handleAddSkill}
                                    className={styles.addButton}
                                    disabled={skills.length >= availableSkills.length}
                                >
                                    &#43;
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemoveLastSkill}
                                    className={styles.removeLastButton}
                                    disabled={skills.length === 0}
                                >
                                    &#x2212;
                                </button>
                            </div>
                        </div>
                    }

                    <div className={styles.formGroup}>
                        <label className={styles.label}>مستوى الصعوبة</label>
                        <select
                            className={styles.input}
                            value={difficulty}
                            onChange={e => setDifficulty(e.target.value)}
                        >
                            <option value="" disabled>اختر المستوى</option>
                            <option value="سهل">سهل</option>
                            <option value="متوسط">متوسط</option>
                            <option value="صعب">صعب</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>الاختيارات</label>
                        {options.map((option, index) => (
                            <div key={option.id} className={styles.optionItem}>
                                {/* Top Row: Option ID and TextArea */}
                                <div className={styles.optionMain}>
                                    <div className={styles.optionLabel}>{option.id}</div>
                                    <textarea
                                        className={styles.textarea}
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`الخيار ${option.id}`}
                                        rows={3}
                                    />
                                </div>

                                {/* Bottom Row: Radio Button and Images */}
                                <div className={styles.optionExtras}>
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
                                    <div className={styles.optionImages}>
                                        <label className={styles.label}>صور الخيار:</label>
                                        <div className={styles.imagesContainer}>
                                            {option.images &&
                                                option.images.map((img, imgIndex) => (
                                                    <div key={imgIndex} className={styles.imageWrapper}>
                                                        <img
                                                            src={img.preview || img}
                                                            alt={`Option ${option.id} image ${imgIndex}`}
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
                            </div>
                        ))}
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
