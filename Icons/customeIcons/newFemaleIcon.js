import React from 'react'

const NewFemaleIcon = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_950_9940)">
                <path d="M14.5 16V22H11.5V16H8.5L11.04 8.37C11.31 7.55 12.08 7 12.94 7H13.06C13.92 7 14.68 7.55 14.96 8.37L17.5 16H14.5Z" fill={color} />
                <path d="M15 4C15 5.11 14.11 6 13 6C11.89 6 11 5.11 11 4C11 2.89 11.89 2 13 2C14.11 2 15 2.89 15 4Z" fill={color} />
            </g>
            <defs>
                <clipPath id="clip0_950_9940">
                    <rect width="24" height="24" fill="white" transform="translate(0.5)" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default NewFemaleIcon