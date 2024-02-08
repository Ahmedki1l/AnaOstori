import React, { useEffect } from 'react'
import BackToPath from '../../../../components/CommonComponents/BackToPath'
import { DatePicker } from 'antd';
import CustomOrderListComponent from '../../../../components/CommonComponents/CustomOrderListComponent/CustomOrderListComponent';
import { useQuery, useQueryClient } from 'react-query';
import { postRouteAPI } from '../../../../services/apisService';
import { GET_PURCHASE_ORDER_LIST } from '../../../../constants/adminPanelConst/QueryKeys';

const Index = () => {

    const { RangePicker } = DatePicker;
    const [dates, setDates] = React.useState(null);
    const [selectedDates, setSelectedDates] = React.useState(null);
    const [purchaseOrderList, setPurchaseOrderList] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [paginationConfig, setPaginationConfig] = React.useState({
        pageSizeOptions: [],
        position: ['bottomCenter'],
        pageSize: 10,
    })

    const handleDateChange = (val) => {
        setSelectedDates(val);
    }
    const onOpenChange = (open) => {
        if (open) {
            setDates([null, null]);
        } else {
            setDates(null);
        }
    }
    const queryClient = useQueryClient()
    useEffect(() => {
        queryClient.refetchQueries(GET_PURCHASE_ORDER_LIST)
    }, [currentPage])

    const getPurchaseOrderList = useQuery(
        [currentPage],
        async () => {
            let body = {
                routeName: "orderList",
                page: currentPage,
                limit: 10,
                order: "createdAt DESC"
            }
            await postRouteAPI(body).then((res) => {
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
            })
        })
    const data = {
        tableColumns: [
            {
                title: 'عنوان الصفحة',
                dataIndex: 'courseName',
            },
            {
                title: 'عدد الزيارات',
                dataIndex: 'basePrice',
                render: (text, record) => {
                    return (
                        <div>
                            {record.basePrice} &nbsp; مشاهدة
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
                queryClient.resetQueries(GET_PURCHASE_ORDER_LIST)
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
                            { lable: 'زيارات صفحات الموقع', link: null },
                        ]
                    }
                />
            </div>
            <h1 className={`head2 pt-6 pr-2`}>زيارات صفحات الموقع</h1>
            <div className='my-6 flex flex-row-reverse' >
                <RangePicker
                    height={40}
                    value={dates || selectedDates}
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
            <CustomOrderListComponent data={data} />
        </div>
    )
}

export default Index