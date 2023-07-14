import React from 'react'

const DeleteCourse = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 14 18" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M1 16C1 17.105 1.895 18 3 18H11C12.105 18 13 17.105 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill={color} />
        </svg>
    )
}

export default DeleteCourse