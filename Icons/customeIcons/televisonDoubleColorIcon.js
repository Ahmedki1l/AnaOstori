import React from 'react'

const TelevisonDoubleColorIcon = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_83_1987)">
                <path opacity="0.3" d="M6.25 41.6667H43.75V16.6667H6.25V41.6667ZM18.75 20.8333L33.3333 29.1667L18.75 37.5V20.8333Z" fill="black" />
                <path d="M18.75 20.8333V37.5L33.3333 29.1667L18.75 20.8333ZM43.75 12.5H27.9583L34.8125 5.64584L33.3333 4.16667L25 12.5H24.9375L16.6042 4.16667L15.1667 5.64584L22 12.5H6.25001C3.95834 12.5 2.08334 14.375 2.08334 16.6667V41.6667C2.08334 43.9583 3.95834 45.8333 6.25001 45.8333H43.75C46.0417 45.8333 47.9167 43.9583 47.9167 41.6667V16.6667C47.9167 14.375 46.0417 12.5 43.75 12.5ZM43.75 41.6667H6.25001V16.6667H43.75V41.6667Z" fill={color} />
            </g>
            <defs>
                <clipPath id="clip0_83_1987">
                    <rect width="50" height="50" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default TelevisonDoubleColorIcon