import styles from './CourseDates.module.scss'
import ProfilePicture from '../../CommonComponents/ProfilePicture';
import * as LinkConst from '../../../constants/LinkConst'
import Link from 'next/link';
import Icon from '../../CommonComponents/Icon';
import useWindowSize from '../../../hooks/useWindoSize';


//MI icons
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
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
		<div className={`${styles.dateBox} ${date.numberOfSeats == 0 ? `${styles.disableDateBox}` : ''}`}>
			<div className={`fontBold relative ${styles.dateBoxHeader} ${date.numberOfSeats == 0 ? `${styles.disableDateBoxHeader}` : ''}`} onClick={() => props.handleBookSit(date.id, date.gender, date.numberOfSeats)}>
				<p className={`${styles.dateBoxHeaderText} ${date.numberOfSeats == 0 ? `${styles.disableDateBoxHeaderText}` : ''}`}>{startDay} {startDate} {startMonth}</p>
				{date.numberOfSeats < 4 &&
					<div className={`absolute ${styles.restSitsBox} ${date.numberOfSeats == 0 ? `${styles.disableRestSitsBox}` : ''}`}>
						<PersonIcon className={styles.personIcons} />
						<p className='fontMedium'>{date.numberOfSeats == 0 ? 'نفذت المقاعد' : date.numberOfSeats == 1 ? "باقي مقعد" : date.numberOfSeats == 2 ? "باقي مقعدين" : "باقي 3 مقاعد"}</p>
					</div>
				}
			</div>
			<ul className={styles.list}>
				<li>
					<AllIconsComponenet height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'calander'} color={'#000000'} />
					<p className={`fontMedium ${styles.listItemText}`}>من {startDay} {startDate} {startMonth} إلى {endDay} {endDate} {endMonth} </p>
				</li>
				<li>
					<WatchLaterIcon className={styles.icons} />
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
							<LocationOnIcon className={`${styles.icons} ${styles.locationIcons}`} />
							<Link href={date.location ?? ''} target='_blank' className='noUnderlineLink'>
								<p className={`fontMedium ${styles.listItemText}`}>{date.locationName}</p>
							</Link>
						</>
					}
				</li>
				<Link href={coursePlanUrl ?? ""} target='_blank' className='noUnderlineLink'>
					<li>
						<SaveAltIcon className={`text-blue-500 ${styles.icons}`} />
						<p className={`fontMedium ${styles.listItemText}`}>تحميل جدول الدورة</p>
					</li>
				</Link>
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
