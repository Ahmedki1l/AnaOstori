import React, { useState } from 'react'
import styles from '../USerFeedbackCard.module.scss'
import Image from 'next/legacy/image';
import * as LinkConst from '../../../../constants/LinkConst'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

//Mi icon
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import useWindowSize from '../../../../hooks/useWindoSize';



export default function ReviewCard(props) {

	const review = props.review
	const reviewMedia = review.ReviewMedia
	const totalPostNumber = reviewMedia.length
	const [currentPost, setCurrentPost] = useState(1)
	const mediaBaseUrl = LinkConst.File_Base_Url2
	const [openVideo, setOpenVideo] = useState(false);
	const windowScreen = useWindowSize().width

	const handleVideoClick = (event) => {
		event.stopPropagation();
	};

	return (
		<div className={styles.userFeedbackCardWrapper}>
			<div className={styles.reviewerImageBox}>
				<div className={styles.pageNODiv}>{currentPost}/{totalPostNumber}</div>
				{currentPost != totalPostNumber &&
					<div className={styles.leftArrowBtn} onClick={() => setCurrentPost(currentPost + 1)}><KeyboardArrowLeftIcon /></div>
				}
				{reviewMedia?.map((media, index) => {
					return (
						<div className={styles.reviewImg} key={`media${index}`}>
							{currentPost == index + 1 &&
								<div className='relative'>
									{media.contentFileMime == "video/mp4" ?
										<>
											<div className='playIconDiv' onClick={() => { setOpenVideo(true) }}>
												<PlayArrowIcon className='playIcon' />
											</div>
											<Image src='/images/anaOstori2.png' alt={'User Feedback'} width={433} height={436} />
											<Dialog open={openVideo} maxWidth="md">
												<DialogContent className='p-0' onClick={handleVideoClick}>
													<CloseIcon className='videoCloseIcon' onClick={() => { setOpenVideo(false) }} />
													<video controls width="100%" height="100%">
														<source src={`${mediaBaseUrl}/${media.contentFileKey}`} type="video/mp4" />
													</video>
												</DialogContent>
											</Dialog>
										</>
										:
										<Image src={`${mediaBaseUrl}/${media.contentFileKey}`} alt={'User Feedback'} width={433} height={436} />
									}
								</div>
							}
						</div>
					)
				})}
				{currentPost != 1 &&
					<div className={styles.rightArrowBtn} onClick={() => setCurrentPost(currentPost - 1)}><KeyboardArrowRightIcon /></div>
				}
			</div>
			<p className={`fontBold ${styles.reviewerName}`}>{review.fullName}</p>
		</div>
	)
}