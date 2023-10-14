import Image from 'next/legacy/image'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import styles from '../styles/Login.module.scss'
import { GoogleLogin, signInWithApple, startEmailPasswordLogin } from '../services/fireBaseAuthService'
import { useDispatch, useSelector } from 'react-redux';
import { getAuthRouteAPI } from '../services/apisService';
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import AllIconsComponenet from '../Icons/AllIconsComponenet'
import Spinner from '../components/CommonComponents/spinner'
import { inputErrorMessages, toastErrorMessage, toastSuccessMessage } from '../constants/ar'



export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	const [isEmailError, setIsEmailError] = useState(false);

	const [isPasswordError, setIsPasswordError] = useState(false);

	const dispatch = useDispatch();

	const regexEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, [])

	const regexPassword = useMemo(() => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, [])

	const [loading, setLoading] = useState(false)

	const storeData = useSelector((state) => state?.globalStore);
	const router = useRouter()


	useEffect(() => {

		if (email) {
			setEmailError(false)
		}

		if (password) {
			setPasswordError(false)
		}

		if (email && !(regexEmail.test(email))) {
			setIsEmailError(true)
		}
		else {
			setIsEmailError(false)
		}

		if (password && !(regexPassword.test(password))) {
			setIsPasswordError(true)
		}
		else {
			setIsPasswordError(false)
		}

	}, [email, password, regexEmail, regexPassword])


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
			} catch (error) {
				console.log(error);
				setLoading(false)
			}
		}

	}

	const hendelGoogleLogin = async () => {
		setLoading(true)
		await GoogleLogin().then((result) => {
			const isUserNew = result._tokenResponse.isNewUser
			const user = result?.user;
			localStorage.setItem("accessToken", user?.accessToken);
			toast.success(toastSuccessMessage.successLoginMsg)
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
			setLoading(false)
		});
	}

	const handleSignIn = async (e) => {
		e.preventDefault();
		if (!email) {
			setEmailError(inputErrorMessages.noEmailErrorMsg)
		}
		if (!password) {
			setPasswordError(inputErrorMessages.noPasswordMsg)
		}
		if (email && password && !isEmailError && !isPasswordError) {
			setLoading(true)
			await startEmailPasswordLogin(email, password).then((result) => {
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
				handleStoreUpdate()
				toast.success(toastSuccessMessage.successLoginMsg)
				router.push('/')
			}).catch((error) => {
				setLoading(false)
				console.log(error);
				if (error.code == 'auth/wrong-password') {
					toast.error(toastErrorMessage.passWordIncorrectErrorMsg)
				} else if (error.code == 'auth/user-not-found') {
					toast.error(toastErrorMessage.emailNotFoundMsg)
				} else {
					toast.error(toastErrorMessage.emailPasswordErrorMsg)
				}
			});
		}
	}
	const handleAppleLogin = async () => {
		setLoading(true)
		await signInWithApple().then((result) => {
			const user = result.user;
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

	return (
		<>
			{loading ?
				<div className={`relative ${styles.mainLoadingPage}`}>
					<Spinner borderwidth={7} width={6} height={6} />
				</div>
				:
				<div className={`relative ${styles.mainPage}`}>
					<div className={styles.loginFormDiv}>
						<h1 className={`fontBold ${styles.loginPageHead}`}>تسجيل الدخول</h1>
						<p>خلنا نكمل قصة نجاحك اللي بديناها سوا ✨</p>
						<div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={24} width={24} iconName={'email'} color={'#808080'} />
							</div>
							<input className={`formInput ${styles.loginFormInput}`} name='email' id='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=' ' />
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
										<AllIconsComponenet height={22} width={27} iconName={'visibilityIcon'} color={'#00000080'} />
									</div>
									:
									<div onClick={() => setShowPassword(false)}>
										<AllIconsComponenet height={22} width={27} iconName={'visibilityOffIcon'} color={'#00000080'} />
									</div>
								}
							</div>
						</div>
						{isPasswordError ? <p className={styles.errorText}>يجب ان تحتوي على 8 احرف كحد ادنى، حرف واحد كبير على الاقل، رقم، وعلامة مميزة</p> : passwordError && <p className={styles.errorText}>{passwordError}</p>}
						<Link href={'/forgot-password'} className={`link ${styles.forgotPassText}`}>نسيت كلمة السر؟</Link>
						<div className={styles.loginBtnBox}>
							<button className='primarySolidBtn' type='submit' onClick={handleSignIn}>تسجيل الدخول</button>
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
						<p className={`fontMedium ${styles.gotoPageText}`} > مستخدم جديد؟ <Link href={'/register'} className="primarylink">إنشاء حساب</Link></p>
					</div>
					<div className={`absolute ${styles.rightImgDiv}`}>
						<Image src="/images/squarePattern2.svg" alt='Squre Pattern Image' layout='fill' objectFit="cover" priority />
					</div>
				</div>
			}
		</>
	)
}
