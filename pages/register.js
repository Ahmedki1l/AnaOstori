import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from '../styles/Login.module.scss'
import { signupWithEmailAndPassword, signInWithApple, GoogleLogin, startEmailPasswordLogin } from '../services/fireBaseAuthService'
import { useRouter } from 'next/router'
import { getAuthRouteAPI, getRouteAPI, postAuthRouteAPI } from '../services/apisService'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux'
import AllIconsComponenet from '../Icons/AllIconsComponenet'
import Spinner from '../components/CommonComponents/spinner'
import { inputErrorMessages, toastErrorMessage } from '../constants/ar'
import ModelForUpdateProfile from '../components/ModalForUpdateProfile/ModalForUpdateProfile'
import * as fbq from '../lib/fpixel'


const educationalLevelList = [
	{ value: 'first_secondary_school', label: 'أول ثانوي' },
	{ value: 'second_secondary_school', label: 'ثاني ثانوي' },
	{ value: 'third_secondary_school', label: 'ثالث ثانوي' },
	{ value: 'other', label: 'أخرى' }
];

export default function Register() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
	// const [parentsContct, setParentPhoneNumber] = useState("");
	const [fullName, setFullName] = useState("")
	const [gender, setGender] = useState("")
	const [initPasswordError, setInitPasswordError] = useState({
		minLength: true,
		capitalLetter: true,
		number: true,
		specialCharacter: true,
	});
	const [fullNameError, setFullNameError] = useState(null);
	const [phoneNumberError, setPhoneNumberError] = useState(null);
	// const [parentPhoneNumberError, setParentPhoneNumberError] = useState(null);
	const [emailError, setEmailError] = useState(null);
	const [isGenderError, setIsGenderError] = useState(null);
	const [passwordError, setPasswordError] = useState(null);
	const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false)
	const [loading, setLoading] = useState(false)
	const router = useRouter();
	const dispatch = useDispatch();
	const storeData = useSelector((state) => state?.globalStore);
	const [updateProfileModalOpen, setUpdateProfileModalOpen] = useState(false);

	// const [citiesList, setCitiesList] = useState('')
	// const [isOpenForCity, setIsOpenForCity] = useState(false);
	// const [isOpenForEducationLevel, setIsOpenForEducationLevel] = useState(false);
	// const [selectedCity, setSelectedCity] = useState('');
	// const [selectedEducationLevel, setSelectedEducationLevel] = useState('');
	// const dropdownRef = useRef(null);
	// const [otherEducationLevel, setOtherEducationLevel] = useState(false);
	// const [otherEducation, setOtherEducation] = useState('');

	// useEffect(() => {
	// 	getCityList()
	// }, [])

	// const getCityList = async () => {
	// 	await getRouteAPI({ routeName: 'listCity' }).then((res) => {
	// 		const formattedData = res?.data?.sort((a, b) => parseInt(a.code) - parseInt(b.code)).map(item => ({
	// 			value: item.nameAr,
	// 			label: item.nameAr,
	// 			key: item.id,
	// 			cityCode: item.code
	// 		}));
	// 		formattedData?.push({ value: 'other', label: 'أخرى', value: 'other' });
	// 		setCitiesList(formattedData);
	// 	}).catch((error) => {
	// 		console.log(error);
	// 	});
	// }

	const handleStoreUpdate = async (isUserNew) => {
		if (isUserNew) {
			router.push('/updateProfile')
			toast.success(toastErrorMessage.successRegisterMsg, { rtl: true, })
		} else {
			try {
				const viewProfileReq = getAuthRouteAPI({ routeName: "viewProfile" })
				const getMyCourseReq = getAuthRouteAPI({ routeName: 'myCourses' })

				const [viewProfileData, myCourseData] = await Promise.all([
					viewProfileReq, getMyCourseReq
				])
				dispatch({
					type: 'SET_ALL_MYCOURSE',
					myCourses: myCourseData?.data,
				});
				dispatch({
					type: 'SET_PROFILE_DATA',
					viewProfileData: viewProfileData?.data,
				});
				dispatch({
					type: 'IS_USER_INSTRUCTOR',
					isUserInstructor: viewProfileData?.data?.role === 'instructor' ? true : false,
				});

				if (viewProfileData?.data.gender == null) {
					router.push('/updateProfile')
				}
				const createdAt = new Date(viewProfileData?.data?.createdAt);
				const currentDate = new Date();
				const timeDifference = Math.abs(currentDate - createdAt);
				const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
				const reminderPopUpCount = viewProfileData?.data?.reminderPopUpAttempt;

				if (((dayDifference >= 7) && (reminderPopUpCount === null || reminderPopUpCount < 3))) {
					setUpdateProfileModalOpen(true);
				} else {
					if (!storeData?.returnUrl) {
						router.push('/')
						// toast.success(toastSuccessMessage.successLoginMsg, { rtl: true, })
					} else {
						if(storeData?.returnUrl === "/login"){
							router.push('/');
						}
						else {
							if(JSON.parse(localStorage.getItem('isFromUserForm')) === "true"){
								localStorage.setItem('isBackToUserForm', "true");
							}
							router.push(storeData?.returnUrl);
						}
					}
				}
				// if (!storeData?.returnUrl) {
				// 	router.push('/')
				// 	toast.success(toastErrorMessage.successLoginMsg, { rtl: true })
				// }
				// else {
				// 	router.push(storeData?.returnUrl)
				// }
			}
			catch (error) {
				console.log(error);
			}
		}
	}

	const hendelGoogleLogin = async () => {
		setLoading(true)
		await GoogleLogin().then(async (result) => {
			const isUserNew = result._tokenResponse.isNewUser
			const user = result?.user;
			localStorage.setItem("accessToken", user?.accessToken);
			dispatch({
				type: 'ADD_AUTH_TOKEN',
				accessToken: user?.accessToken,
			});
			dispatch({
				type: 'IS_USER_FROM_GOOGLE',
				loginWithoutPassword: true,
			});
			handleStoreUpdate(isUserNew)
		}).catch((error) => {
			console.log(error);
		});
	}

	const handleAppleLogin = async () => {
		setLoading(true)
		await signInWithApple().then((result) => {
			const user = result?.user;
			const isUserNew = result._tokenResponse.isNewUser
			localStorage.setItem("accessToken", user?.accessToken);
			dispatch({
				type: 'ADD_AUTH_TOKEN',
				accessToken: user?.accessToken,
			});
			dispatch({
				type: 'LOGIN_WITHOUT_PASSWORD',
				loginWithoutPassword: true,
			});
			handleStoreUpdate(isUserNew)
		}).catch((error) => {
			console.log(error);
			if (error.code == 'auth/popup-closed-by-user') {
				setLoading(false)
			}
		});
	}

	const regexEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

	const regexPhone = useMemo(() => /^(\+?\d{1,3}[- ]?)?\d{10}$/, []);

	useEffect(() => {
		if (fullName && (fullName.split(" ").length - 1) < 2) {
			setFullNameError(inputErrorMessages.nameThreeFoldErrorMsg);
		} else {
			setFullNameError(null)
		}
		if (email && !(regexEmail.test(email))) {
			setEmailError(inputErrorMessages.enterEmailCorrectInputErrorMsg)
		} else {
			setEmailError(null)
		}
		if (phoneNumber && !(phoneNumber.startsWith("05"))) {
			setPhoneNumberError(inputErrorMessages.mobileNumberFormatErrorMsg)
		} else if (phoneNumber && phoneNumber.length < 10) {
			setPhoneNumberError(inputErrorMessages.phoneNumberLengthMsg)
		} else {
			setPhoneNumberError(null);
		}
		// if (parentsContct && !(parentsContct.startsWith("05"))) {
		// 	setParentPhoneNumberError(inputErrorMessages.mobileNumberFormatErrorMsg)
		// } else if (parentsContct && parentsContct.length < 10) {
		// 	setParentPhoneNumberError(inputErrorMessages.phoneNumberLengthMsg)
		// } else {
		// 	setParentPhoneNumberError(null);
		// }
		if (gender) {
			setIsGenderError(null)
		}
		if (!password) {
			setPasswordError(null)
		}

	}, [fullName, email, phoneNumber, password, gender, regexEmail, regexPhone])

	const handleSignup = async (e) => {
		e.preventDefault()
		if (!fullName) {
			setFullNameError(inputErrorMessages.fullNameErrorMsgForRegister);
		} else if (fullName && (fullName.split(" ").length - 1) < 2) {
			setFullNameError(inputErrorMessages.nameThreeFoldErrorMsg);
		} else {
			setFullNameError(null)
		}
		if (!gender) {
			setIsGenderError(inputErrorMessages.genderErrorMsg);
		} else {
			setIsGenderError(null)
		}
		if (!email) {
			setEmailError(inputErrorMessages.noEmailErrorMsg)
		} else {
			setEmailError(null)
		}
		if (!password) {
			setPasswordError(inputErrorMessages.noPasswordMsg)
		} else if (password && (password.length < 6)) {
			setPasswordError(inputErrorMessages.passwordFormateMsg)
		} else {
			setPasswordError(null)
		}
		if (!fullName || (fullName && (fullName.split(" ").length - 1) < 2) || !gender || !email || !password || (password.length < 6)) {
			return
		} else {
			await signupWithEmailAndPassword(email, password).then(async (result) => {
				setLoading(true)
				const data = {
					fullName: fullName,
					phone: phoneNumber.replace(/[0-9]/, "+966"),
					gender: gender
				}
				if (!gender?.length) {
					delete data?.gender
				}
				// if (selectedCity) {
				// 	data.city = selectedCity
				// }
				// if (selectedEducationLevel && !otherEducationLevel) {
				// 	data.educationLevel = selectedEducationLevel
				// } else if (otherEducationLevel) {
				// 	data.educationLevel = otherEducation
				// }
				// if (parentsContct) {
				// 	data.parentsContact = parentsContct.replace(/[0-9]/, "+966")
				// }
				// if (parentsContct && educationalLevelList && selectedCity) {
				// 	data.reminderPopUpAttempt = 3
				// }
				const params = {
					routeName: 'updateProfileHandler',
					...data,
				}
				await postAuthRouteAPI(params).then(async (res) => {
					await startEmailPasswordLogin(email, password).then(async (result) => {
						const user = result.user;
						localStorage.setItem("accessToken", user?.accessToken);
						dispatch({
							type: 'ADD_AUTH_TOKEN',
							accessToken: user?.accessToken,
						});
						dispatch({
							type: 'IS_USER_FROM_GOOGLE',
							loginWithoutPassword: false,
						});
						await handleStoreUpdate(false)
						// router.push('/')
					}).catch((error) => {
						setLoading(false)
						console.log(error);
						if (error.code == 'auth/wrong-password') {
							toast.error(toastErrorMessage.passWordIncorrectErrorMsg, { rtl: true, })
						} else if (error.code == 'auth/user-not-found') {
							toast.error(toastErrorMessage.emailNotFoundMsg, { rtl: true, })
						} else {
							toast.error(toastErrorMessage.emailPasswordErrorMsg, { rtl: true, })
						}
					});
					// router.push('/login');
					// setLoading(false)
					fbq.event('Sign up', { email: email });
				}).catch(error => {
					setSubmitBtnDisabled(false)
					console.log(error)
					setLoading(false)
				});
			}).catch((error) => {
				console.log(error)
				if (error.code == 'auth/email-already-in-use') {
					toast.error(toastErrorMessage.emailUsedErrorMsg, { rtl: true, });
				}
				setLoading(false)
			})
		}
	}
	const handleUpdatePassword = (password) => {
		setPassword(password)
		let data = { ...initPasswordError }

		if (password.length >= 6) {
			data.minLength = false
			setInitPasswordError(data)
		} else {
			data.minLength = true
			setInitPasswordError(data)
		}

		if (password.length >= 6) {
			setPasswordError(null)
		} else {
			setPasswordError(inputErrorMessages.passwordFormateMsg)
		}
	}

	// const toggleDropdownforCities = () => {
	// 	setIsOpenForCity(!isOpenForCity);
	// };
	// const toggleDropdownForEducationLevel = () => {
	// 	setIsOpenForEducationLevel(!isOpenForEducationLevel);
	// }

	// const handleSelectCity = (city) => {
	// 	setSelectedCity(city.label);
	// 	setIsOpenForCity(false);
	// };

	// const handleSelectEducationLevel = (obj) => {
	// 	if (obj.value == 'other') {
	// 		setSelectedEducationLevel(obj.label);
	// 		setOtherEducationLevel(true);
	// 		setIsOpenForEducationLevel(false);
	// 	} else {
	// 		setSelectedEducationLevel(obj.label);
	// 		setIsOpenForEducationLevel(false);
	// 		setOtherEducationLevel(false);
	// 	}
	// }

	// const handleClickOutside = (event) => {
	// 	if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
	// 		setIsOpenForCity(false);
	// 	}
	// };

	// useEffect(() => {
	// 	document.addEventListener('mousedown', handleClickOutside);
	// 	return () => {
	// 		document.removeEventListener('mousedown', handleClickOutside);
	// 	};
	// }, []);

	return (
		<>
			{loading ?
				<div className={`relative ${styles.mainLoadingPage}`}>
					<Spinner borderwidth={7} width={6} height={6} />
				</div>
				:
				<div className={`relative ${styles.registerMainPage}`}>
					<div className={styles.loginFormDiv}>
						<h1 className={`fontMedium ${styles.signUpPageHead}`}>إنشاء حساب</h1>
						{/*<p className={`pb-2 ${styles.signUpPageSubText}`}>اكتب بياناتك بدقة، لأننا حنعتمدها وقت ما تسجل بالدورات</p>
						<div className='flex'>
							<p style={{ color: 'red' }}> ملاحظة: </p>
							<p className='pr-1'> جميع البيانات مطلوبة ما عدا رقم الجوال</p>
						</div>*/}
						<div className={`formInputBox`}>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={24} width={24} iconName={'newPersonIcon'} color={'#808080'} />
							</div>
							<input className={`formInput  ${styles.loginFormInput}  ${fullNameError && `${styles.inputError}`}`} id='fullName' type="text" name='fullName' value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder=' ' />
							<label className={`formLabel  ${styles.loginFormLabel} ${fullNameError && `${styles.inputPlaceHoldererror}`}`} htmlFor="fullName">الاسم الثلاثي</label>
						</div>
						{fullNameError ? <p className={styles.errorText}>{fullNameError}</p> : ""}
						<div>
							<p className={styles.titleLabel}>الجنس</p>
							<div className={`${styles.genderBtnBox} ${isGenderError && `${styles.inputErrorBox}`}`} >
								<button className={`${styles.maleBtn} ${gender == "male" ? `${styles.genderActiveBtn}` : `${styles.genderNotActiveBtn}`}`} onClick={(e) => { e.preventDefault(); setGender("male") }}>
									<AllIconsComponenet height={24} width={24} iconName={'newMaleIcon'} color={gender == "male" ? '#F26722 ' : '#808080'} />
									<span>ذكر</span>
								</button>
								<button className={`${styles.femaleBtn} ${gender == 'female' ? `${styles.genderActiveBtn}` : 'border-none'}`} onClick={(e) => { e.preventDefault(); setGender('female') }}>
									<AllIconsComponenet height={24} width={24} iconName={'newFemaleIcon'} color={gender == "female" ? '#F26722 ' : '#808080'} />
									<span>أنثى</span>
								</button>
							</div>
						</div>
						{isGenderError && <p className={styles.errorText}>{isGenderError}</p>}
						<div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={24} width={24} iconName={'email'} color={'#808080'} />
							</div>
							<input className={`formInput ${styles.loginFormInput} ${emailError && `${styles.inputError}`}`} name='email' id='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=' ' />
							<label className={`formLabel ${styles.loginFormLabel} ${emailError && `${styles.inputPlaceHoldererror}`}`} htmlFor="email">الايميل</label>
						</div>
						{emailError && <p className={styles.errorText}>{emailError}</p>}
						<div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={24} width={24} iconName={'newMobileIcon'} color={'#808080'} />
							</div>
							<input className={`formInput ${styles.loginFormInput} ${phoneNumberError && `${styles.inputError}`}`} name='phone' id='phone' type="number" inputMode='tel' value={phoneNumber} onChange={(e) => { if (e.target.value.length > 10) return; setPhoneNumber(e.target.value) }} placeholder=' ' />
							<label className={`formLabel ${styles.loginFormLabel} ${phoneNumberError && `${styles.inputPlaceHoldererror}`}`} htmlFor="phone">رقم الجوال (اختياري)</label>
						</div>
						{!phoneNumber ? <p className={styles.passwordHintMsg}>{inputErrorMessages.phoneNoFormateMsg}</p> : phoneNumberError && <p className={styles.errorText}>{phoneNumberError}</p>}

						{/* <div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={24} width={24} iconName={'newMobileIcon'} color={'#808080'} />
							</div>
							<input className={`formInput ${styles.loginFormInput} ${parentPhoneNumberError && `${styles.inputError}`}`} name='parentPhoneNo' id='parentPhoneNo' type="number" inputMode='tel' value={parentsContct} onChange={(e) => { if (e.target.value.length > 10) return; setParentPhoneNumber(e.target.value) }} placeholder=' ' />
							<label className={`formLabel ${styles.loginFormLabel} ${parentPhoneNumberError && `${styles.inputPlaceHoldererror}`}`} htmlFor="parentPhoneNo">{studentInformationConst.parentNumberPlaceHolder}</label>
						</div>
						{!parentsContct ? <p className={styles.passwordHintMsg}>{inputErrorMessages.parentsNoOptionalMsg}</p> : parentPhoneNumberError && <p className={styles.errorText}>{parentPhoneNumberError}</p>} */}

						{/* <div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={30} width={20} iconName={'graduate'} color={'#808080'} />
							</div>
							<div className="selectContainer" ref={dropdownRef}>
								<div className={`customDropdown ${isOpenForEducationLevel ? 'open' : ''}`} onClick={toggleDropdownForEducationLevel}>
									<div className="pr-8">
										{selectedEducationLevel || 'اختار السنة الدراسية'}
									</div>
									<div className="icon pl-2 pt-2">
										<AllIconsComponenet height={8} width={14} iconName={'dropDown'} color={'#808080'} />
									</div>
								</div>
								{isOpenForEducationLevel && (
									<ul className="dropdownMenu">
										{educationalLevelList.map(educationLevel => (
											<li key={educationLevel.value} onClick={() => handleSelectEducationLevel(educationLevel)} className="dropdownMenuItem">
												{educationLevel.label}
											</li>
										))}
									</ul>
								)}
							</div>
						</div> */}
						{/* {otherEducationLevel &&
							<div className='formInputBox'>
								<div className='formInputIconDiv'>
									<AllIconsComponenet height={24} width={24} iconName={'graduate'} color={'#808080'} />
								</div>
								<input className={`formInput ${styles.loginFormInput}`} name='educationLevel' id='educationLevel' type="text" value={otherEducation} onChange={(e) => setOtherEducation(e.target.value)} placeholder=' ' />
								<label className={`formLabel ${styles.loginFormLabel}`} htmlFor="educationLevel">السنة الدراسية</label>
							</div>
						} */}

						{/* <div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={30} width={20} iconName={'location'} color={'#808080'} />
							</div>
							<div className="selectContainer" ref={dropdownRef}>
								<div className={`customDropdown ${isOpenForCity ? 'open' : ''}`} onClick={toggleDropdownforCities}>
									<div className="pr-8">
										{selectedCity || 'ادخل المدينة والحي'}
									</div>
									<div className="icon pl-2 pt-2">
										<AllIconsComponenet height={8} width={14} iconName={'dropDown'} color={'#808080'} />
									</div>
								</div>
								{isOpenForCity && (
									<ul className="dropdownMenu">
										{citiesList.map(city => (
											<li key={city.value} onClick={() => handleSelectCity(city)} className="dropdownMenuItem">
												{city.label}
											</li>
										))}
									</ul>
								)}
							</div>
						</div> */}


						<div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={24} width={24} iconName={'lock'} color={'#808080'} />
							</div>
							<input className={`formInput ${styles.loginFormInput} ${passwordError && `${styles.inputError}`}`} name='password' id='password' type={showPassword ? "text" : "password"} value={password} onChange={(e) => handleUpdatePassword(e.target.value)} placeholder=' ' />
							<label className={`formLabel ${styles.loginFormLabel} ${passwordError && `${styles.inputPlaceHoldererror}`}`} htmlFor="password">كلمة السر</label>
							<div className={styles.passwordIconDiv}>
								{!showPassword ?
									<div className='cursor-pointer' onClick={() => setShowPassword(true)}>
										<AllIconsComponenet height={24} width={30} iconName={'newVisibleIcon'} color={'#00000080'} />
									</div>
									:
									<div className='cursor-pointer' onClick={() => setShowPassword(false)}>
										<AllIconsComponenet height={24} width={30} iconName={'newVisibleOffIcon'} color={'#00000080'} />
									</div>
								}
							</div>
						</div>
						{/*{passwordError ? <p className={styles.errorText}>{passwordError}</p> : <p className={styles.passwordHintMsg}> {inputErrorMessages.passwordFormateMsg}</p>}
						<div className={styles.errorMsgWraper}>
							<>
								<AllIconsComponenet
									iconName={(!password && !passwordError) ? "checkCircleIcon" : (!password && passwordError) ? 'alertIcon' : (password && initPasswordError?.minLength) ? 'alertIcon' : 'checkCircleIcon'}
									color={(!password && !passwordError) ? "#808080" : (!password && passwordError) ? "#E5342F" : (password && initPasswordError?.minLength) ? '#E5342F' : '#7FDF4B'}
									height={20}
									width={20}
								/>
								<p className='p-1'>{inputErrorMessages.passwordMinLengthMsg}</p>
							</>
						</div>
						<div className={styles.errorMsgWraper}>
							<>
								<AllIconsComponenet
									iconName={(!password && !passwordError) ? "checkCircleIcon" : (!password && passwordError) ? 'alertIcon' : (password && initPasswordError?.capitalLetter) ? 'alertIcon' : 'checkCircleIcon'}
									color={(!password && !passwordError) ? "#808080" : (!password && passwordError) ? "#E5342F" : (password && initPasswordError?.capitalLetter) ? '#E5342F' : '#7FDF4B'}
									height={20}
									width={20}
								/>
								<p className='p-1'>{inputErrorMessages.passwordIncludeCapitalMsg}</p>
							</>
						</div>
						<div className={styles.errorMsgWraper}>
							<>
								<AllIconsComponenet
									iconName={(!password && !passwordError) ? "checkCircleIcon" : (!password && passwordError) ? 'alertIcon' : (password && initPasswordError?.number) ? 'alertIcon' : 'checkCircleIcon'}
									color={(!password && !passwordError) ? "#808080" : (!password && passwordError) ? "#E5342F" : (password && initPasswordError?.number) ? '#E5342F' : '#7FDF4B'}
									height={20}
									width={20}
								/>
								<p className='p-1'>{inputErrorMessages.passwordIncludeNumberMsg}</p>
							</>
						</div>
						<div className={styles.errorMsgWraper}>
							<>
								<AllIconsComponenet
									iconName={(!password && !passwordError) ? "checkCircleIcon" : (!password && passwordError) ? 'alertIcon' : (password && initPasswordError?.specialCharacter) ? 'alertIcon' : 'checkCircleIcon'}
									color={(!password && !passwordError) ? "#808080" : (!password && passwordError) ? "#E5342F" : (password && initPasswordError?.specialCharacter) ? '#E5342F' : '#7FDF4B'}
									height={20}
									width={20}
								/>
								<p className='p-1'>{inputErrorMessages.passwordIncludeSpecialCharMsg}</p>
							</>
						</div>*/}
						<div className={styles.loginBtnBox}>
							<button className='primarySolidBtn' type='submit' disabled={submitBtnDisabled ? true : false} onClick={handleSignup}>إنشاء حساب</button>
						</div>
						<div className='relative'>
							<div className={styles.middleLine}></div>
							<p className={`${styles.andText}`}>أو</p>
						</div>
						<div className={styles.loginWithoutPasswordBtnBox} onClick={() => hendelGoogleLogin()}>
							<AllIconsComponenet height={20} width={20} iconName={'googleIcon'} />
							<p className='mx-2'>تسجيل الدخول باستخدام قوقل</p>
						</div>
						<div className={`${styles.loginWithoutPasswordBtnBox} ${styles.appleLoginBtn}`} onClick={() => handleAppleLogin()}>
							<AllIconsComponenet height={20} width={20} iconName={'appleStore'} color={'#FFFFFF'} />
							<p className='mx-2'>تسجيل الدخول باستخدام ابل</p>
						</div>
						<div className={styles.gotoPageText} onClick={() => router.push('/login')}>
							<p className='pl-2'> عندك حساب؟ </p>
							<p className="primarylink"> سجل دخولك</p>
						</div>
					</div>
				</div >
			}
			{updateProfileModalOpen &&
				<ModelForUpdateProfile
					open={updateProfileModalOpen}
					setUpdateProfileModalOpen={setUpdateProfileModalOpen}
				/>
			}
		</>
	)
}
