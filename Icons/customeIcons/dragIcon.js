import React from 'react'

const DragIcon = ({ height, width, color }) => {
    return (
        <div>
            <svg width={width} height={height} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 15.5V20H16.5L12 24.5L7.5 20H10.5V15.5H13.5ZM10.5 9.5V5H7.5L12 0.5L16.5 5H13.5V9.5H10.5ZM9 14H4.5V17L0 12.5L4.5 8V11H9V14ZM15 11H19.5V8L24 12.5L19.5 17V14H15V11Z" fill={color} />
            </svg>
        </div>
    )
}

export default DragIcon