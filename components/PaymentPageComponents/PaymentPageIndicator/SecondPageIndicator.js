import React from 'react'
import styles from './PaymentPageIndicator.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';



export default function SecondPageIndicator() {
	return (
		<div className={styles.pageTwoMainArea}>
			<div className={`absolute ${styles.pageNoOne}`}>
				<div className={`${styles.circle} ${styles.firstPageBox}`}>
					<AllIconsComponenet iconName={'checkCircleRoundIcon'} height={40} width={30} color={'#00B564'} />
				</div>
				<p className={`fontMedium ${styles.pageNoHead}`}>البيانات الشخصية</p>
			</div>
			<div className={`absolute ${styles.middleLine}`}></div>
			<div className={`absolute ${styles.pageNoTwo}`}>
				<div className={`${styles.circle} ${styles.secondPage}`}>
					<p className="fontBold">2</p>
				</div>
				<p className={`fontMedium ${styles.pageNoHead}`}>مراجعة الطلب والدفع</p>
			</div>
		</div>
	)
}
