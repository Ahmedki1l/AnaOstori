import React, { useState } from 'react'
import CoverImg from '../../../CommonComponents/CoverImg'
import { Modal } from 'antd';
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet'
import styled from 'styled-components';


const StylesModal = styled(Modal)`
    .ant-modal-close{
        display:none;
    }
   .ant-modal-content{
        border-radius: 5px;
        padding: 0px;
		overflow:hidden;
    }
`

const VideoThumnail = (props) => {
	const videoUrl = props.videoUrl
	const pictureUrl = props.pictureUrl
	const thumnailHeight = props.thumnailHeight
	const [openVideo, setOpenVideo] = useState(false);

	const handleClickOpen = () => {
		setOpenVideo(true);
	};

	const handleClose = () => {
		setOpenVideo(false);
	};
	return (
		<div className='relative overflow-hidden w-full'>
			<div className='playIconDiv' onClick={handleClickOpen}>
				<div className='playIcon' >
					<svg width="55" height="35" viewBox="0 0 63 75" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M63 37.5L0.75 74.3061L0.75 0.69392L63 37.5Z" fill="white" />
					</svg>
				</div>
			</div>
			<div className='blurBgForVideo'></div>
			<CoverImg height={thumnailHeight} url={pictureUrl} videoThumnail={true} />
			<StylesModal
				footer={false}
				closeIcon={false}
				open={openVideo}
				width={1200}
				afterClose={handleClose}
			>
				<div className='videoCloseIcon' onClick={handleClose}>
					<AllIconsComponenet iconName={'closeicon'} height={16} width={16} color={'#FFFFFF'} />
				</div>
				<video controls width="100%" height="100%">
					<source src={videoUrl} type="video/mp4" />
				</video>
			</StylesModal>
		</div>
	)
}
export default VideoThumnail