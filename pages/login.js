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
import ModelForUpdateProfile from '../components/ModalForUpdateProfile/ModalForUpdateProfile'

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [emailError, setEmailError] = useState(null);
	const [passwordError, setPasswordError] = useState(false);
	const [updateProfileModalOpen, setUpdateProfileModalOpen] = useState(false);

	const dispatch = useDispatch();

	const regexEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, [])

	const regexPassword = useMemo(() => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, [])

	const [loading, setLoading] = useState(false)

	const storeData = useSelector((state) => state?.globalStore);
	const router = useRouter()

	useEffect(() => {

		if (email) {
			setEmailError(null)
		}
		if (password) {
			setPasswordError(null)
		}
		if (email && !(regexEmail.test(email))) {
			setEmailError(inputErrorMessages.enterEmailCorrectInputErrorMsg)
		} else {
			setEmailError(null)
		}
		if (!password) {
			setPasswordError(null)
		}

	}, [email, password, regexEmail])


	const handleStoreUpdate = async (isUserNew) => {
		if (isUserNew) {
			// router.push('/registerSocialMediaUser')
			router.push('/updateProfile')
			toast.success(toastSuccessMessage.successRegisterMsg, { rtl: true, })
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
					router.push('/registerSocialMediaUser')
					if (viewProfileData?.data.gender == null || viewProfileData?.data.gender == '') {
						router.push('/updateProfile')
					}
				} else {
					if (!storeData?.returnUrl) {
						if (viewProfileData?.data?.reminderPopUpAttempt === null || viewProfileData?.data?.reminderPopUpAttempt < 3) {
							setUpdateProfileModalOpen(true)
						}
						else {
							router.push('/')
							toast.success(toastSuccessMessage.successLoginMsg, { rtl: true, })
						}
					}
					else {
						router.push(storeData?.returnUrl)
					}
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
			// toast.success(toastSuccessMessage.successLoginMsg, { rtl: true, })
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
		if (email && password) {
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
				handleStoreUpdate(false)
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
				<div className={`relative ${styles.loginMainPage}`}>
					<div className={styles.loginFormDiv}>
						<h1 className={`fontMedium ${styles.loginPageHead}`}>تسجيل الدخول</h1>
						<p>خلنا نكمل قصة نجاحك اللي بديناها سوا ✨</p>
						<div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={24} width={24} iconName={'email'} color={'#808080'} />
							</div>
							<input className={`formInput ${styles.loginFormInput} ${emailError && `${styles.inputError}`}`} name='email' id='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=' ' autoComplete='off' />
							<label className={`formLabel ${styles.loginFormLabel} ${emailError && `${styles.inputPlaceHoldererror}`}`} htmlFor="email">الايميل</label>
						</div>
						{emailError && <p className={styles.errorText}>{emailError}</p>}
						<div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={24} width={24} iconName={'lock'} color={'#808080'} />
							</div>
							<input className={`formInput ${styles.loginFormInput} ${passwordError && `${styles.inputError}`}`} name='password' id='password' type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder=' ' />
							<label className={`formLabel ${styles.loginFormLabel} ${passwordError && `${styles.inputPlaceHoldererror}`}`} htmlFor="password">كلمة السر</label>
							<div className={styles.passwordIconDiv}>
								{!showPassword ?
									<div onClick={() => setShowPassword(true)}>
										<AllIconsComponenet height={24} width={27} iconName={'newVisibleIcon'} color={'#00000080'} />
									</div>
									:
									<div onClick={() => setShowPassword(false)}>
										<AllIconsComponenet height={24} width={27} iconName={'newVisibleOffIcon'} color={'#00000080'} />
									</div>
								}
							</div>
						</div>
						{passwordError && <p className={styles.errorText}>{passwordError}</p>}
						{/* {passwordError ? <p className={styles.errorText}>كلمة السر لاهنت</p> : isPasswordError && <p className={styles.errorText}>كلمة السر غير صحيحة</p>} */}
						<Link href={'/forgot-password'} className={`link ${styles.forgotPassText}`}>نسيت كلمة السر؟</Link>
						<div className={styles.loginBtnBox}>
							<button className='primarySolidBtn' type='submit' onClick={handleSignIn}>تسجيل الدخول</button>
						</div>
						<div className='relative'>
							<div className={styles.middleLine}></div>
							<p className={styles.andText}>أو</p>
						</div>
						<div className={styles.loginWithoutPasswordBtnBox} onClick={() => hendelGoogleLogin()}>
							<AllIconsComponenet height={20} width={20} iconName={'googleIcon'} />
							<p className='mx-2'>تسجيل الدخول باستخدام قوقل</p>
						</div>
						<div className={`${styles.loginWithoutPasswordBtnBox} ${styles.appleLoginBtn}`} onClick={() => handleAppleLogin()}>
							<AllIconsComponenet height={20} width={20} iconName={'appleStore'} color={'#FFFFFF'} />
							<p className='mx-2'>تسجيل الدخول باستخدام ابل</p>
						</div>
						<div className={styles.gotoPageText} onClick={() => router.push('/register')}>
							<p className='pl-2'> مستخدم جديد؟ </p>
							<p className="primarylink">  أنشئ حساب</p>
						</div>
					</div>
					<div className={`absolute ${styles.rightImgDiv}`}>
						<Image src="/images/squarePattern2.svg" alt='Squre Pattern Image' layout='fill' objectFit="cover" priority />
					</div>
				</div>
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
