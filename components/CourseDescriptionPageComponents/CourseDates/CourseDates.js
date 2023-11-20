import styles from './CourseDates.module.scss'
import ProfilePicture from '../../CommonComponents/ProfilePicture';
import Link from 'next/link';
import useWindowSize from '../../../hooks/useWindoSize';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { dateWithDay, enDateWithDay, enTimeDuration, timeDuration } from '../../../constants/DateConverter';
import Image from 'next/legacy/image';
import { mediaUrl } from '../../../constants/DataManupulation';


export default function CourseDates(props) {
	const date = props.date
	const lang = props.lang
	const isSmallScreen = useWindowSize().smallScreen


	const noOfSeatRemainingText = date.numberOfSeats == 0 ? "جميع المقاعد محجوزة"
		: date.numberOfSeats == 1 ? "مقعد واحد متبقي"
			: date.numberOfSeats == 2 ? "مقعدين متبقيين"
				: date.numberOfSeats > 3 && date.numberOfSeats < 10 ? `${date.numberOfSeats} مقاعد متبقية`
					: `${date.numberOfSeats} مقعد متبقي`

	return (
		<div className={lang == 'en' ? `${styles.englishDateBox}` : `${styles.arDateBox}`}>
			<div className={`${styles.dateBox}`}>
				{date.numberOfSeats == 0 &&
					<div className={styles.fullSeatsIconWrapper}>
						<AllIconsComponenet height={193} width={193} iconName={'fullSeatsIcon'} color={'#000000'} />
					</div>
				}
				{/* <div className={`fontMedium relative ${styles.dateBoxHeader} `} onClick={() => props.handleBookSit(date.id, date.gender, date.numberOfSeats)}>
					{lang == 'en' ?
						<p className={`fontMedium ${styles.dateBoxHeaderText}`}>{enDateWithDay(date?.dateFrom)}</p>
						:
						<p className={`fontMedium ${styles.dateBoxHeaderText} `}>{dateWithDay(date?.dateFrom)}</p>
					}
				</div> */}
				<div className={`fontMedium relative ${styles.dateBoxHeader} `} onClick={() => props.handleBookSit(date.id, date.gender, date.numberOfSeats)}>
					{/* <p className={`fontMedium ${styles.dateBoxHeaderText} `}>{date?.name ? date?.name : dateWithDay(date?.dateFrom)}</p> */}
					<p className={`fontMedium ${styles.dateBoxHeaderText} `}>{date?.course.type == 'physical' && date?.name ? date.name : dateWithDay(date?.dateFrom)}</p>
				</div>
				<ul className={styles.list}>
					<li>
						<AllIconsComponenet height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'calenderDoubleColorIcon'} color={'#000000'} />
						{lang == 'en' ?
							<p className={` ${styles.listItemText}`}>From {enDateWithDay(date?.dateFrom)}  To  &nbsp;{enDateWithDay(date?.dateTo)} </p>
							:
							<p className={` ${styles.listItemText}`}>من {dateWithDay(date?.dateFrom)} &nbsp; إلى  {dateWithDay(date?.dateTo)} </p>
						}
					</li>
					<li>
						<AllIconsComponenet height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'calenderDoubleColorIcon'} color={'#000000'} />
						<p className={` ${styles.listItemText}`}>{date.description}</p>
					</li>
					<li>
						<AllIconsComponenet height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'clockDoubleColor'} color={'#000000'} />
						{lang == 'en' ?
							<p className={` ${styles.listItemText}`}>{enTimeDuration(date.timeFrom, date.timeTo)}</p>
							:
							<p className={` ${styles.listItemText}`}> من {timeDuration(date.timeFrom, date.timeTo)}</p>
						}
					</li>
					<li>
						{date.gender == 'mix' ?
							<>
								<AllIconsComponenet height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'onlineDoubleColorIcon'} color={'#000000'} />
								<p className={` link ${styles.listItemText}`}>{lang == 'en' ? 'Virtual Classroom' : `قاعة افتراضية`}</p>
							</>
							:
							<>
								<AllIconsComponenet height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'locationDoubleColor'} color={'#000000'} />
								{date.location ?
									<Link href={date.location ?? ''} target='_blank' className='noUnderlineLink'>
										<p className={`fontMedium ${styles.listItemText}`}>{date.locationName}</p>
									</Link>
									:
									<p className={`fontMedium ${styles.listItemText}`}>{date.locationName}</p>
								}
							</>
						}
					</li>
					<li>
						<>
							{date.numberOfSeats > 5 ?
								<div className={`${styles.outerCircle} ${styles.green}`}><div className={styles.innerCircle}></div></div>
								:
								<div className={styles.alretWrapper}>
									<Image src={`/images/alert-blink.gif`} alt={'alert gif'} layout="fill" objectFit="cover" />
								</div>
							}
							<p className={`pt-1 ${styles.listItemText}`}>{noOfSeatRemainingText}</p>
						</>
					</li>
				</ul>
				<div className={styles.bottomDiv}>
					<p className={`fontMedium ${styles.coachName}`}>المدربين</p>
					<div className={styles.instructorWrapper}>
						{date.instructors.map((instructor, index) => {
							return (
								<div className='flex items-center' key={`instructor${index}`}>
									<ProfilePicture height={isSmallScreen ? 36 : 40} width={isSmallScreen ? 36 : 40} alt={'Profile Picture'} pictureKey={(instructor.avatarBucket && instructor.avatarKey) ? mediaUrl(instructor.avatarBucket, instructor.avatarKey) : '/images/anaOstori2.png'} />
									<div>
										{instructor?.ProfileFileKey == null ?
											<p className={`px-2  ${styles.instructorName}`}>{instructor.name}</p>
											:
											<Link href={mediaUrl(instructor?.ProfileFileBucket, instructor?.ProfileFileKey)} className={`px-2  link ${styles.instructorName}`}>{instructor.name}</Link>
										}
										<p className={`px-2  ${styles.instructorRoleText}`}>{instructor.role}</p>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div >
	)
}
