import React, { useEffect, useState } from 'react'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import { DatePicker } from 'antd';
import styles from '../../../styles/InstructorPanelStyleSheets/ManageAdminOverView.module.scss'
import Link from 'next/link';
import ComponentForLineChart from '../../../components/CommonComponents/ComponentForLineChart/ComponentForLineChart';
import ComponentForPieChart from '../../../components/CommonComponents/ComponentForPieChart/ComponentForPieChart';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { getRouteAPI } from '../../../services/apisService';
import { getNewToken } from '../../../services/fireBaseAuthService';
import Empty from '../../../components/CommonComponents/Empty';
import dayjs from 'dayjs';
import Spinner from '../../../components/CommonComponents/spinner';

const Index = () => {
    const { RangePicker } = DatePicker;
    const [dashBoardData, setDashBoardData] = useState(null);
    const [genderPieChart, setGenderPieChart] = useState(null);
    const [orderPieChart, setOrderPieChart] = useState(null)
    const [orderDataForLineChart, setOrderDataForLineChart] = useState(null);
    const disabledDate = (current) => {
        return current > dayjs().endOf('day');
    };
    const [isLoading, setIsLoading] = useState(false)
    const [dates, setDates] = useState(null);
    const [selectedDate, setSelectedDate] = useState()
    const [dateRange, setDateRange] = useState({
        startDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    })

    // useEffect(() => {
    //     createOrderPieChartData();
    //     createGenderPieChartData();
    //     createOrderLineChartData();
    // }, [dateRange])

    useEffect(() => {
        if (dateRange !== null) {
            getDashBoardData();
        }
    }, [dateRange])

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
        } else {
            setDateRange(null);
            setSelectedDate(null);
        }
    };

    const getDashBoardData = async () => {
        setIsLoading(true);
        try {
            const newData = {
                startDate: dateRange?.startDate,
                endDate: dateRange?.endDate,
                routeName: 'dashboard',
            }
            const response = await getRouteAPI(newData);
            setIsLoading(false);
            setDashBoardData(response.data);
            createOrderPieChartData(response.data);
            createGenderPieChartData(response.data);
            createOrderLineChartData(response.data);
            return response.data;
        }
        catch (error) {
            if (error.response.status === 401) {
                await getNewToken().then(() => {
                    getRouteAPI(newData).then((response) => {
                        setDashBoardData(response.data);
                        createOrderPieChartData(response.data);
                        createGenderPieChartData(response.data);
                        createOrderLineChartData(response.data);
                    }).catch((error) => {
                        console.error('Error getting data:', error);
                    });
                });
            }
            console.error('Error getting data:', error);
            setIsLoading(false);
            throw error;
        }

    }
    const adminDashBoardData = [
        {
            id: 1,
            titleHead: Math.floor(dashBoardData?.orderStats.find(order => order.status === 'accepted')?.totalAcceptedPrice) || ' ر.س EarningMoney',
            titleBody: 'إجمالي المبيعات',
            viewMoreInfo: 'عرض التفاصيل',
            nextPageLink: '/instructorPanel/manageAdminDashBoard/completedOrders',
            iconName: 'dollarIcon',
        },
        {
            id: 2,
            titleHead: dashBoardData?.orderStats.find(order => order.status === 'accepted')?.count || '0',
            titleBody: 'طلب مكتمل ',
            iconName: 'managePurchaseOrder',
        },
        {
            id: 3,
            titleHead: dashBoardData?.orderStats.find(order => order.status === 'refund')?.count || '0',
            titleBody: 'طلب مسترجع',
            viewMoreInfo: 'عرض التفاصيل',
            nextPageLink: '/instructorPanel/manageAdminDashBoard/refundedOrders',
            iconName: 'failedEmojiIcon',
        },
        {
            id: 4,
            titleHead: dashBoardData?.orderStats.find(order => order.status === 'rejected')?.count || '0',
            titleBody: 'طلب مرفوض',
            viewMoreInfo: 'عرض التفاصيل',
            nextPageLink: '/instructorPanel/manageAdminDashBoard/rejectedOrders',
            iconName: 'failedEmojiIcon',
        },
        {
            id: 5,
            titleHead: dashBoardData?.courseStats || '0',
            titleBody: 'دورة مضافة',
            viewMoreInfo: 'عرض التفاصيل',
            nextPageLink: '/instructorPanel/manageAdminDashBoard/allCoursesForDashBoard',
            iconName: 'bookIcon',
        },
        // {
        //     id: 6,
        //     titleHead: dashBoardData?.mostCourseViewed || 'MostCourseViewedName',
        //     titleBody: 'أكثر دورة زيارة',
        //     iconName: 'newVisibleIcon',
        // },
        // {
        //     id: 7,
        //     titleHead: dashBoardData?.mostPageViewed || 'MostPageViewdName',
        //     titleBody: 'أكثر صفحة زيارة',
        //     viewMoreInfo: 'عرض التفاصيل',
        //     nextPageLink: '/instructorPanel/manageAdminDashBoard/mostViewdPageList',
        //     iconName: 'newVisibleIcon',
        // },
    ]
    const createOrderPieChartData = (data) => {
        const orderStatusArray = [];
        const filteredOrderStatusArray = data?.orderStats.filter(status => status.status !== 'failed'); //&& status.status !== 'init'
        filteredOrderStatusArray?.forEach(order => {
            if (order?.status === 'accepted') {
                orderStatusArray.push({ label: 'طلب مؤكد', value: "accepted", color: "#00A725" }); //green
            } else if (order?.status === 'init') {
                orderStatusArray.push({ label: 'طلب جديد', value: "new", color: "#F4C20F" }); //yellow
            } else if (order?.status === 'waiting') {
                orderStatusArray.push({ label: 'بانتظار الحوالة', value: "waiting", color: "#AD00FF" }); //purple
            } else if (order?.status === 'refund') {
                orderStatusArray.push({ label: 'طلب مسترجع', value: "refunded", color: "#000000" }); //black
            } else if (order?.status === 'review') {
                orderStatusArray.push({ label: 'طلب ينتظر مراجعتنا', value: "review", color: "#0039A7" }); //blue
            } else if (order?.status === 'rejected') {
                orderStatusArray.push({ label: 'طلب مرفوض', value: "rejected", color: "#FF0000" }); //red
            }
        });
        const result = filteredOrderStatusArray?.map(item => item.count);
        const label = orderStatusArray.map(item => item.label);
        const statusColorForPieChart = orderStatusArray.map(item => item.color);
        const orderDataForPieChart = {
            chartId: 'statusPieChart',
            context: '2d',
            labels: label,
            datasets: {
                data: result,
                fill: false,
                backgroundColor: statusColorForPieChart,
                hoverOffset: 4,
                tension: 0.10,
                position: 'bottom',
                display: false,
                cutout: '70%',
                height: 250,
                width: 250,
            },
        }
        setOrderPieChart(orderDataForPieChart);
    }
    const createGenderPieChartData = (data) => {
        const result = data?.userStats?.reduce((accumulator, current) => {
            if (current.gender === "male") {
                accumulator[0] += current.count;
            } else if (current.gender === "female") {
                accumulator[1] += current.count;
            }
            return accumulator;
        }, [0, 0]);
        const pieChartForGenders = {
            chartId: 'genderPieChart',
            context: '2d',
            labels: ['شباب', 'بنات'],
            datasets: {
                label: 'My First Dataset',
                data: result,
                fill: false,
                backgroundColor: [
                    '#0C5D96',
                    '#E10768',
                    '#F4C20F'
                ],
                hoverOffset: 4,
                tension: 0.10,
                position: 'bottom',
                display: false,
                cutout: '70%',
                height: 250,
                width: 250,
            },
        }
        setGenderPieChart(pieChartForGenders);
    }
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

    const functionForCountData = (value) => {
        let totalCount = 0;
        if (Array.isArray(value === 'orders' ? dashBoardData?.orderStats : dashBoardData?.userStats)) {
            for (const order of value === 'orders' ? dashBoardData?.orderStats : dashBoardData?.userStats) {
                totalCount += order.count;
            }
        }
        return totalCount;
    }
    const payMentStatuslabelColors = orderPieChart?.datasets?.backgroundColor
    return (
        <div className='maxWidthDefault px-4'>
            <div className='py-2'>
                <BackToPath
                    backPathArray={
                        [
                            { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel' },
                            { lable: 'إحصائيات الموقع', link: null },
                        ]
                    }
                />
            </div>
            <h1 className={`head2 pt-6 pr-2`}>إحصائية الموقع</h1>
            <div>
                <div className='my-6 flex flex-row-reverse' >
                    <RangePicker
                        height={40}
                        // defaultValue={[dayjs().subtract(7, 'day'), dayjs()]}
                        defaultValue={[dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')]}
                        onCalendarChange={(val) => {
                            setDates(val);
                        }}
                        onChange={(val) => {
                            handleDateChange(val);
                        }}
                        onOpenChange={onOpenChange}
                        disabledDate={disabledDate}
                        changeOnBlur
                        size="large"
                        placeholder={['تاريخ البداية', 'تاريخ النهاية']}
                    />
                </div>
                {dateRange === null ?
                    <div className='flex justify-center items-center h-80'>
                        <Empty emptyText={'لا توجد بيانات'} containerhight={500} />
                    </div>
                    :
                    isLoading ?
                        <div className='flex justify-center items-center h-80'>
                            <Spinner borderwidth={6} width={6} height={6} margin={0.5} />
                        </div>
                        :
                        <div className='flex justify-between'>
                            <div className='w-3/4'>
                                <div className={`${styles.graphWrapper} flex justify-center`}>
                                    {
                                        dateRange == null ?
                                            <Empty emptyText={'لا توجد بيانات'} containerhight={300} />
                                            :
                                            orderDataForLineChart && <ComponentForLineChart data={orderDataForLineChart} />
                                    }
                                </div>
                                <div className={styles.graphContainer}>
                                    <div className={`ml-5 ${styles.graphWrapper}`}>
                                        <div className='flex items-center'>
                                            <AllIconsComponenet height={30} width={32} iconName={'managePurchaseOrder'} color={'#F06A25'} />
                                            <p style={{ color: '#F06A25', fontWeight: '900', fontSize: '24px' }} className='mt-1'>{dashBoardData?.orderStats?.length > 0 ? functionForCountData('orders') : '0'}</p>
                                        </div>
                                        <p style={{ fontWeight: '500', fontSize: '20px' }} className='m-2 mr-6'>إجمالي الطلبات</p>
                                        {dashBoardData?.orderStats.length > 0 ?
                                            <>
                                                <div className='mt-10' >
                                                    {orderPieChart && <ComponentForPieChart data={orderPieChart} />}
                                                </div>
                                                <div className={styles.labelsWrapper}>
                                                    {orderPieChart?.datasets?.data?.map((data, index) => (
                                                        <div key={index} className={styles.pieChartLabels} >
                                                            <AllIconsComponenet
                                                                iconName={'rectangleBox'}
                                                                height={24}
                                                                width={24}
                                                                color={payMentStatuslabelColors[index]}
                                                            />
                                                            <p style={{ fontWeight: '500', fontSize: '20px' }} className='mx-2'>{data}</p>
                                                            <p style={{ fontWeight: '500', fontSize: '20px' }}>{orderPieChart.labels[index]}</p> &nbsp;
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                            :
                                            <Empty emptyText={'لا توجد بيانات'} containerhight={300} />
                                        }
                                    </div>
                                    <div className={styles.graphWrapper}>
                                        <div className='flex items-center'>
                                            <AllIconsComponenet height={20} width={24} iconName={'personDoubleColoredIcon'} color={'#F06A25'} />
                                            <p style={{ color: '#F06A25', fontWeight: '900', fontSize: '24px' }} className='mt-1'>{dashBoardData?.userStats?.length > 0 ? functionForCountData('users') : '0'}</p>
                                        </div>
                                        <p style={{ fontWeight: '500', fontSize: '20px' }} className='m-2 mr-6'>إجمالي المستخدمين</p>
                                        {dashBoardData?.userStats?.length > 0 ?
                                            <div className={styles.graphContainerWrapper}>
                                                <div className='mt-10'>
                                                    {genderPieChart && <ComponentForPieChart data={genderPieChart} />}
                                                </div>
                                                <div style={{ position: 'absolute' }}>
                                                    <AllIconsComponenet iconName='newMaleFemaleIcon' height={47} width={47} color={'#000000'} />
                                                </div>
                                                <div className='mt-5'>
                                                    {genderPieChart?.datasets?.data?.map((data, index) => (
                                                        <div key={index} className={styles.pieChartLabels}>
                                                            <AllIconsComponenet
                                                                iconName={genderPieChart.labels[index] === 'بنات' ? 'newFemaleIcon' : genderPieChart.labels[index] === 'شباب' ? 'newMaleIcon' : 'newMaleFemaleIcon'}
                                                                height={24}
                                                                width={24}
                                                                color={genderPieChart.labels[index] === 'بنات' ? '#E10768' : genderPieChart.labels[index] === 'شباب' ? '#0C5D96' : '#F4C20F'}
                                                            />
                                                            <p style={{ fontWeight: '500', fontSize: '20px' }} className='ml-2'>{data}</p>
                                                            <p style={{ fontWeight: '500', fontSize: '20px' }}>{genderPieChart.labels[index]}</p> &nbsp;
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            :
                                            <Empty emptyText={'لا توجد بيانات'} containerhight={300} />
                                        }
                                        <div className={styles.linkWrapper}>
                                            <Link href={'/instructorPanel/manageAdminDashBoard/enrolledCourseUserList'} className='no-underline' style={{ color: '#0075FF' }}>عرض التفاصيل</Link>
                                        </div>
                                    </div>
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
                                        <div style={{ textAlign: 'left' }}>
                                            <Link href={`${data.nextPageLink}`} className='no-underline' style={{ color: '#0075FF' }}>{data.viewMoreInfo}</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                }
            </div>
        </div >
    )
}

export default Index
