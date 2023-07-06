import styles from './CourseDates.module.scss'
import ProfilePicture from '../../CommonComponents/ProfilePicture';
import * as LinkConst from '../../../constants/LinkConst'
import Link from 'next/link';
import useWindowSize from '../../../hooks/useWindoSize';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';


export default function CourseDates(props) {
	const date = props.date
	const mediaBaseUrl = LinkConst.File_Base_Url2
	const startMonth = new Date(date.dateFrom).toLocaleDateString('ar-AE', { timeZone: "UTC", month: 'long' })
	const startDate = new Date(date.dateFrom).toLocaleDateString('en-US', { timeZone: "UTC", day: 'numeric' })
	const startDay = new Date(date.dateFrom).toLocaleDateString('ar-AE', { timeZone: "UTC", weekday: 'long' })

	const endMonth = new Date(date.dateTo).toLocaleDateString('ar-AE', { timeZone: "UTC", month: 'long' })
	const endDate = new Date(date.dateTo).toLocaleDateString('en-US', { timeZone: "UTC", day: 'numeric' })
	const endDay = new Date(date.dateTo).toLocaleDateString('ar-AE', { timeZone: "UTC", weekday: 'long' })

	const startTime = new Date('1970-01-01T' + date.timeFrom + 'Z').toLocaleTimeString('ar-AE', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })
	const endTime = new Date('1970-01-01T' + date.timeTo + 'Z').toLocaleTimeString('ar-AE', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })

	const isSmallScreen = useWindowSize().smallScreen

	const coursePlanUrl = `${mediaBaseUrl}/${date.coursePlanKey}`
	const instructorFileUrl = `${mediaBaseUrl}/${date.instructor.ProfileFileKey}`


	return (
		<div className={`${styles.dateBox} `}>
			{date.numberOfSeats == 0 &&
				<div className={styles.fullSeatsIconWrapper}>
					<AllIconsComponenet height={193} width={193} iconName={'fullSeatsIcon'} color={'#000000'} />
				</div>
			}
			<div className={`fontBold relative ${styles.dateBoxHeader} `} onClick={() => props.handleBookSit(date.id, date.gender, date.numberOfSeats)}>
				<p className={`${styles.dateBoxHeaderText} `}>{startDay} {startDate} {startMonth}</p>
			</div>
			<ul className={styles.list}>
				<li>
					<AllIconsComponenet height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'calenderStroked'} color={'#000000'} />
					<p className={`fontMedium ${styles.listItemText}`}>من {startDay} {startDate} {startMonth} إلى {endDay} {endDate} {endMonth} </p>
				</li>
				<li>
					<AllIconsComponenet height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'clockStroked'} color={'#000000'} />
					<p className={`fontMedium ${styles.listItemText}`}>من {startTime} إلى {endTime}</p>
				</li>
				<li>
					{date.gender == 'mix' ?
						<>
							<AllIconsComponenet height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'live'} color={'#000000'} />
							<p className={`fontMedium link ${styles.listItemText}`}>قاعة افتراضية</p>
						</>
						:
						<>
							<AllIconsComponenet height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'locationStroked'} color={'#000000'} />
							<Link href={date.location ?? ''} target='_blank' className='noUnderlineLink'>
								<p className={`fontMedium ${styles.listItemText}`}>{date.locationName}</p>
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
				<p className={`fontBold ${styles.coachName}`}>المدرب</p>
				<div className='flex items-center'>
					<ProfilePicture height={isSmallScreen ? 20 : 40} width={isSmallScreen ? 20 : 40} alt={'Profile Picture'} pictureKey={`${mediaBaseUrl}/${date.instructor.avatarKey}`} />
					<Link href={instructorFileUrl ?? ''} target='_blank' className='noUnderlineLink'>
						<p className='px-2 fontMedium'>{date.instructor.name}</p>
					</Link>
				</div>
			</div>
		</div>
	)
}
