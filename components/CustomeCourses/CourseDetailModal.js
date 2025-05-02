// src/components/CustomeCourses/CourseDetailModal.js
import React from "react";
import styles from "./CourseDetailModal.module.scss";

export default function CourseDetailModal({ course, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose} dir="rtl">
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>✕</button>
        <h2 className={styles.title}>تفاصيل الدورة</h2>
        <div className={styles.field}>
          <span className={styles.label}>العنوان:</span>
          <span className={styles.value}>{course.title}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>المعلم:</span>
          <span className={styles.value}>{course.teacher}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>اليوم:</span>
          <span className={styles.value}>{course.day}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>السعر:</span>
          <span className={styles.value}>{course.cost} ر.س</span>
        </div>

        <h3 className={styles.subTitle}>المواعيد ({(course.appointments||[]).length})</h3>
        <ul className={styles.apptList}>
          {(course.appointments||[]).map(appt => (
            <li key={appt.id} className={styles.apptItem}>
              <span>من: {appt.from}</span>
              <span>إلى: {appt.to}</span>
              <span>المقاعد: {appt.seats}</span>
              <span>المقاعد المتبقية: {appt.availableSeats}</span>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <button className={styles.closeBtn} onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
}
