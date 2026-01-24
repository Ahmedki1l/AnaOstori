import Router from "next/router";
import ProfilePicture from '../components/CommonComponents/ProfilePicture';
import CoursesCard from "../components/CommonComponents/CourseCard/CoursesCard";
import styles from '../styles/MyProfile.module.scss'
import { useSelector } from 'react-redux';
import AllIconsComponenet from "../Icons/AllIconsComponenet";
import { mediaUrl } from "../constants/DataManupulation";
import { getAuthRouteAPI } from "../services/apisService";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Spinner from "../components/CommonComponents/spinner";



export default function MyProfile() {

	const storeData = useSelector((state) => state?.globalStore);
	const userDetails = storeData?.viewProfileData;
	const [myCourses, setMyCourses] = useState([])
	const dispatch = useDispatch();
	const [loading, setIsLoading] = useState(false)

	useEffect(() => {
		getMyCourseReq()
	}, [])

	const getMyCourseReq = async () => {
		setIsLoading(true)
		await getAuthRouteAPI({ routeName: 'myCourses' }).then((response) => {
			setMyCourses(response?.data)
			console.log("my courses: ", response?.data);
			dispatch({
				type: 'SET_ALL_MYCOURSE',
				myCourses: response?.data,
			});
			setIsLoading(false)
		}).catch((error) => {
			setIsLoading(false)
			console.log(error)
		})
	}

	return (
		<>
			{userDetails &&
				<div className="maxWidthDefault sm:p-4 p-0">
					<div className={`pt-8 ${styles.profileInfoWrapper}`}>
						<ProfilePicture height={116} width={116} alt={'Profile Picture'} pictureKey={userDetails?.avatarKey == null ? userDetails?.avatar : mediaUrl(userDetails?.avatarBucket, userDetails?.avatarKey)} />
						<p className={`font-bold ${styles.userNameText}`}>{userDetails?.fullName}</p>
						<div className={styles.updateProfileBtnBox}>
							<button className='primaryStrockedBtn' onClick={() => Router.push('/updateProfile')}>تعديل البيانات الشخصية</button>
						</div>
					</div>

					<div className={styles.courseHeading}>
						<p className={`font-bold ${styles.myCourseHeadingText}`}>اشتراكات الدورات</p>
					</div>
					{loading ?
						<div className={`h-full`}>
							<Spinner borderwidth={7} width={6} height={6} />
						</div>
						:
						myCourses && myCourses?.length > 0 ?
							<div className={`flex flex-wrap ${styles.courseCardsWrapper}`}>
								{myCourses?.map((items, index) => {
									return <CoursesCard data={items} key={index} />
								})
								}
							</div>
							:
							<div className={styles.noCourseWrapper}>
								<AllIconsComponenet height={150} width={150} iconName={'noData'} color={''} />
								<p className={`fontMedium pt-2 ${styles.noCourseText}`} >ما اشتركت بأي دورة</p>
								<p className={styles.paregraphText}>تصفح مجالاتنا وسجّل معنا، متأكدين انك راح تستفيد وتكون أسطورتنا الجاي بإذن الله 🥇😎</p>
								<div className={`mt-4 ${styles.homeBtnBox}`}>
									<button className="primarySolidBtn" onClick={() => Router.push('/?دوراتنا')}>تصفح المجالات</button>
								</div>
							</div>
					}
				</div>
			}

		</>
	)
}
