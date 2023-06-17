import React from 'react'

const LateAtATime = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            < circle cx="18" cy="18" r="18" fill="#FFF9E7" />
            <path d="M18 8C12.5 8 8 12.5 8 18C8 23.5 12.5 28 18 28C23.5 28 28 23.5 28 18C28 12.5 23.5 8 18 8ZM18 26C13.59 26 10 22.41 10 18C10 13.59 13.59 10 18 10C22.41 10 26 13.59 26 18C26 22.41 22.41 26 18 26ZM18.5 13H17V19L22.2 22.2L23 20.9L18.5 18.2V13Z" fill="#FFC107" />
        </svg >
    )
}

export default LateAtATime;