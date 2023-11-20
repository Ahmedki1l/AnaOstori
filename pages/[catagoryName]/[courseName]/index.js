import React, { Fragment, useEffect, useState } from 'react'
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
import { getAuthRouteAPI } from '../../../services/apisService'
import { getNewToken } from '../../../services/fireBaseAuthService'
import WhatsAppLinkComponent from '../../../components/CommonComponents/WhatsAppLink'
import { mediaUrl, secondsToMinutes } from '../../../constants/DataManupulation'
import ModalForVideo from '../../../components/CommonComponents/ModalForVideo/ModalForVideo'




export async function getServerSideProps(ctx) {
	const lang = ctx?.resolvedUrl.split('/')[2].split('=')[1] == 'en' ? 'en' : 'ar'
	const courseName = lang == 'en' ? ctx?.resolvedUrl.split('/')[2].split('?')[0].replace(/-/g, ' ') : ctx?.resolvedUrl.split('/')[1].replace(/-/g, ' ')
	const courseDetailsReq = axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=courseByNameNoAuth&name=${courseName}`)
	// const homeReviewsReq = axios.get(`${process.env.API_BASE_URL}/homeReviews`)


	// const [courseDetails, homeReviews] = await Promise.all([
	// 	courseDetailsReq,
	// 	homeReviewsReq
	// ])
	const [courseDetails] = await Promise.all([
		courseDetailsReq,
	])

	const maleDatesReq = axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=AvailabilityByCourseIdNoAuth&courseId=${courseDetails.data.id}&gender=male`)

	const femaleDatesReq = axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=AvailabilityByCourseIdNoAuth&courseId=${courseDetails.data.id}&gender=female`)

	const mixDatesReq = axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=AvailabilityByCourseIdNoAuth&courseId=${courseDetails.data.id}&gender=mix`)


	const [maleDates, femaleDates, mixDates] = await Promise.all([
		maleDatesReq,
		femaleDatesReq,
		mixDatesReq,
	])
	if (courseDetails.data == null) {
		return {
			notFound: true,
		}
	}
	if (courseDetails.data.isPurchasable == false) {
		return {
			notFound: true,
		}
	}
	if (courseDetails.data.type == 'on-demand') {
		const courseCurriculumReq = await axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=getCourseCurriculumNoAuth&courseId=${courseDetails.data.id}`)
			.then((response) => (response.data))
			.catch((error) => error);

		return {
			props: {
				courseDetails: courseDetails.data,
				// homeReviews: homeReviews.data,
				maleDates: maleDates.data,
				femaleDates: femaleDates.data,
				mixDates: mixDates.data,
				courseCurriculum: courseCurriculumReq
			}
		}
	} else {
		return {
			props: {
				courseDetails: courseDetails.data,
				// homeReviews: homeReviews.data,
				maleDates: maleDates.data,
				femaleDates: femaleDates.data,
				mixDates: mixDates.data,
			}
		}
	}
}

export default function Index(props) {
	const courseDetail = props.courseDetails ? props.courseDetails : null
	const maleDates = props.maleDates
	const femaleDates = props.femaleDates
	const mixDates = props.mixDates
	const homeReviews = props.homeReviews
	const courseCurriculum = props.courseCurriculum
	const ccSections = courseCurriculum?.sections.sort((a, b) => a.order - b.order)
	const [expandedSection, setExpandedSection] = useState(0);
	const router = useRouter()
	const storeData = useSelector((state) => state?.globalStore);
	const isUserLogin = storeData?.accessToken ? true : false;
	const lang = courseDetail.language
	const isDateAvailable = (courseDetail.type == "physical" && maleDates.length == 0 && femaleDates.length == 0) ? false : ((courseDetail.type == "online" && mixDates.length == 0) ? false : true)
	const isSeatFullForMale = maleDates.length > 0 ? maleDates.every(obj => obj.numberOfSeats === 0) : false;
	const isSeatFullForFemale = femaleDates.length > 0 ? femaleDates.every(obj => obj.numberOfSeats === 0) : false;
	const isSeatFullForMix = mixDates.length > 0 ? mixDates.every(obj => obj.numberOfSeats === 0) : false;

	const bookSeatButtonENText = (!isDateAvailable || (isSeatFullForMale && isSeatFullForFemale)) ? 'Notify me' : (isSeatFullForMix ? 'Notify me' : 'Reserve your seat now')
	const bookSeatButtonARText = (!isDateAvailable || (isSeatFullForMale && isSeatFullForFemale)) ? 'علمني عند توفر المقاعد' : (isSeatFullForMix ? 'علمني عند توفر المقاعد' : 'احجز مقعدك الآن')
	const bookSeatButtonText = (lang == 'en' ? bookSeatButtonENText : bookSeatButtonARText)

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
	const dispatch = useDispatch();
	const [discountShow, setDiscountShow] = useState(false)


	const [videoModalOpen, setVideoModalOpen] = useState(false)
	const [fileSrc, setFileSrc] = useState()


	const handleSlectedItem = (data, id) => {
		setSelectedNavItem(data)
		setPaddingTop(7)
		const pageTitle = document.getElementById(id)
		setTimeout(() => {
			pageTitle.scrollIntoView({ behavior: 'smooth' })
		}, 0);
	}

	const handleUserLogin = async (query) => {
		if (storeData?.accessToken == "") {
			dispatch({
				type: 'SET_RETURN_URL',
				returnUrl: `/${(courseDetail.name).replace(/ /g, "-")}/${(courseDetail.catagory.name.replace(/ /g, "-"))}`
			});
			router.push({
				pathname: "/login",
			})
		} else {
			let data = {
				routeName: 'categories'
			}
			await getAuthRouteAPI(data).then((res) => {
				router.push({
					pathname: `/${bookSit.replace(/ /g, "-")}/${(courseDetail.name).replace(/ /g, "-")}/${(courseDetail.catagory.name.replace(/ /g, "-"))}`,
					query: query ? query : "",
				})
			}).catch(async (error) => {
				console.log(error);
				if (error?.response?.status == 401) {
					await getNewToken().then(async (token) => {
						await getAuthRouteAPI(data).then((res) => {
							router.push({
								pathname: `/${bookSit.replace(/ /g, "-")}/${(courseDetail.name).replace(/ /g, "-")}/${(courseDetail.catagory.name.replace(/ /g, "-"))}`,
								query: query ? query : "",
							})
						})
					}).catch(error => {
						console.error("Error:", error);
					});
				}
			})
		}
	}

	const handleBookSit = async (date, gender, noOfSit) => {
		if (noOfSit == 0) {
			return
		} else {
			let query = { date: date, gender: gender }
			handleUserLogin(query)
		}
	}

	const handleBookSitButtonClick = () => {
		if (isDateAvailable == true && (bookSeatButtonText == "احجز مقعدك الآن" || bookSeatButtonText == "Reserve your seat now")) {
			handleUserLogin()
		}
		else {
			handleSlectedItem(4, 'dates')
		}
	}

	const handleWheelEvent = (event) => {
		setPaddingTop(2)
	}

	const handleCourseItemClick = (item) => {
		if (item.type == 'video') {
			setFileSrc(mediaUrl(item.linkBucket, item.linkKey))
			setVideoModalOpen(true)
		}
		else if (item.type == 'file') {
			window.open(mediaUrl(item.linkBucket, item.linkKey))
		}
		else {
			window.open(item.linkKey)
		}
	};

	useEffect(() => {
		if (!courseDetail) return
		const getCourseByName = async () => {
			let data = {
				routeName: 'courseByName',
				name: courseDetail?.name,
			}
			await getAuthRouteAPI(data).then((res) => {
				res.data?.subscriptions?.forEach((item) => {
					if (item.type == 'male') {
						setIsMaleSubscribed(true)
					} else if (item.type == "female") {
						setIsFemaleSubscribed(true)
					} else {
						setIsMixSubscribed(true)
					}
				})
			}).catch(async (err) => {
				console.log("error", err);
				if (err?.response?.status == 401) {
					await getNewToken().then(async (token) => {
						await getAuthRouteAPI(data).then((res) => {
							res.data?.subscriptions?.forEach((item) => {
								if (item.type == 'male') {
									setIsMaleSubscribed(true)
								} else if (item.type == "female") {
									setIsFemaleSubscribed(true)
								} else {
									setIsMixSubscribed(true)
								}
							})
						})
					}).catch(error => {
						console.error("Error:", error);
					});
				}
			})
		}
		getCourseByName()
	}, [courseDetail])

	useEffect(() => {
		if (screenWidth < 768) {
			setSelectedNavItem(0)
		} else if (screenWidth > 767) {
			setSelectedNavItem(1)
		}
	}, [screenWidth])

	return (
		<>
			{(courseDetail) &&
				<div onWheel={handleWheelEvent} dir={lang == "en" ? 'ltr' : 'rtl'}>
					<CourseDetailsHeader
						courseDetail={courseDetail}
						bookSeatButtonText={bookSeatButtonText}
						handleBookSitButtonClick={handleBookSitButtonClick}
						lang={lang}
						setDiscountShow={setDiscountShow}
						discountShow={discountShow}
					/>
					<div className={`${styles.courseDetailsNavbarWrapper} ${offset > (screenWidth > 1280 ? 353 : screenWidth < 1024 ? 313 : 336) ? ` ${styles.courseDetailsNavbarSticky}` : ''}`}>
						<div className='maxWidthDefault md:flex md:justify-between md:items-center'>
							{(screenWidth <= 767) ?
								<ul className={`flex justify-center border-b border-inherit bg-white z-10 list-none`}>
									<li onClick={() => handleSlectedItem(0, `header`)} className={`mx-auto pt-3 pb-2 px-4 fontMedium ${styles.mobileTabBarFont} ${selectedNavItem == 0 ? styles.activeItemMobile : ''}`}>{lang == 'en' ? 'Course features' : `مميزات الدورة`}</li>
									<li onClick={() => handleSlectedItem(4, 'dates')} className={`mx-auto pt-3 pb-2 px-4 fontMedium ${styles.mobileTabBarFont} ${selectedNavItem == 4 ? styles.activeItemMobile : ''}`}>{lang == 'en' ? `Upcoming appointments` : `المواعيد القادمة`}</li>
								</ul>
								:
								<ul className={`${styles.courseDetailsNavbar} ${offset > 313 ? `${styles.courseDetailsNavbarFixed}` : ''}`}>
									<ScrollContainer className={`flex ${styles.courseDetailsSubNavbar} `}>
										{courseDetail?.courseMetaData?.map((metaData, index) => {
											return (
												<div key={`datatitle${index}`}>
													<li onClick={() => handleSlectedItem((index + 1), `title${index + 1}`)} className={`${selectedNavItem == (index + 1) ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}>{metaData.title}</li>
												</div>
											)
										})}
										<div>
											{courseDetail?.type == 'on-demand' ?
												<li onClick={() => handleSlectedItem(4, 'dates')} className={`${selectedNavItem == 4 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}> {lang == 'en' ? `Course Content` : ` محتوى الدورة`}</li>
												:
												<li onClick={() => handleSlectedItem(4, 'dates')} className={`${selectedNavItem == 4 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}> {lang == 'en' ? `Upcoming appointments` : `المواعيد القادمة`}</li>
											}
										</div>
										{/* <div>
											<li onClick={() => handleSlectedItem(5, 'userFeedback')} className={`${selectedNavItem == 5 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}>{lang == 'en' ? `Ostori’s feedback` : `تجارب الأساطير`} </li>
										</div> */}
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
						<div className={` ${styles.mobilePriceBox} ${offset > 512 ? ` ${styles.fixedMobilePriceBox}` : ''}`}>
							<CoursePriceBox
								courseDetail={courseDetail}
								handleBookSitButtonClick={handleBookSitButtonClick}
								bookSeatButtonText={bookSeatButtonText}
								setDiscountShow={setDiscountShow}
								discountShow={discountShow}
							/>
						</div>
					}
					{(screenWidth <= 767) &&
						<ul id={'header'} className="px-4" style={{ paddingTop: selectedNavItem == 0 ? `${paddingTop}rem` : '2rem' }}>
							<h3 className='fontBold pb-4'>{lang == 'en' ? `Subscription Info` : `تفاصيل الاشتراك`}</h3>
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
					<div className={styles.courseExtraDetailsWrapper}>
						<div className={`maxWidthDefault `}>
							{courseDetail?.courseMetaData?.map((metaData, i) => {
								return (
									<div key={`courseData${i}`} id={`title${i + 1}`} style={{ paddingTop: selectedNavItem == `${i + 1}` ? `${paddingTop}rem` : '2rem' }}>
										<h1 className='head2'>{metaData.title}</h1>
										{!metaData.content.includes("<list>") ?
											<div className='flex pt-4'>
												{metaData.link ?
													<Link href={metaData.link} className={`${styles.discriptionText} link`} target={'_blank'}>{metaData.content}</Link>
													:
													<p className={styles.discriptionText}>{metaData.content}&nbsp;
														{(metaData?.tailLink != null || metaData?.tailLink?.length === 0) &&
															<Link href={metaData.tailLink ?? ""} className='link mx-1' target={'_blank'}>{metaData.tailLinkName}</Link>
														}
													</p>
												}
											</div>
											:
											<ul className='list-disc pr-5 pt-4'>
												{metaData.content.split("<list>").map((list, j) => {
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
										{/* <p className='link'>إظهار جميع الأقسام</p> */}
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
																			<div>
																				<AllIconsComponenet height={24} width={24} iconName={`${item?.type == "video" ? 'curriculumNewVideoIcon' : item?.type == "file" ? 'curriculumNewFileIcon' : 'curriculumNewQuizIcon'}`} color={'#F26722'} />
																			</div>
																			<div>
																				<p className={styles.ccItemName}>{item.name}</p>
																				<p className={styles.ccItemDiscription}>
																					{item?.type == "video" ? `${secondsToMinutes(item?.duration)} دقائق` :
																						item?.type == "quiz" ? `${item.numberOfQuestions} سؤال` :
																							`${item.discription}`}
																				</p>
																			</div>
																		</div>
																		<div className={styles.lockItemWrapper}>
																			{item?.sectionItem?.freeUsage != true && <AllIconsComponenet height={24} width={20} iconName={'lock2'} color={'#0000008a'} />}
																			{item?.sectionItem?.freeUsage == true && <p onClick={() => handleCourseItemClick(item)} className={styles.previewItemText}>شاهد مجانًا</p>}
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
								</div>
								:
								<div id={'dates'} style={{ paddingTop: selectedNavItem == 4 ? `${paddingTop}rem` : '2rem' }}>
									<h1 className='head2'>{lang == 'en' ? `Upcoming appointments` : `المواعيد القادمة`}</h1>
									{courseDetail?.type == 'physical' ?
										<>
											<div className='flex items-center py-4'>
												<AllIconsComponenet height={36} width={18} iconName={'male'} color={'#0C5D96'} />
												<p className={`fontBold ${styles.maleDateHead}`} style={{ color: '#0C5D96' }}>{lang == "en" ? "Male Appointments" : "مواعيد الشباب"}</p>
											</div>
											{maleDates?.length > 0 && !isSeatFullForMale ?
												<ScrollContainer className='flex'>
													{maleDates?.map((maleDate, index) => {
														return (
															<Fragment key={`maleDate${index}`}>
																<CourseDates date={maleDate} handleBookSit={handleBookSit} lang={lang} />
															</Fragment>
														)
													})}
												</ScrollContainer>
												:
												<div>
													<UserDetailForm1 gender={'male'} courseDetailId={courseDetail?.id} isSubscribed={isMaleSubscribed} lang={lang} />
												</div>
											}
											<div className='flex items-center pb-4 pt-6'>
												<AllIconsComponenet height={36} width={18} iconName={'female'} color={'#E10768'} />
												<p className={`fontBold ${styles.maleDateHead}`} style={{ color: '#E10768' }}>{lang == 'en' ? 'Female Appointments' : 'مواعيد البنات'}</p>
											</div>
											{femaleDates?.length > 0 && !isSeatFullForFemale ?
												<ScrollContainer className='flex'>
													{femaleDates?.map((femaleDate, index) => {
														return (
															<Fragment key={`femaleDate${index}`}>
																<CourseDates date={femaleDate} handleBookSit={handleBookSit} lang={lang} />
															</Fragment>
														)
													})}
												</ScrollContainer>
												:
												<div>
													<UserDetailForm1 gender={'female'} courseDetailId={courseDetail?.id} isSubscribed={isFemaleSubscribed} lang={lang} />
												</div>
											}
										</>
										:
										<>
											{mixDates?.length > 0 && !isSeatFullForMix ?
												<ScrollContainer className='flex pt-4'>
													{mixDates?.map((mixDate, index) => {
														return (
															<Fragment key={`mixDate${index}`}>
																<CourseDates date={mixDate} handleBookSit={handleBookSit} lang={lang} />
															</Fragment>
														)
													})}
												</ScrollContainer>
												:
												<div>
													<UserDetailForm1 gender={'mix'} courseDetailId={courseDetail?.id} isSubscribed={isMixSubscribed} lang={lang} />
												</div>
											}
										</>
									}
								</div>
							}
							{/* <div id={'userFeedback'} className='pb-8' style={{ paddingTop: selectedNavItem == 5 ? `${paddingTop}rem` : '2rem' }}>
								<h1 className='head2 pb-4'>{lang == 'en' ? `Ostori’s feedback` : `تجارب الأساطير`}</h1>
								<ReviewComponent homeReviews={homeReviews} />
							</div> */}
						</div>
					</div>
					<WhatsAppLinkComponent isBookSeatPageOpen={true} courseDetail={courseDetail} discountShow={discountShow} />
					{videoModalOpen &&
						<ModalForVideo
							videoModalOpen={videoModalOpen}
							setVideoModalOpen={setVideoModalOpen}
							sourceFile={fileSrc}
						/>
					}
				</div>
			}
		</>
	)
}
