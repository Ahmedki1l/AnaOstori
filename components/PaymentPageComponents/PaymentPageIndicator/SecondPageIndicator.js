import React from 'react'
import styles from './PaymentPageIndicator.module.scss'

//Mi icons
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';


export default function SecondPageIndicator() {
  return (
	<div className={styles.pageTwoMainArea}>				
		<div className={`absolute ${styles.pageNoOne}`}>
			<div className={`${styles.circle} ${styles.firstPageBox}`}>
				<CheckCircleRoundedIcon className={styles.icon}/>
			</div>
			<p className={`fontRegular ${styles.pageNoHead}`}>البيانات الشخصية</p>
		</div>
		<div className={`absolute ${styles.middleLine}`}></div>
		<div className={`absolute ${styles.pageNoTwo}`}>
			<div className={`${styles.circle} ${styles.secondPage}`}>
				<p className="fontBold">2</p>
			</div>
			<p className={`fontBold ${styles.pageNoHead}`}>مراجعة الطلب والدفع</p>
		</div>
	</div>
  )
}
