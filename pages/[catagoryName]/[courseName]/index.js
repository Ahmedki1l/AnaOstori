import React, { useEffect, useState } from 'react'
import styles from '../../../styles/PhysicalCourse.module.scss'
import CourseDetailsHeader from '../../../components/CourseDescriptionPageComponents/DetailsHeader/CourseDetailsHeader'
import Icon from '../../../components/CommonComponents/Icon'
import ScrollContainer from 'react-indiana-drag-scroll'
import CourseDates from '../../../components/CourseDescriptionPageComponents/CourseDates/CourseDates'
import UserDetailForm1 from '../../../components/CourseDescriptionPageComponents/UserDetailForm1'
import ReviewComponent from '../../../components/CommonComponents/ReviewsComponent/ReviewComponent'
import axios from 'axios';
import Link from 'next/link';
import useWindowSize from '../../../hooks/useWindoSize'
import CoursePriceBox from '../../../components/CourseDescriptionPageComponents/DetailsHeader/Common/CoursePriceBox'
import useScrollEvent from '../../../hooks/useScrollEvent'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getCourseByNameAPI } from '../../../services/apisService'


export async function getServerSideProps(ctx) {

	const newResolvedUrl = ctx?.resolvedUrl.split('/')[1].replace(/-/g, ' ') //used .split() and .replace() to get course name from URl
	const courseDetailsReq = axios.get(`${process.env.API_BASE_URL}/courseByNameWithoutAuth/${newResolvedUrl}`)
	const homeReviewsReq = axios.get(`${process.env.API_BASE_URL}/homeReviews`)

	const [courseDetails, homeReviews] = await Promise.all([
		courseDetailsReq,
		homeReviewsReq
	])

	const maleDatesReq = axios.get(`${process.env.API_BASE_URL}/availibiltyByCourseId/${courseDetails.data.id}/male`)

	const femaleDatesReq = axios.get(`${process.env.API_BASE_URL}/availibiltyByCourseId/${courseDetails.data.id}/female`)

	const mixDatesReq = axios.get(`${process.env.API_BASE_URL}/availibiltyByCourseId/${courseDetails.data.id}/mix`)

	const courseCurriculumReq = axios.get(`${process.env.API_BASE_URL}/course/curriculumNOAuth/${courseDetails.data.id}`)


	const [maleDates, femaleDates, mixDates, courseCurriculum] = await Promise.all([
		maleDatesReq,
		femaleDatesReq,
		mixDatesReq,
		courseCurriculumReq
	])

	if (courseDetails.data == null) {
		return {
			notFound: true,
		}
	}

	return {
		props: {
			courseDetails: courseDetails.data,
			homeReviews: homeReviews.data,
			maleDates: maleDates.data,
			femaleDates: femaleDates.data,
			mixDates: mixDates.data,
			courseCurriculum: courseCurriculum.data
		}
	}
}

