import React from 'react';
import styles from './BookGrid.module.scss';
import BookCard from './BookCard';

export default function BookGrid({ books, loading = false }) {
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingGrid}>
                    {[1, 2, 3, 4].map((_, index) => (
                        <div key={index} className={styles.skeletonCard}>
                            <div className={styles.skeletonImage}></div>
                            <div className={styles.skeletonContent}>
                                <div className={styles.skeletonTitle}></div>
                                <div className={styles.skeletonDescription}></div>
                                <div className={styles.skeletonPrice}></div>
                                <div className={styles.skeletonButton}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!books || books.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <div className={styles.emptyIcon}>📚</div>
                <h3 className={styles.emptyTitle}>لا توجد كتب متاحة حالياً</h3>
                <p className={styles.emptyDescription}>
                    تابعنا للحصول على أحدث الإصدارات والكتب المميزة
                </p>
            </div>
        );
    }

    return (
        <div className={styles.bookGrid}>
            {books.map((book) => (
                <BookCard 
                    key={book._id || book.id} 
                    book={book}
                />
            ))}
        </div>
    );
}
