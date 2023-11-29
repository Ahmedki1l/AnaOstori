import React, { useEffect, useState } from 'react'
import styles from './UserInfoForm.module.scss'
import FirstPaymentPageInfo from '../PaymentPageIndicator/FirstPageIndicator';
import DatesInfo from './DatesBox/DatesInfo'
import * as PaymentConst from '../../../constants/PaymentConst';
import ScrollContainer from 'react-indiana-drag-scroll'
import Link from 'next/link';
import { useRouter } from 'next/router';
import UserDetailForm1 from '../../CourseDescriptionPageComponents/UserDetailForm1';
import useWindowSize from '../../../hooks/useWindoSize';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { useSelector } from 'react-redux';
import { dateWithDay } from '../../../constants/DateConverter';
import { getRouteAPI } from '../../../services/apisService';



export default function UserInfoForm(props) {
	const studentsDataLength = props.studentsData?.length
	const noOfUsersTag = PaymentConst.noOfUsersTag
	const courseDetail = props.courseDetails
	const genders = PaymentConst.genders
	const [maleDates, setMaleDates] = useState(props.maleDates.length > 0 && props.maleDates.every(obj => obj.numberOfSeats === 0) ? [] : props.maleDates);
	const [femaleDates, setFemaleDates] = useState(props.femaleDates.length > 0 && props.femaleDates.every(obj => obj.numberOfSeats === 0) ? [] : props.femaleDates);
	const mixDates = props.mixDates.length > 0 && props.mixDates.every(obj => obj.numberOfSeats === 0) ? [] : props.mixDates;
	const disabledGender = courseDetail.type == 'physical' ? (maleDates.length == 0 ? "male" : femaleDates.length == 0 ? "female" : null) : null
	const storeData = useSelector((state) => state?.globalStore);
	const userPredefineEmail = storeData?.viewProfileData?.email
	const userPredefinePhone = storeData?.viewProfileData?.phone?.replace("966", "0")
	const userPredefinefullName = (storeData?.viewProfileData?.fullName) ? storeData?.viewProfileData?.fullName : storeData?.viewProfileData?.firstName
	const userPredefineGender = storeData?.viewProfileData?.gender
	const [isDateForAllSelected, setIsDateForAllSelected] = useState(false)
	const [regionDataList, setRegionDataList] = useState()
	const router = useRouter()
	const groupDiscountEligible = courseDetail.groupDiscountEligible
	const smallScreen = useWindowSize().smallScreen

	const userTemplet = {
		gender: '',
		date: '',
		fullName: '',
		phoneNumber: '',
		email: '',
		availabilityId: ''
	}

	const preselectedUserTempletFOrOnDemand = {
		gender: courseDetail.type == 'on-demand' && userPredefineGender ? userPredefineGender : '',
		date: '',
		fullName: courseDetail.type == 'on-demand' && userPredefinefullName ? userPredefinefullName : '',
		phoneNumber: courseDetail.type == 'on-demand' && userPredefinePhone ? userPredefinePhone : '',
		email: courseDetail.type == 'on-demand' && userPredefineEmail ? userPredefineEmail : '',
		availabilityId: ''
	}

	const noOfUsersLabelData = [
		{ iconName: 'studentOneIcon', iconWidth: smallScreen ? '13' : '20', label1: 'شخص واحد ', subLabel1: '', label2: `${courseDetail.discount} ر.س`, subLabel2: '', oldPrice: `${courseDetail.price} ر.س`, singleDiscount: `${courseDetail.discount != null ? `خصم ${(100 - ((courseDetail.discount / courseDetail.price) * 100)).toFixed(2)} % ` : ''}` },
		{ iconName: 'studentTwoIcon', iconWidth: smallScreen ? '20' : '32', label1: 'شخصين', subLabel1: `${courseDetail.discountForTwo} ر.س على كل شخص`, label2: `${(courseDetail.discountForTwo) * 2} ر.س`, subLabel2: `وفر ${((courseDetail.price * 2) - (courseDetail.discountForTwo * 2))} ر.س`, oldPrice: '', singleDiscount: '' },
		{ iconName: 'studentThreeIcon', iconWidth: smallScreen ? '22' : '40', label1: '3 اشخاص او اكثر', subLabel1: `${courseDetail.discountForThreeOrMore} ر.س على كل شخص`, label2: 'حسب العدد', oldPrice: '', singleDiscount: '' },
	]
	const [selectedGender, setSelectedGender] = useState(router.query.gender ? (router.query.gender == 'mix' ? 'male' : router.query.gender) : '')
	const [selectedDate, setSelectedDate] = useState(router.query.date ? router.query.date : "")
	const [selectedRegion, setSelectedRegion] = useState(router.query.region ? router.query.region : "");

	const preSelectTemplet = { gender: selectedGender, date: selectedDate, fullName: '', phoneNumber: '', email: '', availabilityId: router.query.date }
	const [totalStudent, setTotalStudent] = useState((studentsDataLength) ? (((studentsDataLength > 2) ? 3 : studentsDataLength)) : 1)
	const [userAgree, setUserAgree] = useState(false)
	const [enrollForMe, setEnrollForMe] = useState(false)
	const [studentsData, setStudentsData] = useState(
		(courseDetail.type == 'on-demand') ? [preselectedUserTempletFOrOnDemand]
			: studentsDataLength ? (props.studentsData)
				: (router.query ? [preSelectTemplet]
					: [userTemplet]))

	useEffect(() => {
		if (studentsDataLength && studentsDataLength > 0) {
			setStudentsData(props.studentsData)
			setTotalStudent(studentsDataLength)
		}
		if (router.query.region) {
			setSelectedRegion(router.query.region)
		}
		getRegionAndBranchList()
	}, [props.studentsData, studentsDataLength])

	useEffect(() => {
		setMaleDates(props.maleDates.filter((date) => date.regionId == router.query.region));
		setFemaleDates(props.femaleDates.filter((date) => date.regionId == router.query.region))
	}, [])

	const handleTotalStudent = (value) => {
		const newTotalStudent = value
		setTotalStudent(newTotalStudent)

		if (newTotalStudent > totalStudent) {
			const students = newTotalStudent - totalStudent
			for (let i = 0; i < students; i++) {
				setStudentsData(studentsData => [...studentsData, JSON.parse(JSON.stringify(userTemplet))])
			}
		}
		else {
			const students = totalStudent - newTotalStudent
			let data = [...studentsData]
			data.splice(1, students)
			setStudentsData(data)
		}
	}

	const handleAddForm = (isDateForAllSelected) => {
		if (isDateForAllSelected == true) {
			setStudentsData(studentsData => [...studentsData, JSON.parse(JSON.stringify(
				{ gender: studentsData[0]['gender'], date: studentsData[0]['date'], fullName: '', phoneNumber: '', email: '', availabilityId: studentsData[0]['availabilityId'] }
			))])
		}
		else {
			setStudentsData(studentsData => [...studentsData, JSON.parse(JSON.stringify(userTemplet))])
		}
		setTotalStudent(studentsData.length)
	}

	const handleRemoveForm = (i) => {
		let data = [...studentsData]
		data.splice(i, 1)
		setStudentsData(data)
		setTotalStudent(data.length)
	}
	const handleFormChange = (event, index, availabilityId) => {
		const data = [...studentsData]
		if (event.target.title == 'phoneNumber') {
			if (event.target.value.length > 10) {
				return
			}
		}
		data[index][event.target.title] = event.target.value
		setSelectedGender()
		setSelectedDate()
		if (event.target.title == 'date') {
			data[index]['availabilityId'] = availabilityId
		}
		if (event.target.title == 'gender') {
			data[index]['date'] = ''
			data[index]['availabilityId'] = ''
		}
		if (totalStudent > 1 && (event.target.title == 'date' || event.target.title == 'gender')) {
			for (let i = 0; i < data.length; i++) {
				if (data[i]['gender'].length > 0 && data[0]['gender'] != data[i]['gender']) {
					document.getElementById("dateForAll").checked = false;
					break
				}
				else if (data[i]['availabilityId'].length > 0 && data[0]['availabilityId'] != data[i]['availabilityId']) {
					document.getElementById("dateForAll").checked = false;
					break
				}
			}
		}
		setStudentsData(data);
	}

	const handleDateForAll = (event) => {
		const data = [...studentsData]
		setIsDateForAllSelected(event.target.checked)
		if (event.target.checked == true) {
			for (let i = 0; i < data.length; i++) {
				data[i]['availabilityId'] = data[0]['availabilityId']
				data[i]['date'] = data[0]['date']
				data[i]['gender'] = data[0]['gender']
			}
		}
		else {
			for (let i = 0; i < data.length; i++) {
				if (i != 0) {
					data[i]['availabilityId'] = ''
					data[i]['date'] = ''
					data[i]['gender'] = ''
				}
			}
		}
		setStudentsData(data);
	}

	const handleEnrollForMe = (event) => {
		setEnrollForMe(event.target.checked)
		let data = [...studentsData]
		if (event.target.checked == true) {
			data[0]['email'] = userPredefineEmail
			data[0]['fullName'] = userPredefinefullName
			data[0]['phoneNumber'] = userPredefinePhone
		} else {
			data[0]['email'] = ''
			data[0]['fullName'] = ''
			data[0]['phoneNumber'] = ''
		}
		setStudentsData(data);
	}
	const handleSubmit = (studentsData, courseDetailType) => {
		props.isInfoFill(studentsData, courseDetailType, userAgree)
	}

	const getRegionAndBranchList = async () => {
		let body = {
			routeName: 'listRegion',
		}
		await getRouteAPI(body).then((res) => {
			setRegionDataList(res.data)
			if (!router.query.region) {
				setSelectedRegion(res.data[0].id)
			}
		}).catch((err) => {
			console.log(err)
		})
	}

	const handleRegionChange = (event, index) => {
		setSelectedRegion(event.target.value)
		let data = [...studentsData]
		data[index]['region'] = event.target.value
		setStudentsData(data);
		setMaleDates(props.maleDates.filter((date) => date.regionId == event.target.value));
		setFemaleDates(props.femaleDates.filter((date) => date.regionId == event.target.value))
	}
	return (
		<>
			<FirstPaymentPageInfo />
			<div className='pb-4'>
				{groupDiscountEligible && courseDetail.type != 'on-demand' &&
					<div className={styles.borderBottom}>
						<div className={`maxWidthDefault  ${styles.radioBtnsContainer}`}>
							<p className={`fontBold my-2 ${styles.radioBtnHead}`}>كم شخص؟</p>
							<div className={styles.noOfUserWrapper}>
								{/***************************************** FOR loop for radio button to select number of Users ******************************************/}
								{noOfUsersLabelData.map((data, index) => {
									return (
										<div key={`noOfUsersRadoi${index}`}>
											<input type="radio" id={`user${index + 1}`} name='noOfUser' value={index + 1} className="hidden peer" defaultChecked={totalStudent == 1 ? (index === 0) : (totalStudent == 2 ? (index === 1) : (index === 2))} onChange={() => handleTotalStudent(index + 1)} />
											<label htmlFor={`user${index + 1}`} className={styles.usersRadioWrapper}>
												<div className={styles.circle}><div></div></div>
												<div className={styles.userRadioLabelBox}>
													<AllIconsComponenet height={24} width={data.iconWidth} iconName={data.iconName} color={totalStudent == index + 1 ? '#ffffff' : '#000000'} strockColor={totalStudent == index + 1 ? '#F26722' : '#ffffff'} />
													<div className={styles.lable1Box}>
														<p className={`fontMedium ${styles.lable1}`}>{data.label1} {data.singleDiscount && <span className={styles.singleDiscount}>{data.singleDiscount}</span>} </p>
														<p className={styles.subLable1}>{data.subLabel1}</p>
													</div>
													<div className={styles.lable2Box}>
														<p className={`${smallScreen ? 'fontMedium' : 'fontBold'} ${styles.lable2}`}>{data.label2 === `null ر.س` ? `${data.oldPrice}` : `${data.label2}`}</p>
														<p className={`fontMedium ${styles.subLable2}`}>{data.subLabel2}</p>
														{(data.oldPrice && data.label2 != `null ر.س`) && <p className={styles.oldPrice}>{data.oldPrice}</p>}
													</div>
												</div>
											</label>
										</div>
									)
								})}
							</div>
						</div>
					</div>
				}
				{/***************************************** FOR loop for User form ******************************************************/}
				{studentsData.map((student, i = index) => {
					const {
						genderCheck,
						dateCheck,
						fullName,
						nameCheck,
						nameLengthCheck,
						validName,
						phoneNumber,
						phoneNoCheck,
						phoneNoLengthCheck,
						validPhoneNumber,
						email,
						emailCheck,
						emailValidCheck,
						regionCheck
					} = student
					return (
						<div className={`px-4 ${styles.oneUserInfoForm} ${totalStudent > 1 ? '' : 'pt-4'}`} key={`student${i}`}>
							<div className={`maxWidthDefault ${styles.radioBtnsContainer}`}>
								{totalStudent > 1 &&
									<div className={`flex justify-between pt-2 ${styles.radioBtnHead}`}>
										<p className='fontBold rounded-b p-2'>{noOfUsersTag[i]}</p>
										{i > 2 &&
											<p className={styles.closeIcon} onClick={() => handleRemoveForm(i)}>
												<div className='pl-2'>
													<AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#FF0000'} />
												</div>
												<span className='fontMedium'>حذف</span>
											</p>
										}
									</div>
								}
								{courseDetail.type == 'physical' &&
									<>
										<p className={`fontMedium text-xl ${styles.radioBtnHead}`}>المنطقة</p>
										<p className={`fontRegular ${styles.radioBtnDiscription}`}>بناءًا عليها بنوريك المواعيد المتوفرة</p>
										<div className={styles.genderWrapper}>
											{/***************************************** FOR loop for radio button to select region ****************************************/}
											{regionDataList?.map((region, j = index) => {
												return (
													<div className={styles.radioBtnBox} key={`region${j}`}>
														<input id={`region${i}`} type="radio" name={`region${i}`} value={region.id} title="region"
															className={`${styles.radioBtn}`}
															checked={(selectedRegion && i == 0 ? selectedRegion == region.id : student.region == region.id)}
															onChange={event => handleRegionChange(event, i, '')}
														/>
														<label htmlFor='dateForAll' className={` ${styles.lableName1}`}>{region.nameAr}</label>
													</div>
												)
											})}
										</div>
									</>
								}
								<p className={`fontBold mt-6 ${styles.radioBtnHead}`}>الجنس</p>
								{courseDetail.type == 'physical' && <p className={`fontRegular ${styles.radioBtnDiscription}`}>بناء عليها بنوريك المواعيد المتوفرة</p>}
								<div className={styles.genderWrapper}>
									{/***************************************** FOR loop for radio button to select Gender ****************************************/}
									{genders.map((gender, j = index) => {
										return (
											<div className={styles.radioBtnBox} key={`gender${j}`}>
												<input id={`gender${i}`} type="radio" name={`gender${i}`} value={gender.value} title="gender"
													className={`${styles.radioBtn} ${disabledGender == gender.value ? 'cursor-not-allowed' : 'cursor-pointer'}`}
													// className={`${styles.radioBtn}`}
													checked={(selectedGender && i == 0 ? selectedGender == gender.value : student.gender == gender.value)}
													onChange={event => handleFormChange(event, i, '')}
													disabled={disabledGender == gender.value}
												/>
												<label htmlFor='dateForAll' className={` ${styles.lableName1} ${disabledGender == gender.value ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}`}>{gender.label}</label>
												{/* <label htmlFor='dateForAll' className={` ${styles.lableName1}`}>{gender.label}</label> */}
											</div>
										)
									})}
								</div>
								<div style={{ color: 'red' }} className={styles.errorText}>{genderCheck}</div>
							</div>

							{student.gender && courseDetail.type != 'on-demand' &&
								<div className={`maxWidthDefault ${styles.radioBtnsContainer}`}>
									<p className={`fontBold ${styles.radioBtnHead}`}>اختار الموعد اللي يناسبك</p>
									<div style={{ color: 'red' }} className={styles.errorText}>{dateCheck}</div>
									<ScrollContainer className='flex'>
										<div className={styles.datesMainArea}>
											{/***************************************** FOR loop for radio button to select date ****************************************/}
											{(courseDetail.type == 'physical' ? ((studentsData[i].gender || selectedGender) == 'female' ? femaleDates : maleDates) : mixDates).length > 0 ?
												<>
													{(courseDetail.type == 'physical' ? ((studentsData[i].gender || selectedGender) == 'female' ? femaleDates : maleDates) : mixDates).map((date, k = index) => {
														return (
															<div key={`datecard${k}`}>
																{date.numberOfSeats !== 0 &&
																	<div className={`${styles.dateBox} ${date.numberOfSeats == 0 ? `${styles.disableDateBox}` : ''}`}>
																		<input type="radio" id={`date1_${k}_${i}`} name={`date${i}`} title="date" value={date.dateFrom}
																			className="hidden peer" onChange={event => handleFormChange(event, i, date.id)}
																			checked={(selectedDate && i == 0 ? selectedDate == date.id : student.availabilityId == date.id)}
																			disabled={date.numberOfSeats == 0}
																		/>
																		<label htmlFor={`date1_${k}_${i}`} className="cursor-pointer">
																			<div className={`relative ${styles.label} ${date.numberOfSeats == 0 ? `${styles.disableDateBoxHeader}` : ''}`}>
																				<div className={styles.dateRadioBtnBox}>
																					<div className={styles.circle}><div></div></div>
																					<p className={`fontMedium ${styles.dateBoxHeaderText}`}>
																						{(courseDetail.type == 'physical' && date.name) ? date.name : dateWithDay(date.dateFrom)}
																						{/* {date.name ? date.name : dateWithDay(date.dateFrom)} */}
																					</p>
																				</div>
																			</div>
																			<DatesInfo date={date} />
																		</label>
																	</div>
																}
															</div>
														)
													})}
												</>

												:
												<div>
													<UserDetailForm1 gender={studentsData[i].gender} />
												</div>
											}
										</div>
									</ScrollContainer>
									{i == 0 &&
										<div className='checkBoxDiv pt-4'>
											<input id='enrollForMe' type='checkbox' name='enrollForMySelf' onChange={(event) => handleEnrollForMe(event)} />
											<label htmlFor='enrollForMe' className={`fontMedium ${styles.checkboxText}`}>بسجل لنفسي</label>
										</div>
									}
									{(totalStudent > 1 && i == 0 && (courseDetail.type == 'physical' ? ((studentsData[i].gender || selectedGender) == 'female' ? femaleDates : maleDates) : mixDates).length > 0) &&
										<div className='checkBoxDiv pb-4'>
											<input id='dateForAll' type='checkbox' name='agree' onChange={(event) => handleDateForAll(event)} />
											<label htmlFor='dateForAll' className={`fontMedium ${styles.checkboxText}`}>اختيار نفس الموعد لجميع الأشخاص</label>
										</div>
									}
								</div>
							}
							{((courseDetail.type != 'on-demand' && student.date) || (courseDetail.type == 'on-demand' && student.gender)) &&
								<div className={`maxWidthDefault ${styles.radioBtnsContainer}`}>
									<p className={`fontBold ${styles.radioBtnHead}`}>البيانات الشخصية</p>
									<p className={`fontRegular ${styles.radioBtnDiscription}`}>فضلا اكتبها بدقة، عشان حنتواصل معك</p>
									<div className='formInputBox'>
										<input className='formInput' id="fullName" type="text" name={`name${i}`} title="fullName" placeholder=' '
											value={fullName}
											onChange={event => handleFormChange(event, i, '')}
										/>
										<label className='formLabel' htmlFor="fullName">الاسم الثلاثي</label>
									</div>
									<div style={{ color: 'red' }} className={styles.errorText}>{nameCheck} {nameLengthCheck} {validName}</div>
									<div className='formInputBox'>
										<input className='formInput' id="phoneNo" type="number" name={`phoneNo${i}`} title="phoneNumber" placeholder=' '
											value={phoneNumber}
											onChange={event => handleFormChange(event, i, '')}
										/>
										<label className='formLabel' htmlFor="phoneNo">رقم الجوال</label>
									</div>
									{(!phoneNoCheck && !phoneNoLengthCheck && !validPhoneNumber) &&
										<p className={styles.hintText}>ادخل الرقم بصيغة 05xxxxxxxx </p>
									}
									<div style={{ color: 'red' }} className={styles.errorText}>{phoneNoCheck} {phoneNoLengthCheck} {validPhoneNumber}</div>
									<div className='formInputBox'>
										<input className='formInput' id="email" type="email" name={`email${i}`} title="email" placeholder=' '
											value={email}
											onChange={event => handleFormChange(event, i, '')}
										/>
										<label className='formLabel' htmlFor="email">الإيميل</label>
									</div>
									<div style={{ color: 'red' }} className={styles.errorText}>{emailCheck}{emailValidCheck}</div>
								</div>
							}
						</div>
					)
				})}
				<div className='border-t border-inherit  pr-3'>
					<div className={`maxWidthDefault pr-4 ${styles.radioBtnsContainer}`}>
						{(studentsData.length > 2 && studentsData.length <= 9) &&
							<div>
								<p className={`fontBold ${styles.addMoreFormText}`} onClick={() => handleAddForm(isDateForAllSelected)} >+ إضافة شخص آخر</p>
							</div>
						}
						<div className='checkBoxDiv pb-4'>
							<input id='termsCheckBox' type='checkbox' name='agree' onChange={(event) => setUserAgree(event.target.checked)} />
							<label htmlFor='termsCheckBox' className={`fontMedium ${styles.checkboxText}`}>أقر بموافقتي على <Link href={'/terms'} className='link' >الشروط والأحكام</Link></label>
						</div>
						{props.userAgreeError == false && <div style={{ color: 'red' }} className={`${styles.errorText} pb-4`}>فضلًا وافق على الشروط والأحكام</div>}
						<div className={` pt-2 ${styles.btnBox}`}>
							<button className='primarySolidBtn' onClick={() => handleSubmit(studentsData, courseDetail.type)}>مراجعة الطلب والدفع</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}