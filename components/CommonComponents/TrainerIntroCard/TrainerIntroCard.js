import React from 'react'
import styles from './TrainerIntroCard.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import * as LinkConst from '../../../constants/LinkConst'
import ProfilePicture from '../ProfilePicture'
import useWindowSize from '../../../hooks/useWindoSize'

export default function TrainerIntroCard(props) {
	const instructor = props.instructor
	const mediaBaseUrl = LinkConst.File_Base_Url2
	const isSmallScreen = useWindowSize().smallScreen

	return (
		<div className={`flex items-center pl-4 py-4 ${styles.instructoreContainer}`}>
			<div className={styles.instructorPicWrapper}>
				<ProfilePicture height={isSmallScreen ? 50 : 40} width={isSmallScreen ? 50 : 40} alt={'Profile Picture'} pictureKey={`${mediaBaseUrl}/${instructor.avatarKey}`} />
			</div>
			<div className='pr-2'>
				<div className='flex items-center'>
					<h1 className={`fontMedium ${styles.instructorNameText}`}>{instructor?.name}</h1>
					<div className={styles.whatsAppLogoWrapper}>
						<AllIconsComponenet height={12} width={12} iconName={'whatsapp'} color={'#ffffff'} />
					</div>
				</div>
				<p className={styles.instructorBioText}>{instructor?.bio}</p>
			</div>
		</div>
	)
}
