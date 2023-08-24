import styles from './CoursesCard.module.scss'
import Link from 'next/link';
import CoverImg from '../CoverImg';
import Router from 'next/router';
import ProgressBar from '../progressBar';
import { useEffect, useState } from 'react';
import { getCourseProgressAPI } from '../../../services/apisService';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { mediaUrl } from '../../../constants/DataManupulation';
import { dateWithDay, timeDuration } from '../../../constants/DateConverter';



export default function CoursesCard(props) {
	const courseDetails = props?.data?.course
	const [courseProgress, setCourseProgress] = useState(0)
	const [subscriptionDaysLeft, setSubscriptionDaysLeft] = useState()


	const coverImgUrl = courseDetails.pictureKey ? `${mediaUrl(courseDetails.pictureBucket, courseDetails.pictureKey)}` : '/images/anaOstori.png'

	const date = props?.data?.availability

	useEffect(() => {
		if (courseDetails.type == "on-demand") {
			const getCourseProgress = async () => {
				const params = {
					courseID: courseDetails.id,
				}
				await getCourseProgressAPI(params).then((res) => {
					setCourseProgress(Math.floor(res?.data?.overallProgress))
				}).catch((error) => {
					console.log(error);
				})
			}
			getCourseProgress()
		}
	}, [courseDetails])

	useEffect(() => {
		const date = new Date(props?.data?.createdAt);
		date.setMonth(date.getMonth() + 6);
		const toady = new Date();
		const diffTime = Math.abs(date - toady);
		const remainingDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
		setSubscriptionDaysLeft(remainingDays)
	}, [props])

	return (
		<>
			<div className={styles.cardMainDiv}>
				<div className='cursor-pointer' onClick={() => Router.push(`myCourse/${courseDetails.id}`)}>
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
							<h1 className={styles.progressText}>مستوى التقدم</h1>
							<ProgressBar percentage={courseProgress} bgColor={'#2BB741'} fontSize={17} />
							<button className={`${styles.followUpBtn} primaryStrockedBtn`} onClick={() => Router.push(`myCourse/${courseDetails.id}`)}>متابعة التقدم</button>
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
							<button className={`${styles.followUpBtn} primaryStrockedBtn`} onClick={() => Router.push(`myCourse/${courseDetails.id}`)}>متابعة الدورة المسجلة</button>
						</>
					}
				</div>
			</div>
		</>
	)
}
