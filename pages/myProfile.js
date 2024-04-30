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



export default function MyProfile() {

	const storeData = useSelector((state) => state?.globalStore);
	const userDetails = storeData?.viewProfileData;
	const [myCourses, setMyCourses] = useState([])
	const dispatch = useDispatch();

	useEffect(() => {
		if (storeData?.viewProfileData) {
			getMyCourseReq()
		}
	}, [])

	const getMyCourseReq = async () => {
		await getAuthRouteAPI({ routeName: 'myCourses' }).then((response) => {
			setMyCourses(response?.data)
			dispatch({
				type: 'SET_ALL_MYCOURSE',
				myCourses: response?.data,
			});
		}).catch((error) => {
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

					{myCourses.length > 0 ?
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
