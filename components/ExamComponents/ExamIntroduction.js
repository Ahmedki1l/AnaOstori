import React from 'react';
import styles from '../../styles/ExamPage.module.scss';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';

const ExamIntroduction = ({ examData, onStartExam }) => {
    return (
        <div className={styles.examContainer}>
            <div className={styles.examHeader}>
                <div></div> {/* Empty div for flex spacing */}
                <h1 className={styles.examTitle}>{examData?.title || "عنوان الاختبار هنا"}</h1>
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
                    <span className={styles.timerText}>{examData?.duration || "25:00"}</span>
                </div>
            </div>
            
            {<div className={styles.examInstructions}>
                <h2 className={styles.instructionsTitle}>{examData?.subTitle || "تعليمات الاختبار"}</h2>
                {examData?.instructions &&
                    <p className={styles.instructionsText}>
                        {examData?.instructions}
                    </p>
                }
            </div>}

            <div className={styles.examDetails}>
                {examData?.details && examData.details.map((detail, index) => (
                    <div key={index} className={styles.detailItem}>
                        <div className={styles.detailIcon}>
                            <AllIconsComponenet iconName={detail.iconName} height={20} width={20} color="#00A3FF" />
                        </div>
                        <div className={styles.detailText}>
                            <p className={styles.detailTitle}>{detail.title}</p>
                            <p className={styles.detailDescription}>{detail.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.examActionsAbsolute}>
                <button className={styles.nextButton} onClick={onStartExam}>
                    <span>التالي</span>
                    <AllIconsComponenet iconName="arrowLeftIcon" height={16} width={16} color="#FFFFFF" />
                </button>
            </div>
        </div>
    );
};

export default ExamIntroduction;