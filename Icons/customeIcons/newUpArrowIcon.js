import React from 'react'

const NewUpArrowIcon = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 15L11.5 9L7 15L16 15Z" fill={color} />
        </svg>
    )
}

export default NewUpArrowIcon