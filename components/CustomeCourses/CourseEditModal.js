// src/components/CustomeCourses/CourseEditModal.js
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./CourseEditModal.module.scss";

export default function CourseEditModal({ course, onSave, onClose }) {
    const [title, setTitle] = useState(course.title);
    const [teacher, setTeacher] = useState(course.teacher || "");
    const [day, setDay] = useState(course.day || "");
    const [cost, setCost] = useState(course.cost);
    const [appointments, setAppointments] = useState(
        // Ensure we copy availableSeats too if your server sent it
        (course.appointments || []).map(a => ({ ...a }))
    );
    const [saving, setSaving] = useState(false);

    // add a blank slot (availableSeats 0 by default)
    const handleAdd = () =>
        setAppointments(a => [
            ...a,
            { id: Date.now().toString(), from: "", to: "", seats: 0, availableSeats: 0 }
        ]);

    const handleChangeAppt = (id, field, val) => {
        setAppointments(prev =>
            prev.map(app => {
                if (app.id !== id) return app;

                // enforce min seats
                if (field === "seats") {
                    const seatsNotToBeRemoved = app.seats - app.availableSeats;
                    if (val < seatsNotToBeRemoved) {
                        toast.warn(`لا يمكنك تحديد أقل من ${seatsNotToBeRemoved} مقعدًا متاحًا.`, {
                            autoClose: 3000
                        });
                        return app;
                    }
                    const changedAmount = val - app.seats;
                    let availableSeats = app.availableSeats;
                    availableSeats += changedAmount;
                    return { ...app, seats: val, availableSeats: availableSeats };
                }

                return { ...app, [field]: val };
            })
        );
    };

    const handleRemove = id => {
        setAppointments(a => a.filter(x => x.id !== id));
    };

    const handleSave = async () => {
        // basic validation
        if (!title.trim()) return toast.error("العنوان مطلوب");
        if (!teacher.trim()) return toast.error("اسم المدرّب مطلوب");
        if (isNaN(cost) || cost < 0) return toast.error("يرجى إدخال سعر صحيح");

        setSaving(true);

        try {
            // original appointments map
            const orig = course.appointments || [];
            const origMap = new Map(orig.map(a => [a.id, a]));

            // current appointments map
            const currMap = new Map(appointments.map(a => [a.id, a]));

            // 1) removed ones:
            const appointmentIdsToRemove = orig
                .filter(a => !currMap.has(a.id))
                .map(a => a.id);

            // 2) new ones:
            const appointmentsToAdd = appointments
                .filter(a => !origMap.has(a.id))
                .map(a => ({
                    from: a.from,
                    to: a.to,
                    seats: a.seats,
                    availableSeats: a.availableSeats ?? 0
                }));

            // 3) updated ones:
            const appointmentsToUpdate = appointments
                .filter(a => origMap.has(a.id))
                .map(a => {
                    const before = origMap.get(a.id);
                    const fields = {};
                    if (a.from !== before.from) fields.from = a.from;
                    if (a.to !== before.to) fields.to = a.to;
                    if (a.seats !== before.seats) fields.seats = a.seats;
                    if (a.seats !== before.seats) fields.availableSeats = a.availableSeats;
                    return Object.keys(fields).length
                        ? { id: a.id, fields }
                        : null;
                })
                .filter(Boolean);

            // build payload
            const payload = {
                courseId: course._id,
                title,
                teacher,
                day: day || null,
                cost: Number(cost),
                appointmentsToAdd,
                appointmentIdsToRemove,
                appointmentsToUpdate
            };

            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/update-course`,
                payload
            );

            toast.success("تمّ تحديث الدورة بنجاح");
            onSave(res.data);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("فشل تحديث الدورة. حاول مرة أخرى.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose} dir="rtl">
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button
                    className={styles.close}
                    onClick={onClose}
                    disabled={saving}
                >
                    ✕
                </button>
                <h2 className={styles.title}>تعديل الدورة</h2>

                <div className={styles.formGroup}>
                    <label>العنوان:</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        disabled={saving}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>اسم المدرّب:</label>
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
                        onChange={e => setCost(parseFloat(e.target.value) || 0)}
                        disabled={saving}
                    />
                </div>

                <h3 className={styles.subTitle}>المواعيد</h3>
                {appointments.map(appt => (
                    <div key={appt.id} className={styles.apptRow}>
                        <input
                            placeholder="من"
                            value={appt.from}
                            onChange={e =>
                                handleChangeAppt(appt.id, "from", e.target.value)
                            }
                            disabled={saving}
                        />
                        <input
                            placeholder="إلى"
                            value={appt.to}
                            onChange={e =>
                                handleChangeAppt(appt.id, "to", e.target.value)
                            }
                            disabled={saving}
                        />
                        <input
                            type="number"
                            min="0"
                            placeholder="مقاعد"
                            value={appt.seats}
                            onChange={e =>
                                handleChangeAppt(
                                    appt.id,
                                    "seats",
                                    parseInt(e.target.value) || 0
                                )
                            }
                            disabled={saving}
                        />
                        <button
                            className={styles.removeBtn}
                            onClick={() => handleRemove(appt.id)}
                            disabled={saving}
                        >
                            حذف
                        </button>
                    </div>
                ))}
                <button
                    className={styles.addBtn}
                    onClick={handleAdd}
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
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "جاري الحفظ…" : "حفظ"}
                    </button>
                </div>
            </div>
        </div>
    );
}
