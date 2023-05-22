import React from 'react'

const Persone1 = ({ height, width, color }) => {
	return (
		<svg width={width} height={height} viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M7 8C8.92518 8 10.5 6.19996 10.5 4C10.5 1.80004 8.92518 0 7 0C5.07482 0 3.5 1.80004 3.5 4C3.5 6.19996 5.07482 8 7 8ZM7 10C4.68132 10 0 11.3501 0 14V16H14V14C14 11.3501 9.31868 10 7 10Z" fill={color} />
		</svg>
	)
}

export default Persone1