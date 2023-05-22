import React from 'react'

const Home = ({height, width, color}) => {
  return (
	<svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M0 20V6.66667L10 0L20 6.66667V20H12.5V12.2222H7.5V20H0Z" fill={color}/>
	</svg>
  )
}

export default Home