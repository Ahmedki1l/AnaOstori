import styles from '../styles/StudentFeedback.module.scss'
import axios from 'axios';
import ReviewCard from '../components/CommonComponents/ReviewsComponent/ReviewCard/ReviewCard'
import { useState } from 'react';
import AllIconsComponenet from '../Icons/AllIconsComponenet';


export async function getServerSideProps() {

	const allReviewsReq = axios.get(`${process.env.API_BASE_URL}/allReviews`)

	const [allReviews] = await Promise.all([
		allReviewsReq
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
					<h1 className='head2 text-white z-10'>تجارب الأساطير</h1>
					<p className='text-white z-10'>نفتخر بكل أسطوري يؤمن انه مافي شيء مستحيل!</p>
				</div>
			</div>
			<div className='maxWidthDefault'>
				<>
					<div>
						<p className='fontBold text-center py-4'> عرض التجارب بحسب </p>
						<div className='flex justify-center'>
							<div className={`${styles.drapdownWrapper} ${styles.courseDrapdownWrapper}`} onClick={() => { setShowCourseDropDown(!showCourseDropDown), setShowDateDropDown(false) }}>
								<div className={styles.dropDownDiv} >
									<p>اختر الدورة</p>
									<p className='fontBold flex'>{courseFilterType}
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
									<p className='fontBold flex'>{dateFilterType}
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
					{courseFilterType == 'جميع الدورات' ?
						<>
							{categoriWiseArray.map((catagory, i = index) => {
								return (
									<>
										{catagory.length > 0 &&
											<div key={`catagori${i}`}>
												<p className={`head2 px-4 pt-4`}>{catagory[0].course.catagory.name}</p>
												<div className='flex flex-wrap justify-center pt-4'>
													{catagory.map((feedback, j = index) => {
														return (
															<div key={`feedback${j}`}>
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
						</>
						:
						<div className='flex flex-wrap justify-center pt-4'>
							{catagoryReviews.map((feedback, index) => {
								return (
									<div key={`feedback${index}`}>
										<ReviewCard review={feedback} />
									</div>
								)
							})}
						</div>
					}
				</>
			</div>
		</div>
	)
}
