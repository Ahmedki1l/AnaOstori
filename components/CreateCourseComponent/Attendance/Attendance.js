import React, { useState } from 'react'
import styles from './Attendance.module.scss'
import { getAttendanceListAPI, getRouteAPI, updateAttendanceDataAPI } from '../../../services/apisService'
import QRCode from '../../CommonComponents/QRCode/QRCode'
import { FormItem } from '../../antDesignCompo/FormItem'
import Select from '../../antDesignCompo/Select'
import AttendanceTable from './AttendanceTableComponent/AttendanceTable'
import { useDispatch, useSelector } from 'react-redux'
import { dateRange, dateWithDay } from '../../../constants/DateConverter'
import dayjs from 'dayjs'
import { getNewToken } from '../../../services/fireBaseAuthService'
import CustomButton from '../../CommonComponents/CustomButton'
import Empty from '../../CommonComponents/Empty'
import { toastSuccessMessage, toastErrorMessage } from '../../../constants/ar'
import { toast } from 'react-toastify'

export default function Attendance(props) {
    const [openQR, setOpenQR] = useState(false)
    const [attendanceKey, setAttendanceKey] = useState("")
    const [showAttendanceTable, setShowAttendanceTable] = useState(false)
    const courseId = props.courseId
    const [dateArray, setDateArray] = useState([])
    const [attendanceData, setAttendanceData] = useState([])
    const [updatedAttendanceData, setUpdatedAttendanceData] = useState()
    const [showBtnLoader, setShowBtnLoader] = useState(false)

    const dispatch = useDispatch();

    const storeData = useSelector((state) => state?.globalStore);
    const availabilityList = storeData?.availabilityList;

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
            toast.error(toastErrorMessage.tryAgainErrorMsg)
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
                studentName: student.firstName,
                studentAvatar: student.avatar,
                studentAvatarKey: student.avatarKey,
                attendancePercentage: '10',
                attendanceDetails: []
            }
            const existingDates = student.attendances.map(detail => dayjs(detail.createdAt).format('DD/MM/YYYY'))
            for (let i = 0; i < datesArray.length; i++) {
                const date = datesArray[i].date;
                if (existingDates.includes(dayjs(date).format('DD/MM/YYYY'))) {
                    const attendanceDetail = {
                        key: `dateAttendance${i}`,
                        date: date,
                        attendanceType: student?.attendances[i]?.status,
                        id: student.attendances[i].id
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
        // let body = {
        //     availabilityId: e,
        // }
        let body = {
            availabilityId: e,
            routeName: "getAttendanceByAvailability",
        }
        // await getAttendanceListAPI(body).then((res) => {
        await getRouteAPI(body).then((res) => {
            createAttendanceTableData(e, res.data)
            setShowAttendanceTable(res.data.length > 0 ? true : false)
        }).catch(async (error) => {
            console.log(error);
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    // await getAttendanceListAPI(body).then((res) => {
                    await getRouteAPI(body).then((res) => {
                        createAttendanceTableData(e, res.data)
                        setShowAttendanceTable(res.data.length > 0 ? true : false)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }

    const handleAttendanceSave = async () => {
        setShowBtnLoader(true)
        let body = {
            data: { data: [] }
        };
        updatedAttendanceData.map((attendance) => {
            return (
                attendance.attendanceDetails.map((data) => {
                    if (data.id == null) return
                    let newAttendance = {
                        id: data.id,
                        status: data.attendanceType
                    };
                    body.data.data.push(newAttendance)
                })
            )
        })
        await updateAttendanceDataAPI(body).then((res) => {
            setShowBtnLoader(false)
            toast.success(toastSuccessMessage.appoitmentUpdateSuccessMsg)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await updateAttendanceDataAPI(body).then((res) => {
                        setShowBtnLoader(false)
                        toast.success(toastSuccessMessage.appoitmentUpdateSuccessMsg)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
            toast.error(toastErrorMessage.tryAgainErrorMsg)
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
                            {/* <div>
                                <button className='primaryStrockedBtn' onClick={() => handleAttendanceSave()}>عرض كود التحضير</button>
                            </div> */}
                        </div>
                    }
                    <div className={styles.createQRBtnBox}>
                        <button className='primaryStrockedBtn' onClick={() => generateQR()}>عرض كود التحضير</button>
                        {attendanceKey && <QRCode openQR={openQR} attendanceKey={attendanceKey} courseId={courseId} handleCancel={handleCancel} />}
                    </div>
                </div>
            </div>
            {!showAttendanceTable &&
                <Empty emptyText={'مافي طلاب لهذه الفترة'} fontWeight={'bold'} fontSize={20} containerhight={400} />
            }
            {showAttendanceTable &&
                <AttendanceTable dateArray={dateArray} attendanceData={attendanceData} setUpdatedAttendanceData={setUpdatedAttendanceData} />
            }
        </div>
    )
}