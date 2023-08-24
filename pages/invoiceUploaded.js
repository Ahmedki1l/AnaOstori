import React from 'react'
import styles from '../styles/InvoiceUploaded.module.scss'
import Link from 'next/link';
import AllIconsComponenet from '../Icons/AllIconsComponenet';
import * as linkConst from '../constants/LinkConst';


export async function getServerSideProps({ req, res, resolvedUrl }) {

	if (!resolvedUrl?.includes('=')) {
		return {
			notFound: true,
		};
	}

	const Inquiry = resolvedUrl.split('=')[1].slice(3)

	return {
		props: {
			Inquiry
		}
	}
}


export default function InvoiceUploaded(props) {
	const Inquiry = props.Inquiry
	return (
		<div className={`maxWidthDefault ${styles.mainArea}`}>
			<div className='m-5'>
				<div className={styles.circle}>
					<AllIconsComponenet iconName={'checkCircleRoundIcon'} height={40} width={35} color={'#FFFFFF'} />
				</div>
			</div>
			<h1 className={`head1 ${styles.pageHeader}`}>استلمنا إيصالك</h1>
			<p className={`fontMedium ${styles.note1}`}>راح نراجع إيصال الحوالة، وبيتواصل معك فريق الدعم على الواتساب لتأكيد الحجز وتحديث حالة الطلب بمدة  <span className='fontBold'> أقصاها 24</span>  <span className='fontBold'>ساعة</span> ،</p>
			<p className={`fontMedium ${styles.note1}`}>إذا احتجت مساعدة تواصل معنا على  <Link href={`${linkConst.WhatsApp_Link}`} target='_blank' className='link'> الواتساب</Link>  وتقدر تشوف حالة طلبك من<Link href={'/search'} className='link'> صفحة استعلام المشتريات</Link></p>
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
