import React, { useEffect, useState } from 'react'
import BackToPath from '../../../../components/CommonComponents/BackToPath';
import styles from '../../../../styles/InstructorPanelStyleSheets/ManageAdminOverView.module.scss'
import { ConfigProvider, DatePicker, Drawer } from 'antd';
import CustomOrderListComponent from '../../../../components/CommonComponents/CustomOrderListComponent/CustomOrderListComponent';
import ComponentForBarChart from '../../../../components/CommonComponents/ComponentForBarChart/ComponentForBarChart';
import { useQuery } from 'react-query';
import { postRouteAPI } from '../../../../services/apisService';
import ProfilePicture from '../../../../components/CommonComponents/ProfilePicture';
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet';
import Link from 'next/link';
import { fullDate } from '../../../../constants/DateConverter';
import ManegeUserListDrawer from '../../../../components/ManageUserList/ManegeUserListDrawer';
import styled from 'styled-components';
import Spinner from '../../../../components/CommonComponents/spinner';
import * as PaymentConst from '../../../../constants/PaymentConst';
import dayjs from 'dayjs';
import { getNewToken } from '../../../../services/fireBaseAuthService';
import { get } from 'jquery';

const DrawerTiitle = styled.p`
    font-size: ${props => (props.fontSize ? props.fontSize : '20')}px !important;
`

