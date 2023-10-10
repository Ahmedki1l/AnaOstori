import React from 'react'

const LocationDoubleColor = ({ width, height, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_85_5343)">
                <path opacity="0.3" d="M6 2.5C4.62 2.5 3.5 3.62 3.5 5C3.5 6.425 4.96 8.605 6 9.94C7.055 8.595 8.5 6.44 8.5 5C8.5 3.62 7.38 2.5 6 2.5ZM6 6.25C5.31 6.25 4.75 5.69 4.75 5C4.75 4.31 5.31 3.75 6 3.75C6.69 3.75 7.25 4.31 7.25 5C7.25 5.69 6.69 6.25 6 6.25Z" fill={color} />
                <path d="M6 1.5C4.065 1.5 2.5 3.065 2.5 5C2.5 7.625 6 11.5 6 11.5C6 11.5 9.5 7.625 9.5 5C9.5 3.065 7.935 1.5 6 1.5ZM3.5 5C3.5 3.62 4.62 2.5 6 2.5C7.38 2.5 8.5 3.62 8.5 5C8.5 6.44 7.06 8.595 6 9.94C4.96 8.605 3.5 6.425 3.5 5Z" fill={color} />
                <path d="M6 6.25C6.69036 6.25 7.25 5.69036 7.25 5C7.25 4.30964 6.69036 3.75 6 3.75C5.30964 3.75 4.75 4.30964 4.75 5C4.75 5.69036 5.30964 6.25 6 6.25Z" fill={color} />
            </g>
            <defs>
                <clipPath id="clip0_85_5343">
                    <rect width={width} height={height} fill="white" transform="translate(0 0.5)" />
                </clipPath>
            </defs>
        </svg>

    )
}

export default LocationDoubleColor