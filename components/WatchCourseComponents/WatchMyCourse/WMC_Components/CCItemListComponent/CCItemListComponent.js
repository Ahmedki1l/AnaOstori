import React, { useEffect, useState } from 'react'
import styles from './CCItemListComponent.module.scss'
import useWindowSize from '../../../../../hooks/useWindoSize';
import AllIconsComponenet from '../../../../../Icons/AllIconsComponenet';



export default function CCItemListComponent(props) {

	const isSmallScreen = useWindowSize().smallScreen
	const item = props?.item
	const itemId = item?.id
	const completedCourseItem = props?.completedCourseItem
	const [videoDuration, setVideoDuration] = useState()
	const [isItemComplete, setIsItemComplete] = useState(false)

	useEffect(() => {
		setIsItemComplete(completedCourseItem?.some(item => item.itemId == itemId))
		setVideoDuration(secondsToMinutes(item.duration))
	}, [completedCourseItem, itemId, item?.duration])

	const secondsToMinutes = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
	}

	const selectNewItemHendler = (itemId) => {
		props.chagenCourseItemHendler(itemId)
	}

	return (
		<>
			{item &&
				<div className={`${styles.ccItemsWrapper} ${props.currentItem == true ? `${styles.activeItem}` : ``}`} onClick={() => selectNewItemHendler(itemId)}>
					{isItemComplete &&
						<div className='m-5'>
							<div className={styles.circle}>
								<AllIconsComponenet iconName={'checkCircleRoundIcon'} height={40} width={35} color={'#FFFFFF'} />
							</div>
						</div>
					}
					<div className={styles.itemIcon}>
						<AllIconsComponenet height={isSmallScreen ? 20 : 14} width={isSmallScreen ? 20 : 14} iconName={`${item?.type == "video" ? 'playButton' : item?.type == "file" ? 'file' : 'quiz'}`} color={'#F26722'} />
					</div>
					<div>
						<p className={`font-medium ${styles.itemName}`}>{item?.name}</p>
						{item?.type == "video" && <p className={styles.itemDiscription}>{videoDuration} دقائق</p>}
						{item?.type == "quiz" && <p className={styles.itemDiscription}>{item.numberOfQuestions} دقائق</p>}
						{item?.type == "file" && <p className={styles.itemDiscription}>{item.discription} دقائق</p>}
					</div>
				</div>
			}
		</>
	)
}
