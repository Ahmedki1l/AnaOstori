import { ConfigProvider, Drawer, Table, Tag } from "antd";
import { managePurchaseOrdersAPI } from "../../../services/apisService";
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

const DrawerTiitle = styled.p`
    font-size:20px
`

const Index = () => {

    const [open, setOpen] = useState(false);
    const [purchaseOrderList, setPurchaseOrderList] = useState()
    const [paginationConfig, setPaginationConfig] = useState()
    const [selectedOrder, setSelectedOrder] = useState()
    const paymentStatus = paymentConst.paymentStatus
    console.log(paymentStatus);

    const tableColumns = [
        {
            title: 'كلمناه؟',
            dataIndex: '',
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
        },
        {
            title: 'حالة الحجز',
            dataIndex: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (text) => {
                const statusLabel = paymentStatus.find((item) => item.value == text)
                return (
                    <Tag color={statusLabel.color}>{statusLabel?.label}</Tag>
                )
            }
        },
        {
            title: 'طريقة الدفع',
            dataIndex: 'paymentMethod',
            render: (text, _record) => {
                const iconName = text == "bank_transfer" ? 'bankTransfer' :
                    (text == 'none' ? 'applePayment' :
                        ((text == 'hyperpay' && _record.cardType == 'credit') ? 'visaPayment' : 'madaPayment'))
                console.log(iconName, text);
                return (
                    <AllIconsComponenet iconName={iconName} height={18} width={18} />
                )
            }
        },
        {
            title: 'المبلغ المدفوع  مع الضريبة',
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
                    setOpen(true)
                    setSelectedOrder(_record)
                }
                const status = _record.status === 'accepted'
                return (
                    <div className='flex'>
                        <div className='pl-2' onClick={handleEditOrders}>
                            <AllIconsComponenet iconName={'editicon'} height={16} width={16} color={'#000000'} />
                        </div>
                        {status &&
                            <Link className='pr-2' href={mediaUrl(_record.invoiceBucket, _record.invoiceKey)} target='_blank'>
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
            pageNo: pageNo,
            limit: 10,
            order: "createdAt DESC"
        }
        await managePurchaseOrdersAPI(data).then((res) => {
            setPaginationConfig({
                pageSize: 10,
                total: res.data.totalItems,
                pageSizeOptions: [],
                position: ['bottomCenter']
            })
            setPurchaseOrderList(res.data.data)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await managePurchaseOrdersAPI(data).then((res) => {
                        setPaginationConfig({
                            pageSize: 10,
                            total: res.data.totalItems,
                            pageSizeOptions: [],
                            position: ['bottomCenter']
                        })
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }

    const handleTableChange = (pagination, filter, sorter) => {
        getPurchaseOrderList(pagination.current)
    }

    const onClose = () => {
        setOpen(false);
    };


    const customEmptyComponent = (
        <Empty emptyText={'لم تقم بإضافة اي مجلد'} containerhight={400} onClick={() => handleCreateFolder()} />
    )

    const selectedOrderStatusLable = paymentStatus.find((item) => item.value == selectedOrder?.status)


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

                {open &&
                    <Drawer
                        title={
                            <>
                                <DrawerTiitle className="foneBold">تفاصيل حجز رقم</DrawerTiitle>
                                <DrawerTiitle className="foneBold">#{selectedOrder.id}</DrawerTiitle>
                            </>
                        }
                        closable={false}
                        placement={'right'}
                        open={open}
                        onClose={onClose}
                        width={480}
                        extra={
                            <Tag style={{ fontSize: 16, padding: 10 }} bordered={false} color={selectedOrderStatusLable.color}>{selectedOrderStatusLable?.label}</Tag>
                        }
                    >
                        <PurchaseOrderDrawer selectedOrder={selectedOrder} />
                    </Drawer>}
            </ConfigProvider>
        </div>
    )
}

export default Index

