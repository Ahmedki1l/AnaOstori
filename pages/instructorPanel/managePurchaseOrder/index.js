import { ConfigProvider, DatePicker, Drawer, Table, Tag } from "antd";
import { postAuthRouteAPI, postRouteAPI } from "../../../services/apisService";
import { useEffect, useMemo, useState } from "react";
import { fullDate } from "../../../constants/DateConverter";
import Empty from "../../../components/CommonComponents/Empty";
import AllIconsComponenet from "../../../Icons/AllIconsComponenet";
import PurchaseOrderDrawer from "../../../components/ManagePurchaseOrderItem/PurchaseOrderDrawer";
import styled from "styled-components";
import Link from "next/link";
import BackToPath from "../../../components/CommonComponents/BackToPath";
import { getNewToken } from "../../../services/fireBaseAuthService";
import { mediaUrl } from "../../../constants/DataManupulation";
import { toast } from "react-toastify";
import { managePurchaseOrderConst } from "../../../constants/adminPanelConst/managePurchaseOrderConst/managePurchaseOrderConst";
import Input from "../../../components/antDesignCompo/Input";
import { SearchOutlined } from '@ant-design/icons';
import styles from '../../../styles/InstructorPanelStyleSheets/ManagePurchaseOrder.module.scss'
import Select from "../../../components/antDesignCompo/Select";
import { FormItem } from "../../../components/antDesignCompo/FormItem";
import dayjs from "dayjs";
import * as PaymentConst from "../../../constants/PaymentConst";
import Logo from '../../../components/CommonComponents/Logo';

const DrawerTiitle = styled.p`
font-size: ${props => (props.fontSize ? props.fontSize : '20')}px !important;
`

