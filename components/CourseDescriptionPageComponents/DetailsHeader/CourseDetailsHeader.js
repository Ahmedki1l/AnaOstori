import styles from './CourseDetailsHeader.module.scss'
import BuyCourseComponent from './BuyCourseComponent/BuyCourseComponent';
import useWindowSize from '../../../hooks/useWindoSize';
import Link from 'next/link';
import useScrollEvent from '../../../hooks/useScrollEvent';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import CoverImg from '../../CommonComponents/CoverImg';
import { mediaUrl } from '../../../constants/DataManupulation';


export default function CourseDetailsHeader(props) {

	const courseDetail = props.courseDetail
	const handleBookSitButtonClick = props.handleBookSitButtonClick
	const isMediumScreen = useWindowSize().mediumScreen
	const screenWidth = useWindowSize().width
	const offset = useScrollEvent().offset
	const lang = props.lang
	const courseCatagoriUrl = `${(courseDetail.catagory.name).replace(/ /g, "-")}`

	return (
		<div className={styles.headerWrapper}>
			{courseDetail &&
				<div className='maxWidthDefault relative'>
					{(screenWidth > 767) &&
						<div className={styles.pathDiv}>
							<Link href={'/'} className={styles.pathText}>{lang == 'en' ? `Home` : `الرئيسية`}</Link>
							<div className={styles.arrowIcon}>
								{lang == 'en' ?
									<AllIconsComponenet iconName={'arrowRight'} height={12} width={12} color={'#FFFFFF'} />
									:
									<AllIconsComponenet iconName={'arrowLeft'} height={12} width={12} color={'#FFFFFF'} />
								}
							</div>
							<Link href={`/${courseCatagoriUrl}`} className={styles.pathText}>{courseDetail.catagory.name}</Link>
							<div className={styles.arrowIcon}>
								{lang == 'en' ?
									<AllIconsComponenet iconName={'arrowRight'} height={12} width={12} color={'#FFFFFF'} />
									:
									<AllIconsComponenet iconName={'arrowLeft'} height={12} width={12} color={'#FFFFFF'} />
								}
							</div>
							<h1 style={{ fontSize: '14px' }}>{courseDetail.name}</h1>
						</div>
					}
					{!(screenWidth > 767) &&
						<div className={`w-80 mx-auto ${styles.courseImgWrapper}`}>
							<CoverImg height={190} url={courseDetail.pictureKey ? mediaUrl(courseDetail.pictureBucket, courseDetail.pictureKey) : '/images/anaOstori.png'} />
							{/* <VideoThumnail pictureKey={courseDetail.pictureKey} videoKey={''} thumnailHeight={190} /> */}
						</div>
					}
					<h1 className={`head1 ${styles.courseName}`}>{courseDetail.name}</h1>
					<p className={styles.courseDiscriptionText}>{courseDetail.shortDescription}</p>
					<div className={styles.analyticsBarWrapper}>
						{courseDetail.type == 'physical' ?
							<div className={`${styles.analyticsCard} pt-8 ${lang == 'en' ? 'pr-8' : "pl-8"}`}>
								<div className='m-1'>
									<AllIconsComponenet height={isMediumScreen ? 18 : 32} width={isMediumScreen ? 20 : 32} iconName={'locationDoubleColor'} color={'#FFFFFF'} />
								</div>
								<div className='px-1'>
									<p>{lang == 'en' ? 'Location' : 'تقام الدورة في'}</p>
									<p className='fontBold'>{courseDetail.type == "physical" ? courseDetail.locationName : lang == 'en' ? `Virtual ClassRoom` : 'يتم بثها عبر '}</p>
								</div>
							</div>
							: courseDetail.type == 'online' ?
								<div className={`${styles.analyticsCard} pt-8 ${lang == 'en' ? 'pr-8' : "pl-8"}`}>
									<div className='mt-2'>
										<AllIconsComponenet height={isMediumScreen ? 18 : 20} width={isMediumScreen ? 20 : 22} iconName={'globe'} color={'#FFFFFF'} />
									</div>
									<div className='px-1'>
										<p>{lang == 'en' ? 'Location' : 'يتم بثها عبر'}</p>
										<p className='fontBold'>{courseDetail.type == "online" ? courseDetail.locationName : lang == 'en' ? 'online' : 'اونلاين'}</p>
									</div>
								</div>
								:
								<div className={`${styles.analyticsCard} pt-8 ${lang == 'en' ? 'pr-8' : "pl-8"}`}>
									<div className='mt-2'>
										<AllIconsComponenet height={isMediumScreen ? 18 : 20} width={isMediumScreen ? 20 : 22} iconName={'newLiveTVIcon'} color={'#FFFFFF'} />
									</div>
									<div className='px-1'>
										<p>{lang == 'en' ? 'Location' : 'دروس مسجلة'}</p>
										<p className='fontBold'>بجودة عالية</p>
									</div>
								</div>
						}
						{/* {courseDetail.type !== 'on-demand' ?
							<div className={`${styles.analyticsCard} pt-8 ${lang == 'en' ? 'pr-8' : "pl-8"}`}>
								<div className='m-1'>
									<AllIconsComponenet height={isMediumScreen ? 18 : 22} width={isMediumScreen ? 20 : 22} iconName={'location'} color={'#FFFFFF'} />
								</div>
								<div className='px-1'>
									<p>{lang == 'en' ? 'Location' : 'تقدم الدورة في'}</p>
									<p className='fontBold'>{courseDetail.type == "physical" ? courseDetail.locationName : lang == 'en' ? `Virtual ClassRoom` : 'يتم بثها عبر '}</p>
								</div>
							</div>
							:
							<div className={`${styles.analyticsCard} pt-8 ${lang == 'en' ? 'pr-8' : "pl-8"}`}>
								<div className='mt-2'>
									<AllIconsComponenet height={isMediumScreen ? 18 : 20} width={isMediumScreen ? 20 : 22} iconName={'globe'} color={'#FFFFFF'} />
								</div>
								<div className='px-1'>
									<p>{lang == 'en' ? 'Location' : 'يتم تقديمها عبر'}</p>
									<p className='fontBold'>اونلاين</p>
								</div>
							</div>
						} */}
						<div className={`${styles.analyticsCard} pt-8 ${lang == 'en' ? 'pr-8' : "pl-8"}`}>
							<div className='m-1'>
								<AllIconsComponenet height={isMediumScreen ? 18 : 24} width={isMediumScreen ? 20 : 24} iconName={'starDoubleColoredIcon'} color={'#FFCD3C'} />
							</div>
							<div className='px-1'>
								<p> {lang == 'en' ? `Course Review` : 'تقييم الدورة'} </p>
								<p className='fontBold'>{courseDetail.reviewRate}</p>
							</div>
						</div>
						<div className={`${styles.analyticsCard} pt-8 ${lang == 'en' ? 'pr-8' : "pl-8"}`}>
							<div className='m-1'>
								<AllIconsComponenet height={isMediumScreen ? 18 : 22} width={isMediumScreen ? 20 : 22} iconName={'personDoubleColoredIcon'} color={'#FFFFFF'} />
							</div>
							<div className='px-1'>
								{courseDetail.type == 'onDemand' ?
									<p>{lang == 'en' ? 'Number of graduates subscriptions ' : 'عدد الاشتراكات'}</p>
									:
									<p>{lang == 'en' ? `Number of graduates` : `عدد الخريجين`} </p>
								}
								<p className='fontBold'>{courseDetail.numberOfGrarduates}</p>
							</div>
						</div>
					</div>
					{(screenWidth > 767 && (offset < (screenWidth > 1280 ? 357 : screenWidth < 1024 ? 313 : 336))) &&
						<BuyCourseComponent
							courseDetail={courseDetail}
							handleBookSitButtonClick={handleBookSitButtonClick}
							bookSeatButtonText={props.bookSeatButtonText}
							setDiscountShow={props.setDiscountShow}
							discountShow={props.discountShow}
							lang={lang} />
					}
				</div>
			}
		</div>
	)
}
