import React from 'react'

const GoToNextArrow = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_822_10215)">
                <path opacity="0.3" d="M4.5 8.25003L12.01 9.25003L4.51 6.03003L4.5 8.25003ZM4.51 17.97L12.01 14.75L4.5 15.75L4.51 17.97Z" fill={color} />
                <path d="M2.51 3L2.5 10L17.5 12L2.5 14L2.51 21L23.5 12L2.51 3ZM4.5 8.25V6.03L12.01 9.25L4.5 8.25ZM4.51 17.97V15.75L12.02 14.75L4.51 17.97Z" fill={color} />
            </g>
            <defs>
                <clipPath id="clip0_822_10215">
                    <rect width="24" height="24" fill="white" transform="translate(0.5)" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default GoToNextArrow