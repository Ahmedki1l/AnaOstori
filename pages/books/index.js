import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styles from '../../styles/BookShop.module.scss';
import BookGrid from '../../components/BookShop/BookGrid';

export default function BooksPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-any`, {
                    params: { collection: 'Books' }
                });
                // Filter only published books
                const publishedBooks = response.data.filter(book => book.published === true);
                setBooks(publishedBooks);
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    return (
        <>
            <Head>
                <title>المتجر - أنا أستوري</title>
                <meta name="description" content="تصفح مجموعتنا المميزة من الكتب التعليمية والمراجع الدراسية لاختبارات القدرات والتحصيلي" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <main className={styles.shopContainer}>
                <div className="maxWidthDefault">
                    <div className={styles.shopHeader}>
                        <h1 className={styles.shopTitle}>المتجر</h1>
                        <p className={styles.shopSubtitle}>
                            اكتشف مجموعتنا المميزة من الكتب التعليمية والمراجع الدراسية
                        </p>
                    </div>

                    <div className={styles.booksSection}>
                        <BookGrid books={books} loading={loading} />
                    </div>
                </div>
            </main>
        </>
    );
}
