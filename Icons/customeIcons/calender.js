import React from 'react'

const Calender = ({ height, width, color }) => {
	return (
		<svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 15.3C0 16.83 1.17 18 2.7 18H15.3C16.83 18 18 16.83 18 15.3V8.1H0V15.3ZM15.3 1.8H13.5V0.9C13.5 0.36 13.14 0 12.6 0C12.06 0 11.7 0.36 11.7 0.9V1.8H6.3V0.9C6.3 0.36 5.94 0 5.4 0C4.86 0 4.5 0.36 4.5 0.9V1.8H2.7C1.17 1.8 0 2.97 0 4.5V6.3H18V4.5C18 2.97 16.83 1.8 15.3 1.8Z" fill={color} />
		</svg>

	)
}

export default Calender
