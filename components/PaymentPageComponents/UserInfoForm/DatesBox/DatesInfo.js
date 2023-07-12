import styles from '../UserInfoForm.module.scss'
import ProfilePicture from '../../../CommonComponents/ProfilePicture';
import Icon from '../../../CommonComponents/Icon';
import Link from 'next/link';
import * as LinkConst from '../../../../constants/LinkConst'
import useWindowSize from '../../../../hooks/useWindoSize';
import { dateWithDay, timeDuration } from '../../../../constants/DateConverter';
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet';


// MI icons
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import LocationOnIcon from '@mui/icons-material/LocationOn';


export default function DatesInfo(props) {

	const date = props.date

	const mediaBaseUrl = LinkConst.File_Base_Url2
	const isSmallScreen = useWindowSize().smallScreen

	return (
		<>
			<ul className={styles.list}>
				<li>
					<Icon height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'calendarIcon'} alt={'calendar Icon'} />
					<p className={`fontMedium ${styles.listItemText}`}>من {dateWithDay(date.dateFrom)} إلى {dateWithDay(date.dateTo)} </p>
				</li>
				<li>
					<WatchLaterIcon className={styles.icons} />
					<p className={`fontMedium ${styles.listItemText}`}>{timeDuration(date.timeFrom, date.timeTo)}</p>
				</li>
				<li>
					{date.gender == 'mix' ?
						<>
							<Icon height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'liveCourseBlackIcon'} alt={'live Icon'} />
							<p className={`fontMedium link ${styles.listItemText}`}>قاعة افتراضية</p>
						</>
						:
						<>
							<LocationOnIcon className={`${styles.icons} ${styles.locationIcons}`} />
							<Link href={date.location ?? ""} target='_blank'>
								<p className={`fontMedium link ${styles.listItemText}`}>{date.locationName}</p>
							</Link>
						</>
					}
				</li>
				<li>
					<>
						{date.numberOfSeats > 5 ?
							<div className={`${styles.outerCircle} ${styles.green}`}><div className={styles.innerCircle}></div></div>
							: (date.numberOfSeats <= 5 && date.numberOfSeats > 0) ?
								<div className={`${styles.outerCircle} ${styles.redFlash}`}><div className={styles.innerCircle}></div></div>
								:
								<div className={`${styles.outerCircle} ${styles.red}`}><div className={styles.innerCircle}></div></div>
						}
						<p className={`fontMedium ${styles.listItemText}`}>{date.numberOfSeats} مقاعد متبقية</p>
					</>
				</li>
			</ul>
			<div className={styles.bottomDiv}>
				<p className={`fontBold ${styles.coachName}`}>المدربين</p>
				<div className='flex flex-wrap items-center'>
					{date.instructors.map((instructor, index) => {
						return (
							<div className={styles.instructorWrapper} key={`instructor${index}`}>
								<ProfilePicture height={isSmallScreen ? 20 : 40} width={isSmallScreen ? 20 : 40} alt={'Profile Picture'} pictureKey={`${mediaBaseUrl}/${instructor.avatarKey}`} />
								<div>
									<p className='px-2 fontMedium'>{instructor.name}</p>
									<p className='px-2 fontMedium'>Role</p>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</>
	)
}
