import React, { useState } from 'react'
import styles from './Attendance.module.scss'
import { generateAttendanceQRAPI } from '../../../services/apisService'
import { Modal } from 'antd'
import QRCode from '../../CommonComponents/QRCode/QRCode'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { FormItem } from '../../antDesignCompo/FormItem'
import Select from '../../antDesignCompo/Select'
import AttendanceTable from './AttendanceTableComponent/AttendanceTable'

export default function Attendance(props) {
    const [openQR, setOpenQR] = useState(false)
    const [attendanceKey, setAttendanceKey] = useState("")
    const [extendedHead, setExtendedHead] = useState(true)
    const courseId = props.courseId
    const courseType = props.courseType

    const studentAttendanceList = [
        {
            studentName: 'Chirag',
            attendancePercentage: '10',
            attendanceDetails: [
                {
                    date: '01 May',
                    attendanceType: 'present'
                },
                {
                    date: '02 May',
                    attendanceType: 'absent'
                },
                {
                    date: '03 May',
                    attendanceType: 'late'
                },
                {
                    date: '04 May',
                    attendanceType: 'excused'
                },
                {
                    date: '05 May',
                    attendanceType: 'blank'
                },
                {
                    date: '06 May',
                    attendanceType: 'present'
                },
                {
                    date: '07 May',
                    attendanceType: 'absent'
                },
                {
                    date: '08 May',
                    attendanceType: 'late'
                },
                {
                    date: '09 May',
                    attendanceType: 'excused'
                },
                {
                    date: '10 May',
                    attendanceType: 'blank'
                },
                {
                    date: '11 May',
                    attendanceType: 'absent'
                },
                {
                    date: '12 May',
                    attendanceType: 'late'
                },
                {
                    date: '13 May',
                    attendanceType: 'excused'
                },
                {
                    date: '14 May',
                    attendanceType: 'blank'
                },
                {
                    date: '08 May',
                    attendanceType: 'absent'
                },
                {
                    date: '09 May',
                    attendanceType: 'absent'
                },
                {
                    date: '10 May',
                    attendanceType: 'blank'
                },
                {
                    date: '11 May',
                    attendanceType: 'absent'
                },
                {
                    date: '12 May',
                    attendanceType: 'absent'
                },
                {
                    date: '13 May',
                    attendanceType: 'excused'
                },
                {
                    date: '14 May',
                    attendanceType: 'blank'
                },

            ]
        },
        {
            studentName: 'Hiren',
            attendancePercentage: '30',
            attendanceDetails: [
                {
                    date: '01 May',
                    attendanceType: 'absent'
                },
                {
                    date: '02 May',
                    attendanceType: 'excused'
                },
                {
                    date: '03 May',
                    attendanceType: 'late'
                },
                {
                    date: '04 May',
                    attendanceType: 'excused'
                },
                {
                    date: '05 May',
                    attendanceType: 'present'
                },
                {
                    date: '06 May',
                    attendanceType: 'present'
                },
                {
                    date: '07 May',
                    attendanceType: 'absent'
                },
                {
                    date: '08 May',
                    attendanceType: 'present'
                },
                {
                    date: '09 May',
                    attendanceType: 'excused'
                },
                {
                    date: '10 May',
                    attendanceType: 'blank'
                },
                {
                    date: '11 May',
                    attendanceType: 'absent'
                },
                {
                    date: '12 May',
                    attendanceType: 'present'
                },
                {
                    date: '13 May',
                    attendanceType: 'excused'
                },
                {
                    date: '14 May',
                    attendanceType: 'blank'
                },
                {
                    date: '08 May',
                    attendanceType: 'absent'
                },
                {
                    date: '09 May',
                    attendanceType: 'absent'
                },
                {
                    date: '10 May',
                    attendanceType: 'blank'
                },
                {
                    date: '11 May',
                    attendanceType: 'absent'
                },
                {
                    date: '12 May',
                    attendanceType: 'absent'
                },
                {
                    date: '13 May',
                    attendanceType: 'excused'
                },
                {
                    date: '14 May',
                    attendanceType: 'blank'
                },

            ]
        },
        {
            studentName: 'Mayur',
            attendancePercentage: '50',
            attendanceDetails: [
                {
                    date: '01 May',
                    attendanceType: 'late'
                },
                {
                    date: '02 May',
                    attendanceType: 'absent'
                },
                {
                    date: '03 May',
                    attendanceType: 'late'
                },
                {
                    date: '04 May',
                    attendanceType: 'excused'
                },
                {
                    date: '05 May',
                    attendanceType: 'late'
                },
                {
                    date: '06 May',
                    attendanceType: 'present'
                },
                {
                    date: '07 May',
                    attendanceType: 'absent'
                },
                {
                    date: '08 May',
                    attendanceType: 'late'
                },
                {
                    date: '09 May',
                    attendanceType: 'late'
                },
                {
                    date: '10 May',
                    attendanceType: 'late'
                },
                {
                    date: '11 May',
                    attendanceType: 'absent'
                },
                {
                    date: '12 May',
                    attendanceType: 'late'
                },
                {
                    date: '13 May',
                    attendanceType: 'excused'
                },
                {
                    date: '14 May',
                    attendanceType: 'late'
                },
                {
                    date: '08 May',
                    attendanceType: 'absent'
                },
                {
                    date: '09 May',
                    attendanceType: 'absent'
                },
                {
                    date: '10 May',
                    attendanceType: 'blank'
                },
                {
                    date: '11 May',
                    attendanceType: 'absent'
                },
                {
                    date: '12 May',
                    attendanceType: 'absent'
                },
                {
                    date: '13 May',
                    attendanceType: 'excused'
                },
                {
                    date: '14 May',
                    attendanceType: 'blank'
                },

            ]
        },
        {
            studentName: 'Anand',
            attendancePercentage: '5',
            attendanceDetails: [
                {
                    date: '01 May',
                    attendanceType: 'absent'
                },
                {
                    date: '02 May',
                    attendanceType: 'absent'
                },
                {
                    date: '03 May',
                    attendanceType: 'absent'
                },
                {
                    date: '04 May',
                    attendanceType: 'excused'
                },
                {
                    date: '05 May',
                    attendanceType: 'present'
                },
                {
                    date: '06 May',
                    attendanceType: 'absent'
                },
                {
                    date: '07 May',
                    attendanceType: 'absent'
                },
                {
                    date: '08 May',
                    attendanceType: 'absent'
                },
                {
                    date: '09 May',
                    attendanceType: 'absent'
                },
                {
                    date: '10 May',
                    attendanceType: 'blank'
                },
                {
                    date: '11 May',
                    attendanceType: 'absent'
                },
                {
                    date: '12 May',
                    attendanceType: 'absent'
                },
                {
                    date: '13 May',
                    attendanceType: 'excused'
                },
                {
                    date: '14 May',
                    attendanceType: 'blank'
                },
                {
                    date: '08 May',
                    attendanceType: 'absent'
                },
                {
                    date: '09 May',
                    attendanceType: 'absent'
                },
                {
                    date: '10 May',
                    attendanceType: 'blank'
                },
                {
                    date: '11 May',
                    attendanceType: 'absent'
                },
                {
                    date: '12 May',
                    attendanceType: 'absent'
                },
                {
                    date: '13 May',
                    attendanceType: 'excused'
                },
                {
                    date: '14 May',
                    attendanceType: 'blank'
                },

            ]
        },
    ]

    const generateQR = async () => {
        setOpenQR(true)
        await generateAttendanceQRAPI().then((res) => {
            setAttendanceKey(res?.data?.key)
        }).catch((error) => {
            console.log(error);
        })
    }

    const startMonth = new Date().toLocaleDateString('ar-AE', { timeZone: "UTC", month: 'long' })
    const startDate = new Date().toLocaleDateString('en-US', { timeZone: "UTC", day: 'numeric' })
    const startDay = new Date().toLocaleDateString('ar-AE', { timeZone: "UTC", weekday: 'long' })

    const handleCancel = () => {
        setOpenQR(false);
    }

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
                        />
                    </FormItem>
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
                            <p className={`fontBold ${styles.createappointment}`}>{` ${startDay} ${startDate} ${startMonth}`}</p>
                        </div>
                        <QRCode attendanceKey={attendanceKey} courseId={courseId} />
                    </Modal>
                </div>
            </div>
            <div className={styles.tableContainer}>
                <AttendanceTable studentAttendanceList={studentAttendanceList} />
            </div>
        </div>
    )
}

