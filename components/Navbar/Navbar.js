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
import { getNewToken, signOutUser } from '../../services/fireBaseAuthService'
import { getAuthRouteAPI, getRouteAPI, } from '../../services/apisService';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import { stringUpdation } from '../../constants/DataManupulation';
import CommingSoonModal from '../CommonComponents/CommingSoonModal/CommingSoonModal';
import { ConfigProvider, Drawer } from 'antd';
import styled from 'styled-components';

const StyledDrawer = styled(Drawer)`
  .ant-drawer-body{
	padding: 0px !important;
  }
  .ant-drawer {
    position: fixed;
    inset: 0;
    pointer-events: none;
}
`

export default function Navbar() {

	const isSmallScreen = useWindowSize().smallScreen
	const isMediumScreen = useWindowSize().mediumScreen
	const [isMenuShow, setIsMenuShow] = useState(false)
	const [commingSoonModalOpen, setCommingSoonModalOpen] = useState(false);
	const [showSubMenu, setShowSubMenuShown] = useState()
	const prevSubMenu = useRef();
	const [open, setOpen] = useState(false);

	const router = useRouter();
	const offset = useScrollEvent().offset
	const dispatch = useDispatch();

	const catagoryName = (router.query.catagoryName)?.replace(/-/g, ' ')

	const storeData = useSelector((state) => state?.globalStore);

	const userFullName = (storeData?.viewProfileData?.fullName) ? storeData?.viewProfileData?.fullName : storeData?.viewProfileData?.firstName

	const isRegisterSocialMediaUser = router.pathname == "/registerSocialMediaUser" ? true : false

	const isUserInstructor = storeData?.isUserInstructor

	const [catagories, setCatagories] = useState()

	useEffect(() => {
		if (storeData?.accessToken) {
			catagoryAuth()
		} else {
			catagoryNoAuth()
		}
	}, [storeData?.accessToken])


	const catagoryNoAuth = async () => {
		await axios.get(`${process.env.API_BASE_URL}/route/fetch?routeName=categoriesNoAuth`).then(res => {
			setCatagories(res?.data.filter((item) => item.published == true))
		}).catch(async (error) => {
			console.log(error);
		})
	};

	const catagoryAuth = async () => {
		try {

			const getcatagoriReq = getAuthRouteAPI({ routeName: 'categories' })
			const getCurriculumIdsReq = getRouteAPI({ routeName: 'getAllCurriculum' })
			const getInstructorListReq = getRouteAPI({ routeName: 'getAllInstructors' })
			const getMyCourseReq = getAuthRouteAPI({ routeName: 'myCourses' })


			const [catagories, curriculumIds, instructorList, myCourseData] = await Promise.all([
				getcatagoriReq, getCurriculumIdsReq, getInstructorListReq, getMyCourseReq
			])
			setCatagories(catagories?.data.filter((item) => item.published == true))
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
			dispatch({
				type: 'SET_ALL_MYCOURSE',
				myCourses: myCourseData?.data,
			});
		} catch (error) {
			if (error?.response?.status == 401) {
				await getNewToken().then(async (token) => {
					const getcatagoriReq = getAuthRouteAPI({ routeName: 'categories' })
					const getCurriculumIdsReq = getRouteAPI({ routeName: 'getAllCurriculum' })
					const getInstructorListReq = getRouteAPI({ routeName: 'getAllInstructors' })
					const getMyCourseReq = getAuthRouteAPI({ routeName: 'myCourses' })

					const [catagories, curriculumIds, instructorList, myCourseData] = await Promise.all([
						getcatagoriReq, getCurriculumIdsReq, getInstructorListReq, getMyCourseReq
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
					dispatch({
						type: 'SET_ALL_MYCOURSE',
						myCourses: myCourseData?.data,
					});
				}).catch(error => {
					console.error("Error:", error);
				});
			}
		}
	}

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

	const handleClickCourseName = (submenu, menu, lang) => {
		setShowSubMenuShown()
		setIsMenuShow(false)
		if (submenu.type == "on-demand" && submenu.isEnrolled == true) {
			router.push(`/myCourse/${submenu.id}`)
		} else {
			if (submenu.isPurchasable == false) {
				setCommingSoonModalOpen(true)
				return
			} else {
				if (lang == "en") {
					router.push({
						pathname: `/${(menu.replace(/ /g, "-"))}/${(submenu.name).replace(/ /g, "-")}`,
						query: { language: 'en' },
					})
				} else {
					router.push({
						pathname: `/${(submenu.name).replace(/ /g, "-")}/${(menu.replace(/ /g, "-"))}`,
					})
				}
			}
		}
	}

	useEffect(() => {
		const element = document.getElementById('navBar');
		if (offset > 100) {
			element?.classList.add('top80');
		} else {
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
					{(storeData?.accessToken && !isRegisterSocialMediaUser) &&
						<div className={styles.navLeftDivMO}>
							<div className={styles.navLeftDiv}>
								<div className={styles.viewProfile}>
									<AllIconsComponenet height={16} width={20} iconName={'keyBoardDownIcon'} color={'#000000'} />
									<AllIconsComponenet height={isSmallScreen ? 30 : 35} width={isSmallScreen ? 30 : 35} iconName={'profileIcon'} color={'#ffffff'} />
								</div>
								<div className={`${styles.profileMenuWrapperMo} ${styles.profileMenuWrapper}`}>
									<div className={styles.profileMenuSubWrapper}>
										<Link href={'/myProfile'} className={`normalLinkText ${styles.profileMenuItemsWrapper}`}>
											<AllIconsComponenet height={24} width={24} iconName={'newPersonIcon'} color={'#808080'} />
											<p className={styles.profileMenuItemsText}>الملف الشخصي</p>
										</Link>
										<div className={styles.inqBtnBox}>
											<Link href={'/purchaseInquiry'} className='no-underline'>
												<button className={`secondrySolidBtn ${styles.serchQueryBtn}`} onClick={() => handleClickOnLink()}>
													<div style={{ height: '40px' }} className='p-2'>
														<AllIconsComponenet height={24} width={24} iconName={'managePurchaseOrder'} color={'#ffffff'} /> &nbsp;
													</div>
													استعلام الحجوزات
												</button>
											</Link>
										</div>
										<Link href={'/accountInformation'} className={`normalLinkText ${styles.profileMenuItemsWrapper} ${styles.borderTop}`}>
											<div style={{ height: '23px' }}><AllIconsComponenet height={20} width={20} iconName={'newSettingIcon'} color={'#808080'} /></div>
											<p className={styles.profileMenuItemsText}>الإعدادات</p>
										</Link>
										<div className={styles.profileMenuItemsWrapper} onClick={() => handleSignOut()}>
											<AllIconsComponenet height={20} width={20} iconName={'newLogOutIcon'} color={'#E5342F'} />
											<p style={{ color: "red" }} className={styles.profileMenuItemsText}>تسجيل الخروج</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					}
					<Link href={'/'} className='pt-1'>
						<Logo height={34} width={62} logoName={'anaOstoriLogo'} alt={'Ana Ostori Logo'} />
					</Link>
					<div className={`p-1 cursor-pointer ${styles.menuBtn}`} onClick={() => setIsMenuShow(!isMenuShow)}>
						<AllIconsComponenet iconName={'menuIcon'} height={18} width={18} color={'#000000'} />
					</div>
					{isMenuShow &&
						<ConfigProvider direction='rtl'>
							<StyledDrawer
								open={isMenuShow}
								closable={false}
								width={305}
								onClose={() => setIsMenuShow(false)}
								title={
									<div className={styles.mobileMemuHead}>
										<div className='cursor-pointer' onClick={() => setIsMenuShow(!isMenuShow)}>
											<AllIconsComponenet iconName={'menuIcon'} height={18} width={18} color={'#000000'} />
										</div>
										<p className=' text-xl '>القائمة</p>
									</div>
								}
							>
								<div className={styles.sildeBarMenu}>
									<div className='border-b border-inherit mb-2'></div>
									{!storeData?.accessToken &&
										<div className={styles.loginBtnsBox}>
											<div className={styles.loginBtnBox} onClick={() => handleClickOnLink()}>
												<Link href={"/register"} className='normalLinkText' >
													<button className={`primaryStrockedBtn ${styles.loginBtn}`}>إنشاء حساب</button>
												</Link>
											</div>
											<div className={styles.signupBtnBox} onClick={() => handleClickOnLink()}>
												<Link href={"/login"} className='normalLinkText'>
													<button className={`primarySolidBtn ${styles.signupBtn}`}>تسجيل الدخول</button>
												</Link>
											</div>
										</div>}
									<div className={`p-4 ${styles.mainMenuWrapper}`}>
										{/* <p onClick={() => handleClickOnLink()} className={`cursor-pointer ${styles.homeText}`}>الرئيسية</p> */}
										<Link href={'/'} onClick={() => handleClickOnLink()} className={styles.homeText}>الرئيسية </Link>
									</div>
									<div className='border-b border-inherit'></div>
									<ul className={styles.navbarSubWrapper}>
										{catagories?.map((menu, i = index) => {
											return (
												<li className={`border-b border-inherit w-full list-none`} key={`navMenu${i}`}>
													<div className={`flex items-center cursor-pointer ${styles.mainMenuWrapper}`} onClick={() => handleshowSubMenu(i)}>
														<p className={`p-4 text-lg ${catagoryName == menu.name ? 'fontBold' : 'fontRegular'}`}>
															{stringUpdation(menu.name, 35)}
														</p>
														<AllIconsComponenet height={24} width={24} iconName={showSubMenu == i ? 'newUpArrowIcon' : 'newDownArrowIcon'} color={'#000000'} />
													</div>
													{showSubMenu == i &&
														<div className={styles.slideSubMenuBox}>
															{menu.courses?.map((subMenu, j = index) => {
																return (
																	<div key={`navSubMenu${j}`}>
																		<div
																			className={`block ${styles.subMenuText}`} onClick={() => { handleClickOnLink(); handleClickCourseName(subMenu, menu.name, subMenu.language) }}>
																			{subMenu.name.length > 30 ? (
																				<span>{subMenu.name.slice(0, 30)}...</span>
																			) :
																				<span>{subMenu.name}</span>
																			}
																		</div>
																	</div>
																)
															})}
														</div>
													}
												</li>
											)
										})}
									</ul>
								</div>
							</StyledDrawer>
						</ConfigProvider>
					}
				</div>
				:
				<div className={styles.navbarWrapper} id="navBar" >
					<div className='maxWidthDefault'>
						<div className={styles.navbarInnerWrapper}>
							<Link href={'/'} className={`pl-8 my-auto ${isRegisterSocialMediaUser && 'cursor-not-allowed'}`}>
								<Logo height={38} width={68} logoName={'anaOstoriLogo'} alt={'Ana Ostori Logo'} />
							</Link>
							{!isRegisterSocialMediaUser &&
								<>
									<div className={`pl-6 my-auto`}>
										<Link href={'/'} className='normalLinkText'><p className={styles.homeText}>الرئيسية</p></Link>
									</div>
									<ul className={styles.navbarSubWrapper}>
										{catagories?.map((menu, i = index) => {
											return (
												<li className={`${styles.navItem} ${styles.menuItem}`} key={`navMenu${i}`}>
													<p className={`${styles.mainMenuText} ${catagoryName == menu.name ? `fontBold` : `fontRegular`}`}>
														{stringUpdation(menu.name, 30)}
													</p>
													<AllIconsComponenet height={16} width={20} iconName={'keyBoardDownIcon'} color={'#000000'} />
													<div className={styles.submenuBox}>
														{menu.courses?.map((subMenu, j = index) => {
															return (
																<div key={`navSubMenu${j}`}>
																	<div
																		className={`block ${styles.subMenuText}`}
																		onClick={() => handleClickCourseName(subMenu, menu.name, subMenu.language)}
																	>
																		{subMenu.name}
																	</div>
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
								<div className={styles.navbarLeftDiv}>
									{isUserInstructor && <div className={styles.instructorBtnBox}>
										<button className={`primaryStrockedBtn`} onClick={() => handleInstructorBtnClick()}>لوحة التحكم</button>
									</div>}
									<div className={styles.navLeftDiv}>
										{!isRegisterSocialMediaUser &&
											<>
												<div className={styles.viewProfile}>
													<AllIconsComponenet height={35} width={35} iconName={'profileIcon'} color={'#ffffff'} />
													<p>
														{stringUpdation(userFullName, 10)}
													</p>
													<AllIconsComponenet height={16} width={20} iconName={'keyBoardDownIcon'} color={'#000000'} />
												</div>
												<div className={styles.profileMenuWrapper}>
													<div className={styles.profileMenuSubWrapper}>
														<Link href={'/myProfile'} className={`normalLinkText ${styles.profileMenuItemsWrapper}`}>
															<AllIconsComponenet height={24} width={24} iconName={'newPersonIcon'} color={'#808080'} />
															<p className={styles.profileMenuItemsText}>الملف الشخصي</p>
														</Link>
														<div className={styles.inqBtnBox}>
															<Link href={'/purchaseInquiry'} className='no-underline'>
																<button className={`secondrySolidBtn ${styles.serchQueryBtn}`} onClick={() => handleClickOnLink()}>
																	<div style={{ height: '25px' }}>
																		<AllIconsComponenet height={24} width={24} iconName={'managePurchaseOrder'} color={'#ffffff'} />
																	</div> &nbsp;
																	استعلام الحجوزات
																</button>
															</Link>
														</div>
														<Link href={'/accountInformation'} className={`normalLinkText ${styles.profileMenuItemsWrapper} ${styles.borderTop}`}>
															<div style={{ height: '23px' }}><AllIconsComponenet height={20} width={20} iconName={'newSettingIcon'} color={'#808080'} /></div>
															<p className={styles.profileMenuItemsText}>الإعدادات</p>
														</Link>
														<div className={styles.profileMenuItemsWrapper} onClick={() => handleSignOut()}>
															<AllIconsComponenet height={20} width={20} iconName={'newLogOutIcon'} color={'#E5342F'} />
															<p style={{ color: "red" }} className={styles.profileMenuItemsText}>تسجيل الخروج</p>
														</div>
													</div>
												</div>
											</>
										}
									</div>
								</div>
							}
						</div>
					</div>
				</div>
			}
			{open && <ModalComponent open={open} handleClose={handleClose} dispatch={dispatch} toast={toast} />}
			{commingSoonModalOpen &&
				<CommingSoonModal
					open={commingSoonModalOpen}
					commingSoonModalOpen={commingSoonModalOpen}
					setCommingSoonModalOpen={setCommingSoonModalOpen}
				/>}
		</>
	)
}