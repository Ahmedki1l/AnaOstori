import React from 'react'

const StudentOneIcon = ({ height, width, color, strockColor }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 6C17.5 9.02382 15.0241 11.5 12 11.5C8.97585 11.5 6.5 9.02382 6.5 6C6.5 2.97618 8.97585 0.5 12 0.5C15.0241 0.5 17.5 2.97618 17.5 6ZM0.5 21C0.5 20.1911 0.904396 19.4433 1.65444 18.7537C2.40758 18.0612 3.47411 17.463 4.69542 16.9735C7.13894 15.9943 10.0758 15.5 12 15.5C13.9242 15.5 16.8611 15.9943 19.3046 16.9735C20.5259 17.463 21.5924 18.0612 22.3456 18.7537C23.0956 19.4433 23.5 20.1911 23.5 21V23.5H0.5V21Z" fill={color} stroke={strockColor} />
        </svg>
    )
}

export default StudentOneIcon