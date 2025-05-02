// src/components/CustomeCourses/CourseCreateModal.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./CourseCreateModal.module.scss";

export default function CourseCreateModal({ onSave, onClose }) {
    const [title, setTitle] = useState("");
    const [teacher, setTeacher] = useState("");
    const [day, setDay] = useState("");
    const [cost, setCost] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [saving, setSaving] = useState(false);

    // Start with one appointment row
    useEffect(() => {
        setAppointments([{ id: Date.now().toString(), from: "", to: "", seats: 0, availableSeats: 0 }]);
    }, []);

    const addAppt = () =>
        setAppointments(a => [
            ...a,
            { id: Date.now().toString(), from: "", to: "", seats: 0, availableSeats: 0 }
        ]);

    const updateAppt = (id, field, val) =>
        setAppointments(a =>
            a.map(x => (x.id === id ? { ...x, [field]: field === "seats" ? Number(val) : val } : x))
        );

    const removeAppt = id =>
        setAppointments(a => a.filter(x => x.id !== id));

    const handleSubmit = async () => {
        // Basic validation
        if (!title.trim()) {
            toast.error("العنوان مطلوب");
            return;
        }
        if (!teacher.trim()) {
            toast.error("اسم المدرّب مطلوب");
            return;
        }
        if (!day.trim()) {
            toast.error("اليو مطلوب");
            return;
        }
        if (isNaN(Number(cost)) || Number(cost) < 0) {
            toast.error("يرجى إدخال تكلفة صحيحة");
            return;
        }
        for (let appt of appointments) {
            if (!appt.from || !appt.to) {
                toast.error("يرجى تعبئة وقت البداية والنهاية لكل موعد");
                return;
            }
            if (isNaN(appt.seats) || appt.seats < 0) {
                toast.error("يرجى إدخال عدد مقاعد صالح لكل موعد");
                return;
            }
            appt.availableSeats = appt.seats;
        }

        setSaving(true);
        try {
            const payload = {
                title,
                day: day || null,
                cost: Number(cost),
                teacher,
                appointments: appointments.map(({ id, ...rest }) => rest)
            };
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/create-course`,
                payload
            );
            onSave(res.data);
            toast.success("تم إنشاء الدورة بنجاح");
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("فشل إنشاء الدورة. حاول مرة أخرى.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose} dir="rtl">
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose} disabled={saving}>
                    ✕
                </button>
                <h2 className={styles.title}>إضافة دورة جديدة</h2>

                <div className={styles.formGroup}>
                    <label>العنوان:</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        disabled={saving}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>اسم المعلم:</label>
                    <input
                        value={teacher}
                        onChange={e => setTeacher(e.target.value)}
                        disabled={saving}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>اليوم:</label>
                    <input
                        value={day}
                        onChange={e => setDay(e.target.value)}
                        disabled={saving}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>السعر (ر.س):</label>
                    <input
                        type="number"
                        min="0"
                        value={cost}
                        onChange={e => setCost(e.target.value)}
                        disabled={saving}
                    />
                </div>

                <h3 className={styles.subTitle}>المواعيد</h3>
                {appointments.map(appt => (
                    <div key={appt.id} className={styles.apptRow}>
                        <input
                            type="time"
                            placeholder="من"
                            value={appt.from}
                            onChange={e => updateAppt(appt.id, "from", e.target.value)}
                            disabled={saving}
                        />
                        <input
                            type="time"
                            placeholder="إلى"
                            value={appt.to}
                            onChange={e => updateAppt(appt.id, "to", e.target.value)}
                            disabled={saving}
                        />
                        <input
                            type="number"
                            min="0"
                            placeholder="مقاعد"
                            value={appt.seats}
                            onChange={e =>
                                updateAppt(appt.id, "seats", e.target.value)
                            }
                            disabled={saving}
                        />
                        {appointments.length > 1 && (
                            <button
                                className={styles.removeBtn}
                                onClick={() => removeAppt(appt.id)}
                                disabled={saving}
                            >
                                حذف
                            </button>
                        )}
                    </div>
                ))}
                <button
                    className={styles.addBtn}
                    onClick={addAppt}
                    disabled={saving}
                >
                    + إضافة موعد
                </button>

                <div className={styles.actions}>
                    <button
                        className={styles.cancelBtn}
                        onClick={onClose}
                        disabled={saving}
                    >
                        إلغاء
                    </button>
                    <button
                        className={styles.saveBtn}
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? "جاري الإنشاء…" : "إنشاء"}
                    </button>
                </div>
            </div>
        </div>
    );
}
