import React from 'react'
import styled from 'styled-components'
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet'
import styles from './attendanceTable.module.scss'


const TableContainer = styled.div`
    display: flex;
    // width :100%
    // overflow-x: auto;
`

const TableFirstColoum = styled.div`
    width: 433px;
`
const TableOtherColoum = styled.div`
    display: flex;
    position: relative;
    // width :100%
    overflow-x: auto;
`
const TableFirstColoumHead = styled.div`
    display: flex;
    justify-content: space-between;
    height: 82px;
    width: 433px;
`
const TableOtherColoumHead = styled.div`
    width: 120px;
    height: 82px;
    text-align: center;
    border: 0.3px solid #CACACA;
`
const TableFirstColoumCell = styled.div`
    display: flex;
    justify-content: space-between;
`
const TableOtherColoumCell = styled.div`
    text-align: center;
`

export default function AttendanceTable({ studentAttendanceList }) {
    console.log(studentAttendanceList);
    return (
        <TableContainer>
            <TableFirstColoum>
                <TableFirstColoumHead className={styles.tableFirstColumnhead}>
                    <p>الطالب</p>
                    <p>نسبة الحضور</p>
                </TableFirstColoumHead>
                {studentAttendanceList.map((student, index) => {
                    return (
                        <TableFirstColoumCell className={styles.tableFirstColumnCell} key={`TableFirstColoumCell${index}`}>
                            <div className='flex'>
                                <div className={styles.circleIcon}><AllIconsComponenet iconName={'circleicon'} height={34} width={34} color={'#D9D9D9'} /></div>
                                <div className={styles.studentNameList}><p>{student.studentName}</p>
                                </div>
                            </div>
                            <div className={styles.StudentPercantageBox}>
                                <p className={styles.StudentPercantage}>{student.attendancePercentage}%</p>
                            </div>
                        </TableFirstColoumCell>
                    )
                })}
            </TableFirstColoum>

            <TableOtherColoum>
                {studentAttendanceList[0].attendanceDetails.map((student, index) => {
                    return (
                        <TableOtherColoumHead className={styles.tableotherColumnHead} key={`TableOtherColoumHead${index}`}>
                            <div className={styles.attendanceDate}><p>{student.date}</p></div>
                            {/* {student.students.map((student) => {
                            return (
                                <div className='flex'>
                                <AllIconsComponenet iconName='user' />
                                <p>{student.studentName}</p>
                                </div>
                                )
                            })} */}
                        </TableOtherColoumHead>
                    )
                })}
                {studentAttendanceList.map((student, index) => {
                    return (
                        <TableOtherColoumCell className={styles.tableFirstColumnCell} key={`TableFirstColoumCell${index}`}>
                            <AllIconsComponenet iconName={'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                        </TableOtherColoumCell>
                    )
                })}
            </TableOtherColoum>

        </TableContainer>
    )
}
