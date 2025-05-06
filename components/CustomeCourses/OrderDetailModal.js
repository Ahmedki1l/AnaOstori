import React from "react";
import styles from "./orderDetailsModel.module.scss";

export default function OrderDetailModal({ order, courses, onClose }) {
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

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onClose}>✕</button>
                <h2>تفاصيل الطلب #{order.orderId}</h2>

                <div><strong>الاسم:</strong> {order.fullName}</div>
                <div><strong>البريد:</strong> {order.email}</div>
                <div><strong>الجوال:</strong> {order.phone}</div>
                <div>
                    <strong>الحالة:</strong>{" "}
                    <span
                        className={styles.statusBadge}
                        style={{ backgroundColor: statusColors[order.status] }}
                    >
                        {statusTranslations[order.status]}
                    </span>
                </div>
                <div><strong>تاريخ الإنشاء:</strong> {formatDate(order.createdAt)}</div>

                <h3>الدورات:</h3>
                <ul className={styles.modalCoursesList}>
                    {order.courses.map((ci, idx) => {
                        const found = courses.find(c => String(c._id) === String(ci.courseId));
                        const appointment = found?.appointments?.find(a => String(a.id) === String(ci.appointmentId));
                        return (
                            <li key={idx}>
                                {found?.title || found?.name || ci.courseId}
                                {" — "}
                                من {appointment?.from} إلى {appointment?.to}
                            </li>
                        );
                    })}
                </ul>

                <div><strong>المجموع:</strong> {order.totalPrice} ر.س</div>
            </div>
        </div>
    );
}
