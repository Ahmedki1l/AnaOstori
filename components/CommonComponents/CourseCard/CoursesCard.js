import styles from './CoursesCard.module.scss'
import Link from 'next/link';
import CoverImg from '../CoverImg';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { mediaUrl } from '../../../constants/DataManupulation';
import { dateWithDay, timeDuration } from '../../../constants/DateConverter';
import ContentAccessModal from '../ContentAccessModal/ContentAccessModal';



export default function CoursesCard(props) {
	const courseDetails = props?.data?.course
	const [subscriptionDaysLeft, setSubscriptionDaysLeft] = useState()
	const contentAccess = props?.data?.availability?.contentAccess
	const [isModelForcontentAccess, setIsModelforcontentAccess] = useState(false)
	const coverImgUrl = courseDetails.pictureKey ? `${mediaUrl(courseDetails.pictureBucket, courseDetails.pictureKey)}` : '/images/anaOstori.png'

	const date = props?.data?.availability

	useEffect(() => {
		const date = new Date(props?.data?.createdAt);
		date.setMonth(date.getMonth() + 6);
		const toady = new Date();
		const diffTime = Math.abs(date - toady);
		const remainingDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
		setSubscriptionDaysLeft(remainingDays)
	}, [props])

	const handleClick = () => {
		if (contentAccess == false) {
			setIsModelforcontentAccess(true)
			return
		} else {
			Router.push(`myCourse/${courseDetails.id}`)
		}
	}

	return (
		<>
			<div className={styles.cardMainDiv}>
				<div className='cursor-pointer' onClick={() => handleClick()}>
					<CoverImg height={140} url={coverImgUrl} />
				</div>
				<div className={styles.cardContentDiv}>
					<h1 className={`fontBold ${styles.courseTitle}`}>{courseDetails.name}</h1>
					<div className={styles.subscriptionText}>
						<AllIconsComponenet height={14} width={14} iconName={'calander'} color={'#000000'} />
						<p className='px-2'>{courseDetails.type == "on-demand" ? `ينتهي اشتراكك بعد ${subscriptionDaysLeft} يوم` : `من ${dateWithDay(date?.dateFrom)}إلى ${dateWithDay(date?.dateTo)}`}</p>
					</div>

					{courseDetails.type == "on-demand" ?
						<>
							<button className={`${styles.followUpBtn} primaryStrockedBtn`} onClick={() => handleClick()}>متابعة التقدم</button>
						</>
						:
						<>
							<div className={styles.subscriptionText}>
								<AllIconsComponenet height={14} width={14} iconName={'clock'} color={'#000000'} />
								<p className='px-2'>{timeDuration(date.timeFrom, date.timeTo)}</p>
							</div>
							<div className={styles.subscriptionText}>
								{courseDetails.type == "physical" ?
									<AllIconsComponenet height={14} width={14} iconName={'location'} color={'#000000'} />
									:
									<AllIconsComponenet height={14} width={14} iconName={'live'} color={'#000000'} />
								}
								{courseDetails.type == "physical" ? <Link href="/" className='link px-2'>{date?.locationName}</Link> : <p className='px-2'>{date?.locationName}</p>}
							</div>
							{/* <button className={`${styles.followUpBtn} primaryStrockedBtn`} onClick={() => Router.push(`myCourse/${courseDetails.id}`)}>متابعة الدورة المسجلة</button> */}
							<button className={`${styles.followUpBtn} primaryStrockedBtn`} onClick={() => handleClick()}>متابعة الدورة المسجلة</button>
						</>
					}
				</div>
				{isModelForcontentAccess &&
					<ContentAccessModal
						isModelForcontentAccess={isModelForcontentAccess}
						setIsModelforcontentAccess={setIsModelforcontentAccess}
					/>
				}
			</div>
		</>
	)
}
