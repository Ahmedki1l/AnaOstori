import React, { Fragment, useRef, useState } from 'react'
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet'
import styles from './AttendanceTable.module.scss'
import dayjs from 'dayjs'


const typeOfAttendance = ['present', 'absent', 'late', 'excused', 'blank']

export default function AttendanceTable(props) {
    const dateArray = props.dateArray
    const attendanceData = props.attendanceData
    const [studentAttendanceList, setStudentAttendanceList] = useState(attendanceData)
    const [selectedDayIndex, setSelectedDayIndex] = useState(undefined)
    const [selectedDay, setSelectedDay] = useState('')
    console.log(studentAttendanceList);

    const handelDaySelection = (index, date) => {
        if (dayjs(date).startOf('day') > dayjs(new Date())) {
            return
        }
        if (selectedDayIndex == index) {
            let data = [...studentAttendanceList]
            for (let i = 0; i < data.length; i++) {
                const student = data[i];
                for (let j = 0; j < student.attendanceDetails.length; j++) {
                    if (j == index) {
                        const extendedObj = student.attendanceDetails[j];
                        const trueVariables = [];
                        for (const key in extendedObj) {
                            if (extendedObj[key] === true) {
                                trueVariables.push(key);
                            }
                        }
                        const shrinkObj = {
                            date: date,
                            attendanceType: trueVariables[0] ? trueVariables[0] : 'blank'
                        }
                        data[i].attendanceDetails[j] = { ...shrinkObj }
                    }
                }
            }
            console.log(data);
            setSelectedDayIndex(undefined)
            setSelectedDay(date)
        } else {
            setSelectedDayIndex(index)
            setSelectedDay(date)
            console.log(index, selectedDay);
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
                    } else if (j == selectedDayIndex) {
                        const extendedObj = student.attendanceDetails[j];
                        const trueVariables = [];
                        let noSelect = 0
                        for (const key in extendedObj) {
                            if (extendedObj[key] === true) {
                                trueVariables.push(key);
                            }
                            if (++noSelect > 4) {
                                trueVariables.push('blank');
                            }
                        }
                        const shrinkObj = {
                            date: selectedDay,
                            attendanceType: trueVariables[0]
                        }
                        console.log(shrinkObj);
                        data[i].attendanceDetails[j] = { ...shrinkObj }
                    }
                }
            }
            console.log(data);
            setStudentAttendanceList(data)
            props.setUpdatedAttendanceData(data)
        }
    }

    const changeStatusForIndividualType = (type, studentIndex, dayIndex) => {
        console.log(type, studentIndex, dayIndex);
        let tempStudentAttendanceList = [...studentAttendanceList]
        if (type == 'present') {
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].present = true
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].absent = false
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].late = false
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].excused = false
        }
        if (type == 'absent') {
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].present = false
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].absent = true
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].late = false
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].excused = false
        }
        if (type == 'late') {
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].present = false
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].absent = false
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].late = true
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].excused = false
        }
        if (type == 'excused') {
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].present = false
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].absent = false
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].late = false
            tempStudentAttendanceList[studentIndex].attendanceDetails[dayIndex].excused = true
        }
        setStudentAttendanceList(tempStudentAttendanceList)
        props.setUpdatedAttendanceData(tempStudentAttendanceList)

    }

    const handelAttendanceTypeChange = (studentIndex, attendanceTypeIndex, attendanceType, date) => {
        console.log(date);
        if (dayjs(date).startOf('day') > dayjs(new Date())) {
            return
        }
        let tempStudentAttendanceList = [...studentAttendanceList]
        let indexOfAttendanceType = typeOfAttendance.indexOf(attendanceType) == typeOfAttendance.length - 1 ? -1 : typeOfAttendance.indexOf(attendanceType)
        tempStudentAttendanceList[studentIndex].attendanceDetails[attendanceTypeIndex].attendanceType = typeOfAttendance[indexOfAttendanceType + 1]
        setStudentAttendanceList(tempStudentAttendanceList)
        props.setUpdatedAttendanceData(tempStudentAttendanceList)
    }

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableSubContainer}>
                <div className={styles.tableHeadWrraper}>
                    <div className={styles.tableFirstColoumHead}>
                        <div className={styles.tableFirstColoumHeadSubWrapper}>
                            <p>الطالب</p>
                            <p>نسبة الحضور</p>
                        </div>
                    </div>
                    <div className='flex'>
                        {dateArray.map((student, index) => {
                            return (
                                <Fragment key={`TableOtherColoumHead${index}`}>
                                    {selectedDayIndex == index ?
                                        <div className={styles.selectedDateHeadWrapper} onClick={() => handelDaySelection(index, student.date)}>
                                            <div className={styles.selectedDateHeadDateSection}>{dayjs(student.date).format('DD MMMM')}</div>
                                            <div className={styles.selectedDateAttendanceTypeSection}>
                                                <p>حاضر</p>
                                                <p>متأخر</p>
                                                <p>غائب</p>
                                                <p>معفي</p>
                                            </div>
                                        </div>
                                        :
                                        <div className={`${styles.tableOtherColoumHead} ${dayjs(student.date).startOf('day') > dayjs(new Date()) ? `cursor-not-allowed` : `cursor-pointer`}`}>
                                            <p onClick={() => handelDaySelection(index, student.date)}>{dayjs(student.date).format('DD MMMM')}</p>
                                        </div>
                                    }
                                </Fragment>
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
                                            <Fragment key={`TableOtherColoumCell${dayIndex}`}>
                                                {selectedDayIndex == dayIndex ?
                                                    <div className={styles.selectedDateAttendanceTypeBodySection} >
                                                        <div className={styles.tableOtherColoumCell} >
                                                            <div className="cursor-pointer" onClick={() => changeStatusForIndividualType('present', studentIndex, dayIndex)}>
                                                                <AllIconsComponenet iconName={item.present == true ? 'present' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                            </div>
                                                        </div>
                                                        <div className={styles.tableOtherColoumCell} >
                                                            <div className="cursor-pointer" onClick={() => changeStatusForIndividualType('absent', studentIndex, dayIndex)}>
                                                                <AllIconsComponenet iconName={item.absent == true ? 'absent' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                            </div>
                                                        </div>
                                                        <div className={styles.tableOtherColoumCell} >
                                                            <div className="cursor-pointer" onClick={() => changeStatusForIndividualType('late', studentIndex, dayIndex)}>
                                                                <AllIconsComponenet iconName={item.late == true ? 'late' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                            </div>
                                                        </div>
                                                        <div className={styles.tableOtherColoumCell} >
                                                            <div className="cursor-pointer" onClick={() => changeStatusForIndividualType('excused', studentIndex, dayIndex)}>
                                                                <AllIconsComponenet iconName={item.excused == true ? 'excused' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className={styles.tableOtherColoumCell}  >
                                                        <div className={`${dayjs(item.date).startOf('day') > dayjs(new Date()) ? `cursor-not-allowed` : `cursor-pointer`}`} onClick={() => { handelAttendanceTypeChange(studentIndex, dayIndex, item.attendanceType, item.date) }}  >
                                                            <AllIconsComponenet iconName={item.attendanceType == 'blank' ? 'circleicon' : item.attendanceType} height={34} width={34} color={item.attendanceType == 'blank' ? '#D9D9D9' : ''} />
                                                        </div>
                                                    </div>
                                                }
                                            </Fragment>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
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
                                            <Fragment key={`TableOtherColoumCell${dayIndex}`}>
                                                {selectedDayIndex == dayIndex ?
                                                    <div className={styles.selectedDateAttendanceTypeBodySection} >
                                                        <div className={styles.tableOtherColoumCell} >
                                                            <div className="cursor-pointer" onClick={() => changeStatusForIndividualType('present', studentIndex, dayIndex)}>
                                                                <AllIconsComponenet iconName={item.present == true ? 'present' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                            </div>
                                                        </div>
                                                        <div className={styles.tableOtherColoumCell} >
                                                            <div className="cursor-pointer" onClick={() => changeStatusForIndividualType('absent', studentIndex, dayIndex)}>
                                                                <AllIconsComponenet iconName={item.absent == true ? 'absent' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                            </div>
                                                        </div>
                                                        <div className={styles.tableOtherColoumCell} >
                                                            <div className="cursor-pointer" onClick={() => changeStatusForIndividualType('late', studentIndex, dayIndex)}>
                                                                <AllIconsComponenet iconName={item.late == true ? 'late' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                            </div>
                                                        </div>
                                                        <div className={styles.tableOtherColoumCell} >
                                                            <div className="cursor-pointer" onClick={() => changeStatusForIndividualType('excused', studentIndex, dayIndex)}>
                                                                <AllIconsComponenet iconName={item.excused == true ? 'excused' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className={styles.tableOtherColoumCell}  >
                                                        <div className={`${dayjs(item.date).startOf('day') > dayjs(new Date()) ? `cursor-not-allowed` : `cursor-pointer`}`} onClick={() => { handelAttendanceTypeChange(studentIndex, dayIndex, item.attendanceType, item.date) }}  >
                                                            <AllIconsComponenet iconName={item.attendanceType == 'blank' ? 'circleicon' : item.attendanceType} height={34} width={34} color={item.attendanceType == 'blank' ? '#D9D9D9' : ''} />
                                                        </div>
                                                    </div>
                                                }
                                            </Fragment>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
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
                                            <Fragment key={`TableOtherColoumCell${dayIndex}`}>
                                                {selectedDayIndex == dayIndex ?
                                                    <div className={styles.selectedDateAttendanceTypeBodySection} >
                                                        <div className={styles.tableOtherColoumCell} >
                                                            <div className="cursor-pointer" onClick={() => changeStatusForIndividualType('present', studentIndex, dayIndex)}>
                                                                <AllIconsComponenet iconName={item.present == true ? 'present' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                            </div>
                                                        </div>
                                                        <div className={styles.tableOtherColoumCell} >
                                                            <div className="cursor-pointer" onClick={() => changeStatusForIndividualType('absent', studentIndex, dayIndex)}>
                                                                <AllIconsComponenet iconName={item.absent == true ? 'absent' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                            </div>
                                                        </div>
                                                        <div className={styles.tableOtherColoumCell} >
                                                            <div className="cursor-pointer" onClick={() => changeStatusForIndividualType('late', studentIndex, dayIndex)}>
                                                                <AllIconsComponenet iconName={item.late == true ? 'late' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                            </div>
                                                        </div>
                                                        <div className={styles.tableOtherColoumCell} >
                                                            <div className="cursor-pointer" onClick={() => changeStatusForIndividualType('excused', studentIndex, dayIndex)}>
                                                                <AllIconsComponenet iconName={item.excused == true ? 'excused' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className={styles.tableOtherColoumCell}  >
                                                        <div className={`${dayjs(item.date).startOf('day') > dayjs(new Date()) ? `cursor-not-allowed` : `cursor-pointer`}`} onClick={() => { handelAttendanceTypeChange(studentIndex, dayIndex, item.attendanceType, item.date) }}  >
                                                            <AllIconsComponenet iconName={item.attendanceType == 'blank' ? 'circleicon' : item.attendanceType} height={34} width={34} color={item.attendanceType == 'blank' ? '#D9D9D9' : ''} />
                                                        </div>
                                                    </div>
                                                }
                                            </Fragment>
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
