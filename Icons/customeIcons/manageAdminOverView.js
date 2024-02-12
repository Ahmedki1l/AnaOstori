import React from 'react'

const manageAdminOverView = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_859_1458)">
                <g opacity="0.3">
                    <path d="M16.3334 7.91699H22.6667V30.0837H16.3334V7.91699ZM6.83337 17.417H13.1667V30.0837H6.83337V17.417ZM32.1667 30.0837H25.8334V20.5837H32.1667V30.0837Z" fill={color} />
                </g>
                <path d="M25.8333 17.4167V4.75H13.1666V14.25H3.66663V33.25H35.3333V17.4167H25.8333ZM16.3333 7.91667H22.6666V30.0833H16.3333V7.91667ZM6.83329 17.4167H13.1666V30.0833H6.83329V17.4167ZM32.1666 30.0833H25.8333V20.5833H32.1666V30.0833Z" fill={color} />
            </g>
            <defs>
                <clipPath id="clip0_859_1458">
                    <rect width="38" height="38" fill="white" transform="translate(0.5)" />
                </clipPath>
            </defs>
        </svg>

    )
}

export default manageAdminOverView