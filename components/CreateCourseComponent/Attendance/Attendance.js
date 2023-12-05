import React, { useState } from 'react'
import styles from './Attendance.module.scss'
import { getRouteAPI, postAuthRouteAPI } from '../../../services/apisService'
import QRCode from '../../CommonComponents/QRCode/QRCode'
import { FormItem } from '../../antDesignCompo/FormItem'
import Select from '../../antDesignCompo/Select'
import AttendanceTable from './AttendanceTableComponent/AttendanceTable'
import { useSelector } from 'react-redux'
import { dateRange } from '../../../constants/DateConverter'
import dayjs from 'dayjs'
import { getNewToken } from '../../../services/fireBaseAuthService'
import CustomButton from '../../CommonComponents/CustomButton'
import Empty from '../../CommonComponents/Empty'
import { toastSuccessMessage, toastErrorMessage } from '../../../constants/ar'
import { toast } from 'react-toastify'
import Spinner from '../../CommonComponents/spinner'

export default function Attendance(props) {

    const courseId = props.courseId
    const [openQR, setOpenQR] = useState(false)
    const [attendanceKey, setAttendanceKey] = useState("")
    const [showAttendanceTable, setShowAttendanceTable] = useState(false)
    const [dateArray, setDateArray] = useState([])
    const [attendanceData, setAttendanceData] = useState([])
    const [updatedAttendanceData, setUpdatedAttendanceData] = useState()
    const [showBtnLoader, setShowBtnLoader] = useState(false)
    const [selectedAvailability, setSelectedAvailability] = useState(null)
    const [loadning, setLoadning] = useState(false)
    const storeData = useSelector((state) => state?.globalStore);
    const availabilityList = storeData?.availabilityList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const allavailability = availabilityList?.map((obj) => {
        return {
            key: obj.id,
            label: dateRange(obj.dateFrom, obj.dateTo),
            value: obj.id,
            DateFrom: obj.dateFrom,
            DateTo: obj.dateTo,
        }
    });
    const generateQR = async () => {
        setOpenQR(true)
        await getRouteAPI({ routeName: 'getAttendanceKey' }).then((res) => {
            setAttendanceKey(res?.data?.key)
        }).catch(async (error) => {
            toast.error(toastErrorMessage.tryAgainErrorMsg, { rtl: true, })
            console.log(error);
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getRouteAPI({ routeName: 'getAttendanceKey' }).then((res) => {
                        setAttendanceKey(res?.data?.key)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                })
            }
        })
    }

    const handleCancel = () => {
        setOpenQR(false);
    }
    const createAttendanceTableData = (id, data) => {
        const selectedAvailability = availabilityList.find((element) => {
            return element.id === id;
        });
        const start = dayjs(selectedAvailability.dateFrom,);
        const end = dayjs(selectedAvailability.dateTo,);
        const datesArray = [];
        let currentDate = start;
        while (currentDate <= end) {
            datesArray.push({ date: currentDate.$d });
            currentDate = currentDate.add(1, "day");
        }
        setDateArray(datesArray)
        const attendanceDetailsData = data.map((student, index) => {
            const studentData = {
                key: `studentAttendance${index}`,
                studentName: student.fullName ? student.fullName : student.firstName + ' ' + student.lastName,
                studentAvatar: student.avatar,
                studentAvatarKey: student.avatarKey,
                studentAvatarBucket: student.avatarBucket,
                attendancePercentage: '10',
                attendanceDetails: []
            }
            const sortStudentData = student.attendances.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            const existingDates = sortStudentData.map(detail => dayjs(detail.createdAt).format('DD/MM/YYYY'))
            for (let i = 0; i < datesArray.length; i++) {
                const date = datesArray[i].date;
                if (existingDates.includes(dayjs(date).format('DD/MM/YYYY'))) {
                    const attendanceDetail = {
                        key: `dateAttendance${i}`,
                        date: date,
                        attendanceType: sortStudentData[i]?.status,
                        id: sortStudentData[i].id
                    };
                    studentData.attendanceDetails.push(attendanceDetail);
                } else if (dayjs(date).startOf('day') < dayjs(new Date()).startOf('day')) {
                    const attendanceDetail = {
                        key: `dateAttendance${i}`,
                        date: date,
                        attendanceType: "absent",
                        id: null,
                    };
                    studentData.attendanceDetails.push(attendanceDetail)
                } else {
                    const attendanceDetail = {
                        key: `dateAttendance${i}`,
                        date: date,
                        attendanceType: "blank",
                        id: null,
                    };
                    studentData.attendanceDetails.push(attendanceDetail);
                }
            }
            return (studentData)
        })
        setAttendanceData(attendanceDetailsData)
    }
    const handlSelectAvailability = async (e) => {
        setLoadning(true)
        let body = {
            routeName: "getAttendanceByAvailability",
            availabilityId: e,
        }
        await getRouteAPI(body).then((res) => {
            setSelectedAvailability(e)
            createAttendanceTableData(e, res.data)
            setShowAttendanceTable(res.data.length > 0 ? true : false)
            setLoadning(false)
        }).catch(async (error) => {
            console.log(error);
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getRouteAPI(body).then((res) => {
                        createAttendanceTableData(e, res.data)
                        setShowAttendanceTable(res.data.length > 0 ? true : false)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
            setLoadning(false)
        })
    }

    const handleAttendanceSave = async () => {
        setShowBtnLoader(true)
        let body = {
            routeName: 'updateAttendance',
            data: []
        };
        updatedAttendanceData.map((attendance) => {
            return (
                attendance.attendanceDetails.map((data) => {
                    if (data.id == null) return
                    let newAttendance = {
                        id: data.id,
                        status: data.attendanceType
                    };
                    body.data.push(newAttendance)
                })
            )
        })
        await postAuthRouteAPI(body).then((res) => {
            setShowBtnLoader(false)
            toast.success(toastSuccessMessage.appoitmentUpdateSuccessMsg, { rtl: true, })
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postAuthRouteAPI(body).then((res) => {
                        setShowBtnLoader(false)
                        toast.success(toastSuccessMessage.appoitmentUpdateSuccessMsg, { rtl: true, })
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
            toast.error(toastErrorMessage.tryAgainErrorMsg, { rtl: true, })
            setShowBtnLoader(false)
            console.log(error);
        })
    };

    return (
        <div className='maxWidthDefault px-4'>
            <div className={styles.attendanceDetails}>
                <div>
                    <FormItem>
                        <Select
                            fontSize={16}
                            width={202}
                            height={40}
                            placeholder="دورة القدرات 27 مايو"
                            OptionData={allavailability}
                            onChange={(e) => handlSelectAvailability(e)}
                        />
                    </FormItem>
                </div>
                <div className='flex'>
                    {updatedAttendanceData &&
                        <div className={`${styles.saveAttendanceBtn}`}>
                            <CustomButton
                                btnText='حفظ'
                                width={80}
                                height={37}
                                showLoader={showBtnLoader}
                                fontSize={16}
                                onClick={() => handleAttendanceSave()}
                            />
                        </div>
                    }
                    <div className={styles.createQRBtnBox}>
                        <button className='primaryStrockedBtn' onClick={() => generateQR()} disabled={selectedAvailability == null}>عرض كود التحضير</button>
                        {attendanceKey && <QRCode openQR={openQR} attendanceKey={attendanceKey} courseId={courseId} availabilityId={selectedAvailability} handleCancel={handleCancel} />}
                    </div>
                </div>
            </div>
            {!showAttendanceTable &&
                <Empty emptyText={'مافي طلاب لهذه الفترة'} fontWeight={'bold'} fontSize={20} containerhight={400} />
            }
            {showAttendanceTable &&
                <>
                    {loadning ?
                        <div className='flex justify-center items-center h-96'>
                            <Spinner borderwidth={4} width={5} height={5} margin={0.5} />
                        </div>
                        :
                        <AttendanceTable dateArray={dateArray} attendanceData={attendanceData} setUpdatedAttendanceData={setUpdatedAttendanceData} />
                    }
                </>
            }
        </div>
    )
}