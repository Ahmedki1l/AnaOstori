import React from 'react'
import styles from '../styles/InvoiceUploaded.module.scss'

// MI icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';

export async function getServerSideProps({ req, res, resolvedUrl }){

	if(!resolvedUrl?.includes('=')){
		return {
			notFound: true,
		};
	}

	const Inquiry = resolvedUrl.split('=')[1].slice(3)
	
	return {
		props:{
			Inquiry
		}
	}
}


export default function InvoiceUploaded(props) {
	const Inquiry=props.Inquiry
	return (
		<div className={`maxWidthDefault ${styles.mainArea}`}>
			<CheckCircleIcon className={styles.checkIcon} />
			<h1 className={`head1 ${styles.pageHeader}`}>استلمنا إيصالك</h1>
			<p className={`fontMedium ${styles.note1}`}>راح نراجع إيصال الحوالة، وبيتواصل معك فريق الدعم على الواتساب لتأكيد الحجز وتحديث حالة الطلب بمدة أقصاها <span className='fontBold'>24</span>  <span className='fontBold'>ساعة</span> ،</p>
			<p className={`fontMedium ${styles.note1}`}>إذا احتجت مساعدة تواصل معنا على الواتساب وتقدر تشوف حالة طلبك من صفحة استعلام وتأكيد الحجوزات</p>
			<div className={styles.btnsBox}>
				<div className={`${styles.btnBox} ${styles.downloadInvoicBtnBox}`}>
					<Link href={`/search?Inquiry=${Inquiry}` ?? ""} className='no-underline'>
						<button className='primarySolidBtn flex justify-center items-center'> استعلام وتأكيد الحجوزات </button>
					</Link>
				</div>
				<div className={styles.btnBox}>
					<button className='primaryStrockedBtn'>طلب مساعدة واتساب</button>
				</div>
			</div>
		</div>
	)
}
    