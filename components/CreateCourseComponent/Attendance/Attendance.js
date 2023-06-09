import React, { useState } from 'react'
import styles from './Attendance.module.scss'
import { generateAttendanceQRAPI } from '../../../services/apisService'
import { Modal } from 'antd'
import QRCode from '../../CommonComponents/QrCode/QRCode'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'

export default function Attendance(props) {
    const [openQR, setOpenQR] = useState(false)
    const [attendanceKey, setAttendanceKey] = useState("iDiy0qDOuD16VzJ")
    const courseId = props.courseId

    const generateQR = async () => {
        setOpenQR(true)
        // await generateAttendanceQRAPI().then((res) => {
        //     console.log(res);
        // }).catch((error) => {
        //     console.log(error);
        // })
    }

    const startMonth = new Date().toLocaleDateString('ar-AE', { timeZone: "UTC", month: 'long' })
    const startDate = new Date().toLocaleDateString('en-US', { timeZone: "UTC", day: 'numeric' })
    const startDay = new Date().toLocaleDateString('ar-AE', { timeZone: "UTC", weekday: 'long' })

    const handleCancel = () => {
        setOpenQR(false);
    }

    return (
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
    )
}
