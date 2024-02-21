import React, { use, useEffect, useState } from 'react'
import BackToPath from '../../../../components/CommonComponents/BackToPath'
import ComponentForLineChart from '../../../../components/CommonComponents/ComponentForLineChart/ComponentForLineChart'
import styles from '../../../../styles/InstructorPanelStyleSheets/ManageAdminOverView.module.scss'
import { ConfigProvider, DatePicker, Drawer, Tag } from 'antd'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getAuthRouteAPI, getRouteAPI, postAuthRouteAPI, postRouteAPI } from '../../../../services/apisService'
import CustomOrderListComponent from '../../../../components/CommonComponents/CustomOrderListComponent/CustomOrderListComponent'
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet'
import { toast } from 'react-toastify'
import { managePurchaseOrderConst } from '../../../../constants/adminPanelConst/managePurchaseOrderConst/managePurchaseOrderConst'
import { fullDate } from '../../../../constants/DateConverter'
import { mediaUrl } from '../../../../constants/DataManupulation'
import dayjs from 'dayjs'
import styled from 'styled-components'
import PurchaseOrderDrawer from '../../../../components/ManagePurchaseOrderItem/PurchaseOrderDrawer'
import * as PaymentConst from '../../../../constants/PaymentConst'
import Spinner from '../../../../components/CommonComponents/spinner'
import { getNewToken } from '../../../../services/fireBaseAuthService'
import Empty from '../../../../components/CommonComponents/Empty'

const DrawerTiitle = styled.p`
    font-size: ${props => (props.fontSize ? props.fontSize : '20')}px !important;
`

