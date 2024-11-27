import styles from '../../styles/Courses.module.scss'
import PhysicalCourseCard from '../../components/TypesOfCourseComponents/PhysicalCourseCard'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getAuthRouteAPI } from '../../services/apisService';
import Spinner from '../../components/CommonComponents/spinner';
import { getNewToken } from '../../services/fireBaseAuthService';
import { useDispatch } from "react-redux";
import CoursesCardMixedButton from "../../components/CommonComponents/CourseCard/CoursesCardMixedButton";



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

	return (
		<>
			{pageLoading ?
				<div className={`relative ${styles.mainLoadingPage}`}>
					<Spinner borderwidth={7} width={6} height={6} />
				</div>
				:
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
					<h1 className='head1 pt-8'>اختار الدورة المناسبة لك</h1>

					<div className={styles.coursesWrapper}>
						{coursesDetails?.length > 0 && coursesDetails.map((course, index) => {
							// Check if the course is in myCourses
							const enrolledCourse = myCourses?.find(myCourse => myCourse?.course?.id === course?.id);

							if (enrolledCourse) {
								// If the course is enrolled
								return (
									<div key={`courseDetails${index}`} className={styles.courseCardMetaDataWrapper}>
										<CoursesCardMixedButton
											data={enrolledCourse}
											catagoryName={catagoryName}
										/>
									</div>
								);
							} else {
								// If the course is not enrolled
								return (
									<div key={`courseDetails${index}`} className={styles.courseCardMetaDataWrapper}>
										<PhysicalCourseCard
											courseDetails={course}
											catagoryName={catagoryName}
											handleCoursePageNavigation={handleCoursePageNavigation}
										/>
									</div>
								);
							}
						})}
					</div>
				</div>
			}
		</>
	)
}