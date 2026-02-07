import React, { useEffect, useState } from 'react'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import { Drawer, Table, Tag } from 'antd'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { fullDate } from '../../../constants/DateConverter'
import ManageCouponCourseDrawer from '../../../components/ManageCouponCourse/ManageCouponCourseDrawer'
import { postRouteAPI } from '../../../services/apisService'
import { getNewToken } from '../../../services/fireBaseAuthService'
import styles from '../../../styles/InstructorPanelStyleSheets/ManageCouponCourse.module.scss'
import Empty from '../../../components/CommonComponents/Empty'
import { useSelector } from 'react-redux'
import ModelForDeleteItems from '../../../components/ManageLibraryComponent/ModelForDeleteItems/ModelForDeleteItems'
import { couponTypes, manageCouponConst } from '../../../constants/adminPanelConst/couponConst/couponConst'
import { toast } from 'react-toastify'


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
            toast.success('تم حذف الكوبون بنجاح');
            getCouponList()
        }).catch((err) => {
            console.log(err);
            
            // Handle specific error cases
            if (err?.response?.status === 400) {
                const errorMessage = err?.response?.data?.message || 'بيانات غير صحيحة';
                toast.error(errorMessage);
            } else if (err?.response?.status === 404) {
                toast.error('الكوبون غير موجود');
            } else if (err?.response?.status === 422) {
                const errorMessage = err?.response?.data?.message || 'لا يمكن حذف الكوبون';
                toast.error(errorMessage);
            } else {
                toast.error('حدث خطأ أثناء حذف الكوبون');
            }
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
            render: (text, record) => {
                if (record.discountMode === 'fixedAmount' || record.fixedAmount) {
                    return (
                        <div>
                            <p className="fontBold" style={{ color: '#F26722' }}>{record.fixedAmount} ر.س</p>
                            <p className="text-xs text-gray-500">قيمة ثابتة</p>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <p className="fontBold" style={{ color: '#F26722' }}>{text}%</p>
                            <p className="text-xs text-gray-500">نسبة مئوية</p>
                        </div>
                    );
                }
            }
        },
        {
            title: 'نوع الخصم',
            dataIndex: 'type',
            render: (text) => {
                const couponType = couponTypes.find((item) => {
                    return item.value == text
                })
                return (
                    <p>{couponType?.label}</p>
                )
            }
        },
        {
            title: 'طريقة الخصم',
            dataIndex: 'discountMode',
            render: (text, record) => {
                if (record.discountMode === 'fixedAmount' || record.fixedAmount) {
                    return <span style={{ color: '#F26722' }}>قيمة ثابتة</span>;
                } else {
                    return <span style={{ color: '#00bd5d' }}>نسبة مئوية</span>;
                }
            }
        },
        {
            title: 'الشروط',
            dataIndex: 'conditions',
            render: (conditions) => {
                if (!conditions) {
                    return <span style={{ color: '#999' }}>بدون شروط</span>;
                }
                
                const conditionsList = [];
                if (conditions.singlePersonBooking) {
                    conditionsList.push('شخص واحد فقط');
                }
                
                return conditionsList.length > 0 ? (
                    <div>
                        {conditionsList.map((condition, index) => (
                            <Tag key={index} color="blue" style={{ fontFamily: 'Tajawal-Regular', marginBottom: '2px' }}>
                                {condition}
                            </Tag>
                        ))}
                    </div>
                ) : (
                    <span style={{ color: '#999' }}>بدون شروط</span>
                );
            }
        },
        {
            title: 'ينطبق على',
            dataIndex: 'applicableTo',
            render: (applicableTo) => {
                const typeConfig = {
                    'course': { label: 'دورات فقط', color: 'blue' },
                    'book': { label: 'كتب فقط', color: 'green' },
                    'all': { label: 'الكل', color: 'orange' }
                };
                const config = typeConfig[applicableTo] || { label: applicableTo || 'دورات فقط', color: 'blue' };
                return (
                    <Tag color={config.color} style={{ fontFamily: 'Tajawal-Regular' }}>
                        {config.label}
                    </Tag>
                );
            }
        },
        {
            title: 'تاريخ الانتهاء',
            dataIndex: 'expires',
            sorter: (a, b) => a.expires.localeCompare(b.expires),
            render: (text, _date) => {
                return (fullDate(_date.expires))
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
                        const newList = res.data.map((item) => {
                            return {
                                ...item,
                                key: item.id
                            }
                        })
                        setListOfCoupon(newList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
                    }).catch(retryError => {
                        console.error("Error after token refresh:", retryError);
                        toast.error('فشل في تحميل قائمة الكوبونات');
                    });
                }).catch(tokenError => {
                    console.error("Token refresh error:", tokenError);
                    toast.error('فشل في تحديث الجلسة');
                });
            } else {
                console.error("Error loading coupons:", error);
                toast.error('فشل في تحميل قائمة الكوبونات');
            }
        })
    }
    const onClose = () => {
        setDrawerForCouponCourse(false);
    };

    const handleAddCouponCourse = () => {
        setDrawerForCouponCourse(true)
        setSelectedCoupon()
    }
    const customEmptyComponent = (
        <Empty emptyText={'ما أضفت كوبون'} containerhight={400} buttonText={'إضافة كوبون'} onClick={() => handleAddCouponCourse()} />
    )

    const selectedCouponStatusLable = selectedCoupon?.status == true ? { label: 'مفعل', color: 'green' } : { label: 'منتهي', color: 'red' }
    return (
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
                <h1 className={`head2`}>كوبونات الخصم</h1>
                <div className={`${styles.createCourseBtnBox}`}>
                    <button className='primarySolidBtn' onClick={() => handleAddCouponCourse()}>إضافة كوبون</button>
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
                            {selectedCoupon && <Tag style={{ fontSize: 16, fontFamily: 'Tajawal-Regular', padding: 10 }} bordered={false} color={selectedCouponStatusLable?.color}>{selectedCouponStatusLable?.label}</Tag>}
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
    )
}

export default Index