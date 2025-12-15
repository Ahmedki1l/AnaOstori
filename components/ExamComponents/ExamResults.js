import React from 'react';
import styles from '../../styles/ExamPage.module.scss';

const ExamResults = ({ elapsedTime, totalTime, examData, CurrentExam, reviewQuestions, onReviewAnswers, onRetakeExam, hideRetakeButton = false, savedSections, savedSectionDetails }) => {
    console.log("🚀 ~ ExamResults ~ elapsedTime:", elapsedTime);
    const allReviews = reviewQuestions;
    const flatReviews = allReviews.flat();
    const flatQuestions = examData.flat();

    const totalQuestions = allReviews.reduce(
        (sum, block) => sum + block.length,
        0
    );

    console.log("🚀 ~ ExamResults ~ examData:", examData)
    console.log("🚀 ~ ExamResults ~ flatQuestions:", flatQuestions)
    console.log("🚀 ~ ExamResults ~ reviewQuestions:", allReviews)
    console.log("🚀 ~ ExamResults ~ flatReviews:", flatReviews)

    const calculateScore = (examData, allReviews) => {
        if (!examData || !allReviews || allReviews.length === 0) {
            return 0;
        }

        let correctAnswers = 0;

        allReviews.forEach((question, i) => {
            if (question.selectedAnswer === examData[i]?.correctAnswer) {
                correctAnswers++;
            }
        });

        if (totalQuestions === 0) return 0;
        return Math.round((correctAnswers / totalQuestions) * 100);
    };

    const getCorrectAnswers = (examData, allReviews) => {
        if (!examData || !allReviews || allReviews.length === 0) {
            return 0;
        }

        let correctAnswers = 0;

        allReviews.forEach((question, i) => {
            if (question.selectedAnswer === examData[i]?.correctAnswer) {
                correctAnswers++;
            }
        });

        return correctAnswers;
    };

    const getNotAnsweredQuestions = () => {
        if (!examData || !flatReviews || flatReviews.length === 0) {
            return 0;
        }

        let answers = 0;

        flatReviews.forEach((question, i) => {
            if (!question.answered) {
                answers++;
            }
        });

        return answers;
    }

    const getMarkedQuestions = () => {
        if (!examData || !flatReviews || flatReviews.length === 0) {
            return 0;
        }

        let answers = 0;

        flatReviews.forEach((question, i) => {
            if (question.isMarked) {
                answers++;
            }
        });

        return answers;
    }

    const getSections = (examData, allReviews) => {
        if (!examData || !allReviews || allReviews.length === 0) {
            return [];
        }

        return examData.map((sectionQuestions, sectionIndex) => {
            const sectionReviewQuestions = allReviews[sectionIndex] || [];

            // Calculate correct answers for this section
            let correctInSection = 0;
            sectionReviewQuestions.forEach((q, qIndex) => {
                if (q.selectedAnswer === sectionQuestions[qIndex]?.correctAnswer) {
                    correctInSection++;
                }
            });

            const sectionScore = sectionQuestions.length > 0
                ? Math.round((correctInSection / sectionQuestions.length) * 100)
                : 0;

            // Group questions by skill within this section
            const skillsMap = new Map();
            sectionQuestions.forEach((question, qIndex) => {
                question?.skills?.forEach(skill => {
                    const skillName = skill.text || skill;

                    if (!skillsMap.has(skillName)) {
                        skillsMap.set(skillName, []);
                    }

                    skillsMap.get(skillName).push({
                        question,
                        selectedAnswer: sectionReviewQuestions?.[qIndex]?.selectedAnswer ?? null
                    });
                });
            });

            // Calculate skill scores
            const skills = Array.from(skillsMap.entries()).map(([skillTitle, questions]) => {
                const correctInSkill = questions.filter(q =>
                    q.selectedAnswer === q.question.correctAnswer
                ).length;

                return {
                    title: skillTitle,
                    correctAnswers: correctInSkill,
                    numberOfQuestions: questions.length,
                    score: Math.round((correctInSkill / questions.length) * 100)
                };
            });

            return {
                title: CurrentExam?.sections?.[sectionIndex]?.title || `القسم ${sectionIndex + 1}`,
                score: correctInSection,
                totalQuestions: sectionQuestions.length,
                skills: skills
            };
        });
    };

    // Skill to Category Mapping
    const SKILL_CATEGORIES = {
        // ========================================
        // قدرات (Arabic GAT) - كمي / لفظي
        // ========================================

        // لفظي (Verbal) Skills
        'إكمال الجمل': 'لفظي',
        'الخطأ السياقي': 'لفظي',
        'التناظر اللفظي': 'لفظي',
        'الارتباط والاختلاف': 'لفظي',
        'استيعاب المقروء': 'لفظي',
        'المفردة الشاذة': 'لفظي',

        // كمي (Quantitative) Skills
        'العمليات الأساسية': 'كمي',
        'الكسور الاعتيادية': 'كمي',
        'الكسور العشرية': 'كمي',
        'أفكار خاصة بالقدرات': 'كمي',
        'النسب والتناسب': 'كمي',
        'الأسس والمتطابقات': 'كمي',
        'الجذور': 'كمي',
        'المعادلات والمتباينات': 'كمي',
        'الزوايا والمضلعات': 'كمي',
        'المثلث': 'كمي',
        'المضلعات الرباعية': 'كمي',
        'الدائرة': 'كمي',
        'أفكار خاصة بالهندسة': 'كمي',
        'الإحصاء': 'كمي',

        // ========================================
        // GAT English - Quantitative / Verbal
        // ========================================

        // Quantitative Skills (GAT English)
        'Algebra': 'Quantitative',
        'Geometry': 'Quantitative',
        'Arithmetic': 'Quantitative',
        'Statistics': 'Quantitative',
        'Comparison': 'Quantitative',

        // Verbal Skills (GAT English)
        'Analogy': 'Verbal',
        'Sentence Completion': 'Verbal',
        'Contextual Error': 'Verbal',
        'Atypical word': 'Verbal',
        'Atypical Word': 'Verbal',
        'Reading comprehension': 'Verbal',
        'Reading Comprehension': 'Verbal',

        // ========================================
        // تحصيلي (Arabic SAAT) - رياضيات / فيزياء / كيمياء / أحياء
        // ========================================

        // رياضيات (Math) Skills
        'التبرير والبرهان والمنطق الرياضي': 'رياضيات',
        'هندسة المثلثات': 'رياضيات',
        'الاشكال الرباعية والتحويلات الهندسية': 'رياضيات',
        'تحليل الدوال': 'رياضيات',
        'ضرب العبارات النسبية وقسمتها': 'رياضيات',
        'المصفوفات والمحددات': 'رياضيات',
        'كثيرات الحدود': 'رياضيات',
        'الأسس والجذور واللوغاريتمات': 'رياضيات',
        'المتتابعات والمتسلسلات': 'رياضيات',
        'الإحصاء والاحتمال': 'رياضيات',
        'حساب المثلثات': 'رياضيات',
        'النهايات والدوال المتصلة': 'رياضيات',
        'التفاضل والتكامل': 'رياضيات',
        'القطوع المخروطية': 'رياضيات',
        'المتجهات والإحداثيات القطبية': 'رياضيات',

        // فيزياء (Physics) Skills
        'علم الفيزياء': 'فيزياء',
        'الحركة والسرعة': 'فيزياء',
        'التسارع': 'فيزياء',
        'القوة': 'فيزياء',
        'قوانين كبلر والجاذبية': 'فيزياء',
        'العزم': 'فيزياء',
        'الدفع والزخم': 'فيزياء',
        'الشغل والطاقة': 'فيزياء',
        'الطاقة الحرارية': 'فيزياء',
        'الموائع': 'فيزياء',
        'الموجات': 'فيزياء',
        'الصوت': 'فيزياء',
        'الضوء': 'فيزياء',
        'الانعكاس في الضوء والمرايا': 'فيزياء',
        'الانكسار في الضوء والعدسات': 'فيزياء',
        'الكهرباء الساكنة والمجال الكهربي': 'فيزياء',
        'التيار الكهربي': 'فيزياء',
        'القوى والمجالات المغناطيسية': 'فيزياء',
        'الفيزياء الحديثة': 'فيزياء',
        'إلكترونيات الحالة الصلبة': 'فيزياء',
        'الفيزياء النووية': 'فيزياء',

        // كيمياء (Chemistry) Skills
        'تركيب الذرة والنشاط الإشعاعي': 'كيمياء',
        'نظرية الكم والتوزيع الإلكتروني': 'كيمياء',
        'الجدول الدوري وتدرج الخواص': 'كيمياء',
        'الروابط الكيميائية والفيزيائية': 'كيمياء',
        'التفاعلات والحسابات الكيميائية': 'كيمياء',
        'المحاليل الكيميائية': 'كيمياء',
        'الغازات': 'كيمياء',
        'الكيمياء الحرارية': 'كيمياء',
        'الاتزان الكيميائي': 'كيمياء',
        'الأحماض والقواعد': 'كيمياء',
        'الأكسدة والاختزال': 'كيمياء',
        'الكيمياء الكهربائية': 'كيمياء',
        'الهيدروكربونات': 'كيمياء',
        'مشتقات الهيدروكربونات': 'كيمياء',
        'الكيمياء الحيوية': 'كيمياء',
        'العلماء في الكيمياء': 'كيمياء',

        // أحياء (Biology) Skills
        'دراسة الحياة': 'أحياء',
        'تنظيم تنوع الحياة': 'أحياء',
        'البكتيريا والفيروسات': 'أحياء',
        'الطلائعيات': 'أحياء',
        'الفطريات': 'أحياء',
        'مدخل إلى الحيوانات': 'أحياء',
        'الديدان والرخويات': 'أحياء',
        'المفصليات': 'أحياء',
        'شوكيات الجلد واللافقاريات الحبلية': 'أحياء',
        'الأسماك والبرمائيات': 'أحياء',
        'الزواحف والطيور': 'أحياء',
        'الثدييات': 'أحياء',
        'مقدمة في النبات': 'أحياء',
        'تركيب النبات ووظائف أجزائه': 'أحياء',
        'التكاثر في النباتات الزهرية': 'أحياء',
        'الجهازان الهيكلي والعضلي': 'أحياء',
        'الجهاز العصبي': 'أحياء',
        'أجهزة الدوران والتنفس والإخراج': 'أحياء',
        'جهاز الهضم والغدد الصم': 'أحياء',
        'التكاثر والنمو في الإنسان': 'أحياء',
        'جهاز المناعة': 'أحياء',
        'أجهزة جسم الإنسان': 'أحياء',
        'تركيب الخلية ووظائفها': 'أحياء',
        'الطاقة الخلوية': 'أحياء',
        'التكاثر الخلوي': 'أحياء',
        'التكاثر الجنسي والوراثة': 'أحياء',
        'الوراثة المعقدة والوراثة البشرية': 'أحياء',
        'مبادئ علم البيئة': 'أحياء',
        'المجتمعات والمناطق الحيوية والأنظمة البيئية': 'أحياء',
        'علم بيئة الجماعات الحيوية': 'أحياء',
        'التنوع الحيوي والمحافظة عليه': 'أحياء',
        'سلوك الحيوان': 'أحياء',

        // ========================================
        // SAAT English - Mathematics / Physics / Chemistry / Biology
        // ========================================

        // Mathematics Skills (SAAT English)
        'Mathematical Reasoning': 'Mathematics',
        'Triangle Geometry': 'Mathematics',
        'Quadrilaterals and Geometric Transformations': 'Mathematics',
        'Function Analysis': 'Mathematics',
        'Rational Expressions': 'Mathematics',
        'Matrices and Determinants': 'Mathematics',
        'Polynomials': 'Mathematics',
        'Exponents and Logarithms': 'Mathematics',
        'Sequences and Series': 'Mathematics',
        'Statistics and Probability': 'Mathematics',
        'Trigonometry': 'Mathematics',
        'Limits and Continuous Functions': 'Mathematics',
        'Calculus': 'Mathematics',
        'Conic Sections': 'Mathematics',
        'Vectors and Polar Coordinates': 'Mathematics',

        // Physics Skills (SAAT English)
        'Physics Science': 'Physics',
        'Motion and Speed': 'Physics',
        'Acceleration': 'Physics',
        'Force': 'Physics',
        'Kepler Laws and Gravity': 'Physics',
        'Torque': 'Physics',
        'Impulse and Momentum': 'Physics',
        'Work and Energy': 'Physics',
        'Thermal Energy': 'Physics',
        'Fluids': 'Physics',
        'Waves': 'Physics',
        'Sound': 'Physics',
        'Light': 'Physics',
        'Reflection and Mirrors': 'Physics',
        'Refraction and Lenses': 'Physics',
        'Electrostatics': 'Physics',
        'Electric Current': 'Physics',
        'Magnetic Forces and Fields': 'Physics',
        'Modern Physics': 'Physics',
        'Solid State Electronics': 'Physics',
        'Nuclear Physics': 'Physics',

        // Chemistry Skills (SAAT English)
        'Atomic Structure and Radioactivity': 'Chemistry',
        'Quantum Theory and Electron Configuration': 'Chemistry',
        'Periodic Table and Properties': 'Chemistry',
        'Chemical and Physical Bonds': 'Chemistry',
        'Chemical Reactions and Calculations': 'Chemistry',
        'Chemical Solutions': 'Chemistry',
        'Gases': 'Chemistry',
        'Thermochemistry': 'Chemistry',
        'Chemical Equilibrium': 'Chemistry',
        'Acids and Bases': 'Chemistry',
        'Oxidation and Reduction': 'Chemistry',
        'Electrochemistry': 'Chemistry',
        'Hydrocarbons': 'Chemistry',
        'Hydrocarbon Derivatives': 'Chemistry',
        'Biochemistry': 'Chemistry',

        // Biology Skills (SAAT English)
        'Study of Life': 'Biology',
        'Diversity of Life': 'Biology',
        'Bacteria and Viruses': 'Biology',
        'Protists': 'Biology',
        'Fungi': 'Biology',
        'Introduction to Animals': 'Biology',
        'Worms and Mollusks': 'Biology',
        'Arthropods': 'Biology',
        'Echinoderms and Invertebrate Chordates': 'Biology',
        'Fish and Amphibians': 'Biology',
        'Reptiles and Birds': 'Biology',
        'Mammals': 'Biology',
        'Introduction to Plants': 'Biology',
        'Plant Structure and Function': 'Biology',
        'Plant Reproduction': 'Biology',
        'Skeletal and Muscular Systems': 'Biology',
        'Nervous System': 'Biology',
        'Circulatory Respiratory and Excretory Systems': 'Biology',
        'Digestive and Endocrine Systems': 'Biology',
        'Human Reproduction and Development': 'Biology',
        'Immune System': 'Biology',
        'Cell Structure and Function': 'Biology',
        'Cellular Energy': 'Biology',
        'Cell Reproduction': 'Biology',
        'Sexual Reproduction and Genetics': 'Biology',
        'Complex Inheritance and Human Genetics': 'Biology',
        'Principles of Ecology': 'Biology',
        'Communities and Biomes': 'Biology',
        'Population Ecology': 'Biology',
        'Biodiversity and Conservation': 'Biology',
        'Animal Behavior': 'Biology'
    };

    // Function to get category from skill name
    const getCategoryFromSkill = (skillName) => {
        return SKILL_CATEGORIES[skillName] || 'أخرى';
    };

    // Aggregate scores by category based on skills across all sections
    const getAggregatedCategories = (examData, allReviews) => {
        if (!examData || !allReviews || allReviews.length === 0) {
            return [];
        }

        // Category aggregation maps
        const categoriesMap = new Map();

        examData.forEach((sectionQuestions, sectionIndex) => {
            const sectionReviewQuestions = allReviews[sectionIndex] || [];

            sectionQuestions.forEach((question, qIndex) => {
                const reviewQuestion = sectionReviewQuestions[qIndex];
                const isCorrect = reviewQuestion?.selectedAnswer === question?.correctAnswer;

                // Get category from the question's skills
                question?.skills?.forEach(skill => {
                    const skillName = skill.text || skill;
                    const category = getCategoryFromSkill(skillName);

                    // Initialize category if not exists
                    if (!categoriesMap.has(category)) {
                        categoriesMap.set(category, {
                            title: category,
                            score: 0,
                            totalQuestions: 0,
                            skillsMap: new Map()
                        });
                    }

                    const categoryData = categoriesMap.get(category);
                    categoryData.totalQuestions++;
                    if (isCorrect) {
                        categoryData.score++;
                    }

                    // Group by skills within category
                    if (!categoryData.skillsMap.has(skillName)) {
                        categoryData.skillsMap.set(skillName, {
                            title: skillName,
                            correctAnswers: 0,
                            numberOfQuestions: 0
                        });
                    }

                    const skillData = categoryData.skillsMap.get(skillName);
                    skillData.numberOfQuestions++;
                    if (isCorrect) {
                        skillData.correctAnswers++;
                    }
                });
            });
        });

        // Convert maps to arrays and calculate percentages
        return Array.from(categoriesMap.values()).map(category => ({
            title: category.title,
            score: category.score,
            totalQuestions: category.totalQuestions,
            skills: Array.from(category.skillsMap.values()).map(skill => ({
                ...skill,
                score: skill.numberOfQuestions > 0
                    ? Math.round((skill.correctAnswers / skill.numberOfQuestions) * 100)
                    : 0
            }))
        }));
    };

    const calculateTime = () => {
        let totalMinutes, totalSeconds;
        totalMinutes = 0;
        totalSeconds = 0;

        elapsedTime.map((time) => {
            if (!time) return; // Guard against undefined/null times
            const parts = time.toString().split(':'); // numeric time is converted to string
            const minutes = parseInt(parts[0]) || 0;
            const seconds = parseInt(parts[1]) || 0;

            totalMinutes += minutes;
            totalSeconds += seconds;
        });

        console.log("🚀 ~ calculateTime ~ totalMinutes: ", totalMinutes)

        console.log("🚀 ~ calculateTime ~ totalSeconds: ", totalSeconds)

        while (totalSeconds > 59) {
            totalMinutes++;
            totalSeconds -= 60;
        }

        return `${totalMinutes}:${totalSeconds}`
    }

    const score = calculateScore(flatQuestions, flatReviews);
    const correctAnswers = getCorrectAnswers(flatQuestions, flatReviews);
    const unAnswered = getNotAnsweredQuestions();
    const marked = getMarkedQuestions();

    // Use saved sections if provided, otherwise calculate them
    const sections = savedSections || getSections(examData, reviewQuestions);

    const getSectionDetails = (allReviews, examData) => {
        if (!allReviews || !examData || allReviews.length === 0) {
            return [];
        }

        return allReviews.map((sectionQuestions, index) => {
            // Calculate score for section
            let correctAnswers = 0;
            sectionQuestions.forEach((question, i) => {
                const questionIndex = examData[index]?.findIndex(q => q._id === question.id);
                if (questionIndex >= 0 && question?.selectedAnswer === examData[index][questionIndex]?.correctAnswer) {
                    correctAnswers++;
                }
            });

            const sectionScore = Math.round((correctAnswers / sectionQuestions.length) * 100);

            return {
                title: CurrentExam?.sections?.[index]?.title || `القسم ${index + 1}`,
                score: sectionScore || 0,
                correctAnswers: correctAnswers || 0,
                numberOfQuestions: sectionQuestions?.length || 0,
                time: elapsedTime[index] || 0
            };
        });
    };

    // Use saved section details if provided, otherwise calculate them
    const sectionDetails = savedSectionDetails || getSectionDetails(allReviews, examData)

    // Get aggregated categories (كمي/لفظي totals)
    const aggregatedCategories = getAggregatedCategories(examData, reviewQuestions);

    // Add to results object
    const results = {
        score: score,
        totalQuestions: totalQuestions,
        totalTime: totalTime,
        timeSpent: calculateTime(),
        correctQuestions: correctAnswers,
        wrongQuestions: totalQuestions - correctAnswers,
        unansweredQuestions: unAnswered,
        markedQuestions: marked,
        sections: sections,
        sectionDetails: sectionDetails,
        aggregatedCategories: aggregatedCategories
    };

    console.log("🚀 ~ ExamResults ~ results:", results)

    // Render progress circle with percentage
    const ProgressCircle = ({ score, totalQuestions, size = 100, displayText = true }) => {
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const safeTotal = totalQuestions === 0 ? 1 : totalQuestions;
        const safeScore = score || 0;
        const strokeDashoffset = circumference - (safeScore / safeTotal) * circumference;
        const percentage = totalQuestions === 0 ? 0 : Math.round((safeScore / safeTotal) * 100);
        return (
            <div className={styles.progressCircleContainer}>
                <svg width={size} height={size} viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="#e6e6e6"
                        strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="#19A337"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                    />
                    {/* Percentage text */}
                    <text x="50" y={displayText ? "45" : "55"} textAnchor="middle" fontSize={displayText ? "16" : "26"} fontWeight="bold">
                        {percentage}%
                    </text>
                    {displayText &&
                        <text x="50" y="65" textAnchor="middle" fontSize="12">
                            {safeScore}/{totalQuestions}
                        </text>
                    }
                </svg>
            </div>
        );
    };

    return (
        <div className={styles.resultsContainer}>
            <div className={styles.resultsHeader}>
                <h1>نتائج واحصائيات الاختبار</h1>
            </div>

            {/* Main score */}
            <div className={styles.mainScoreContainer}>
                <ProgressCircle score={results.correctQuestions} totalQuestions={results.totalQuestions} size={120} />
                <div className={styles.scoreLabel}>درجة الاختبار</div>
            </div>

            {/* Stats summary */}
            <div className={styles.statsContainer}>
                {/* First row - Question stats */}
                <div className={styles.statsSummary}>
                    {/* Incomplete question */}
                    <div className={styles.statsItem}>
                        <div className={styles.statsTopRow}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 32 32" fill="none">
                                <g clip-path="url(#clip0_198_6381)">
                                    <path opacity="0.3" d="M15.9999 5.33398C10.1199 5.33398 5.33328 10.1207 5.33328 16.0007C5.33328 21.8807 10.1199 26.6673 15.9999 26.6673C21.8799 26.6673 26.6666 21.8807 26.6666 16.0007C26.6666 10.1207 21.8799 5.33398 15.9999 5.33398ZM17.3333 22.6673H14.6666V14.6673H17.3333V22.6673ZM17.3333 12.0007H14.6666V9.33398H17.3333V12.0007Z" fill="#FFBF00" />
                                    <path d="M14.6666 9.33268H17.3333V11.9993H14.6666V9.33268ZM14.6666 14.666H17.3333V22.666H14.6666V14.666ZM15.9999 2.66602C8.63993 2.66602 2.6666 8.63935 2.6666 15.9993C2.6666 23.3593 8.63993 29.3327 15.9999 29.3327C23.3599 29.3327 29.3333 23.3593 29.3333 15.9993C29.3333 8.63935 23.3599 2.66602 15.9999 2.66602ZM15.9999 26.666C10.1199 26.666 5.33326 21.8793 5.33326 15.9993C5.33326 10.1193 10.1199 5.33268 15.9999 5.33268C21.8799 5.33268 26.6666 10.1193 26.6666 15.9993C26.6666 21.8793 21.8799 26.666 15.9999 26.666Z" fill="#FFBF00" />
                                    <path d="M14.6666 9.33268H17.3333V11.9993H14.6666V9.33268ZM14.6666 14.666H17.3333V22.666H14.6666V14.666ZM15.9999 2.66602C8.63993 2.66602 2.6666 8.63935 2.6666 15.9993C2.6666 23.3593 8.63993 29.3327 15.9999 29.3327C23.3599 29.3327 29.3333 23.3593 29.3333 15.9993C29.3333 8.63935 23.3599 2.66602 15.9999 2.66602ZM15.9999 26.666C10.1199 26.666 5.33326 21.8793 5.33326 15.9993C5.33326 10.1193 10.1199 5.33268 15.9999 5.33268C21.8799 5.33268 26.6666 10.1193 26.6666 15.9993C26.6666 21.8793 21.8799 26.666 15.9999 26.666Z" fill="black" fill-opacity="0.2" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_198_6381">
                                        <rect width="32" height="32" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <div className={styles.statsTextItem}>
                            <div className={styles.statsCount}>{results.unansweredQuestions}</div>
                            <div className={styles.statsText}>سؤال غير مكتمل</div>
                        </div>
                    </div>

                    {/* Correct question */}
                    <div className={styles.statsItem}>
                        <div className={styles.statsTopRow}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 33 32" fill="none">
                                <g clip-path="url(#clip0_198_6145)">
                                    <path opacity="0.3" d="M16.6667 5.33398C10.7867 5.33398 6 10.1207 6 16.0007C6 21.8807 10.7867 26.6673 16.6667 26.6673C22.5467 26.6673 27.3333 21.8807 27.3333 16.0007C27.3333 10.1207 22.5467 5.33398 16.6667 5.33398ZM14 22.6673L8.66667 17.334L10.5467 15.454L14 18.894L22.7867 10.1073L24.6667 12.0007L14 22.6673Z" fill="#008000" />
                                    <path d="M16.6667 2.66602C9.30671 2.66602 3.33337 8.63935 3.33337 15.9993C3.33337 23.3593 9.30671 29.3327 16.6667 29.3327C24.0267 29.3327 30 23.3593 30 15.9993C30 8.63935 24.0267 2.66602 16.6667 2.66602ZM16.6667 26.666C10.7867 26.666 6.00004 21.8793 6.00004 15.9993C6.00004 10.1193 10.7867 5.33268 16.6667 5.33268C22.5467 5.33268 27.3334 10.1193 27.3334 15.9993C27.3334 21.8793 22.5467 26.666 16.6667 26.666ZM22.7867 10.106L14 18.8927L10.5467 15.4527L8.66671 17.3327L14 22.666L24.6667 11.9993L22.7867 10.106Z" fill="#008000" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_198_6145">
                                        <rect width="32" height="32" fill="white" transform="translate(0.666687)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <div className={styles.statsTextItem}>
                            <div className={styles.statsCount}>{results.correctQuestions}</div>
                            <div className={styles.statsText}>سؤال صحيح</div>
                        </div>
                    </div>

                    {/* Wrong question */}
                    <div className={styles.statsItem}>
                        <div className={styles.statsTopRow}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 33 32" fill="none">
                                <g clip-path="url(#clip0_198_6137)">
                                    <path opacity="0.3" d="M16.3334 5.33398C10.4534 5.33398 5.66675 10.1207 5.66675 16.0007C5.66675 21.8807 10.4534 26.6673 16.3334 26.6673C22.2134 26.6673 27.0001 21.8807 27.0001 16.0007C27.0001 10.1207 22.2134 5.33398 16.3334 5.33398ZM21.6667 19.454L19.7867 21.334L16.3334 17.8807L12.8801 21.334L11.0001 19.454L14.4534 16.0007L11.0001 12.5473L12.8801 10.6673L16.3334 14.1207L19.7867 10.6673L21.6667 12.5473L18.2134 16.0007L21.6667 19.454Z" fill="#C80E08" />
                                    <path d="M19.7867 10.666L16.3333 14.1193L12.88 10.666L11 12.546L14.4533 15.9993L11 19.4527L12.88 21.3327L16.3333 17.8793L19.7867 21.3327L21.6667 19.4527L18.2133 15.9993L21.6667 12.546L19.7867 10.666ZM16.3333 2.66602C8.96 2.66602 3 8.62602 3 15.9993C3 23.3727 8.96 29.3327 16.3333 29.3327C23.7067 29.3327 29.6667 23.3727 29.6667 15.9993C29.6667 8.62602 23.7067 2.66602 16.3333 2.66602ZM16.3333 26.666C10.4533 26.666 5.66667 21.8793 5.66667 15.9993C5.66667 10.1193 10.4533 5.33268 16.3333 5.33268C22.2133 5.33268 27 10.1193 27 15.9993C27 21.8793 22.2133 26.666 16.3333 26.666Z" fill="#C80E08" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_198_6137">
                                        <rect width="32" height="32" fill="white" transform="translate(0.333374)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <div className={styles.statsTextItem}>
                            <div className={styles.statsCount}>{results.wrongQuestions}</div>
                            <div className={styles.statsText}>سؤال خاطئ</div>
                        </div>
                    </div>
                    {/* Marked question */}
                    <div className={styles.statsItem}>
                        <div className={styles.statsTopRow}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g clip-path="url(#clip0_198_6154)">
                                    <path d="M12.36 6H7.00003V12H14.24L14.64 14H18V8H12.76L12.36 6Z" fill="#B4F3E9" />
                                    <path d="M14.3999 6L13.9999 4H4.99991V21H6.99991V14H12.5999L12.9999 16H19.9999V6H14.3999ZM17.9999 14H14.6399L14.2399 12H6.99991V6H12.3599L12.7599 8H17.9999V14Z" fill="#03D4B4" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_198_6154">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <div className={styles.statsTextItem}>
                            <div className={styles.statsCount}>{results.markedQuestions}</div>
                            <div className={styles.statsText}>سؤال مميز بعلامة</div>
                        </div>
                    </div>

                    {/* Exam duration */}
                    <div className={styles.statsItem}>
                        <div className={styles.statsTopRow}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 33 32" fill="none">
                                <g clip-path="url(#clip0_198_6404)">
                                    <path opacity="0.3" d="M16.6667 8C11.5067 8 7.33337 12.1733 7.33337 17.3333C7.33337 22.4933 11.5067 26.6667 16.6667 26.6667C21.8267 26.6667 26 22.4933 26 17.3333C26 12.1733 21.8267 8 16.6667 8ZM18 18.6667H15.3334V10.6667H18V18.6667Z" fill="black" />
                                    <path d="M20.6667 1.33398H12.6667V4.00065H20.6667V1.33398Z" fill="black" />
                                    <path d="M26.04 9.85398L27.9334 7.96065C27.36 7.28065 26.7334 6.64065 26.0534 6.08065L24.16 7.97398C22.0934 6.32065 19.4934 5.33398 16.6667 5.33398C10.04 5.33398 4.66669 10.7073 4.66669 17.334C4.66669 23.9607 10.0267 29.334 16.6667 29.334C23.3067 29.334 28.6667 23.9607 28.6667 17.334C28.6667 14.5073 27.68 11.9073 26.04 9.85398ZM16.6667 26.6673C11.5067 26.6673 7.33335 22.494 7.33335 17.334C7.33335 12.174 11.5067 8.00065 16.6667 8.00065C21.8267 8.00065 26 12.174 26 17.334C26 22.494 21.8267 26.6673 16.6667 26.6673Z" fill="black" />
                                    <path d="M18 10.668H15.3334V18.668H18V10.668Z" fill="black" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_198_6404">
                                        <rect width="32" height="32" fill="white" transform="translate(0.666687)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <div className={styles.statsTextItem}>
                            <div className={styles.statsCount}>{results.totalTime} دقيقة</div>
                            <div className={styles.statsText}>مدة الاختبار</div>
                        </div>
                    </div>

                    {/* Time spent */}
                    <div className={styles.statsItem}>
                        <div className={styles.statsTopRow}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 33 32" fill="none">
                                <g clip-path="url(#clip0_198_6404)">
                                    <path opacity="0.3" d="M16.6667 8C11.5067 8 7.33337 12.1733 7.33337 17.3333C7.33337 22.4933 11.5067 26.6667 16.6667 26.6667C21.8267 26.6667 26 22.4933 26 17.3333C26 12.1733 21.8267 8 16.6667 8ZM18 18.6667H15.3334V10.6667H18V18.6667Z" fill="black" />
                                    <path d="M20.6667 1.33398H12.6667V4.00065H20.6667V1.33398Z" fill="black" />
                                    <path d="M26.04 9.85398L27.9334 7.96065C27.36 7.28065 26.7334 6.64065 26.0534 6.08065L24.16 7.97398C22.0934 6.32065 19.4934 5.33398 16.6667 5.33398C10.04 5.33398 4.66669 10.7073 4.66669 17.334C4.66669 23.9607 10.0267 29.334 16.6667 29.334C23.3067 29.334 28.6667 23.9607 28.6667 17.334C28.6667 14.5073 27.68 11.9073 26.04 9.85398ZM16.6667 26.6673C11.5067 26.6673 7.33335 22.494 7.33335 17.334C7.33335 12.174 11.5067 8.00065 16.6667 8.00065C21.8267 8.00065 26 12.174 26 17.334C26 22.494 21.8267 26.6673 16.6667 26.6673Z" fill="black" />
                                    <path d="M18 10.668H15.3334V18.668H18V10.668Z" fill="black" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_198_6404">
                                        <rect width="32" height="32" fill="white" transform="translate(0.666687)" />
                                    </clipPath>
                                </defs>
                            </svg>

                        </div>
                        <div className={styles.statsTextItem}>
                            <div className={styles.statsCount}>{results.timeSpent} دقيقة</div>
                            <div className={styles.statsText}>إجمالي الوقت المستغرق</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category totals (كمي/لفظي) */}
            <div className={styles.sectionsContainer}>
                {results.aggregatedCategories.map((category, index) => (
                    <div key={index} className={styles.sectionBox}>
                        <div className={styles.sectionHeader}>
                            <ProgressCircle score={category.score} totalQuestions={category.totalQuestions} size={80} />
                            <h3>{category.title}</h3>
                        </div>
                        <div className={styles.skillsList}>
                            {category.skills.map((skill, skillIndex) => (
                                <div key={skillIndex} className={styles.skillItem}>
                                    <div className={styles.skillTitle}>{skill.title}</div>
                                    <div className={styles.scoreContainer}>
                                        <div className={styles.skillScore}>{skill.correctAnswers} / {skill.numberOfQuestions}</div>
                                        <div className={styles.skillScore}>
                                            <ProgressCircle score={skill.correctAnswers} totalQuestions={skill.numberOfQuestions} size={35} displayText={false} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Section details */}
            <div className={styles.sectionDetailsContainer}>
                <table className={styles.detailsTable}>
                    <thead >
                        تفاصيل الأقسام
                    </thead>
                    <tbody>
                        {results.sectionDetails.map((detail, index) => (
                            <tr key={index} className={styles.tableRow}>
                                <td >{detail.title}</td>
                                <td >
                                    <div className={styles.skillScore}>
                                        <ProgressCircle score={detail.correctAnswers} totalQuestions={detail.numberOfQuestions} size={35} displayText={false} />
                                    </div>
                                </td>
                                <td >
                                    <span>{detail.correctAnswers} / {detail.numberOfQuestions}</span>
                                </td>
                                <td className={styles.timer}>
                                    <div style={{ width: '28px', height: '28px' }} >
                                        <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_207_14210)">
                                                <path opacity="0.3" d="M9.00117 4.5C6.09867 4.5 3.75117 6.8475 3.75117 9.75C3.75117 12.6525 6.09867 15 9.00117 15C11.9037 15 14.2512 12.6525 14.2512 9.75C14.2512 6.8475 11.9037 4.5 9.00117 4.5ZM9.75117 10.5H8.25117V6H9.75117V10.5Z" fill="black" />
                                                <path d="M11.25 0.75H6.75V2.25H11.25V0.75Z" fill="black" />
                                                <path d="M14.2725 5.5425L15.3375 4.4775C15.015 4.095 14.6625 3.735 14.28 3.42L13.215 4.485C12.0525 3.555 10.59 3 9 3C5.2725 3 2.25 6.0225 2.25 9.75C2.25 13.4775 5.265 16.5 9 16.5C12.735 16.5 15.75 13.4775 15.75 9.75C15.75 8.16 15.195 6.6975 14.2725 5.5425ZM9 15C6.0975 15 3.75 12.6525 3.75 9.75C3.75 6.8475 6.0975 4.5 9 4.5C11.9025 4.5 14.25 6.8475 14.25 9.75C14.25 12.6525 11.9025 15 9 15Z" fill="black" />
                                                <path d="M9.75117 6H8.25117V10.5H9.75117V6Z" fill="black" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_207_14210">
                                                    <rect width="18" height="18" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    {detail.time}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Action buttons */}
            <div className={styles.actionButtons}>
                {!hideRetakeButton && (
                    <button className={styles.retakeButton} onClick={onRetakeExam}>
                        إعادة الاختبار
                    </button>
                )}
                <button className={styles.reviewButton} onClick={onReviewAnswers}>
                    مراجعة الأسئلة والأجوبة الصحيحة
                </button>
            </div>
        </div>
    );
};

export default ExamResults;