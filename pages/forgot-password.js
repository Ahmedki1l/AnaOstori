import React, { useEffect, useMemo, useState } from 'react'
import styles from '../styles/ForgotPassword.module.scss'
import { forgotPassword } from '../services/fireBaseAuthService'
import AllIconsComponenet from '../Icons/AllIconsComponenet'
import { inputErrorMessages } from '../constants/ar'

export default function ForgotPassword() {

	const [email, setEmail] = useState("");
	const [isEmailError, setIsEmailError] = useState(false);
	const [emailError, setEmailError] = useState(false)
	const regexEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);


	useEffect(() => {
		if (email && !(regexEmail.test(email))) {
			setIsEmailError(true)
		} else {
			setIsEmailError(false)
		}
	}, [email, regexEmail])

	const handleForgotPassword = async (email) => {
		if (!email) {
			setEmailError(true)
		}
		forgotPassword(email)
	}

	return (
		<>
			<div className={`relative ${styles.mainPage}`}>
				<div className={styles.forgotFormDiv}>
					<h1 className={`fontBold ${styles.pageHeader}`}>نسيت كلمة السر؟</h1>
					<p className={styles.forgotPasswordPara}>ازهلها، دخل ايميلك عشان نرسلك رابط من خلاله تغير كلمة السر</p>
					<div className='formInputBox'>
						<div className='formInputIconDiv'>
							<AllIconsComponenet height={20} width={20} iconName={'email'} color={'#808080'} />
						</div>
						<input className={`formInput ${isEmailError ? `${styles.inputError}` : `${styles.formInput}`}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=' ' />
						<label className={`formLabel ${isEmailError ? `${styles.inputPlaceHoldererror}` : `${styles.formLabel}`}`} htmlFor="email">الايميل</label>
					</div>
					{emailError ?
						<p className={styles.errorText}>{inputErrorMessages.enterEmailInputErrorMsg}</p>
						:
						isEmailError && <p className={styles.errorText}>{inputErrorMessages.enterEmailCorrectInputErrorMsg}</p>}
					<button className={`primarySolidBtn ${styles.loginBtnBox}`} type='submit' onClick={() => handleForgotPassword(email)}>
						<AllIconsComponenet height={24} width={24} iconName={'goToNextArrow'} color={'#FFFFFF'} />
						<span className='pr-2'>إرسال</span>
					</button>
				</div>
			</div >
		</>
	)
}
