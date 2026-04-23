import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'antd';
import styles from './ModelForAddQuestion.module.scss';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import { postRouteAPI } from '../../services/apisService';
import { getNewToken } from '../../services/fireBaseAuthService';
import { questionsConst } from '../../constants/adminPanelConst/questionsBank/questionsConst';
import { toast } from 'react-toastify';
import { uploadFileSevices } from '../../services/UploadFileSevices';

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
    const [markedWordIndices, setMarkedWordIndices] = useState([]);
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
        "العمليات الأساسية",
        "الكسور الاعتيادية",
        "الكسور العشرية",
        "أفكار خاصة بالقدرات",
        "النسب والتناسب",
        "الأسس والمتطابقات",
        "الجذور",
        "المعادلات والمتباينات",
        "الزوايا والمضلعات",
        "المثلث",
        "المضلعات الرباعية",
        "الدائرة",
        "أفكار خاصة بالهندسة",
        "الإحصاء"
    ];

    const quantitativeEN = [
        "Algebra",
        "Geometry",
        "Arithmetic",
        "Statistics",
        "Comparison",
    ];

    const quantitativeARSkills = quantitativeAR.map((skill) => {
        return skill;
    });

    const quantitativeENSkills = quantitativeEN.map((skill) => {
        return skill;
    });

    // SAAT (تحصيلي) — Arabic skill lists. Strings must match SKILL_CATEGORIES
    // in components/ExamComponents/ExamResults.js so result aggregation works.
    const mathSAATAR = [
        'التبرير والبرهان والمنطق الرياضي',
        'هندسة المثلثات',
        'الاشكال الرباعية والتحويلات الهندسية',
        'تحليل الدوال',
        'ضرب العبارات النسبية وقسمتها',
        'المصفوفات والمحددات',
        'كثيرات الحدود',
        'الأسس والجذور واللوغاريتمات',
        'المتتابعات والمتسلسلات',
        'الإحصاء والاحتمال',
        'حساب المثلثات',
        'النهايات والدوال المتصلة',
        'التفاضل والتكامل',
        'القطوع المخروطية',
        'المتجهات والإحداثيات القطبية',
    ];

    const physicsSAATAR = [
        'علم الفيزياء',
        'الحركة والسرعة',
        'التسارع',
        'القوة',
        'قوانين كبلر والجاذبية',
        'العزم',
        'الدفع والزخم',
        'الشغل والطاقة',
        'الطاقة الحرارية',
        'الموائع',
        'الموجات',
        'الصوت',
        'الضوء',
        'الانعكاس في الضوء والمرايا',
        'الانكسار في الضوء والعدسات',
        'الكهرباء الساكنة والمجال الكهربي',
        'التيار الكهربي',
        'القوى والمجالات المغناطيسية',
        'الفيزياء الحديثة',
        'إلكترونيات الحالة الصلبة',
        'الفيزياء النووية',
    ];

    const chemistrySAATAR = [
        'تركيب الذرة والنشاط الإشعاعي',
        'نظرية الكم والتوزيع الإلكتروني',
        'الجدول الدوري وتدرج الخواص',
        'الروابط الكيميائية والفيزيائية',
        'التفاعلات والحسابات الكيميائية',
        'المحاليل الكيميائية',
        'الغازات',
        'الكيمياء الحرارية',
        'الاتزان الكيميائي',
        'الأحماض والقواعد',
        'الأكسدة والاختزال',
        'الكيمياء الكهربائية',
        'الهيدروكربونات',
        'مشتقات الهيدروكربونات',
        'الكيمياء الحيوية',
        'العلماء في الكيمياء',
    ];

    const biologySAATAR = [
        'دراسة الحياة',
        'تنظيم تنوع الحياة',
        'البكتيريا والفيروسات',
        'الطلائعيات',
        'الفطريات',
        'مدخل إلى الحيوانات',
        'الديدان والرخويات',
        'المفصليات',
        'شوكيات الجلد واللافقاريات الحبلية',
        'الأسماك والبرمائيات',
        'الزواحف والطيور',
        'الثدييات',
        'مقدمة في النبات',
        'تركيب النبات ووظائف أجزائه',
        'التكاثر في النباتات الزهرية',
        'الجهازان الهيكلي والعضلي',
        'الجهاز العصبي',
        'أجهزة الدوران والتنفس والإخراج',
        'جهاز الهضم والغدد الصم',
        'التكاثر والنمو في الإنسان',
        'جهاز المناعة',
        'أجهزة جسم الإنسان',
        'تركيب الخلية ووظائفها',
        'الطاقة الخلوية',
        'التكاثر الخلوي',
        'التكاثر الجنسي والوراثة',
        'الوراثة المعقدة والوراثة البشرية',
        'مبادئ علم البيئة',
        'المجتمعات والمناطق الحيوية والأنظمة البيئية',
        'علم بيئة الجماعات الحيوية',
        'التنوع الحيوي والمحافظة عليه',
        'سلوك الحيوان',
    ];

    // SAAT (SAAT) — English skill lists.
    const mathSAATEN = [
        'Mathematical Reasoning', 'Triangle Geometry', 'Quadrilaterals and Geometric Transformations',
        'Function Analysis', 'Rational Expressions', 'Matrices and Determinants',
        'Polynomials', 'Exponents and Logarithms', 'Sequences and Series',
        'Statistics and Probability', 'Trigonometry', 'Limits and Continuous Functions',
        'Calculus', 'Conic Sections', 'Vectors and Polar Coordinates',
    ];

    const physicsSAATEN = [
        'Physics Science', 'Motion and Speed', 'Acceleration', 'Force', 'Kepler Laws and Gravity',
        'Torque', 'Impulse and Momentum', 'Work and Energy', 'Thermal Energy', 'Fluids',
        'Waves', 'Sound', 'Light', 'Reflection and Mirrors', 'Refraction and Lenses',
        'Electrostatics', 'Electric Current', 'Magnetic Forces and Fields',
        'Modern Physics', 'Solid State Electronics', 'Nuclear Physics',
    ];

    const chemistrySAATEN = [
        'Atomic Structure and Radioactivity', 'Quantum Theory and Electron Configuration',
        'Periodic Table and Properties', 'Chemical and Physical Bonds',
        'Chemical Reactions and Calculations', 'Chemical Solutions', 'Gases',
        'Thermochemistry', 'Chemical Equilibrium', 'Acids and Bases',
        'Oxidation and Reduction', 'Electrochemistry', 'Hydrocarbons',
        'Hydrocarbon Derivatives', 'Biochemistry',
    ];

    const biologySAATEN = [
        'Study of Life', 'Diversity of Life', 'Bacteria and Viruses', 'Protists', 'Fungi',
        'Introduction to Animals', 'Worms and Mollusks', 'Arthropods',
        'Echinoderms and Invertebrate Chordates', 'Fish and Amphibians',
        'Reptiles and Birds', 'Mammals', 'Introduction to Plants',
        'Plant Structure and Function', 'Plant Reproduction',
        'Skeletal and Muscular Systems', 'Nervous System',
        'Circulatory Respiratory and Excretory Systems',
        'Digestive and Endocrine Systems', 'Human Reproduction and Development',
        'Immune System', 'Cell Structure and Function', 'Cellular Energy',
        'Cell Reproduction', 'Sexual Reproduction and Genetics',
        'Complex Inheritance and Human Genetics', 'Principles of Ecology',
        'Communities and Biomes', 'Population Ecology',
        'Biodiversity and Conservation', 'Animal Behavior',
    ];

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

    // refs to track first run
    const firstLangRun = useRef(2);
    const firstSectRun = useRef(2);
    const firstLessonRun = useRef(2);

    useEffect(() => {
        if (firstLangRun.current > 0) {
            firstLangRun.current--;
            if (firstLangRun.current === 0 && selectedQuestion) return;
        }

        if (selectedLanguage === 'اللغة العربية') {
            setAvailableSections(sectionsAR);
        } else {
            setAvailableSections(sectionsEN);
        }
        setSelectedSection('');
        setSelectedLesson('');
        setAvailableLessons([]);
        setAvailableSkills([]);
        setSkills([]);
    }, [selectedLanguage]);

    useEffect(() => {
        if (firstSectRun.current > 0) {
            firstSectRun.current--;
            if (firstSectRun.current === 0 && selectedQuestion) return;
        }

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
        setSkills([]);
    }, [selectedSection]);

    useEffect(() => {
        if (firstLessonRun.current > 0) {
            firstLessonRun.current--;
            if (firstLessonRun.current === 0 && selectedQuestion) return;
        }

        if (selectedLanguage === 'اللغة العربية') {
            if (selectedLesson) {
                if (selectedSection === 'قدرات') {
                    if (selectedLesson === 'كمي') setAvailableSkills(quantitativeARSkills);
                    else if (selectedLesson === 'لفظي') setAvailableSkills(verbalARSkills);
                } else if (selectedSection === 'تحصيلي') {
                    if (selectedLesson === 'رياضيات') setAvailableSkills(mathSAATAR);
                    else if (selectedLesson === 'فيزياء') setAvailableSkills(physicsSAATAR);
                    else if (selectedLesson === 'كيمياء') setAvailableSkills(chemistrySAATAR);
                    else if (selectedLesson === 'أحياء') setAvailableSkills(biologySAATAR);
                }
            } else {
                setAvailableSkills([]);
            }
        } else {
            if (selectedLesson) {
                if (selectedSection === 'GAT') {
                    if (selectedLesson === 'Quantitative') setAvailableSkills(quantitativeENSkills);
                    else if (selectedLesson === 'Verbal') setAvailableSkills(verbalENSkills);
                } else if (selectedSection === 'SAAT') {
                    if (selectedLesson === 'Mathematics') setAvailableSkills(mathSAATEN);
                    else if (selectedLesson === 'Physics') setAvailableSkills(physicsSAATEN);
                    else if (selectedLesson === 'Chemistry') setAvailableSkills(chemistrySAATEN);
                    else if (selectedLesson === 'Biology') setAvailableSkills(biologySAATEN);
                }
            } else {
                setAvailableSkills([]);
            }
        }
        setSkills([]);
    }, [selectedLesson]);

    useEffect(() => {
        if (selectedQuestion) {
            setQuestionText(selectedQuestion.text || '');
            setQuestionType(selectedQuestion.type || 'multipleChoice');
            setMarkedWordIndices(selectedQuestion.contextualErrorIndices || []);
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
            const { section = '', lesson = '', language = '' } = selectedQuestion;
            setSelectedLanguage(language);
            setSelectedSection(section);
            // manually populate the lessons dropdown so selectedLesson can bind
            const lessons = section === 'قدرات'
                ? lessonGATAR
                : section === 'GAT'
                    ? lessonGATEN
                    : section === 'SAAT'
                        ? lessonSAATEN
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

    // ──────────────────────────────────────────────────
    // Effect B: when section is set, derive lessons & restore saved lesson
    useEffect(() => {
        if (!selectedQuestion || !selectedSection) return;

        let lessons = [];
        switch (selectedSection) {
            case 'قدرات': lessons = lessonGATAR; break;
            case 'GAT': lessons = lessonGATEN; break;
            case 'تحصيلي': lessons = lessonSAATAR; break;
            case 'SAAT': lessons = lessonSAATEN; break;
            default: lessons = []; break;
        }

        setAvailableLessons(lessons);
        // now restore the original lesson from the question
        setSelectedLesson(selectedQuestion.lesson);
    }, [selectedSection, selectedQuestion]);

    // ──────────────────────────────────────────────────
    // Effect C: when lesson is set, derive skills & restore saved skills
    useEffect(() => {
        if (!selectedQuestion || !selectedLesson) return;

        let pool = [];
        if (selectedSection === 'قدرات' && selectedLesson === 'كمي') pool = quantitativeARSkills;
        else if (selectedSection === 'قدرات' && selectedLesson === 'لفظي') pool = verbalARSkills;
        else if (selectedSection === 'GAT' && selectedLesson === 'Quantitative') pool = quantitativeENSkills;
        else if (selectedSection === 'GAT' && selectedLesson === 'Verbal') pool = verbalENSkills;

        else if (selectedSection === 'تحصيلي' && selectedLesson === 'كيمياء') pool = [];
        else if (selectedSection === 'تحصيلي' && selectedLesson === 'رياضيات') pool = [];
        else if (selectedSection === 'تحصيلي' && selectedLesson === 'فيزياء') pool = [];
        else if (selectedSection === 'تحصيلي' && selectedLesson === 'أحياء') pool = [];
        else if (selectedSection === 'SAAT' && selectedLesson === 'Chemistry') pool = [];
        else if (selectedSection === 'SAAT' && selectedLesson === 'Mathematics') pool = [];
        else if (selectedSection === 'SAAT' && selectedLesson === 'Physics') pool = [];
        else if (selectedSection === 'SAAT' && selectedLesson === 'Biology') pool = [];

        setAvailableSkills(pool);
        // restore the saved skills array
        setSkills(selectedQuestion.skills || []);
    }, [selectedLesson, selectedSection, selectedQuestion]);

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
        }
        if (!correctAnswer) {
            setFormError('يرجى تحديد الإجابة الصحيحة');
            return false;
        }

        if (questionType === 'contextualError' && markedWordIndices.length === 0) {
            setFormError('يرجى تحديد الكلمة المحتوية على الخطأ السياقي');
            return false;
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

            const errorWords = questionType === 'contextualError' ? markedWordIndices.map(i => questionText.split(/(\s+)/)[i]) : [];

            // Prepare payload for API
            const questionData = {
                text: questionText,
                questionType,
                contextualErrorWords: errorWords,
                contextualErrorIndices: markedWordIndices,
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
                        <label className={styles.label}>نوع السؤال</label>
                        <select
                            className={styles.input}
                            value={questionType}
                            onChange={e => setQuestionType(e.target.value)}
                        >
                            <option value="multipleChoice">اختيار من متعدد</option>
                            <option value="contextualError">الخطأ السياقي</option>
                        </select>
                    </div>

                    {questionType === 'contextualError' && (
                        <div className={styles.contextualWrapper}>
                            <label className={styles.contextualLabel}>
                                اختيار الكلمات الخاطئة
                            </label>
                            <div className={styles.contextualEditor}>
                                {questionText.split(/(\s+)/).map((word, idx) => {
                                    // if it's pure whitespace, just render it
                                    if (/^\s+$/.test(word)) return word;

                                    const isMarked = markedWordIndices.includes(idx);
                                    return (
                                        <span
                                            key={idx}
                                            className={isMarked ? styles.marked : ''}
                                            onClick={() => {
                                                setMarkedWordIndices(prev =>
                                                    prev.includes(idx)
                                                        ? prev.filter(i => i !== idx)
                                                        : [...prev, idx]
                                                );
                                            }}
                                        >
                                            {word}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}

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
