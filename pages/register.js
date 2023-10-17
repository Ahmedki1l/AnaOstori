import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import styles from '../styles/Login.module.scss'
import { signupWithEmailAndPassword, signInWithApple, GoogleLogin } from '../services/fireBaseAuthService'
import { useRouter } from 'next/router'
import { getAuthRouteAPI, updateProfile } from '../services/apisService'
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

	const [isEmailError, setIsEmailError] = useState(false);
	const [isPasswordError, setIsPasswordError] = useState(false);
	const [isPhoneNumberError, setIsPhoneNumberError] = useState(false);
	const [isGenderError, setIsGenderError] = useState(false);

	const [fullNameError, setFullNameError] = useState(null);
	const [phoneNumberError, setPhoneNumberError] = useState(false);
	const [emailError, setEmailError] = useState(null);
	const [passwordError, setPasswordError] = useState(null);

	const [user, setUser] = useState();
	const [loading, setLoading] = useState(false)

	const router = useRouter();
	const dispatch = useDispatch();

	const storeData = useSelector((state) => state?.globalStore);

	const handleUpdateProfile = async (params) => {
		await updateProfile(params).then(res => {
			router.push('/')
		}).catch(error => {
			toast.error(error)
			console.log(error)
		});
	}

	const handleStoreUpdate = async (isUserNew) => {
		if (isUserNew) {
			router.push('/registerSocialMediaUser')
			toast.success(toastErrorMessage.successRegisterMsg)
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
					toast.success(toastErrorMessage.successLoginMsg)
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
			handleStoreUpdate(isUserNew)
			dispatch({
				type: 'ADD_AUTH_TOKEN',
				accessToken: user?.accessToken,
			});
			dispatch({
				type: 'LOGIN_WITHOUT_PASSWORD',
				loginWithoutPassword: true,
			});
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
		}
		else {
			setFullNameError(null)
		}
		if (email && !(regexEmail.test(email))) {

			setEmailError(inputErrorMessages.noEmailErrorMsg)
		}
		else {
			setEmailError(null)
		}

		if (password && !(regexPassword.test(password))) {

			setIsPasswordError(inputErrorMessages.noPasswordMsg)
		}
		else {
			setIsPasswordError(null)
		}

		if (phoneNumber && !(phoneNumber.startsWith("05"))) {
			setPhoneNumberError(inputErrorMessages.mobileNumberFormatErrorMsg)
		}
		else {
			setPhoneNumberError(null);
		}

	}, [fullName, email, password, phoneNumber, regexEmail, regexPassword, regexPhone])


	const handleSignup = async () => {
		setLoading(true);
		if (!fullName) {
			setFullNameError(inputErrorMessages.fullNameErrorMsg);
		} else if (fullName && (fullName.split(" ").length - 1) < 2) {
			setFullNameError(inputErrorMessages.nameThreeFoldErrorMsg);
		}
		if (!gender) {
			setIsGenderError(inputErrorMessages.genderErrorMsg);
		}
		if (!email) {
			setEmailError(inputErrorMessages.noEmailErrorMsg)
		}
		if (!password) {
			setPasswordError(inputErrorMessages.noPasswordMsg)
		}
		else if (fullNameError == null && emailError == null && passwordError == null) {
			await signupWithEmailAndPassword(email, password, fullName, phoneNumber, gender);
		}
	}

	useEffect(() => {
		if (router?.query?.user) {
			setUser(JSON.parse(router?.query?.user))
		}
	}, [router?.query?.user])



	return (
		<>
			{loading ?
				<div className={`relative ${styles.mainLoadingPage}`}>
					<Spinner borderwidth={7} width={6} height={6} />
				</div>
				:
				<div className={`relative ${styles.mainPage}`}>
					<div className={styles.loginFormDiv}>
						<h1 className={`fontBold ${styles.signUpPageHead}`}>إنشاء حساب</h1>
						<p className={`pb-2 ${styles.signUpPageSubText}`}>اكتب بياناتك بدقة، لأننا حنعتمدها وقت ما تسجل بالدورات ملاحظة: جميع البيانات مطلوبة ما عدا رقم الجوال</p>
						<div className={`formInputBox`}>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={19} width={16} iconName={'persone1'} color={'#00000080'} />
							</div>
							<input className={`formInput ${styles.loginFormInput}`} id='fullName' type="text" name='fullName' value={user?._tokenResponse?.fullName ? user?._tokenResponse?.fullName : fullName} onChange={(e) => setFullName(e.target.value)} placeholder=' ' />
							<label className={`formLabel ${styles.loginFormLabel}`} htmlFor="fullName">الاسم الثلاثي</label>
						</div>
						{fullNameError ? <p className={styles.errorText}>{fullNameError}</p> : ""}
						<div className={`formInputBox ${styles.radioBtnDiv}`}>
							<p className={`pl-4 ${styles.genderText}`}>الجنس</p>
							<input type="radio" name="gender" className={styles.radioBtns} id="maleGender" value="male" onChange={(e) => setGender(e.target.value)} />
							<label className='pr-1 pl-4' htmlFor='maleGender'>ذكر</label>
							<input type="radio" name="gender" className={styles.radioBtns} id="femaleGender" value="female" onChange={(e) => setGender(e.target.value)} />
							<label className='pr-1' htmlFor="femaleGender">أنثى</label>
						</div>
						<div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={19} width={16} iconName={'mobile'} color={'#00000080'} />
							</div>
							<input className={`formInput ${styles.loginFormInput}`} name='phoneNo' id='phoneNo' type="number" value={user?.user?.phoneNumber ? user?.user?.phoneNumber : phoneNumber} onChange={(e) => { if (e.target.value.length > 10) return; setPhoneNumber(e.target.value) }} placeholder=' ' />
							<label className={`formLabel ${styles.loginFormLabel}`} htmlFor="phoneNo">رقم الجوال (اختياري)</label>
						</div>
						{isPhoneNumberError ? <p className={styles.errorText}>الصيغة المدخلة غير صحيحة، فضلا اكتب الرقم بصيغة 05</p> : phoneNumberError ? <p className={styles.errorText}>{phoneNumberError}</p> : ""}
						<div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={24} width={24} iconName={'email'} color={'#808080'} />
							</div>
							<input className={`formInput ${styles.loginFormInput}`} name='email' id='email' type="email" value={user?._tokenResponse?.email ? user?._tokenResponse?.email : email} onChange={(e) => setEmail(e.target.value)} placeholder=' ' />
							<label className={`formLabel ${styles.loginFormLabel}`} htmlFor="email">الايميل</label>
						</div>
						{isEmailError ? <p className={styles.errorText}>فضلا عيد كتابة ايميلك بالطريقة الصحيحة</p> : emailError && <p className={styles.errorText}>{emailError}</p>}
						<div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={24} width={24} iconName={'lock'} color={'#808080'} />
							</div>
							<input className={`formInput ${styles.loginFormInput}`} name='password' id='password' type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder=' ' />
							<label className={`formLabel ${styles.loginFormLabel}`} htmlFor="password">كلمة السر</label>
							<div className={styles.passwordIconDiv}>
								{!showPassword ?
									<div onClick={() => setShowPassword(true)}>
										<AllIconsComponenet height={24} width={30} iconName={'visibilityIcon'} color={'#00000080'} />
									</div>
									:
									<div onClick={() => setShowPassword(false)}>
										<AllIconsComponenet height={24} width={30} iconName={'visibilityOffIcon'} color={'#00000080'} />
									</div>
								}
							</div>
						</div>
						{/* {!isPasswordError && <p className={styles.passwordHintText}>يجب ان تحتوي على 8 احرف كحد ادنى، حرف واحد كبير على الاقل، رقم، وعلامة مميزة</p>} */}
						{isPasswordError ? <p className={styles.errorText}>يجب ان تحتوي على 8 احرف كحد ادنى، حرف واحد كبير على الاقل، رقم، وعلامة مميزة</p> : passwordError && <p className={styles.errorText}>{passwordError}</p>}
						<div className={styles.loginBtnBox}>
							<button className='primarySolidBtn' type='submit' disabled={!router?.query?.user && (fullNameError !== null || emailError !== null || passwordError !== null || !fullName.length || !email.length || !password.length || isPasswordError || phoneNumberError) ? true : false} onClick={handleSignup}>إنشاء حساب</button>
						</div>
						<div className='relative'>
							<div className={styles.middleLine}></div>
							<p className={`fontBold ${styles.andText}`}>او</p>
						</div>
						<div className={styles.loginWithoutPasswordBtnBox} onClick={() => hendelGoogleLogin()}>
							<AllIconsComponenet height={30} width={30} iconName={'googleIcon'} />
							<p className='mx-2'>تسجيل الدخول باستخدام قوقل</p>
						</div>
						<div className={`${styles.loginWithoutPasswordBtnBox} ${styles.appleLoginBtn}`} onClick={() => handleAppleLogin()}>
							<AllIconsComponenet height={30} width={30} iconName={'appleStore'} color={'#FFFFFF'} />
							<p className='mx-2'>تسجيل الدخول باستخدام ابل</p>
						</div>
						<p className={`fontMedium ${styles.gotoPageText}`} > عندك حساب؟ <Link href={'/login'} className="primarylink">سجل دخولك</Link></p>
					</div>
				</div>
			}
		</>
	)
}
