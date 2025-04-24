import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './BlogComponent.module.scss';
import BlogCard from './BlogCard';

const BlogComponent = ({ articles, categories }) => {
    const router = useRouter();
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 6;

    useEffect(() => {
        // Filter articles based on active category and search term
        let filtered = articles;

        if (activeCategory && activeCategory !== 'all') {
            filtered = filtered.filter(article => article.category === activeCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredArticles(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [articles, activeCategory, searchTerm]);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    const handleArticleClick = (articleId) => {
        router.push(`/blog/${articleId}`);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Pagination
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    className={`${styles.pageButton} ${currentPage === i ? styles.activePage : ''}`}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div className={styles.blogContainer}>
            <h1 className={styles.blogTitle}>المدونة</h1>

            {/* Search */}
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="ابحث بعنوان الموضوع..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className={styles.searchInput}
                />
                <div className={styles.searchIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
            </div>

            {/* Categories */}
            <div className={styles.categoriesContainer}>
                <button
                    className={`${styles.categoryButton} ${activeCategory === 'all' ? styles.activeCategory : ''}`}
                    onClick={() => handleCategoryClick('all')}
                >
                    الشائعات العامة
                </button>

                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`${styles.categoryButton} ${activeCategory === category.id ? styles.activeCategory : ''}`}
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Articles */}
            <div className={styles.articlesGrid}>
                {currentArticles.map((article) => (
                    <BlogCard
                        key={article.id}
                        article={article}
                        onClick={handleArticleClick}
                    />
                ))}
            </div>

            {/* No articles message */}
            {currentArticles.length === 0 && (
                <div className={styles.noArticlesMessage}>
                    لا توجد مقالات متاحة حاليًا
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageButton}
                        onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>

                    {renderPageNumbers()}

                    <button
                        className={styles.pageButton}
                        onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
};

export default BlogComponent;