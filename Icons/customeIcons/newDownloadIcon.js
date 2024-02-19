import React from 'react'

const NewDownloadIcon = ({ width, height, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2950_659)">
                <path opacity="0.3" d="M13.2501 9.5V5.5H11.2501V11.5H10.0801L12.2501 13.67L14.4201 11.5H13.2501V9.5Z" fill={color} />
                <path d="M15.25 9.5V3.5H9.25V9.5H5.25L12.25 16.5L19.25 9.5H15.25ZM12.25 13.67L10.08 11.5H11.25V5.5H13.25V11.5H14.42L12.25 13.67ZM5.25 18.5H19.25V20.5H5.25V18.5Z" fill={color} />
            </g>
            <defs>
                <clipPath id="clip0_2950_659">
                    <rect width="24" height="24" fill="white" transform="translate(0.25 0.5)" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default NewDownloadIcon