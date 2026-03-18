import React from 'react';
import Image from 'next/legacy/image';
import styles from './BookOrderSummary.module.scss';
import { mediaUrl } from '../../constants/DataManupulation';

export default function BookOrderSummary({ bookData, quantity, deliveryFee = 0, discount = 0, shippingProvider = null }) {
    const bookImageUrl = bookData.bookPictureKey && bookData.bookPictureBucket 
        ? mediaUrl(bookData.bookPictureBucket, bookData.bookPictureKey)
        : '/images/book-placeholder.png';

    const unitPrice = Number(bookData.bookPrice) || 0;
    const subtotal = unitPrice * quantity;
    const grandTotal = subtotal + Number(deliveryFee) - Number(discount);

    return (
        <div className={styles.summaryContainer}>
            <h2 className={styles.summaryTitle}>ملخص الطلب</h2>
            
            <div className={styles.bookInfo}>
                <div className={styles.bookImageWrapper}>
                    <Image
                        src={bookImageUrl}
                        alt={bookData.bookTitle}
                        layout="fill"
                        objectFit="cover"
                        className={styles.bookImage}
                    />
                </div>
                <div className={styles.bookDetails}>
                    <h3 className={styles.bookTitle}>{bookData.bookTitle}</h3>
                    <p className={styles.bookQuantity}>الكمية: {quantity}</p>
                </div>
            </div>

            <div className={styles.priceBreakdown}>
                <div className={styles.priceRow}>
                    <span className={styles.priceLabel}>سعر الكتاب × {quantity}</span>
                    <span className={styles.priceValue}>{subtotal.toFixed(2)} ر.س</span>
                </div>

                <div className={styles.priceRow}>
                    <span className={styles.priceLabel}>
                        رسوم التوصيل
                        {shippingProvider === 'torod' && <small style={{ color: '#888', marginRight: '4px' }}>(توصيل سريع)</small>}
                    </span>
                    <span className={styles.priceValue}>{Number(deliveryFee).toFixed(2)} ر.س</span>
                </div>

                {discount > 0 && (
                    <div className={`${styles.priceRow} ${styles.discountRow}`}>
                        <span className={styles.priceLabel}>الخصم</span>
                        <span className={styles.discountValue}>-{Number(discount).toFixed(2)} ر.س</span>
                    </div>
                )}

                <div className={`${styles.priceRow} ${styles.totalRow}`}>
                    <span className={styles.totalLabel}>المبلغ الإجمالي</span>
                    <span className={styles.totalValue}>{grandTotal.toFixed(2)} ر.س</span>
                </div>

                <div className={styles.vatNote}>
                    <span>* الأسعار شاملة ضريبة القيمة المضافة</span>
                </div>
            </div>

            <div className={styles.noteBox}>
                <p className={styles.noteText}>
                    💡 التوصيل خلال 3-7 أيام عمل داخل المملكة العربية السعودية
                </p>
            </div>
        </div>
    );
}
