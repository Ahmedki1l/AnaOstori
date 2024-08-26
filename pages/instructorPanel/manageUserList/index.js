import React, { useEffect, useMemo, useState } from 'react'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import { ConfigProvider, Drawer, Modal, Table } from 'antd'
import { fullDate } from '../../../constants/DateConverter'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import styled from 'styled-components'
import { getAuthRouteAPI, postRouteAPI } from '../../../services/apisService'
import { getNewToken } from '../../../services/fireBaseAuthService'
import Empty from '../../../components/CommonComponents/Empty'
import Link from 'next/link'
import * as PaymentConst from '../../../constants/PaymentConst'
import ProfilePicture from '../../../components/CommonComponents/ProfilePicture'
import ManegeUserListDrawer from '../../../components/ManageUserList/ManegeUserListDrawer'
import SearchInput from '../../../components/antDesignCompo/SearchInput'
import { Form, FormItem } from '../../../components/antDesignCompo/FormItem'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import { buttonsTextConst } from '../../../constants/studentInformationConst'
import DatePicker from '../../../components/antDesignCompo/Datepicker'
import CustomButton from '../../../components/CommonComponents/CustomButton'
import styles from '../../../styles/InstructorPanelStyleSheets/ManageUserList.module.scss'
import dayjs from 'dayjs'
import { toastSuccessMessage } from '../../../constants/ar'
import { toast } from 'react-toastify'

