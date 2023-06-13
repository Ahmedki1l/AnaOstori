import React from 'react'
import styles from '../Appointment.module.scss'


export default function AttendanceTableHead(attendanceDate) {


    return (
        <th className={styles.tableHead2}> {attendanceDate}</th>
    )
}
