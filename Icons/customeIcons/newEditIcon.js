import React from 'react'

const NewEditIcon = ({ height, width, color }) => {
    return (
        <div>
            <svg width={width} height={height} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_9_10987)">
                    <path opacity="0.3" d="M5 18.58V19.5H5.92L14.98 10.44L14.06 9.52002L5 18.58Z" fill={color} />
                    <path d="M20.71 7.54C21.1 7.15 21.1 6.52 20.71 6.13L18.37 3.79C18.17 3.59 17.92 3.5 17.66 3.5C17.4 3.5 17.15 3.6 16.96 3.79L15.13 5.62L18.88 9.37L20.71 7.54ZM3 17.75V21.5H6.75L17.81 10.44L14.06 6.69L3 17.75ZM5.92 19.5H5V18.58L14.06 9.52L14.98 10.44L5.92 19.5Z" fill={color} />
                </g>
                <defs>
                    <clipPath id="clip0_9_10987">
                        <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
                    </clipPath>
                </defs>
            </svg>
        </div >
    )
}

export default NewEditIcon