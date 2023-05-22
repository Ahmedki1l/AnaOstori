import React from 'react'
import Image from 'next/legacy/image'

export default function Logo(props){
	const height = props.height
	const width = props.width
	const logoName=props.logoName
	const alt=props.alt
	return (
		<>
			<div>
				<Image src={`/logos/${logoName}.svg`} alt={alt} layout="fill" objectFit="cover" priority  />
			</div>


			<style jsx>{`
				div {
					height:${height}px;
					width:${width}px;
					position:relative;
				}
			`}</style>
		</>
	)
}