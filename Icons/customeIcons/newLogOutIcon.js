import React from 'react'

const NewLogOutIcon = ({ width, height, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_521_28071)">
                <path d="M5 5H12V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H12V19H5V5ZM21 12L17 8V11H9V13H17V16L21 12Z" fill={color} />
            </g>
            <defs>
                <clipPath id="clip0_521_28071">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default NewLogOutIcon