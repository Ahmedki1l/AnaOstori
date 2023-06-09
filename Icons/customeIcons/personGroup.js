import React from 'react'

const PersoneGroup = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 9C11.4752 9 13.5 6.97495 13.5 4.5C13.5 2.02505 11.4752 0 9 0C6.52477 0 4.5 2.02505 4.5 4.5C4.5 6.97495 6.52477 9 9 9ZM9 11.25C6.01884 11.25 0 12.7688 0 15.75V18H18V15.75C18 12.7688 11.9812 11.25 9 11.25Z" fill="#000000" />
            <path d="M15 9C17.4752 9 19.5 6.97495 19.5 4.5C19.5 2.02505 17.4752 0 15 0C12.5248 0 10.5 2.02505 10.5 4.5C10.5 6.97495 12.5248 9 15 9ZM15 11.25C12.0188 11.25 6 12.7688 6 15.75V18H24V15.75C24 12.7688 17.9812 11.25 15 11.25Z" fill="#F26722" />
        </svg>

    )
}

export default PersoneGroup