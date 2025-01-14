import React, { Fragment, useEffect, useState } from 'react'
import styles from '../../../styles/PhysicalCourse.module.scss'
import CourseDetailsHeader from '../../../components/CourseDescriptionPageComponents/DetailsHeader/CourseDetailsHeader'
import Icon from '../../../components/CommonComponents/Icon'
import ScrollContainer from 'react-indiana-drag-scroll'
import CourseDates from '../../../components/CourseDescriptionPageComponents/CourseDates/CourseDates'
import UserDetailForm1 from '../../../components/CourseDescriptionPageComponents/UserDetailForm1'
import axios from 'axios';
import Link from 'next/link';
import useWindowSize from '../../../hooks/useWindoSize'
import CoursePriceBox from '../../../components/CourseDescriptionPageComponents/DetailsHeader/Common/CoursePriceBox'
import useScrollEvent from '../../../hooks/useScrollEvent'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { getAuthRouteAPI } from '../../../services/apisService'
import { getNewToken } from '../../../services/fireBaseAuthService'
import WhatsAppLinkComponent from '../../../components/CommonComponents/WhatsAppLink'
import { mediaUrl, secondsToMinutes } from '../../../constants/DataManupulation'
import ModalForVideo from '../../../components/CommonComponents/ModalForVideo/ModalForVideo'
import ReviewComponent from '../../../components/CommonComponents/ReviewsComponent/ReviewComponent';




