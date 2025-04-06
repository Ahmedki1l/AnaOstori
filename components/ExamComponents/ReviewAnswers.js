import React, { useState } from 'react';
import styles from '../../styles/ExamPage.module.scss';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';

const ReviewAnswers = ({
    examData,
    onCompleteExam,
    currentTime,
    reviewQuestions,
    setReviewQuestions,
    currentQuestionIndex,
    showReviewSection,
    finishReview
}) => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [currentReviewQuestionIndex, setCurrentReviewQuestionIndex] = useState(currentQuestionIndex);

    console.log(currentReviewQuestionIndex);

    const questions = examData?.questions;
    const currentQuestion = questions[currentReviewQuestionIndex] || {};
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
        if (currentReviewQuestionIndex < questions.length - 1) {
            setCurrentReviewQuestionIndex(currentReviewQuestionIndex + 1);
        } else {
            // Last question, submit the exam
            onCompleteExam && onCompleteExam(selectedAnswers);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentReviewQuestionIndex > 0) {
            setCurrentReviewQuestionIndex(currentReviewQuestionIndex - 1);
        }
    };

    const handleMarkQuestion = () => {
        setReviewQuestions((prev) => {
            const updatedQuestions = [...prev];
            const questionIndex = updatedQuestions.findIndex(q => q.id === currentQuestion.id);
            if (questionIndex !== -1) {
                updatedQuestions[questionIndex] = {
                    ...updatedQuestions[questionIndex],
                    isMarked: !updatedQuestions[questionIndex].isMarked
                };
            }
            return updatedQuestions;
        });
    };

    const isCurrentQuestionMarked = reviewQuestions.find(q => q.id === currentQuestion.id)?.isMarked || false;

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
                    <span className={styles.timerText}>{currentTime || "25:00"}</span>
                </div>
                <h1 className={styles.examTitle}>عنوان الاختبار هنا</h1>
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
                            <span className={styles.sectionTitle}>القسم الأول</span>
                        </div>
                        <span className={styles.questionNumber}>سؤال {currentReviewQuestionIndex + 1} من {totalQuestions}</span>
                    </div>

                    <div className={styles.questionBody}>
                        <p className={styles.questionText}>{currentQuestion.text}</p>

                        <div className={styles.optionsContainer}>
                            {currentQuestion.options && currentQuestion.options.map((option) => (
                                <div
                                    key={option.id}
                                    className={`${styles.optionRow} ${currentQuestion.correctAnswer === option.id ? styles.optionRowCorrect : reviewQuestions.find(q => q.id === currentQuestion.id)?.selectedAnswer === option.id && currentQuestion.correctAnswer !== option.id ? styles.optionRowFalse : ''}`}
                                    onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                                >
                                    <input
                                        type="radio"
                                        id={`option-${option.id}`}
                                        name="question-option"
                                        className={styles.optionRadio}
                                        checked={reviewQuestions.find(q => q.id === currentQuestion.id)?.selectedAnswer === option.id}
                                        onChange={() => { }}
                                    />
                                    <label className={styles.optionLabel} htmlFor={`option-${option.id}`}>
                                        {option.id}
                                    </label>
                                    <div className={styles.optionText}>{option.text}</div>
                                    {currentQuestion.correctAnswer === option.id &&
                                        <div className={styles.optionIconMark}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <g clip-path="url(#clip0_215_3758)">
                                                    <path opacity="0.3" d="M12 4C7.59 4 4 7.59 4 12C4 16.41 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="#19A337" />
                                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" fill="#19A337" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_215_3758">
                                                        <rect width="24" height="24" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                    }
                                    {
                                        reviewQuestions.find(q => q.id === currentQuestion.id)?.selectedAnswer === option.id &&
                                        currentQuestion.correctAnswer !== option.id &&
                                        <div className={styles.optionIconMark}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <g clip-path="url(#clip0_215_3753)">
                                                    <path opacity="0.3" d="M12 4.00195C7.59 4.00195 4 7.59195 4 12.002C4 16.412 7.59 20.002 12 20.002C16.41 20.002 20 16.412 20 12.002C20 7.59195 16.41 4.00195 12 4.00195ZM16 14.592L14.59 16.002L12 13.412L9.41 16.002L8 14.592L10.59 12.002L8 9.41195L9.41 8.00195L12 10.592L14.59 8.00195L16 9.41195L13.41 12.002L16 14.592Z" fill="#FF0000" />
                                                    <path d="M14.59 7.99805L12 10.588L9.41 7.99805L8 9.40805L10.59 11.998L8 14.588L9.41 15.998L12 13.408L14.59 15.998L16 14.588L13.41 11.998L16 9.40805L14.59 7.99805ZM12 1.99805C6.47 1.99805 2 6.46805 2 11.998C2 17.528 6.47 21.998 12 21.998C17.53 21.998 22 17.528 22 11.998C22 6.46805 17.53 1.99805 12 1.99805ZM12 19.998C7.59 19.998 4 16.408 4 11.998C4 7.58805 7.59 3.99805 12 3.99805C16.41 3.99805 20 7.58805 20 11.998C20 16.408 16.41 19.998 12 19.998Z" fill="#FF0000" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_215_3753">
                                                        <rect width="24" height="24" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={styles.buttonsContainer}
            >
                <div className={styles.examActions}>
                    {currentReviewQuestionIndex !== 0 &&
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
                        <span>التالي</span>
                        <AllIconsComponenet iconName="arrowLeft" height={16} width={16} color="#FFFFFF" />
                    </button>
                </div>

                <div className={styles.examActions2}>
                    <button
                        className={styles.nextButton}
                        onClick={finishReview}
                    >
                        <div style={{ width: '28px', height: '28px' }} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g clip-path="url(#clip0_205_4266)">
                                    <path d="M8 9H4V20H8V9Z" fill="white" />
                                    <path d="M20 13H16V20H20V13Z" fill="white" />
                                    <path d="M14 4H10V20H14V4Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_205_4266">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <span>ملخص النتائج</span>
                    </button>

                    <button
                        className={styles.nextButton}
                        onClick={showReviewSection}
                    >
                        <div style={{ width: '28px', height: '28px' }} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g clip-path="url(#clip0_205_4276)">
                                    <path d="M7 5H21V7H7V5Z" fill="white" />
                                    <path d="M4 7.5C4.82843 7.5 5.5 6.82843 5.5 6C5.5 5.17157 4.82843 4.5 4 4.5C3.17157 4.5 2.5 5.17157 2.5 6C2.5 6.82843 3.17157 7.5 4 7.5Z" fill="white" />
                                    <path d="M7 11H21V13H7V11ZM7 17H21V19H7V17ZM4 19.5C4.82 19.5 5.5 18.82 5.5 18C5.5 17.18 4.83 16.5 4 16.5C3.17 16.5 2.5 17.18 2.5 18C2.5 18.82 3.18 19.5 4 19.5Z" fill="white" />
                                    <path d="M4 13.5C4.82843 13.5 5.5 12.8284 5.5 12C5.5 11.1716 4.82843 10.5 4 10.5C3.17157 10.5 2.5 11.1716 2.5 12C2.5 12.8284 3.17157 13.5 4 13.5Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_205_4276">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <span>شاشة الأقسام</span>
                    </button>

                    <button
                        className={styles.nextButton}
                        onClick={showReviewSection}
                    >
                        <div style={{ width: '28px', height: '28px' }} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                <g clip-path="url(#clip0_205_4261)">
                                    <path d="M18.1498 6.35C16.6998 4.9 14.7098 4 12.4998 4C8.07977 4 4.50977 7.58 4.50977 12C4.50977 16.42 8.07977 20 12.4998 20C16.2298 20 19.3398 17.45 20.2298 14H18.1498C17.3298 16.33 15.1098 18 12.4998 18C9.18977 18 6.49977 15.31 6.49977 12C6.49977 8.69 9.18977 6 12.4998 6C14.1598 6 15.6398 6.69 16.7198 7.78L13.4998 11H20.4998V4L18.1498 6.35Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_205_4261">
                                        <rect width="24" height="24" fill="white" transform="translate(0.5)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <span>إعادة الاختبار</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewAnswers;