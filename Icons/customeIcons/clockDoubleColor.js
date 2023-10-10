import React from 'react'

const ClockDoubleColor = ({ width, height, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_85_5331)">
                <path opacity="0.3" d="M6 2.5C3.79 2.5 2 4.29 2 6.5C2 8.71 3.79 10.5 6 10.5C8.21 10.5 10 8.71 10 6.5C10 4.29 8.21 2.5 6 2.5ZM8.125 8.575L5.5 7V4H6.25V6.625L8.5 7.96L8.125 8.575Z" fill={color} />
                <path d="M5.995 1.5C3.235 1.5 1 3.74 1 6.5C1 9.26 3.235 11.5 5.995 11.5C8.76 11.5 11 9.26 11 6.5C11 3.74 8.76 1.5 5.995 1.5ZM6 10.5C3.79 10.5 2 8.71 2 6.5C2 4.29 3.79 2.5 6 2.5C8.21 2.5 10 4.29 10 6.5C10 8.71 8.21 10.5 6 10.5ZM6.25 4H5.5V7L8.125 8.575L8.5 7.96L6.25 6.625V4Z" fill={color} />
            </g>
            <defs>
                <clipPath id="clip0_85_5331">
                    <rect width={width} height={height} fill="white" transform="translate(0 0.5)" />
                </clipPath>
            </defs>
        </svg>

    )
}

export default ClockDoubleColor