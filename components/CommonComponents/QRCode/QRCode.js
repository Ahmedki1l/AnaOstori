import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import styles from "./QRCode.module.scss"
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { dateWithDay } from '../../../constants/DateConverter'
import { Modal } from 'antd'


export default function QRCode(props) {
    console.log(props);
    const attendanceKey = props.attendanceKey
    const courseId = props.courseId
    const availabilityId = props.availabilityId
    // const qrUrl = `https://anaostori.com/attendance/mark/${attendanceKey}/${courseId}`
    const qrUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/attendance/mark?attendanceKey=${attendanceKey}&courseId=${courseId}&availabilityId=${availabilityId}`
    console.log(qrUrl);

    return (
        <>
            {(attendanceKey && qrUrl) &&
                <Modal
                    className='addAppoinmentModal'
                    open={props.openQR}
                    closeIcon={false}
                    footer={[]}
                    onCancel={props.handleCancel}
                >
                    <div className={styles.modalHeader}>
                        <div className={styles.closeIcon} onClick={props.handleCancel}>
                            <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} ></AllIconsComponenet>
                        </div>
                        <p className={`fontBold ${styles.createappointment}`}>{dateWithDay(new Date())}</p>
                    </div>
                    <div className='flex justify-center p-8'>
                        <QRCodeSVG value={qrUrl} />
                    </div>
                </Modal>
            }
        </>
    )
}