export async function getServerSideProps(ctx) {

	const lang = ctx?.resolvedUrl.split('/')[2].split('=')[1] == 'en' ? 'en' : 'ar'
	const courseName = lang == 'en' ? ctx?.resolvedUrl.split('/')[2].split('?')[0].replace(/-/g, ' ') : ctx?.resolvedUrl.split('/')[1].replace(/-/g, ' ')
	const courseDetails = await axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=courseByNameNoAuth&name=${courseName}`).then((response) => {
		return response.data
	}).catch((error) => error);

	const homeReviewsReq = await axios.post(`${process.env.API_BASE_URL}/route`, { routeName: `allReviews` });

	console.log("homeReviewsReq: ", homeReviewsReq)

	if (((courseDetails == null) || (courseDetails?.length == 0))) {
		return {
			notFound: true,
		}
	}

	if (courseDetails?.isPurchasable == false) {
		return {
			notFound: true,
		}
	}

	if (courseDetails.type === 'physical') {
		const requests = [];
		const maleDatesReq = axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=AvailabilityByCourseIdNoAuth&courseId=${courseDetails?.id}&gender=male`);
		const femaleDatesReq = axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=AvailabilityByCourseIdNoAuth&courseId=${courseDetails?.id}&gender=female`);
		requests.push(maleDatesReq, femaleDatesReq);
		const [maleDates, femaleDates] = await Promise.all(requests);
		return {
			props: {
				courseDetails: courseDetails || null,
				maleDates: maleDates?.data || [],
				femaleDates: femaleDates?.data || [],
				homeReviews: homeReviewsReq.data
			}
		}
	} else if (courseDetails.type === 'online') {
		const mixDatesReq = await axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=AvailabilityByCourseIdNoAuth&courseId=${courseDetails?.id}&gender=mix`).then((response) => {
			return response
		}).catch((error) => {
			console.log("online course get availability error", error);
			return {
				notFound: true,
			}
		});
		return {
			props: {
				courseDetails: courseDetails,
				mixDates: mixDatesReq?.data || [],
				homeReviews: homeReviewsReq.data
			}
		}
	} else if (courseDetails?.type == 'on-demand') {
		const courseCurriculumReq = await axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=getCourseCurriculumNoAuth&courseId=${courseDetails?.id}`)
			.then((response) => (response.data))
			.catch((error) => {
				console.log("on-demand course get curriculum error", error);
				return {
					notFound: true,
				}
			});

		return {
			props: {
				courseDetails: courseDetails,
				courseCurriculum: courseCurriculumReq,
				homeReviews: homeReviewsReq.data
			}
		}
	}
}

export default function Index(props) {
	const courseDetail = props?.courseDetails ? props?.courseDetails : null
	const currentCategory = courseDetail?.catagory?.name;
	const currentCourseName = courseDetail?.name;
	const maleDates = props?.courseDetails?.type == 'physical' ? props?.maleDates.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)) : [];
	const femaleDates = props?.courseDetails?.type == 'physical' ? props?.femaleDates.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)) : [];
	const mixDates = props?.courseDetails?.type == 'online' ? props?.mixDates.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)) : [];

	const getUniqueLocations = () => {
		// Combine all arrays and handle undefined/null cases
		const allDates = [
			...(maleDates || []),
			...(femaleDates || []),
			...(mixDates || [])
		];

		// Get unique locations using Set
		const uniqueLocations = [...new Set(allDates.map(date => date.locationName))];

		return uniqueLocations;
	};

	const splitLocationIntoFields = (locations) => {
		// First split the locations into objects
		const locationsObjects = locations.map(location => {
			const [district, city] = location.split(' - ').reverse();
			return {
				city,
				district,
				fullLocation: location,
				displayText: `${city}\n${district}`
			};
		});

		// Define the desired city order
		const cityOrder = ['الرياض', 'الدمام', 'جدة'];

		// Sort based on the cityOrder array
		return locationsObjects.sort((a, b) => {
			return cityOrder.indexOf(a.city) - cityOrder.indexOf(b.city);
		});
	};

	// Usage
	const locations = getUniqueLocations();
	const sortedLocations = splitLocationIntoFields(locations);
	console.log("Sorted Locations:", sortedLocations);

	const [selectedGender, setSelectedGender] = useState('male');
	const [selectedLocation, setSelectedLocation] = useState(sortedLocations[0].fullLocation);

	const homeReviews = props?.homeReviews

	const sortedReviewsByCategory = homeReviews.reduce((acc, review) => {
		// Safely access categoryName with optional chaining
		const categoryName = review?.course?.catagory?.name;
		const courseName = review?.course?.name;

		// Check if categoryName exists and matches the current category name
		if (categoryName && categoryName === currentCategory && courseName === currentCourseName) {

			// Ensure the category key exists in the accumulator
			if (!acc[categoryName]) {
				acc[categoryName] = [];
			}

			// Add the review data to the correct category array
			acc[categoryName].push(review);
		}

		return acc;
	}, {});

	// Sort each array by the newest date (assuming the review contains a `createdAt` field)
	Object.keys(sortedReviewsByCategory).forEach(category => {
		sortedReviewsByCategory[category].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	});

	const courseCurriculum = props?.courseCurriculum
	const ccSections = courseCurriculum?.sections.sort((a, b) => a.order - b.order)
	const [expandedSection, setExpandedSection] = useState(0);
	const router = useRouter()
	// const storeData = useSelector((state) => state?.globalStore);
	const isUserLogin = localStorage.getItem('accessToken') ? true : false;
	// const isUserLogin = storeData?.accessToken ? true : false;
	const lang = courseDetail.language
	const isDateAvailable = (courseDetail.type == "physical" && maleDates.length == 0 && femaleDates.length == 0) ? false : ((courseDetail.type == "online" && mixDates.length == 0) ? false : true)
	const isSeatFullForMale = maleDates.length > 0 ? maleDates.every(obj => obj.numberOfSeats === 0) : false;
	const isSeatFullForFemale = femaleDates.length > 0 ? femaleDates.every(obj => obj.numberOfSeats === 0) : false;
	const isSeatFullForMix = mixDates.length > 0 ? mixDates.every(obj => obj.numberOfSeats === 0) : false;

	const bookSeatButtonENText = (!isDateAvailable || (isSeatFullForMale && isSeatFullForFemale)) ? 'Notify me' : (isSeatFullForMix ? 'Notify me' : courseDetail.type === 'on-demand' ? 'Reserve your seat now' : 'Explore shcedules');
	const bookSeatButtonARText = (!isDateAvailable || (isSeatFullForMale && isSeatFullForFemale)) ? 'علمني عند توفر المقاعد' : (isSeatFullForMix ? 'علمني عند توفر المقاعد' : courseDetail.type === 'on-demand' ? 'اشترك الآن' : 'تصفّح المواعيد');
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
	const [coursePageUrl, setCoursePageUrl] = useState()

	const handleSlectedItem = (data, id) => {
		setSelectedNavItem(data)
		setPaddingTop(7)
		const pageTitle = document.getElementById(id)
		setTimeout(() => {
			pageTitle.scrollIntoView({ behavior: 'smooth' })
		}, 0);
	}

	const handleUserLogin = async (query) => {
		// if (!isUserLogin) {
		// 	// if (storeData?.accessToken === null) {
		// 	dispatch({
		// 		type: 'SET_RETURN_URL',
		// 		returnUrl: coursePageUrl
		// 	});
		// 	router.push({
		// 		pathname: "/login",
		// 	})
		// } else {
		// 	let data = {
		// 		routeName: 'categories'
		// 	}
		// 	await getAuthRouteAPI(data).then((res) => {
		// 		router.push({
		// 			pathname: `/${bookSit.replace(/ /g, "-")}/${(courseDetail.name).replace(/ /g, "-")}/${(courseDetail.catagory.name.replace(/ /g, "-"))}`,
		// 			query: query ? query : "",
		// 		})
		// 	}).catch(async (error) => {
		// 		console.log(error);
		// 		if (error?.response?.status == 401) {
		// 			await getNewToken().then(async (token) => {
		// 				await getAuthRouteAPI(data).then((res) => {
		// 					router.push({
		// 						pathname: `/${bookSit.replace(/ /g, "-")}/${(courseDetail.name).replace(/ /g, "-")}/${(courseDetail.catagory.name.replace(/ /g, "-"))}`,
		// 						query: query ? query : "",
		// 					})
		// 				})
		// 			}).catch(error => {
		// 				console.error("Error:", error);
		// 			});
		// 		}
		// 	})
		// }

		let data = {
			routeName: 'categories'
		}

		router.push({
			pathname: `/${bookSit.replace(/ /g, "-")}/${(courseDetail.name).replace(/ /g, "-")}/${(courseDetail.catagory.name.replace(/ /g, "-"))}`,
			query: query ? query : "",
		})
	}

	const handleBookSit = async (date, gender, noOfSit, regionId) => {
		if (noOfSit == 0) {
			return
		} else {
			let query = { date: date, gender: gender, region: regionId }
			handleUserLogin(query)
		}
	}

	const handleBookSitButtonClick = () => {
		// if (isDateAvailable == true && (bookSeatButtonText == "تصفح المواعيد" || bookSeatButtonText == 'اشترك الآن' || bookSeatButtonText == "Reserve your seat now" || bookSeatButtonText == "Explore shcedules")) {
		// 	handleUserLogin()
		// }
		// else {
		// 	handleSlectedItem(4, 'dates')
		// }
		handleUserLogin();
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
		setCoursePageUrl(`/${(courseDetail.name).replace(/ /g, "-")}/${(courseDetail.catagory.name.replace(/ /g, "-"))}`)
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
		if (isUserLogin) {
			getCourseByName()
		}
	}, [courseDetail, isUserLogin])

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
									{/* <li onClick={() => handleSlectedItem(0, `header`)} className={`mx-auto pt-3 pb-2 px-4 fontMedium ${styles.mobileTabBarFont} ${selectedNavItem == 0 ? styles.activeItemMobile : ''}`}>{lang == 'en' ? 'Course features' : `مميزات الدورة`}</li>
									<li onClick={() => handleSlectedItem(4, 'dates')} className={`mx-auto pt-3 pb-2 px-4 fontMedium ${styles.mobileTabBarFont} ${selectedNavItem == 4 ? styles.activeItemMobile : ''}`}>{lang == 'en' ? `Upcoming appointments` : `المواعيد القادمة`}</li> */}
									{courseDetail?.courseMetaData?.map((metaData, index) => {
										return (
											<div key={`datatitle${index}`}>
												<li onClick={() => handleSlectedItem((index + 1), `title${index + 1}`)} className={`mx-auto pt-3 pb-2 px-4 fontMedium ${styles.mobileTabBarFont} ${selectedNavItem == (index + 1) ? styles.activeItemMobile : ''}`}>{metaData.title}</li>
											</div>
										)
									})}
									<div>
										{/* {courseDetail?.type == 'on-demand' ?
												<li onClick={() => handleSlectedItem(4, 'dates')} className={`${selectedNavItem == 4 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}> {lang == 'en' ? `Course Content` : ` محتوى الدورة`}</li>
												:
												<li onClick={() => handleSlectedItem(4, 'dates')} className={`${selectedNavItem == 4 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}> {lang == 'en' ? `Upcoming appointments` : `المواعيد القادمة`}</li>
											} */}
										{courseDetail?.type == 'on-demand' &&
											<li onClick={() => handleSlectedItem(4, 'dates')} className={`mx-auto pt-3 pb-2 px-4 fontMedium ${styles.mobileTabBarFont} ${selectedNavItem == 4 ? styles.activeItemMobile : ''}`}> {lang == 'en' ? `Course Content` : ` محتوى الدورة`}</li>
										}
									</div>
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
											{/* {courseDetail?.type == 'on-demand' ?
												<li onClick={() => handleSlectedItem(4, 'dates')} className={`${selectedNavItem == 4 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}> {lang == 'en' ? `Course Content` : ` محتوى الدورة`}</li>
												:
												<li onClick={() => handleSlectedItem(4, 'dates')} className={`${selectedNavItem == 4 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}> {lang == 'en' ? `Upcoming appointments` : `المواعيد القادمة`}</li>
											} */}
											{courseDetail?.type == 'on-demand' &&
												<li onClick={() => handleSlectedItem(4, 'dates')} className={`${selectedNavItem == 4 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}> {lang == 'en' ? `Course Content` : ` محتوى الدورة`}</li>
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
							
							{sortedReviewsByCategory[currentCategory] && (<div id={'userFeedback'} className='pb-8' style={{ paddingTop: selectedNavItem == 5 ? `${paddingTop}rem` : '2rem' }}>
								<h1 className='head2 pb-4'>{lang == 'en' ? `Ostori’s feedback` : `تجارب الأساطير`}</h1>
								<ReviewComponent homeReviews={sortedReviewsByCategory[currentCategory]} />
							</div>)}

							{courseDetail?.type == 'on-demand' ?
								<div id={'dates'} style={{ paddingTop: selectedNavItem == 4 ? `${paddingTop}rem` : '2rem' }} className={styles.courseCurriculumWrapper}>
									<div className='flex justify-between items-center'>
										<h1 className='head2'>محتوى الدورة </h1>
										{/* <p className='link'>إظهار جميع الأقسام</p> */}
									</div>
									<p className={styles.courseContentDetailsText}>{noOfVideos > 0 && <span>{noOfVideos} فيديو</span>} {noOfQuizes > 0 && <span>{noOfQuizes} اختبارات</span>} {noOfFiles > 0 && <span>{noOfFiles} ملفات</span>} </p>
									<div>
										{ccSections?.map((section, i) => {
											return (
												<div key={`ccSection${i}`} className={styles.ccSectionWrapper}>
													<div className={`${styles.ccSectionHeaders} ${expandedSection === i ? `${styles.borderBottom0}` : ''}`} onClick={() => setExpandedSection(expandedSection === i ? null : i)}>
														<p className={`font-bold ${styles.ccSectionName}`}>{section.name}</p>
														<div style={{ height: '20px' }} className={` ${expandedSection === i && 'rotate-180'}`}>
															<AllIconsComponenet height={22} width={22} iconName={'keyBoardDownIcon'} color={'#FFFFFF'} />
														</div>
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
											{/* Location Selection */}
											<div className="mb-6">
												<h2 className="text-right mb-2 text-gray-600">الفرع</h2>
												<p className="text-right text-sm mb-2">بناءً عليه يوريك المواعيد المتوفرة</p>
												<div className="flex justify-start gap-2">
													{sortedLocations.map(loc => (
														<button
															key={loc.city}
															className={`px-4 py-2 ${selectedLocation === loc.fullLocation
																? 'bg-[#F26722] text-white rounded-lg'
																: 'bg-white rounded-lg'
																} hover:opacity-90 transition-opacity`}
															style={{
																clipPath: 'inset(0 round 8px)',
																filter: 'drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.1))'
															}}
															onClick={() => setSelectedLocation(loc.fullLocation)}
														>
															<div className="flex flex-col items-center">
																<div>{loc.city}</div>
																<div className="text-sm">{loc.district}</div>
															</div>
														</button>
													))}
												</div>
											</div>

											{/* Gender Selection */}
											<div className="mb-6">
												<h2 className="text-right mb-2">اختر الموعد المناسب لك</h2>
												<div className="flex justify-start gap-2">
													<button
														className={`px-4 py-2 ${selectedGender === 'male'
															? 'bg-[#F26722] text-white rounded-lg'
															: 'bg-white rounded-lg'
															} hover:opacity-90 transition-opacity`}
														style={{
															clipPath: 'inset(0 round 8px)',
															filter: 'drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.1))'
														}}
														onClick={() => setSelectedGender('male')}
													>
														مواعيد الشباب
													</button>
													<button
														className={`px-4 py-2 ${selectedGender === 'female'
															? 'bg-[#F26722] text-white rounded-lg'
															: 'bg-white rounded-lg'
															} hover:opacity-90 transition-opacity`}
														style={{
															clipPath: 'inset(0 round 8px)',
															filter: 'drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.1))'
														}}
														onClick={() => setSelectedGender('female')}
													>
														مواعيد البنات
													</button>
												</div>
											</div>

											<ScrollContainer className="flex">
												{selectedGender === 'male' ?
													maleDates
														?.filter(date => date.locationName === selectedLocation)
														.map((date, index) => (
															<Fragment key={`maleDate${index}`}>
																<CourseDates
																	date={date}
																	handleBookSit={handleBookSit}
																	lang={lang}
																/>
															</Fragment>
														))
													:
													femaleDates
														?.filter(date => date.locationName === selectedLocation)
														.map((date, index) => (
															<Fragment key={`femaleDate${index}`}>
																<CourseDates
																	date={date}
																	handleBookSit={handleBookSit}
																	lang={lang}
																/>
															</Fragment>
														))
												}
											</ScrollContainer>
										</>
										:
										<>
											<div className="mb-6">
												<h2 className="text-right mb-2">اختر الموعد المناسب لك</h2>
											</div>
											{mixDates?.length > 0 && !isSeatFullForMix ?
												<ScrollContainer className='flex'>
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
													<UserDetailForm1 coursePageUrl={coursePageUrl} gender={'mix'} courseDetailId={courseDetail?.id} isSubscribed={isMixSubscribed} lang={lang} />
												</div>
											}
										</>
									}
								</div>
							}

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