const Index = () => {
    const { RangePicker } = DatePicker;
    const [purchaseOrderList, setPurchaseOrderList] = useState([])
    const [drawerForOrders, setDrawerForOrders] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState()
    const pathName = usePathname()
    const pathNameForOrderStatus = pathName?.split('/')[3]
    const { paymentStatusBank, paymentStatusOther } = PaymentConst
    const [isLoading, setIsLoading] = useState(false)
    const [paginationConfig, setPaginationConfig] = useState({
        pageSizeOptions: [],
        position: ['bottomCenter'],
        pageSize: 10,
    })
    const [dashBoardData, setDashBoardData] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [dates, setDates] = useState(null);
    const [orderDataForLineChart, setOrderDataForLineChart] = useState()
    const [selectedDate, setSelectedDate] = useState()
    const [dateRange, setDateRange] = useState({
        startDate: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD')
    })
    const disabledDate = (current) => {
        return current && current > dayjs().endOf('day');
    };
    const selectedOrderStatusLable = selectedOrder?.paymentMethod == "bank_transfer" ?
        paymentStatusBank.find((item) => item.value == selectedOrder?.status) :
        paymentStatusOther.find((item) => item.value == selectedOrder?.status)

    useEffect(() => {
        if (dateRange !== null) {
            getDashBoardData()
        }
    }, [dateRange])

    useEffect(() => {
        if (dateRange !== null) {
            getPurchaseOrderList()
        }
    }, [dateRange, currentPage])

    const onOpenChange = (open) => {
        if (open) {
            setDates([null, null]);
        } else {
            setDates(null);
        }
    };
    const handleDateChange = (val) => {
        if (val !== null && val.length === 2) {
            const startDate = dayjs(val[0]).format('YYYY-MM-DD');
            const endDate = dayjs(val[1]).format('YYYY-MM-DD');
            setDateRange({
                startDate: startDate,
                endDate: endDate
            });
            setSelectedDate(val);
        } else if (val === null) {
            setDateRange(null)
            setSelectedDate(null);
            setCurrentPage(1)
        }
    };

    const createOrderLineChartData = (data) => {
        const selectedStartDate = dateRange?.startDate;
        const selectedEndDate = dateRange?.endDate;
        const labels = [];
        const totalEarnings = [];
        if (selectedDate === undefined) {
            for (let i = 0; i < 7; i++) {
                const date = dayjs(selectedStartDate).add(i, 'day').format('YYYY-MM-DD');
                labels.push(date);
                const total = data?.graphData?.filter(order => dayjs(order.orderDate).format('YYYY-MM-DD') === date).reduce((acc, order) => {
                    return acc + (order.totalPrice || 0);
                }, 0);
                totalEarnings.push(total);
            }
        }
        else if (selectedDate !== undefined) {
            if (dayjs(selectedEndDate).diff(dayjs(selectedStartDate), 'day') > 0 && dayjs(selectedEndDate).diff(dayjs(selectedStartDate), 'day') < 91) {
                for (let i = 0; i < dayjs(selectedEndDate).diff(dayjs(selectedStartDate), 'day') + 1; i++) {
                    const date = dayjs(selectedStartDate).add(i, 'day').format('YYYY-MM-DD');
                    labels.push(date);
                    const total = data?.graphData?.filter(order => dayjs(order.orderDate).format('YYYY-MM-DD') === date).reduce((acc, order) => {
                        return acc + (order.totalPrice || 0);
                    }, 0);
                    totalEarnings.push(total);
                }
            }
            if (dayjs(selectedEndDate).diff(dayjs(selectedStartDate), 'day') > 90) {
                const monthlyTotalEarnings = {};
                data?.graphData?.forEach(order => {
                    const month = dayjs(order.orderDate).format('YYYY-MM');
                    monthlyTotalEarnings[month] = (monthlyTotalEarnings[month] || 0) + (order.totalPrice || 0);
                });
                // Object.entries(monthlyTotalEarnings).forEach(([month, earnings]) => {
                //     labels.push(month);
                //     totalEarnings.push(earnings);
                // });
                const sortedMonths = Object.keys(monthlyTotalEarnings).sort(); // sort by month
                sortedMonths.forEach(month => {
                    labels.push(month);
                    totalEarnings.push(monthlyTotalEarnings[month]);
                });
            }
        }
        const lineChartData = {
            chartId: 'lineChartForOrders',
            labels: labels,
            datasets: {
                label: 'إجمالي الربح',
                data: totalEarnings,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.10,
            },
        }
        setOrderDataForLineChart(lineChartData);
    }

    const getPurchaseOrderList = async () => {
        setIsLoading(true)
        let body = {
            routeName: "orderList",
            page: currentPage,
            limit: 10,
            order: "createdAt DESC"
        }
        if (pathNameForOrderStatus === 'completedOrders') {
            body.filterType = 'status'
            body.filterValue = 'accepted'
        }
        if (pathNameForOrderStatus === 'refundedOrders') {
            body.filterType = 'status'
            body.filterValue = 'refund'
        }
        if (pathNameForOrderStatus === 'rejectedOrders') {
            body.filterType = 'status'
            body.filterValue = 'rejected'
        }
        if (dateRange !== null) {
            body.startDate = dateRange.startDate
            body.endDate = dateRange.endDate
        }
        await postRouteAPI(body).then((res) => {
            setIsLoading(false)
            setPaginationConfig((prevConfig) => ({
                ...prevConfig,
                total: res.data.totalItems,
                current: res.data.currentPage,
            }));
            const purchaseOrderList = res.data.data.map((item) => {
                return {
                    ...item,
                    key: item.id
                }
            })
            setPurchaseOrderList(purchaseOrderList)
        }).catch((err) => {
            console.log(err);
            setIsLoading(false)
        })
    }

    const getDashBoardData = async () => {
        setIsLoading(true);
        try {
            const newData = {
                routeName: 'dashboard',
            };
            if (dateRange !== null) {
                newData.startDate = dateRange.startDate;
                newData.endDate = dateRange.endDate;
            }
            const response = await getRouteAPI(newData);
            setIsLoading(false);
            setDashBoardData(response.data);
            createOrderLineChartData(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                try {
                    await getNewToken();
                    const response = await getRouteAPI(newData);
                    setIsLoading(false);
                    setDashBoardData(response.data);
                    createOrderLineChartData(response.data);
                } catch (error) {
                    console.error('Error getting data:', error);
                }
            } else {
                console.error('Error getting data:', error);
                throw error;
            }
        }
    };

    const adminDashBoardData = [
        {
            id: 1,
            titleHead: Math.floor(dashBoardData?.orderStats.find(order => order.status === 'accepted')?.totalAcceptedPrice) || ' ر.س EarningMoney',
            titleBody: 'إجمالي المبيعات',
            viewMoreInfo: 'عرض التفاصيل',
            iconName: 'dollarIcon',
        },
        {
            id: 2,
            titleHead: dashBoardData?.orderStats.find(order => order.status === 'accepted')?.count || '0',
            titleBody: 'طلب مكتمل ',
            iconName: 'managePurchaseOrder',
        },
    ]
    const onDrawerClose = () => {
        setDrawerForOrders(false);
        getPurchaseOrderList()
    };
    const data = {
        tableColumns: [
            {
                title: 'كلمناه؟',
                dataIndex: 'assistanceAquired',
                render: (text, _record) => {
                    const changeStatusForAssistantKey = async () => {
                        let body = {
                            routeName: 'createOrder',
                            orderUpdate: true,
                            id: _record?.id,
                            assistanceAquired: !text
                        }
                        await postAuthRouteAPI(body).then((res) => {
                            getPurchaseOrderList()
                            if (text) {
                                toast.success(managePurchaseOrderConst.studentHasNotContacted, { rtl: true, })
                            }
                            else {
                                toast.success(managePurchaseOrderConst.studentHasContacted, { rtl: true, })
                            }
                        }).catch(async (error) => {
                            if (error?.response?.status == 401) {
                                await getNewToken().then(async (token) => {
                                    await postAuthRouteAPI(body).then((res) => {
                                        getPurchaseOrderList()
                                        if (text) {
                                            toast.success(managePurchaseOrderConst.studentHasNotContacted, { rtl: true, })
                                        }
                                        else {
                                            toast.success(managePurchaseOrderConst.studentHasContacted, { rtl: true, })
                                        }
                                    })
                                }).catch(error => {
                                    console.error("Error:", error);
                                });
                            }
                            console.log(error);
                        })
                    }
                    return (
                        <div className="cursor-pointer" onClick={() => changeStatusForAssistantKey(true)}>
                            <AllIconsComponenet iconName={_record.assistanceAquired == true ? 'present' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                        </div>
                    )
                }
            },
            {
                title: 'رقم الطلب',
                dataIndex: 'id',
            },
            {
                title: 'عنوان الدورة',
                dataIndex: 'courseName',
            },
            {
                title: 'اسم الحاجز',
                dataIndex: 'buyerFullName',
            },
            {
                title: 'رقم الجوال',
                dataIndex: 'buyerPhone',
                render: (text, _record) => {
                    const mobileNumber = text.includes('+') ? text.slice(1) : text
                    return (
                        <Link target={'_blank'} href={`https://api.whatsapp.com/send/?phone=${mobileNumber}&text&type=phone_number&app_absent=0`}>{mobileNumber}</Link>
                    )
                }
            },
            {
                title: 'الايميل',
                dataIndex: 'buyerEmail',
                render: (text) => {
                    if (text) {
                        return (
                            <Link target={'_blank'} href={`mailto:${text}`}>{text}</Link>
                        )
                    } else {
                        return '-'
                    }
                }
            },
            {
                title: 'حالة الحجز',
                dataIndex: 'status',
                render: (text, _record) => {
                    const statusLabel = _record?.paymentMethod == "bank_transfer" ? paymentStatusBank.find((item) => item.value == text) : paymentStatusOther.find((item) => item.value == text)
                    return (
                        <Tag color={statusLabel?.color}>{statusLabel?.label}</Tag>
                    )
                }
            },
            {
                title: 'طريقة الدفع',
                dataIndex: 'paymentMethod',
                render: (text, _record) => {
                    const paymentMode = _record.paymentMethod == 'hyperpay' ? _record.cardType == 'credit' ? _record.cardBrand == 'visa' ? 'visaPayment' : 'masterCardPayment' :
                        _record.cardType == 'mada' ? 'madaPayment' : 'applePayment' :
                        (_record.paymentMethod == 'bank_transfer' ? 'bankTransfer' : 'inAppPurchaseIcon')
                    return (
                        <AllIconsComponenet iconName={paymentMode} height={18} width={18} />
                    )
                }
            },
            {
                title: 'المبلغ المدفوع مع الضريبة',
                dataIndex: 'totalPrice',
            },
            {
                title: 'تاريخ الحجز',
                dataIndex: 'createdAt',
                render: (text, _date) => {
                    return (fullDate(_date.createdAt))
                }
            },
            {
                title: 'تاريخ اخر تحديث',
                dataIndex: 'updatedAt',
                render: (text, _date) => {
                    return (fullDate(_date.updatedAt))
                }
            },
            {
                title: 'الإجراءات',
                dataIndex: 'actions',
                render: (data, _record) => {
                    const handleEditOrders = () => {
                        setDrawerForOrders(true)
                        setSelectedOrder(_record)
                    }
                    const status = _record.status === 'accepted'
                    return (
                        <div className='flex'>
                            <div className='pl-2 cursor-pointer' onClick={handleEditOrders}>
                                <AllIconsComponenet iconName={'newEditIcon'} height={18} width={18} color={'#000000'} />
                            </div>
                            {(pathNameForOrderStatus !== 'rejectedOrders') &&
                                <Link className='pr-2 cursor-pointer' href={mediaUrl(_record.invoiceBucket, _record.invoiceKey)} target='_blank'>
                                    <AllIconsComponenet height={18} width={18} iconName={'downloadIcon'} color={'#000000'} />
                                </Link>
                            }
                        </div>
                    )
                }
            },
        ],
        dataSource: purchaseOrderList,
        paginationConfig: paginationConfig,
        handleTableChange: (pagination) => {
            if (pagination.current !== currentPage) {
                setCurrentPage(pagination.current)
            }
        }
    }
    return (
        <div className='maxWidthDefault px-4'>
            <div className='py-2'>
                <BackToPath
                    backPathArray={
                        [
                            { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel' },
                            { lable: 'إحصائيات الموقع', link: '/instructorPanel/manageAdminDashBoard' },
                            {
                                lable: pathNameForOrderStatus === 'completedOrders' ? 'الطلبات المكتملة' :
                                    pathNameForOrderStatus === 'refundedOrders' ? 'الطلبات المسترجعة' :
                                        'الطلبات المرفوضة', link: null
                            },
                        ]
                    }
                />
            </div>
            <h1 className={`head2 pt-6 pr-2`}>{pathNameForOrderStatus === 'completedOrders' ? 'بيانات الطلبات المؤكدة' : pathNameForOrderStatus === 'refundedOrders' ? 'بيانات الطلبات المسترجعة' : 'بيانات الطلبات المرفوضة'}</h1>
            <div className='my-6 flex flex-row-reverse' >
                <RangePicker
                    height={40}
                    disabledDate={disabledDate}
                    defaultValue={[dayjs().subtract(6, 'day'), dayjs()]}
                    // defaultValue={[dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')]}
                    onCalendarChange={(val) => {
                        setDates(val);
                    }}
                    onChange={(val) => {
                        handleDateChange(val);
                    }}
                    onOpenChange={onOpenChange}
                    changeOnBlur
                    size="large"
                    placeholder={['تاريخ البداية', 'تاريخ النهاية']}
                />
            </div>
            {dateRange === null ?
                <Empty emptyText={'لا توجد بيانات'} containerhight={500} />
                :
                <div>
                    {pathNameForOrderStatus === 'completedOrders' &&
                        <div className='flex justify-between'>

                            <div className='w-3/4' >
                                <div className={`${styles.graphWrapper} flex justify-center`}>
                                    {orderDataForLineChart && <ComponentForLineChart data={orderDataForLineChart} />}
                                </div>
                            </div>
                            <div className={`w-1/4 ${styles.cardContainer}`}>
                                {adminDashBoardData.map((data, index) => (
                                    <div key={`index ${index}`} className={styles.cardWrapper}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className='flex items-center flex-row-reverse'>
                                                <div className='ml-2'><AllIconsComponenet iconName={data.iconName} height={32} width={32} color={'#F06A25'} /></div>
                                                <p style={{ color: '#F06A25', fontWeight: '900', fontSize: '24px' }}>{data.titleHead}</p>
                                            </div>
                                            <p style={{ fontWeight: '500', fontSize: '20px' }}>{data.titleBody}</p>
                                        </div>
                                        {data.nextPageLink && (
                                            <div style={{ textAlign: 'left' }}>
                                                <Link href={data.nextPageLink ? data.nextPageLink : null} className='no-underline' style={{ color: '#0075FF' }}>{data.viewMoreInfo}</Link>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    {isLoading ?
                        <Spinner borderwidth={6} width={6} height={6} margin={0.5} />
                        :
                        <div className='w-full'>
                            <CustomOrderListComponent data={data} />
                        </div>
                    }
                </div>
            }
            <ConfigProvider direction="rtl">
                {selectedOrder &&
                    <Drawer
                        title={
                            <>
                                <DrawerTiitle className="fontBold">{managePurchaseOrderConst.purchaseOrderDrawerTitle}</DrawerTiitle>
                                <DrawerTiitle className="fontBold">#{selectedOrder.id}</DrawerTiitle>
                            </>
                        }
                        closable={false}
                        placement={'right'}
                        open={drawerForOrders}
                        onClose={onDrawerClose}
                        width={480}
                        extra={
                            <Tag style={{ fontSize: 16, padding: 10 }} bordered={false} color={selectedOrderStatusLable.color}>{selectedOrderStatusLable?.label}</Tag>
                        }
                    >
                        <PurchaseOrderDrawer selectedOrder={selectedOrder} onClose={onDrawerClose} />
                    </Drawer>}
            </ConfigProvider>
        </div>
    )
}

export default Index
