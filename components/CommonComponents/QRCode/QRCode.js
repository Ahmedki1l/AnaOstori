import React from 'react'
import { QRCodeSVG } from 'qrcode.react'


export default function QRCode(props) {
    const attendanceKey = props.attendanceKey
    const courseId = props.courseId
    const qrUrl = `https://anaostori.com/attendance/mark/${attendanceKey}/${courseId}`
    return (
        <>
            {attendanceKey &&
                <div className='flex justify-center p-8'>
                    <QRCodeSVG value={qrUrl} />
                </div>
            }
        </>
    )
}
