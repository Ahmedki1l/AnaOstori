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
            <AttendanceTable />
        </div>
    )
}