import React from 'react'
import styles from './PaymentPageIndicator.module.scss'

export default function FirstPaymentPageInfo() {
  return (
	<div className={styles.pageOneMainArea}>				
		<div className={`absolute ${styles.pageNoOne}`}>
			<div className={`${styles.circle} ${styles.firstPageBox}`}>
				<p className="fontBold">1</p>
			</div>
			<p className={`fontBold ${styles.pageNoHead}`}>البيانات الشخصية</p>
		</div>
		<div className={`absolute ${styles.middleLine}`}></div>
		<div className={`absolute ${styles.pageNoTwo}`}>
			<div className={`${styles.circle} ${styles.secondPage}`}>
				<p className="fontBold">2</p>
			</div>
			<p className={`fontRegular ${styles.pageNoHead}`}>مراجعة الطلب والدفع</p>
		</div>
	</div>
  )
}
