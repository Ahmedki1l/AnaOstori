import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './BlogDetail.module.scss';
import styles2 from '../../styles/Home.module.scss';
import CourseCard from '../../components/HomePageComponents/CourseCard';
import BlogCard from './BlogCard';
import { HomeConst } from '../../constants/HomeConst';
import { useRouter } from 'next/router';
import { mediaUrl } from '../../constants/DataManupulation';
import useWindowSize from '../../hooks/useWindoSize';

export default function BlogDetail(props) {
    console.log("🚀 ~ BlogDetail ~ props:", props)
    const router = useRouter();
    const catagories = props?.catagories ? props?.catagories : []
    const article = props?.article ? props?.article : []
    const relatedArticles = props?.relatedArticles ? props?.relatedArticles : []
    const windowScreen = useWindowSize().width;

    const handleArticleClick = (articleId) => {
        router.push(`/blog/${articleId}`);
    };

    if (!article) {
        return <div className={styles.loading}>جاري التحميل...</div>;
    }

    return (
        <div className={styles.blogDetailContainer}>
            <div className={styles.blogContent}>
                {/* Back button */}
                <button
                    className={styles.backButton}
                    onClick={() => router.push('/blog')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                </button>

                {/* Main article content */}
                <div className={styles.articleMainContent}>
                    <div className={styles.mainArticle}>

                        {/* Hero image */}
                        <div className={styles.articleHeroImage}>
                            {article.heroImage ? (
                                <Image
                                    src={article.heroImage}
                                    alt={article.title}
                                    width={942}
                                    height={416}
                                    className={styles.heroImage}
                                />
                            ) : (
                                <div className={styles.placeholderImage}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Header section */}
                        <div className={styles.articleHeader}>
                            <div className={styles.articleDate}>
                                <svg className={styles.calendarIcon} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                {article.date}
                            </div>
                            <h1 className={styles.articleTitle}>{article.title}</h1>
                        </div>

                        {/* Article body content */}
                        <div className={styles.articleBody}>
                            {article.content?.map((section, index) => {
                                if (section.type === 'paragraph') {
                                    return (
                                        <p key={`paragraph-${index}`} className={styles.paragraph}>
                                            {section.text}
                                        </p>
                                    );
                                } else if (section.type === 'heading') {
                                    return (
                                        <h2 key={`heading-${index}`} className={styles.heading}>
                                            {section.text}
                                        </h2>
                                    );
                                } else if (section.type === 'list') {
                                    return (
                                        <ol key={`list-${index}`} className={styles.numberedList}>
                                            {section.items.map((item, itemIndex) => (
                                                <li key={`list-item-${itemIndex}`} className={styles.listItem}>
                                                    {item.title && <span className={styles.listItemTitle}>{item.title}</span>}
                                                    {item.description && <p className={styles.listItemDescription}>{item.description}</p>}
                                                </li>
                                            ))}
                                        </ol>
                                    );
                                } else if (section.type === 'image') {
                                    return (
                                        <div key={`image-${index}`} className={styles.contentImage}>
                                            <Image
                                                src={section.src}
                                                alt={section.alt || ''}
                                                width={600}
                                                height={300}
                                                className={styles.image}
                                            />
                                            {section.caption && <p className={styles.imageCaption}>{section.caption}</p>}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>

                    {/* Sidebar for table of contents */}
                    <div className={styles.articleSidebar}>
                        <div className={styles.tocContainer}>
                            <h3 className={styles.tocTitle}>مواضيع المقالة</h3>
                            <ul className={styles.tocList}>
                                {article.tableOfContents?.map((item, index) => (
                                    <li key={`toc-${index}`} className={styles.tocItem}>
                                        <Link href={`#section-${index}`}>
                                            <span className={item.highlighted ? styles.tocItemHighlighted : ''}>{item.title}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`maxWidthDefault ${styles.courseSection}`}>
                <p className={`${styles.courseSectionHeader}`}>{HomeConst.refCourseSecHead1} </p>
                <div className={styles.courseCardsWraper}>
                    {catagories.length > 0 && catagories.map((catagory, index) => {
                        return (
                            <div className={styles.courseCardWraper} key={`catagory${index}`} onClick={() => handleNavigation(catagory.name)}>
                                <CourseCard pictureUrl={mediaUrl(catagory.pictureBucket, catagory.pictureKey)} courseType={catagory.name} imgHeight={windowScreen > 1280 ? 164 : 145} />
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Related articles section */}
            {relatedArticles && relatedArticles.length > 0 && (
                <div className={styles.relatedArticlesSection}>
                    <h2 className={styles.relatedTitle}>مقالات مشابهة</h2>
                    <div className={styles.relatedArticlesGrid}>
                        {relatedArticles.map((article) => (
                            <BlogCard
                                key={article.id}
                                article={article}
                                onClick={handleArticleClick}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}