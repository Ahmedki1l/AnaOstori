import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import styles from '../styles/Login.module.scss'
import { signupWithEmailAndPassword, signInWithApple, GoogleLogin } from '../services/fireBaseAuthService'
import { useRouter } from 'next/router'
import { getAuthRouteAPI, postAuthRouteAPI } from '../services/apisService'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux'
import AllIconsComponenet from '../Icons/AllIconsComponenet'
import Spinner from '../components/CommonComponents/spinner'
import { inputErrorMessages, toastErrorMessage } from '../constants/ar'



export default function Register() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
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
	const [emailError, setEmailError] = useState(null);
	const [isGenderError, setIsGenderError] = useState(null);
	const [passwordError, setPasswordError] = useState(null);
	const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false)
	const [loading, setLoading] = useState(false)
	const router = useRouter();
	const dispatch = useDispatch();
	const storeData = useSelector((state) => state?.globalStore);

	const handleStoreUpdate = async (isUserNew) => {
		if (isUserNew) {
			router.push('/registerSocialMediaUser')
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

				if (storeData?.returnUrl == "" || storeData?.returnUrl == undefined) {
					router.push('/')
					toast.success(toastErrorMessage.successLoginMsg, { rtl: true })
				}
				else {
					router.push(storeData?.returnUrl)
				}
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

	const regexPassword = useMemo(() => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, []);

	const regexPhone = useMemo(() => /^(\+?\d{1,3}[- ]?)?\d{10}$/, []);

	const namePattern = /^(?!.*  )\S+(?: \S+){0,2}$/;


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
		// if (phoneNumber && !(phoneNumber.startsWith("05"))) {
		// 	setPhoneNumberError(inputErrorMessages.mobileNumberFormatErrorMsg)
		// } else {
		// 	setPhoneNumberError(null);
		// }
		if (phoneNumber && !(phoneNumber.startsWith("05"))) {
			setPhoneNumberError(inputErrorMessages.mobileNumberFormatErrorMsg)
		} else if (phoneNumber && phoneNumber.length < 10) {
			setPhoneNumberError(inputErrorMessages.phoneNumberLengthMsg)
		} else {
			setPhoneNumberError(null);
		}
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
		} else if (password && (password.length < 8 || !password.match(/[A-Z]/g) || !password.match(/[0-9]/g) || !password.match(/[!@#$%^&*]/g))) {
			setPasswordError(inputErrorMessages.passwordFormateMsg)
		} else {
			setPasswordError(null)
		}
		if (!fullName || (fullName && (fullName.split(" ").length - 1) < 2) || !gender || !email || !password || (password.length < 8 || !password.match(/[A-Z]/g) || !password.match(/[0-9]/g) || !password.match(/[!@#$%^&*]/g))) {
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
				const params = {
					routeName: 'updateProfileHandler',
					...data,
				}
				await postAuthRouteAPI(params).then(async (res) => {
					router.push('/login');
					setLoading(false)
					fbq.event('Sign up', { email: email });
				}).catch(error => {
					setSubmitBtnDisabled(false)
					console.log(error)
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
		if (password.length > 8) {
			data.minLength = false
			setInitPasswordError(data)
		} else {
			data.minLength = true
			setInitPasswordError(data)
		}
		if (password.match(/[A-Z]/g)) {
			data.capitalLetter = false
			setInitPasswordError(data)
		} else {
			data.capitalLetter = true
			setInitPasswordError(data)
		}
		if (password.match(/[0-9]/g)) {
			data.number = false
			setInitPasswordError(data)
		} else {
			data.number = true
			setInitPasswordError(data)
		}
		if (password.match(/[!@#$%^&*]/g)) {
			data.specialCharacter = false
			setInitPasswordError(data)
		} else {
			data.specialCharacter = true
			setInitPasswordError(data)
		}
		if (password.length > 8 && password.match(/[A-Z]/g) && password.match(/[0-9]/g) && password.match(/[!@#$%^&*]/g)) {
			setPasswordError(null)
		} else {
			setPasswordError(inputErrorMessages.passwordFormateMsg)
		}
	}
	return (
		<>
			{loading ?
				<div className={`relative ${styles.mainLoadingPage}`}>
					<Spinner borderwidth={7} width={6} height={6} />
				</div>
				:
				<div className={`relative ${styles.registerMainPage}`}>
					<div className={styles.loginFormDiv}>
						<h1 className={`fontBold ${styles.signUpPageHead}`}>إنشاء حساب</h1>
						<p className={`pb-2 ${styles.signUpPageSubText}`}>اكتب بياناتك بدقة، لأننا حنعتمدها وقت ما تسجل بالدورات</p>
						<div className='flex'>
							<p style={{ color: 'red' }}> ملاحظة: </p>
							<p className='pr-1'> جميع البيانات مطلوبة ما عدا رقم الجوال</p>
						</div>
						<div className={`formInputBox`}>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={24} width={24} iconName={'newPersonIcon'} color={'#808080'} />
							</div>
							<input className={`formInput ${fullNameError ? `${styles.inputError}` : `${styles.loginFormInput}`}`} id='fullName' type="text" name='fullName' value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder=' ' />
							<label className={`formLabel ${fullNameError ? `${styles.inputPlaceHoldererror}` : `${styles.loginFormLabel}`}`} htmlFor="fullName">الاسم الثلاثي</label>
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
							<input className={`formInput ${emailError ? `${styles.inputError}` : `${styles.loginFormInput}`}`} name='email' id='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=' ' />
							<label className={`formLabel ${emailError ? `${styles.inputPlaceHoldererror}` : `${styles.loginFormLabel}`}`} htmlFor="email">الايميل</label>
						</div>
						{emailError && <p className={styles.errorText}>{emailError}</p>}
						<div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={24} width={24} iconName={'newMobileIcon'} color={'#808080'} />
							</div>
							<input className={`formInput ${styles.loginFormInput}`} name='phone' id='phone' type="number" value={phoneNumber} onChange={(e) => { if (e.target.value.length > 10) return; setPhoneNumber(e.target.value) }} placeholder=' ' />
							<label className={`formLabel ${styles.loginFormLabel}`} htmlFor="phone">رقم الجوال (اختياري)</label>
						</div>
						{!phoneNumber ? <p className={styles.passwordHintMsg}>{inputErrorMessages.phoneNoFormateMsg}</p> : phoneNumberError ? <p className={styles.errorText}>{phoneNumberError}</p> : !phoneNumberError || phoneNumber.length < 10 && passwordError}
						<div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={24} width={24} iconName={'lock'} color={'#808080'} />
							</div>
							<input className={`formInput ${passwordError ? `${styles.inputError}` : `${styles.loginFormInput}`}`} name='password' id='password' type={showPassword ? "text" : "password"} value={password} onChange={(e) => handleUpdatePassword(e.target.value)} placeholder=' ' />
							<label className={`formLabel ${passwordError ? `${styles.inputPlaceHoldererror}` : `${styles.loginFormLabel}`}`} htmlFor="password">كلمة السر</label>
							<div className={styles.passwordIconDiv}>
								{!showPassword ?
									<div onClick={() => setShowPassword(true)}>
										<AllIconsComponenet height={24} width={30} iconName={'newVisibleIcon'} color={'#00000080'} />
									</div>
									:
									<div onClick={() => setShowPassword(false)}>
										<AllIconsComponenet height={24} width={30} iconName={'newVisibleOffIcon'} color={'#00000080'} />
									</div>
								}
							</div>
						</div>
						{passwordError && <p className={styles.errorText}>{passwordError}</p>}
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
						</div>
						<div className={styles.loginBtnBox}>
							<button className='primarySolidBtn' type='submit' disabled={submitBtnDisabled ? true : false} onClick={handleSignup}>إنشاء حساب</button>
						</div>
						<div className='relative'>
							<div className={styles.middleLine}></div>
							<p className={`fontBold ${styles.andText}`}>او</p>
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
		</>
	)
}
