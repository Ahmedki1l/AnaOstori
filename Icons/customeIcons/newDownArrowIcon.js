import React from 'react'

const NewDownArrowIcon = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 9L12.5 15L17 9H8Z" fill={color} />
        </svg>
    )
}

export default NewDownArrowIcon