import React from 'react'

const CopyIcon = ({ height, width, color, className }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M16 12.9V19.1C16 20.6 15.6 21 14.1 21H4.9C3.4 21 3 20.6 3 19.1V9.9C3 8.4 3.4 8 4.9 8H11.1C12.6 8 13 8.4 13 9.9V12.9H16Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M20 12.9V19.1C20 20.6 19.6 21 18.1 21H16V12.9H20Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M20 12.9H16V8H18.1C19.6 8 20 8.4 20 9.9V12.9Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13 8V12.9H16"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default CopyIcon
