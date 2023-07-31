import React from 'react'

const RightArrowIcon = ({ height, width, color }) => {

    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 11.25L15.1874 11.25L8.18725 18.2501L10 20L20 10L10 0L8.25018 1.74994L15.1874 8.75L0 8.75V11.25Z" fill={color} />
        </svg>
    )
}

export default RightArrowIcon 
