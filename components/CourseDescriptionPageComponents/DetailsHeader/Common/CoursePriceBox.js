import React, { useState } from 'react'
import styles from './CoursePriceBox.module.scss'
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet';


export default function CoursePriceBox(props) {
	const lang = props.lang
	const courseDetail = props?.courseDetail
	const groupDiscountEligible = courseDetail?.groupDiscountEligible

	return (
		<div className='pt-2'>
			{courseDetail.discount == null ?
				<div className={`py-4 ${styles.basePriceBox}`}>
					{lang == 'en' ?
						<p className={`fontMedium ${styles.basePriceHead}`}>Course Price</p>
						:
						<p className={`fontMedium ${styles.basePriceHead}`}>سعر الدورة</p>
					}
					<p className={`head2 ${styles.basePrice}`}>{courseDetail.price} {lang == 'en' ? 'SAR' : 'ر.س'}</p>
				</div>
				:
				<div>
					<div className='flex'>
						{lang == 'en' ?
							<p className={styles.MainDisHead}>Now <span className={`head2 ${styles.basePrice}`}>{courseDetail.discount} SAR</span></p>
							:
							<p className={styles.MainDisHead}>الآن بـ <span className={`head2 ${styles.basePrice}`}>{courseDetail.discount} ر.س</span></p>
						}
						{lang == 'en' ?
							<p className={styles.percentageBox}> {(100 - ((courseDetail.discount / courseDetail.price) * 100)).toFixed(2)} % Discount</p>
							:
							<p className={styles.percentageBox}>خصم {(100 - ((courseDetail.discount / courseDetail.price) * 100)).toFixed(2)} % </p>
						}
					</div>
					<div className='flex'>
						{lang == 'en' ?
							<p className={styles.oldPrice}>Previously {courseDetail.price} SAR</p>
							:
							<p className={styles.oldPrice}>سابقًا {courseDetail.price} ر.س</p>
						}
					</div>
				</div>
			}
			{groupDiscountEligible && <>
				<div className='flex justify-between pb-4'>
					<p className={`fontMedium ${styles.subText}`}>{lang == 'en' ? "SPECIAL PRICE FOR GROUPS" : `*نوفر سعر خاص للمجموعات`}</p>
					<div className={` flex items-center cursor-pointer select-none `} onClick={() => { props.setDiscountShow(!props.discountShow) }}>
						<div className={` ${styles.arrowIcon} ${props.discountShow == true ? 'rotate-180' : ''}`}>
							<AllIconsComponenet iconName={'keyBoardDownIcon'} height={18} width={30} color={'#00A3FF'} />
						</div>
						{lang == 'en' ?
							<p className={styles.seemoreText}>{props.discountShow == true ? 'Hide prices' : 'Show prices'}</p>
							:
							<p className={styles.seemoreText}>{props.discountShow == true ? 'إخفاء الأسعار' : 'إظهار الأسعار'}</p>
						}
					</div>
				</div>
				{props.discountShow && <>
					<div className={`flex justify-between pb-4 ${styles.discountPriceBox}`}>
						<div>
							{lang == 'en' ?
								<>
									<p className={`fontBold ${styles.noOfUserText}`}>2 Users </p>
									<p className={`text-slate-500 ${styles.noOfUserSubText}`}>{courseDetail.discountForTwo} SAR per user</p>
								</>
								:
								<>
									<p className={`fontBold ${styles.noOfUserText}`}>شخصين</p>
									<p className={`text-slate-500 ${styles.noOfUserSubText}`}>{courseDetail.discountForTwo} ر.س على كل شخص</p>
								</>
							}
						</div>
						<div>
							{lang == 'en' ?
								<>
									<p className={`fontBold ${styles.discountPrice}`}>{courseDetail.discountForTwo * 2} SAR</p>
									<p className={`fontMedium text-center text-red-500 ${styles.discountPercentege}`}>Save {((courseDetail.price * 2) - (courseDetail.discountForTwo * 2))} SAR</p>
								</>
								:
								<>
									<p className={`fontBold ${styles.discountPrice}`}>{courseDetail.discountForTwo * 2} ر.س</p>
									{/* <p className={`fontMedium text-center text-red-500 ${styles.discountPercentege}`}>وفر {(100 - ((courseDetail.discountForTwo / courseDetail.price) * 100)).toFixed(2)} %</p> */}
									<p className={`fontMedium text-center text-red-500 ${styles.discountPercentege}`}>وفر {((courseDetail.price * 2) - (courseDetail.discountForTwo * 2))} ر.س</p>
								</>
							}
						</div>
					</div>
					<div className={`flex justify-between pb-4 ${styles.discountPriceBox}`}>
						<div>
							{lang == 'en' ?
								<>
									<p className={`fontBold ${styles.noOfUserText}`}>3 Users or more </p>
									<p className={`text-slate-500 ${styles.noOfUserSubText}`}>{courseDetail.discountForThreeOrMore}  SAR per user</p>
								</>
								:
								<>
									<p className={`fontBold ${styles.noOfUserText}`}>3 أشخاص أو أكثر</p>
									<p className={`text-slate-500 ${styles.noOfUserSubText}`}>{courseDetail.discountForThreeOrMore} ر.س على كل شخص</p>
								</>
							}
						</div>
						<div>
							{lang == 'en' ?
								<>
									<p className={`fontBold ${styles.discountPrice}`}>Customized</p>
									{/* <p className={`fontMedium text-center text-red-500 ${styles.discountPercentege}`}>Save {(100 - ((courseDetail.discountForThreeOrMore / courseDetail.price) * 100)).toFixed(2)} %</p> */}
								</>
								:
								<>
									<p className={`fontBold ${styles.discountPrice}`}>حسب العدد</p>
									{/* <p className={`fontMedium text-center text-red-500 ${styles.discountPercentege}`}>وفر {(100 - ((courseDetail.discountForThreeOrMore / courseDetail.price) * 100)).toFixed(2)} %</p> */}
								</>
							}
						</div>
					</div>
				</>}
			</>}
			<div className={styles.btnBox}>
				<button className={`primarySolidBtn ${styles.firstBtn}`} onClick={() => props.handleBookSitButtonClick()}>{props.bookSeatButtonText}</button>
			</div>
		</div>
	)
}
