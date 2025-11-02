import React from 'react'
import styles from './ConfirmDeleteModal.module.scss'

export default function ConfirmDeleteModal({ title, onConfirm, onClose, isLoading = false }) {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <p className={styles.message}>{title}</p>
                <div className={styles.buttons}>
                    <button 
                        className={styles.confirmBtn} 
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'جاري الحذف...' : 'نعم'}
                    </button>
                    <button 
                        className={styles.cancelBtn} 
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        لا
                    </button>
                </div>
            </div>
        </div>
    )
}

