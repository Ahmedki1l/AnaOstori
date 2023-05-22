import styles from './userDetailForm1.module.scss'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Icon from '../CommonComponents/Icon'
import { useDispatch, useSelector } from 'react-redux';
import { subcribeNotificationAPI } from '../../services/apisService';
import { signOutUser } from '../../services/fireBaseAuthService';




export default function UserDetailForm1(props) {
	const storeData = useSelector((state) => state?.globalStore);
	const dispatch = useDispatch();
	const courseDetailId = props?.courseDetailId
	const [isUserAgree, setIsUserAgree] = useState(false)
	const [notificationScreen, setNotificationScreen] = useState(false)
	const router = useRouter()
	const isSubscribed = props.isSubscribed
	const isUserLogin = storeData?.accessToken

	const hendleChange = (event) => {
		setIsUserAgree(event.target.checked)
	}
	const submitUserData = async (gender) => {
		const params = {
			courseId: courseDetailId,
			accessToken: storeData?.accessToken,
			data: {
				type: gender
			}
		}
		await subcribeNotificationAPI(params).then((res) => {
			setNotificationScreen(true)
		}).catch((error) => {
			console.log(error);
			if (error?.response?.status == 401) {
				signOutUser()
				dispatch({
					type: 'EMPTY_STORE'
				});
			}
		})
	}


	return (
		<>
			{!isUserLogin ?
				<div className={styles.noDateFormWrapper}>
					<p className={`fontBold ${styles.formHead}`}>انحجزت جميع المقاعد</p>
					<p className={styles.formDiscription}>سجل دخولك وفعل خاصية التنبيه عشان نعلمك اول ما نوسع او نضيف مقاعد جديدة بالدورة</p>
					<div className='flex space-between'>
						<div className={styles.btnBox1}>
							<button className='primaryStrockedBtn' onClick={() => router.push("/login")}>تسجيل الدخول</button>
						</div>
						<div className={styles.btnBox1}>
							<button className='primaryStrockedBtn' onClick={() => router.push("/register")}>إنشاء حساب</button>
						</div>
					</div>
				</div>
				: (!notificationScreen && isSubscribed) ?
					<div className={styles.noDateFormWrapper}>
						<div className={styles.iconDiv}>
							<Icon height={46} width={46} iconName={'saluteEmoji'} alt={'Emoji Icon'} />
						</div>
						<p className={`fontBold ${styles.formHead}`}>{props.gender == 'female' ? 'ابشري' : 'ابشر'}</p>
						<p className={styles.formDiscription}>رح نعلمك بإذن الله اول ما يحصل جديد</p>
						<div className={styles.btnBox}>
							<button className='primaryStrockedBtn' onClick={() => { router.push('/') }}>الرجوع إلى الصفحة الرئيسية</button>
						</div>
					</div>
					:
					<div className={styles.noDateFormWrapper}>
						<p className={`fontBold ${styles.formHead}`}>انحجزت جميع المقاعد</p>
						<p className={styles.formDiscription}>تبي نعلمك إذا وسعنا او ضفنا مقاعد جديدة للدورة؟</p>
						<div className='checkBoxDiv py-2 md:px-4 px-2'>
							<input type='checkbox' name='agree' onChange={(event) => { hendleChange(event) }} />
							<p className={styles.checkBoxText}>حاب اعرف كمان عن العروض والخصومات</p>
						</div>
						<div className={styles.btnBox}>
							<button className='primaryStrockedBtn' onClick={() => submitUserData(props.gender)}>اي، علموني إذا وسعتو المقاعد</button>
						</div>
					</div>
			}
		</>

	)
}
