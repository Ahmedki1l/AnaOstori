import Icon from '../Icon';
import styles from './CoursesCard.module.scss'
import Link from 'next/link';
import CoverImg from '../CoverImg';
import * as LinkConst from '../../../constants/LinkConst';
import Router from 'next/router';
import ProgressBar from '../progressBar';
import { useEffect, useState } from 'react';
import { getCourseProgressAPI } from '../../../services/apisService';
import { useSelector } from 'react-redux';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';



export default function CoursesCard(props) {
	const storeData = useSelector((state) => state?.globalStore);
	const courseDetails = props?.data?.course

	const baseUrl = LinkConst.File_Base_Url2
	const [courseProgress, setCourseProgress] = useState(0)
	const [subscriptionDaysLeft, setSubscriptionDaysLeft] = useState()

	const coverImgUrl = courseDetails.pictureKey ? `${baseUrl}/${courseDetails.pictureKey}` : ""
	// const coverImgUrl = courseDetails.course.pictureKey ? `${baseUrl}/${courseDetails.course.pictureKey}` : ""


	const date = props?.data?.availability

	const startMonth = new Date(date.dateFrom).toLocaleDateString('ar-AE', { timeZone: "UTC", month: 'long' })
	const startDate = new Date(date.dateFrom).toLocaleDateString('en-US', { timeZone: "UTC", day: 'numeric' })
	const startDay = new Date(date.dateFrom).toLocaleDateString('ar-AE', { timeZone: "UTC", weekday: 'long' })

	const endMonth = new Date(date.dateTo).toLocaleDateString('ar-AE', { timeZone: "UTC", month: 'long' })
	const endDate = new Date(date.dateTo).toLocaleDateString('en-US', { timeZone: "UTC", day: 'numeric' })
	const endDay = new Date(date.dateTo).toLocaleDateString('ar-AE', { timeZone: "UTC", weekday: 'long' })

	const startTime = new Date('1970-01-01T' + date.timeFrom + 'Z').toLocaleTimeString('ar-AE', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })
	const endTime = new Date('1970-01-01T' + date.timeTo + 'Z').toLocaleTimeString('ar-AE', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })

	useEffect(() => {
		if (courseDetails.type == "on-demand") {
			const getCourseProgress = async () => {
				const params = {
					courseID: courseDetails.id,
					accessToken: storeData?.accessToken
				}
				await getCourseProgressAPI(params).then((res) => {
					setCourseProgress(Math.floor(res?.data?.overallProgress))
				}).catch((error) => {
					console.log(error);
				})
			}
			getCourseProgress()
		}
	}, [courseDetails, storeData?.accessToken])

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
					<p className={`fontBold ${styles.courseTitle}`}>{courseDetails.name}</p>
					<div className={styles.subscriptionText}>
						<AllIconsComponenet height={14} width={14} iconName={'calander'} color={'#000000'} />
						<p className='px-2'>{courseDetails.type == "on-demand" ? `ينتهي اشتراكك بعد ${subscriptionDaysLeft} يوم` : `من ${startDay} ${startDate} ${startMonth} إلى ${endDay} ${endDate} ${endMonth}`}</p>
					</div>

					{courseDetails.type == "on-demand" ?
						<>
							<p className={styles.progressText}>مستوى التقدم</p>
							<ProgressBar percentage={courseProgress} bgColor={'#2BB741'} fontSize={17} />
							<button className={`${styles.followUpBtn} primaryStrockedBtn`} onClick={() => Router.push(`myCourse/${courseDetails.id}`)}>متابعة التقدم</button>
						</>
						:
						<>
							<div className={styles.subscriptionText}>
								<AllIconsComponenet height={14} width={14} iconName={'clock'} color={'#000000'} />
								<p className='px-2'>من {startTime} إلى {endTime}</p>
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
