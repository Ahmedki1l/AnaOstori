import React, { useState } from 'react';
import styles from '../../styles/ExamPage.module.scss';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import ImageLightbox from './ImageLightbox';

const ExamQuestions = ({ timeLeft, CurrentExam, examData, onCompleteExam, currentTime, reviewQuestions, setReviewQuestions, formatTime, section }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    // Sample questions data structure
    const mockQuestions = [
        {
            id: 1,
            text: "الجهل بثقافة الآخرين يشكل تلقائيًا نظرة رديئة عنهم.",
            type: "contextual",
            context: "الخطأ السياقي",
            contextDescription: "في الجملة الآتية أربعة كلمات كل منها مكتوبة بخط غليظ، المطلوب هو تحديد الكلمة التي لا يتفق معناها مع المعنى العام للجملة. (الخطأ ليس لغويًا ولا نحويًا).",
            options: [
                { id: 'أ', text: 'الجهل' },
                { id: 'ب', text: 'ثقافة' },
                { id: 'ج', text: 'تلقائيًا' },
                { id: 'د', text: 'رديئة' }
            ],
            correctAnswer: 'ج'
        }
    ];

    const questions = examData?.questions || mockQuestions;
    console.log("🚀 ~ ExamQuestions ~ examData:", examData)
    const currentQuestion = questions[currentQuestionIndex] || {};
    console.log("🚀 ~ ExamQuestions ~ currentQuestion:", currentQuestion);
    const totalQuestions = questions.length;

    const handleSelectAnswer = (questionId, optionId) => {
        setReviewQuestions((prev) => {
            const updatedQuestions = [...prev];
            const questionIndex = updatedQuestions.findIndex(q => q.id === questionId);
            if (questionIndex !== -1) {
                updatedQuestions[questionIndex] = {
                    ...updatedQuestions[questionIndex],
                    answered: true,
                    selectedAnswer: optionId
                };
            }
            return updatedQuestions;
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Last question, submit the exam
            onCompleteExam && onCompleteExam(selectedAnswers);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleMarkQuestion = () => {
        setReviewQuestions((prev) => {
            const updatedQuestions = [...prev];
            const questionIndex = updatedQuestions.findIndex(q => q.id === currentQuestion._id);
            if (questionIndex !== -1) {
                updatedQuestions[questionIndex] = {
                    ...updatedQuestions[questionIndex],
                    isMarked: !updatedQuestions[questionIndex].isMarked
                };
            }
            return updatedQuestions;
        });
    };

    // helper to split & wrap the error word
    const renderQuestionText = () => {
        if (currentQuestion.type !== "contextualError") {
            return currentQuestion.text;
        }

        // pull the error‐words array you previously saved
        const errorWords = currentQuestion.contextualErrorWords || [];

        // preserve spaces when splitting
        const tokens = currentQuestion.text.split(/(\s+)/);

        return tokens.map((token, i) => {
            // render whitespace “as is”
            if (/^\s+$/.test(token)) return token;

            // if this token matches any of the error‐words, wrap it
            if (errorWords.includes(token)) {
                return (
                    <span key={i} className={styles.marked}>
                        {token}
                    </span>
                );
            }

            return token;
        });
    };

    const isCurrentQuestionMarked = reviewQuestions.find(q => q.id === currentQuestion._id)?.isMarked || false;
    console.log("🚀 ~ ExamQuestions ~ reviewQuestions:", reviewQuestions);


    return (
        <div className={styles.examContainer}>
            <div className={styles.examHeader}>
                <div className={styles.timerContainer}>
                    <div style={{ width: '28px', height: '28px' }} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="29" viewBox="0 0 28 29" fill="none">
                            <g clip-path="url(#clip0_194_3803)">
                                <path opacity="0.3" d="M14.0007 7.5C9.48565 7.5 5.83398 11.1517 5.83398 15.6667C5.83398 20.1817 9.48565 23.8333 14.0007 23.8333C18.5157 23.8333 22.1673 20.1817 22.1673 15.6667C22.1673 11.1517 18.5157 7.5 14.0007 7.5ZM15.1673 16.8333H12.834V9.83333H15.1673V16.8333Z" fill="#19A337" />
                                <path d="M17.5 1.66602H10.5V3.99935H17.5V1.66602Z" fill="#19A337" />
                                <path d="M22.2017 9.12102L23.8583 7.46435C23.3567 6.86935 22.8083 6.30935 22.2133 5.81935L20.5567 7.47602C18.7483 6.02935 16.4733 5.16602 14 5.16602C8.20167 5.16602 3.5 9.86768 3.5 15.666C3.5 21.4643 8.19 26.166 14 26.166C19.81 26.166 24.5 21.4643 24.5 15.666C24.5 13.1927 23.6367 10.9177 22.2017 9.12102ZM14 23.8327C9.485 23.8327 5.83333 20.181 5.83333 15.666C5.83333 11.151 9.485 7.49935 14 7.49935C18.515 7.49935 22.1667 11.151 22.1667 15.666C22.1667 20.181 18.515 23.8327 14 23.8327Z" fill="#19A337" />
                                <path d="M15.1673 9.83203H12.834V16.832H15.1673V9.83203Z" fill="#19A337" />
                            </g>
                            <defs>
                                <clipPath id="clip0_194_3803">
                                    <rect width="28" height="28" fill="white" transform="translate(0 0.5)" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <span className={styles.timerText}>{formatTime(timeLeft)}</span>
                </div>
                <h1 className={styles.examTitle}>{CurrentExam?.title}</h1>
                <button
                    className={`${styles.markQuestionBtn} ${isCurrentQuestionMarked ? styles.markQuestionBtnActive : ''}`}
                    onClick={handleMarkQuestion}
                >
                    <div style={{ width: '15px', height: '17px' }} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="18" viewBox="0 0 15 18" fill="none">
                            <path d="M9.4 2.5L9 0.5H0V17.5H2V10.5H7.6L8 12.5H15V2.5H9.4ZM13 10.5H9.64L9.24 8.5H2V2.5H7.36L7.76 4.5H13V10.5Z" fill={isCurrentQuestionMarked ? "white" : "#F26722"} />
                        </svg>
                    </div>
                    <span>{isCurrentQuestionMarked ? "تم التمييز" : "تمييز السؤال"}</span>
                </button>
            </div>

            <div className={styles.questionContent}>
                <div className={styles.questionSidebar}>
                    {currentQuestion.type === "contextual" && (
                        <div className={styles.questionContext}>
                            <h3 className={styles.contextTitle}>{currentQuestion.context}</h3>
                            <p className={styles.contextDescription}>{currentQuestion.contextDescription}</p>
                        </div>
                    )}
                </div>

                <div className={styles.mainQuestionArea}>
                    <div className={styles.questionHeader}>
                        <div className={styles.wrapper}>
                            <span className={styles.sectionTitle}>{section.title}</span>
                        </div>
                        <span className={styles.questionNumber}>سؤال {currentQuestionIndex + 1} من {totalQuestions}</span>
                    </div>

                    <div className={styles.questionBody}>
                        <p className={styles.questionText}>
                            {renderQuestionText()}
                        </p>

                        {/* — Question‐level image, if any — */}
                        {currentQuestion.questionImages && (
                            currentQuestion.questionImages.map((image, index) => (
                                <ImageLightbox
                                    src={image}
                                    alt={`Question ${index + 1}`}
                                />
                            ))
                        )}

                        <div className={styles.optionsContainer}>
                            {currentQuestion.options && currentQuestion.options.map((option) => (
                                <div
                                    key={option.id}
                                    className={styles.optionRow}
                                    onClick={() => handleSelectAnswer(currentQuestion._id, option.id)}
                                >
                                    <input
                                        type="radio"
                                        id={`option-${option.id}`}
                                        name="question-option"
                                        className={styles.optionRadio}
                                        checked={reviewQuestions.find(q => q.id === currentQuestion._id)?.selectedAnswer === option.id}
                                        onChange={() => { }}
                                    />
                                    <label className={styles.optionLabel} htmlFor={`option-${option.id}`}>
                                        {option.id}
                                    </label>
                                    <div className={styles.optionText}>{option.text}</div>

                                    {/* — Option‐level image, if any — */}
                                    {option.images && (
                                        option.images.map((image, index) => (
                                            <ImageLightbox
                                                src={image}
                                                alt={`Option ${option.id}`}
                                            />
                                        ))
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.examActions}>
                {currentQuestionIndex !== 0 &&
                    <button
                        className={styles.nextButton}
                        onClick={handlePreviousQuestion}
                    >
                        <AllIconsComponenet iconName="arrowRight" height={16} width={16} color="#FFFFFF" />
                        <span>السابق</span>
                    </button>
                }

                <button
                    className={styles.nextButton}
                    onClick={handleNextQuestion}
                >
                    <span>{(currentQuestionIndex + 1 < totalQuestions) ? "التالي" : "شاشة المراجعة"}</span>
                    <AllIconsComponenet iconName="arrowLeft" height={16} width={16} color="#FFFFFF" />
                </button>

            </div>
        </div>
    );
};

export default ExamQuestions;