const Index = () => {
    const [purchaseOrderOpen, setPurchaseOrderOpen] = useState(false);
    const [purchaseOrderList, setPurchaseOrderList] = useState()
    const [paginationConfig, setPaginationConfig] = useState({
        pageSizeOptions: [],
        position: ['bottomCenter'],
        pageSize: 10,
    })
    const [selectedOrder, setSelectedOrder] = useState()
    const { paymentStatusBank, paymentStatusOther, paymentMode, allPaymentStatus } = PaymentConst
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState()
    const [selectedStatus, setSelectedStatus] = useState()
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState()
    const { RangePicker } = DatePicker;
    const [dates, setDates] = useState(null);
    const [selectedDates, setSelectedDates] = useState(null);
    const regexEmail = useMemo(() => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, []);
    const regexPhone = useMemo(() => /^\d+$/, []);

    const tableColumns = [
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
                        getPurchaseOrderList(currentPage)
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
                                    getPurchaseOrderList(1)
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
            sorter: (a, b) => a.id - b.id,
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
            render: (text) => {
                const mobileNumber = text.includes('+') ? text.slice(1) : text
                return (
                    <Link target={'_blank'} href={`https://api.whatsapp.com/send/?phone=${mobileNumber}&text&type=phone_number&app_absent=0`}>{mobileNumber}</Link>
                )
            }
        },
        {
            title: 'الايميل',
            dataIndex: 'buyerEmail',
            sorter: (a, b) => a.buyerEmail.localeCompare(b.buyerEmail),
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
            sorter: (a, b) => a.status.localeCompare(b.status),
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
                if(_record.paymentMethod == 'tabby') {
                    return (
                        <Logo height={30} width={30} logoName={'tabbyPaymentLogo'} alt={'Payment Methode Logo'} />
                    )
                }

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
            dataIndex: 'priceWithVat',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            render: (text, _record) => {
                return (Number(Number(_record.totalPrice) + Number(_record.totalVat)).toFixed(2))
            }
        },
        {
            title: 'تاريخ الحجز',
            dataIndex: 'createdAt',
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            render: (text, _date) => {
                return (fullDate(_date.createdAt))
            }
        },
        {
            title: 'تاريخ اخر تحديث',
            dataIndex: 'updatedAt',
            sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
            render: (text, _date) => {
                return (fullDate(_date.updatedAt))
            }
        },
        {
            title: 'الإجراءات',
            dataIndex: 'actions',
            render: (data, _record) => {
                const handleEditOrders = () => {
                    setPurchaseOrderOpen(true)
                    setSelectedOrder(_record)
                }
                const status = _record.status === 'accepted'
                return (
                    <div className='flex'>
                        <div className='pl-2 cursor-pointer' onClick={handleEditOrders}>
                            <AllIconsComponenet iconName={'newEditIcon'} height={20} width={20} color={'#000000'} />
                        </div>
                        {(status && _record.invoiceKey) &&
                            <Link className='pr-2 cursor-pointer' href={mediaUrl(_record.invoiceBucket, _record.invoiceKey)} target='_blank'>
                                <AllIconsComponenet height={18} width={18} iconName={'downloadIcon'} color={'#000000'} />
                            </Link>
                        }
                    </div>
                )
            }
        },
    ];
    useEffect(() => {
        getPurchaseOrderList(1)
    }, [])

    const getPurchaseOrderList = async (pageNo, searchValue) => {
        let body = {
            routeName: "orderList",
            page: pageNo,
            limit: 10,
            order: "createdAt DESC"
        }
        if (searchValue) {
            body.searchType = regexEmail.test(searchValue) ? 'buyerEmail' : regexPhone.test(searchValue) ? 'buyerPhone' : 'buyerFullName'
            body.searchValue = searchValue
        }
        if (selectedStatus) {
            body.filterType = "status"
            body.filterValue = selectedStatus
        }
        if (selectedPaymentMethod && selectedPaymentMethod !== 'bank_transfer') {
            body.filterType = "cardType"
            body.filterValue = selectedPaymentMethod
        }
        if (selectedPaymentMethod == 'bank_transfer' || selectedPaymentMethod == 'inAppPurchase') {
            body.filterType = "paymentMethod"
            body.filterValue = selectedPaymentMethod
        }
        if (selectedDates) {
            body.startDate = dayjs(selectedDates[0]).format('YYYY-MM-DD')
            body.endDate = dayjs(selectedDates[1]).format('YYYY-MM-DD')
        }
        await postRouteAPI(body).then((res) => {
            setPaginationConfig((prevConfig) => ({
                ...prevConfig,
                total: res.data.totalItems,
                current: res.data.currentPage,
            }));
            setCurrentPage(res.data.currentPage)
            const purchaseOrderList = res.data.data.map((item) => {
                return {
                    ...item,
                    key: item.id
                }
            })
            setPurchaseOrderList(purchaseOrderList)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postRouteAPI(data).then((res) => {
                        setPurchaseOrderList(res.data.data)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }
    const handleTableChange = (pagination) => {
        getPurchaseOrderList(pagination.current, searchValue)
        setCurrentPage(pagination.current)
    }
    const onDrawerClose = () => {
        setPurchaseOrderOpen(false);
        getPurchaseOrderList(currentPage, searchValue)
    };
    const customEmptyComponent = (
        <Empty emptyText={'باقي محد اشترى'} containerhight={300} onClick={() => handleCreateFolder()} />
    )
    const selectedOrderStatusLable = selectedOrder?.paymentMethod == "bank_transfer" ? paymentStatusBank.find((item) => item.value == selectedOrder?.status) : paymentStatusOther.find((item) => item.value == selectedOrder?.status)
    const handleSearchFilters = async () => {
        getPurchaseOrderList(1, searchValue)
    }
    const handleSearchValueChange = (value) => {
        setSearchValue(value)
        if (value == '') {
            getPurchaseOrderList(1, value)
        }
    }
    const onOpenChange = (open) => {
        if (open) {
            setDates([null, null]);
        } else {
            setDates(null);
        }
    };
    return (
        <div className="maxWidthDefault px-4">
            <div style={{ height: 40 }}>
                <BackToPath
                    backpathForPage={true}
                    backPathArray={
                        [
                            { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                            { lable: 'متابعة وتحديث حالة المشتريات', link: null },
                        ]
                    }
                />
            </div>
            <div className='flex justify-between mb-2'>
                <div className="flex">
                    <div className='ml-3'>
                        <Input
                            placeholder="Search"
                            height={40}
                            fontSize={16}
                            onChange={(e) => handleSearchValueChange(e.target.value)}
                            prefix={<SearchOutlined />}
                            allowClear={true}
                        />
                    </div>
                    <FormItem
                        name={'status'}
                    >
                        <Select
                            fontSize={16}
                            width={180}
                            height={40}
                            placeholder='حالة الحجز'
                            OptionData={allPaymentStatus}
                            allowClear={true}
                            onChange={(value) => setSelectedStatus(value)}
                        />
                    </FormItem>
                    <FormItem
                        name={'paymentMethod'}
                    >
                        <Select
                            fontSize={16}
                            width={180}
                            height={40}
                            placeholder='طريقة الدفع'
                            OptionData={paymentMode}
                            allowClear={true}
                            onChange={(value) => setSelectedPaymentMethod(value)}
                        />
                    </FormItem>
                    <div className='ml-3'>
                        <RangePicker
                            height={40}
                            value={dates || selectedDates}
                            onCalendarChange={(val) => {
                                setDates(val);
                            }}
                            onChange={(val) => {
                                setSelectedDates(val);
                            }}
                            onOpenChange={onOpenChange}
                            changeOnBlur
                            size="large"
                        />
                    </div>
                </div>
                <div>
                    <button className={`primaryStrockedBtn ${styles.searchBtnWrapper}`} onClick={handleSearchFilters}>
                        <AllIconsComponenet height={20} width={20} iconName={'newFilterIcon'} color={'#F26722'} />
                        <p className="pr-2">فلترة</p>
                    </button>
                </div>
            </div>
            <ConfigProvider direction="rtl">
                <Table
                    columns={tableColumns}
                    minheight={400}
                    dataSource={purchaseOrderList}
                    pagination={paginationConfig}
                    locale={{ emptyText: customEmptyComponent }}
                    onChange={handleTableChange}
                />

                {purchaseOrderOpen &&
                    <Drawer
                        title={
                            <>
                                <DrawerTiitle className="fontBold">{managePurchaseOrderConst.purchaseOrderDrawerTitle}</DrawerTiitle>
                                <DrawerTiitle className="fontBold">#{selectedOrder.id}</DrawerTiitle>
                            </>
                        }
                        closable={false}
                        placement={'right'}
                        open={purchaseOrderOpen}
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

