import styles from '../UserInfoForm.module.scss'
import ProfilePicture from '../../../CommonComponents/ProfilePicture';
import Icon from '../../../CommonComponents/Icon';
import Link from 'next/link';
import * as LinkConst from '../../../../constants/LinkConst'
import useWindowSize from '../../../../hooks/useWindoSize';


// MI icons
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SaveAltIcon from '@mui/icons-material/SaveAlt';


export default function DatesInfo(props) {

	const date = props.date

	const mediaBaseUrl = LinkConst.File_Base_Url2
	const isSmallScreen = useWindowSize().smallScreen

	const startMonth = new Date(date.dateFrom).toLocaleDateString('ar-AE', { timeZone: "UTC", month: 'long' })
	const startDate = new Date(date.dateFrom).toLocaleDateString('en-US', { timeZone: "UTC", day: 'numeric' })
	const startDay = new Date(date.dateFrom).toLocaleDateString('ar-AE', { timeZone: "UTC", weekday: 'long' })

	const endMonth = new Date(date.dateTo).toLocaleDateString('ar-AE', { timeZone: "UTC", month: 'long' })
	const endDate = new Date(date.dateTo).toLocaleDateString('en-US', { timeZone: "UTC", day: 'numeric' })
	const endDay = new Date(date.dateTo).toLocaleDateString('ar-AE', { timeZone: "UTC", weekday: 'long' })

	const startTime = new Date('1970-01-01T' + date.timeFrom + 'Z').toLocaleTimeString('ar-AE', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })
	const endTime = new Date('1970-01-01T' + date.timeTo + 'Z').toLocaleTimeString('ar-AE', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })

	return (
		<>
			<ul className={styles.list}>
				<li>
					<Icon height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'calendarIcon'} alt={'calendar Icon'} />
					<p className={`fontMedium ${styles.listItemText}`}>من {startDay} {startDate} {startMonth} إلى {endDay} {endDate} {endMonth} </p>
				</li>
				<li>
					<WatchLaterIcon className={styles.icons} />
					<p className={`fontMedium ${styles.listItemText}`}>من {startTime} إلى {endTime}</p>
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
				<Link href={`${mediaBaseUrl}/${date.coursePlanKey}` ?? ""} target='_blank'>
					<li>
						<SaveAltIcon className={`text-blue-500 ${styles.icons} ${styles.locationIcons}`} />
						<p className={`fontMedium link ${styles.listItemText}`}>تحميل جدول الدورة</p>
					</li>
				</Link>
			</ul>
			<div className={styles.bottomDiv}>
				<p className={`fontBold ${styles.coachName}`}>المدرب</p>
				<div className='flex'>
					<ProfilePicture height={30} width={30} alt={'Profile Picture'} pictureKey={`${mediaBaseUrl}/${date.instructor.avatarKey}`} />
					<Link href={`${mediaBaseUrl}/${date.instructor.ProfileFileKey}` ?? ""} target='_blank'>
						<p className='px-2 link'>{date.instructor.name}</p>
					</Link>
				</div>
			</div>
		</>
	)
}
