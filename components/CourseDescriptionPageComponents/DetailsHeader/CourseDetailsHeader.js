import styles from './CourseDetailsHeader.module.scss'
import BuyCourseComponent from './BuyCourseComponent/BuyCourseComponent';
import useWindowSize from '../../../hooks/useWindoSize';
import Link from 'next/link';
import VideoThumnail from './Common/VideoThumnail';
import useScrollEvent from '../../../hooks/useScrollEvent';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';

//MI icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import LocationOnIcon from '@mui/icons-material/LocationOn';


export default function CourseDetailsHeader(props) {

	const courseDetail = props.courseDetail
	const handleBookSitButtonClick = props.handleBookSitButtonClick
	const isMediumScreen = useWindowSize().mediumScreen
	const screenWidth = useWindowSize().width
	const offset = useScrollEvent().offset

	const courseCatagoriUrl = `${(courseDetail.catagory.name).replace(/ /g, "-")}`

	return (
		<div className={styles.headerWrapper}>
			{courseDetail &&
				<div className='maxWidthDefault relative'>
					{(screenWidth > 767) &&
						<div className={styles.pathDiv}>
							<Link href={'/'} className={styles.pathText}>الرئيسية</Link> <ChevronLeftIcon className={styles.arrowIcon} /> <Link href={`/${courseCatagoriUrl}`} className={styles.pathText}>{courseDetail.catagory.name}</Link> <ChevronLeftIcon className={styles.arrowIcon} /> <p>{courseDetail.name}</p>
						</div>
					}
					{!(screenWidth > 767) &&
						<div className='w-80 mx-auto'>
							<VideoThumnail pictureKey={courseDetail.pictureKey} videoKey={courseDetail.videoKey} thumnailHeight={190} />
						</div>
					}
					<h1 className={`head1 ${styles.courseName}`}>{courseDetail.name}</h1>
					<p className={styles.courseDiscriptionText}>{courseDetail.shortDescription}</p>
					<div className={styles.analyticsBarWrapper}>
						{courseDetail.type == "physical" ?
							<div className={styles.analyticsCard}>
								<LocationOnIcon className={`mt-1 ${styles.icon}`} style={{ color: '#ffffff' }} />
								<div className='px-1'>
									<p>تقدم الدورة في</p>
									<p className='fontBold'>{courseDetail.locationName}</p>
								</div>
							</div>
							: courseDetail.type == "online" ?
								<div className={styles.analyticsCard}>
									<div className='mt-2'>
										<AllIconsComponenet height={isMediumScreen ? 18 : 20} width={isMediumScreen ? 20 : 22} iconName={'live'} color={'#FFFFFF'} />
									</div>
									<div className='px-1'>
										<p>يتم بثها عبر </p>
										<p className='fontBold'>قاعة افتراضية</p>
									</div>
								</div>
								:
								<div className={styles.analyticsCard}>
									<div className='mt-2'>
										<AllIconsComponenet height={isMediumScreen ? 18 : 20} width={isMediumScreen ? 20 : 22} iconName={'globe'} color={'#FFFFFF'} />
									</div>
									<div className='px-1'>
										<p>طريقة التقديم </p>
										<p className='fontBold'>اونلاين</p>
									</div>
								</div>
						}
						<div className={styles.analyticsCard}>
							<StarRoundedIcon className={`mt-1 ${styles.icon}`} style={{ color: '#FFCD3C' }} />
							<div className='px-1'>
								<p>تقييم الدورة </p>
								<p className='fontBold'>{courseDetail.reviewRate}</p>
							</div>
						</div>
						<div className={styles.analyticsCard}>
							<SchoolRoundedIcon className={`mt-1 ${styles.icon}`} />
							<div className='px-1'>
								<p>عدد الخريجين </p>
								<p className='fontBold'>{courseDetail.numberOfGrarduates}</p>
							</div>
						</div>
					</div>
					{(screenWidth > 767 && (offset < (screenWidth > 1280 ? 357 : screenWidth < 1024 ? 313 : 336))) &&
						<BuyCourseComponent courseDetail={courseDetail} handleBookSitButtonClick={handleBookSitButtonClick} bookSeatButtonText={props.bookSeatButtonText} />
					}
				</div>
			}
		</div>
	)
}
