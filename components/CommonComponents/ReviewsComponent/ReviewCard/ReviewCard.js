import React, { useState } from 'react'
import styles from '../USerFeedbackCard.module.scss'
import Image from 'next/legacy/image';
import * as LinkConst from '../../../../constants/LinkConst'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Modal } from 'antd';
import styled from 'styled-components';
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet';
import useWindowSize from '../../../../hooks/useWindoSize';



const StylesModal = styled(Modal)`
    .ant-modal-close{
        display:none;
    }
    .ant-modal-body {
        direction:rtl
    }
    .ant-modal-content{
        width:360px;
        border-radius: 5px;
        padding: 1.5rem;
		overflow:hidden;
    }
`

export default function ReviewCard(props) {

	const review = props.review
	const reviewMedia = review.ReviewMedia
	const totalPostNumber = reviewMedia.length
	const [currentPost, setCurrentPost] = useState(1)
	const mediaBaseUrl = LinkConst.File_Base_Url2
	const [openVideo, setOpenVideo] = useState(false);
	const windowScreen = useWindowSize().width


	const handleClose = (event) => {
		// event.stopPropagation();
	};

	return (
		<div className={styles.userFeedbackCardWrapper}>
			<div className={styles.reviewerImageBox}>
				<div className={styles.pageNODiv}>{currentPost}/{totalPostNumber}</div>
				{currentPost != totalPostNumber &&
					<div className={styles.leftArrowBtn} onClick={() => setCurrentPost(currentPost + 1)}>
						<div className='m-1.5'>
							<AllIconsComponenet iconName={'arrowLeft'} height={12} width={12} color={'#FFFFFF'} />
						</div>
					</div>
				}
				{reviewMedia?.map((media, index) => {
					return (
						<div className={styles.reviewImg} key={`media${index}`}>
							{currentPost == index + 1 &&
								<div className='relative'>
									{media.contentFileMime == "video/mp4" ?
										<>
											<div className='playIconDiv' onClick={() => { setOpenVideo(true) }}>
												{/* <PlayArrowIcon className='playIcon' /> */}
											</div>
											<Image src='/images/anaOstori2.png' alt={'User Feedback'} width={433} height={436} />
											{/* <Dialog open={openVideo} maxWidth="md">
												<DialogContent className='p-0' onClick={handleVideoClick}>
													<CloseIcon className='videoCloseIcon' onClick={() => { setOpenVideo(false) }} />
													<video controls width="100%" height="100%">
														<source src={`${mediaBaseUrl}/${media.contentFileKey}`} type="video/mp4" />
													</video>
												</DialogContent>
											</Dialog> */}
											<StylesModal
												closeIcon={false}
												footer={false}
												open={open}
												onClose={handleClose}
												centered
											>
												<div className='videoCloseIcon' onClick={handleClose}>
													<AllIconsComponenet iconName={'closeicon'} height={16} width={16} color={'#FFFFFF'} />
												</div>
												<video controls width="100%" height="100%">
													<source src={`${mediaBaseUrl}/${media.contentFileKey}`} type="video/mp4" />
												</video>
											</StylesModal>
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
					<div className={styles.rightArrowBtn} onClick={() => setCurrentPost(currentPost - 1)}>
						<div className='m-1.5'>
							<AllIconsComponenet iconName={'arrowRight'} height={12} width={12} color={'#FFFFFF'} />
						</div>
					</div>
				}
			</div>
			<p className={`fontBold ${styles.reviewerName}`}>{review.fullName}</p>
		</div>
	)
}