{/* <th className={styles.tableHead2}>31 April</th>
                            <th className={styles.tableHead2}>01 May</th>
                            <th className={styles.tableHead2}>02 May</th>
                            <th className={styles.tableHead2}>03 May</th>
                            <th className={styles.tableHead2}>04 May</th>
                            <th className={styles.tableHead2}>05 May</th>
                            <th className={styles.tableHead2}>06 May</th>
                            <th className={styles.tableHead2}>07 May</th> 
                            <th className={styles.tableHead2}>08 May</th>
                            <th className={styles.tableHead2}>09 May</th>
                            <th className={styles.tableHead2}>10 May</th>
                            <th className={styles.tableHead2}>11 May</th>
                            <th className={styles.tableHead2}>12 May</th>
                            <th className={styles.tableHead2}>01 May</th>
                            <th className={styles.tableHead2}>02 May</th>
                            <th className={styles.tableHead2}>03 May</th>
                            <th className={styles.tableHead2}>04 May</th>
                            <th className={styles.tableHead2}>05 May</th>
                            <th className={styles.tableHead2}>06 May</th>
                            <th className={styles.tableHead2}>07 May</th>
                            <th className={styles.tableHead2}>08 May</th>
                            <th className={styles.tableHead2}>09 May</th>
                            <th className={styles.tableHead2}>10 May</th>
                            <th className={styles.tableHead2}>11 May</th>
                            <th className={styles.tableHead2}>12 May</th> */}

