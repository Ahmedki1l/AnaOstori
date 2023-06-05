import { QRCodeSVG } from 'qrcode.react'
import React from 'react'

const Testqr = () => {
    return (
        <div className='flex justify-center p-8'>
            <QRCodeSVG value="https://anaostori.com/courseId=1234567890abcd" />
        </div>
    )
}

export default Testqr

