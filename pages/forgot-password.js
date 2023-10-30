import React, { useEffect, useMemo, useState } from 'react'
import styles from '../styles/ForgotPassword.module.scss'
import { forgotPassword } from '../services/fireBaseAuthService'
import AllIconsComponenet from '../Icons/AllIconsComponenet'
import { inputErrorMessages } from '../constants/ar'

export default function ForgotPassword() {

	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState(null)
	const regexEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);


	useEffect(() => {
		if (email && !(regexEmail.test(email))) {
			setEmailError(inputErrorMessages.enterEmailCorrectInputErrorMsg)
		} else {
			setEmailError(null)
		}
	}, [email, regexEmail])

	const handleForgotPassword = async (email) => {
		if (!email) {
			setEmailError(inputErrorMessages.enterEmailInputErrorMsg)
		}
		forgotPassword(email)
	}

	return (
		<>
			<div className={`relative ${styles.mainPage}`}>
				<div className={styles.forgotFormDiv}>
					<h1 className={`fontMedium ${styles.pageHeader}`}>نسيت كلمة السر؟</h1>
					<p className={styles.forgotPasswordPara}>ازهلها، دخل ايميلك عشان نرسلك رابط من خلاله تغير كلمة السر</p>
					<div className='formInputBox'>
						<div className='formInputIconDiv'>
							<AllIconsComponenet height={20} width={20} iconName={'email'} color={'#808080'} />
						</div>
						<input className={`formInput ${styles.formInput} ${emailError && `${styles.inputError}`}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=' ' />
						<label className={`formLabel ${styles.formLabel} ${emailError && `${styles.inputPlaceHoldererror}`}`} htmlFor="email">الايميل</label>
					</div>
					{emailError && <p className={styles.errorText}>{emailError}</p>}
					<button className={`primarySolidBtn ${styles.loginBtnBox}`} type='submit' onClick={() => handleForgotPassword(email)}>
						<AllIconsComponenet height={24} width={24} iconName={'goToNextArrow'} color={'#FFFFFF'} />
						<span className='pr-2'>إرسال</span>
					</button>
				</div>
			</div >
		</>
	)
}
