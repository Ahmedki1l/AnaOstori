import React, { useEffect, useState } from 'react'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import { ConfigProvider, Drawer, Table, Tag } from 'antd'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { fullDate } from '../../../constants/DateConverter'
import styled from 'styled-components'
import ManageCouponCourseDrawer from '../../../components/ManageCouponCourse/ManageCouponCourseDrawer'
import { postRouteAPI } from '../../../services/apisService'
import { getNewToken } from '../../../services/fireBaseAuthService'
import styles from '../../../styles/InstructorPanelStyleSheets/ManageCouponCourse.module.scss'
import Empty from '../../../components/CommonComponents/Empty'
import { useSelector } from 'react-redux'
import ModelForDeleteItems from '../../../components/ManageLibraryComponent/ModelForDeleteItems/ModelForDeleteItems'
import { couponTypes, manageCouponConst } from '../../../constants/adminPanelConst/couponConst/couponConst'


const Index = () => {

    const [drawerForCouponCourse, setDrawerForCouponCourse] = useState(false)
    const [listOfCoupon, setListOfCoupon] = useState()
    const [selectedCoupon, setSelectedCoupon] = useState()
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)
    const [deleteCoupon, setDeleteCoupon] = useState()
    const storeData = useSelector((state) => state?.globalStore);
    const category = storeData.catagories

    const onCloseModal = () => {
        setIsmodelForDeleteItems(false)
    }
    const handledeleteCoupon = async () => {
        let data = {
            routeName: "updateCoupon",
            id: deleteCoupon.id,
            isDeleted: true,
        }
        await postRouteAPI(data).then((res) => {
            getCouponList()
        }).catch((err) => {
            console.log(err);
        })
    }
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
            render: (text) => {
                const couponType = couponTypes.find((item) => {
                    return item.value == text
                })
                return (
                    <p>{couponType.label}</p>
                )
            }
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
                const handleDeleteModalOpen = () => {
                    setDeleteCoupon(_record);
                    setIsmodelForDeleteItems(true)
                }
                return (
                    <div className={styles.couponActionWrapper}>
                        <div className='cursor-pointer' onClick={handleEditCoupon}>
                            <AllIconsComponenet iconName={'newEditIcon'} height={18} width={18} color={'#000000'} />
                        </div>
                        <div className='cursor-pointer' onClick={handleDeleteModalOpen}>
                            <AllIconsComponenet iconName={'newDeleteIcon'} height={18} width={18} color={'#000000'} />
                        </div>
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
            const newList = res.data.map((item) => {
                return {
                    ...item,
                    key: item.id
                }
            })
            setListOfCoupon(newList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
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

    const selectedCouponStatusLable = selectedCoupon?.status == true ? { label: 'مفعل', color: 'green' } : { label: 'منتهي', color: 'red' }
    return (
        <div>
            <div className='maxWidthDefault px-4'>
                <div style={{ height: 30 }}>
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
                <div className={styles.couponHeadeArea}>
                    <h1 className={`head2`}>إضافة وتعديل كوبونات الخصم</h1>
                    <div className={`${styles.createCourseBtnBox}`}>
                        <button className='primarySolidBtn' onClick={() => handleAddCouponCourse()}>إضافة مجال</button>
                    </div>
                </div>
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
                            <div className={styles.drawerHeadingArea}>
                                <p className={`fontBold ${styles.drawerTitle}`}>{selectedCoupon ? manageCouponConst.updateCouponHead : manageCouponConst.createCouponHead}</p>
                                {selectedCoupon && <Tag style={{ fontSize: 16, fontFamily: 'Tajawal-Regular', padding: 10 }} bordered={false} color={selectedCouponStatusLable.color}>{selectedCouponStatusLable?.label}</Tag>}
                            </div>
                        }

                    >
                        <ManageCouponCourseDrawer
                            selectedCoupon={selectedCoupon}
                            getCouponList={getCouponList}
                            setDrawerForCouponCourse={setDrawerForCouponCourse}
                            category={category}
                        />
                    </Drawer>
                }
                {ismodelForDeleteItems &&
                    <ModelForDeleteItems
                        ismodelForDeleteItems={ismodelForDeleteItems}
                        onCloseModal={onCloseModal}
                        deleteItemType={'coupon'}
                        onDelete={handledeleteCoupon}
                    />}
            </div>
        </div>
    )
}

export default Index