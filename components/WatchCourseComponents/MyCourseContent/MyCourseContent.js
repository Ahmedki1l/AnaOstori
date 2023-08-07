import Image from 'next/legacy/image'
import React, { useEffect, useState } from 'react'
import useWindowSize from '../../../hooks/useWindoSize'
import TrainerIntroCard from '../../CommonComponents/TrainerIntroCard/TrainerIntroCard'
import styles from './MyCourseContent.module.scss'
import CompleteCourseIndicator from '../../CommonComponents/CompleteCourseIndicatior/CompleteCourseIndicator'
import { getCourseItemAPI } from '../../../services/apisService'
import { useRouter } from 'next/router'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { mediaUrl } from '../../../constants/DataManupulation'

export default function MyCourseContent(props) {
	const smallScreen = useWindowSize().smallScreen
	const courseProgressPrecentage = props?.courseProgressPrecentage
	const courseCurriculum = props?.courseCurriculum
	const courseCurriculumSections = courseCurriculum?.sections?.sort((a, b) => a.order - b.order)
	const courseID = props?.courseID
	const filesInCourse = courseCurriculumSections?.flatMap((section) => section?.items?.filter((item) => item.type === 'file'))
	const router = useRouter()
	const [subscriptionDaysLeft, setSubscriptionDaysLeft] = useState()


	useEffect(() => {
		const date = new Date(courseCurriculum?.enrollment?.createdAt);
		date.setMonth(date.getMonth() + 6);

		const toady = new Date();
		const diffTime = Math.abs(date - toady);
		const remainingDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
		setSubscriptionDaysLeft(remainingDays)
	}, [courseCurriculum])


	const downloadFileHandler = async (itemID) => {
		if (courseID) {
			const params = {
				courseID,
				itemID,
			}
			await getCourseItemAPI(params).then(async (item) => {
				router.push(`${item.data.url}`)
			}).catch((error) => console.log(error))
		}
	}

	return (
		<>
			{courseCurriculum &&
				<div className={`px-4 maxWidthDefault ${styles.myCourseContentMainWrapper}`}>
					{!smallScreen &&
						<div className={`${styles.myCourseDetailsWrapper} ${styles.boxBorder}`}>
							<div className={styles.courseThumnailDiv}>
								<Image src={mediaUrl(courseCurriculum?.course?.pictureBucket, courseCurriculum?.course?.pictureKey)} alt='My Course Image' layout='fill' objectFit="cover" priority />
							</div>
							<div className='pr-4'>
								<h1 className={`fontBold ${styles.myCourseTitle}`}>{courseCurriculum?.course?.name}</h1>
								<div className='flex items-center pt-2'>
									<AllIconsComponenet height={20} width={20} iconName={'calander'} color={'#808080'} />
									<p className='pr-2'>ينتهي الاشتراك بعد {subscriptionDaysLeft} يوم </p>
								</div>
								<div className={styles.watchCourseBtnBox}>
									<button className='primarySolidBtn' onClick={() => { props.setSelectedTab(1) }}>متابعة التقدم</button>
								</div>
							</div>
						</div>
					}
					<div className={`${styles.myCourseInstructorWrapper} ${styles.boxBorder}`}>
						<h1 className={`fontBold ${styles.myCourseInstructorWrapperHeader}`}>المدربين</h1>
						<div className={styles.myCourseInstructorSubWrapper}>
							{courseCurriculum?.course?.instructors?.map((instructor, index) => {
								return (
									<TrainerIntroCard instructor={instructor} key={`instructor${index}`} />
								)
							})}
						</div>
					</div>
					{!smallScreen && <div className={`${styles.myCourseSessionFilesWrapper} ${styles.boxBorder}`}>
						<div className={styles.myCourseSessionFilesWrapperHeader}>
							<h1 className={`fontBold ${styles.myCourseSessionFilesHeaderText}`}>ملفات الدورة</h1>
						</div>
						{filesInCourse?.map((fileItem, index) => {
							return (
								<div key={`file${index}`} className={`flex items-center p-3.5 ${styles.fileWrapper}`} onClick={() => downloadFileHandler(fileItem?.id)}>
									<AllIconsComponenet height={24} width={24} iconName={'file'} color={'#F26722'} />
									<p className='fontMedium pr-2'>{fileItem.name}</p>
								</div>
							)
						})}
					</div>}
					{courseProgressPrecentage &&
						<div className={`${styles.myCourseStudentProgressWrapper} ${styles.boxBorder}`}>
							{smallScreen && <div className='flex items-center pt-2'>
								<AllIconsComponenet height={20} width={20} iconName={'calander'} color={'#808080'} />
								<p className='pr-2'>ينتهي الاشتراك بعد X يوم </p>
							</div>}
							<h1 className={`fontBold ${styles.myCourseStudentProgressWrapperHeader}`}>مستوى التقدم</h1>
							<div className={styles.myCourseStudentProgressSubWrapper}>
								<div className={styles.itemProcessWrapper}>
									<div className='flex items-center pt-3.5 pl-4'>
										<div className={styles.iconDiv}>
											<AllIconsComponenet height={20} width={20} iconName={'playButton'} color={'#F26722'} />
										</div>
										<div className='pr-2'>
											<p className={`fontMedium ${styles.dataAnalyticHeader}`}>الدروس</p>
											<p className={`fontBold ${styles.proggresPercentage}`}>{parseFloat(courseProgressPrecentage?.videoProgress)?.toFixed(0)}%</p>
										</div>
									</div>
									<div className='flex items-center pt-3.5'>
										<div className={styles.iconDiv}>
											<AllIconsComponenet height={20} width={20} iconName={'quiz'} color={'#F26722'} />
										</div>
										<div className='pr-2'>
											<p className={`fontMedium ${styles.dataAnalyticHeader}`}>الاختبارات</p>
											<p className={`fontBold ${styles.proggresPercentage}`}>{parseFloat(courseProgressPrecentage?.quizProgress)?.toFixed(0)}%</p>
										</div>
									</div>
									<div className='flex items-center pt-3.5'>
										<div className={styles.iconDiv}>
											<AllIconsComponenet height={24} width={20} iconName={'file'} color={'#F26722'} />
										</div>
										<div className='pr-2'>
											<p className={`fontMedium ${styles.dataAnalyticHeader}`}>الاختبارات</p>
											<p className={`fontBold ${styles.proggresPercentage}`}>{parseFloat(courseProgressPrecentage?.fileProgress)?.toFixed(0)}%</p>
										</div>
									</div>
								</div>
								<div className='pl-8 md:pt-4'>
									<CompleteCourseIndicator percent={courseProgressPrecentage?.overallProgress} size={smallScreen ? 100 : 150} showExtraDetails={true} color={'#46BD84'} />
								</div>
							</div>
						</div>
					}
				</div>
			}
		</>
	)
}
