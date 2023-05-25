import styles from '../../styles/Courses.module.scss'
import { useRouter } from 'next/router'
import PhysicalCourseCard from '../../components/TypesOfCourseComponents/PhysicalCourseCard'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCatagoriesAPI } from '../../services/apisService';


export async function getServerSideProps({ req, res, resolvedUrl }) {
	const catagoryName = resolvedUrl.replace(/-/g, ' ')

	const catagoriesReq = axios.get(`${process.env.API_BASE_URL}/catagoriesNoAuth`)
	const courseDetailsReq = axios.get(`${process.env.API_BASE_URL}/coursesByCatagoryName/${catagoryName}`)

	const [catagories, courseDetails] = await Promise.all([
		catagoriesReq,
		courseDetailsReq
	])

	if (!courseDetails.data.length) {
		return {
			notFound: true,
		}
	}

	return {
		props: {
			courseDetails: courseDetails.data,
			catagories: catagories.data,
		}
	}
}

export default function Index(props) {
	const router = useRouter()

	const catagoryName = (router.query.catagoryName).replace(/-/g, ' ')

	const courseDetails = props.courseDetails ? props.courseDetails : null

	const [loggedUserCourseDetails, setLoggedUserCourseDetails] = useState([])

	const catagory = props.catagories?.find((catagory) => {
		if (catagory.name == catagoryName) {
			return catagory
		}
	})

	const mainDescription = catagory.description?.split(':')[0]

	const listDescription = catagory?.description?.split(':')[1]?.split('<list>')?.splice(1, catagory.description.length)

	const storeData = useSelector((state) => state?.globalStore);

	const isUserLogin = storeData?.accessToken ? true : false

	useEffect(() => {
		if (!isUserLogin) return
		const getCourseDetails = async () => {
			let data = {
				accessToken: storeData?.accessToken,
			}
			await getCatagoriesAPI(data).then((res) => {
				res.data?.find((catagory) => {
					if (catagory.name == catagoryName) {
						setLoggedUserCourseDetails(catagory.courses)
					}
				})
			}).catch((err) => {
				console.log(err)
			})
		}
		getCourseDetails()
	}, [storeData?.accessToken])

	return (
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
					{loggedUserCourseDetails.length > 0 && loggedUserCourseDetails.map((course, index) => {
						return (
							<div key={`courseDetaisl${index}`} className='my-4 mx-2'>
								<PhysicalCourseCard courseDetails={course} catagoryName={catagoryName} />
							</div>
						)
					})}
				</div>
				:
				<div className={styles.coursesWrapper}>
					{courseDetails.length > 0 && courseDetails.map((course, index) => {
						return (
							<div key={`courseDetaisl${index}`} className='my-4 mx-2'>
								<PhysicalCourseCard courseDetails={course} catagoryName={catagoryName} />
							</div>
						)
					})}
				</div>
			}
		</div>
	)
}