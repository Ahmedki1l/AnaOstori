import React, { useEffect, useState } from 'react'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import { ConfigProvider, Drawer, Form, Table, Tag } from 'antd'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { fullDate } from '../../../constants/DateConverter'
import styled from 'styled-components'
import ManageCouponCourseDrawer from '../../../components/ManageCouponCourse/ManageCouponCourseDrawer'
import { postRouteAPI } from '../../../services/apisService'
import { getNewToken } from '../../../services/fireBaseAuthService'
import styles from '../../../styles/InstructorPanelStyleSheets/ManageCouponCourse.module.scss'
import Empty from '../../../components/CommonComponents/Empty'
import { useSelector } from 'react-redux'
import * as paymentConst from '../../../constants/PaymentConst'

const DrawerTiitle = styled.p`
    font-size:20px
`

const Index = () => {

    const [drawerForCouponCourse, setDrawerForCouponCourse] = useState(false)
    const [listOfCoupon, setListOfCoupon] = useState()
    const [selectedCoupon, setSelectedCoupon] = useState()
    const storeData = useSelector((state) => state?.globalStore);
    const category = storeData.catagories
    // const couponStatus = [
    //     {
    //         key: 1,
    //         value: 'active',
    //         label: 'مفعل',
    //         color: 'green'
    //     },
    //     {
    //         key: 2,
    //         value: 'inActive',
    //         label: 'منتهي',
    //         color: 'red'
    //     }
    // ]

    const tableColumns = [
        {
            title: 'عنوان الكوبون',
            dataIndex: 'name',
        },
        {
            title: 'الكود',
            dataIndex: 'couponCode',
        },
        {
            title: 'نسبة الخصم',
            dataIndex: 'percentage',
        },
        {
            title: 'نوع الخصم',
            dataIndex: 'type',
        },
        {
            title: 'تاريخ الانتهاء',
            dataIndex: 'expires',
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            render: (text, _date) => {
                return (fullDate(_date.createdAt))
            }
        },
        {
            title: 'حالة الكوبون',
            dataIndex: 'status',
            render: (text) => {
                return (
                    <Tag color={text == true ? 'green' : 'red'} style={{ fontFamily: 'Tajawal-Regular' }}>
                        {text == true ? 'مفعل' : 'منتهي'}
                    </Tag>
                )
            }
        },
        {
            title: 'مرات الاستخدام',
            dataIndex: 'NoOfUsage',
            render: (text) => {
                return (
                    text == null ? 0 : text
                )
            }
        },
        {
            title: 'مطبق مع اي دورة',
            dataIndex: 'appliedCourse',
            render: (text, _record) => {
                return (
                    _record.couponCourses.map((item, index) => {
                        return (
                            <p key={item.course.id}>{item.course.name}</p>
                        )
                    })
                )
            }
        },
        {
            title: 'تاريخ الانشاء',
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
            dataIndex: 'action',
            render: (index, _record) => {
                const handleEditCoupon = () => {
                    setSelectedCoupon(_record);
                    setDrawerForCouponCourse(true)
                }
                return (
                    <div className='cursor-pointer' onClick={handleEditCoupon}>
                        <AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#000000'} />
                    </div>
                )
            }
        },
    ]

    useEffect(() => {
        getCouponList(1)
    }, [])

    const getCouponList = async () => {
        let body = {
            routeName: "listCoupon",
        }
        await postRouteAPI(body).then((res) => {
            setListOfCoupon(res.data);
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postRouteAPI(body).then((res) => {
                        setListOfCoupon(res.data);
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }
    const onClose = () => {
        setDrawerForCouponCourse(false);
    };

    const handleAddCouponCourse = () => {
        setDrawerForCouponCourse(true)
    }
    const customEmptyComponent = (
        <Empty emptyText={'ما أضفت كوبون'} containerhight={400} buttonText={'إضافة كوبون'} onClick={() => handleAddCouponCourse()} />
    )
    return (
        <div>
            <div className='maxWidthDefault px-4'>
                <div className={'flex justify-between items-center'}>
                    <div style={{ height: 70 }}>
                        <BackToPath
                            backpathForPage={true}
                            backPathArray={
                                [
                                    { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                                    { lable: 'إضافة وتعديل كوبونات الخصم', link: null },
                                ]
                            }
                        />
                    </div>
                    <div className={`${styles.createCourseBtnBox}`}>
                        <button className='primarySolidBtn' onClick={() => handleAddCouponCourse()}>إضافة مجال</button>
                    </div>
                </div>
                <ConfigProvider direction="rtl">
                    <Table
                        columns={tableColumns}
                        minheight={400}
                        dataSource={listOfCoupon}
                        locale={{ emptyText: customEmptyComponent }}
                    />
                    {drawerForCouponCourse &&
                        <Drawer
                            closable={false}
                            open={drawerForCouponCourse}
                            onClose={onClose}
                            width={480}
                            placement={'right'}
                            title={
                                <>
                                    <DrawerTiitle className="foneBold">DisplayCouponTitle</DrawerTiitle>
                                </>
                            }
                        >
                            <ManageCouponCourseDrawer selectedCoupon={selectedCoupon} category={category} />
                        </Drawer>}
                </ConfigProvider>
            </div>
        </div>
    )
}

export default Index