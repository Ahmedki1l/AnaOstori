import React from 'react'

const Clock = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 0C4.275 0 0 4.275 0 9.5C0 14.725 4.275 19 9.5 19C14.725 19 19 14.725 19 9.5C19 4.275 14.725 0 9.5 0ZM12.35 10.45H9.5C8.93 10.45 8.55 10.07 8.55 9.5V4.75C8.55 4.18 8.93 3.8 9.5 3.8C10.07 3.8 10.45 4.18 10.45 4.75V8.55H12.35C12.92 8.55 13.3 8.93 13.3 9.5C13.3 10.07 12.92 10.45 12.35 10.45Z" fill={color} />
        </svg>
    )
}

export default Clock