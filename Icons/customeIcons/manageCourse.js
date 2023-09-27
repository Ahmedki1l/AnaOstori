import React from 'react'

const ManageCourse = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_9_10690)">
                <path opacity="0.3" d="M13.167 25.3335H32.167V6.3335H13.167V25.3335ZM19.5003 8.7085L29.0003 15.8335L19.5003 22.9585V8.7085Z" fill={color} />
                <path d="M6.83366 9.49984H3.66699V31.6665C3.66699 33.4082 5.09199 34.8332 6.83366 34.8332H29.0003V31.6665H6.83366V9.49984ZM32.167 3.1665H13.167C11.4253 3.1665 10.0003 4.5915 10.0003 6.33317V25.3332C10.0003 27.0748 11.4253 28.4998 13.167 28.4998H32.167C33.9087 28.4998 35.3337 27.0748 35.3337 25.3332V6.33317C35.3337 4.5915 33.9087 3.1665 32.167 3.1665ZM32.167 25.3332H13.167V6.33317H32.167V25.3332ZM19.5003 8.70817V22.9582L29.0003 15.8332L19.5003 8.70817Z" fill={color} />
            </g>
            <defs>
                <clipPath id="clip0_9_10690">
                    <rect width="38" height="38" fill="white" transform="translate(0.5)" />
                </clipPath>
            </defs>
        </svg>

    )
}

export default ManageCourse