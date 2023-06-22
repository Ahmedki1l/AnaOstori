import React, { useState } from 'react'
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet'
import styles from './AttendanceTable.module.scss'


const typeOfAttendance = ['present', 'absent', 'late', 'excused', 'blank']
const extendedAttendanceDetailsObject = {
    date: '01 May',
    present: false,
    absent: false,
    late: false,
    excused: false,
}

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
    const [selectedDay, setSelectedDay] = useState(undefined)

    const [presentIcon, setPresentIcon] = useState(false)
    const [absentIcon, setAbsentIcon] = useState(false)
    const [lateIcon, setLateIcon] = useState(false)
    const [excusedIcon, setExcusedIcon] = useState(false)



    const handelDaySelection = (index, date) => {
        console.log(index, date);
        if (selectedDay == index) {
            setSelectedDay(undefined)
        } else {
            setSelectedDay(index)
            let data = [...studentAttendanceList]
            for (let i = 0; i < data.length; i++) {
                const student = data[i];
                for (let j = 0; j < student.attendanceDetails.length; j++) {
                    if (j == index) {
                        const extendedObj = {
                            date: date,
                            present: student.attendanceDetails[j].attendanceType == 'present' ? true : false,
                            absent: student.attendanceDetails[j].attendanceType == 'absent' ? true : false,
                            late: student.attendanceDetails[j].attendanceType == 'late' ? true : false,
                            excused: student.attendanceDetails[j].attendanceType == 'excused' ? true : false,
                        }
                        data[i].attendanceDetails[j] = { ...extendedObj }
                    }
                }
            }
            console.log(data);
            setStudentAttendanceList(data)
        }
    }

    const changeStatusForIndividualType = (type, studentIndex, dayIndex) => {
        console.log(type, studentIndex, dayIndex);
        let tempStudentAttendanceList = [...studentAttendanceList]
        if (type == 'present') {
            if (tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].present == false) {
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].present == true
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].absent == false
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].late == false
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].excused == false
            } else {
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].present == false
            }
        }
        if (type == 'absent') {
            if (tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].absent == false) {
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].present == false
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].absent == true
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].late == false
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].excused == false
            } else {
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].absent == false
            }
        }
        if (type == 'late') {
            if (tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].late == false) {
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].present == false
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].absent == false
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].late == true
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].excused == false
            } else {
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].late == false
            }
        }
        if (type == 'excused') {
            if (tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].excused == false) {
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].present == false
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].absent == false
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].late == false
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].excused == true
            } else {
                tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].excused == false
            }
        }
        console.log(tempStudentAttendanceList);
        setStudentAttendanceList(tempStudentAttendanceList)
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
                                        <div className={styles.selectedDateHeadWrapper} onClick={() => handelDaySelection(index, student.date)}>
                                            <div className={styles.selectedDateHeadDateSection}>{student.date}</div>
                                            <div className={styles.selectedDateAttendanceTypeSection}>
                                                <p>حاضر</p>
                                                <p>متأخر</p>
                                                <p>غائب</p>
                                                <p>معفي</p>
                                            </div>
                                        </div>
                                        :
                                        <div className={styles.tableOtherColoumHead} key={`TableOtherColoumHead${index}`} onClick={() => handelDaySelection(index, student.date)}>
                                            <p>{student.date}</p>
                                        </div>
                                    }
                                </>
                            )
                        })}
                    </div>
                </div>
                <div id={'tableBody'}>
                    {studentAttendanceList.map((student, studentIndex) => {
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
                                    {student.attendanceDetails.map((item, dayIndex) => {
                                        return (
                                            <>
                                                {selectedDay == dayIndex ?
                                                    <div className={styles.selectedDateAttendanceTypeBodySection}>
                                                        <div onClick={() => changeStatusForIndividualType('present', studentIndex, dayIndex)}>
                                                            <AllIconsComponenet iconName={item.present == true ? 'present' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                        </div>
                                                        <div onClick={() => changeStatusForIndividualType('absent', studentIndex, dayIndex)}>
                                                            <AllIconsComponenet iconName={item.absent == true ? 'absent' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                        </div>
                                                        <div onClick={() => changeStatusForIndividualType('late', studentIndex, dayIndex)}>
                                                            <AllIconsComponenet iconName={item.late == true ? 'late' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                        </div>
                                                        <div onClick={() => changeStatusForIndividualType('excused', studentIndex, dayIndex)}>
                                                            <AllIconsComponenet iconName={item.excused == true ? 'excused' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className={styles.tableOtherColoumCell} key={`TableOtherColoumCell${dayIndex}`} onClick={() => { handelAttendanceTypeChange(studentIndex, dayIndex, item.attendanceType) }}>
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
