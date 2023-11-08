import React from 'react'

const StarDoubleColoredIcon = ({ width, height, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.3" d="M12.0001 16.9266L7.4881 19.7939L8.6881 14.3876L4.7041 10.7497L9.9601 10.2697L12.0001 5.1792L14.0521 10.2824L19.3081 10.7624L15.3241 14.4003L16.5241 19.8066L12.0001 16.9266Z" fill={color} />
            <path d="M24 9.14526L15.372 8.3621L12 0L8.628 8.37474L0 9.14526L6.552 15.12L4.584 24L12 19.2884L19.416 24L17.46 15.12L24 9.14526ZM12 16.9263L7.488 19.7937L8.688 14.3874L4.704 10.7495L9.96 10.2695L12 5.17895L14.052 10.2821L19.308 10.7621L15.324 14.4L16.524 19.8063L12 16.9263Z" fill={color} />
        </svg>
    )
}

export default StarDoubleColoredIcon