import Image from 'next/legacy/image'
import defaultProfile from '../../public/images/profile.png'


export default function ProfilePicture(props) {
	const height = props.height
	const width = props.width
	const alt=props.alt
	
  return (
	<div className='drop-shadow'>
		<Image className='rounded-full' src={props.pictureKey && !props.pictureKey.includes("null") ? `${props.pictureKey}` : defaultProfile} alt={alt} height={height} width={width} />
	</div>
  )
}
