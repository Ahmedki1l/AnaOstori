import React, { useState } from 'react'
import styles from './CoursePriceBox.module.scss'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


export default function CoursePriceBox(props) {

	const courseDetail = props?.courseDetail
	const [discountShow, setDiscountShow] = useState(false)
	const groupDiscountEligible = courseDetail?.groupDiscountEligible

  return (
	<div className='pt-2'>
		{courseDetail.discount == null ? 
			<div className={`py-4 ${styles.basePriceBox}`}>
				<p className={`fontMedium ${styles.basePriceHead}`}>سعر الدورة</p>
				<p className={`head2 ${styles.basePrice}`}>{courseDetail.price} ر.س</p>
			</div>
		  :
			<div>
				<div className='flex'>
					<p className={styles.MainDisHead}>الآن بـ <span className={`head2 ${styles.basePrice}`}>{courseDetail.discount} ر.س</span></p>
					<p className={styles.percentageBox}>خصم {(100 - ((courseDetail.discount/courseDetail.price)*100)).toFixed(2)} % </p>
				</div>
				<div className='flex'>
					<p className={styles.oldPrice}>سابقًا {courseDetail.price} ر.س</p>
				</div>
			</div>
		}
		{groupDiscountEligible &&<>
			<div className='flex justify-between pb-4'>
				<p className={`fontMedium ${styles.subText}`}>*نوفر سعر خاص للمجموعات</p>
				<div className='flex items-center cursor-pointer select-none' onClick={()=>{setDiscountShow(!discountShow)}}>
					<KeyboardArrowDownIcon className={`${styles.arrowIcon} ${discountShow==true?'rotate-180':''}`}/>
					<p className={styles.seemoreText}>{discountShow==true?'إخفاء الأسعار':'إظهار الأسعار'}</p>
				</div>
			</div>
			{discountShow && <>
				<div className={`flex justify-between pb-4 ${styles.discountPriceBox}`}>
					<div>
						<p className={`fontBold ${styles.noOfUserText}`}>شخصين</p>
						<p className={`text-slate-500 ${styles.noOfUserSubText}`}>{courseDetail.discountForTwo} ر.س على كل شخص</p>
					</div>
					<div>
						<p className={`fontBold ${styles.discountPrice}`}>{courseDetail.discountForTwo*2} ر.س</p>
						<p className={`fontMedium text-center text-red-500 ${styles.discountPercentege}`}>وفر {(100 - ((courseDetail.discountForTwo/courseDetail.price)*100)).toFixed(2)} %</p>
					</div>
				</div>
				<div className={`flex justify-between pb-4 ${styles.discountPriceBox}`}>
					<div>
						<p className={`fontBold ${styles.noOfUserText}`}>3 أشخاص أو أكثر</p>
						<p className={`text-slate-500 ${styles.noOfUserSubText}`}>{courseDetail.discountForThreeOrMore} ر.س على كل شخص</p>
					</div>
					<div>
						<p className={`fontBold ${styles.discountPrice}`}>مخصص</p>
						<p className={`fontMedium text-center text-red-500 ${styles.discountPercentege}`}>وفر {(100 - ((courseDetail.discountForThreeOrMore/courseDetail.price)*100)).toFixed(2)} %</p>
					</div>
				</div>
			</>}
		</>}
		<div className={styles.btnBox}>
			<button className={`primarySolidBtn ${styles.firstBtn}`} onClick={()=>props.handleBookSitButtonClick()}>{props.bookSeatButtonText}</button>
		</div>
	</div>
  )
}
