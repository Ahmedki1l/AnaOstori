import React, { useState } from 'react'
import CoverImg from '../../../CommonComponents/CoverImg'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import * as LinkConst from '../../../../constants/LinkConst'
import useWindowSize from '../../../../hooks/useWindoSize';


// MiIcon
import CloseIcon from '@mui/icons-material/Close';

export default function VideoThumnail(props) {
	const pictureKey = props.pictureKey
	const videoKey = props.videoKey
	const thumnailHeight=props.thumnailHeight
	const mediaBaseUrl = LinkConst.File_Base_Url
	const windowScreen = useWindowSize().width

	const [openVideo, setOpenVideo] = useState(false);

	const imageBaseUrl = LinkConst.File_Base_Url

	const  coverImgUrl = pictureKey ? `${imageBaseUrl}/${pictureKey}` : ""


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
	<div className= 'relative overflow-hidden rounded'>
		<div className='playIconDiv' onClick={handleClickOpen}>
			<PlayArrowIcon className='playIcon'/>
		</div>
		<div className='blurBgForVideo'></div>
		<CoverImg height={thumnailHeight} url={coverImgUrl}/>
		<Dialog open={openVideo} maxWidth="lg" onClick={handleClose}>
			<DialogContent className='padding0-important' onClick={handleVideoClick}>
				<CloseIcon className='videoCloseIcon' onClick={handleClose}/>
				<video controls width="100%" height="100%">
					<source src={`${mediaBaseUrl}/${videoKey}`} type="video/mp4" />
				</video>
			</DialogContent>
		</Dialog>
	</div>
  )
}
