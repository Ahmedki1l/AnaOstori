import React from 'react';
import styles from './QuantitySelector.module.scss';

export default function QuantitySelector({ quantity, onIncrement, onDecrement, min = 1, max = 99 }) {
    const handleDecrement = () => {
        if (quantity > min) {
            onDecrement();
        }
    };

    const handleIncrement = () => {
        if (quantity < max) {
            onIncrement();
        }
    };

    return (
        <div className={styles.quantitySelector}>
            <button 
                className={`${styles.quantityBtn} ${styles.decrementBtn}`}
                onClick={handleDecrement}
                disabled={quantity <= min}
                aria-label="تقليل الكمية"
            >
                <span>−</span>
            </button>
            <span className={styles.quantityValue}>{quantity}</span>
            <button 
                className={`${styles.quantityBtn} ${styles.incrementBtn}`}
                onClick={handleIncrement}
                disabled={quantity >= max}
                aria-label="زيادة الكمية"
            >
                <span>+</span>
            </button>
        </div>
    );
}
