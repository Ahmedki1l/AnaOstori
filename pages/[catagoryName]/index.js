import styles from '../../styles/Courses.module.scss'
import PhysicalCourseCard from '../../components/TypesOfCourseComponents/PhysicalCourseCard'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getAuthRouteAPI } from '../../services/apisService';
import Spinner from '../../components/CommonComponents/spinner';
import { getNewToken } from '../../services/fireBaseAuthService';
import { useDispatch } from "react-redux";
import CoursesCardMixedButton from "../../components/CommonComponents/CourseCard/CoursesCardMixedButton";
import Link from 'next/link';



export async function getServerSideProps(contex) {
	const catagoryName = contex.query.catagoryName.replace(/-/g, ' ')
	const catagories = await axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=categoriesNoAuth`).then((response) => (response.data)).catch((error) => error);

	if (catagories && catagories?.length == 0) {
		return {
			notFound: true,
		}
	}

	const catagoryNamePresent = catagories?.find((item) => item.name === catagoryName)
	if (!catagoryNamePresent) {
		return {
			notFound: true,
		}
	}

	return {
		props: {
			catagoryName: catagoryName,
			catagories: catagories,
		}
	}
}

const CourseTypeCard = ({ type, title, subtitle, locations, imageUrl, onClick }) => {
	return (
		<div
			onClick={onClick}
			className="group relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:-translate-y-1 w-full"
		>
			<img
				src={imageUrl}
				alt={title}
				className="w-full h-auto object-cover rounded-lg"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg">
				{/* <div className="absolute bottom-0 left-0 right-0 p-3">
			<div className="flex flex-col gap-1">
			  <div className="flex items-center gap-2">
				<h3 className="text-white text-lg font-hard">{title}</h3>
			  </div>
			  <p className="text-white text-sm mr-5">{subtitle}</p>
			  <p className="text-white text-sm mr-5">{locations}</p>
			</div>
		  </div> */}
			</div>
		</div>
	);
};

export default function Index(props) {
	const catagoryName = props.catagoryName
	const [loggedUserCourseDetails, setLoggedUserCourseDetails] = useState([])
	const catagory = props.catagories?.find((catagory) => {
		if (catagory.name == catagoryName) {
			return catagory
		}
	})
	// const courseDetails = catagory?.courses?.length > 0 ? shortCourseOnType(catagory.courses) : null
	const [coursesDetails, setCoursesDetails] = useState([])
	const mainDescription = catagory.description?.split(':')[0]
	const listDescription = catagory?.description?.split(':')[1]?.split('<list>').splice(1, catagory.description.length)
	// const storeData = useSelector((state) => state?.globalStore);
	// const isUserLogin = storeData?.accessToken ? true : false
	const isUserLogin = localStorage.getItem('accessToken') ? true : false;
	const [pageLoading, setPageLoading] = useState(true)
	const [myCourses, setMyCourses] = useState([]);
	const dispatch = useDispatch();

	const [showTypeCards, setShowTypeCards] = useState(true);
	const [selectedType, setSelectedType] = useState(null);

	useEffect(() => {
		if (coursesDetails?.length > 0) {
			setPageLoading(false)
		} else {
			setPageLoading(true)
		}
	}, [isUserLogin, loggedUserCourseDetails, coursesDetails])

	useEffect(() => {
		//we need this because we want to check users has enroled or not
		if (!isUserLogin) {
			const courseDetails = shortCourseOnType(catagory.courses)
			setCoursesDetails(courseDetails)
			console.log("courses: ", coursesDetails);
		} else {
			setPageLoading(true)
			const getCourseDetails = async () => {
				let data = {
					routeName: 'categories'
				}
				await getAuthRouteAPI(data).then((res) => {
					res.data?.find((catagory) => {
						if (catagory.name == catagoryName) {
							setCoursesDetails(shortCourseOnType(catagory.courses))
							console.log("courses: ", coursesDetails);
							getMyCourseReq();
						}
					})
				}).catch(async (error) => {
					console.log(error)
					if (error?.response?.status == 401) {
						await getNewToken().then(async (token) => {
							await getAuthRouteAPI(data).then(res => {
								res.data?.find((catagory) => {
									if (catagory.name == catagoryName) {
										setCoursesDetails(shortCourseOnType(catagory.courses))
										console.log("courses: ", coursesDetails);
										getMyCourseReq();
									}
								})
							})
							setPageLoading(false)
						}).catch(error => {
							console.error("Error:", error);
						});
					}
				})
			}
			getCourseDetails();
		}
	}, [isUserLogin, catagoryName, catagory.courses])

	function shortCourseOnType(courses) {
		const typeOrder = ['physical', 'online', 'on-demand'];

		const newArray = courses.sort((a, b) => {
			const typeA = a.type;
			const typeB = b.type;

			const indexA = typeOrder.indexOf(typeA);
			const indexB = typeOrder.indexOf(typeB);

			return indexA - indexB;
		});
		return newArray
	}

	const handleCoursePageNavigation = () => {
		setPageLoading(true)
	}

	const getMyCourseReq = async () => {
		setPageLoading(true)
		await getAuthRouteAPI({ routeName: 'myCourses' }).then((response) => {
			setMyCourses(response?.data)
			console.log("my courses: ", response?.data);
			dispatch({
				type: 'SET_ALL_MYCOURSE',
				myCourses: response?.data,
			});
			setPageLoading(false)
		}).catch((error) => {
			setPageLoading(false)
			console.log(error)
		})
	}

	const handleCardClick = (type) => {
		setSelectedType(type);
		setShowTypeCards(false);
	};

	const handleBack = () => {
		setShowTypeCards(true);
		setSelectedType(null);
	};

	return (
		<>
			{pageLoading ?
				<div className={`relative ${styles.mainLoadingPage}`}>
					<Spinner borderwidth={7} width={6} height={6} />
				</div>
				: <div>
					{showTypeCards ? (
						<div className={`maxWidthDefault ${styles.mainArea}`}>
							<h1 className='head1'>{catagoryName}</h1>
							<p className={`py-2 md:py-3 fontMedium ${styles.tagline}`}> {mainDescription}</p>
							<ul className='list-disc pr-9'>
								{listDescription?.map((list, index) => {
									return (
										<li key={`listDiscription${index}`} className={styles.descriptionList}>{list}</li>
									)
								})}
							</ul>
							<h1 className='head1 pt-8'>كيف ودك تحضر الدورة؟</h1>

							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 justify-items-center mt-8 mb-20 px-4 md:px-0">
								<CourseTypeCard
									type="physical"
									title="حضوري"
									subtitle="للجنسين"
									locations="الرياض، الدمام، جدة"
									imageUrl="/images/physical.png"
									onClick={() => handleCardClick('حضوري')}
								/>
								<CourseTypeCard
									type="online"
									title="عن بعد"
									subtitle="للجنسين"
									locations="المباشرة عن بعد"
									imageUrl="/images/online.png"
									onClick={() => handleCardClick('عن بعد')}
								/>
							</div>
						</div>

					) : (
						<div className={`maxWidthDefault ${styles.mainArea}`}>
							<div className="flex items-center justify-start gap-3 mb-4">
								<button
									onClick={handleBack}
									className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-200 transition-colors duration-200 shadow-md flex items-center justify-center flex-shrink-0 cursor-pointer hover:shadow-lg group"
									aria-label="Back"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<line x1="5" y1="12" x2="19" y2="12"></line>
										<polyline points="12 5 19 12 12 19"></polyline>
									</svg>
								</button>
								<h1 className='head1 mb-0'>{catagoryName} {selectedType}</h1>
							</div>
							<p className={`py-2 md:py-3 fontMedium ${styles.tagline}`}> {mainDescription}</p>
							<ul className='list-disc pr-9'>
								{listDescription?.map((list, index) => {
									return (
										<li key={`listDiscription${index}`} className={styles.descriptionList}>{list}</li>
									)
								})}
							</ul>
							<h1 className='head1 pt-8'>الدورات</h1>

							<div>
								<div className={`${styles.coursesWrapper} mt-5`}>
									{coursesDetails?.length > 0 && coursesDetails
										.filter(course => {
											// Filter based on selected type
											if (selectedType === "حضوري") {
												return course.type === "physical";
											} else if (selectedType === "عن بعد") {
												return course.type !== "physical";
											}
											return true; // If no type selected, show all
										})
										.map((course, index) => {
											return (
												<div key={`courseDetails${index}`} className={styles.courseCardMetaDataWrapper}>
													<PhysicalCourseCard
														courseDetails={course}
														catagoryName={catagoryName}
														handleCoursePageNavigation={handleCoursePageNavigation}
													/>
												</div>
											);
										})}
								</div>
							</div>
						</div>
					)}
				</div>
			}
		</>
	)
}