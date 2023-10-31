import React from 'react'

const NewMaleIcon = ({ width, height, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_950_9945)">
                <path d="M10.5 22V14.5H9V9C9 7.9 9.9 7 11 7H14C15.1 7 16 7.9 16 9V14.5H14.5V22H10.5ZM12.5 6C13.61 6 14.5 5.11 14.5 4C14.5 2.89 13.61 2 12.5 2C11.39 2 10.5 2.89 10.5 4C10.5 5.11 11.39 6 12.5 6Z" fill={color} />
            </g>
            <defs>
                <clipPath id="clip0_950_9945">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default NewMaleIcon