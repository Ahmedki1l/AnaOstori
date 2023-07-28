import React from 'react'

const MenuIcon = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 22 14" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M21 7L1 7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M21 13L1 13" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M21 1L1 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}

export default MenuIcon