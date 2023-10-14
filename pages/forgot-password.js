import Image from 'next/legacy/image'
import React, { useEffect, useMemo, useState } from 'react'
import Icon from '../components/CommonComponents/Icon'
import styles from '../styles/ForgotPassword.module.scss'
import { forgotPassword } from '../services/fireBaseAuthService'
import AllIconsComponenet from '../Icons/AllIconsComponenet'

export default function ForgotPassword() {


	const [email, setEmail] = useState("");


	const [isEmailError, setIsEmailError] = useState(false);


	const regexEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);


	useEffect(() => {

		if (email && !(regexEmail.test(email))) {
			setIsEmailError(true)
		}
		else {
			setIsEmailError(false)
		}

	}, [email, regexEmail])



	return (
		<>
			<div className={`relative ${styles.mainPage}`}>
				<div className={styles.forgotFormDiv}>
					<h1 className={`fontBold ${styles.pageHeader}`}>نسيت كلمة السر؟</h1>
					<p className={styles.forgotPasswordPara}>راح نرسل رابط تغيير كلمة السر على ايميلك</p>
					<div className='formInputBox'>
						<div className='formInputIconDiv'>
							<AllIconsComponenet height={16} width={16} iconName={'email'} color={'#808080'} />
						</div>
						<input className={`formInput ${styles.formInput}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=' ' />
						<label className={`formLabel ${styles.formLabel}`} htmlFor="email">الايميل</label>
					</div>
					{isEmailError && <p className={styles.errorText}>Email is not valid</p>}

					<div className={styles.loginBtnBox}>
						<button className='primarySolidBtn' type='submit' disabled={!email || isEmailError ? true : false} onClick={() => forgotPassword(email)}>إرسال</button>
					</div>
				</div>
			</div>
		</>
	)
}
