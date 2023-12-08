import React, { useEffect, useState } from 'react'
import styles from './CCItemListComponent.module.scss'
import useWindowSize from '../../../../../hooks/useWindoSize';
import AllIconsComponenet from '../../../../../Icons/AllIconsComponenet';
import { secondsToMinutes } from '../../../../../constants/DataManupulation';



export default function CCItemListComponent(props) {

	const item = props?.item
	const itemId = item?.id
	const completedCourseItem = props?.completedCourseItem
	const [isItemComplete, setIsItemComplete] = useState(false)

	useEffect(() => {
		setIsItemComplete(completedCourseItem?.some(item => item.itemId == itemId && item.pass !== false))
	}, [completedCourseItem, itemId])


	const selectNewItemHendler = (itemId) => {
		props.chagenCourseItemHendler(itemId)
	}

	return (
		<>
			{item &&
				<div className={`${styles.ccItemsWrapper} ${props.currentItem == true ? `${styles.activeItem}` : ``}`} onClick={() => selectNewItemHendler(itemId)}>
					{isItemComplete &&
						<div className={styles.circle}>
							<AllIconsComponenet iconName={'checkCircleRoundIcon'} height={10} width={10} color={'#FFFFFF'} />
						</div>
					}
					<div className='ml-5'>
						<AllIconsComponenet height={24} width={24} iconName={`${item?.type == "video" ? 'curriculumNewVideoIcon' : item?.type == "file" ? 'curriculumNewFileIcon' : 'curriculumNewQuizIcon'}`} color={'#F26722'} />
					</div>
					<div>
						<p className={`font-medium ${styles.itemName}`}>{item?.name}</p>
						{item?.type == "video" && <p className={styles.itemDiscription}>{secondsToMinutes(item.duration)} دقائق</p>}
						{item?.type == "quiz" && <p className={styles.itemDiscription}>{item.numberOfQuestions} دقائق</p>}
						{item?.type == "file" && <p className={styles.itemDiscription}>{item.discription} دقائق</p>}
					</div>
				</div>
			}
		</>
	)
}
