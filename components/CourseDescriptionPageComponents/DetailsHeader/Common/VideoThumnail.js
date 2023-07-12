import React, { useState } from 'react'
import CoverImg from '../../../CommonComponents/CoverImg'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import * as LinkConst from '../../../../constants/LinkConst'


// MiIcon
import CloseIcon from '@mui/icons-material/Close';

export default function VideoThumnail(props) {
	const pictureKey = props.pictureKey
	const videoUrl = props.videoUrl
	const thumnailHeight = props.thumnailHeight
	const mediaBaseUrl = LinkConst.File_Base_Url2

	const [openVideo, setOpenVideo] = useState(false);

	const coverImgUrl = pictureKey ? `${mediaBaseUrl}/${pictureKey}` : ""


	const handleClickOpen = () => {
		setOpenVideo(true);
	};

	const handleClose = () => {
		setOpenVideo(false);
	};

	const handleVideoClick = (event) => {
		event.stopPropagation();
	};

	return (
		<div className='relative overflow-hidden rounded'>
			<div className='playIconDiv' onClick={handleClickOpen}>
				<PlayArrowIcon className='playIcon' />
			</div>
			<div className='blurBgForVideo'></div>
			<CoverImg height={thumnailHeight} url={coverImgUrl} />
			<Dialog open={openVideo} maxWidth="lg" onClick={handleClose}>
				<DialogContent className='padding0-important' onClick={handleVideoClick}>
					<CloseIcon className='videoCloseIcon' onClick={handleClose} />
					<video controls width="100%" height="100%">
						<source src={videoUrl} type="video/mp4" />
					</video>
				</DialogContent>
			</Dialog>
		</div>
	)
}