export default function Index(props) {
	const courseDetail = props.courseDetails ? props.courseDetails : null
	console.log(courseDetail);
	const maleDates = props.maleDates
	const femaleDates = props.femaleDates
	const mixDates = props.mixDates

	console.log(maleDates, femaleDates, mixDates);
	const homeReviews = props.homeReviews
	const courseCurriculum = props.courseCurriculum
	const ccSections = courseCurriculum?.sections.sort((a, b) => a.order - b.order)
	const [expandedSection, setExpandedSection] = useState(0);
	const router = useRouter()
	const storeData = useSelector((state) => state?.globalStore);
	const isUserLogin = storeData?.accessToken ? true : false;


	const isDateAvailable = (courseDetail.type == "physical" && maleDates.length == 0 && femaleDates.length == 0) ? false : ((courseDetail.type == "online" && mixDates.length == 0) ? false : true)
	const isSeatFullForMale = maleDates.length > 0 ? maleDates.every(obj => obj.numberOfSeats === 0) : false;
	const isSeatFullForFemale = femaleDates.length > 0 ? femaleDates.every(obj => obj.numberOfSeats === 0) : false;
	const isSeatFullForMix = mixDates.length > 0 ? mixDates.every(obj => obj.numberOfSeats === 0) : false;
	const bookSeatButtonText = (!isDateAvailable || (isSeatFullForMale && isSeatFullForFemale)) ? 'علمني عند توفر المقاعد' : (isSeatFullForMix ? 'علمني عند توفر المقاعد' : 'احجز مقعدك الآن')
	const screenWidth = useWindowSize().width
	const offset = useScrollEvent().offset

	const noOfFiles = ccSections?.flatMap((section) => section?.items?.filter((item) => item.type === 'file'))?.length
	const noOfVideos = ccSections?.flatMap((section) => section?.items?.filter((item) => item.type === 'video'))?.length
	const noOfQuizes = ccSections?.flatMap((section) => section?.items?.filter((item) => item.type === 'quiz'))?.length

	const [selectedNavItem, setSelectedNavItem] = useState(1)
	const [paddingTop, setPaddingTop] = useState(2)

	const [isMaleSubscribed, setIsMaleSubscribed] = useState(false)
	const [isFemaleSubscribed, setIsFemaleSubscribed] = useState(false)
	const [isMixSubscribed, setIsMixSubscribed] = useState(false)

	const bookSit = 'احجز جلوسك'


	const secondsToMinutes = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
	}

	const handleSlectedItem = (data, id) => {
		setSelectedNavItem(data)
		setPaddingTop(7)
		const pageTitle = document.getElementById(id)
		setTimeout(() => {
			pageTitle.scrollIntoView({ behavior: 'smooth' })
		}, 0);
	}

	const handleBookSit = (date, gender, noOfSit) => {
		if (noOfSit == 0) {
			return
		}
		router.push({
			pathname: `/${bookSit.replace(/ /g, "-")}/${(courseDetail.name).replace(/ /g, "-")}/${(courseDetail.catagory.name.replace(/ /g, "-"))}`,
			query: { date: date, gender: gender },
		})
	}

	const handleBookSitButtonClick = () => {
		if (isDateAvailable == true && bookSeatButtonText == "احجز مقعدك الآن") {
			router.push(`/${bookSit.replace(/ /g, "-")}/${(courseDetail.name).replace(/ /g, "-")}/${(courseDetail.catagory.name.replace(/ /g, "-"))}`)
		}
		else {
			const scrollToDate = handleSlectedItem(4, 'dates')
		}
	}

	const handleWheelEvent = (event) => {
		setPaddingTop(2)
	}

	const handleCourseItemClick = (id) => {
		if (!isUserLogin) {
			router.push(`/login`)
		} else {
			router.push(`/myCourse/${courseCurriculum?.course?.id}/${id}`)
		}
	}

	useEffect(() => {
		if (!courseDetail) return
		const getCourseByName = async () => {
			let data = {
				name: courseDetail?.name,
				accessToken: storeData?.accessToken
			}
			await getCourseByNameAPI(data).then((res) => {
				res.data?.subscriptions?.forEach((item) => {
					if (item.type == 'male') {
						setIsMaleSubscribed(true)
					} else if (item.type == "female") {
						setIsFemaleSubscribed(true)
					} else {
						setIsMixSubscribed(true)
					}
				})
			}).catch((err) => {
				console.log(err);
			})
		}
		getCourseByName()
	}, [courseDetail, storeData?.accessToken])

	return (
		<>
			{(courseDetail) &&
				<div onWheel={handleWheelEvent}>
					<CourseDetailsHeader courseDetail={courseDetail} bookSeatButtonText={bookSeatButtonText} handleBookSitButtonClick={handleBookSitButtonClick} />
					<div className={`${styles.courseDetailsNavbarWrapper} ${offset > (screenWidth > 1280 ? 353 : screenWidth < 1024 ? 313 : 336) ? ` ${styles.courseDetailsNavbarSticky}` : ''}`}>
						<div className='maxWidthDefault md:flex md:justify-between md:items-center'>
							{(screenWidth <= 767) ?
								<ul className={`flex justify-center py-2 border-b border-inherit bg-white z-10 list-none`}>
									<li onClick={() => handleSlectedItem(0, `header`)} className={`mx-auto fontBold ${styles.mobileTabBarFont}`}>مميزات الدورة</li>
									<li onClick={() => handleSlectedItem(4, 'dates')} className={`mx-auto fontBold ${styles.mobileTabBarFont}`}>المواعيد القادمة</li>
								</ul>
								:
								<ul className={`${styles.courseDetailsNavbar} ${offset > 313 ? `${styles.courseDetailsNavbarFixed}` : ''}`}>
									<ScrollContainer className={`flex ${styles.courseDetailsSubNavbar} `}>
										{courseDetail?.courseMetaData?.map((metaData, index) => {
											return (
												<div key={`datatitle${index}`}>
													<li onClick={() => handleSlectedItem((index + 1), `title${index + 1}`)} className={selectedNavItem == (index + 1) ? styles.activeItem : ''}>{metaData.title}</li>
												</div>
											)
										})}
										<div>
											<li onClick={() => handleSlectedItem(4, 'dates')} className={selectedNavItem == 4 ? styles.activeItem : ''}>المواعيد&nbsp;القادمة</li>
										</div>
										<div>
											<li onClick={() => handleSlectedItem(5, 'userFeedback')} className={selectedNavItem == 5 ? styles.activeItem : ''}>تجارب&nbsp;الأساطير</li>
										</div>
									</ScrollContainer>
								</ul>
							}
							{((offset > (screenWidth > 1280 ? 353 : (screenWidth < 1024 ? 313 : 336))) && !(screenWidth < 768)) &&
								<div className={styles.bookSitBtnBox}>
									<button className={`primarySolidBtn ${styles.firstBtn}`} onClick={() => handleBookSitButtonClick()}>{bookSeatButtonText}</button>
								</div>
							}
						</div>
					</div>
					{(screenWidth <= 767) &&
						<ul id={'header'} className="pr-4" style={{ paddingTop: selectedNavItem == 0 ? `${paddingTop}rem` : '2rem' }}>
							<h3 className='fontBold pb-4'>تفاصيل ثانية</h3>
							{courseDetail.courseDetailsMetaData && courseDetail.courseDetailsMetaData?.map((item, index) => {
								return (
									<li key={`courseDetailsMetaData${index}`} className='flex items-center pb-4 '>
										<div>
											<Icon height={item.icon == 'shildIcon' ? 23 : 20} width={20} iconName={`${item.icon}`} alt={'Icons'} />
										</div>
										<div className='flex flex-wrap mr-2 items-center'>
											{item.link == null || item.link.length === 0 ?
												<div className='flex items-center'>
													<p className={`fontMedium ${styles.listText}`}>{item.text}
														{item.tailLink != null && item.tailLink.length != 0 &&
															<Link href={item.tailLink ?? ""} className={`fontMedium link mx-1 ${styles.listText}`} target='_blank'>{item.tailLinkName}</Link>
														}
													</p>
												</div>
												:
												<Link href={`${item.link}` ?? ""} className={`fontMedium link ${styles.listText}`} target='_blank'>{item.text}</Link>
											}
											<p className={styles.grayText}>{item.grayedText ? `(${item.grayedText})` : ''}</p>
										</div>
									</li>
								)
							})}
						</ul>
					}
					{(screenWidth <= 767) &&
						<div className={styles.mobilePriceBox}>
							<CoursePriceBox courseDetail={courseDetail} handleBookSitButtonClick={handleBookSitButtonClick} bookSeatButtonText={bookSeatButtonText} />
						</div>
					}
					<div className={styles.courseExtraDetailsWrapper}>
						<div className={`maxWidthDefault `}>
							{courseDetail?.courseMetaData?.map((metaData, i) => {
								return (
									<div key={`courseData${i}`} id={`title${i + 1}`} style={{ paddingTop: selectedNavItem == `${i + 1}` ? `${paddingTop}rem` : '2rem' }}>
										<h1 className='head2'>{metaData.title}</h1>
										{metaData.content.search("<list>") ?
											<div className='flex pt-4'>
												<p className={styles.discriptionText}>{metaData.content}&nbsp;
													{(metaData?.tailLink != null || metaData?.tailLink?.length === 0) &&
														<Link href={metaData.tailLink ?? ""} className='link mx-1' target={'_blank'}>{metaData.tailLinkName}</Link>
													}
												</p>
											</div>
											:
											<ul className='list-disc pr-5 pt-4'>
												{metaData.content.split("<list>").splice(1, metaData.content.length).map((list, j) => {
													return (
														<li key={`courseListDescrilition${j}`} className={styles.discriptionText}>{list}</li>
													)
												})}
											</ul>
										}
									</div>
								)
							})}
							{courseDetail?.type == 'on-demand' ?
								<div id={'dates'} style={{ paddingTop: selectedNavItem == 4 ? `${paddingTop}rem` : '2rem' }} className={styles.courseCurriculumWrapper}>
									<div className='flex justify-between items-center'>
										<h1 className='head2'>محتوى الدورة </h1>
										<p className='link'>إظهار جميع الأقسام</p>
									</div>
									<p className={styles.courseContentDetailsText}>{noOfVideos} فيديو، {noOfQuizes} اختبارات، {noOfFiles} ملفات</p>
									<div>
										{ccSections?.map((section, i) => {
											return (
												<div key={`ccSection${i}`} className={styles.ccSectionWrapper}>
													<div className={`${styles.ccSectionHeaders} ${expandedSection === i ? `${styles.borderBottom0}` : ''}`} onClick={() => setExpandedSection(expandedSection === i ? null : i)}>
														<p className={`font-bold ${styles.ccSectionName}`}>{section.name}</p>
														<AllIconsComponenet height={14} width={22} iconName={'arrow'} color={'#FFFFFF'} />
													</div>
													{expandedSection === i &&
														<div className={styles.ccSectionBodyWrapper}>
															{section?.items?.sort((a, b) => a.sectionItem.order - b.sectionItem.order).map((item, j) => {
																return (
																	<div key={`ccSectionItem${j}`} className={styles.ccItemWrapper}>
																		<div className='flex items-center'>
																			{item?.type == "video" && <Icon height={24} width={24} iconName={"videoIcon"} alt={'Icons'} />}
																			{item?.type == "quiz" && <Icon height={24} width={24} iconName={"quizNotAttemptIcon"} alt={'Icons'} />}
																			{item?.type == "file" && <Icon height={24} width={24} iconName={"pdfIcon"} alt={'Icons'} />}
																			<div>
																				<p className={styles.ccItemName}>{item.name}</p>
																				{item?.type == "video" && <p className={styles.ccItemDiscription}>{secondsToMinutes(item?.duration)} دقائق</p>}
																				{item?.type == "quiz" && <p className={styles.ccItemDiscription}>{item.numberOfQuestions} سؤال</p>}
																				{item?.type == "file" && <p className={styles.ccItemDiscription}>{item.discription}</p>}
																			</div>
																		</div>
																		<div className={styles.lockItemWrapper}>
																			{item?.previewAvailable != true && <AllIconsComponenet height={24} width={20} iconName={'lock2'} color={'#0000008a'} />}
																			{item?.previewAvailable == true && <p onClick={() => handleCourseItemClick(item?.id)} className={styles.previewItemText}>شاهد مجانًا</p>}
																		</div>
																	</div>
																)
															})}
														</div>
													}
												</div>
											)
										})}
									</div>
								</div> :

								<div id={'dates'} style={{ paddingTop: selectedNavItem == 4 ? `${paddingTop}rem` : '2rem' }}>
									<h1 className='head2'>المواعيد القادمة</h1>
									{courseDetail?.type == 'physical' ?
										<>
											<div>
												<div className='flex items-center py-4'>
													<AllIconsComponenet height={36} width={18} iconName={'male'} color={'#0C5D96'} />
													<p className={`fontBold ${styles.maleDateHead}`} style={{ color: '#0C5D96' }}>مواعيد الشباب</p>
												</div>
												{maleDates?.length > 0 && !isSeatFullForMale ?
													<ScrollContainer className='flex'>
														{maleDates?.map((maleDate, index) => {
															return (
																<div key={`maleDate${index}`}>
																	<CourseDates date={maleDate} handleBookSit={handleBookSit} />
																</div>
															)
														})}
													</ScrollContainer>
													:
													<div>
														<UserDetailForm1 gender={'male'} courseDetailId={courseDetail?.id} isSubscribed={isMaleSubscribed} />
													</div>
												}
											</div>
											<div>
												<div className='flex items-center pb-4 pt-6'>
													<AllIconsComponenet height={36} width={18} iconName={'female'} color={'#E10768'} />
													<p className={`fontBold ${styles.maleDateHead}`} style={{ color: '#E10768' }}>مواعيد البنات</p>
												</div>
												{femaleDates?.length > 0 && !isSeatFullForFemale ?
													<ScrollContainer className='flex'>
														{femaleDates?.map((femaleDate, index) => {
															return (
																<div key={`femaleDate${index}`}>
																	<CourseDates date={femaleDate} handleBookSit={handleBookSit} />
																</div>
															)
														})}
													</ScrollContainer>
													:
													<div>
														<UserDetailForm1 gender={'female'} courseDetailId={courseDetail?.id} isSubscribed={isFemaleSubscribed} />
													</div>
												}
											</div>
										</>
										:
										<>
											{mixDates?.length > 0 && !isSeatFullForMix ?
												<ScrollContainer className='flex pt-4'>
													{mixDates?.map((mixDate, index) => {
														return (
															<div key={`mixDate${index}`}>
																<CourseDates date={mixDate} handleBookSit={handleBookSit} />
															</div>
														)
													})}
												</ScrollContainer>
												:
												<div>
													<UserDetailForm1 gender={'mix'} courseDetailId={courseDetail?.id} isSubscribed={isMixSubscribed} />
												</div>
											}
										</>
									}
								</div>
							}
							<div id={'userFeedback'} className='pb-8' style={{ paddingTop: selectedNavItem == 5 ? `${paddingTop}rem` : '2rem' }}>
								<h1 className='head2 pb-4'>تجارب الأساطير</h1>
								<ReviewComponent homeReviews={homeReviews} />
							</div>
						</div>
					</div>
				</div>
			}

		</>
	)
}
