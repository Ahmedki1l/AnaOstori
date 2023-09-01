import React from 'react'
import { QRCodeSVG } from 'qrcode.react'


export default function QRCode(props) {
    const attendanceKey = props.attendanceKey
    const courseId = props.courseId
    return (
        <>
            {attendanceKey &&
                <div className='flex justify-center p-8'>
                    <QRCodeSVG value={`https://anaostori.com/attendance/mark/${attendanceKey}/${courseId}`} />
                </div>
            }
        </>
    )
}
