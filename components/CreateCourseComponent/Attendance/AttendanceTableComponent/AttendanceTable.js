import React from 'react'
import styled from 'styled-components'
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet'

const TableContainer = styled.div`
    display: flex;
`

const TableFirstColoum = styled.div`
    width: 433px;
`

const TableBody = styled.div`
    display: flex;    
`

const TableFirstColoumHead = styled.div`
    display: flex;
    justify-content: space-between;
`
const TableFirstColoumCell = styled.div`
    display: flex;
    justify-content: space-between;
`

const TableOtherColoumHead = styled.div`
    width: 120px;
`

const TableOtherColoum = styled.div`
    display: flex;
    position: relative;
    overflow-x: auto;
`

export default function AttendanceTable({ studentAttendanceList }) {
    console.log(studentAttendanceList);
    return (
        <TableContainer>
            <TableFirstColoum>
                <TableFirstColoumHead>
                    <p>الطالب</p>
                    <p>نسبة الحضور</p>
                </TableFirstColoumHead>
                {studentAttendanceList.map((student, index) => {
                    return (
                        <TableFirstColoumCell key={`TableFirstColoumCell${index}`}>
                            <div className='flex'>
                                <AllIconsComponenet iconName='user' />
                                <p>{student.studentName}</p>
                            </div>
                            <p>{student.attendancePercentage}</p>
                        </TableFirstColoumCell>
                    )
                })}
            </TableFirstColoum>
            <TableOtherColoum>
                {/* {studentAttendanceList.map((student) => {

                })} */}
                {studentAttendanceList[0].attendanceDetails.map((student, index) => {
                    return (
                        <TableOtherColoumHead key={`TableOtherColoumHead${index}`}>
                            <p>{student.date}</p>
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
            </TableOtherColoum>

        </TableContainer>
    )
}
