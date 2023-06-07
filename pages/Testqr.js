import { QRCodeSVG } from 'qrcode.react'
import React from 'react'

const Testqr = () => {
    return (
        <div className='flex justify-center p-8'>
            <QRCodeSVG value="https://anaostori.com/Laqfi23iiFiX246" />
        </div>
    )
}

export default Testqr

