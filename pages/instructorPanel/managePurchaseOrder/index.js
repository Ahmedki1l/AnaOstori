import { ConfigProvider, Drawer, Form, Table } from "antd";
import { createOrderAPI, managePurchaseOrdersAPI } from "../../../services/apisService";
import { useEffect, useState } from "react";
import { fullDate } from "../../../constants/DateConverter";
import Empty from "../../../components/CommonComponents/Empty";
import AllIconsComponenet from "../../../Icons/AllIconsComponenet";
import styles from '../../../styles/InstructorPanelStyleSheets/ManagePurchaseOrder.module.scss'
import { FormItem } from "../../../components/antDesignCompo/FormItem";
import Select from "../../../components/antDesignCompo/Select";

const paymentStatus = [
    {
        key: 1,
        label: 'بانتظار الحوالة',
        value: 'witing'
    },
    {
        key: 2,
        label: 'خلنا نراجع الايصال',
        value: 'review'
    },
    {
        key: 3,
        label: 'مؤكد',
        value: 'accepted'
    },
    {
        key: 4,
        label: 'ردينا فلوسه',
        value: 'refund'
    },
    {
        key: 5,
        label: 'ملغي',
        value: 'rejected'
    },
]

const Index = () => {

    const [open, setOpen] = useState(false);
    const [purchaseOrderList, setPurchaseOrderList] = useState()
    const [paginationConfig, setPaginationConfig] = useState()
    const [selectedOrder, setSelectedOrder] = useState()
    const [orderForm] = Form.useForm()
    const [selectedOrderStatus, setSelectedOrderStatus] = useState()
    console.log(selectedOrderStatus);

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
                if (text.includes('+')) {
                    return (text.slice(1))
                }
                return text
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
        },
        {
            title: 'طريقة الدفع',
            dataIndex: 'paymentMethod',
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
            title: 'تاريخ اخر تحديث',
            dataIndex: 'actions',
            render: (data, _record) => {
                const handleEditOrders = () => {
                    setOpen(true)
                    orderForm.setFieldValue('status', _record.status)
                    setSelectedOrder(_record)
                }
                return (
                    <div onClick={handleEditOrders}>
                        <AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#000000'} />
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
            console.log(res);
            setPaginationConfig({
                pageSize: 10,
                total: res.data.totalItems,
                pageSizeOptions: [],
                position: ['bottomCenter']
            })
            setPurchaseOrderList(res.data.data)
        }).catch((err) => {
            console.log(err);
        })
    }
    const handleTableChange = (pagination, filter, sorter) => {
        getPurchaseOrderList(pagination.current)
    }
    const onClose = () => {
        setOpen(false);
    };
    const handleSaveOrder = async () => {
        let body = {
            orderUpdate: true,
            id: selectedOrder.id,
            status: selectedOrderStatus
        }
        console.log(body);
        await createOrderAPI(body).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }
    const customEmptyComponent = (
        <Empty buttonText={'الإنتقال إلى إدارة المكتبة'} emptyText={'لم تقم بإضافة اي مجلد'} containerhight={200} onClick={() => handleCreateFolder()} />
    )

    return (
        <div className="maxWidthDefault">
            <ConfigProvider direction="rtl">
                <Table
                    columns={tableColumns}
                    minheight={400}
                    dataSource={purchaseOrderList}
                    pagination={paginationConfig}
                    locale={{ emptyText: customEmptyComponent }}
                    onChange={handleTableChange}
                />
            </ConfigProvider>

            {open &&
                <Drawer
                    title="Basic Drawer"
                    closable={false}
                    placement={'left'}
                    open={open}
                    onClose={onClose}
                    extra={
                        <div className='flex'>
                            <div className={styles.saveCourseBtnBox} onClick={handleSaveOrder}>
                                <button className='primarySolidBtn flex items-center' htmltype='submit' >حفظ</button>
                            </div>
                            <button onClick={onClose} className={styles.closebutton}>
                                <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} />
                            </button>
                        </div>
                    }
                >
                    <Form form={orderForm}>
                        <FormItem
                            name={'status'} >
                            <Select
                                onChange={setSelectedOrderStatus}
                                value={selectedOrder.status}
                                OptionData={paymentStatus}
                                placeholder="سعر الدورة لثلاثة اشخاص واكثر"
                            />
                        </FormItem>
                    </Form>
                </Drawer>}
        </div>
    )
}

export default Index

