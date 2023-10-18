import React from 'react'

const NewPersonIcon = ({ height, width, color }) => {
    return (
        <svg width={height} height={width} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_708_10998)">
                <path opacity="0.3" d="M11.9999 10.6C13.1597 10.6 14.0999 9.65979 14.0999 8.49999C14.0999 7.3402 13.1597 6.39999 11.9999 6.39999C10.8401 6.39999 9.8999 7.3402 9.8999 8.49999C9.8999 9.65979 10.8401 10.6 11.9999 10.6Z" fill={color} />
                <path opacity="0.3" d="M11.9999 15.4C9.0299 15.4 5.8999 16.86 5.8999 17.5V18.6H18.0999V17.5C18.0999 16.86 14.9699 15.4 11.9999 15.4Z" fill={color} />
                <path d="M12 13.5C9.33 13.5 4 14.84 4 17.5V20.5H20V17.5C20 14.84 14.67 13.5 12 13.5ZM18.1 18.6H5.9V17.5C5.9 16.86 9.03 15.4 12 15.4C14.97 15.4 18.1 16.86 18.1 17.5V18.6ZM12 12.5C14.21 12.5 16 10.71 16 8.5C16 6.29 14.21 4.5 12 4.5C9.79 4.5 8 6.29 8 8.5C8 10.71 9.79 12.5 12 12.5ZM12 6.4C13.16 6.4 14.1 7.34 14.1 8.5C14.1 9.66 13.16 10.6 12 10.6C10.84 10.6 9.9 9.66 9.9 8.5C9.9 7.34 10.84 6.4 12 6.4Z" fill={color} />
            </g>
            <defs>
                <clipPath id="clip0_708_10998">
                    <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default NewPersonIcon