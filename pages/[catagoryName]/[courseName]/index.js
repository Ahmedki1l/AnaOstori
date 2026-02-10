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
import { ContentRenderer } from '../../../components/Markdown/ContentRenderer';
import { toast } from 'react-toastify';



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
		const mixDatesReq = axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=AvailabilityByCourseIdNoAuth&courseId=${courseDetails?.id}&gender=mix`);
		requests.push(maleDatesReq, femaleDatesReq, mixDatesReq);
		const [maleDates, femaleDates, mixDates] = await Promise.all(requests);
		return {
			props: {
				courseDetails: courseDetails || null,
				maleDates: maleDates?.data || [],
				femaleDates: femaleDates?.data || [],
				mixDates: mixDates?.data || [],
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
	const mixDates = props?.courseDetails?.type == 'online' ? props?.mixDates.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)) : props?.courseDetails?.type == 'physical' ? props?.mixDates.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)) : [];

	const hasDates = maleDates.length > 0 || femaleDates.length > 0 || mixDates.length > 0;

	const getUniqueLocations = () => {
		// Combine all arrays and handle undefined/null cases
		const allDates = [
			...(maleDates || []),
			...(femaleDates || []),
			...(mixDates || [])
		];

		// Get unique full locations
		const uniqueLocations = [...new Set(
			allDates.map(date => date.locationName)
		)];

		// Group locations by city
		const cityGroups = uniqueLocations.reduce((acc, location) => {
			const [district, city] = location.split(' - ').reverse();
			if (!acc[city]) {
				acc[city] = [];
			}
			acc[city].push(location);
			return acc;
		}, {});

		// Process each city group that has duplicates
		const processedLocations = Object.entries(cityGroups).flatMap(([city, locations]) => {
			// If no duplicates, return locations as is
			if (locations.length <= 1) {
				return locations;
			}

			// Count locations with "حي"
			const withHay = locations.filter(loc => loc.includes('حي')).length;
			const withoutHay = locations.length - withHay;

			// Decide whether to keep "حي" versions based on majority
			const keepHayVersion = withHay >= withoutHay;

			// Filter locations based on the decision
			if (keepHayVersion) {
				const hayLocation = locations.find(loc => loc.includes('حي'));
				return hayLocation ? [hayLocation] : [locations[0]];
			} else {
				const nonHayLocation = locations.find(loc => !loc.includes('حي'));
				return nonHayLocation ? [nonHayLocation] : [locations[0]];
			}
		});

		return processedLocations;
	};

	const splitLocationIntoFields = (locations) => {
		// First split the locations into objects and ensure districts start with "حي"
		const locationsObjects = locations.map(location => {
			const [district, city] = location.split(' - ').reverse();

			// Add "حي" prefix if the district doesn't start with it
			let processedDistrict = district;
			if (!district.startsWith('حي ')) {
				processedDistrict = `حي ${district}`;
			}

			// Reconstruct the full location with the processed district
			const fullLocation = `${processedDistrict} - ${city}`;

			return {
				city,
				district: processedDistrict,
				fullLocation,
				displayText: `${city}\n${processedDistrict}`
			};
		});

		// Define the desired city order
		const cityOrder = ['الرياض', 'الدمام', 'جدة'];

		// Sort based on the cityOrder array, with a secondary sort on district
		return locationsObjects.sort((a, b) => {
			// First, sort by city order
			const cityComparison = cityOrder.indexOf(a.city) - cityOrder.indexOf(b.city);

			// If cities are the same or both not in cityOrder, sort by district
			if (cityComparison === 0) {
				return a.district.localeCompare(b.district);
			}

			return cityComparison;
		});
	};

	// Usage
	const locations = getUniqueLocations();
	const sortedLocations = splitLocationIntoFields(locations);

	const [selectedGender, setSelectedGender] = useState('male');
	const [selectedLocation, setSelectedLocation] = useState(
		sortedLocations?.[0]?.city ?? null
	);

	// Helper function to extract unique district objects (with city and district) from all dates
	const getUniqueDistrictsWithCity = () => {
		// Combine all dates from male, female, and mix
		const allDates = [
			...(maleDates || []),
			...(femaleDates || []),
			...(mixDates || [])
		];
		console.log("🚀 ~ getUniqueDistrictsWithCity ~ allDates:", allDates)

		const uniqueSet = new Set();
		const uniqueLocations = [];

		allDates.forEach(date => {
			const location = date.locationName;
			if (location) {
				// Assuming a locationName is like "الرياض - طويق"
				// The original code reversed the split, so that:
				//   const [district, city] = location.split(' - ').reverse();
				// In our example, splitting "الرياض - طويق" yields ["الرياض", "طويق"].
				// Reversing it gives: district = "طويق", city = "الرياض".
				const parts = location.split(' - ');
				if (parts.length >= 2) {
					const [districtRaw, cityRaw] = parts.reverse();
					// Ensure the district starts with "حي "
					let processedDistrict = districtRaw;
					if (!districtRaw.startsWith('حي ')) {
						processedDistrict = `حي ${districtRaw}`;
					}
					// Create a unique key combining city and processed district
					const key = `${cityRaw}-${processedDistrict}`;
					if (!uniqueSet.has(key)) {
						uniqueSet.add(key);
						uniqueLocations.push({ city: cityRaw, district: processedDistrict });
					}
				}
			}
		});
		return uniqueLocations;
	};

	// Custom order for cities
	const customCityOrder = ["الرياض", "الدمام", "جدة"];

	// New getDistrictsByCity using the unique district objects
	const getDistrictsByCity = () => {
		const uniqueLocations = getUniqueDistrictsWithCity();
		// Group by city: key is city, value is an array of unique districts
		const districtsByCity = uniqueLocations.reduce((acc, { city, district }) => {
			if (!acc[city]) {
				acc[city] = [];
			}
			acc[city].push(district);
			return acc;
		}, {});

		// Create a new mapping with cities in the specified order
		const sortedMapping = {};
		customCityOrder.forEach((city) => {
			if (districtsByCity[city]) {
				sortedMapping[city] = districtsByCity[city];
			}
		});

		// Optionally, append any cities not in the custom order (e.g., in alphabetical order)
		Object.keys(districtsByCity).forEach((city) => {
			if (!customCityOrder.includes(city)) {
				sortedMapping[city] = districtsByCity[city];
			}
		});

		return sortedMapping;
	};

	// Usage:
	const districtsMapping = getDistrictsByCity();

	// Extract cities from the mapping keys
	const initialCities = Object.keys(districtsMapping);

	// Initialize state variables:
	const defaultCity = initialCities.includes("الرياض") ? "الرياض" : (initialCities[0] || null);
	const [selectedCity, setSelectedCity] = useState(defaultCity);

	// For districts, initialize with districts corresponding to the first city
	const [districts, setDistricts] = useState(selectedCity ? districtsMapping[selectedCity] : []);
	const [selectedDistrict, setSelectedDistrict] = useState(districts[0] || null);

	// Also store cities in state if needed elsewhere
	const [cities, setCities] = useState(initialCities);

	// Optional: update districts and selected district when selectedCity changes
	useEffect(() => {
		if (selectedCity) {
			const newDistricts = districtsMapping[selectedCity] || [];
			setDistricts(newDistricts);
			setSelectedDistrict(newDistricts[0] || null);
		}
	}, [selectedCity]);

	// useEffect(() => {
	// 	if (sortedLocations && sortedLocations.length > 0) {
	// 		const cityList = sortedLocations.map(loc => loc.city);
	// 		const districtList = sortedLocations.map(loc => loc.district);
	// 		setCities([...new Set(cityList)]);      // Ensure cities are unique
	// 		setDistricts([...new Set(districtList)]); // Ensure districts are unique
	// 	}
	// 	console.log("🚀 ~ cities:", cities);
	// 	console.log("🚀 ~ districts:", districts);
	// }, [sortedLocations]);

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
	const isDateAvailable = (courseDetail.type == "physical" && maleDates.length == 0 && femaleDates.length == 0 && mixDates.length === 0) ? false : ((courseDetail.type == "online" && mixDates.length == 0) ? false : true)
	const isSeatFullForMale = maleDates.length > 0 ? maleDates.every(obj => obj.numberOfSeats === 0) : false;
	const isSeatFullForFemale = femaleDates.length > 0 ? femaleDates.every(obj => obj.numberOfSeats === 0) : false;
	const isSeatFullForMix = mixDates.length > 0 ? mixDates.every(obj => obj.numberOfSeats === 0) : false;

	const bookSeatButtonENText = (!isDateAvailable || (isSeatFullForMale && isSeatFullForFemale)) ? 'Notify me' : (isSeatFullForMix ? 'Notify me' : courseDetail.type === 'on-demand' ? 'Reserve your seat now' : 'Explore shcedules');
	const bookSeatButtonARText = (!isDateAvailable || (isSeatFullForMale && isSeatFullForFemale)) ? 'علمني عند توفر المقاعد' : (isSeatFullForMix ? 'علمني عند توفر المقاعد' : courseDetail.type === 'on-demand' ? 'اشترك الآن' : 'احجز مقعدك');
	const bookSeatButtonText = (lang == 'en' ? bookSeatButtonENText : bookSeatButtonARText)

	const screenWidth = useWindowSize().width
	const offset = useScrollEvent().offset

	const noOfFiles = ccSections?.flatMap((section) => section?.items?.filter((item) => item.type === 'file'))?.length
	const noOfVideos = ccSections?.flatMap((section) => section?.items?.filter((item) => item.type === 'video'))?.length
	const noOfQuizes = ccSections?.flatMap((section) => section?.items?.filter((item) => item.type === 'quiz'))?.length

	const [selectedNavItem, setSelectedNavItem] = useState(
		courseDetail?.type == 'on-demand' && courseCurriculum ? 4 : 1
	)
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

	const handleSlectedItem = (data, id, paddingAmount) => {
		setSelectedNavItem(data)
		setPaddingTop(paddingAmount || 10)
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
			console.log(query);
			handleUserLogin(query);
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

	const handleCourseItemClick = async (item) => {
		const isUserLogin = localStorage.getItem('accessToken') ? true : false;
		
		// Check if item is free and user is not logged in
		if (!isUserLogin && item?.sectionItem?.freeUsage !== true) {
			// Redirect to login with course info
			dispatch({
				type: 'SET_RETURN_URL',
				returnUrl: router.asPath,
			});
			router.push('/login');
			return;
		}
		
		// If user is logged in but not enrolled, check enrollment for non-free content
		if (isUserLogin && item?.sectionItem?.freeUsage !== true) {
			try {
				const enrollmentCheck = await getAuthRouteAPI({
					routeName: 'getCourseCurriculum',
					courseId: courseDetail.id,
				});
				
				if (!enrollmentCheck.data?.enrollment) {
					// Not enrolled - show message
					toast.error('يجب الاشتراك في الدورة لمشاهدة هذا المحتوى', { rtl: true });
					return;
				}
			} catch (error) {
				console.error('Error checking enrollment:', error);
				// If error, still try to show content (might be free)
				if (item?.sectionItem?.freeUsage !== true) {
					toast.error('حدث خطأ في التحقق من الاشتراك', { rtl: true });
					return;
				}
			}
		}
		
		// Allow access to free content or enrolled users
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

	const [filteredMaleDates, setFilteredMaleDates] = useState([]);
	const [filteredFemaleDates, setFilteredFemaleDates] = useState([]);
	const [filteredMixDates, setFilteredMixDates] = useState([]);

	useEffect(() => {
		filterDates(selectedCity, selectedDistrict);
	}, [selectedCity, selectedDistrict, window.location.href]);

	const filterDates = (city, district) => {
		console.log("🚀 ~ filterDates ~ city:", city)
		console.log("🚀 ~ filterDates ~ district:", district)
		// Use both city and district to filter the locationName.
		const newMaleDates = maleDates.filter(date => {
			let refinedDistrict = district?.replace("حي", "").trim();
			return (date.locationName.includes(city) || city?.includes(date.locationName)) && (date.locationName.includes(refinedDistrict) || refinedDistrict?.includes(date.locationName))
		});
		console.log("🚀 ~ filterDates ~ maleDates:", maleDates)
		console.log("🚀 ~ filterDates ~ newMaleDates:", newMaleDates)
		setFilteredMaleDates(newMaleDates);

		const newFemaleDates = femaleDates.filter(date => {
			let refinedDistrict = district?.replace("حي", "").trim();
			return (date.locationName.includes(city) || city?.includes(date.locationName)) && (date.locationName.includes(refinedDistrict) || refinedDistrict?.includes(date.locationName))
		});
		console.log("🚀 ~ filterDates ~ femaleDates:", femaleDates)
		console.log("🚀 ~ filterDates ~ newFemaleDates:", newFemaleDates)
		setFilteredFemaleDates(newFemaleDates);

		const newMixDates = mixDates.filter(date => {
			let refinedDistrict = district?.replace("حي", "").trim();
			return (date.locationName.includes(city) || city?.includes(date.locationName)) && (date.locationName.includes(refinedDistrict) || refinedDistrict?.includes(date.locationName))
		});
		console.log("🚀 ~ filterDates ~ mixDates:", mixDates)
		console.log("🚀 ~ filterDates ~ newMixDates:", newMixDates)
		setFilteredMixDates(newMixDates);
	};

	function normalize(raw) {
		return raw
			// —— bullets ——  
			// first bullet: inject blank line before the very first “- ”
			.replace(/(\S)\s-\s/, '$1\n\n- ')
			// split every other “ - ” into its own line
			.replace(/ - /g, '\n- ')

			// —— numbered ——  
			// 1) inject a blank line before the first digit-dot-space  
			.replace(
				/(\S)\s([0-9\u0660-\u0669\u06F0-\u06F9]+)\.\s/u,
				'$1\n\n$2. '
			)
			// 2) split every “ n. ” into its own line
			.replace(
				/ ([0-9\u0660-\u0669\u06F0-\u06F9]+)\.\s/gu,
				'\n$1. '
			)
			.replace(/_/g, '\n\n')
	}

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
							{/* {(screenWidth <= 767) ?
								// <ul className={`flex justify-center border-b border-inherit bg-white z-10 list-none`}>
								// 	{courseDetail?.courseMetaData?.map((metaData, index) => {
								// 		return (
								// 			<div key={`datatitle${index}`}>
								// 				<li onClick={() => handleSlectedItem((index + 1), `title${index + 1}`, 7)} className={`mx-auto pt-3 pb-2 px-4 fontMedium ${styles.mobileTabBarFont} ${selectedNavItem == (index + 1) ? styles.activeItemMobile : ''}`}>{metaData.title}</li>
								// 			</div>
								// 		)
								// 	})}
								// 	{
								// 		sortedReviewsByCategory[currentCategory] &&
								// 		<li onClick={() => handleSlectedItem(5, 'userFeedback', 7)} className={`mx-auto pt-3 pb-2 px-4 fontMedium ${styles.mobileTabBarFont} ${selectedNavItem == 5 ? styles.activeItemMobile : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}> {lang == 'en' ? `Ostori’s feedback` : `تجارب الأساطير:`}</li>
								// 	}
								// 	{hasDates &&
								// 		<li onClick={() => handleSlectedItem(4, 'dates', 7)} className={`mx-auto pt-3 pb-2 px-4 fontMedium ${styles.mobileTabBarFont} ${selectedNavItem == 4 ? styles.activeItemMobile : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}> {lang == 'en' ? `Dates` : `مواعيد الدورة:`}</li>
								// 	}
								// 	<div>
								// 		{courseDetail?.type == 'on-demand' &&
								// 			<li onClick={() => handleSlectedItem(4, 'dates', 7)} className={`mx-auto pt-3 pb-2 px-4 fontMedium ${styles.mobileTabBarFont} ${selectedNavItem == 4 ? styles.activeItemMobile : ''}`}> {lang == 'en' ? `Dates` : `مواعيد الدورة:`}</li>
								// 		}
								// 	</div>
								// </ul>
								<></>
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
										{
											sortedReviewsByCategory[currentCategory] &&
											<li onClick={() => handleSlectedItem(5, 'userFeedback')} className={`${selectedNavItem == 5 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}> {lang == 'en' ? `Ostori’s feedback` : `تجارب الأساطير:`}</li>
										}
										{hasDates &&
											<li onClick={() => handleSlectedItem(4, 'dates')} className={`${selectedNavItem == 4 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}> {lang == 'en' ? `Dates` : `مواعيد الدورة:`}</li>
										}
										<div>
											{/* {courseDetail?.type == 'on-demand' ?
												<li onClick={() => handleSlectedItem(4, 'dates')} className={`${selectedNavItem == 4 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}> {lang == 'en' ? `Course Content` : ` محتوى الدورة`}</li>
												:
												<li onClick={() => handleSlectedItem(4, 'dates')} className={`${selectedNavItem == 4 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}> {lang == 'en' ? `Upcoming appointments` : `المواعيد القادمة`}</li>
											} 

											{courseDetail?.type == 'on-demand' &&
												<li onClick={() => handleSlectedItem(4, 'dates')} className={`${selectedNavItem == 4 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}> {lang == 'en' ? `Dates` : `مواعيد الدورة:`}</li>
											}
										</div>
										<div>
											<li onClick={() => handleSlectedItem(5, 'userFeedback')} className={`${selectedNavItem == 5 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}>{lang == 'en' ? `Ostori’s feedback` : `تجارب الأساطير`} </li>
										</div>
									</ScrollContainer>
								</ul>
							} */}
							{courseDetail?.type == 'on-demand' && courseCurriculum && (
								<ul className={`${styles.courseDetailsNavbar} ${offset > 313 ? `${styles.courseDetailsNavbarFixed}` : ''}`}>
									<ScrollContainer className={`flex ${styles.courseDetailsSubNavbar}`}>
										{courseDetail?.courseMetaData?.map((metaData, index) => {
											return (
												<div key={`datatitle${index}`}>
													<li onClick={() => handleSlectedItem((index + 1), `title${index + 1}`)} 
														className={`${selectedNavItem == (index + 1) ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}>
														{metaData.title}
													</li>
												</div>
											)
										})}
										{sortedReviewsByCategory[currentCategory] && (
											<li onClick={() => handleSlectedItem(5, 'userFeedback')} 
												className={`${selectedNavItem == 5 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}>
												{lang == 'en' ? `Ostori's feedback` : `تجارب الأساطير:`}
											</li>
										)}
										<li onClick={() => handleSlectedItem(4, 'dates')} 
											className={`${selectedNavItem == 4 ? styles.activeItem : ''} ${lang == 'en' ? styles.mr2 : styles.ml2}`}>
											{lang == "en" ? "Course Content" : "محتوى الدورة"}
										</li>
									</ScrollContainer>
								</ul>
							)}
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
								const isActive = selectedNavItem === `${i + 1}`

								return (
									<div
										key={`courseData${i}`}
										id={`title${i + 1}`}
										style={{ paddingTop: isActive ? `${paddingTop}rem` : '2rem' }}
									>
										<h1 className="head2">{metaData.title}</h1>

										{/* —— keep your wrapper layout for old cases —— */}
										<div className="pt-2 flex flex-col">
											{/*
												1) If they provided metaData.link,
												wrap the *entire* content in a <Link> (old behavior)
											*/}
											{metaData.link ? (
												<Link
													href={metaData.link}
													target="_blank"
													className={`${styles.discriptionText} link`}
												>
													{metaData.content}
												</Link>

												/* 
													2) Else if it’s one of those old-<list>-items
												*/
											) : metaData.content.includes('<list>') ? (
												<ul className="list-disc pr-5">
													{metaData.content
														.split('<list>')
														.filter(Boolean)
														.map((item, j) => (
															<li
																key={`courseListDescrilition${j}`}
																className={styles.discriptionText}
															>
																{item}
															</li>
														))}
												</ul>

												/*
												3) Otherwise—*new!*—render it as Markdown
												(you get lists, **bold**, *italic*, [links](…), etc.)
												*/
											) : (
												<>
													<ContentRenderer content={normalize(metaData.content)} />

													{/* still append a tailLink if they set one */}
													{metaData.tailLink && metaData.tailLinkName && (
														<Link
															href={metaData.tailLink}
															target="_blank"
															className="link mx-1"
														>
															{metaData.tailLinkName}
														</Link>
													)}
												</>
											)}
										</div>
									</div>
								)
							})}

							{sortedReviewsByCategory[currentCategory] && (<div id={'userFeedback'} style={{ paddingTop: selectedNavItem == 5 ? `${paddingTop}rem` : '2rem' }}>
								<h1 className='head2 pb-4'>{lang == 'en' ? `Our students' scores speak for us` : `🔥 درجات طلابنا تحكي عنّا`}</h1>
								<ReviewComponent homeReviews={sortedReviewsByCategory[currentCategory]} />
							</div>)}

							{((hasDates || (courseDetail?.type == 'on-demand' && courseCurriculum)) &&
								(courseDetail?.type == 'on-demand' ?
									<div id={'dates'} style={{ paddingTop: selectedNavItem == 4 ? `${paddingTop}rem` : '2rem' }} className={styles.courseCurriculumWrapper}>
										<div className={`flex ${lang == "en" ? "justify-end" : "justify-start"} items-center`}>
											<h1 className='head2'>{lang == "en" ? "Course Content" : "محتوى الدورة"}</h1>
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
																						{item?.type == "video" ? `${secondsToMinutes(item?.duration)} ${lang == "en" ? "minutes" : "دقائق"} ` :
																							item?.type == "quiz" ? `${item.numberOfQuestions} ${lang == "en" ? "question" : "سؤال"} سؤال` :
																								`${item.discription}`}
																					</p>
																				</div>
																			</div>
											<div className={styles.lockItemWrapper}>
												{item?.sectionItem?.freeUsage == true ? (
													<p onClick={() => handleCourseItemClick(item)} className={styles.previewItemText}>
														{lang == "en" ? "Watch for free" : "شاهد مجانًا"}
													</p>
												) : (
													<>
														{isUserLogin ? (
															<AllIconsComponenet height={24} width={20} iconName={'lock2'} color={'#0000008a'} />
														) : (
															<p onClick={() => handleCourseItemClick(item)} className={styles.previewItemText}>
																{lang == "en" ? "Login to watch" : "سجل دخول للمشاهدة"}
															</p>
														)}
													</>
												)}
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
										<h1 className='head2'>{lang == 'en' ? `Upcoming appointments` : `المواعيد المتوفرة`}</h1>
										{courseDetail?.type == 'physical' ?
											<>
												{/* Location Selection */}
												<div className="mb-6">
													<h2 className={`${lang === "en" ? "text-left" : "text-right"} mb-2 text-gray-600`}>
														{lang === 'en' ? "Branch" : "الفرع"}
													</h2>
													<p className={`${lang === "en" ? "text-left" : "text-right"} text-sm mb-2`}>
														{lang === 'en'
															? "Accordingly, we will show you the available dates"
															: "بناءً عليه يوريك المواعيد المتوفرة"}
													</p>

													{/* City Selection */}
													<div className="flex justify-start gap-2">
														{initialCities.map(city => (
															<button
																key={city}
																className={`px-4 py-2 border border-black ${selectedCity === city
																	? 'bg-[#F26722] text-white'
																	: 'bg-white text-black'
																	} rounded-lg hover:opacity-90 transition-opacity shadow-md`}
																onClick={() => setSelectedCity(city)}
															>
																<div className="flex flex-col items-center">
																	<div>{city}</div>
																</div>
															</button>
														))}
													</div>

													{/* District Selection */}
													{districts && districts.length > 0 && (
														<div className="mt-4">
															<h2 className={`${lang === "en" ? "text-left" : "text-right"} mb-2 text-gray-600`}>
																{lang === 'en' ? "District" : "الحي"}
															</h2>
															<div className="flex justify-start gap-2">
																{districts.map(district => (
																	<button
																		key={district}
																		className={`px-4 py-2 border border-black ${selectedDistrict === district
																			? 'bg-[#F26722] text-white'
																			: 'bg-white text-black'
																			} rounded-lg hover:opacity-90 transition-opacity shadow-md`}
																		onClick={() => setSelectedDistrict(district)}
																	>
																		<div className="flex flex-col items-center">
																			<div>{district}</div>
																		</div>
																	</button>
																))}
															</div>
														</div>
													)}
												</div>

												{/* Gender Selection */}
												{(filteredMaleDates?.length > 0 || filteredFemaleDates?.length > 0 || filteredMixDates.length > 0) &&
													<div className="mb-6">
														<h2 className={`${lang == 'en' ? 'text-left' : 'text-right'}  mb-2`}>{lang == 'en' ? "Choose the date that suits you" : "اختر الموعد المناسب لك"}</h2>
														<div className={`flex ${lang == 'en' ? 'justify-start' : 'justify-start'}  gap-2`}>
															{
																filteredMaleDates?.length > 0 && (
																	<button
																		className={`px-4 py-2 border border-black ${selectedGender === 'male'
																			? 'bg-[#F26722] text-white'
																			: 'bg-white text-black'
																			} rounded-lg hover:opacity-90 transition-opacity shadow-md`}
																		onClick={() => setSelectedGender('male')}
																	>
																		{lang == "en" ? "Male dates" : "مواعيد الشباب"}
																	</button>
																)
															}

															{
																filteredFemaleDates?.length > 0 && (
																	<button
																		className={`px-4 py-2 border border-black ${selectedGender === 'female'
																			? 'bg-[#F26722] text-white'
																			: 'bg-white text-black'
																			} rounded-lg hover:opacity-90 transition-opacity shadow-md`}
																		onClick={() => setSelectedGender('female')}
																	>
																		{lang == "en" ? "Female dates" : "مواعيد البنات"}
																	</button>
																)
															}

															{
																filteredMixDates?.length > 0 && (
																	<button
																		className={`px-4 py-2 border border-black ${selectedGender === 'mix'
																			? 'bg-[#F26722] text-white'
																			: 'bg-white text-black'
																			} rounded-lg hover:opacity-90 transition-opacity shadow-md`}
																		onClick={() => setSelectedGender('mix')}
																	>
																		{lang == "en" ? "mix dates" : "مواعيد الجنسين"}
																	</button>
																)
															}
														</div>
													</div>
												}

												<ScrollContainer className="flex">
													{selectedGender === 'male' ?
														filteredMaleDates.map((date, index) => (
															<Fragment key={`maleDate${index}`}>
																<CourseDates
																	date={date}
																	handleBookSit={handleBookSit}
																	lang={lang}
																/>
															</Fragment>
														))
														: selectedGender === 'female' ?
															filteredFemaleDates.map((date, index) => (
																<Fragment key={`femaleDate${index}`}>
																	<CourseDates
																		date={date}
																		handleBookSit={handleBookSit}
																		lang={lang}
																	/>
																</Fragment>
															))
															:
															filteredMixDates.map((date, index) => (
																<Fragment key={`mixDate${index}`}>
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
												<div className="mb-6 mt-6">
													<h2 className={`${lang == 'en' ? 'text-left' : 'text-right'}  mb-2`}>{lang == 'en' ? "Choose the date that suits you" : "اختر الموعد المناسب لك"}</h2>
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
								))
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
