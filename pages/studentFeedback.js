import styles from '../styles/StudentFeedback.module.scss'
import React, { useState } from 'react'
import axios from 'axios'
import AllIconsComponenet from '../Icons/AllIconsComponenet'
import ReviewCard from '../components/CommonComponents/ReviewsComponent/ReviewCard/ReviewCard'
import useWindowSize from '../hooks/useWindoSize'
import Link from 'next/link'
import * as linkConst from '../constants/LinkConst'

export async function getServerSideProps() {

	const homeReviewsReq = axios.post(`${process.env.API_BASE_URL}/route`, { routeName: `allReviews` })

	const [allReviews] = await Promise.all([
		homeReviewsReq
	])
	return {
		props: {
			allReviews: allReviews.data,
		}
	}
}

export default function StudentFeedback(props) {
	const [dateFilterType, setDateFilterType] = useState('الأحدث')
	const [courseFilterType, setCourseFilterType] = useState('جميع الدورات')
	const [allReviews, setAllReviews] = useState(props.allReviews ? props.allReviews.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)) : [])
	const [catagoryReviews, setCatagoryReviews] = useState()
	const [showDateDropDown, setShowDateDropDown] = useState(false)
	const [showCourseDropDown, setShowCourseDropDown] = useState(false)

	const handelDateFilter = (data) => {
		setDateFilterType(data)
		const newArray = [...allReviews]
		newArray.sort((a, b) => {
			return data == 'الأحدث' ? -a.createdAt.localeCompare(b.createdAt) : a.createdAt.localeCompare(b.createdAt)
		})
		setAllReviews(newArray)
		setShowDateDropDown(false)
	}

	const handelCourseFilter = (data) => {
		setCourseFilterType(data)
		const selectedCatagori = allReviews.filter((review) => review.course.catagory.name == data)
		setCatagoryReviews(selectedCatagori)
	}

	const categorizeArray = () => {
		const categorizedArray = [];
		const categories = {};
		for (const element of allReviews) {
			const category = element.course.catagory.name
			if (!categories[category]) {
				categories[category] = [];
			}
			categories[category].push(element);
		}
		for (const category in categories) {
			categorizedArray.push(categories[category]);
		}
		return categorizedArray;
	}
	const categoriWiseArray = categorizeArray();
	return (
		<div>
			<div className={styles.headevDiv}>
				<div className={styles.transparentDiv}>
					<h1 className='head2 text-white z-10'>🔥 درجات طلابنا تحكي عنّا</h1>
					<p className='text-white z-10'>نفتخر بكل أسطوري يؤمن انه مافي شيء مستحيل!</p>
				</div>
			</div>
			<div className='maxWidthDefault'>
				<>
					<div>
						<p className={`fontBold text-xl py-4 ${styles.dropDownHeadText}`}>عرض الدرجات بحسب</p>
						<div className='flex justify-center'>
							<div className={`${styles.drapdownWrapper} ${styles.courseDrapdownWrapper}`} onClick={() => { setShowCourseDropDown(!showCourseDropDown), setShowDateDropDown(false) }}>
								<div className={styles.dropDownDiv} >
									<p>اختار الدورة</p>
									<p className='fontMedium flex mt-1'>{courseFilterType}
										<div className='p-1'>
											<AllIconsComponenet height={15} width={15} iconName={'keyBoardDownIcon'} color={'#000000'} />
										</div>
									</p>
								</div>
								{showCourseDropDown && <div className={styles.courseDropBox}>
									<p onClick={() => handelCourseFilter('جميع الدورات')}>جميع الدورات</p>
									{categoriWiseArray?.map((catagory, index) => {
										return (
											<>
												{catagory.length > 0 && <p key={`catagory${index}`} onClick={() => handelCourseFilter(catagory[0].course.catagory.name)}>{catagory[0].course.catagory.name}</p>}
											</>
										)
									})}
								</div>}
							</div>
							<div className={`${styles.drapdownWrapper} ${styles.dateDrapdownWrapper}`} onClick={() => { setShowDateDropDown(!showDateDropDown), setShowCourseDropDown(false) }}>
								<div className={styles.dropDownDiv}>
									<p>تاريخ التجربة</p>
									<p className='fontMedium flex mt-1'>{dateFilterType}
										<div className='p-1'>
											<AllIconsComponenet height={15} width={15} iconName={'keyBoardDownIcon'} color={'#000000'} />
										</div>
									</p>
								</div>
								{showDateDropDown && <div className={styles.dateDropBox}>
									<p onClick={() => handelDateFilter('الأحدث')}>الأحدث</p>
									<p onClick={() => handelDateFilter('الأقدم')}>الأقدم</p>
								</div>}
							</div>
						</div>
					</div>
					{courseFilterType !== 'جميع الدورات' ?
						<div>
							<div>
								{catagoryReviews &&
									<>
										<p className={`text-xl fontBold px-4 pt-4`}>{catagoryReviews[0].course.catagory.name}</p>
										<div className={styles.allReviewsItemsWrapper}>
											<ReviewCard review={catagoryReviews[0]} />
											<div className={styles.sharedItemsDiv}>
												<div className='text-center'>
													<p className='fontBold text-xl mb-2' >ننتظرك تشاركنا 🥇</p>
													<p className='text-lg'>إذا انت من طلابنا، تفضل شاركنا درجتك <br /> وتجربتك <br /> متحمسين نسمع منك 😁</p>
												</div>
												<Link href={`${linkConst.WhatsApp_Link}`} target='_blank' className='normalLinkText'>
													<div className={styles.shareWhatsAppBtnBox}>
														<AllIconsComponenet height={20} width={20} iconName={'whatsappFill'} color={'#40C351'} />
														<p className='fontMedium mx-2'>شاركنا على الواتس</p>
													</div>
												</Link>
												<Link href={`${linkConst.Instagram_Link}`} target='_blank' className='normalLinkText'>
													<div className={styles.shareWhatsAppBtnBox}>
														<AllIconsComponenet height={20} width={20} iconName={'coloredInstaIcon'} />
														<p className='fontMedium mx-2'>شاركنا على الانستقرام</p>
													</div>
												</Link>
											</div>
											{catagoryReviews.map((feedback, index) => {
												return (
													<>
														{index > 0 &&
															<div key={`feedback${index}`}>
																<ReviewCard review={feedback} />
															</div>
														}
													</>
												)
											}
											)}
										</div>
									</>
								}
							</div>
						</div>
						:
						<div>
							{categoriWiseArray.map((arr, index) => {
								return (
									<>
										{arr.length > 0 &&
											<div key={`catagori${index}`}>
												<p className={`text-xl fontBold px-4 pt-4`}>{arr[0].course.catagory.name}</p>
												<div className='flex flex-wrap justify-center pt-4'>
													{arr.map((feedback, index) => {
														return (
															<div key={`feedback${index}`}>
																<ReviewCard review={feedback} />
															</div>
														)
													})}
												</div>
											</div>
										}
									</>
								)
							})}
						</div>
					}
				</>
			</div>
		</div>
	)
}
