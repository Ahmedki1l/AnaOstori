import React, { useEffect, useState } from 'react'
import styles from './UserInfoForm.module.scss'
import FirstPaymentPageInfo from '../PaymentPageIndicator/FirstPageIndicator';
import DatesInfo from './DatesBox/DatesInfo'
import ScrollContainer from 'react-indiana-drag-scroll'
import Link from 'next/link';
import { useRouter } from 'next/router';
import UserDetailForm1 from '../../CourseDescriptionPageComponents/UserDetailForm1';
import useWindowSize from '../../../hooks/useWindoSize';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { useSelector } from 'react-redux';
import { dateWithDay } from '../../../constants/DateConverter';
import { getRouteAPI } from '../../../services/apisService';
import * as PaymentConst from '../../../constants/PaymentConst';
// import TabbyPomoForm from '../PaymentInfoForm/TabbyPromo';

export default function UserInfoForm(props) {
	console.log("🚀 ~ UserInfoForm ~ props:", props);
	const studentsDataLength = props.studentsData?.length
	const noOfUsersTag = PaymentConst.noOfUsersTag
	const courseDetail = props.courseDetails

	const router = useRouter();
	const [selectedGender, setSelectedGender] = useState(router.query.gender ? (router.query.gender == 'mix' ? 'male' : router.query.gender) : 'male')
	const [selectedDate, setSelectedDate] = useState(router.query.date ? router.query.date : "")
	const [selectedRegionId, setSelectedRegionId] = useState(router.query.region ? router.query.region : "");

	const initialMaleDate = props.maleDates.length > 0 && props.maleDates.every(obj => obj.numberOfSeats === 0) ? [] : props.maleDates;
	console.log("🚀 ~ UserInfoForm ~ initialMaleDate:", initialMaleDate)
	const initialFemaleDate = props.femaleDates.length > 0 && props.femaleDates.every(obj => obj.numberOfSeats === 0) ? [] : props.femaleDates;
	console.log("🚀 ~ UserInfoForm ~ initialFemaleDate:", initialFemaleDate)

	let choosenQueryMaleDates = [];
	let choosenQueryFemaleDates = [];

	if (selectedDate && selectedGender && selectedRegionId) {
		choosenQueryMaleDates = initialMaleDate.filter((date) => date.regionId == selectedRegionId);
		choosenQueryFemaleDates = initialFemaleDate.filter((date) => date.regionId == selectedRegionId);
	}

	const [maleDates, setMaleDates] = useState([...choosenQueryMaleDates]);
	const [femaleDates, setFemaleDates] = useState([...choosenQueryFemaleDates]);



	const mixDates = props.mixDates.length > 0 && props.mixDates.every(obj => obj.numberOfSeats === 0) ? [] : props.mixDates;
	console.log("🚀 ~ UserInfoForm ~ mixDates:", mixDates)

	// Filter genders based on available dates
	const genders = PaymentConst.genders;



	const storeData = useSelector((state) => state?.globalStore);
	const userPredefineEmail = storeData?.viewProfileData?.email
	const userPredefinePhone = storeData?.viewProfileData?.phone?.replace("966", "0")
	const userPredefinefullName = (storeData?.viewProfileData?.fullName) ? storeData?.viewProfileData?.fullName : storeData?.viewProfileData?.firstName
	const userPredefineGender = storeData?.viewProfileData?.gender
	const [isDateForAllSelected, setIsDateForAllSelected] = useState(false)
	const [regionDataList, setRegionDataList] = useState()
	const groupDiscountEligible = courseDetail.groupDiscountEligible
	const smallScreen = useWindowSize().smallScreen

	const [disabledGender, setDisabledGender] = useState(null)


	// const [disabledRegion, setDisabledRegion] = useState()
	const [disabledRegions, setDisabledRegions] = useState([]);
	const userTemplet = {
		gender: null,
		date: null,
		fullName: null,
		phoneNumber: null,
		email: null,
		availabilityId: null
	}
	const preselectedUserTempletFOrOnDemand = {
		gender: courseDetail.type == 'on-demand' && userPredefineGender ? userPredefineGender : null,
		date: null,
		fullName: courseDetail.type == 'on-demand' && userPredefinefullName ? userPredefinefullName : null,
		phoneNumber: courseDetail.type == 'on-demand' && userPredefinePhone ? userPredefinePhone : null,
		email: courseDetail.type == 'on-demand' && userPredefineEmail ? userPredefineEmail : null,
		availabilityId: null
	}

	const noOfUsersLabelData = [
		{ iconName: 'studentOneIcon', iconWidth: smallScreen ? '13' : '20', label1: 'شخص واحد ', subLabel1: '', label2: `${courseDetail.discount} ر.س`, subLabel2: '', oldPrice: `${courseDetail.price} ر.س`, singleDiscount: `${courseDetail.discount != null ? `خصم ${(100 - ((courseDetail.discount / courseDetail.price) * 100)).toFixed(2)} % ` : ''}` },
		{ iconName: 'studentTwoIcon', iconWidth: smallScreen ? '20' : '32', label1: 'شخصين', subLabel1: `${courseDetail.discountForTwo} ر.س على كل شخص`, label2: `${(courseDetail.discountForTwo) * 2} ر.س`, subLabel2: `وفر ${((courseDetail.price * 2) - (courseDetail.discountForTwo * 2))} ر.س`, oldPrice: '', singleDiscount: '' },
		{ iconName: 'studentThreeIcon', iconWidth: smallScreen ? '22' : '40', label1: '3 اشخاص او اكثر', subLabel1: `${courseDetail.discountForThreeOrMore} ر.س على كل شخص`, label2: 'حسب العدد', oldPrice: '', singleDiscount: '' },
	]


	const preSelectTemplet = { gender: selectedGender, date: selectedDate, fullName: null, phoneNumber: null, email: null, availabilityId: router.query.date }
	const [totalStudent, setTotalStudent] = useState((studentsDataLength) ? (((studentsDataLength > 2) ? 3 : studentsDataLength)) : 1)
	const [userAgree, setUserAgree] = useState(false)
	const [enrollForMe, setEnrollForMe] = useState(false)
	const [studentsData, setStudentsData] = useState(
		(courseDetail.type == 'on-demand') ? [preselectedUserTempletFOrOnDemand]
			: studentsDataLength ? (props.studentsData)
				: (router.query ? [preSelectTemplet]
					: [userTemplet]))


	useEffect(() => {
		getRegionAndBranchList();
	}, []);


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
				{ gender: studentsData[0]['gender'], date: studentsData[0]['date'], fullName: null, phoneNumber: null, email: null, availabilityId: studentsData[0]['availabilityId'] }
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
		// setSelectedGender()
		setSelectedDate()
		if (event.target.title == 'date') {
			data[index]['availabilityId'] = availabilityId
		}
		if (event.target.title == 'gender') {
			setSelectedGender(event.target.value)
			data[index]['date'] = null
			data[index]['availabilityId'] = null
			setMaleDates(initialMaleDate.filter((date) => date.regionId == selectedRegionId))
			setFemaleDates(initialFemaleDate.filter((date) => date.regionId == selectedRegionId))
		}
		if (totalStudent > 1 && (event.target.title == 'date' || event.target.title == 'gender')) {
			for (let i = 0; i < data.length; i++) {
				if (data[i]['gender'] !== null && data[0]['gender'] != data[i]['gender']) {
					document.getElementById("dateForAll").checked = false;
					break
				}
				else if (data[i]['availabilityId'] !== null && data[0]['availabilityId'] != data[i]['availabilityId']) {
					document.getElementById("dateForAll").checked = false;
					break
				}
			}
		}
		setStudentsData(data);
		console.log(studentsData);
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
					data[i]['availabilityId'] = null
					data[i]['date'] = null
					data[i]['gender'] = null
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
			data[0]['email'] = null
			data[0]['fullName'] = null
			data[0]['phoneNumber'] = null
		}
		setStudentsData(data);
	}
	const handleSubmit = (studentsData, courseDetailType) => {
		props.isInfoFill(studentsData, courseDetailType, userAgree)
	}

	const getRegionAndBranchList = async () => {
		console.log("selected initial region: ", selectedRegionId);
		let body = {
			routeName: 'listRegion',
		}
		await getRouteAPI(body).then((res) => {
			setRegionDataList(res.data)

			const currentRegion = selectedRegionId ? selectedRegionId : res.data[0].id;

			// if (!router.query.region) {
			// 	setSelectedRegionId(res.data[0].id)
			// }

			setSelectedRegionId(currentRegion);

			if (initialMaleDate.length > 0 || initialFemaleDate.length > 0 || mixDates.length > 0) {
				let data = [...studentsData]
				data[0]['region'] = currentRegion;
				setStudentsData(data);
				const regionDateListMale = initialMaleDate.filter((date) => date.regionId == currentRegion);
				const regionDateListFemale = initialFemaleDate.filter((date) => date.regionId == currentRegion);
				const regionDateListMix = mixDates.filter((date) => date.regionId == currentRegion);

				let disabledGenders = [];

				if (regionDateListMale.length === 0) {
					disabledGenders.push('male');
				}
				if (regionDateListFemale.length === 0) {
					disabledGenders.push('female');
				}
				if (regionDateListMix.length === 0) {
					disabledGenders.push('mix');
				}

				if (disabledGenders.length === 0) {
					setDisabledGender(null);
				} else {
					setDisabledGender(disabledGenders);
					// Set default gender to first available option
					const availableGenders = ['male', 'female', 'mix'].filter(g => !disabledGenders.includes(g));
					if (availableGenders.length > 0) {
						setSelectedGender(availableGenders[0]);
						data[0]['gender'] = availableGenders[0];
					}
				}

				setMaleDates(regionDateListMale.length === 0 ? [] : regionDateListMale);
				setFemaleDates(regionDateListFemale.length === 0 ? [] : regionDateListFemale);
			} else {
				let data = [...studentsData]
				data[0]['region'] = currentRegion;
				setStudentsData(data);
				const regionDateListMale = initialMaleDate.filter((date) => date.regionId == currentRegion);
				const regionDateListFemale = initialFemaleDate.filter((date) => date.regionId == currentRegion);
				const regionDateListMix = mixDates.filter((date) => date.regionId == currentRegion);

				let disabledGenders = [];
				if (regionDateListMale.length === 0) {
					disabledGenders.push('male');
				}
				if (regionDateListFemale.length === 0) {
					disabledGenders.push('female');
				}
				if (regionDateListMix.length === 0) {
					disabledGenders.push('mix');
				}

				setDisabledGender(disabledGenders);
			}
			console.log("getRegionAndBranchList Region ID: ", currentRegion);

			const availableRegionSet = new Set(initialMaleDate.concat(initialFemaleDate).map((dates) => {
				return dates.regionId;
			}));
			const availableRegion = Array.from(availableRegionSet)
			const disabledRegionsArray = res.data.filter((region) => !availableRegion.includes(region.id));

			setDisabledRegions(disabledRegionsArray.map(region => region.id));

		}).catch((err) => {
			console.log(err)
		})
	}

	const handleRegionChange = (event, index) => {
		const selectedRegionId = event.target.value
		console.log("selected region: ", selectedRegionId);
		setSelectedRegionId(selectedRegionId)
		let data = [...studentsData]
		data[index]['region'] = selectedRegionId
		setStudentsData(data);
		const regionDateListMale = initialMaleDate.filter((date) => date.regionId == selectedRegionId);
		const regionDateListFemale = initialFemaleDate.filter((date) => date.regionId == selectedRegionId);
		if (regionDateListMale.length > 0) {
			setDisabledGender(null)
			setMaleDates(regionDateListMale)
		} else if (regionDateListMale.length == 0) {
			setSelectedGender('female')
			data[index]['gender'] = 'female'
			setDisabledGender('male')
		}
		if (regionDateListFemale.length > 0) {
			setDisabledGender(null)
			setFemaleDates(regionDateListFemale)
		} else if (regionDateListFemale.length == 0) {
			setSelectedGender('male')
			data[index]['gender'] = 'male'
			setDisabledGender('female')
		}
		if (regionDateListMale.length == 0) {
			setMaleDates([])
		} else {
			setMaleDates(regionDateListMale)
		}
		if (regionDateListFemale.length == 0) {
			setFemaleDates([])
		} else {
			setFemaleDates(regionDateListFemale)
		}
	}

	// States for filtered dates (by city & district)
	const [filteredMaleDates, setFilteredMaleDates] = useState([]);
	const [filteredFemaleDates, setFilteredFemaleDates] = useState([]);
	const [filteredMixDates, setFilteredMixDates] = useState([]);

	// STATES for city and district selection
	const [cities, setCities] = useState([]);
	const [districtsMapping, setDistrictsMapping] = useState({});
	const [selectedCity, setSelectedCity] = useState("");
	const [selectedDistrict, setSelectedDistrict] = useState("");

	// Helper: Extract unique city–district objects from all dates
	const getUniqueDistrictsWithCity = () => {
		// Combine the dates from all sources
		const allDates = [...initialMaleDate, ...initialFemaleDate, ...mixDates];
		const uniqueSet = new Set();
		const uniqueLocations = [];

		allDates.forEach(date => {
			const location = date.locationName; // e.g., "الرياض - طويق"
			if (location) {
				const parts = location.split(' - ');
				if (parts.length >= 2) {
					// Reverse the parts so that:
					// districtRaw = parts[0] and cityRaw = parts[1]
					const [districtRaw, cityRaw] = parts.reverse();
					// Remove "حي " prefix from district if present
					let processedDistrict = districtRaw.replace(/^حي\s*/, '');
					const key = `${cityRaw}-${processedDistrict}`;
					if (!uniqueSet.has(key)) {
						uniqueSet.add(key);
						uniqueLocations.push({ city: cityRaw, district: processedDistrict });
					}
				}
			}
		});
		return uniqueLocations;
	};

	// Custom order for cities
	const customCityOrder = ["الرياض", "الدمام", "جدة"];

	// New getDistrictsByCity using the unique district objects
	const getDistrictsByCity = () => {
		const uniqueLocations = getUniqueDistrictsWithCity();
		// Group by city: key is city, value is an array of unique districts
		const districtsByCity = uniqueLocations.reduce((acc, { city, district }) => {
			if (!acc[city]) {
				acc[city] = [];
			}
			acc[city].push(district);
			return acc;
		}, {});

		// Create a new mapping with cities in the specified order
		const sortedMapping = {};
		customCityOrder.forEach((city) => {
			if (districtsByCity[city]) {
				sortedMapping[city] = districtsByCity[city];
			}
		});

		// Optionally, append any cities not in the custom order (e.g., in alphabetical order)
		Object.keys(districtsByCity).forEach((city) => {
			if (!customCityOrder.includes(city)) {
				sortedMapping[city] = districtsByCity[city];
			}
		});

		return sortedMapping;
	};

	// When the dates change, compute the mapping and initialize city/district selection.
	useEffect(() => {
		const mapping = getDistrictsByCity();
		setDistrictsMapping(mapping);
		const initialCities = Object.keys(mapping);
		setCities(initialCities);

		// Select "الرياض" by default if available; otherwise, choose the first city.
		const defaultCity = initialCities.includes("الرياض")
			? "الرياض"
			: initialCities[0] || "";
		setSelectedCity(defaultCity);
		if (mapping[defaultCity] && mapping[defaultCity].length > 0) {
			setSelectedDistrict(mapping[defaultCity][0]);
		} else {
			setSelectedDistrict("");
		}
	}, [initialMaleDate, initialFemaleDate, mixDates]);

	// Filter the dates based on the selected city and district.
	useEffect(() => {
		filterDates(selectedCity, selectedDistrict);
	}, [selectedCity, selectedDistrict]);

	const filterDates = (city, district) => {
		// Use both city and district to filter the locationName.
		const newMaleDates = initialMaleDate.filter(date =>
			date.locationName.includes(city) && date.locationName.includes(district)
		);
		setFilteredMaleDates(newMaleDates);

		const newFemaleDates = initialFemaleDate.filter(date =>
			date.locationName.includes(city) && date.locationName.includes(district)
		);
		setFilteredFemaleDates(newFemaleDates);

		const newMixDates = mixDates.filter(date =>
			date.locationName.includes(city) && date.locationName.includes(district)
		);
		setFilteredMixDates(newMixDates);
		// Check for disabled genders based on filtered dates
		let disabledGenders = [];

		if (newMaleDates.length === 0) {
			disabledGenders.push('male');
		}
		if (newFemaleDates.length === 0) {
			disabledGenders.push('female');
		}
		if (newMixDates.length === 0) {
			disabledGenders.push('mix');
		}

		// Update disabled gender state
		if (disabledGenders.length === 0) {
			setDisabledGender(null);
		} else {
			setDisabledGender(disabledGenders);
			// Set default gender to first available option if current is disabled
			const availableGenders = ['male', 'female', 'mix'].filter(g => !disabledGenders.includes(g));
			if (availableGenders.length > 0 && disabledGenders.includes(selectedGender)) {
				setSelectedGender(availableGenders[0]);
				let data = [...studentsData];
				data[0]['gender'] = availableGenders[0];
				setStudentsData(data);
			}
		}
	};


	return (
		<>
			<FirstPaymentPageInfo />
			<div className='pb-4'>
				{groupDiscountEligible && courseDetail.type != 'on-demand' &&
					<div className={styles.borderBottom}>
						<div className={`maxWidthDefault  ${styles.radioBtnsContainer}`}>
							<p className={`fontMedium  ${styles.radioBtnHead}`}>كم شخص؟</p>
							<div className={styles.noOfUserWrapper}>
								{/***************************************** FOR loop for radio button to select number of Users ******************************************/}
								{noOfUsersLabelData.map((data, index) => {
									return (
										<div
											key={`noOfUsersRadoi${index}`}
											className={styles.userPriceWrapper}
										>
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
											{/* The promo widget is rendered below the radio content without affecting the parent's width */}
											{/* <div style={{ position: 'absolute', width: '100%', top: '100%' }}>
												<TabbyPomoForm amount={parseFloat(data.label2)} />
											</div> */}
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
								{(courseDetail.type == 'physical' && regionDataList?.length > 0) &&
									<>
										<p className={`fontMedium text-xl ${styles.radioBtnHead}`}>المدينة</p>
										<p className={`fontRegular ${styles.radioBtnDiscription}`}>بناءًا عليها بنوريك المواعيد المتوفرة</p>
										<div className={styles.genderWrapper}>
											{/* **************************************** FOR loop for radio button to select region ***************************************
											{regionDataList?.map((region, j = index) => {
												const isDisabled = disabledRegions.includes(region.id);
												return (
													<div className={styles.radioBtnBox} key={`region${j}`}>
														<input
															id={`region${i}`}
															type="radio"
															name={`region${i}`}
															value={region.id}
															title="region"
															className={`${styles.radioBtn} ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
															checked={(selectedRegionId && i == 0 ? selectedRegionId == region.id : student.region == region.id)}
															onChange={event => handleRegionChange(event, i)}
															disabled={isDisabled}
														/>
														<label htmlFor={`region${i}`} className={` ${styles.lableName1} ${isDisabled ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}`}>{region.nameAr === "الشرقية" ? "الدمام" : region.nameAr}</label>
													</div>
												);
											})} */}
											{/* --- City and District Selection --- */}
											<div className="mb-6">
												<h2 className="text-right mb-2 text-gray-600">الفرع</h2>
												<p className="text-right text-sm mb-2">بناءً عليه يوريك المواعيد المتوفرة</p>
												{/* City Selection */}
												<div className="flex justify-start gap-2">
													{cities.map(city => (
														<button
															key={city}
															className={`px-4 py-2 border border-black ${selectedCity === city
																? 'bg-[#F26722] text-white'
																: 'bg-white text-black'
																} rounded-lg hover:opacity-90 transition-opacity shadow-md`}
															onClick={() => {
																setSelectedCity(city);
																// Automatically select the first district for the city.
																setSelectedDistrict(districtsMapping[city][0]);
															}}
														>
															{city}
														</button>
													))}
												</div>

												{/* District Selection */}
												{districtsMapping[selectedCity] && (
													<div className="mt-4">
														<h2 className="text-right mb-4 text-gray-600">الحي</h2>
														<div className="flex justify-start gap-2">
															{districtsMapping[selectedCity].map(district => (
																<button
																	key={district}
																	className={`px-4 py-2 border border-black ${selectedDistrict === district
																		? 'bg-[#F26722] text-white'
																		: 'bg-white text-black'
																		} rounded-lg hover:opacity-90 transition-opacity shadow-md`}
																	onClick={() => setSelectedDistrict(district)}
																>
																	{district}
																</button>
															))}
														</div>
													</div>
												)}
											</div>
										</div>
									</>
								}
								<p className={`fontBold ${styles.radioBtnHead}`}>الجنس</p>
								{/* {courseDetail.type == 'physical' && <p className={`fontRegular ${styles.radioBtnDiscription}`}>بناء عليها بنوريك المواعيد المتوفرة</p>} */}
								<div className={styles.genderWrapper}>
									{/***************************************** FOR loop for radio button to select Gender ****************************************/}
									{genders.map((gender, j = index) => {
										return (
											<div className={styles.radioBtnBox} key={`gender${j}`}>
												<input id={`gender${i}`} type="radio" name={`gender${i}`} value={gender.value} title="gender"
													className={`${styles.radioBtn} ${disabledGender?.includes(gender.value) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
													checked={(selectedGender && i == 0 ? selectedGender == gender.value : student.gender == gender.value)}
													onChange={event => handleFormChange(event, i, null)}
													disabled={disabledGender?.includes(gender.value)}
												/>
												<label htmlFor='dateForAll' className={` ${styles.lableName1} ${disabledGender?.includes(gender.value) ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}`}>{gender.label}</label>
											</div>
										)
									})}
								</div>
								<div style={{ color: 'red' }} className={styles.errorText}>{genderCheck}</div>
							</div>

							{(studentsData[i].gender !== null && courseDetail.type != 'on-demand') &&
								<div className={`maxWidthDefault ${styles.radioBtnsContainer}`}>
									<p className={`fontBold ${styles.radioBtnHead}`}>اختار الموعد اللي يناسبك</p>
									<div style={{ color: 'red' }} className={styles.errorText}>{dateCheck}</div>
									<ScrollContainer className='flex'>
										<div className={styles.datesMainArea}>
											{((courseDetail.type === 'physical' && studentsData[i].gender !== null)
												? (studentsData[i].gender === 'female' ? filteredFemaleDates : studentsData[i].gender === 'mix' ? filteredMixDates : filteredMaleDates)
												: mixDates
											).length > 0 ? (
												<>
													{((courseDetail.type === 'physical' && studentsData[i].gender !== null)
														? (studentsData[i].gender === 'female' ? filteredFemaleDates : studentsData[i].gender === 'mix' ? filteredMixDates : filteredMaleDates)
														: mixDates
													).map((date, k) => (
														<div key={`datecard${k}`}>
															{date.numberOfSeats !== 0 && (
																<div>
																	<input
																		type="radio"
																		id={`date1_${k}_${i}`}
																		name={`date${i}`}
																		title="date"
																		value={date.dateFrom}
																		className="hidden peer"
																		onChange={event => handleFormChange(event, i, date.id)}
																		checked={
																			(selectedDate && i === 0
																				? selectedDate === date.id
																				: student.availabilityId === date.id)
																		}
																		disabled={date.numberOfSeats === 0}
																	/>
																	<label
																		htmlFor={`date1_${k}_${i}`}
																		className={`${styles.dateBox} cursor-pointer ${date.numberOfSeats === 0 ? styles.disableDateBox : ''
																			}`}
																	>
																		<div className={`relative ${styles.label}`}>
																			<div className={styles.dateRadioBtnBox}>
																				<div className={styles.circle}>
																					<div></div>
																				</div>
																				<p className={`fontMedium ${styles.dateBoxHeaderText}`}>
																					{courseDetail.type === 'physical' && date.name
																						? date.name
																						: dateWithDay(date.dateFrom)}
																				</p>
																			</div>
																		</div>
																		<DatesInfo date={date} />
																	</label>
																</div>
															)}
														</div>
													))}
												</>
											) : (
												selectedGender && selectedRegionId && (
													<div>
														<UserDetailForm1 gender={studentsData[i].gender} />
													</div>
												)
											)}
										</div>
									</ScrollContainer>
									{/*i == 0 &&
										<div className='checkBoxDiv pt-4'>
											<input id='enrollForMe' type='checkbox' name='enrollForMySelf' onChange={(event) => handleEnrollForMe(event)} />
											<label htmlFor='enrollForMe' className={`fontMedium ${styles.checkboxText}`}>بسجل لنفسي</label>
										</div>
									*/}
									{(totalStudent > 1 && i == 0 && (courseDetail.type == 'physical' ? ((studentsData[i].gender || selectedGender) == 'female' ? femaleDates : (studentsData[i].gender || selectedGender) == 'mix' ? mixDates : maleDates) : mixDates).length > 0) &&
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
											onChange={event => handleFormChange(event, i, null)}
										/>
										<label className='formLabel' htmlFor="fullName">الاسم الثلاثي</label>
									</div>
									<div style={{ color: 'red' }} className={styles.errorText}>{nameCheck} {nameLengthCheck} {validName}</div>
									<div className='formInputBox'>
										<input className='formInput' id="phoneNo" type="number" name={`phoneNo${i}`} title="phoneNumber" placeholder=' '
											value={phoneNumber}
											onChange={event => handleFormChange(event, i, null)}
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
											onChange={event => handleFormChange(event, i, null)}
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