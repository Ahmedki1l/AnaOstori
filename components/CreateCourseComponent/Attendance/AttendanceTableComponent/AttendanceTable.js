import React, { useState } from 'react'
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet'
import styles from './AttendanceTable123.module.scss'


const typeOfAttendance = ['present', 'absent', 'late', 'excused', 'blank']

export default function AttendanceTable() {

    const InitialStudentAttendanceList = [
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
                    attendanceType: 'absent'
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
                    attendanceType: 'present'
                },
                {
                    date: '13 May',
                    attendanceType: 'absent'
                },
                {
                    date: '14 May',
                    attendanceType: 'blank'
                },

            ]
        },
        {
            studentName: 'Hitarth',
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

    const [studentAttendanceList, setStudentAttendanceList] = useState(InitialStudentAttendanceList)
    const [selectedDay, setSelectedDay] = useState('')

    const handelDaySelection = (index) => {
        console.log(index);
        if (selectedDay == index) {
            setSelectedDay('')
        } else {
            setSelectedDay(index)
        }
    }

    const changeStatusForIndividualType = (type) => {

    }

    const handelAttendanceTypeChange = (studentIndex, attendanceTypeIndex, attendanceType) => {
        console.log(studentIndex, attendanceTypeIndex, attendanceType);
        let tempStudentAttendanceList = [...studentAttendanceList]
        let indexOfAttendanceType = typeOfAttendance.indexOf(attendanceType) == typeOfAttendance.length - 1 ? -1 : typeOfAttendance.indexOf(attendanceType)
        tempStudentAttendanceList[studentIndex].attendanceDetails[attendanceTypeIndex].attendanceType = typeOfAttendance[indexOfAttendanceType + 1]
        setStudentAttendanceList(tempStudentAttendanceList)
    }

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableSubContainer}>
                <div className={styles.tableHeadWrraper}>
                    <div className={styles.tableFirstColoumHead}>
                        <p>الطالب</p>
                        <p>نسبة الحضور</p>
                    </div>
                    <div className='flex'>
                        {studentAttendanceList[0].attendanceDetails.map((student, index) => {
                            return (
                                <>
                                    {selectedDay == index ?
                                        <div className={styles.selectedDateHeadWrapper}>
                                            <div className={styles.selectedDateHeadDateSection}>{student.date}</div>
                                            <div className={styles.selectedDateAttendanceTypeSection}>
                                                <p>حاضر</p>
                                                <p>متأخر</p>
                                                <p>غائب</p>
                                                <p>معفي</p>
                                            </div>
                                        </div>
                                        :
                                        <div className={styles.tableOtherColoumHead} key={`TableOtherColoumHead${index}`} onClick={() => handelDaySelection(index)}>
                                            <p>{student.date}</p>
                                        </div>
                                    }
                                </>
                            )
                        })}
                    </div>
                </div>
                <div id={'tableBody'}>
                    {studentAttendanceList.map((student, studentIndex = index) => {
                        return (
                            <div className='flex' key={`TableFirstColoumCell${studentIndex}`}>
                                <div className={styles.tableFirstColoumCell} >
                                    <div className='flex items-center px-3'>
                                        <AllIconsComponenet iconName={'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                        <div className='pr-3'><p>{student.studentName}</p></div>
                                    </div>
                                    <div className={styles.studentPercantageBox}>
                                        <p>{student.attendancePercentage}%</p>
                                    </div>
                                </div>
                                <div className='flex'>
                                    {student.attendanceDetails.map((item, attendanceTypeIndex = index) => {
                                        return (
                                            <>
                                                {selectedDay == attendanceTypeIndex ?
                                                    <div className={styles.selectedDateAttendanceTypeBodySection}>
                                                        <div onClick={() => changeStatusForIndividualType('present')}>
                                                            <AllIconsComponenet iconName={'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                        </div>
                                                        <div>
                                                            <AllIconsComponenet iconName={'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                        </div>
                                                        <div>
                                                            <AllIconsComponenet iconName={'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                        </div>
                                                        <div>
                                                            <AllIconsComponenet iconName={'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className={styles.tableOtherColoumCell} key={`TableOtherColoumCell${attendanceTypeIndex}`} onClick={() => { handelAttendanceTypeChange(studentIndex, attendanceTypeIndex, item.attendanceType) }}>
                                                        <AllIconsComponenet iconName={item.attendanceType == 'blank' ? 'circleicon' : item.attendanceType} height={34} width={34} color={item.attendanceType == 'blank' ? '#D9D9D9' : ''} />
                                                    </div>
                                                }
                                            </>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div >
    )
}
