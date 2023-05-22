import Image from 'next/legacy/image'
import Link from 'next/link'
import React from 'react'
import styles from '../styles/ErrorPage.module.scss'


export default function Custom505() {
	return (
		<div className={`maxWidthDefault ${styles.errorpageWrapper}`}>
			<div className={styles.pageImageDiv}>
				<Image src={`/images/404Image.svg`} alt={'Error page Image'} layout="fill" objectFit="cover" priority />
			</div>
			<p className={`font-bold ${styles.pageHead}`}>الصفحة غير متوفرة</p>
			<p className={styles.subTitle}>فضلا تأكد من رابط الصفحة، ممكن الرابط يكون غير صحيح او الصفحة انحذفت</p>
			<div className={styles.btnsBox}>
				<div className={`${styles.btnBox} ${styles.downloadInvoicBtnBox}`}>
					<Link href={'/'} className='no-underline'>
						<button className='primarySolidBtn'>تصفح الدورات </button>
					</Link>
				</div>
				<div className={styles.btnBox}>
					<Link href={'/?دوراتنا'} target='_blank' className='no-underline'>
						<button className='primaryStrockedBtn'>الرجوع للصفحة الرئيسية </button>
					</Link>
				</div>
			</div>
		</div>
	)
}