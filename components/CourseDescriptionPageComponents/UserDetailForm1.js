import styles from './userDetailForm1.module.scss'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Icon from '../CommonComponents/Icon'
import { useSelector } from 'react-redux';
import { postAuthRouteAPI } from '../../services/apisService';
import { toastErrorMessage } from '../../constants/ar';
import { toast } from 'react-toastify';




export default function UserDetailForm1(props) {
	const storeData = useSelector((state) => state?.globalStore);
	const courseDetailId = props?.courseDetailId
	const router = useRouter()
	const [isSubscribed, setIsSubscribed] = useState(props.isSubscribed)
	const isUserLogin = storeData?.accessToken
	const lang = props.lang

	const submitUserData = async (gender) => {
		const params = {
			routeName: 'subscribe',
			courseId: courseDetailId,
			type: gender
		}
		await postAuthRouteAPI(params).then((res) => {
			toast.success(toastErrorMessage.seatsAvailableMsg, { rtl: true, })
			setIsSubscribed(true)
		}).catch(async (error) => {
			console.log(error);
			if (error?.response?.status == 401) {
				await getNewToken().then(async (token) => {
					await postAuthRouteAPI(params).then((res) => {
						toast.success(toastErrorMessage.seatsAvailableMsg, { rtl: true, })
						setIsSubscribed(true)
					}).catch((error) => {
						console.log(error);
					})
				})
			}
		})
	}
	return (
		<>
			{!isUserLogin ?
				<div className={styles.noDateFormWrapper}>
					<h1 className={`fontBold ${styles.formHead}`}>{lang == 'en' ? 'All seats are booked' : 'كل المواعيد محجوزة'}</h1>
					<p className={styles.formDiscription}>{lang == 'en' ? 'Kindly login and enable the notification so we can notify you once we update or expand more seats in the course ' : 'سجل دخولك وفعل خاصية التنبيه عشان ننبهك أول ما نوسع أو نضيف مواعيد جديدة'}</p>
					<div>
						<div className={`mb-3 ${styles.btnBox1}`}>
							<button className='primaryStrockedBtn' onClick={() => router.push("/register")}>{lang == 'en' ? 'Create Account' : 'إنشاء حساب'}</button>
						</div>
						<div className={styles.btnBox1}>
							<button className='primaryStrockedBtn' onClick={() => router.push("/login")}>{lang == 'en' ? 'Login' : 'تسجيل الدخول'}</button>
						</div>
					</div>
				</div>
				:
				(isSubscribed) ?
					<div className={styles.noDateFormWrapper}>
						<div className={styles.iconDiv}>
							<Icon height={46} width={46} iconName={'saluteEmoji'} alt={'Emoji Icon'} />
						</div>
						<p className={`fontBold ${styles.formHead}`}>{lang == 'en' ? 'Done' : 'ابشر'}</p>
						<p className={styles.formDiscription}>{lang == 'en' ? 'We will notify you when we have any update' : 'بإذن الله راح يجيك اشعار أول ما يصير جديد'}</p>
						<div className={styles.btnBox1}>
							<button className='primarySolidBtn' onClick={() => { router.push('/') }}>{lang == 'en' ? 'Back to home screen' : 'برجع لصفحة الرئيسية'}</button>
						</div>
					</div>
					:
					<div className={styles.noDateFormWrapper}>
						<h1 className={`fontBold ${styles.formHead}`}>{lang == 'en' ? 'All seats are booked' : 'كل المواعيد محجوزة 🏎'}</h1>
						<p className={styles.formDiscription}>{lang == 'en' ? 'You want to be notified in case we added or expand more seats?' : 'تبي ننبهك إذا وسعنا أو أضفنا مواعيد جديدة؟'}</p>
						<div className={styles.btnBox1}>
							<button className='primarySolidBtn' onClick={() => submitUserData(props.gender)}>{lang == 'en' ? 'Yes, Notify me' : 'اي، نبهني'}</button>
						</div>
					</div>
			}
		</>
	)
}
