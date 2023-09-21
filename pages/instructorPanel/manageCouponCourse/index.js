import React, { useState } from 'react'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import { ConfigProvider, Drawer, Form, Table } from 'antd'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { fullDate } from '../../../constants/DateConverter'
import styled from 'styled-components'
import ManageCouponCourseDrawer from '../../../components/ManageCouponCourse/ManageCouponCourseDrawer'

const DrawerTiitle = styled.p`
    font-size:20px
`
const tableDataSourse = [
    {
        code: 49,
        uuid: "102b3b3d-e58d-48ad-b32e-caa503517d52",
        courseId: "02c7d210-af35-4bcb-9c48-97d5425f89e3",
        summary: "mkjjjj\nPramit tewari\n",
        notes: null,
        title: "mkjjjj",
        vat: 1.5,
        totalVat: 1.5,
        noOfUsed: 8.5,
        percantage: 100,
        appliedCourse: "Pramit tewari",
        buyerPhone: "+966590243374",
        buyerEmail: "pramit@uex.ai",
        paymentMethod: "none",
        coupanState: 'مفعل',
        couponType: "init",
        hyperpayCheckoutResponse: null,
        createdAt: "2023-09-14T13:01:33.000Z",
        updatedAt: "2023-09-14T13:01:33.000Z",
        orderItems: [
            {
                id: "28c6045e-eb19-44c9-954a-497ff5afa581",
                fullName: "Pramit tewari",
                phoneNumber: "+966590243374",
                email: "pramit@uex.ai",
                gender: "male",
                paid: false,
                courseId: "02c7d210-af35-4bcb-9c48-97d5425f89e3",
                availabilityId: null,
                orderId: 49,
                createdAt: "2023-09-14T13:01:33.000Z",
                updatedAt: "2023-09-14T13:01:33.000Z"
            }
        ]
    },
]

const Index = () => {

    const tableColumns = [
        {
            title: 'عنوان الكوبون',
            dataIndex: 'title',
        },
        {
            title: 'الكود',
            dataIndex: 'code',
        },
        {
            title: 'نسبة الخصم',
            dataIndex: 'percantage',
        },
        {
            title: 'نوع الخصم',
            dataIndex: 'couponType',
        },
        {
            title: 'تاريخ الانتهاء',
            dataIndex: 'expiredyDate',
            sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
            render: (text, _date) => {
                return (fullDate(_date.updatedAt))
            }
        },
        {
            title: 'حالة الكوبون',
            dataIndex: 'coupanState',
        },
        {
            title: 'مرات الاستخدام',
            dataIndex: 'noOfUsed',
        },
        {
            title: 'مطبق مع اي دورة',
            dataIndex: 'appliedCourse',
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
            render: () => {
                const handleEditOrders = () => {
                    setDrawerForCouponCourse(true)
                }
                return (
                    <div onClick={handleEditOrders}>
                        <AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#000000'} />
                    </div>
                )
            }
        },
    ]

    const [drawerForCouponCourse, setDrawerForCouponCourse] = useState(false)

    const onClose = () => {
        setDrawerForCouponCourse(false);
    };
    return (
        <div>
            <div className='maxWidthDefault px-4'>
                <div style={{ height: 40 }}>
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
                <ConfigProvider direction="rtl">
                    <Table
                        columns={tableColumns}
                        minheight={400}
                        dataSource={tableDataSourse}
                    />
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
                        <ManageCouponCourseDrawer />
                    </Drawer>
                </ConfigProvider>
            </div>
        </div>
    )
}

export default Index