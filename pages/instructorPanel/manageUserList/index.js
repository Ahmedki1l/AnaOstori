import React, { useEffect, useState } from 'react'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import { ConfigProvider, Drawer, Table } from 'antd'
import { fullDate } from '../../../constants/DateConverter'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import styled from 'styled-components'
import { postRouteAPI } from '../../../services/apisService'
import { getNewToken } from '../../../services/fireBaseAuthService'
import Empty from '../../../components/CommonComponents/Empty'
import Link from 'next/link'
import * as PaymentConst from '../../../constants/PaymentConst'
import ProfilePicture from '../../../components/CommonComponents/ProfilePicture'
import ManegeUserListDrawer from '../../../components/ManageUserList/ManegeUserListDrawer'

const DrawerTiitle = styled.p`
    font-size: ${props => (props.fontSize ? props.fontSize : '20')}px !important;
`

const Index = () => {

    const [drawerForUsers, setDrawerForUsers] = useState(false)
    const [userList, setUserList] = useState()
    const [paginationConfig, setPaginationConfig] = useState({
        pageSizeOptions: [],
        position: ['bottomCenter'],
        pageSize: 10,
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUser, setSelectedUser] = useState()

    const genders = PaymentConst.genders

    const tableColumns = [
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
                const iconName = text == 'female' ? 'female' : 'male'
                const iconColor = text == 'female' ? '#E10768' : '#0C5D96'
                const gender = genders.find((gender) => gender.value == text)
                return (
                    text == null ?
                        <p>-</p>
                        :
                        <div className='flex'>
                            <AllIconsComponenet iconName={iconName} height={18} width={18} color={iconColor} />
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
                                    <p key={index} className='p-2'>{data.course.name}</p>
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
            dataIndex: 'updatedAt',
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            render: (text, _date) => {
                return (fullDate(_date.createdAt))
            }
        },
        {
            title: 'تاريخ انشاء الحساب',
            dataIndex: 'createdAt',
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
                    <div className='cursor-pointer' onClick={handleEditUsers}>
                        <AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#000000'} />
                    </div>
                )
            }
        },
    ]

    useEffect(() => {
        getUserList(1)
    }, [])

    const getUserList = async (pageNo) => {
        let body = {
            routeName: "userList",
            page: pageNo,
            limit: 10,
            order: "createdAt DESC"
        }
        await postRouteAPI(body).then((res) => {
            setPaginationConfig({
                ...paginationConfig,
                total: res.data.totalItems,
            })
            setCurrentPage(res.data.currentPage)
            const userList = res.data.data.map((item) => {
                return {
                    ...item,
                    key: item.id
                }
            })
            setUserList(userList)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postRouteAPI(body).then((res) => {
                        setUserList(res.data.data)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }

    const onClose = () => {
        setDrawerForUsers(false);
    };
    const handleTableChange = (pagination) => {
        getUserList(pagination.current)
    }
    const customEmptyComponent = (
        <Empty emptyText={'لم تقم بإضافة اي مجلد'} containerhight={400} onClick={() => handleCreateFolder()} />
    )

    return (
        <div className="maxWidthDefault">
            <div style={{ height: 40 }}>
                <BackToPath
                    backpathForPage={true}
                    backPathArray={
                        [
                            { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                            { lable: 'بيانات المستخدمين', link: null },
                        ]
                    }
                />
            </div>
            <h1 className={`head2 py-8`}>بيانات المستخدمين</h1>
            <ConfigProvider direction="rtl">
                <Table
                    columns={tableColumns}
                    minheight={400}
                    dataSource={userList}
                    pagination={paginationConfig}
                    locale={{ emptyText: customEmptyComponent }}
                    onChange={handleTableChange}
                />

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
                        <ManegeUserListDrawer selectedUserDetails={selectedUser} />
                    </Drawer>
                }
            </ConfigProvider>
        </div >
    )
}

export default Index