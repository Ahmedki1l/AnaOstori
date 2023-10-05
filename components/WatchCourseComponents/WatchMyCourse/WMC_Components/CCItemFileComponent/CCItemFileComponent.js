import Link from 'next/link';
import React from 'react'
import styles from './CCItemFileComponent.module.scss'
import AllIconsComponenet from '../../../../../Icons/AllIconsComponenet';
import { mediaUrl } from '../../../../../constants/DataManupulation';

export default function CCItemFileComponent(props) {
	const courseItem = props?.newSelectedCourseItem
	const itemId = courseItem?.id
	const fileDownloadLink = mediaUrl(courseItem.linkBucket, courseItem.linkKey)

	const itemCompleteHendler = () => {
		props.markItemCompleteHendler(itemId)
	}

	return (
		<>
			{fileDownloadLink ?
				<div className={styles.fileContentWrapper}>
					<div className={styles.fileCOntentSubWrapper}>
						<AllIconsComponenet height={97} width={70} iconName={'file'} color={'#F26722'} />
						<div className={styles.downloadFileBtnBox} onClick={() => { itemCompleteHendler() }}>
							<Link href={`${fileDownloadLink}`} target='_blank' className='normalLinkText'>
								<button className='primarySolidBtn'>فتح الملف</button>
							</Link>
						</div>
					</div>
				</div>
				:
				<div className={styles.fileContentWrapper}>
					<div className={styles.fileCOntentSubWrapper}>
						<AllIconsComponenet height={97} width={70} iconName={'file'} color={'#F26722'} />
						<p>File Not Found</p>
						<div className={styles.downloadFileBtnBox} onClick={() => { itemCompleteHendler() }}>
							<button className='primaryStrockedBtn'>فتح الملف</button>
						</div>
					</div>
				</div>
			}
		</>
	)
}
