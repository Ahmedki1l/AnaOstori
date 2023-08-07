import styles from '../../styles/Courses.module.scss'
import { useRouter } from 'next/router'
import PhysicalCourseCard from '../../components/TypesOfCourseComponents/PhysicalCourseCard'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCatagoriesAPI } from '../../services/apisService';
import Spinner from '../../components/CommonComponents/spinner';
import { signOutUser } from '../../services/fireBaseAuthService';



export async function getServerSideProps(contex) {
	const catagoryName = contex.query.catagoryName.replace(/-/g, ' ')
	const catagories = await axios.get(`${process.env.API_BASE_URL}/catagoriesNoAuth`).then((response) => (response.data)).catch((error) => error);

	const catagoryNamePresent = catagories.find((item) => item.name === catagoryName)

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
	const courseDetails = catagory?.courses?.length > 0 ? shortCourseOnType(catagory.courses) : null
	const mainDescription = catagory.description?.split(':')[0]
	const listDescription = catagory?.description?.split(':')[1]?.split('<list>').splice(1, catagory.description.length)
	const storeData = useSelector((state) => state?.globalStore);
	const isUserLogin = storeData?.accessToken ? true : false
	const dispatch = useDispatch()
	const [pageLoading, setPageLoading] = useState(true)

	useEffect(() => {
		if (isUserLogin && loggedUserCourseDetails?.length > 0) {
			setPageLoading(false)
		} else if (!isUserLogin && courseDetails?.length > 0) {
			setPageLoading(false)
		} else {
			setPageLoading(true)
		}
	}, [isUserLogin, loggedUserCourseDetails, courseDetails])

	useEffect(() => {
		if (!isUserLogin) return
		const getCourseDetails = async () => {

			await getCatagoriesAPI().then((res) => {
				res.data?.find((catagory) => {
					if (catagory.name == catagoryName) {
						setLoggedUserCourseDetails(catagory.courses)
					}
				})
			}).catch((error) => {
				console.log(error)
				if (error?.response?.status == 401) {
					setPageLoading(false)
					signOutUser()
					dispatch({
						type: 'EMPTY_STORE'
					});
				}
			})
		}
		getCourseDetails()
	}, [catagoryName, isUserLogin])

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
					{isUserLogin ?
						<div className={styles.coursesWrapper2}>
							{loggedUserCourseDetails?.length > 0 && loggedUserCourseDetails.map((course, index) => {
								return (
									<div key={`courseDetaisl${index}`} className='my-4 mx-2'>
										<PhysicalCourseCard courseDetails={course} catagoryName={catagoryName} handleCoursePageNavigation={handleCoursePageNavigation} />
									</div>
								)
							})}
						</div>
						:
						<div className={styles.coursesWrapper}>
							{courseDetails?.length > 0 && courseDetails.map((course, index) => {
								return (
									<div key={`courseDetaisl${index}`} className='my-4 mx-2'>
										<PhysicalCourseCard courseDetails={course} catagoryName={catagoryName} handleCoursePageNavigation={handleCoursePageNavigation} />
									</div>
								)
							})}
						</div>
					}
				</div>
			}
		</>
	)
}