import React from 'react'
import Image from 'next/legacy/image'
import styled from 'styled-components'

const ImageWrapper = styled('div')`
	width:100%; 
	height: ${props => (props.height)}px !important; 
	position:relative;
	border:0.7px solid #00000054;
`

export default function CoverImg(props) {
	const height = props.height;

	return (
		<>
			<ImageWrapper height={height}>
				<Image src={props?.url ? props?.url : props.videoThumnail == true ? '/images/anaOstori.png' : '/images/placeHolder.png'} alt="Course Cover Image" layout="fill" objectFit="cover" priority />
			</ImageWrapper>
		</>
	)
}
