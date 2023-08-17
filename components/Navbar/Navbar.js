import React, { useEffect, useRef, useState } from 'react'
import styles from './Navbar.module.scss'
import Logo from '../CommonComponents/Logo'
import Link from 'next/link'
import axios from 'axios';
import useWindowSize from '../../hooks/useWindoSize';
import { useRouter } from 'next/router';
import useScrollEvent from '../../hooks/useScrollEvent';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import ModalComponent from '../CommonComponents/ModalComponent/ModalComponent';
import { signOutUser } from '../../services/fireBaseAuthService'
import { getCatagoriesAPI, getCurriculumIdsAPI, getInstructorListAPI, } from '../../services/apisService';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';



export default function Navbar() {

	const isMediumScreen = useWindowSize().mediumScreen
	const [isMenuShow, setIsMenuShow] = useState(false)

	const [open, setOpen] = useState(false);

	const router = useRouter();

	const catagoryName = (router.query.catagoryName)?.replace(/-/g, ' ')
	const offset = useScrollEvent().offset

	const dispatch = useDispatch();

	const storeData = useSelector((state) => state?.globalStore);

	const [catagories, setCatagories] = useState()
	const [curriculumIds, setCurriculumIds] = useState();

	const userFullName = (storeData?.viewProfileData?.firstName && storeData?.viewProfileData?.lastName) ? `${storeData?.viewProfileData?.firstName} ${storeData?.viewProfileData?.lastName}` : storeData?.viewProfileData?.fullName

	const isRegisterGoogleUser = router.pathname == "/registerGoogleUser" ? true : false

	const isUserInstructor = storeData?.isUserInstructor

	useEffect(() => {
		const fetchResults = async () => {
			await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/catagoriesNoAuth`).then(res => {
				setCatagories(res?.data),
					setCurriculumIds(res?.data)
			}).catch(error => {
				console.log("error : ", error);
			})
		};
		fetchResults();
	}, [setCatagories, setCurriculumIds])


	useEffect(() => {
		const fetchResults = async () => {
			try {
				const getcatagoriReq = getCatagoriesAPI()
				const getCurriculumIdsReq = getCurriculumIdsAPI()
				const getInstructorListReq = getInstructorListAPI()

				const [catagories, curriculumIds, instructorList] = await Promise.all([
					getcatagoriReq, getCurriculumIdsReq, getInstructorListReq
				])
				dispatch({
					type: 'SET_CATAGORIES',
					catagories: catagories?.data
				});
				dispatch({
					type: 'SET_CURRICULUMIDS',
					curriculumIds: curriculumIds?.data,
				});
				dispatch({
					type: 'SET_INSTRUCTOR',
					instructorList: instructorList?.data,
				})
			} catch (error) {
				console.log(error);
			}
		}

		fetchResults();
	}, [])

	const [showSubMenu, setShowSubMenuShown] = useState()
	const prevSubMenu = useRef();

	useEffect(() => {
		prevSubMenu.current = showSubMenu;
	}, [showSubMenu]);

	const handleshowSubMenu = (index) => {
		return index == prevSubMenu.current ? setShowSubMenuShown() : setShowSubMenuShown(index)
	}

	const handleClickOnLink = () => {
		setShowSubMenuShown()
		setIsMenuShow(false)
	}

	const handleClickCourseName = (submenu, menu) => {
		setShowSubMenuShown()
		setIsMenuShow(false)
		router.push({
			pathname: `/${(submenu).replace(/ /g, "-")}/${(menu.replace(/ /g, "-"))}`,
			state: { myParam: 'some value' },
		});
	}

	useEffect(() => {
		const element = document.getElementById('navBar');
		if (offset > 100) {
			element?.classList.add('top80');
		}
		else {
			element?.classList.remove('top80');
		}
	}, [offset])

	const handleSignOut = () => {
		dispatch({
			type: 'EMPTY_STORE'
		});
		signOutUser();
		dispatch({
			type: 'SET_RETURN_URL',
			returnUrl: ""
		})
	}

	useEffect(() => {
		if (storeData?.viewProfileData?.inActiveAt) {
			setOpen(true)
		}
		else {
			setOpen(false)
		}

	}, [storeData?.viewProfileData?.inActiveAt])


	const handleClose = () => {
		setOpen(false)
	}

	const handleInstructorBtnClick = () => {
		router.push('/instructorPanel')
	}

	return (
		<>
			{isMediumScreen ?
				<div className={styles.mobileLogoBar} id="navBar">
					<Link href={'/'} className='pt-1'>
						<Logo height={34} width={62} logoName={'anaOstoriLogo'} alt={'Ana Ostori Logo'} />
					</Link>
					<div className={`p-1 ${styles.menuBtn}`} onClick={() => setIsMenuShow(!isMenuShow)}>
						<AllIconsComponenet iconName={'menuIcon'} height={18} width={18} color={'#000000'} />
					</div>
					{isMenuShow &&
						<div className={styles.slideBarBg}>
							<div className={styles.sildeBarMenu}>
								<p className={`fontBold ${styles.moNavHeader}`} >القائمة</p>
								<div className='px-4'>
									<Link href={'/'} className='flex items-center py-4 normalLinkText' onClick={() => handleClickOnLink()}>
										<AllIconsComponenet height={20} width={20} iconName={'home'} color={'#000000'} />
										<p className='pr-2'>الرئيسية</p>
									</Link>
									<div className={styles.inqBtnBox}>
										<Link href={'/search'} className='no-underline'>
											<button className={`secondrySolidBtn flex justify-center items-center ${styles.serchQueryBtn}`} onClick={() => handleClickOnLink()}>
												<AllIconsComponenet height={20} width={20} iconName={'history'} color={'#ffffff'} /> &nbsp;
												استعلام المشتريات
											</button>
										</Link>
									</div>
									<Link href={'/accountInformation'} className={`flex items-center py-4 normalLinkText ${styles.settingDiv}`} onClick={() => handleClickOnLink()}>
										<AllIconsComponenet height={20} width={20} iconName={'setting'} color={'#000000'} />
										<p className='pr-2'>إعدادات الحساب</p>
									</Link>
									<Link href={'/terms'} className={`pt-4 normalLinkText ${styles.mobileNavItemList}`} onClick={() => handleClickOnLink()}>الأحكام والشروط</Link>
									<Link href={'/privacyAndPolicy'} className={`pt-4 normalLinkText ${styles.mobileNavItemList}`} onClick={() => handleClickOnLink()}>سياسة الخصوصية</Link>
									<Link href={'/FAQs'} className={`pt-4 normalLinkText ${styles.mobileNavItemList}`} onClick={() => handleClickOnLink()}>الأسئلة الشائعة</Link>
									<p onClick={() => handleSignOut()} className={styles.moLogOutText}>تسجيل الخروج</p>
								</div>
							</div>
						</div>
					}
					{/* <div className={styles.bellIconDiv}>
						<AllIconsComponenet height={25} width={25} iconName={'bell'} color={'#808080'} />
					</div> */}
				</div >
				:
				<div className={styles.navbarWrapper} id="navBar" >
					<div className='maxWidthDefault'>
						<div className={styles.navbarInnerWrapper}>
							<Link href={'/'} className={`pl-8 my-auto ${isRegisterGoogleUser && 'cursor-not-allowed'}`}>
								<Logo height={38} width={68} logoName={'anaOstoriLogo'} alt={'Ana Ostori Logo'} />
							</Link>
							{!isRegisterGoogleUser &&
								<>
									<div className={`pl-6 my-auto`}>
										<Link href={'/'} className='normalLinkText'><p className={styles.homeText}>الرئيسية</p></Link>
									</div>
									<ul className={styles.navbarSubWrapper}>
										{catagories?.map((menu, i = index) => {
											return (
												<li className={`${styles.navItem} ${styles.menuItem}`} key={`navMenu${i}`}>
													<p className={`${styles.mainMenuText} ${catagoryName == menu.name ? `fontBold` : `fontRegular`}`}>{menu.name}</p>
													<div className={styles.arrowIcon}>
														<AllIconsComponenet height={16} width={20} iconName={'keyBoardDownIcon'} color={'#000000'} />
													</div>
													<div className={styles.submenuBox}>
														{menu.courses?.map((subMenu, j = index) => {
															return (
																<div key={`navSubMenu${j}`}>
																	<Link href={`/${(subMenu.name).replace(/ /g, "-")}/${(menu.name.replace(/ /g, "-"))}` ?? ""}
																		className={`block ${styles.subMenuText}`} onClick={() => handleClickCourseName(subMenu.name, menu.name)}> {subMenu.name}
																	</Link>
																</div>
															)
														})}
													</div>
												</li>
											)
										})}
									</ul>
								</>
							}
							{!storeData?.accessToken ?
								<div className={styles.loginBtnsBox}>
									<div className={styles.loginBtnBox}>
										<Link href={"/login"} className='normalLinkText'>
											<button className={`primaryStrockedBtn ${styles.loginBtn}`}>تسجيل الدخول</button>
										</Link>
									</div>
									<div className={styles.signupBtnBox}>
										<Link href={"/register"} className='normalLinkText'>
											<button className={`primarySolidBtn ${styles.signupBtn}`}>إنشاء حساب</button>
										</Link>
									</div>
								</div>
								:
								<div className='flex items-center mr-auto'>
									{/* <div>
										<AllIconsComponenet height={30} width={30} iconName={'bell'} color={'#808080'} />
									</div> */}
									{isUserInstructor && <div className={styles.instructorBtnBox}>
										<button className={`primaryStrockedBtn`} onClick={() => handleInstructorBtnClick()}>لوحة تحكم المعلم</button>
									</div>}
									<div className={styles.navLeftDiv}>
										<div className={styles.viewProfile}>
											<AllIconsComponenet height={35} width={35} iconName={'profileIcon'} color={'#ffffff'} />
											<p>{userFullName ? userFullName : ""}</p>
											<div className={styles.arrowIcon}>
												<AllIconsComponenet height={16} width={20} iconName={'keyBoardDownIcon'} color={'#000000'} />
											</div>
										</div>

										<div className={styles.profileMenuWrapper}>
											<div className={styles.profileMenuSubWrapper}>
												<Link href={'/myProfile'} className={`normalLinkText ${styles.profileMenuItemsWrapper}`}>
													<AllIconsComponenet height={18} width={18} iconName={'persone1'} color={'#000000'} />
													<p className={styles.profileMenuItemsText}>الملف الشخصي</p>
												</Link>
												<div className={styles.inqBtnBox}>
													<Link href={'/search'} className='no-underline'>
														<button className={`secondrySolidBtn ${styles.serchQueryBtn}`} onClick={() => handleClickOnLink()}>
															<AllIconsComponenet height={20} width={20} iconName={'history'} color={'#ffffff'} /> &nbsp;
															استعلام المشتريات
														</button>
													</Link>
												</div>
												<Link href={'/accountInformation'} className={`normalLinkText ${styles.profileMenuItemsWrapper} ${styles.borderTop}`}>
													<AllIconsComponenet height={18} width={18} iconName={'setting'} color={'#000000'} />
													<p className={styles.profileMenuItemsText}>الإعدادات</p>
												</Link>
												<div className={styles.profileMenuItemsWrapper} onClick={() => handleSignOut()}>
													<AllIconsComponenet height={18} width={18} iconName={'logout'} color={'#FF0000'} />
													<p style={{ color: "red" }} className={styles.profileMenuItemsText}>تسجيل الخروج</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							}
						</div>
					</div>
				</div>
			}
			{open && <ModalComponent open={open} handleClose={handleClose} dispatch={dispatch} toast={toast} />}
		</>
	)
}