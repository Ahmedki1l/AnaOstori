import React from 'react'

const Graduate = ({ width, height, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 7.40389L4.67016 10.284L6.7644 11.5786L12 14.8078L17.2356 11.5786L19.3298 10.284L20.377 9.64396V17.5861H22.4712V8.34937L24 7.40389L12 0L0 7.40389Z" fill={color} />
            <path d="M18.7517 21.79L19.3277 21.3973V13.4697L11.9978 17.9935L4.66797 13.4697L4.66797 21.3973L5.24389 21.79C7.34155 23.2435 9.65365 24.0001 11.9978 24.0001C14.342 24.0001 16.6541 23.2435 18.7517 21.79Z" fill={color} />
        </svg>
    )
}

export default Graduate