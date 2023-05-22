import React from 'react'
import Image from 'next/legacy/image'

export default function Icon(props) {
	const height = props.height
	const width = props.width
	const iconName=props.iconName
	const alt=props.alt
	return (
		<>
			<div>
				<Image src={`/icons/${iconName}.svg`} alt={alt} layout="fill" objectFit="cover"/>
			</div>


			<style jsx>{`
				div {
					height:${height}px;
					width:${width}px;
					position:relative;
					margin:0 3px
				}
			`}</style>
		</>
	)
}
