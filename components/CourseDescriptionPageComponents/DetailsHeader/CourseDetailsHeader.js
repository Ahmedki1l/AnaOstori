import styles from './CourseDetailsHeader.module.scss'
import BuyCourseComponent from './BuyCourseComponent/BuyCourseComponent';
import useWindowSize from '../../../hooks/useWindoSize';
import Link from 'next/link';
import useScrollEvent from '../../../hooks/useScrollEvent';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import CoverImg from '../../CommonComponents/CoverImg';
import { mediaUrl } from '../../../constants/DataManupulation';


const GoogleMapsIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5644.173 5644.173" className="w-6 h-6">
		<defs>
			<path id="a" d="M4300.322 0c-439.439 0-829.828 210.985-1075.081 537.54H403.155C181.42 537.54 0 718.96 0 940.695v4300.322c0 221.736 181.42 403.155 403.155 403.155h4300.322c221.735 0 403.155-181.419 403.155-403.155V2609.086c282.208-412.562 537.54-784.137 537.54-1265.235C5644.173 601.373 5042.8 0 4300.322 0z" />
			<path id="m" fill="#DB4437" d="M4300.322 0c-742.478 0-1343.851 601.373-1343.851 1343.851 0 1012.591 1130.85 1540.053 1264.563 2985.364 4.031 40.315 38.3 71.896 79.287 71.896s75.927-31.581 79.287-71.896c133.713-1445.312 1264.563-1972.773 1264.563-2985.364C5644.173 601.373 5042.8 0 4300.322 0z" />
			<clipPath id="c">
				<use href="#a" style={{ transform: 'scaleX(1.6) translateX(-31.5%)' }} />
			</clipPath>
			<filter id="b" width="280%" height="280%" x="-70%" y="-70%">
				<feGaussianBlur in="SourceAlpha" stdDeviation="600" />
				<feComponentTransfer>
					<feFuncA type="gamma" exponent=".7" />
				</feComponentTransfer>
				<feOffset dx="300" dy="100" />
			</filter>
		</defs>
		<path fill="#0F9D58" d="M2553.316 3090.856l2268.569-2535.46c-37.479-11.6-77.248-17.856-118.408-17.856H403.155C181.42 537.54 0 718.96 0 940.695v4300.322c0 41.16 6.257 80.929 17.856 118.408l2535.46-2268.569z" />
		<path fill="#4285F4" d="M2553.316 3090.856L284.747 5626.316c37.479 11.6 77.248 17.856 118.408 17.856h4300.322c41.16 0 80.929-6.256 118.408-17.856l-2268.569-2535.46z" />
		<path fill="#D2D2D2" d="M2553.316 3090.856l2535.46 2268.569c11.6-37.479 17.856-77.248 17.856-118.408V940.695c0-41.16-6.257-80.929-17.856-118.408l-2535.46 2268.569z" />
		<path fill="#F1F1F1" d="M5106.633 5241.018L2687.701 2822.086l-470.348 403.155 2418.931 2418.931h67.192c221.737.001 403.157-181.419 403.157-403.154z" />
		<path fill="#FFDE48" d="M4703.478 537.54L0 5241.018c0 221.736 181.42 403.155 403.155 403.155h67.193l4636.285-4636.285v-67.193c0-221.735-181.42-403.155-403.155-403.155z" />
		<path fill="#FFF" fillOpacity=".2" d="M4703.478 537.54H403.155C181.42 537.54 0 718.96 0 940.695v33.596c0-221.735 181.42-403.155 403.155-403.155h4300.322c221.735 0 403.155 181.42 403.155 403.155v-33.596c.001-221.735-181.419-403.155-403.154-403.155z" />
		<path fill="#263238" fillOpacity=".1" d="M4703.478 5610.577H403.155C181.42 5610.577 0 5429.157 0 5207.421v33.596c0 221.736 181.42 403.155 403.155 403.155h4300.322c221.735 0 403.155-181.419 403.155-403.155v-33.596c.001 221.736-181.419 403.156-403.154 403.156z" />
		<path fill="#EEE" d="M1142.273 1545.428v286.24h397.78c-31.581 169.997-180.748 293.631-397.78 293.631-241.221 0-437.423-204.265-437.423-444.814s196.202-444.814 437.423-444.814c108.852 0 205.609 37.628 282.881 110.196l211.657-211.656c-128.338-120.275-294.975-193.515-494.537-193.515-408.531 0-739.118 330.587-739.118 739.118s330.587 739.118 739.118 739.118c426.672 0 709.553-300.351 709.553-722.32 0-52.41-4.703-102.805-13.438-151.183h-696.116z" />
		<use href="#m" clipPath="url(#c)" filter="url(#b)" opacity=".25" style={{ transform: 'scaleX(.625) translateX(50.4%)' }} />
		<use href="#m" />
		<circle cx="4300.322" cy="1343.851" r="470.348" fill="#7B231E" />
		<path fill="#FFF" fillOpacity=".2" d="M4300.322 33.596c735.758 0 1333.1 591.294 1343.179 1324.365 0-4.703.672-9.407.672-14.11C5644.173 601.373 5042.8 0 4300.322 0s-1343.85 601.373-1343.85 1343.851c0 4.703.672 9.407.672 14.11 10.078-733.07 607.42-1324.365 1343.178-1324.365z" />
		<path fill="#3E2723" fillOpacity=".2" d="M4379.609 4295.619c-3.36 40.315-38.3 71.896-79.287 71.896s-75.927-31.581-79.287-71.896C4088.666 2857.027 2967.894 2327.55 2957.144 1324.365c0 6.719-.672 12.767-.672 19.486 0 1012.591 1130.85 1540.053 1264.564 2985.364 4.031 40.315 38.3 71.896 79.287 71.896s75.927-31.581 79.287-71.896c133.712-1445.312 1264.563-1972.773 1264.563-2985.364 0-6.719-.672-12.767-.672-19.486-10.751 1003.184-1130.851 1533.333-1263.892 2971.254z" />
		<radialGradient id="r" cx="140.0966" cy="5533.9414" r="6883.6064" gradientTransform="matrix(1 0 0 -1 0 6182.7524)" gradientUnits="userSpaceOnUse">
			<stop offset="0" stopColor="#fff" stopOpacity=".1" />
			<stop offset="1" stopColor="#fff" stopOpacity="0" />
		</radialGradient>
		<path fill="url(#r)" d="M4300.322 0c-439.439 0-829.828 210.985-1075.081 537.54H403.155C181.42 537.54 0 718.96 0 940.695v4300.322c0 221.736 181.42 403.155 403.155 403.155h4300.322c221.735 0 403.155-181.419 403.155-403.155V2609.086c282.208-412.562 537.54-784.137 537.54-1265.235C5644.173 601.373 5042.8 0 4300.322 0z" />
	</svg>
);


