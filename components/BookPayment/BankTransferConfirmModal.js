import React from 'react';
import styles from './BankTransferConfirmModal.module.scss';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';

export default function BankTransferConfirmModal({ isOpen, onClose, onConfirm, loading }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <AllIconsComponenet iconName={'closeicon'} height={20} width={20} />
                </button>
                
                <div className={styles.modalHeader}>
                    <div className={styles.iconWrapper}>
                        <AllIconsComponenet iconName={'bankTransfer'} height={40} width={40} />
                    </div>
                    <h2 className={styles.title}>تحويل بنكي</h2>
                </div>

                <div className={styles.bankInfo}>
                    <h3 className={styles.bankInfoTitle}>معلومات الحساب البنكي</h3>
                    
                    <div className={styles.infoRow}>
                        <span className={styles.label}>اسم البنك:</span>
                        <span className={styles.value}>بنك الراجحي</span>
                    </div>
                    
                    <div className={styles.infoRow}>
                        <span className={styles.label}>اسم المستفيد:</span>
                        <span className={styles.value}>مؤسسة أنا أستوري</span>
                    </div>
                    
                    <div className={styles.infoRow}>
                        <span className={styles.label}>رقم الحساب:</span>
                        <span className={styles.value}>1234567890</span>
                    </div>
                    
                    <div className={styles.infoRow}>
                        <span className={styles.label}>رقم الآيبان:</span>
                        <span className={styles.value}>SA1234567890123456789012</span>
                    </div>
                </div>

                <div className={styles.instructions}>
                    <p>بعد إتمام التحويل، يرجى:</p>
                    <ol>
                        <li>رفع صورة إيصال التحويل</li>
                        <li>انتظار تأكيد الدفع خلال 24-48 ساعة عمل</li>
                    </ol>
                </div>

                <div className={styles.actions}>
                    <button 
                        className={styles.confirmBtn}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'جاري المعالجة...' : 'متابعة لرفع الإيصال'}
                    </button>
                    <button 
                        className={styles.cancelBtn}
                        onClick={onClose}
                        disabled={loading}
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
}
