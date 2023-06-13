import React from 'react'

const PresentAtTime = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="18" fill="#EAF8EC" />
            <path d="M15.1105 27.4388C14.8789 27.7449 14.5509 28 14.2615 28C13.972 28 13.644 27.7321 13.4028 27.426L8 20.2832L9.71732 18.0128L14.2711 24.0332L26.3116 8L28 10.3087L15.1105 27.4388Z" fill="#2BB741" />
        </svg>
    )
}

export default PresentAtTime;