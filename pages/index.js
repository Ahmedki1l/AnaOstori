import styles from '../styles/Home.module.scss';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CourseCard from '../components/HomePageComponents/CourseCard';
import Icon from '../components/CommonComponents/Icon';
import useWindowSize from '../hooks/useWindoSize';
import Image from 'next/legacy/image';
import axios from 'axios';
import VideoThumnail from '../components/CourseDescriptionPageComponents/DetailsHeader/Common/VideoThumnail';
import AllIconsComponenet from '../Icons/AllIconsComponenet';
import { mediaUrl } from '../constants/DataManupulation';
import Link from 'next/link';
import { HomeConst } from '../constants/HomeConst';
import ReviewComponent from '../components/CommonComponents/ReviewsComponent/ReviewComponent';

export const metadata = {
	title: 'Anaostori',
	description: HomeConst.metaDescriptionData,
	openGraph: {
		images: ['/images/classroomImg1_big.png'],
	},
}

export async function getServerSideProps(context) {
	const params = context.query
	try {
		const newsReq = axios.post(`${process.env.API_BASE_URL}/route`, { routeName: 'listNewsBar' })
		const catagoriesReq = axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=categoriesNoAuth`)
		const homeReviewsReq = axios.post(`${process.env.API_BASE_URL}/route`, { routeName: `allReviews` })
		const homeMetaDataReq = axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=homeMetaData`)
		// const [news, catagories, homeMetaData] = await Promise.all([
		const [news, catagories, homeReviews, homeMetaData] = await Promise.all([
			newsReq,
			catagoriesReq,
			homeReviewsReq,
			homeMetaDataReq
		])
		return {
			// props: {
			// 	catagories: catagories.data,
			// 	homeMetaData: homeMetaData.data,
			// 	news: news.data,
			// 	params: params
			// }

			props: {
				news: news.data,
				catagories: catagories.data,
				homeReviews: homeReviews.data,
				homeMetaData: homeMetaData.data,
				params: params
			}
		};
	} catch (error) {
		console.log(error);
		return {
			notFound: true,
		};
	}

}


