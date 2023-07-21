import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import styles from '../styles/Login.module.scss'
import { signupWithEmailAndPassword, GoogleLogin } from '../services/fireBaseAuthService'
import { useRouter } from 'next/router'
import { myCoursesAPI, updateProfile, viewProfileAPI } from '../services/apisService'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux'
import AllIconsComponenet from '../Icons/AllIconsComponenet'

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Spinner from '../components/CommonComponents/spinner'



export default function Register() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [gender, setGender] = useState("")

	const [isEmailError, setIsEmailError] = useState(false);
	const [isPasswordError, setIsPasswordError] = useState(false);
	const [isPhoneNumberError, setIsPhoneNumberError] = useState(false);
	const [isGenderError, setIsGenderError] = useState(false);

	const [firstNameError, setFirstNameError] = useState(false);
	const [lastNameError, setLastNameError] = useState(false);
	const [phoneNumberError, setPhoneNumberError] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

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
			console.log("errors : ", error)
		});
	}

	const handleStoreUpdate = async (accessToken) => {
		try {
			const viewProfileReq = viewProfileAPI(accessToken)
			const getMyCourseReq = myCoursesAPI(accessToken)

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
			let profileData = viewProfileData?.data
			if (profileData.firstName == null || profileData.lastName == null || profileData.phone == null || profileData.gender == null) {
				router.push('/registerGoogleUser')
			} else {
				router.push('/')
			}
		} catch (error) {
			console.log(error);
		}
	}

	const hendelGoogleLogin = async () => {
		setLoading(true)
		await GoogleLogin().then(async (result) => {
			const user = result?.user;
			dispatch({
				type: 'ADD_AUTH_TOKEN',
				accessToken: user?.accessToken,
			});
			dispatch({
				type: 'IS_USER_FROM_GOOGLE',
				googleLogin: true,
			});
			handleStoreUpdate(user?.accessToken)

		}).catch((error) => {
			console.log(error);
		});
	}

	const regexEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

	const regexPassword = useMemo(() => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, []);

	const regexPhone = useMemo(() => /^(\+?\d{1,3}[- ]?)?\d{10}$/, []);


	useEffect(() => {

		if (firstName) {
			setFirstNameError(false)
		}

		if (lastName) {
			setLastNameError(false)
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

		if (phoneNumber && !(phoneNumber.startsWith("05"))) {
			setIsPhoneNumberError(true)
			setPhoneNumberError(false)
		}
		else {
			setIsPhoneNumberError(false)
		}

	}, [firstName, lastName, email, password, phoneNumber, regexEmail, regexPassword, regexPhone])


	const handleSignup = async () => {
		setLoading(true)
		if (!firstName) {
			setFirstNameError("فضلا ادخل اسمك الاول")
		}
		if (!lastName) {
			setLastNameError("فضلا ادخل اسم العائلة")
		}
		if (!gender) {
			setIsGenderError("فضلا اختر الجنس")
		}
		if (!phoneNumber) {
			setPhoneNumberError("رقم الجوال مطلوب")
		}
		if (!email) {
			setEmailError("فضلا ادخل الايميل")
		}
		if (!password) {
			setPasswordError("فضلا ادخل كلمة السر")
		}
		else if (firstName && lastName && phoneNumber && email && password && gender) {
			await signupWithEmailAndPassword(email, password, firstName, lastName, phoneNumber, gender)
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
						<p className={`pb-2 ${styles.signUpPageSubText}`}>فضلا اكتب بياناتك بدقة، حيث ستٌعتمد وقت تسجيلك بالدورات</p>
						<div className='flex justify-between'>
							<div>
								<div className={`formInputBox ${styles.loginPageSmallInputBox}`}>
									<div className='formInputIconDiv'>
										<AllIconsComponenet height={19} width={16} iconName={'persone1'} color={'#00000080'} />
									</div>
									<input className={`formInput ${styles.loginFormInput}`} id='firstName' type="text" name='firstName' value={user?._tokenResponse?.firstName ? user?._tokenResponse?.firstName : firstName} onChange={(e) => setFirstName(e.target.value)} placeholder=' ' />
									<label className={`formLabel ${styles.loginFormLabel}`} htmlFor="firstName">الاسم الاول</label>
								</div>
								{firstNameError ? <p className={styles.errorText}>{firstNameError}</p> : ""}
							</div>
							<div>
								<div className={`formInputBox ${styles.loginPageSmallInputBox}`}>
									<div className='formInputIconDiv'>
										<AllIconsComponenet height={19} width={16} iconName={'persone1'} color={'#00000080'} />
									</div>
									<input className={`formInput ${styles.loginFormInput}`} type="text" name='lastName' id='lastName' value={user?._tokenResponse?.lastName ? user?._tokenResponse?.lastName : lastName} onChange={(e) => setLastName(e.target.value)} placeholder=' ' />
									<label className={`formLabel ${styles.loginFormLabel}`} htmlFor="lastName">اسم العائلة</label>
								</div>
								{lastNameError ? <p className={styles.errorText}>{lastNameError}</p> : ""}
							</div>
						</div>
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
							<label className={`formLabel ${styles.loginFormLabel}`} htmlFor="phoneNo">رقم الجوال</label>
						</div>
						{isPhoneNumberError ? <p className={styles.errorText}>الصيغة المدخلة غير صحيحة، فضلا اكتب الرقم بصيغة 05</p> : phoneNumberError ? <p className={styles.errorText}>{phoneNumberError}</p> : ""}
						<div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={16} width={16} iconName={'email'} color={'#00000080'} />
							</div>
							<input className={`formInput ${styles.loginFormInput}`} name='email' id='email' type="email" value={user?._tokenResponse?.email ? user?._tokenResponse?.email : email} onChange={(e) => setEmail(e.target.value)} placeholder=' ' />
							<label className={`formLabel ${styles.loginFormLabel}`} htmlFor="email">الايميل</label>
						</div>
						{isEmailError ? <p className={styles.errorText}>فضلا عيد كتابة ايميلك بالطريقة الصحيحة</p> : emailError && <p className={styles.errorText}>{emailError}</p>}
						<div className='formInputBox'>
							<div className='formInputIconDiv'>
								<AllIconsComponenet height={18} width={16} iconName={'lock'} color={'#00000080'} />
							</div>
							<input className={`formInput ${styles.loginFormInput}`} name='password' id='password' type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder=' ' />
							<label className={`formLabel ${styles.loginFormLabel}`} htmlFor="password">كلمة السر</label>
							<div className={styles.passwordIconDiv}>
								{!showPassword ?
									<div onClick={() => setShowPassword(true)}>
										<VisibilityIcon className={styles.visibilityIcon} />
									</div>
									:
									<div onClick={() => setShowPassword(false)}>
										<VisibilityOffIcon className={styles.visibilityIcon} />
									</div>
								}
							</div>
						</div>
						{!isPasswordError && <p className={styles.passwordHintText}>يجب ان تحتوي على 8 احرف كحد ادنى، حرف واحد كبير على الاقل، رقم، وعلامة مميزة</p>}
						{isPasswordError ? <p className={styles.errorText}>يجب ان تحتوي على 8 احرف كحد ادنى، حرف واحد كبير على الاقل، رقم، وعلامة مميزة</p> : passwordError && <p className={styles.errorText}>{passwordError}</p>}
						<div className={styles.loginBtnBox}>
							<button className='primarySolidBtn' type='submit' disabled={!router?.query?.user && (emailError || passwordError || isEmailError || isPasswordError || !email || !password) ? true : false} onClick={handleSignup}>انشاء حساب</button>
						</div>
						<div className='relative'>
							<div className={styles.middleLine}></div>
							<p className={`fontBold ${styles.andText}`}>او</p>
						</div>
						<div className={styles.googleLoginBtnBox} onClick={() => hendelGoogleLogin()}>
							<AllIconsComponenet height={30} width={30} iconName={'googleIcon'} />
							<p className='mx-2'>تسجيل الدخول عبر قوقل</p>
						</div>
						<p className={`fontMedium ${styles.gotoPageText}`} > عندك حساب؟ <Link href={'/login'} className="primarylink">سجل دخولك</Link></p>
					</div>
				</div>
			}
		</>
	)
}
