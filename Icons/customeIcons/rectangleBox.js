import React from 'react'

const RectangleBox = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="0.25" width="24" height="24" fill={color} />
        </svg>
    )
}

export default RectangleBox