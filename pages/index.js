import styles from '../styles/Home.module.scss';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CourseCard from '../components/HomePageComponents/CourseCard';
import Icon from '../components/CommonComponents/Icon';
import useWindowSize from '../hooks/useWindoSize';
import Image from 'next/legacy/image';
import axios from 'axios';
import ReviewComponent from '../components/CommonComponents/ReviewsComponent/ReviewComponent';
import VideoThumnail from '../components/CourseDescriptionPageComponents/DetailsHeader/Common/VideoThumnail';
import AllIconsComponenet from '../Icons/AllIconsComponenet';
import { mediaUrl } from '../constants/DataManupulation';
import Link from 'next/link';

export const metadata = {
	title: 'Anaostori',
	description: 'نقدم دوراتنا بالطريقة اللي تناسبك',
	openGraph: {
		images: ['/images/classroomImg1_big.png'],
	},
}

export async function getServerSideProps(context) {
	const params = context.query
	try {
		const newsReq = axios.get(`${process.env.API_BASE_URL}/news`)
		const catagoriesReq = axios.get(`${process.env.API_BASE_URL}/catagoriesNoAuth`)
		// const homeReviewsReq = axios.get(`${process.env.API_BASE_URL}/homeReviews`)
		const homeMetaDataReq = axios.get(`${process.env.API_BASE_URL}/home/metadata`)
		const [news, catagories, homeMetaData] = await Promise.all([
			// const [news, catagories, homeReviews, homeMetaData] = await Promise.all([
			newsReq,
			catagoriesReq,
			// homeReviewsReq,
			homeMetaDataReq
		])

		return {
			props: {
				catagories: catagories.data,
				homeMetaData: homeMetaData.data,
				news: news.data,
			}

			// props: {
			// 	// news: news.data,
			// 	catagories: catagories.data,
			// 	// homeReviews: homeReviews.data,
			// 	// homeMetaData: homeMetaData.data,
			// 	params: params
			// }
		};
	} catch (error) {
		console.log(error);
		return {
			// notFound: true,
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
	const navigation = (navigationLink) => {
		router.push(`/${navigationLink}`)
	}


	const typeOfCourse = [
		{ courseTypeHead: 'حضورية', iconName: 'physicalCourseIcon', height: isMediumScreen ? (isSmallScreen ? 28 : 51) : 65, width: isMediumScreen ? (isSmallScreen ? 40 : 54) : 70 },
		{ courseTypeHead: 'بث مباشر', iconName: 'live', height: isMediumScreen ? (isSmallScreen ? 28 : 51) : 65, width: isMediumScreen ? (isSmallScreen ? 33 : 54) : 70 },
		{ courseTypeHead: 'مسجلة', iconName: 'onlineCourseIcon', height: isMediumScreen ? (isSmallScreen ? 28 : 51) : 65, width: isMediumScreen ? (isSmallScreen ? 40 : 64) : 82 },
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
					<h1 className='head1'>مهمتنا في أنا أسطوري</h1>
					<div className='flex relative'>
						<p className='fontMedium'>إننا نساعدك تجيب الدرجة الي تطمح لها 🎯 في</p>
						<div className={styles.animatedTextBox}>
							<p id={styles.animatedText1} className={`fontBold ${styles.animatedText}`}>القدرات</p>
							<p id={styles.animatedText2} className={`fontBold ${styles.animatedText}`}>التحصيلي</p>
							<p id={styles.animatedText3} className={`fontBold ${styles.animatedText}`}>الرخصة المهنية</p>
						</div>
					</div>
					<p className='fontMedium'>وأنت مبسوط ومرتاح👌</p>
					<div className={styles.btnBox}>
						<div className={styles.firstBtnBox}>
							<button className={`secondrySolidBtn ${styles.firstBtn}`} onClick={() => handleScrollToSection('refCourseSec')}>تصفح الدورات</button>
						</div>
						<div className={styles.secondBtnBox}>
							<button className={`secondryStrockedBtn ${styles.secondBtn}`} onClick={() => handleScrollToSection('refFeedback')}>تجارب الأساطير</button>
						</div>
					</div>
				</div>
				<div className={`${styles.videoThumnail}`}>
					<VideoThumnail pictureKey={''} videoUrl={mediaUrl(props.homeMetaData[4]?.fileBucket, props.homeMetaData[4]?.fileKey)} thumnailHeight={isSmallScreen ? 250 : isMediumScreen ? 270 : 290} />
				</div>
			</div>
			<div className={styles.analyticsBarWrapper}>
				<div className={`maxWidthDefault text-white ${styles.analyticsBarSubWrapper}`}>
					<div className={`${styles.badgeDiv} pt-4`}>
						<Icon height={isSmallScreen ? 35 : 40} width={isSmallScreen ? 35 : 40} iconName={'medalIcon'} alt={'Medal Icon'} />
						<div className='px-4'>
							<p className='head2' style={{ fontSize: '20px' }}>وش يميزنا</p>
							<p className={styles.discriptionText}>شاملين كل شيء تحتاجه من تأسيس وتجميعات، ونرد على أسئلتك، ونتابع معك أدائك، ونضمن لك الفائدة.</p>
						</div>
					</div>
					<div className={`${styles.badgeDiv} pt-4`}>
						<Icon height={isSmallScreen ? 35 : 40} width={isSmallScreen ? 35 : 40} iconName={'checkYelloBadgeIcon'} alt={'Check Yello Badge Icon'} />
						<div className='px-4'>
							<p className='head2' style={{ fontSize: '20px' }}>نضمن لك الفائدة</p>
							<p className={styles.discriptionText}>إذا التزمت معنا خطوة خطوة بنضمن لك ارتفاع بدرجتك حسب  <Link className='link' href={'https://drive.google.com/file/u/1/d/15RobQvOlz5-u5Bw5pOeaDLqjDtWqCyg8/view?usp=sharing'} target='_blank'>سياسة الضمان</Link></p>
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
					<div className='pt-8'>
						<p className={`head2 ${styles.typeOfCourseHeader}`}>نقدم دوراتنا بالطريقة اللي تناسبك</p>
						<div className={styles.courseTypesWrapper}>
							{typeOfCourse.map((data, index) => {
								return (
									<div className={styles.courseTypeCard} key={`courseType${index}`}>
										<AllIconsComponenet height={data.height} width={data.width} iconName={data.iconName} color={'#FFFFFF'} />
										<p className='head2 py-2'>{data.courseTypeHead}</p>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</div>
			<div ref={refCourseSec} className={`maxWidthDefault ${styles.courseSection} ${scrollSectionName == 'refCourseSec' ? `${styles.paddingTop}` : ''}`}>
				<h1 className='head1'>دوراتنا</h1>
				<div className={styles.courseCardsWraper}>
					{catagories.length > 0 && catagories.map((catagory, index) => {
						return (
							<div key={`catagory${index}`} onClick={() => handleNavigation(catagory.name)}>
								<CourseCard pictureUrl={mediaUrl(catagory.pictureBucket, catagory.pictureKey)} courseType={catagory.name} imgHeight={windowScreen > 1280 ? 164 : 145} />
							</div>
						)
					})
					}
				</div>
			</div>
			<hr />
			<div ref={refFeedback} className={`maxWidthDefault ${styles.userFeedbackSec} ${scrollSectionName == 'refFeedback' ? `${styles.paddingTop}` : ''}`}>
				<div className={`flex justify-between items-center px-4`}>
					<h1 className='head1'>تجارب الأساطير</h1>
					<p className='link cursor-pointer' onClick={() => navigation('studentFeedback')}>مشاهدة الكل</p>
				</div>
				<p className={`pb-4 pr-4 pl-8 ${styles.userFeedbackDiscription}`}>+25,000 طالب وطالبة ساعدناهم يحققون أهدافهم، <span className='fontPrimarycolor'>وعقبالك</span> تكون منهم 🧡</p>
				<ReviewComponent homeReviews={homeReviews} />
			</div>
		</div>
	)
}
