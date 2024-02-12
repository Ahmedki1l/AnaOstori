import styles from '../styles/ReceiveRequest.module.scss'
import * as LinkConst from '../constants/LinkConst'
import BankDetailsCard from '../components/CommonComponents/BankDetailCard/BankDetailsCard';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AllIconsComponenet from '../Icons/AllIconsComponenet';
import * as PaymentConst from '../constants/PaymentConst'



export default function ReceiverReq() {

	const bankDetails = PaymentConst.bankDetails
	const whatsAppLink = LinkConst.WhatsApp_Link
	const router = useRouter()
	const orderId = router.query.orderId ? router.query.orderId : ''

	return (
		<div className={`maxWidthDefault ${styles.mainArea}`}>
			<div className='m-5'>
				<div className={styles.circle}>
					<AllIconsComponenet iconName={'checkCircleRoundIcon'} height={40} width={35} color={'#FFFFFF'} />
				</div>
			</div>
			<p className="head2 text-center">شكرا لك، استلمنا طلبك</p>
			<p className={` ${styles.note1}`}>لضمان حجز مقعدك، نرجو إتمام عملية التحويل خلال <span className='text-red-500 underline fontMedium'>24 ساعة كحد أقصى</span>، وهي مدة حجز مقعدك في النظام </p>
			<div className={`flex flex-wrap ${styles.bankDetailSubWrapper}`}>
				{bankDetails.map((bank, index) => {
					return (
						<div key={`bank${index}`} className={`py-4 ${styles.bankDetailsBox}`}>
							<BankDetailsCard bank={bank} index={index} />
						</div>
					)
				})}
			</div>
			<div className={styles.noteDiv}>
				<p className={`fontBold ${styles.listHead}`}>تستطيع إرفاق إيصال الحوالة البنكية وتأكيد حجزك عن طريق:</p>
				<ul>
					<li className={styles.listNote}> - صفحة استعلام وتأكيد الحجوزات </li>
					<li className={styles.listNote}> - أو من خلال الرابط اللي بنرسل لك اياه بالواتساب والايميل</li>
				</ul>
			</div>
			<div className={styles.btnsBox}>
				<div className={`${styles.btnBox} ${styles.downloadInvoicBtnBox}`}>
					<Link className='no-underline' href={{ pathname: '/uploadInvoice', query: { orderId: orderId } }}>
						<button className='primarySolidBtn'>تأكيد التحويل البنكي الآن </button>
					</Link>
				</div>
				<div className={styles.btnBox}>
					<Link className='no-underline' href={whatsAppLink} target='_blank'>
						<button className='primaryStrockedBtn'>طلب مساعدة الدعم الفني </button>
					</Link>
				</div>
			</div>
		</div>
	)
}
