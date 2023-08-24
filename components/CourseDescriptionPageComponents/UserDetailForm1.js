import styles from './userDetailForm1.module.scss'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Icon from '../CommonComponents/Icon'
import { useDispatch, useSelector } from 'react-redux';
import { subcribeNotificationAPI } from '../../services/apisService';
import { signOutUser } from '../../services/fireBaseAuthService';
import { toastErrorMessage } from '../../constants/ar';




export default function UserDetailForm1(props) {
	const storeData = useSelector((state) => state?.globalStore);
	const dispatch = useDispatch();
	const courseDetailId = props?.courseDetailId
	const [isUserAgree, setIsUserAgree] = useState(false)
	const [notificationScreen, setNotificationScreen] = useState(false)
	const router = useRouter()
	const isSubscribed = props.isSubscribed
	const isUserLogin = storeData?.accessToken
	const lang = props.lang

	const hendleChange = (event) => {
		setIsUserAgree(event.target.checked)
	}
	const submitUserData = async (gender) => {
		const params = {
			courseId: courseDetailId,
			data: {
				type: gender
			}
		}
		await subcribeNotificationAPI(params).then((res) => {
			toast.success(toastErrorMessage.seatsAvailableMsg)
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
					<h1 className={`fontBold ${styles.formHead}`}>{lang == 'en' ? 'All seats are booked' : `انحجزت جميع المقاعد`}</h1>
					<p className={styles.formDiscription}>{lang == 'en' ? 'Kindly login and enable the notification so we can notify you once we update or expand more seats in the course ' : 'سجل دخولك وفعل خاصية التنبيه عشان نعلمك اول ما نوسع او نضيف مقاعد جديدة بالدورة'}</p>
					<div className='flex space-between'>
						<div className={styles.btnBox1}>
							<button className='primaryStrockedBtn' onClick={() => router.push("/login")}>{lang == 'en' ? 'Login' : 'تسجيل الدخول'}</button>
						</div>
						<div className={styles.btnBox1}>
							<button className='primaryStrockedBtn' onClick={() => router.push("/register")}>{lang == 'en' ? 'Create Account' : 'إنشاء حساب'}</button>
						</div>
					</div>
				</div>
				: (!notificationScreen && isSubscribed) ?
					<div className={styles.noDateFormWrapper}>
						<div className={styles.iconDiv}>
							<Icon height={46} width={46} iconName={'saluteEmoji'} alt={'Emoji Icon'} />
						</div>
						<p className={`fontBold ${styles.formHead}`}>{lang == 'en' ? 'Done' : props.gender == 'female' ? 'ابشري' : 'ابشر'}</p>
						<p className={styles.formDiscription}>{lang == 'en' ? 'We will notify you when we have any update' : `رح نعلمك بإذن الله اول ما يحصل جديد`}</p>
						<div className={styles.btnBox}>
							<button className='primaryStrockedBtn' onClick={() => { router.push('/') }}>{lang == 'en' ? 'Back to home screen' : `الرجوع إلى الصفحة الرئيسية`}</button>
						</div>
					</div>
					:
					<div className={styles.noDateFormWrapper}>
						<h1 className={`fontBold ${styles.formHead}`}>{lang == 'en' ? 'All seats are booked' : `انحجزت جميع المقاعد`}</h1>
						<p className={styles.formDiscription}>{lang == 'en' ? 'You want to be notified in case we added or expand more seats?' : `تبي نعلمك إذا وسعنا او ضفنا مقاعد جديدة للدورة؟`}</p>
						<div className='checkBoxDiv py-2 md:px-4 px-2'>
							<input type='checkbox' name='agree' onChange={(event) => { hendleChange(event) }} />
							<p className={styles.checkBoxText}>{lang == 'en' ? 'I want to know about discounts and offers' : `حاب اعرف كمان عن العروض والخصومات`}</p>
						</div>
						<div className={styles.btnBox}>
							<button className='primaryStrockedBtn' onClick={() => submitUserData(props.gender)}>{lang == 'en' ? 'Yes, Notify me' : `اي، علموني إذا وسعتو المقاعد`}</button>
						</div>
					</div>
			}
		</>

	)
}
