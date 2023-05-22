import React from 'react'
import Image from 'next/legacy/image'
// import * as LinkConst from '../../constants/LinkConst'

export default function CoverImg(props)  {

	const height = props.height;
	// const imageBaseUrl = LinkConst.File_Base_Url
	
	return (
		<>
			<div>
				<Image src={props?.url ? props?.url : '/images/anaOstori.png'} alt="Course Cover Image" layout="fill" objectFit="cover" priority/>
			</div>
			<style jsx>{`
				div {
					height:${height}px;
					width:100%;
					position:relative;
				}
			`}</style>
		</>
	)
}
