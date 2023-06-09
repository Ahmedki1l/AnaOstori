import React from 'react'

const ProgressIcon = ({ height, width, color }) => {

    return (
        <svg width={width} height={height} viewBox="0 0 187 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="187" height="14" rx="7" fill={color} fill-opacity="0.3" />
        </svg>
    )
}

export default ProgressIcon;