export default function CourseDetailsHeader(props) {

	const courseDetail = props.courseDetail
	console.log("🚀 ~ CourseDetailsHeader ~ courseDetail:", courseDetail);
	const locationNames = courseDetail.locationName;
	const locationURL = courseDetail?.link;
	const handleBookSitButtonClick = props.handleBookSitButtonClick
	const isMediumScreen = useWindowSize().mediumScreen
	const screenWidth = useWindowSize().width
	const offset = useScrollEvent().offset
	const lang = props.lang
	const courseCatagoriUrl = `${(courseDetail.catagory.name).replace(/ /g, "-")}`

	const locations = [
		{
			name: lang === 'en' ? 'Riyadh' : 'الرياض، حي الياسمين',
			mapUrl: 'https://goo.gl/maps/p9V4qb6csGQGXWxb6'
		},
		{
			name: lang === 'en' ? 'Dammam' : 'الدمام، حي الإتصالات',
			mapUrl: 'https://maps.app.goo.gl/Yr2Ecny4owTUhCCu7'
		},
		{
			name: lang === 'en' ? 'Gadda' : 'جدة، حي السلامة',
			mapUrl: 'https://maps.app.goo.gl/Zce5pJPo4AJTsg2Z6'
		}
	];

	return (
		<div className={styles.headerWrapper}>
			{courseDetail &&
				<div className='maxWidthDefault relative'>
					{(screenWidth > 767) &&
						<div className={styles.pathDiv}>
							<Link href={'/'} className={styles.pathText}>{lang == 'en' ? `Home` : `الرئيسية`}</Link>
							<div className={styles.arrowIcon}>
								{lang == 'en' ?
									<AllIconsComponenet iconName={'arrowRight'} height={12} width={12} color={'#FFFFFF'} />
									:
									<AllIconsComponenet iconName={'arrowLeft'} height={12} width={12} color={'#FFFFFF'} />
								}
							</div>
							<Link href={`/${courseCatagoriUrl}`} className={styles.pathText}>{courseDetail.catagory.name}</Link>
							<div className={styles.arrowIcon}>
								{lang == 'en' ?
									<AllIconsComponenet iconName={'arrowRight'} height={12} width={12} color={'#FFFFFF'} />
									:
									<AllIconsComponenet iconName={'arrowLeft'} height={12} width={12} color={'#FFFFFF'} />
								}
							</div>
							<h1 style={{ fontSize: '14px' }}>{courseDetail.name}</h1>
						</div>
					}
					{!(screenWidth > 767) &&
						<div className={`w-80 mx-auto ${styles.courseImgWrapper}`}>
							<CoverImg height={190} url={courseDetail.pictureKey ? mediaUrl(courseDetail.pictureBucket, courseDetail.pictureKey) : '/images/anaOstori.png'} />
							{/* <VideoThumnail pictureKey={courseDetail.pictureKey} videoKey={''} thumnailHeight={190} /> */}
						</div>
					}
					<h1 className={`head1 ${styles.courseName}`}>{courseDetail.name}</h1>
					<p className={styles.courseDiscriptionText}>{courseDetail.shortDescription}</p>
					<div className={styles.analyticsBarWrapper}>
						{courseDetail.type == 'physical' ?
							<div className={`${styles.analyticsCard} pt-8 ${lang == 'en' ? 'pr-8' : "pl-8"}`}>
								<div className='m-1'>
									<AllIconsComponenet height={isMediumScreen ? 18 : 32} width={isMediumScreen ? 20 : 32} iconName={'locationDoubleColor'} color={'#FFFFFF'} />
								</div>
								<div className="px-1">
									<p>{lang === 'en' ? 'Location' : 'تقام الدورة في'}</p>
									{courseDetail.type === "physical" ? (
										<div className={`flex flex-wrap ${(screenWidth > 767) ? "items-center" : "flex-col"}`}>
											{/* First group of locations */}
											{(locationNames.includes('الرياض') || locationNames.includes('RIYADH')) && <>
												<div className={`flex flex-wrap ${(screenWidth > 767) ? "items-center" : `flex-col`}`}>
													<p className={lang === 'en' ? "ml-2" : "mr-2"}>
														{lang === 'en' ? "Riyadh:" : "الرياض:"}
													</p>
													<div className={`flex items-center ${(screenWidth > 767) ? "" : `ml-4 mr-4 mt-2 mb-2`}`}>
														{/* {(screenWidth > 767) && <p className={lang === 'en' ? "ml-2" : "mr-2"}>(</p>} */}
														<div className="flex items-center ml-2 mr-2">
															<a
																href="https://goo.gl/maps/p9V4qb6csGQGXWxb6"
																target="_blank"
																rel="noopener noreferrer"
																style={{ color: '#fff' }}
																className="flex items-center hover:opacity-75 transition-opacity"
															>
																<GoogleMapsIcon />
															</a>
															<p className={lang === 'en' ? "ml-2" : "mr-2"}>
																{lang === 'en' ? "Riyadh, Al-Yasmeen District" : "حي الياسمين"}
															</p>
														</div>

														{/* {(screenWidth > 767) && <span className="mx-2 text-gray-400">-</span>}

													<div className="flex items-center ml-2 mr-2">
														<a
															href="https://maps.app.goo.gl/Un9XNuHwCREta9CV6"
															target="_blank"
															rel="noopener noreferrer"
															style={{ color: '#fff' }}
															className="flex items-center hover:opacity-75 transition-opacity"
														>
															<GoogleMapsIcon />
														</a>
														<p className={lang === 'en' ? "ml-2" : "mr-2"}>
															{lang === 'en' ? "Riyadh, Al-Yasmeen District" : "حي طويق"}
														</p>
													</div>

													{(screenWidth > 767) && <span className="mx-2 text-gray-400">-</span>}

													<div className="flex items-center ml-2 mr-2">
														<a
															href="https://maps.app.goo.gl/jSqnTmkKaNECq7Ct9"
															target="_blank"
															rel="noopener noreferrer"
															style={{ color: '#fff' }}
															className="flex items-center hover:opacity-75 transition-opacity"
														>
															<GoogleMapsIcon />
														</a>
														<p className={lang === 'en' ? "ml-2" : "mr-2"}>
															{lang === 'en' ? "Riyadh, Al-Yasmeen District" : "حي قرطبة"}
														</p>
													</div> */}

														{/* {(screenWidth > 767) && <p className={lang === 'en' ? "ml-2" : "mr-2"}>)</p>} */}
													</div>
												</div>

											</>
											}

											{(locationNames.includes('الدمام') || locationNames.includes('DAMMAM')) && <>
												{(screenWidth > 767) && (locationNames.includes('الرياض') || locationNames.includes('RIYADH')) && <span className="mx-2 text-gray-400">-</span>}
												<div className={`flex flex-wrap ${(screenWidth > 767) ? "items-center" : `flex-col`}`}>
													<p className={lang === 'en' ? "ml-2" : "mr-2"}>
														{lang === 'en' ? "Dammam:" : "الدمام:"}
													</p>
													{/* Second group */}
													<div className={`flex items-center ${(screenWidth > 767) ? "ml-2 mr-2" : `ml-6 mr-6 mt-2 mb-2`}`}>
														<a
															href="https://maps.app.goo.gl/Yr2Ecny4owTUhCCu7"
															target="_blank"
															rel="noopener noreferrer"
															style={{ color: '#fff' }}
															className="flex items-center hover:opacity-75 transition-opacity"
														>
															<GoogleMapsIcon />
														</a>
														<p className={lang === 'en' ? "ml-2" : "mr-2"}>
															{lang === 'en' ? "Al-Etisalat District" : "حي الإتصالات"}
														</p>
													</div>
												</div>

											</>
											}

											{(locationNames.includes('جدة') || locationNames.includes('JEDDAH')) && <>
												{(screenWidth > 767) && (locationNames.includes('الدمام') || locationNames.includes('DAMMAM')) && <span className="mx-2 text-gray-400">-</span>}
												<div className={`flex flex-wrap ${(screenWidth > 767) ? "items-center" : `flex-col`}`}>
													<p className={lang === 'en' ? "ml-2" : "mr-2"}>
														{lang === 'en' ? "Jeddah:" : "جدة:"}
													</p>
													{/* Third group */}
													<div className={`flex items-center ${(screenWidth > 767) ? "ml-2 mr-2" : `ml-6 mr-6 mt-2 mb-2`}`}>
														<a
															href="https://maps.app.goo.gl/Zce5pJPo4AJTsg2Z6"
															target="_blank"
															rel="noopener noreferrer"
															style={{ color: '#fff' }}
															className="flex items-center hover:opacity-75 transition-opacity"
														>
															<GoogleMapsIcon />
														</a>
														<p className={lang === 'en' ? "ml-2" : "mr-2"}>
															{lang === 'en' ? "Al Salamah District" : "حي السلامة"}
														</p>
													</div>
												</div>
											</>
											}
										</div>
									) : (
										<p>{lang === 'en' ? "Broadcast via" : 'يتم بثها عبر '}</p>
									)}
								</div>

							</div>
							: courseDetail.type == 'online' ?
								<div className={`${styles.analyticsCard} pt-8 ${lang == 'en' ? 'pr-8' : "pl-8"}`}>
									<div className='mt-2'>
										<AllIconsComponenet height={isMediumScreen ? 18 : 32} width={isMediumScreen ? 20 : 32} iconName={'onlineDoubleColorIcon'} color={'#FFFFFF'} />
									</div>
									<div className='px-1'>
										<p>{lang == 'en' ? 'Broadcast via' : 'يتم بثها عبر'}</p>
										<p className='fontBold'>{courseDetail.type == "online" ? courseDetail.locationName : lang == 'en' ? 'online' : 'اونلاين'}</p>
									</div>
								</div>
								:
								<div className={`${styles.analyticsCard} pt-8 ${lang == 'en' ? 'pr-8' : "pl-8"}`}>
									<div className='mt-2'>
										<AllIconsComponenet height={isMediumScreen ? 18 : 20} width={isMediumScreen ? 20 : 22} iconName={'newLiveTVIcon'} color={'#FFFFFF'} />
									</div>
									<div className='px-1'>
										<p>{lang == 'en' ? 'Recorded sessions' : 'دروس مسجلة'}</p>
										<p className='fontBold'>بجودة عالية</p>
									</div>
								</div>
						}
						{/* {courseDetail.type !== 'on-demand' ?
							<div className={`${styles.analyticsCard} pt-8 ${lang == 'en' ? 'pr-8' : "pl-8"}`}>
								<div className='m-1'>
									<AllIconsComponenet height={isMediumScreen ? 18 : 22} width={isMediumScreen ? 20 : 22} iconName={'location'} color={'#FFFFFF'} />
								</div>
								<div className='px-1'>
									<p>{lang == 'en' ? 'Location' : 'تقدم الدورة في'}</p>
									<p className='fontBold'>{courseDetail.type == "physical" ? courseDetail.locationName : lang == 'en' ? `Virtual ClassRoom` : 'يتم بثها عبر '}</p>
								</div>
							</div>
							:
							<div className={`${styles.analyticsCard} pt-8 ${lang == 'en' ? 'pr-8' : "pl-8"}`}>
								<div className='mt-2'>
									<AllIconsComponenet height={isMediumScreen ? 18 : 20} width={isMediumScreen ? 20 : 22} iconName={'globe'} color={'#FFFFFF'} />
								</div>
								<div className='px-1'>
									<p>{lang == 'en' ? 'Location' : 'يتم تقديمها عبر'}</p>
									<p className='fontBold'>اونلاين</p>
								</div>
							</div>
						} */}
						<div className={`${styles.analyticsBarWrapper2}`}>
							{courseDetail.reviewRate !== "-" && <div className={`${styles.analyticsCard} pt-8 ${lang == 'en' ? 'pr-8' : "pl-8"}`}>
								<div className='m-1'>
									<AllIconsComponenet height={isMediumScreen ? 18 : 24} width={isMediumScreen ? 20 : 24} iconName={'starDoubleColoredIcon'} color={'#FFCD3C'} />
								</div>
								<div className='px-1'>
									<p> {lang == 'en' ? `Course Review` : 'تقييم الدورة'} </p>
									<p className='fontBold'>{courseDetail.reviewRate}</p>
								</div>
							</div>}
							{courseDetail.numberOfGrarduates !== "-" && <div className={`${styles.analyticsCard} pt-8 ${lang == 'en' ? 'pr-8' : "pl-8"}`}>
								<div className='m-1'>
									<AllIconsComponenet height={isMediumScreen ? 18 : 22} width={isMediumScreen ? 20 : 22} iconName={'personDoubleColoredIcon'} color={'#FFFFFF'} />
								</div>
								<div className='px-1'>
									{courseDetail.type == 'onDemand' ?
										<p>{lang == 'en' ? 'Number of graduates subscriptions ' : 'عدد الاشتراكات'}</p>
										:
										<p>{lang == 'en' ? 'Number of graduates' : 'عدد المسجلين'} </p>
									}
									<p className='fontBold'>{courseDetail.numberOfGrarduates}</p>
								</div>
							</div>}
						</div>
					</div>
					{(screenWidth > 767 && (offset < (screenWidth > 1280 ? 357 : screenWidth < 1024 ? 313 : 336))) &&
						<BuyCourseComponent
							courseDetail={courseDetail}
							handleBookSitButtonClick={handleBookSitButtonClick}
							bookSeatButtonText={props.bookSeatButtonText}
							setDiscountShow={props.setDiscountShow}
							discountShow={props.discountShow}
							lang={lang} />
					}
				</div>
			}
		</div>
	)
}
