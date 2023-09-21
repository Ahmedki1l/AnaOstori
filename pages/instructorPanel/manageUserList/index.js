import React, { useEffect, useState } from 'react'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import { ConfigProvider, Drawer, Table } from 'antd'
import { fullDate } from '../../../constants/DateConverter'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import styled from 'styled-components'
import { routeAPI } from '../../../services/apisService'
import { getNewToken } from '../../../services/fireBaseAuthService'
import Empty from '../../../components/CommonComponents/Empty'
import Link from 'next/link'
import * as PaymentConst from '../../../constants/PaymentConst'
import ManegeUserListDrawer from '../../../components/ManageUserList/MAnageUserListDrawer'
import { render } from 'react-dom'
import ProfilePicture from '../../../components/CommonComponents/ProfilePicture'
import { mediaUrl } from '../../../constants/DataManupulation'
const DrawerTiitle = styled.p`
    font-size:20px
`

const Index = () => {

    const [drawerForUsers, setDrawerForUsers] = useState(false)
    const [userList, setUserList] = useState()
    const [paginationConfig, setPaginationConfig] = useState({
        pageSizeOptions: [],
        position: ['bottomCenter'],
        pageSize: 5,
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUser, setSelectedUser] = useState()

    const genders = PaymentConst.genders

    const tableColumns = [
        {
            title: 'اسم الطالب',
            dataIndex: 'firstName',
            render: (text, _record) => {
                return (
                    <div className='flex items-center'>
                        <ProfilePicture height={34} width={34} alt={'avatar image'} pictureKey={_record.avatarKey == null ? _record.avatar : ''} />
                        <p className='pr-2'>{_record.fullName ? _record.fullName : `${_record.firstName} ${_record.lastName}`}</p>
                    </div>
                )

            }
        },
        {
            title: 'الجنس',
            dataIndex: 'gender',
            render: (text, _record) => {
                const iconName = text == 'female' ? 'female' : 'male'
                const iconColor = text == 'female' ? '#0C5D96' : '#E10768'
                const gender = genders.find((gender) => gender.value == text)
                return (
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
        },
        {
            title: 'الايميل',
            dataIndex: 'email',
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
                    <div onClick={handleEditUsers}>
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
            limit: 5,
            order: "createdAt DESC"
        }
        await routeAPI(body).then((res) => {
            setPaginationConfig({
                ...paginationConfig,
                total: res.data.totalItems,
            })
            setCurrentPage(res.data.currentPage)
            setUserList(res.data.data)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await routeAPI(data).then((res) => {
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

                {drawerForUsers && <Drawer
                    closable={false}
                    open={drawerForUsers}
                    onClose={onClose}
                    width={400}
                    placement={'right'}
                    title={
                        <>
                            <DrawerTiitle className="foneBold">تحديث بيانات المستخدم</DrawerTiitle>
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