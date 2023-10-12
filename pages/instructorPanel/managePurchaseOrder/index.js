import { ConfigProvider, Drawer, Table, Tag } from "antd";
import { createOrderAPI, managePurchaseOrdersAPI, routeAPI } from "../../../services/apisService";
import { useEffect, useState } from "react";
import { fullDate } from "../../../constants/DateConverter";
import Empty from "../../../components/CommonComponents/Empty";
import AllIconsComponenet from "../../../Icons/AllIconsComponenet";
import PurchaseOrderDrawer from "../../../components/ManagePurchaseOrderItem/PurchaseOrderDrawer";
import styled from "styled-components";
import * as paymentConst from "../../../constants/PaymentConst"
import Link from "next/link";
import BackToPath from "../../../components/CommonComponents/BackToPath";
import { getNewToken } from "../../../services/fireBaseAuthService";
import { mediaUrl } from "../../../constants/DataManupulation";
import { toast } from "react-toastify";
import { managePurchaseOrderConst } from "../../../constants/adminPanelConst/managePurchaseOrderConst/managePurchaseOrderConst";

const DrawerTiitle = styled.p`
    font-size:20px
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
    const { paymentStatusBank, paymentStatusOther } = paymentConst
    const [currentPage, setCurrentPage] = useState(1)

    const tableColumns = [
        {
            title: 'كلمناه؟',
            dataIndex: 'assistanceAquired',
            render: (text, _record) => {
                const changeStatusForAssistantKey = async () => {
                    let body = {
                        orderData: {
                            orderUpdate: true,
                            id: _record?.id,
                            assistanceAquired: !text
                        }
                    }
                    await createOrderAPI(body).then((res) => {
                        getPurchaseOrderList(1)
                        if (text) {
                            toast.success(managePurchaseOrderConst.studentHasNotContacted)
                        }
                        else {
                            toast.success(managePurchaseOrderConst.studentHasContacted)
                        }
                    }).catch(async (error) => {
                        if (error?.response?.status == 401) {
                            await getNewToken().then(async (token) => {
                                await createOrderAPI(body).then((res) => {
                                    getPurchaseOrderList(1)
                                    toast.success(' student contact successfully')
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
                console.log(text, _record?.paymentMethod);
                // const statusLabel = paymentStatus.find((item) => item.value == text)
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
                    (_record.paymentMethod == 'bank_transfer' ? 'bankTransfer' : 'applePayment')
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
                return (_record.totalPrice + _record.totalVat)
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
                            <AllIconsComponenet iconName={'editicon'} height={16} width={16} color={'#000000'} />
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


    const getPurchaseOrderList = async (pageNo) => {
        let data = {
            routeName: "orderList",
            page: pageNo,
            limit: 10,
            order: "createdAt DESC"
        }
        console.log(data);
        await routeAPI(data).then((res) => {
            console.log(res);
            setPaginationConfig({
                ...paginationConfig,
                total: res.data.totalItems,
            })
            const purchaseOrderList = res.data.data.map((item) => {
                return {
                    ...item,
                    key: item.id
                }
            })
            setPurchaseOrderList(purchaseOrderList)
            setCurrentPage(res.data.currentPage)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await managePurchaseOrdersAPI(data).then((res) => {
                        setPaginationConfig({
                            ...paginationConfig,
                            total: res.data.totalItems,
                        })
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }

    // const getPurchaseOrderList = async (pageNo) => {
    //     let data = {
    //         pageNo: pageNo,
    //         limit: 10,
    //         order: "createdAt DESC"
    //     }
    //     await managePurchaseOrdersAPI(data).then((res) => {
    //         console.log(res);
    //         setPaginationConfig({
    //             ...paginationConfig,
    //             total: res.data.totalItems,
    //         })
    //         const purchaseOrderList = res.data.data.map((item) => {
    //             return {
    //                 ...item,
    //                 key: item.id
    //             }
    //         })
    //         setPurchaseOrderList(purchaseOrderList)
    //         setCurrentPage(res.data.currentPage)
    //     }).catch(async (error) => {
    //         if (error?.response?.status == 401) {
    //             await getNewToken().then(async (token) => {
    //                 await managePurchaseOrdersAPI(data).then((res) => {
    //                     setPaginationConfig({
    //                         ...paginationConfig,
    //                         total: res.data.totalItems,
    //                     })
    //                 })
    //             }).catch(error => {
    //                 console.error("Error:", error);
    //             });
    //         }
    //     })
    // }

    const handleTableChange = (pagination, filter, sorter) => {
        getPurchaseOrderList(pagination.current)
    }

    const onDrawerClose = (apiCall) => {
        if (apiCall) {
            getPurchaseOrderList(currentPage)
        }
        setPurchaseOrderOpen(false);
    };


    const customEmptyComponent = (
        <Empty emptyText={'باقي محد اشترى'} containerhight={300} onClick={() => handleCreateFolder()} />
    )

    // const selectedOrderStatusLable = paymentStatus.find((item) => item.value == selectedOrder?.status)

    const selectedOrderStatusLable = selectedOrder?.paymentMethod == "bank_transfer" ? paymentStatusBank.find((item) => item.value == selectedOrder?.status) : paymentStatusOther.find((item) => item.value == selectedOrder?.status)

    return (
        <div className="maxWidthDefault">
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
                                <DrawerTiitle className="foneBold">{managePurchaseOrderConst.purchaseOrderDrawerTitle}</DrawerTiitle>
                                <DrawerTiitle className="foneBold">#{selectedOrder.id}</DrawerTiitle>
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

