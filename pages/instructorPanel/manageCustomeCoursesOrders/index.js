import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../../styles/customeOrdersView.module.scss";
import OrderDetailModal from "../../../components/CustomeCourses/OrderDetailModal";
import OrderStatusEditModal from "../../../components/CustomeCourses/OrderStatusEditModal";

const OrdersView = () => {
    const [orders, setOrders] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");


    const [viewOrder, setViewOrder] = useState(null);
    const [editOrder, setEditOrder] = useState(null);

    // translate + color maps
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

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [ordsRes, coursesRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-any`, { params: { collection: "orders" } }),
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-any`, { params: { collection: "customeCourses" } })
                ]);
                const ords = ordsRes.data;
                ords.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setOrders(ords);
                setCourses(coursesRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // filter + search
    const filteredOrders = orders.filter(o => {
        const byStatus = filter === "all" || o.status === filter;
        const term = searchTerm.trim();
        const bySearch = !term
            || o.name.includes(term)
            || o.email.includes(term)
            || o.phone.includes(term)
            || o.id.includes(term)
            || o.courses.some(c => c.includes(term));
        return byStatus && bySearch;
    });

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            // 1) call your new PUT endpoint
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/update-order-status`,
                { orderId, status: newStatus }
            )
            // 2) update local state with the freshly returned document
            const updatedOrder = res.data
            setOrders(os =>
                os.map(o =>
                    o.orderId === updatedOrder.orderId
                        ? { ...o, ...updatedOrder }
                        : o
                )
            )
        } catch (err) {
            console.error("Failed to update status:", err)
            // you might want to show a toast / error UI here
        }
    }

    if (loading) {
        return <div className={styles.loadingIndicator}>جاري تحميل البيانات…</div>;
    }

    return (
        <div className={styles.ordersViewContainer} dir="rtl">
            <h1 className={styles.pageTitle}>إدارة الطلبات</h1>

            {/* <div className={styles.filterAndSearch}>
                <div className={styles.statusFilter}>
                    {["all", "pending", "confirmed", "paid", "cancelled", "completed"].map(st => (
                        <button
                            key={st}
                            className={`${styles.filterButton} ${filter === st ? styles.activeFilter : ""}`}
                            onClick={() => setFilter(st)}
                        >
                            {st === "all" ? "الكل" : statusTranslations[st]}
                        </button>
                    ))}
                </div>

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="البحث بالاسم، البريد الإلكتروني، رقم الهاتف، أو الدورة..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <i className={styles.searchIcon}>🔍</i>
                </div>
            </div> */}

            {loading
                ? <div className={styles.loadingIndicator}>جاري تحميل البيانات...</div>
                : filteredOrders.length === 0
                    ? <div className={styles.noOrders}>لا توجد طلبات تطابق معايير البحث</div>
                    : (
                        <div className={styles.ordersTable}>
                            <div className={styles.tableHeader}>
                                {["رقم الطلب", "الاسم", "البريد الإلكتروني", "رقم الجوال", "المبلغ", "الحالة", "تاريخ الطلب", "الإجراءات"]
                                    .map(h => <div key={h} className={styles.headerCell}>{h}</div>)
                                }
                            </div>
                            {filteredOrders.map(o => (
                                <div key={o.id} className={styles.tableRow}>
                                    <div className={styles.cell}>{o.orderId}</div>
                                    <div className={styles.cell}>{o.fullName}</div>
                                    <div className={styles.cell}>{o.email}</div>
                                    <div className={styles.cell}>{o.phone}</div>
                                    <div className={styles.cell}>
                                        {o.basePrice}
                                    </div>
                                    <div className={styles.cell}>
                                        <span
                                            className={styles.statusBadge}
                                            style={{ backgroundColor: statusColors[o.status] }}
                                        >
                                            {statusTranslations[o.status]}
                                        </span>
                                    </div>
                                    <div className={styles.cell}>
                                        {o.updatedAt ? new Date(o.updatedAt).toLocaleDateString("en-EG") : ""}
                                    </div>
                                    <div className={styles.cell}>
                                        <div className={styles.actionButtons}>
                                            <button className={styles.viewButton} onClick={() => setSelectedOrder(o)} >عرض</button>
                                            <button className={styles.editButton} onClick={() => setEditOrder(o)} >تعديل</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
            }

            <div className={styles.ordersSummary}>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>إجمالي الطلبات:</span>
                    <span className={styles.summaryValue}>{orders.length}</span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>الطلبات المعروضة:</span>
                    <span className={styles.summaryValue}>{filteredOrders.length}</span>
                </div>
            </div>

            {/* Modal */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    courses={courses}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            {/* status-edit modal */}
            {editOrder && (
                <OrderStatusEditModal
                    order={editOrder}
                    onSave={newStatus => updateOrderStatus(editOrder.orderId, newStatus)}
                    onClose={() => setEditOrder(null)}
                />
            )}
        </div>
    );
};

export default OrdersView;
