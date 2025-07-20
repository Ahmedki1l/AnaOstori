import React from 'react';
import Image from "next/image";
import styles from '../../styles/ReviewSection.module.scss';

interface QuestionItem {
    id: number;
    answered: boolean;
    isMarked: boolean;
}

interface ReviewSectionProps {
    title: string;
    examTitle: string;
    currentTime: string;
    instructionsTitle: string;
    instructions: {
        intro: string[];
        list: string[];
        conclusion: string;
    };
    sectionTitle: string;
    questions: QuestionItem[];
    buttonLabels: {
        reviewMarked: string;
        reviewIncomplete: string;
        reviewAll: string;
        finishReview: string;
        markQuestion: string;
    };
    questionLabel: string;
    incompleteLabel: string;
    completeLabel: string;
    onReviewAll: () => void;
    onReviewIncomplete: () => void;
    onReviewMarked: () => void;
    onFinishReview: () => void;
    onQuestionClick: (index: number) => void;
    onMarkQuestion: () => void;
}

const ReviewSection = ({
    title,
    examTitle,
    currentTime,
    instructionsTitle,
    instructions,
    sectionTitle,
    questions,
    buttonLabels,
    questionLabel,
    incompleteLabel,
    completeLabel,
    onReviewAll,
    onReviewIncomplete,
    onReviewMarked,
    onFinishReview,
    onQuestionClick,
    onMarkQuestion, 
    formatTime,
    timeLeft,
    CurrentExam
}) => {
    return (
        <div className={styles.div}>
            <div className={styles.frameParent3}>
                <div className={styles.frameParent4}>
                    <div className={styles.group}>
                        <span className={styles.timerText}>{formatTime(timeLeft)}</span>
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
                    </div>
                    {/* <div className={styles.textParent11} onClick={onMarkQuestion}>
                        <div className={styles.text}>{buttonLabels.markQuestion}</div>
                        <Image className={styles.frameIcon} width={24} height={24} alt="" src="/icons/bookmark-outline.svg" />
                    </div> */}
                </div>
                <div className={styles.div5}>{CurrentExam?.title}</div>
                <div className={styles.frameChild}></div>
            </div>
            <div className={styles.inner}>
                <div className={styles.parent}>
                    <b className={styles.b}>{title}</b>
                    <div className={styles.frameParent}>
                        <div className={styles.textWrapper}>
                            <div className={styles.text}>{instructionsTitle}</div>
                        </div>
                        <div className={styles.div1}>
                            {instructions.intro.map((paragraph, idx) => (
                                <p key={`intro-${idx}`} className={styles.p}>{paragraph}</p>
                            ))}
                        </div>
                        <div className={styles.div2}>
                            <ol className={styles.ol}>
                                {instructions.list.map((item, idx) => (
                                    <li key={`list-${idx}`} className={idx < instructions.list.length - 1 ? styles.li : ''}>{item}</li>
                                ))}
                            </ol>
                        </div>
                        <div className={styles.div1}>{instructions.conclusion}</div>
                        <div className={styles.textContainer}>
                            <div className={styles.text}>{sectionTitle}</div>
                        </div>
                        <div className={styles.frameGroup}>
                            <div className={styles.frameContainer}>
                                {questions && questions.map((question, index) => (
                                    <div
                                        key={`question-${index}`}
                                        className={styles.textParent}
                                        onClick={() => onQuestionClick && onQuestionClick(index)}
                                    >
                                        <div className={styles.text}>
                                            {question.answered ? "" : incompleteLabel}
                                        </div>
                                        <div className={styles.textGroup}>
                                            <div className={styles.text}>{questionLabel} {index + 1}</div>
                                            {question.isMarked ?
                                                <div className={styles.svgIcon} >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <g clip-path="url(#clip0_194_8160)">
                                                            <path d="M12.36 6H7V12H14.24L14.64 14H18V8H12.76L12.36 6Z" fill="#F26722" />
                                                            <path d="M14.4 6L14 4H5V21H7V14H12.6L13 16H20V6H14.4ZM18 14H14.64L14.24 12H7V6H12.36L12.76 8H18V14Z" fill="#F26722" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_194_8160">
                                                                <rect width="24" height="24" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </div>
                                                :
                                                <div className={styles.svgIcon} >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <g clip-path="url(#clip0_194_8168)">
                                                            <path d="M14.4 6L14 4H5V21H7V14H12.6L13 16H20V6H14.4ZM18 14H14.64L14.24 12H7V6H12.36L12.76 8H18V14Z" fill="black" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_194_8168">
                                                                <rect width="24" height="24" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.frameParent1}>
                <div className={styles.frameParent2}>
                    <div className={styles.textParent8} onClick={onReviewMarked}>
                        <div className={styles.text}>{buttonLabels.reviewMarked}</div>
                        <div style={{ width: '24px', height: '24px' }} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g clip-path="url(#clip0_194_8182)">
                                    <path d="M12.36 6H7V12H14.24L14.64 14H18V8H12.76L12.36 6Z" fill="white" />
                                    <path d="M14.4 6L14 4H5V21H7V14H12.6L13 16H20V6H14.4ZM18 14H14.64L14.24 12H7V6H12.36L12.76 8H18V14Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_194_8182">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </div>
                    <div className={styles.textParent8} onClick={onReviewIncomplete}>
                        <div className={styles.text}>{buttonLabels.reviewIncomplete}</div>
                        <div style={{ width: '24px', height: '24px' }} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path opacity="0.3" d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="white" />
                                <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z" fill="white" />
                            </svg>
                        </div>
                    </div>
                    <div className={styles.textFrame} onClick={onReviewAll}>
                        <div className={styles.text}>{buttonLabels.reviewAll}</div>
                    </div>
                </div>
                <div className={styles.frameWrapper}>
                    <div className={styles.textParent8} onClick={onFinishReview}>
                        <div className={styles.text}>{buttonLabels.finishReview}</div>
                        <div style={{ width: '24px', height: '24px' }} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g clip-path="url(#clip0_194_8196)">
                                    <path d="M5 5H12V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H12V19H5V5ZM21 12L17 8V11H9V13H17V16L21 12Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_194_8196">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;