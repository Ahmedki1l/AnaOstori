import React, { useEffect, useState } from 'react';
import { ConfigProvider, Table, Drawer, Select, Input, DatePicker, Button, Tag, message, Modal, Image } from 'antd';
import { SearchOutlined, FilterOutlined, DownloadOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';
import BackToPath from '../../../components/CommonComponents/BackToPath';
import { postRouteAPI, postAuthRouteAPI } from '../../../services/apisService';
import { mediaUrl } from '../../../constants/DataManupulation';
import { getNewToken } from '../../../services/fireBaseAuthService';
import styles from '../../../styles/InstructorPanelStyleSheets/ManageBookOrders.module.scss';

const { RangePicker } = DatePicker;

const StyledTable = styled(Table)`
    .ant-table-thead > tr > th {
        background-color: #FAFAFA;
        font-weight: 600;
    }
`;

const orderStatusOptions = [
    { value: '', label: 'جميع الحالات' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'waiting', label: 'بانتظار الدفع' },
    { value: 'pending_receipt', label: 'بانتظار الإيصال' },
    { value: 'pending_review', label: 'بانتظار المراجعة' },
    { value: 'paid', label: 'مدفوع' },
    { value: 'payment_verified', label: 'تم التحقق' },
    { value: 'payment_rejected', label: 'مرفوض' },
    { value: 'processing', label: 'قيد التجهيز' },
    { value: 'shipped', label: 'قيد الشحن' },
    { value: 'delivered', label: 'تم التوصيل' },
    { value: 'cancelled', label: 'ملغي' },
    { value: 'failed', label: 'فشل الدفع' }
];

const statusColors = {
    pending: '#FFA500',
    waiting: '#FAAD14',
    pending_receipt: '#FA8C16',
    pending_review: '#EB2F96',
    paid: '#1890FF',
    payment_verified: '#52C41A',
    payment_rejected: '#FF4D4F',
    processing: '#722ED1',
    shipped: '#13C2C2',
    delivered: '#52C41A',
    cancelled: '#999999',
    failed: '#FF4D4F'
};

const statusLabels = {
    pending: 'قيد الانتظار',
    waiting: 'بانتظار الدفع',
    pending_receipt: 'بانتظار الإيصال',
    pending_review: 'بانتظار المراجعة',
    paid: 'مدفوع',
    payment_verified: 'تم التحقق',
    payment_rejected: 'مرفوض',
    processing: 'قيد التجهيز',
    shipped: 'قيد الشحن',
    delivered: 'تم التوصيل',
    cancelled: 'ملغي',
    failed: 'فشل الدفع'
};

export default function ManageBookOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [receiptModalVisible, setReceiptModalVisible] = useState(false);
    const [verifyingPayment, setVerifyingPayment] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);

    useEffect(() => {
        fetchOrders(1);
    }, []);

    const fetchOrders = async (page, search = searchValue, status = statusFilter, dates = dateRange) => {
        setLoading(true);
        try {
            const body = {
                routeName: 'bookOrderList',
                page: page,
                limit: 10,
                order: 'DESC'
            };

            // Search value searches across multiple fields
            if (search) {
                body.searchValue = search;
            }

            // Filter by status
            if (status) {
                body.status = status;
            }

            // Date range filter
            if (dates[0] && dates[1]) {
                body.startDate = dayjs(dates[0]).format('YYYY-MM-DD');
                body.endDate = dayjs(dates[1]).format('YYYY-MM-DD');
            }

            const response = await postRouteAPI(body);
            
            // Handle response format from integration guide
            setOrders(response.data?.data || []);
            setTotalItems(response.data?.pagination?.total || 0);
            setCurrentPage(response.data?.pagination?.page || 1);
        } catch (error) {
            console.error('Error fetching orders:', error);
            message.error('خطأ في تحميل الطلبات');
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    const handleTableChange = (pagination) => {
        fetchOrders(pagination.current);
    };

    const handleSearch = () => {
        setSearching(true);
        fetchOrders(1);
    };

    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
        fetchOrders(1, searchValue, value, dateRange);
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates || [null, null]);
        if (dates) {
            fetchOrders(1, searchValue, statusFilter, dates);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setDrawerVisible(true);
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!selectedOrder) return;

        setUpdatingStatus(true);
        try {
            await postAuthRouteAPI({
                routeName: 'updateBookOrder',
                orderId: selectedOrder.id,
                status: newStatus
            });

            message.success('تم تحديث حالة الطلب');
            setSelectedOrder({ ...selectedOrder, status: newStatus });
            fetchOrders(currentPage);
        } catch (error) {
            console.error('Error updating order status:', error);
            message.error('حدث خطأ أثناء تحديث الحالة');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleVerifyPayment = async (action) => {
        if (!selectedOrder) return;

        setVerifyingPayment(true);
        try {
            let response;
            try {
                response = await postAuthRouteAPI({
                    routeName: 'verifyBankTransferPayment',
                    orderId: selectedOrder.id,
                    action: action
                });
            } catch (err) {
                if (err?.response?.status === 401) {
                    await getNewToken();
                    response = await postAuthRouteAPI({
                        routeName: 'verifyBankTransferPayment',
                        orderId: selectedOrder.id,
                        action: action
                    });
                } else {
                    throw err;
                }
            }

            const newStatus = action === 'verify' ? 'payment_verified' : 'payment_rejected';
            message.success(action === 'verify' ? 'تم تأكيد الدفع بنجاح' : 'تم رفض الإيصال');
            setSelectedOrder({ ...selectedOrder, status: newStatus });
            fetchOrders(currentPage);
        } catch (error) {
            console.error('Error verifying payment:', error);
            message.error('حدث خطأ أثناء تحديث الحالة');
        } finally {
            setVerifyingPayment(false);
        }
    };

    const getReceiptUrl = () => {
        if (selectedOrder?.receiptUrl) {
            return selectedOrder.receiptUrl;
        }
        if (selectedOrder?.receiptBucket && selectedOrder?.receiptKey) {
            return mediaUrl(selectedOrder.receiptBucket, selectedOrder.receiptKey);
        }
        return null;
    };

    const columns = [
        {
            title: 'رقم الطلب',
            dataIndex: 'id',
            width: 100,
            render: (id) => `#${id}`
        },
        {
            title: 'الكتاب',
            dataIndex: 'bookTitle',
            ellipsis: true
        },
        {
            title: 'الكمية',
            dataIndex: 'quantity',
            width: 80,
            align: 'center'
        },
        {
            title: 'المشتري',
            dataIndex: 'buyerFullName',
            ellipsis: true
        },
        {
            title: 'المبلغ الإجمالي',
            dataIndex: 'grandTotal',
            width: 130,
            render: (total) => `${total?.toFixed(2)} ر.س`
        },
        {
            title: 'الحالة',
            dataIndex: 'status',
            width: 120,
            render: (status) => (
                <Tag color={statusColors[status]}>
                    {statusLabels[status] || status}
                </Tag>
            )
        },
        {
            title: 'تاريخ الطلب',
            dataIndex: 'createdAt',
            width: 140,
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: '',
            dataIndex: 'actions',
            width: 100,
            render: (_, record) => (
                <Button type="link" onClick={() => handleViewOrder(record)}>
                    عرض التفاصيل
                </Button>
            )
        }
    ];

    return (
        <div className="maxWidthDefault px-4">
            <div style={{ height: 40 }}>
                <BackToPath
                    backpathForPage={true}
                    backPathArray={[
                        { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                        { lable: 'طلبات الكتب', link: null }
                    ]}
                />
            </div>

            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>طلبات الكتب</h1>
            </div>

            <ConfigProvider direction="rtl">
                <div className={styles.filtersWrapper}>
                    <div className={styles.searchBox}>
                        <Input
                            placeholder="ابحث باسم المشتري..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onPressEnter={handleSearch}
                            prefix={<SearchOutlined />}
                        />
                        <Button 
                            type="primary" 
                            onClick={handleSearch}
                            loading={searching}
                        >
                            بحث
                        </Button>
                    </div>

                    <div className={styles.filterBox}>
                        <Select
                            placeholder="حالة الطلب"
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            options={orderStatusOptions}
                            style={{ width: 160 }}
                        />
                        <RangePicker
                            value={dateRange[0] ? dateRange : null}
                            onChange={handleDateRangeChange}
                            placeholder={['من تاريخ', 'إلى تاريخ']}
                        />
                    </div>
                </div>

                <StyledTable
                    columns={columns}
                    dataSource={orders}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        current: currentPage,
                        total: totalItems,
                        pageSize: 10,
                        position: ['bottomCenter'],
                        showSizeChanger: false
                    }}
                    onChange={handleTableChange}
                />

                <Drawer
                    title={`تفاصيل الطلب #${selectedOrder?.id || ''}`}
                    placement="left"
                    width={500}
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                >
                    {selectedOrder && (
                        <div className={styles.orderDetails}>
                            <div className={styles.detailSection}>
                                <h3>معلومات الكتاب</h3>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>الكتاب:</span>
                                    <span className={styles.detailValue}>{selectedOrder.bookTitle}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>الكمية:</span>
                                    <span className={styles.detailValue}>{selectedOrder.quantity}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>سعر الوحدة:</span>
                                    <span className={styles.detailValue}>{selectedOrder.unitPrice} ر.س</span>
                                </div>
                            </div>

                            <div className={styles.detailSection}>
                                <h3>معلومات المشتري</h3>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>الاسم:</span>
                                    <span className={styles.detailValue}>{selectedOrder.buyerFullName}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>الجوال:</span>
                                    <span className={styles.detailValue}>{selectedOrder.buyerPhone}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>البريد:</span>
                                    <span className={styles.detailValue}>{selectedOrder.buyerEmail}</span>
                                </div>
                            </div>

                            <div className={styles.detailSection}>
                                <h3>عنوان التوصيل</h3>
                                {/* Handle both flat format and nested deliveryAddress JSON */}
                                {(() => {
                                    // Try to parse nested deliveryAddress first
                                    let addr = selectedOrder.deliveryAddress;
                                    if (typeof addr === 'string') {
                                        try { addr = JSON.parse(addr); } catch(e) { addr = null; }
                                    }
                                    
                                    if (addr && typeof addr === 'object') {
                                        // New nested format
                                        return (
                                            <div className={styles.addressDetails}>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>المدينة:</span>
                                                    <span className={styles.detailValue}>{addr.city || '-'}</span>
                                                </div>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>الحي:</span>
                                                    <span className={styles.detailValue}>{addr.district || '-'}</span>
                                                </div>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>الشارع:</span>
                                                    <span className={styles.detailValue}>{addr.street || '-'}</span>
                                                </div>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>رقم المبنى:</span>
                                                    <span className={styles.detailValue}>{addr.buildingNumber || '-'}</span>
                                                </div>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>الرمز البريدي:</span>
                                                    <span className={styles.detailValue}>{addr.postalCode || '-'}</span>
                                                </div>
                                                {addr.additionalCode && (
                                                    <div className={styles.detailRow}>
                                                        <span className={styles.detailLabel}>الرمز الإضافي:</span>
                                                        <span className={styles.detailValue}>{addr.additionalCode}</span>
                                                    </div>
                                                )}
                                                {addr.shortAddress && (
                                                    <div className={styles.detailRow}>
                                                        <span className={styles.detailLabel}>العنوان المختصر:</span>
                                                        <span className={styles.detailValue}>{addr.shortAddress}</span>
                                                    </div>
                                                )}
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>الدولة:</span>
                                                    <span className={styles.detailValue}>{addr.country || 'المملكة العربية السعودية'}</span>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        // Old flat format fallback
                                        return (
                                            <p className={styles.addressText}>
                                                {selectedOrder.deliveryStreet || '-'}<br />
                                                {selectedOrder.deliveryCity || '-'}, {selectedOrder.deliveryPostalCode || '-'}<br />
                                                {selectedOrder.deliveryCountry || 'المملكة العربية السعودية'}
                                            </p>
                                        );
                                    }
                                })()}
                            </div>

                            <div className={styles.detailSection}>
                                <h3>ملخص المبالغ</h3>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>المجموع:</span>
                                    <span className={styles.detailValue}>{selectedOrder.totalPrice} ر.س</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>الضريبة:</span>
                                    <span className={styles.detailValue}>{selectedOrder.totalVat} ر.س</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>رسوم التوصيل:</span>
                                    <span className={styles.detailValue}>{selectedOrder.deliveryFee} ر.س</span>
                                </div>
                                <div className={`${styles.detailRow} ${styles.totalRow}`}>
                                    <span className={styles.detailLabel}>الإجمالي:</span>
                                    <span className={styles.detailValue}>{selectedOrder.grandTotal} ر.س</span>
                                </div>
                            </div>

                            <div className={styles.detailSection}>
                                <h3>تحديث الحالة</h3>
                                <Select
                                    value={selectedOrder.status}
                                    onChange={handleUpdateStatus}
                                    loading={updatingStatus}
                                    style={{ width: '100%' }}
                                    options={orderStatusOptions.filter(o => o.value !== '')}
                                />
                            </div>

                            {/* Bank Transfer Receipt Section */}
                            {(selectedOrder.receiptUrl || selectedOrder.receiptKey) && (
                                <div className={styles.detailSection}>
                                    <h3>إيصال التحويل البنكي</h3>
                                    <div className={styles.receiptActions}>
                                        <Button 
                                            icon={<EyeOutlined />}
                                            onClick={() => setReceiptModalVisible(true)}
                                        >
                                            عرض الإيصال
                                        </Button>
                                        <Button 
                                            icon={<DownloadOutlined />}
                                            href={getReceiptUrl()}
                                            target="_blank"
                                        >
                                            تحميل
                                        </Button>
                                    </div>
                                    
                                    {selectedOrder.status === 'pending_review' && (
                                        <div className={styles.verifyActions}>
                                            <Button
                                                type="primary"
                                                icon={<CheckCircleOutlined />}
                                                onClick={() => handleVerifyPayment('verify')}
                                                loading={verifyingPayment}
                                                style={{ background: '#52C41A', borderColor: '#52C41A' }}
                                            >
                                                تأكيد الدفع
                                            </Button>
                                            <Button
                                                danger
                                                icon={<CloseCircleOutlined />}
                                                onClick={() => handleVerifyPayment('reject')}
                                                loading={verifyingPayment}
                                            >
                                                رفض الإيصال
                                            </Button>
                                        </div>
                                    )}

                                    {selectedOrder.paymentVerifiedAt && (
                                        <div className={styles.verifiedInfo}>
                                            <Tag color="green">تم التحقق بتاريخ {dayjs(selectedOrder.paymentVerifiedAt).format('DD/MM/YYYY HH:mm')}</Tag>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedOrder.invoiceKey && (
                                <div className={styles.invoiceSection}>
                                    <Button 
                                        icon={<DownloadOutlined />}
                                        href={mediaUrl(selectedOrder.invoiceBucket, selectedOrder.invoiceKey)}
                                        target="_blank"
                                    >
                                        تحميل الفاتورة
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </Drawer>

                {/* Receipt View Modal */}
                <Modal
                    title="إيصال التحويل البنكي"
                    open={receiptModalVisible}
                    onCancel={() => setReceiptModalVisible(false)}
                    footer={null}
                    width={700}
                    centered
                >
                    {getReceiptUrl() && (
                        <div style={{ textAlign: 'center' }}>
                            {getReceiptUrl()?.toLowerCase().endsWith('.pdf') ? (
                                <iframe
                                    src={getReceiptUrl()}
                                    width="100%"
                                    height="500px"
                                    style={{ border: 'none' }}
                                />
                            ) : (
                                <Image
                                    src={getReceiptUrl()}
                                    alt="Bank Transfer Receipt"
                                    style={{ maxWidth: '100%', maxHeight: '70vh' }}
                                />
                            )}
                        </div>
                    )}
                </Modal>
            </ConfigProvider>
        </div>
    );
}