const DrawerTiitle = styled.p`
    font-size: ${props => (props.fontSize ? props.fontSize : '20')}px !important;
`
const Index = () => {

    const [drawerForUsers, setDrawerForUsers] = useState(false)
    const [userList, setUserList] = useState()
    const [paginationConfig, setPaginationConfig] = useState({
        pageSizeOptions: [10, 20],
        position: ['bottomCenter'],
        pageSize: 10,
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUser, setSelectedUser] = useState()
    const [searchValue, setSearchValue] = useState()
    const regexEmail = useMemo(() => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, []);
    const regexPhone = useMemo(() => /^\d+$/, []);
    const genders = PaymentConst.genders
    const [isModalForUserListReqOpen, setIsModalForUserListReqOpen] = useState(false)
    const [appointmentForm] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getUserList(1)
    }, [])

    const getUniqueCourses = (enrollments) => {
        const uniqueCourses = enrollments?.reduce((acc, current) => {
            const x = acc.find(record => record.courseId === current.courseId);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);
        return uniqueCourses.map(course => course.course.name);
    };

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
                return (
                    <div className='p-2'>
                        {getUniqueCourses(_record?.enrollments)?.length > 0
                            ? getUniqueCourses(_record?.enrollments)?.map((courseName, index) => (
                                <p key={index}>{courseName}</p>
                            ))
                            :
                            '-'
                        }
                    </div>
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
            title: 'المرحلة الدراسية',
            dataIndex: 'educationLevel',
            render: (text, _date) => {
                return (text)
            }
        },
        {
            title: 'المدينة',
            dataIndex: 'city',
            render: (text, _date) => {
                return (text)
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
                    <div className='cursor-pointer' onClick={() => handleEditUsers()}>
                        <AllIconsComponenet iconName={'newEditIcon'} height={18} width={18} color={'#000000'} />
                    </div>
                )
            }
        },
    ]
    const getUserList = async (currentPage, searchValue, pageSize = 10) => {
        let body = {
            routeName: "userList",
            page: currentPage,
            limit: pageSize,
            order: "createdAt DESC"
        }
        if (searchValue) {
            body = {
                ...body,
                searchValue: searchValue,
                searchType: regexEmail.test(searchValue) ? 'email' : regexPhone.test(searchValue) ? 'phone' : 'fullName'
            }
        }
        await postRouteAPI(body).then((res) => {
            setPaginationConfig((prevConfig) => ({
                ...prevConfig,
                pageSize: pageSize,
                total: res.data.totalItems,
                current: res.data.currentPage,
            }));
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
        getUserList(currentPage, searchValue)
    };
    const handleTableChange = (pagination) => {
        getUserList(pagination.current, searchValue, pagination.pageSize)
        setCurrentPage(pagination.current)
    }
    const customEmptyComponent = (
        <Empty emptyText={'لم تقم بإضافة اي مجلد'} containerhight={400} onClick={() => handleCreateFolder()} />
    )
    const handleSearchByEmail = async (e) => {
        getUserList(currentPage, e)
    }
    const handleSearchValueChange = (e) => {
        setSearchValue(e)
        if (e == '') {
            getUserList(1, e)
        }
    };
    const downloadExcel = () => {
        const downloadDataForExcel = userList?.map((student) => {
            return {
                "اسم الطالب": student?.fullName ? student?.fullName : student?.firstName ? student?.firstName : "-",
                "الايميل": student?.email ? student?.email : "-",
                "رقم الجوال": student?.phone ? student?.phone : "-",
                "الجنس": student?.gender ? student?.gender : "-",
                "المدينة": student?.city ? student?.city : "-",
                "رقم ولي أمر الطالب": student?.parentsContact ? student?.parentsContact : "-",
                "المرحلة الدراسية": student?.educationLevel ? student?.educationLevel : "-",
                "تاريخ الاشتراك": fullDate(student?.createdAt) ? fullDate(student?.createdAt) : "-",
                "الدورات المشترك فيها": getUniqueCourses(student?.enrollments).join(' , ') ? getUniqueCourses(student?.enrollments).join(' , ') : '-',
            }
        });
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(downloadDataForExcel);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Quiz Items');
        const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `student-list.xlsx`);
    }
    const requestExcel = () => {
        setIsModalForUserListReqOpen(true)
    }
    const onFinish = async (values) => {
        setIsLoading(true)
        let body = {
            routeName: 'studentExcelExport',
            startDate: dayjs(values?.startDate?.$d).startOf('day').format('YYYY-MM-DD'),
            endDate: dayjs(values?.endDate?.$d).endOf('day').format('YYYY-MM-DD')
        }
        await getAuthRouteAPI(body).then((res) => {
            setIsLoading(false)
            toast.success(toastSuccessMessage.reportSendSuccessMsg, { rtl: true, })
            setIsModalForUserListReqOpen(false)
            appointmentForm.resetFields();
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getAuthRouteAPI(body).then((res) => {
                        setIsLoading(false)
                        toast.success(toastSuccessMessage.reportSendSuccessMsg, { rtl: true, })
                        setIsModalForUserListReqOpen(false)
                        appointmentForm.resetFields();
                    })
                })
            }
            console.error("Error:", error);
        })
    }

    const handleClose = () => {
        setIsModalForUserListReqOpen(false)
        appointmentForm.resetFields();
    }

    return (
        <div className="maxWidthDefault px-4">
            <div style={{ height: 40 }}>
                <BackToPath
                    backpathForPage={true}
                    backPathArray={
                        [
                            { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                            { lable: 'إدارة بيانات المستخدمين', link: null },
                        ]
                    }
                />
            </div>
            <h1 className={`head2 pb-4`}>بيانات المستخدمين</h1>
            <div className='flex justify-between'>
                <div style={{ width: '362px' }}>
                    <FormItem>
                        <SearchInput
                            fontSize={16}
                            width={10}
                            placeholder={'فلترة'}
                            onSearch={(e) => handleSearchByEmail(e)}
                            allowClear={true}
                            onChange={(e) => handleSearchValueChange(e.target.value)}
                        />
                    </FormItem>
                </div>
                <div className='flex mb-2'>
                    <div className='m-2'>
                        <button className='primarySolidBtn' onClick={() => downloadExcel()}>{buttonsTextConst.downloadReport}</button>
                    </div>
                    <div className='m-2'>
                        <button className='primarySolidBtn' onClick={() => requestExcel()}>{buttonsTextConst.requestReport}</button>
                    </div>
                </div>
            </div>
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
                        <ManegeUserListDrawer
                            selectedUserDetails={selectedUser}
                            setDrawerForUsers={setDrawerForUsers}
                            getUserList={getUserList}
                            searchValue={searchValue}
                            currentPage={currentPage}
                        />
                    </Drawer>
                }
            </ConfigProvider>
            {isModalForUserListReqOpen &&
                <Modal
                    className='addAppoinmentModal'
                    open={isModalForUserListReqOpen}
                    onCancel={handleClose}
                    closeIcon={false}
                    footer={false}
                >
                    <div className='p-4'>
                        <div className={styles.modalHeader}>
                            <button onClick={handleClose} className={styles.closebutton}>
                                <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} />
                            </button>
                            <p className={`fontBold text-lg`}>تحديد الفترة الزمنية</p>
                        </div>
                        <Form form={appointmentForm} onFinish={onFinish}>
                            <div className='flex mt-3'>
                                <FormItem
                                    name={'startDate'}
                                    rules={[{ required: true, message: "ادخل تاريخ البداية" }]}
                                >
                                    <DatePicker
                                        format={'YYYY-MM-DD'}
                                        width={172}
                                        height={40}
                                        placeholder='تبدأ يوم'
                                        suFFixIconName="calenderDoubleColorIcon"
                                        isDateDisabled={false}
                                    />
                                </FormItem>
                                <FormItem
                                    name={'endDate'}
                                    rules={[{ required: true, message: "ادخل تاريخ النهاية" }]}
                                >
                                    <DatePicker
                                        format={'YYYY-MM-DD'}
                                        width={172}
                                        height={40}
                                        placeholder='تنتهي يوم'
                                        suFFixIconName="calenderDoubleColorIcon"
                                        isDateDisabled={false}
                                    />
                                </FormItem>
                            </div>
                            <CustomButton
                                btnText={'إرسال التقرير'}
                                width={80}
                                height={37}
                                fontSize={16}
                                showLoader={isLoading}
                            />
                        </Form>
                    </div>
                </Modal>
            }
        </div>
    )
}

export default Index