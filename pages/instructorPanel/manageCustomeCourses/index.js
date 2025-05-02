import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../../styles/customeCoursesView.module.scss";

import CourseDetailModal from "../../../components/CustomeCourses/CourseDetailModal";
import CourseEditModal from "../../../components/CustomeCourses/CourseEditModal";
import CourseCreateModal from "../../../components/CustomeCourses/CourseCreateModal";
import { toast } from "react-toastify";

const CoursesView = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [viewCourse, setViewCourse] = useState(null);
    const [editCourse, setEditCourse] = useState(null);
    const [createMode, setCreateMode] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    // ─── Fetch courses ─────────────────────────────────
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-any`,
                    { params: { collection: "customeCourses" } }
                );
                // sort by newest first
                const sorted = res.data.sort((a, b) => {
                    return new Date(b._id).getTime() - new Date(a._id).getTime();
                });
                setCourses(sorted);
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // ─── Search filter ──────────────────────────────────
    const filtered = courses.filter(c =>
        c.title?.includes(searchTerm) ||
        c.day?.includes(searchTerm)
    );

    // ─── Delete course ──────────────────────────────────
    const deleteCourse = async (courseId) => {
        if (!window.confirm("هل أنت متأكد من حذف هذه الدورة؟")) return;
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/delete-course`,
                { data: { id: courseId } }
            );
            setCourses(cs => cs.filter(c => c._id !== courseId));
            toast.success("تم حذف الدورة بنجاح");
        } catch (err) {
            console.error("Failed to delete course:", err);
        }
    };

    if (loading) {
        return <div className={styles.loadingIndicator}>جاري تحميل البيانات…</div>;
    }

    return (
        <div className={styles.ordersViewContainer} dir="rtl">
            <div className={styles.headerBar}>
                <h1 className={styles.pageTitle}>إدارة الدورات</h1>
                <button
                    className={`primarySolidBtn ${styles.addButton}`}
                    onClick={() => setCreateMode(true)}
                >
                    إضافة دورة جديدة
                </button>
            </div>

            {/* <div className={styles.searchContainer}>
                <input
                type="text"
                placeholder="ابحث عن دورة بالاسم أو اليوم..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                />
                <i className={styles.searchIcon}>🔍</i>
            </div> */}

            {filtered.length === 0
                ? <div className={styles.noOrders}>لا توجد دورات تطابق البحث</div>
                : (
                    <div className={styles.ordersTable}>
                        <div className={styles.tableHeader}>
                            {["#", "العنوان", "اليوم", "السعر", "عدد المواعيد", "إجراءات"]
                                .map(h => <div key={h} className={styles.headerCell}>{h}</div>)
                            }
                        </div>
                        {filtered.map((c, idx) => (
                            <div key={c._id} className={styles.tableRow}>
                                <div className={styles.cell}>{idx + 1}</div>
                                <div className={styles.cell}>{c.title}</div>
                                <div className={styles.cell}>{c.day}</div>
                                <div className={styles.cell}>{c.cost} ر.س</div>
                                <div className={styles.cell}>{(c.appointments || []).length}</div>
                                <div className={styles.cell}>
                                    <div className={styles.actionButtons}>
                                        <button
                                            className={styles.viewButton}
                                            onClick={() => setViewCourse(c)}
                                        >
                                            عرض
                                        </button>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => setEditCourse(c)}
                                        >
                                            تعديل
                                        </button>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => deleteCourse(c._id)}
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }

            {/* ─── Modals ───────────────────────────────────────── */}
            {viewCourse && (
                <CourseDetailModal
                    course={viewCourse}
                    onClose={() => setViewCourse(null)}
                />
            )}
            {editCourse && (
                <CourseEditModal
                    course={editCourse}
                    onSave={updated => {
                        // replace in state
                        setCourses(cs => cs.map(c => c._id === updated._id ? updated : c));
                        setEditCourse(null);
                    }}
                    onClose={() => setEditCourse(null)}
                />
            )}
            {createMode && (
                <CourseCreateModal
                    onSave={newCourse => {
                        setCourses(cs => [newCourse, ...cs]);
                        setCreateMode(false);
                    }}
                    onClose={() => setCreateMode(false)}
                />
            )}
        </div>
    );
};

export default CoursesView;