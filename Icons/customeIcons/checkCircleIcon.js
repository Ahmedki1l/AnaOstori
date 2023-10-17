import React from 'react'

const CheckCircleIcon = ({ width, height, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.875C5.51172 1.875 1.875 5.51172 1.875 10C1.875 14.4883 5.51172 18.125 10 18.125C14.4883 18.125 18.125 14.4883 18.125 10C18.125 5.51172 14.4883 1.875 10 1.875ZM8.74609 12.8789C8.65234 12.9727 8.51953 13.0508 8.40234 13.0508C8.28516 13.0508 8.15234 12.9688 8.05469 12.875L5.86719 10.6875L6.5625 9.99219L8.40625 11.8359L13.2812 6.92578L13.9648 7.63281L8.74609 12.8789Z" fill={color} />
        </svg>

    )
}

export default CheckCircleIcon