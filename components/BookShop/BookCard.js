import React, { useState } from 'react';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import styles from './BookCard.module.scss';
import QuantitySelector from './QuantitySelector';
import { mediaUrl } from '../../constants/DataManupulation';

export default function BookCard({ book }) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);

    const bookImageUrl = book.pictureKey && book.pictureBucket 
        ? mediaUrl(book.pictureBucket, book.pictureKey)
        : '/images/book-placeholder.png';

    const isOutOfStock = book.stock !== undefined && book.stock <= 0;

    const handleBuyClick = () => {
        if (isOutOfStock) return;

        // Store book and quantity in localStorage for payment page
        const bookOrderData = {
            bookId: book._id || book.id,
            bookTitle: book.title,
            bookDescription: book.description,
            bookPrice: book.price,
            bookPictureKey: book.pictureKey,
            bookPictureBucket: book.pictureBucket,
            quantity: quantity
        };
        localStorage.setItem('bookOrderData', JSON.stringify(bookOrderData));

        router.push('/bookPayment');
    };

    const handleIncrement = () => {
        const maxStock = book.stock !== undefined ? book.stock : 99;
        if (quantity < maxStock) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    return (
        <div className={styles.bookCard}>
            <div className={styles.imageContainer}>
                <Image
                    src={bookImageUrl}
                    alt={book.title}
                    layout="fill"
                    objectFit="cover"
                    className={styles.bookImage}
                />
                {isOutOfStock && (
                    <div className={styles.outOfStockBadge}>
                        <span>نفذت الكمية</span>
                    </div>
                )}
            </div>
            <div className={styles.contentContainer}>
                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.bookDescription}>
                    {book.description && book.description.length > 120 
                        ? `${book.description.substring(0, 120)}...` 
                        : book.description}
                </p>
                <div className={styles.priceSection}>
                    <span className={styles.price}>{book.price} ر.س</span>
                    <span className={styles.vatNote}>شامل الضريبة</span>
                </div>
                <div className={styles.actionSection}>
                    <div className={styles.quantityWrapper}>
                        <span className={styles.quantityLabel}>الكمية:</span>
                        <QuantitySelector
                            quantity={quantity}
                            onIncrement={handleIncrement}
                            onDecrement={handleDecrement}
                            min={1}
                            max={book.stock !== undefined ? book.stock : 99}
                        />
                    </div>
                    <button 
                        className={`primarySolidBtn ${styles.buyButton}`}
                        onClick={handleBuyClick}
                        disabled={isOutOfStock}
                    >
                        {isOutOfStock ? 'غير متوفر' : 'شراء الآن'}
                    </button>
                </div>
            </div>
        </div>
    );
}
