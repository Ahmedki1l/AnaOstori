import styles from '../UserInfoForm.module.scss'
import ProfilePicture from '../../../CommonComponents/ProfilePicture';
import Icon from '../../../CommonComponents/Icon';
import Link from 'next/link';
import useWindowSize from '../../../../hooks/useWindoSize';
import { dateWithDay, timeDuration } from '../../../../constants/DateConverter';
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet';
import Image from 'next/legacy/image';
import { mediaUrl } from '../../../../constants/DataManupulation';



export default function DatesInfo(props) {

	const date = props.date

	const isSmallScreen = useWindowSize().smallScreen

	const noOfSeatRemainingText = date.numberOfSeats == 0 ? "جميع المقاعد محجوزة"
		: date.numberOfSeats == 1 ? "مقعد واحد متبقي"
			: date.numberOfSeats == 2 ? "مقعدين متبقيين"
				: date.numberOfSeats > 3 && date.numberOfSeats < 10 ? `${date.numberOfSeats} مقاعد متبقية`
					: `${date.numberOfSeats} مقعد متبقي`
	return (
		<>
			<ul className={styles.list}>
				<li>
					<Icon height={isSmallScreen ? 19 : 22} width={isSmallScreen ? 19 : 22} iconName={'calendarIcon'} alt={'calendar Icon'} />
					<p className={`fontMedium ${styles.listItemText}`}>من {dateWithDay(date.dateFrom)} إلى {dateWithDay(date.dateTo)} </p>
				</li>
				<li>
					<AllIconsComponenet height={24} width={28} iconName={'clock'} color={'#000000'} />
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
							<AllIconsComponenet height={24} width={28} iconName={'location'} color={'#000000'} />
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
							:
							<div className={styles.alretWrapper}>
								<Image src={`/images/alert-blink.gif`} alt={'alert gif'} layout="fill" objectFit="cover" />
							</div>
						}
						<p className={`fontMedium ${styles.listItemText}`}>{noOfSeatRemainingText}</p>
					</>
				</li>
			</ul>
			<div className={styles.bottomDiv}>
				<p className={`fontBold ${styles.coachName}`}>المدربين</p>
				<div className='flex flex-wrap items-center'>
					{date.instructors.map((instructor, index) => {
						return (
							<div className={styles.instructorWrapper} key={`instructor${index}`}>
								<ProfilePicture height={isSmallScreen ? 20 : 40} width={isSmallScreen ? 20 : 40} alt={'Profile Picture'} pictureKey={mediaUrl(instructor.avatarBucket, instructor.avatarKey)} />
								<div>
									{instructor?.ProfileFileKey == null ?
										<p className='px-2 fontMedium'>{instructor.name}</p>
										:
										<Link href={mediaUrl(instructor.avatarBucket, instructor.avatarKey)} className='px-2 fontMedium link'>{instructor.name}</Link>
									}
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
