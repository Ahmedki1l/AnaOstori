import React from 'react';
import Image from 'next/image';
import styles from './BlogCard.module.scss';

const BlogCard = ({ article, onClick }) => {
    return (
        <div
            className={styles.articleCard}
            onClick={() => onClick(article.id)}
        >
            <div className={styles.articleImageContainer}>
                {article.image ? (
                    <Image
                        src={article.image}
                        alt={article.title}
                        width={400}
                        height={225}
                        className={styles.articleImage}
                    />
                ) : (
                    <div className={styles.placeholderImage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </div>
                )}
            </div>

            <div className={styles.articleDate}>
                <span className={`material-icons-two-tone ${styles.calendarIcon}`}>
                    calendar_today
                </span>
                {article.date}
            </div>

            <h3 className={styles.articleTitle}>{article.title}</h3>
            <p className={styles.articleExcerpt}>{article.excerpt}</p>
        </div>
    );
};

export default BlogCard;