{/* <td className={styles.StudentDetails}>
                                <AllIconsComponenet iconName={'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                <p className={styles.StudentName}> عبدالإله مدخلي</p>
                                <div className={styles.StudentPercantageBox}><p className={styles.StudentPercantage}>X%</p></div>
                            </td>
                            <td className={styles.studentsAttendance} >
                                <AttendanceButton />
                            </td>
                            <td className={styles.studentsAttendance} >
                                <AttendanceButton />
                            </td>
                            <td className={styles.studentsAttendance} >
                                <AttendanceButton />
                            </td>
                            <td className={styles.studentsAttendance} >
                                <AttendanceButton />
                            </td>
                            <td className={styles.studentsAttendance} >
                                <AttendanceButton />
                            </td>
                            <td className={styles.studentsAttendance} >
                                <AttendanceButton />
                            </td>
                            <td className={styles.studentsAttendance} >
                                <AttendanceButton />
                            </td>
                            <td className={styles.studentsAttendance} >
                                <AttendanceButton />
                            </td>
                            <td className={styles.studentsAttendance} >
                                <AttendanceButton />
                            </td>
                            <td className={styles.studentsAttendance} >
                                <AttendanceButton />
                            </td>
                            <td className={styles.studentsAttendance} >
                                <AttendanceButton />
                            </td>
                            <td className={styles.studentsAttendance} >
                                <AttendanceButton />
                            </td>
                            <td className={styles.studentsAttendance} >
                                <AttendanceButton />
                            </td> */}

{/* {studentAttendanceList.map((index) => ([
                            <tr className={styles.tableRow}>
                                <td className={styles.StudentDetails}>
                                    <AllIconsComponenet iconName={'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                    <p className={styles.StudentName}>{index.studentName}</p>
                                    <div className={styles.StudentPercantageBox}><p className={styles.StudentPercantage}>{index.attendancePercentage}</p></div>
                                </td>
                                <td className={styles.studentsAttendance} >
                                    <AttendanceButton />
                                </td>
                            </tr>
                        ]))} */}