import React, { useEffect, useState } from 'react'
import BackToPath from '../../../../../../components/CommonComponents/BackToPath'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import CustomOrderListComponent from '../../../../../../components/CommonComponents/CustomOrderListComponent/CustomOrderListComponent'
import Spinner from '../../../../../../components/CommonComponents/spinner'
import { postRouteAPI } from '../../../../../../services/apisService'
import { getNewToken } from '../../../../../../services/fireBaseAuthService'
import Link from 'next/link'

const Index = () => {
    const router = useRouter()
    const courseType = router.query.courseType
    const storeData = useSelector((state) => state?.globalStore);
    const courseName = storeData?.editCourseData?.name
    const [currentPage, setCurrentPage] = useState(1)
    const [paginationConfig, setPaginationConfig] = useState({
        pageSizeOptions: [],
        position: ['bottomCenter'],
        pageSize: 10,
    })
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const fullName = storeData?.viewProfileData?.fullName;

    useEffect(() => {
        getUserListData()
    }, [currentPage])

    const handleLinkClick = () => router.push(`/instructorPanel/manageCourse/${courseType}`)
    const handleSelectedItem = () => {
        router.push({
            pathname: `/instructorPanel/manageCourse/${courseType}/appointments`,
            query: {
                courseId: storeData?.editCourseData?.id,
                availabilityId: router.query.availabilityId,
                selectedTab: 4
            }
        });
    };
    const backPathItemsArray = [
        { lable: 'صفحة الأدمن الرئيسية', handleClick: () => router.push(`/instructorPanel`) },
        { lable: 'إدارة وإضافة الدورات', handleClick: () => router.push('/instructorPanel/manageCourse') },
        {
            lable: courseType == "physical" ? 'الدورات الحضورية' : courseType == "online" ? 'الدورات المباشرة' : 'الدورات المسجلة',
            handleClick: router.query.courseActions == 'appointments' ? handleLinkClick : null
        },
    ]
    if (router?.query?.courseActions == "appointments") {
        backPathItemsArray.push(
            { lable: courseName, handleClick: () => router.push(`/instructorPanel/manageCourse/${courseType}/editCourse?courseId=${storeData?.editCourseData?.id}`) },
            { lable: 'تفاصيل الموعد', handleClick: handleSelectedItem },
            { lable: 'بيانات الطالب', link: null }
        )
    }

    const getUserListData = async () => {
        setLoading(true)
        let data = {
            routeName: "userList",
            page: currentPage,
            limit: 10,
            order: "createdAt DESC",
        }
        await postRouteAPI(data).then((response) => {
            setLoading(false)
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
        }).catch(async (error) => {
            if (error.response.status === 401) {
                await getNewToken().then(async () => {
                    await postRouteAPI(newData).then((res) => {
                        setLoaderForGraph(false)
                        createGraphForUserDashboard(res?.data?.graphData)
                    })
                });
            }
            setLoading(false)
            console.error('Error getting data:', error);
        })
    }

    const data = {
        tableColumns: [
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
                title: 'المرحلة الدراسية',
                dataIndex: 'school_level',
            },
            {
                title: 'درجة الطالب',
                dataIndex: 'exam_result',
            },
            {
                title: 'موعد الاختبار',
                dataIndex: 'exam_Date',
            },
            {
                title: 'المدينة',
                dataIndex: 'city',
            },

            {
                title: 'المدرسة',
                dataIndex: 'school_name',
            },
            {
                title: 'رقم ولي الأمر',
                dataIndex: 'parent_phone',
            },
            {
                title: 'من وين عرفنا',
                dataIndex: 'from_where_he_know_us',
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

    return (
        <div className='maxWidthDefault px-4'>
            <BackToPath
                backpathForTabel={true}
                backPathArray={backPathItemsArray}
            />
            <div>
                <p className='fontBold my-8' style={{ fontSize: '18px' }}>بيانات  {fullName}</p>
                {loading ?
                    <div className='flex justify-center items-center h-80'>
                        <Spinner borderwidth={6} width={6} height={6} margin={0.5} />
                    </div>
                    :
                    <CustomOrderListComponent data={data} />
                }
            </div>
        </div>
    )
}

export default Index