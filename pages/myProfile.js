import Router from "next/router";
import ProfilePicture from '../components/CommonComponents/ProfilePicture';
import CoursesCard from "../components/CommonComponents/CourseCard/CoursesCard";
import styles from '../styles/MyProfile.module.scss'
import * as LinkConst from '../constants/LinkConst'
import { useSelector } from 'react-redux';
import AllIconsComponenet from "../Icons/AllIconsComponenet";



export default function MyProfile() {

	const storeData = useSelector((state) => state?.globalStore);
	const userDetails = storeData?.viewProfileData;
	const myCourses = storeData?.myCourses
	const imageBaseUrl = LinkConst.File_Base_Url2
	const profileUrl = `${imageBaseUrl}/${userDetails?.avatarKey}`
	console.log(storeData);

	return (
		<>
			{userDetails &&
				<div className="maxWidthDefault sm:p-4 p-0">
					<div className={`pt-8 ${styles.profileInfoWrapper}`}>
						<ProfilePicture height={116} width={116} alt={'Profile Picture'} pictureKey={profileUrl} />
						<p className={`font-bold ${styles.userNameText}`}>{userDetails?.firstName + ' ' + userDetails?.lastName}</p>
						<div className={styles.updateProfileBtnBox}>
							<button className='primaryStrockedBtn' onClick={() => Router.push('/updateProfile')}>تعديل الملف الشخصي</button>
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
							<p className={`fontBold ${styles.noCourseText}`}>ما عندك اشتراكات</p>
							<div className={styles.homeBtnBox}>
								<button className="primarySolidBtn" onClick={() => Router.push('/')}>تصفح الدورات</button>
							</div>
						</div>
					}
				</div>
			}

		</>
	)
}
