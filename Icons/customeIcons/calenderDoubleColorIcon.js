import React from 'react'

const CalenderDoubleColorIcon = ({ height, width, color }) => {
    return (
        <div>
            <svg width={width} height={height} viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_86_11449)">
                    <path d="M10 2H9.5V1H8.5V2H3.5V1H2.5V2H2C1.45 2 1 2.45 1 3V11C1 11.55 1.45 12 2 12H10C10.55 12 11 11.55 11 11V3C11 2.45 10.55 2 10 2ZM10 3V4.5H2V3H10ZM2 11V5.5H10V11H2Z" fill={color} />
                    <path opacity="0.3" d="M2 3.00488H10V4.49988H2V3.00488Z" fill="black" />
                </g>
                <defs>
                    <clipPath id="clip0_86_11449">
                        <rect width="12" height="12" fill="white" transform="translate(0 0.5)" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    )
}

export default CalenderDoubleColorIcon