export default function Home(props) {
	const router = useRouter();
	const isMediumScreen = useWindowSize().mediumScreen
	const isSmallScreen = useWindowSize().smallScreen
	const windowScreen = useWindowSize().width
	const refCourseSec = useRef(null);
	const refFeedback = useRef(null);
	const news = props.news ? props.news : []
	const [hideNotificationBar, setHideNotificationBar] = useState(news.length > 0 ? true : false)
	const catagories = props?.catagories ? props?.catagories : []
	const homeReviews = props.homeReviews ? props.homeReviews.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)) : []
	const [scrollSectionName, setScrollSectionName] = useState()
	const videoObject = props.homeMetaData.find(obj => obj.key === "video");
	const handleScrollToSection = (sectionName) => {

		if (sectionName == 'refCourseSec') {
			refCourseSec.current?.scrollIntoView({ behavior: 'smooth' });
		}
		else {
			refFeedback.current?.scrollIntoView({ behavior: 'smooth' });
		}
		setScrollSectionName(sectionName)
	}
	useEffect(() => {
		if (props.params?.دوراتنا == '') {
			const scrollToCourse = handleScrollToSection("refCourseSec")
		}
	}, [props.params?.دوراتنا]);

	const handleNavigation = (catagoryName) => {
		router.push(`/${catagoryName.replace(/ /g, "-")}`)
	}


	const typeOfCourse = [
		{ courseTypeHead: HomeConst.courseTypeHead1, iconName: 'locationDoubleColor', height: isSmallScreen ? 36 : 40, width: 40 },
		{ courseTypeHead: HomeConst.courseTypeHead2, iconName: 'onlineDoubleColorIcon', height: isSmallScreen ? 36 : 40, width: 40 },
		{ courseTypeHead: HomeConst.courseTypeHead3, iconName: 'televisonDoubleColorIcon', height: isSmallScreen ? 36 : 40, width: 40 },
	]

	return (
		<div className={styles.container}>
			{hideNotificationBar
				? (<div className={styles.notificationBarwraper}>
					<div className='maxWidthDefault flex items-center'>
						<div className={styles.closeIcon} onClick={() => { setHideNotificationBar(false) }}>
							<AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#FFFFFF'} />
						</div>
						{news.length > 0 && news.map((newNews, i = index) => {
							return (
								<p className={styles.notificationText} key={`news${i}`}>{newNews.content}</p>
							)
						})}
					</div>
				</div>)
				: null
			}

			<div className={`maxWidthDefault ${styles.mainSection}`}>
				<div className={styles.textSection}>
					<h1 className='head1'>{HomeConst.head1}</h1>
					<div className='flex relative pt-2'>
						<p className='fontMedium'>إننا نساعدك تجيب الدرجة الي تطمح لها 🎯 في</p>
						<div className={`${styles.animatedTextBox}`}>
							<p id={styles.animatedText1} className={`fontMedium ${styles.animatedText}`}>{HomeConst.animatedText1}</p>
							<p id={styles.animatedText2} className={`fontMedium ${styles.animatedText}`}>{HomeConst.animatedText2}</p>
							<p id={styles.animatedText3} className={`fontMedium ${styles.animatedText}`}>{HomeConst.animatedText3}</p>
						</div>
					</div>
					<p className={`fontMedium ${styles.text2FontMedium}`}>{HomeConst.pfontMedium2}</p>
					<div className={styles.btnBox}>
						<div className={styles.firstBtnBox}>
							<button className={`primarySolidBtn ${styles.firstBtn}`} onClick={() => handleScrollToSection('refCourseSec')}>{HomeConst.scrolltoSection}</button>
						</div>
					</div>
					<div className={styles.secondBtnBox}>
						<button className={`primaryStrockedBtn ${styles.secondBtn}`} onClick={() => handleScrollToSection('refFeedback')}>{HomeConst.scrollToSectionStrockBtn}</button>
					</div>
				</div>
				<div className={`${styles.videoThumnail}`}>
					<VideoThumnail pictureKey={''} videoUrl={mediaUrl(videoObject?.fileBucket, videoObject?.fileKey)} thumnailHeight={isSmallScreen ? 250 : isMediumScreen ? 270 : 290} />
				</div>
			</div>
			<div className={styles.analyticsBarWrapper}>
				<div className={`maxWidthDefault text-white ${styles.analyticsBarSubWrapper}`}>
					<div className={styles.analyticsBarMAinArea}>
						<div>
							<div className={`${styles.badgeDiv} pb-12`}>
								<Icon height={isSmallScreen ? 24 : 40} width={isSmallScreen ? 24 : 40} iconName={'medalIcon'} alt={'Medal Icon'} />
								<div className='pr-2'>
									<p className={`fontMedium ${styles.greySectionHeadText}`}>{HomeConst.p1Head2}</p>
									<p className={styles.discriptionText}>{HomeConst.pDescriptionText1}</p>
								</div>
							</div>
							<div className={`${styles.badgeDiv}`}>
								<Icon height={isSmallScreen ? 24 : 40} width={isSmallScreen ? 24 : 40} iconName={'checkYelloBadgeIcon'} alt={'Check Yello Badge Icon'} />
								<div className='pr-2'>
									<p className={`fontMedium ${styles.greySectionHeadText}`}>{HomeConst.p2Head2}</p>
									<p className={styles.discriptionText}>{HomeConst.pDescriptionText2}<Link className={`link ${styles.discriptionLink}`} href={'https://drive.google.com/file/u/1/d/15RobQvOlz5-u5Bw5pOeaDLqjDtWqCyg8/view?usp=sharing'} target='_blank'>{HomeConst.pDescriptionText2LinkText1}</Link></p>
								</div>
							</div>
						</div>
						<div className={styles.imagesWrapper}>
							<div className={styles.imagesSubWrapper}>
								<div className={styles.image1}>
									<Image src="/images/laptopImg_big.png" alt='Live Course Image' layout='fill' objectFit="cover" priority />
								</div>
								<div className={styles.image2}>
									<Image src="/images/classroomImg1_big.png" alt='Physical Course Image' layout='fill' objectFit="cover" priority />
								</div>
								<div className={styles.image3}>
									<Image src="/images/classroomImg2_big.png" alt='Online Course Image' layout='fill' objectFit="cover" priority />
								</div>
							</div>
						</div>
					</div>
					<div className={styles.typesOfCourses}>
						<p className={` ${styles.offerText}`} >{HomeConst.p3Head2TypeOfCourseHeader}</p>
						<div className={styles.courseTypesWrapper}>
							{typeOfCourse.map((data, index) => {
								return (
									<div className={styles.courseTypeCard} key={`courseType${index}`}>
										<AllIconsComponenet height={data.height} width={data.width} iconName={data.iconName} color={'#FFFFFF'} />
										<p className=' py-2'>{data.courseTypeHead}</p>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</div>
			<div ref={refCourseSec} className={`maxWidthDefault ${styles.courseSection} ${scrollSectionName == 'refCourseSec' ? `${styles.paddingTop}` : ''}`}>
				<h1 className='head1'>{HomeConst.refCourseSecHead1}</h1>
				<div className={styles.courseCardsWraper}>
					{catagories.length > 0 && catagories.map((catagory, index) => {
						return (
							<div className={styles.courseCardWraper} key={`catagory${index}`} onClick={() => handleNavigation(catagory.name)}>
								<CourseCard pictureUrl={mediaUrl(catagory.pictureBucket, catagory.pictureKey)} courseType={catagory.name} imgHeight={windowScreen > 1280 ? 164 : 145} />
							</div>
						)
					})}
				</div>
			</div>
			<div ref={refFeedback} className={`maxWidthDefault ${styles.userFeedbackSec} ${scrollSectionName == 'refFeedback' ? `${styles.paddingTop}` : ''}`}>
				<div className={`flex justify-between items-center px-4`}>
					<h1 className='head1'>{HomeConst.studentSectionHead1}</h1>
					<p className='link cursor-pointer' onClick={() => navigation('studentFeedback')}>{HomeConst.studentSectionLink}</p>
				</div>
				<p className={`pb-4 pr-4 pl-8 ${styles.userFeedbackDiscription}`}>{HomeConst.studentSectionParaLine1} <br /> {HomeConst.studentSectionParaLine21} <span className='fontPrimarycolor'>{HomeConst.studentSectionParaLine22}</span>{HomeConst.studentSectionParaLine23}</p>
				<ReviewComponent homeReviews={homeReviews} />
			</div>
		</div>
	)
}
