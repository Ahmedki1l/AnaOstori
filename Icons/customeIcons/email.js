import React from 'react'

const Email = ({ height, width, color }) => {
	return (
		// <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		// 	<path d="M0 1.8805V1.33333C0 0.979711 0.105357 0.640573 0.292893 0.390524C0.48043 0.140476 0.734784 0 1 0L15 0C15.2652 0 15.5196 0.140476 15.7071 0.390524C15.8946 0.640573 16 0.979711 16 1.33333V1.8805L8 8.54717L0 1.8805ZM8.265 9.89883C8.18551 9.96498 8.0937 10 8 10C7.9063 10 7.81449 9.96498 7.735 9.89883L0 3.45283V14.6667C0 15.0203 0.105357 15.3594 0.292893 15.6095C0.48043 15.8595 0.734784 16 1 16H15C15.2652 16 15.5196 15.8595 15.7071 15.6095C15.8946 15.3594 16 15.0203 16 14.6667V3.45283L8.265 9.89883Z" fill={color} />
		// </svg>

		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clipPath="url(#clip0_583_1624)">
				<path opacity="0.3" d="M20 8L12 13L4 8V18H20V8ZM20 6H4L12 10.99L20 6Z" fill={color} />
				<path d="M4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20ZM20 6L12 10.99L4 6H20ZM4 8L12 13L20 8V18H4V8Z" fill={color} />
			</g>
			<defs>
				<clipPath id="clip0_583_1624">
					<rect width="24" height="24" fill="white" />
				</clipPath>
			</defs>
		</svg>


	)
}

export default Email