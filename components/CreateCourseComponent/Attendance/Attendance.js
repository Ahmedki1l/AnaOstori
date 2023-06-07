import React, { useState } from 'react'
import styles from './Attendance.module.scss'
import { generateAttendanceQRAPI } from '../../../services/apisService'
import { Modal } from 'antd'
import QRCode from '../../CommonComponents/QrCode/QRCode'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'

export default function Attendance() {
    const [openQR, setOpenQR] = useState(false)
    const [attendanceKey, setAttendanceKey] = useState('Laqfi23iiFiX246')

    const generateQR = async () => {
        setOpenQR(true)
        // await generateAttendanceQRAPI().then((res) => {
        //     console.log(res);
        // }).catch((error) => {
        //     console.log(error);
        // })
    }

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
                    <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} onClick={handleCancel}></AllIconsComponenet>
                    <p className={`fontBold ${styles.createappointment}`}>إنشاء موعد</p>
                </div>
                <QRCode attendanceKey={attendanceKey} />
            </Modal>
        </div>
    )
}