const Index = () => {

    const { RangePicker } = DatePicker;
    const { genders } = PaymentConst.genders
    const [dates, setDates] = useState(null);
    const [userList, setUserList] = useState([]);
    const [userListForGraph, setUserListForGraph] = useState()
    const [drawerForUsers, setDrawerForUsers] = useState(false);
    const [dataOfBarChart, setDataOfBarChart] = useState()
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [dateRange, setDateRange] = useState({
        startDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD')
    })
    const disabledDate = (current) => {
        return current > dayjs().endOf('day');
    };
    const [paginationConfig, setPaginationConfig] = useState({
        pageSizeOptions: [],
        position: ['bottomCenter'],
        pageSize: 10,
    })
    useEffect(() => {
        // getGraphDataOfUsers.refetch()
        getAdminUserList.refetch()
        if (userList.length > 0) {
            createGraphForUserDashboard()
        }
        setCurrentPage(1)
    }, [dateRange])

    const onOpenChange = (open) => {
        if (open) {
            setDates([null, null]);
        } else {
            setDates(null);
        }
    };
    const handleDateChange = (val) => {
        if (val && val.length === 2) {
            const startDate = dayjs(val[0]).format('YYYY-MM-DD');
            const endDate = dayjs(val[1]).format('YYYY-MM-DD');
            setDateRange({
                startDate: startDate,
                endDate: endDate
            });
        } else {
            setDateRange(null);
        }
    };

    const createGraphForUserDashboard = (data) => {
        const labels = [];
        const maleCount = [];
        const femaleCount = [];
        if (data && data.length > 0) {
            data.forEach((item) => {
                labels.push(item.date);
                maleCount.push(item.maleCount);
                femaleCount.push(item.femaleCount);
            });
        }
        const dataForEnrolledUserListChart = {
            chartId: 'barChartForCourse',
            labels: labels,
            datasets: [
                {
                    label: 'عدد البنات',
                    data: femaleCount,
                    backgroundColor: '#FED0EEB2',
                    borderColor: '#FED0EEB2',
                    borderWidth: 1
                },
                {
                    label: 'عدد الشباب',
                    data: maleCount,
                    backgroundColor: '#D0E8FFB2',
                    borderColor: '#D0E8FFB2',
                    borderWidth: 1,
                }
            ],
            options: {
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        beginAtZero: true
                    }
                }
            },
        }
        setDataOfBarChart(dataForEnrolledUserListChart)
    }

    const { getGraphDataOfUsers, isLoading, isError } = useQuery(
        ['getGraphDataOfUsers', dateRange?.startDate, dateRange?.endDate],
        async () => {
            try {
                const newData = {
                    routeName: "userList",
                    graphData: true
                }
                if (dateRange !== null) {
                    newData.startDate = dateRange?.startDate
                    newData.endDate = dateRange?.endDate
                }
                const response = await postRouteAPI(newData);
                setUserListForGraph(response?.data?.graphData)
                createGraphForUserDashboard(response?.data?.graphData)
            }
            catch (error) {
                if (error.response.status === 401) {
                    await getNewToken().then(async () => {
                        const response = await postRouteAPI(newData);
                        setUserListForGraph(response?.data?.graphData)
                        createGraphForUserDashboard(response?.data?.graphData)
                    });
                }
                console.error('Error getting data:', error);
                throw error;
            }
        }
    )

    const getAdminUserList = useQuery(
        ['getAdminUserList', currentPage, dateRange?.startDate, dateRange?.endDate],
        async () => {
            try {
                const newData = {
                    routeName: "userList",
                    page: currentPage,
                    limit: 10,
                    order: "createdAt DESC",
                }
                if (dateRange !== null) {
                    newData.startDate = dateRange.startDate
                    newData.endDate = dateRange.endDate
                }
                const response = await postRouteAPI(newData);
                setPaginationConfig((prevConfig) => ({
                    ...prevConfig,
                    total: response.data.totalItems,
                    current: response.data.currentPage,
                }));
                const userList = response.data.data.map((item) => {
                    return {
                        ...item,
                        key: item.id
                    }
                });
                setUserList(userList);
            }
            catch (error) {
                if (error.response.status === 401) {
                    await getNewToken().then(async () => {
                        const response = await postRouteAPI(newData);
                        setPaginationConfig((prevConfig) => ({
                            ...prevConfig,
                            total: response.data.totalItems,
                            current: response.data.currentPage,
                        }));
                        const userList = response.data.data.map((item) => {
                            return {
                                ...item,
                                key: item.id
                            }
                        });
                        setUserList(userList);
                    });
                }
                console.error('Error getting data:', error);
                throw error;
            }
        }
    )

    const data = {
        tableColumns: [
            {
                title: 'اسم الطالب',
                dataIndex: 'fullName',
                render: (text, _record) => {
                    return (
                        <div className='flex items-center'>
                            <ProfilePicture height={34} width={34} alt={'avatar image'} pictureKey={_record.avatarKey == null ? _record.avatar : ''} />
                            <p className='pr-2'>{_record.fullName ? _record.fullName : _record.firstName}</p>
                        </div>
                    )
                }
            },
            {
                title: 'الجنس',
                dataIndex: 'gender',
                align: 'center',
                render: (text, _record) => {
                    const iconName = text == 'female' ? 'newFemaleIcon' : 'newMaleIcon'
                    const iconColor = text == 'female' ? '#E10768' : '#0C5D96'
                    const gender = genders?.find((gender) => gender.value == text)
                    return (
                        text == null ?
                            <p>-</p>
                            :
                            <div className='flex'>
                                <AllIconsComponenet iconName={iconName} height={20} width={20} color={iconColor} />
                                <p>{gender?.label}</p>
                            </div>

                    )
                }
            },
            {
                title: 'الدورات المشترك فيها',
                dataIndex: 'enrolledCourse',
                align: 'center',
                render: (text, _record) => {
                    const uniqueCourses = _record?.enrollments?.reduce((acc, current) => {
                        const x = acc.find(_record => _record.courseId === current.courseId
                        );
                        if (!x) {
                            return acc.concat([current]);
                        } else {
                            return acc;
                        }
                    }, []);
                    return (
                        _record.enrollments.length == 0 ?
                            <p className='p-2'>-</p>
                            :
                            <>
                                {uniqueCourses.map((data, index) => {
                                    return (
                                        <p key={index} className='p-2'>{data?.course?.name}</p>
                                    )
                                })}
                            </>
                    )
                }
            },
            {
                title: 'الايميل',
                dataIndex: 'email',
                align: 'center',
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
                title: 'رقم الجوال',
                dataIndex: 'phone',
                align: 'center',
                render: (text) => {
                    if (text) {
                        const mobileNumber = text.includes('+') ? text.slice(1) : text
                        return (
                            <Link target={'_blank'} href={`https://api.whatsapp.com/send/?phone=${mobileNumber}&text&type=phone_number&app_absent=0`}>{mobileNumber}</Link>
                        )
                    } else {
                        return '-'
                    }
                }
            },
            {
                title: 'تاريخ اخر تحديث',
                dataIndex: 'createdAt',
                sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
                render: (text, _date) => {
                    return (fullDate(_date.createdAt))
                }
            },
            {
                title: 'تاريخ انشاء الحساب',
                dataIndex: 'updatedAt',
                sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
                render: (text, _date) => {
                    return (fullDate(_date.updatedAt))
                }
            },
            {
                title: 'الإجراءات',
                dataIndex: 'action',
                render: (data, _record) => {
                    const handleEditUsers = () => {
                        setDrawerForUsers(true)
                        setSelectedUser(_record)
                    }
                    return (
                        <div className='cursor-pointer' onClick={() => handleEditUsers()}>
                            <AllIconsComponenet iconName={'newEditIcon'} height={18} width={18} color={'#000000'} />
                        </div>
                    )
                }
            },
        ],
        dataSource: userList,
        paginationConfig: paginationConfig,
        handleTableChange: (pagination) => {
            if (pagination.current !== currentPage) {
                setCurrentPage(pagination.current)
            }
        }
    }
    const onClose = () => {
        setDrawerForUsers(false);
        setCurrentPage(currentPage)
        getAdminUserList.refetch()
    };
    const getUserList = () => {
        getAdminUserList.refetch()
    }
    return (
        <div className='maxWidthDefault px-4'>
            <div className='py-2'>
                <BackToPath
                    backPathArray={
                        [
                            { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel' },
                            { lable: 'إحصائيات الموقع', link: '/instructorPanel/manageAdminDashBoard' },
                            { lable: 'بيانات المستخدمين', link: null },
                        ]
                    }
                />
            </div>
            <h1 className={`head2 pt-6 pr-2`}>المستخدمين</h1>
            <div className='my-6 flex flex-row-reverse' >
                <RangePicker
                    disabledDate={disabledDate}
                    height={40}
                    defaultValue={[dayjs().subtract(7, 'day'), dayjs()]}
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
            {isLoading ?
                <div className='flex justify-center items-center h-80'>
                    <Spinner borderwidth={6} width={6} height={6} margin={0.5} />
                </div>
                : <div style={{ width: '100%' }}>
                    <div className={`${styles.graphWrapper}`}>
                        {dataOfBarChart && <ComponentForBarChart data={dataOfBarChart} />}
                    </div>
                </div>
            }
            {getAdminUserList.isFetching ?
                <div className='flex justify-center items-center h-80'>
                    <Spinner borderwidth={6} width={6} height={6} margin={0.5} />
                </div>
                :
                <CustomOrderListComponent data={data} />
            }
            <ConfigProvider direction="rtl">
                {drawerForUsers &&
                    <Drawer
                        closable={false}
                        open={drawerForUsers}
                        onClose={onClose}
                        width={473}
                        placement={'right'}
                        title={
                            <>
                                <DrawerTiitle className="fontBold">تحديث بيانات المستخدم</DrawerTiitle>
                            </>
                        }
                    >
                        <ManegeUserListDrawer
                            selectedUserDetails={selectedUser}
                            setDrawerForUsers={setDrawerForUsers}
                            currentPage={currentPage}
                            getUserList={getUserList}
                        />
                    </Drawer>
                }
            </ConfigProvider>
        </div>
    )
}

export default Index