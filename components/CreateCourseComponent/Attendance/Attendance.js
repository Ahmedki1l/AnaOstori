import React, { useState } from 'react'
import styles from './Attendance.module.scss'
import { generateAttendanceQRAPI, getAttendanceListAPI, updateAttendanceDataAPI } from '../../../services/apisService'
import { Modal } from 'antd'
import QRCode from '../../CommonComponents/QRCode/QRCode'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { FormItem } from '../../antDesignCompo/FormItem'
import Select from '../../antDesignCompo/Select'
import AttendanceTable from './AttendanceTableComponent/AttendanceTable'
import { useDispatch, useSelector } from 'react-redux'
import { dateRange, dateWithDay } from '../../../constants/DateConverter'
import dayjs from 'dayjs'
import { signOutUser } from '../../../services/fireBaseAuthService'

export default function Attendance(props) {
    const [openQR, setOpenQR] = useState(false)
    const [attendanceKey, setAttendanceKey] = useState("")
    const [showAttendanceTable, setShowAttendanceTable] = useState(false)
    const courseId = props.courseId
    const courseType = props.courseType
    const [dateArray, setDateArray] = useState([])
    const [attendanceData, setAttendanceData] = useState([])
    const [updatedAttendanceData, setUpdatedAttendanceData] = useState()
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
    console.log("allavailability", allavailability);

    const generateQR = async () => {
        setOpenQR(true)
        await generateAttendanceQRAPI().then((res) => {
            setAttendanceKey(res?.data?.key)
        }).catch((error) => {
            console.log(error);
            if (error?.response?.status == 401) {
                signOutUser()
                dispatch({
                    type: 'EMPTY_STORE'
                });
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
            console.log(student);
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
                        attendanceType: student.attendances[i].status,
                        id: student.attendances[i].id
                    };
                    studentData.attendanceDetails.push(attendanceDetail);
                }
                else if (dayjs(date).startOf('day') < dayjs(new Date()).startOf('day')) {
                    const attendanceDetail = {
                        key: `dateAttendance${i}`,
                        date: date,
                        attendanceType: "absent",
                        id: null,
                    };
                    studentData.attendanceDetails.push(attendanceDetail)
                }
                else {
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
        let body = {
            availabilityId: e,
        }
        await getAttendanceListAPI(body).then((res) => {
            console.log(res);
            createAttendanceTableData(e, res.data)
            // setShowAttendanceTable(true)
            setShowAttendanceTable(res.data.length > 0 ? true : false)
        }).catch((error) => {
            console.log(error);
            if (error?.response?.status == 401) {
                signOutUser()
                dispatch({
                    type: 'EMPTY_STORE'
                });
            }
        })
    }

    const handleAttendanceSave = async () => {
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
        }).catch((error) => {
            console.log(error);
            if (error?.response?.status == 401) {
                signOutUser()
                dispatch({
                    type: 'EMPTY_STORE'
                });
            }
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
                    <div className={`${styles.saveAttendanceBtn}`}>
                        <button className='primarySolidBtn' onClick={(data) => handleAttendanceSave(data)}>يحفظ</button>
                    </div>
                    <div className={styles.createQRBtnBox}>
                        <button className='primaryStrockedBtn' onClick={() => generateQR()}>عرض كود التحضير</button>
                        <Modal
                            className='addAppoinmentModal'
                            open={openQR}
                            closeIcon={false}
                            footer={[]}
                            onCancel={handleCancel}
                        >
                            <div className={styles.modalHeader}>
                                <div className={styles.closeIcon}>
                                    <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} onClick={handleCancel}></AllIconsComponenet>
                                </div>
                                <p className={`fontBold ${styles.createappointment}`}>{dateWithDay(new Date())}</p>
                            </div>
                            <QRCode attendanceKey={attendanceKey} courseId={courseId} />
                        </Modal>
                    </div>
                </div>
            </div>
            {/* {showAttendanceTable && <AttendanceTable dateArray={dateArray} attendanceData={attendanceData} setUpdatedAttendanceData={setUpdatedAttendanceData} />} */}
            {!showAttendanceTable &&
                <div className={styles.tableBodyArea}>
                    <div className={styles.noDataManiArea}>
                        <div>
                            <AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
                            <p className='fontBold py-2' style={{ fontSize: '20px' }}>مافي طلاب لهذه الفترة</p>
                        </div>
                    </div>
                </div>
            }
            {showAttendanceTable &&
                <AttendanceTable dateArray={dateArray} attendanceData={attendanceData} setUpdatedAttendanceData={setUpdatedAttendanceData} />
            }
        </div>
    )
}