import React from 'react'
import styles from './PaymentPageIndicator.module.scss'

export default function FirstPaymentPageInfo() {
	return (
		<div className={styles.pageOneMainArea}>
			<div className={`absolute ${styles.pageNoOne}`}>
				<div className={`${styles.circle} ${styles.firstPageBox}`}>
				</div>
				<p className={`fontMedium ${styles.pageNoHead}`}>البيانات الشخصية</p>
			</div>
			<div className={`absolute ${styles.middleLine}`}></div>
			<div className={`absolute ${styles.pageNoTwo}`}>
				<div className={`${styles.circle} ${styles.secondPage}`}>
				</div>
				<p className={`fontMedium ${styles.pageNoHead}`}>مراجعة الطلب والدفع</p>
			</div>
		</div>
	)
}
