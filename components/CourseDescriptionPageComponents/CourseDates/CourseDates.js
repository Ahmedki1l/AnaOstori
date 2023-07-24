import styles from './CourseDates.module.scss'
import ProfilePicture from '../../CommonComponents/ProfilePicture';
import * as LinkConst from '../../../constants/LinkConst'
import Link from 'next/link';
import useWindowSize from '../../../hooks/useWindoSize';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { dateWithDay, enDateWithDay, enTimeDuration, timeDuration } from '../../../constants/DateConverter';


export default function CourseDates(props) {
	const date = props.date
	const mediaBaseUrl = LinkConst.File_Base_Url2
	const lang = props.lang
	console.log(lang);
	const isSmallScreen = useWindowSize().smallScreen

	const coursePlanUrl = `${mediaBaseUrl}/${date.coursePlanKey}`


	return (
		<div className={`${styles.dateBox} `}>
			{date.numberOfSeats == 0 &&
				<div className={styles.fullSeatsIconWrapper}>
					<AllIconsComponenet height={193} width={193} iconName={'fullSeatsIcon'} color={'#000000'} />
				</div>
			}
			<div className={`fontBold relative ${styles.dateBoxHeader} `} onClick={() => props.handleBookSit(date.id, date.gender, date.numberOfSeats)}>

				{lang == 'en' ?
					<p className={`fontBold ${styles.dateBoxHeaderText}`}>{enDateWithDay(date?.dateFrom)}</p>
					:
					<p className={`fontBold ${styles.dateBoxHeaderText} `}>{dateWithDay(date?.dateFrom)}</p>
				}
			</div>
			<ul className={styles.list}>
				<li>
					<AllIconsComponenet height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'calenderStroked'} color={'#000000'} />
					{lang == 'en' ?
						<p className={`fontMedium ${styles.listItemText}`}>{enDateWithDay(date?.dateFrom)} - {enDateWithDay(date?.dateTo)} </p>
						:
						<p className={`fontMedium ${styles.listItemText}`}> {dateWithDay(date?.dateFrom)} - {dateWithDay(date?.dateTo)} </p>
					}
				</li>
				<li>
					<AllIconsComponenet height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'clockStroked'} color={'#000000'} />
					{lang == 'en' ?
						<p className={`fontMedium ${styles.listItemText}`}>{enTimeDuration(date.timeFrom, date.timeTo)}</p>
						:
						<p className={`fontMedium ${styles.listItemText}`}> {timeDuration(date.timeFrom, date.timeTo)}</p>
					}
				</li>
				<li>
					{date.gender == 'mix' ?
						<>
							<AllIconsComponenet height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'live'} color={'#000000'} />
							<p className={`fontMedium link ${styles.listItemText}`}>{lang == 'en' ? 'Virtual Classroom' : `قاعة افتراضية`}</p>
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
				<p className={`fontBold ${styles.coachName}`}>المدربين</p>
				<div className='flex flex-wrap'>
					{date.instructors.map((instructor, index) => {
						return (
							<div className={styles.instructorWrapper} key={`instructor${index}`}>
								<ProfilePicture height={isSmallScreen ? 20 : 40} width={isSmallScreen ? 20 : 40} alt={'Profile Picture'} pictureKey={`${mediaBaseUrl}/${instructor.avatarKey}`} />
								<div>
									{instructor?.ProfileFileKey == null ?
										<p className='px-2 fontMedium'>{instructor.name}</p>
										:
										<Link href={`${mediaBaseUrl}/${instructor?.ProfileFileKey}`} className='px-2 fontMedium link'>{instructor.name}</Link>
									}
									<p className='px-2 fontMedium'>Role</p>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
