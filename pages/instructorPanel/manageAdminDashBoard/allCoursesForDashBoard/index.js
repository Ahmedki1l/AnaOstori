import React, { useEffect, useState } from 'react'
import BackToPath from '../../../../components/CommonComponents/BackToPath';
import styles from '../../../../styles/InstructorPanelStyleSheets/ManageAdminOverView.module.scss'
import { DatePicker, Tag } from 'antd';
import CustomOrderListComponent from '../../../../components/CommonComponents/CustomOrderListComponent/CustomOrderListComponent';
import ComponentForBarChart from '../../../../components/CommonComponents/ComponentForBarChart/ComponentForBarChart';
import { getNewToken } from '../../../../services/fireBaseAuthService';
import { getRouteAPI } from '../../../../services/apisService';
import { mediaUrl } from '../../../../constants/DataManupulation';
import Image from 'next/legacy/image';
import { fullDate } from '../../../../constants/DateConverter';
import dayjs from 'dayjs';
import Spinner from '../../../../components/CommonComponents/spinner';
import Empty from '../../../../components/CommonComponents/Empty';

const Index = () => {

    const { RangePicker } = DatePicker;
    const [dates, setDates] = useState(null);
    const [allCourseList, setAllCourseList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [courseDataForBarChart, setCourseDataForBarChart] = useState()
    const [paginationConfig, setPaginationConfig] = useState({
        pageSizeOptions: [],
        position: ['bottomCenter'],
        pageSize: 10,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [loaderForGraph, setLoaderForGraph] = useState(false)
    const [dateRange, setDateRange] = useState({
        startDate: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD')
    })
    const disabledDate = (current) => {
        return current && current > dayjs().endOf('day');
    };
    useEffect(() => {
        if (dateRange !== null) {
            getDashboardCourse()
        } else {
            setAllCourseList([])
        }
    }, [currentPage, dateRange])

    const onOpenChange = (open) => {
        if (open) {
            setDates([null, null]);
        } else {
            setDates(null);
        }
    }
    const handleDateChange = (val) => {

        if (val !== null && val.length === 2) {
            const startDate = dayjs(val[0]).format('YYYY-MM-DD');
            const endDate = dayjs(val[1]).format('YYYY-MM-DD');
            setDateRange({
                startDate: startDate,
                endDate: endDate
            });
        } else if (val === null) {
            setDateRange(null)
            setCourseDataForBarChart()
        }
    };

    const getDashboardCourse = async () => {
        setIsLoading(true)
        let body = {
            routeName: "dashboardCourse",
        }
        if (dateRange !== null) {
            body.startDate = dateRange.startDate
            body.endDate = dateRange.endDate
        }
        await getRouteAPI(body).then((res) => {
            setIsLoading(false)
            setPaginationConfig((prevConfig) => ({
                ...prevConfig,
                total: res.data.totalItems,
                current: res.data.currentPage,
            }));
            setAllCourseList(res?.data?.courseData)
            createBarChartForCourse(res?.data?.courseData)
        }).catch(async (error) => {
            console.log(error);
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getRouteAPI(body).then(res => {
                        setPaginationConfig((prevConfig) => ({
                            ...prevConfig,
                            total: res.data.totalItems,
                            current: res.data.currentPage,
                        }));
                        setAllCourseList(res?.data?.courseData)
                        createBarChartForCourse(res?.data?.courseData)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                    setIsLoading(false)
                });
            }
        })
    }

    const createBarChartForCourse = (data) => {
        const labels = [];
        const totalEarnings = [];
        const totalEnrollment = [];
        if (data && data.length > 0) {
            data.forEach(order => {
                labels.push(order.name);
                totalEarnings.push(order.earning || 0);
                totalEnrollment.push(order.enrollmentCount || 0);
            });
        }
        const dataForCourseBarChart = {
            chartId: 'barChartForCourse',
            labels: labels,
            datasets: [
                {
                    label: 'إجمالي المبيعات',
                    data: totalEarnings,
                    backgroundColor: '#FED0EEB2',
                    borderColor: '#FED0EEB2',
                    borderWidth: 1
                },
                {
                    label: 'عدد الاشتراكات',
                    data: totalEnrollment,
                    backgroundColor: '#D0E8FFB2',
                    borderColor: '#D0E8FFB2',
                    borderWidth: 1
                }
            ]
        }
        setCourseDataForBarChart(dataForCourseBarChart)
    }

    const data = {
        tableColumns: [
            {
                title: 'عنوان الدورة',
                dataIndex: 'name',
                render: (text, _record) => {
                    return (
                        <div className='flex items-center'>
                            <div className={styles.courseInfoImage}>
                                <Image src={_record.pictureKey ? mediaUrl(_record.pictureBucket, _record.pictureKey) : '/images/anaOstori.png'} alt="Course Cover Image" layout="fill" objectFit="cover" priority />
                            </div>
                            <p className='pr-2'>{_record.name}</p>
                        </div>
                    )
                }
            },
            {
                title: 'حالة النشر',
                dataIndex: 'published',
                render: (text, _record) => {
                    return (
                        <Tag color={_record.published ? 'green' : 'red'}>{_record.published ? 'منشورة' : 'غير منشورة'}</Tag>
                    )
                }
            },
            {
                title: 'إجمالي المبيعات',
                dataIndex: 'earning',
                render: (text, _record) => {
                    return (
                        <div>
                            <p>{(Number(_record?.earning)).toFixed(2)} ر.س</p>
                        </div>
                    )
                }
            },
            {
                title: 'إجمالي المشتركين',
                dataIndex: 'orderCount',
            },
            {
                title: 'تاريخ الإنشاء',
                dataIndex: 'createdAt',
                sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
                render: (text, _date) => {
                    return (fullDate(_date.createdAt))
                }
            },
            {
                title: 'اخر تعديل',
                dataIndex: 'updatedAt',
                sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
                render: (text, _date) => {
                    return (fullDate(_date.updatedAt))
                }
            },
        ],
        dataSource: allCourseList.map((item, index) => ({ ...item, key: index })),
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
                            { lable: 'دورات الموقع', link: null },
                        ]
                    }
                />
            </div>
            <h1 className={`head2 pt-6 pr-2`}>الدورات</h1>
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
                <>
                    <div style={{ width: '100%' }}>
                        <div className={`${styles.graphWrapper}`}>
                            {(courseDataForBarChart && !isLoading) && <ComponentForBarChart data={courseDataForBarChart} />}
                        </div>
                    </div>
                    {isLoading ?
                        <div className='flex justify-center items-center h-80'>
                            <Spinner borderwidth={6} width={6} height={6} margin={0.5} />
                        </div>
                        :
                        allCourseList && <CustomOrderListComponent data={data} />
                    }
                </>
            }
        </div>
    )
}

export default Index