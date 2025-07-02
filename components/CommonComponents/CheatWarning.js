import React, { useEffect, useState } from 'react';
import styles from '../../styles/ExamPage.module.scss';

/**
 * DistractionWarning Component
 * 
 * Displays a visual warning to users about detected distractions during the exam.
 * 
 * Props:
 * - cheatStrikes: Number of strikes (0-3)
 * - isCheating: Boolean indicating if distraction is currently detected
 * 
 * Features:
 * - Color-coded warnings (orange → red)
 * - Animated entrance and pulse effects
 * - Responsive design for mobile devices
 * - Arabic text support with RTL layout
 */

const ANIMATION_DURATION = 500; // ms

const CheatWarning = ({ cheatStrikes, isCheating }) => {
    const [visible, setVisible] = useState(false);
    const [isHiding, setIsHiding] = useState(false);

    useEffect(() => {
        if (cheatStrikes > 0 || isCheating) {
            setVisible(true);
            setIsHiding(false);
            // Hide after 5 seconds, but animate first
            const timer = setTimeout(() => {
                setIsHiding(true);
                // After animation, hide completely
                setTimeout(() => setVisible(false), ANIMATION_DURATION);
            }, 5000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [cheatStrikes, isCheating]);

    if (!visible) return null;

    const getWarningMessage = () => {
        if (isCheating) {
            return 'تحذير: تم اكتشاف تشتيت! إذا استمر لمدة 3 ثوانٍ، سيتم احتسابه كتحذير.';
        }
        
        switch (cheatStrikes) {
            case 1:
                return 'تحذير: تم تسجيل تحذير واحد. تحذيرين متبقيين قبل إنهاء الاختبار.';
            case 2:
                return 'تحذير: تم تسجيل تحذيرين. تحذير واحد متبقي قبل إنهاء الاختبار.';
            case 3:
                return 'تم تسجيل 3 تحذيرات. سيتم إنهاء الاختبار.';
            default:
                return '';
        }
    };

    const getWarningClass = () => {
        if (isCheating) {
            return styles.distractionWarningActive;
        }
        
        switch (cheatStrikes) {
            case 1:
                return styles.distractionWarningLevel1;
            case 2:
                return styles.distractionWarningLevel2;
            case 3:
                return styles.distractionWarningLevel3;
            default:
                return '';
        }
    };

    // Inline styles for animation
    const baseStyle = {
        background: '#ffa726',
        color: '#fff',
        padding: '16px 24px',
        borderRadius: '10px',
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 1000,
        opacity: 1,
        transform: 'translateY(0)',
        transition: 'opacity 0.5s, transform 0.5s',
        direction: 'rtl',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        minWidth: '320px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)'
    };
    const hideStyle = {
        opacity: 0,
        transform: 'translateY(-30px)'
    };

    return (
        <div style={isHiding ? { ...baseStyle, ...hideStyle } : baseStyle} className={`${styles.distractionWarning} ${getWarningClass()}`}>
            <div className={styles.distractionWarningContent}>
                <div className={styles.distractionWarningIcon}>
                    ⚠️
                </div>
                <div className={styles.distractionWarningText}>
                    <div className={styles.distractionWarningTitle}>
                        {isCheating ? 'تشتيت مكتشف' : `التحذيرات: ${cheatStrikes}/3`}
                    </div>
                    <div className={styles.distractionWarningMessage}>
                        {getWarningMessage()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheatWarning; 