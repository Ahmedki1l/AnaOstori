import React from 'react'

const MobileWebDevice = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 2H22V0H4C2.895 0 2 0.895 2 2V13H0V16H14V13H4V2ZM23 4H17C16.45 4 16 4.45 16 5V15C16 15.55 16.45 16 17 16H23C23.55 16 24 15.55 24 15V5C24 4.45 23.55 4 23 4ZM22 13H18V6H22V13Z" fill="black" />
        </svg>
    )
}

export default MobileWebDevice