import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Courses.module.scss';
import CoverImg from '../CommonComponents/CoverImg';
import Icon from '../CommonComponents/Icon';
import Link from 'next/link';
import useWindowSize from '../../hooks/useWindoSize';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import { mediaUrl } from '../../constants/DataManupulation';


export default function PhysicalCourseCard(props) {

	const courseDetail = props.courseDetails
	const isEdit = props.isEdit
	const lang = courseDetail.language
	const groupDiscountEligible = courseDetail?.groupDiscountEligible
	const catagoryName = props.catagoryName ? props.catagoryName : ""
	const [discountShow, setDiscountShow] = useState(false)
	const router = useRouter();

	const handleNavigation = (catagoryName, courseDetail) => {
		if (isEdit == true) return
		if (courseDetail.isEnrolled) {
			router.push(`/myCourse/${courseDetail.id}/`)
		} else {
			router.push(`/${courseDetail.name.replace(/ /g, "-")}/${catagoryName.replace(/ /g, "-")}`)
		}
	}
	const oneUserPrice = courseDetail?.price

	const isSmallScreen = useWindowSize().smallScreen

	console.log(courseDetail);

	return (
		<div className={`${lang == 'en' ? `${styles.rightSide}` : `${styles.leftSide}`}`}>
			<div className={styles.typeOfCourseCardWrapper}>
				{!courseDetail.isPurchasable && <div className={styles.notAllowedWrapper}><div className={styles.notAllowedIconWrapper}></div></div>}
				<div className='cursor-pointer' onClick={() => handleNavigation(catagoryName, courseDetail)}>
					<CoverImg height={215} url={courseDetail.pictureKey ? mediaUrl(courseDetail.pictureBucket, courseDetail.pictureKey) : '/images/anaOstori.png'} />
				</div>
				<div className={styles.detailsBox}>
					<h1 className='head2 text-center'>{courseDetail.name}</h1>
					<p className={styles.courseDetailText}>{courseDetail.cardDescription}</p>
					<ul className={styles.descriptionList}>
						{courseDetail.CourseCardMetaData?.map((metaData, index) => {
							return (
								<li key={`courseCare${index}`}>
									<div>
										<Icon height={isSmallScreen ? 18 : 21} width={isSmallScreen ? 18 : 21} iconName={metaData.icon} alt={'Card Meta Data Icon'} />
									</div>
									<div className='flex'>
										<p className='pr-2'>
											{metaData?.link ?
												<Link href={`${metaData.link}` ?? ""} className={`link ${styles.listItemText}`} target='_blank'>{metaData.text}</Link>
												: (metaData.tailLinkName && metaData.tailLink) ?
													<span className={styles.listItemText}>{metaData.text} <Link href={metaData.tailLink}>{metaData.tailLinkName}</Link> </span>
													:
													<span className={styles.listItemText}>{metaData.text}</span>
											}
											<span className={styles.grayText}>{metaData.grayedText ? `(${metaData.grayedText})` : ''}</span>
										</p>
									</div>
								</li>
							)
						})}
					</ul>
					<div className={styles.priceBoxWrapper}>
						<div style={{ height: '0.3px' }}>
							<div className={styles.separateLine}></div>
						</div>
						{(courseDetail.discount == null || courseDetail.discount == courseDetail.price) ?
							<div>
								<p className={`fontBold pt-4 px-3 ${styles.detailHeadText}`}>{lang == 'en' ? 'Prices includes VAT' : 'الأسعار شاملة الضريبة'}</p>
								<div className={styles.onePersonPriceBox}>
									<p className={` ${styles.detailText}`}>{lang == 'en' ? '1 Student' : 'للشخص الواحد'}</p>
									<p className={`fontBold ${styles.price}`}>{oneUserPrice} {lang == 'en' ? 'SAR' : 'ر.س'} </p>
								</div>
							</div>
							:
							<div className='pt-4 pr-4'>
								<div className='flex'>
									<p className={styles.MainDisHead}>الآن بـ <span className={`head2 ${styles.basePrice}`}>{courseDetail.discount} ر.س</span></p>
									<p className={styles.percentageBox}>خصم {(100 - ((courseDetail.discount / courseDetail.price) * 100)).toFixed(2)} % </p>
								</div>
								<div className='flex'>
									<p className={styles.oldPrice}> {lang == 'en' ? 'previously' : 'سابقًا'}   {courseDetail.price} {lang == 'en' ? 'SAR' : 'ر.س'}</p>
								</div>
							</div>
						}
						{(courseDetail.type != "on-demand" && groupDiscountEligible) && <>
							<div>
								<div className={`flex items-center cursor-pointer select-none ${styles.hidePriceBox}`} onClick={() => { setDiscountShow(!discountShow) }}>
									<div style={{ height: '18px' }}>
										<div className={discountShow == true ? `${styles.rotateArrow}` : ''}>
											<AllIconsComponenet iconName={'keyBoardDownIcon'} height={18} width={30} color={'#3B9100'} />
										</div>
									</div>
									<p className={styles.detailText}>{!discountShow ? (lang == 'en' ? 'Show group discount' : 'عرض خصم المجموعات') : (lang == 'en' ? 'Hide group discount ' : 'إخفاء خصم المجموعات')}</p>
								</div>
							</div>
							{discountShow &&
								<>
									<div className={styles.twoPersonPriceBox}>
										<div>
											<p className={styles.detailText}>{lang == 'en' ? '2 Students' : 'للشخصين'}</p>
										</div>
										<div style={{ textAlign: 'end' }}>
											<p className={`fontBold ${styles.price}`}>{courseDetail.discountForTwo} ر.س</p>
											<p className={` ${styles.eachPersonDetailText}`}>على كل شخص</p>
										</div>
									</div>
									<div className={styles.twoPersonPriceBox}>
										<div>
											<p className={styles.detailText}>{lang == 'en' ? '3 Students or more' : '3 أشخاص أو أكثر'}</p>
										</div>
										<div style={{ textAlign: 'end' }}>
											<p className={`fontBold ${styles.price}`}>{courseDetail.discountForThreeOrMore} {lang == 'en' ? 'SAR' : 'ر.س'} </p>
											<p className={` ${styles.eachPersonDetailText}`}>{lang == 'en' ? 'for each student' : 'على كل شخص'}</p>
										</div>
									</div>
								</>
							}
						</>}
						<div className={styles.btnBox}>
							<button className='primaryStrockedBtn' onClick={() => handleNavigation(catagoryName, courseDetail)}>{lang == 'en' ? 'View course details' : 'قراءة تفاصيل الدورة'}</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
