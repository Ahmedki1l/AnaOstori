import React, { useState } from 'react';
import styles from '../../styles/ExamPage.module.scss';

const ExamSectionsReview = ({ examData, onRetakeExam, onViewResults, handleQuestionClick }) => {
    const [expandedSections, setExpandedSections] = useState([0]); // First section expanded by default

    const toggleSection = (index) => {
        if (expandedSections.includes(index)) {
            setExpandedSections(expandedSections.filter(i => i !== index));
        } else {
            setExpandedSections([...expandedSections, index]);
        }
    };

    // Mock data - replace with actual data from props
    const sections = [
        {
            title: "القسم الأول",
            time: "5 دقائق",
            score: "24/5",
            percentage: 70,
            questions: [
                { id: 1, status: "wrong", isMarked: true },
                { id: 1, status: "wrong", isMarked: false },
                { id: 1, status: "incomplete", isMarked: true },
                { id: 1, status: "incomplete", isMarked: false },
                { id: 1, status: "correct", isMarked: true },
                { id: 1, status: "correct", isMarked: false }
            ]
        },
        {
            title: "القسم الثاني",
            time: "10 دقائق",
            score: "24/5",
            percentage: 70,
            questions: [
                { id: 1, status: "wrong", isMarked: true },
                { id: 1, status: "wrong", isMarked: false },
                { id: 1, status: "incomplete", isMarked: true },
                { id: 1, status: "incomplete", isMarked: false },
                { id: 1, status: "correct", isMarked: true },
                { id: 1, status: "correct", isMarked: false }
            ]
        },
        {
            title: "القسم الثالث",
            time: "3 دقائق",
            score: "24/5",
            percentage: 70,
            questions: [
                { id: 1, status: "wrong", isMarked: true },
                { id: 1, status: "wrong", isMarked: false },
                { id: 1, status: "incomplete", isMarked: true },
                { id: 1, status: "incomplete", isMarked: false },
                { id: 1, status: "correct", isMarked: true },
                { id: 1, status: "correct", isMarked: false }
            ]
        },
        {
            title: "القسم الرابع",
            time: "11 دقيقة",
            score: "24/5",
            percentage: 70,
            questions: [
                { id: 1, status: "wrong", isMarked: true },
                { id: 1, status: "wrong", isMarked: false },
                { id: 1, status: "incomplete", isMarked: true },
                { id: 1, status: "incomplete", isMarked: false },
                { id: 1, status: "correct", isMarked: true },
                { id: 1, status: "correct", isMarked: false }
            ]
        },
        {
            title: "القسم الخامس",
            time: "20 دقيقة",
            score: "24/5",
            percentage: 70,
            questions: [
                { id: 1, status: "wrong", isMarked: true },
                { id: 1, status: "wrong", isMarked: false },
                { id: 1, status: "incomplete", isMarked: true },
                { id: 1, status: "incomplete", isMarked: false },
                { id: 1, status: "correct", isMarked: true },
                { id: 1, status: "correct", isMarked: false }
            ]
        }
    ];

    // Status indicator based on question status
    const StatusIcon = ({ status }) => {
        switch (status) {
            case 'correct':
                return (
                    <div className={styles.statusIconWrapper}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clip-path="url(#clip0_207_15359)">
                                <path opacity="0.3" d="M11.9998 4C7.58976 4 3.99976 7.59 3.99976 12C3.99976 16.41 7.58976 20 11.9998 20C16.4098 20 19.9998 16.41 19.9998 12C19.9998 7.59 16.4098 4 11.9998 4ZM9.99976 17L5.99976 13L7.40976 11.59L9.99976 14.17L16.5898 7.58L17.9998 9L9.99976 17Z" fill="#008000" />
                                <path d="M12.0002 2C6.48024 2 2.00024 6.48 2.00024 12C2.00024 17.52 6.48024 22 12.0002 22C17.5202 22 22.0002 17.52 22.0002 12C22.0002 6.48 17.5202 2 12.0002 2ZM12.0002 20C7.59024 20 4.00024 16.41 4.00024 12C4.00024 7.59 7.59024 4 12.0002 4C16.4102 4 20.0002 7.59 20.0002 12C20.0002 16.41 16.4102 20 12.0002 20ZM16.5902 7.58L10.0002 14.17L7.41024 11.59L6.00024 13L10.0002 17L18.0002 9L16.5902 7.58Z" fill="#008000" />
                            </g>
                            <defs>
                                <clipPath id="clip0_207_15359">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                );
            case 'wrong':
                return (
                    <div className={styles.statusIconWrapper}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clip-path="url(#clip0_207_15392)">
                                <path opacity="0.3" d="M11.9998 4C7.58976 4 3.99976 7.59 3.99976 12C3.99976 16.41 7.58976 20 11.9998 20C16.4098 20 19.9998 16.41 19.9998 12C19.9998 7.59 16.4098 4 11.9998 4ZM15.9998 14.59L14.5898 16L11.9998 13.41L9.40976 16L7.99976 14.59L10.5898 12L7.99976 9.41L9.40976 8L11.9998 10.59L14.5898 8L15.9998 9.41L13.4098 12L15.9998 14.59Z" fill="#C80E08" />
                                <path d="M14.5902 8L12.0002 10.59L9.41024 8L8.00024 9.41L10.5902 12L8.00024 14.59L9.41024 16L12.0002 13.41L14.5902 16L16.0002 14.59L13.4102 12L16.0002 9.41L14.5902 8ZM12.0002 2C6.47024 2 2.00024 6.47 2.00024 12C2.00024 17.53 6.47024 22 12.0002 22C17.5302 22 22.0002 17.53 22.0002 12C22.0002 6.47 17.5302 2 12.0002 2ZM12.0002 20C7.59024 20 4.00024 16.41 4.00024 12C4.00024 7.59 7.59024 4 12.0002 4C16.4102 4 20.0002 7.59 20.0002 12C20.0002 16.41 16.4102 20 12.0002 20Z" fill="#C80E08" />
                            </g>
                            <defs>
                                <clipPath id="clip0_207_15392">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                );
            case 'incomplete':
                return (
                    <div className={styles.statusIconWrapper}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clip-path="url(#clip0_207_15322)">
                                <path opacity="0.3" d="M11.9998 4C7.58976 4 3.99976 7.59 3.99976 12C3.99976 16.41 7.58976 20 11.9998 20C16.4098 20 19.9998 16.41 19.9998 12C19.9998 7.59 16.4098 4 11.9998 4ZM12.9998 17H10.9998V11H12.9998V17ZM12.9998 9H10.9998V7H12.9998V9Z" fill="#FFBF00" />
                                <path d="M11.0002 7H13.0002V9H11.0002V7ZM11.0002 11H13.0002V17H11.0002V11ZM12.0002 2C6.48024 2 2.00024 6.48 2.00024 12C2.00024 17.52 6.48024 22 12.0002 22C17.5202 22 22.0002 17.52 22.0002 12C22.0002 6.48 17.5202 2 12.0002 2ZM12.0002 20C7.59024 20 4.00024 16.41 4.00024 12C4.00024 7.59 7.59024 4 12.0002 4C16.4102 4 20.0002 7.59 20.0002 12C20.0002 16.41 16.4102 20 12.0002 20Z" fill="#FFBF00" />
                                <path d="M11.0002 7H13.0002V9H11.0002V7ZM11.0002 11H13.0002V17H11.0002V11ZM12.0002 2C6.48024 2 2.00024 6.48 2.00024 12C2.00024 17.52 6.48024 22 12.0002 22C17.5202 22 22.0002 17.52 22.0002 12C22.0002 6.48 17.5202 2 12.0002 2ZM12.0002 20C7.59024 20 4.00024 16.41 4.00024 12C4.00024 7.59 7.59024 4 12.0002 4C16.4102 4 20.0002 7.59 20.0002 12C20.0002 16.41 16.4102 20 12.0002 20Z" fill="black" fill-opacity="0.2" />
                            </g>
                            <defs>
                                <clipPath id="clip0_207_15322">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };

    // Flag icon for marked questions
    const FlagIcon = ({ isMarked }) => {
        return isMarked ? (
            <div className={styles.flagIconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <g clip-path="url(#clip0_207_15332)">
                        <path d="M12.36 6H7V12H14.24L14.64 14H18V8H12.76L12.36 6Z" fill="#F26722" />
                        <path d="M14.4 6L14 4H5V21H7V14H12.6L13 16H20V6H14.4ZM18 14H14.64L14.24 12H7V6H12.36L12.76 8H18V14Z" fill="#F26722" />
                    </g>
                    <defs>
                        <clipPath id="clip0_207_15332">
                            <rect width="24" height="24" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </div>
        ) : (
            <div className={styles.flagIconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <g clip-path="url(#clip0_207_15328)">
                        <path d="M14.4 6L14 4H5V21H7V14H12.6L13 16H20V6H14.4ZM18 14H14.64L14.24 12H7V6H12.36L12.76 8H18V14Z" fill="black" />
                    </g>
                    <defs>
                        <clipPath id="clip0_207_15328">
                            <rect width="24" height="24" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </div>
        );
    };

    const ProgressCircle = ({ percentage, size = 100, displayText = true }) => {
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

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
                            {percentage}/{100}
                        </text>
                    }
                </svg>
            </div>
        );
    };

    return (
        <div className={styles.figmaSectionsContainer}>
            {/* Header */}
            <div className={styles.figmaSectionsHeader}>
                <div className={styles.figmaSectionsTitle}>شاشة الأقسام</div>
            </div>

            {/* Sections content */}
            <div className={styles.figmaSectionsContent}>
                {sections.map((section, index) => (
                    <div key={index} className={styles.figmaSectionItem}>
                        <div className={styles.figmaSectionHeader} onClick={() => toggleSection(index)}>
                            {/* Title on right */}
                            <div className={styles.figmaSectionTitle}>
                                {section.title}
                            </div>

                            {/* Section info in the middle */}
                            <div className={styles.figmaSectionInfo}>
                                {/* Percentage circle */}
                                <div className={styles.figmaPercentageCircle}>
                                    <div className={styles.skillScore}>
                                        <ProgressCircle percentage={section.percentage} size={40} displayText={false} />
                                    </div>
                                </div>

                                {/* Score */}
                                <div className={styles.figmaSectionScore}>
                                    <span className={styles.figmaScoreNumber}>{section.percentage}</span>
                                </div>

                                {/* Time */}
                                <div className={styles.figmaSectionTime}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <g clip-path="url(#clip0_205_4717)">
                                            <path opacity="0.3" d="M12.001 6C8.13098 6 5.00098 9.13 5.00098 13C5.00098 16.87 8.13098 20 12.001 20C15.871 20 19.001 16.87 19.001 13C19.001 9.13 15.871 6 12.001 6ZM13.001 14H11.001V8H13.001V14Z" fill="black" />
                                            <path d="M15 1H9V3H15V1Z" fill="black" />
                                            <path d="M19.03 7.39L20.45 5.97C20.02 5.46 19.55 4.98 19.04 4.56L17.62 5.98C16.07 4.74 14.12 4 12 4C7.03 4 3 8.03 3 13C3 17.97 7.02 22 12 22C16.98 22 21 17.97 21 13C21 10.88 20.26 8.93 19.03 7.39ZM12 20C8.13 20 5 16.87 5 13C5 9.13 8.13 6 12 6C15.87 6 19 9.13 19 13C19 16.87 15.87 20 12 20Z" fill="black" />
                                            <path d="M13.001 8H11.001V14H13.001V8Z" fill="black" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_205_4717">
                                                <rect width="24" height="24" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <div className={styles.figmaTimeText}>{section.time}</div>
                                </div>

                                {/* Expand/collapse arrow */}
                                <div className={`${styles.figmaSectionArrow} ${expandedSections.includes(index) ? styles.expanded : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <g clip-path="url(#clip0_205_4769)">
                                            <path d="M20.1299 17.5098L21.8999 15.7298L11.9999 5.83984L2.0999 15.7398L3.8699 17.5098L11.9999 9.37984L20.1299 17.5098Z" fill="black" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_205_4769">
                                                <rect width="24" height="24" fill="white" transform="matrix(0 1 -1 0 24 0)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Questions list - only show for expanded sections */}
                        {expandedSections.includes(index) && (
                            <div className={styles.figmaQuestionsWrapper}>
                                <div className={styles.figmaQuestionsRow}>
                                    {section.questions.map((question, qIndex) => (
                                        <button
                                            key={qIndex}
                                            className={styles.figmaQuestionItem}
                                            onClick={() => handleQuestionClick(question.id)}
                                            aria-label={`سؤال ${question.id}`}
                                            type="button"
                                        >
                                            <StatusIcon status={question.status} />
                                            <div className={styles.figmaQuestionText}>
                                                سؤال {question.id}
                                            </div>
                                            <FlagIcon isMarked={question.isMarked} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer buttons */}
            <div className={styles.figmaSectionsFooter}>
                <button className={styles.figmaRetakeButton} onClick={onRetakeExam}>
                    <span>إعادة الاختبار</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clip-path="url(#clip0_205_5453)">
                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58001 4 4.01001 7.58 4.01001 12C4.01001 16.42 7.58001 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69001 18 6.00001 15.31 6.00001 12C6.00001 8.69 8.69001 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="#F26722" />
                        </g>
                        <defs>
                            <clipPath id="clip0_205_5453">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>

                <button className={styles.figmaResultsButton} onClick={onViewResults}>
                    <span>ملخص النتائج</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <g clip-path="url(#clip0_205_5459)">
                            <path d="M8.5 9H4.5V20H8.5V9Z" fill="white" />
                            <path d="M20.5 13H16.5V20H20.5V13Z" fill="white" />
                            <path d="M14.5 4H10.5V20H14.5V4Z" fill="white" />
                        </g>
                        <defs>
                            <clipPath id="clip0_205_5459">
                                <rect width="24" height="24" fill="white" transform="translate(0.5)" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ExamSectionsReview;