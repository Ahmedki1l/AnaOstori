import React, { useState } from "react";
import styles from "./orderStatusEditModel.module.scss";

export default function OrderStatusEditModal({ order, onSave, onClose }) {
    const [selectedStatus, setSelectedStatus] = useState(order.status);
    
    const statusTranslations = {
        waiting: "قيد الانتظار",
        success: "مؤكد",
        new: "جديد",
    };
    
    const statusColors = {
        waiting: "#f5a623",
        new: "#f5a623",
        success: "#4a90e2",
    };

    const formatDate = iso =>
        new Date(iso).toLocaleDateString("ar-EG", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    
    const handleStatusChange = (status) => {
        setSelectedStatus(status);
    };
    
    const handleSave = () => {
        onSave(selectedStatus);
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onClose}>✕</button>
                <h2>تعديل حالة الطلب #{order.orderId}</h2>

                <div className={styles.orderInfo}>
                    <div><strong>الاسم:</strong> {order.fullName}</div>
                    <div><strong>البريد:</strong> {order.email}</div>
                    <div><strong>الجوال:</strong> {order.phone}</div>
                    <div><strong>تاريخ الإنشاء:</strong> {formatDate(order.createdAt)}</div>
                </div>
                
                <div className={styles.statusSection}>
                    <h3>حالة الطلب</h3>
                    <div className={styles.statusOptions}>
                        {Object.keys(statusTranslations).map(status => (
                            <div 
                                key={status} 
                                className={`${styles.statusOption} ${selectedStatus === status ? styles.selectedStatus : ''}`}
                                onClick={() => handleStatusChange(status)}
                            >
                                <span
                                    className={styles.statusBadge}
                                    style={{ backgroundColor: statusColors[status] }}
                                >
                                    {statusTranslations[status]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className={styles.orderSummary}>
                    <div><strong>المجموع:</strong> {order.totalPrice} ر.س</div>
                </div>
                
                <div className={styles.actionButtons}>
                    <button 
                        className={styles.cancelButton} 
                        onClick={onClose}
                    >
                        إلغاء
                    </button>
                    <button 
                        className={styles.saveButton} 
                        onClick={handleSave}
                    >
                        حفظ التغييرات
                    </button>
                </div>
            </div>
        </div>
    );
}