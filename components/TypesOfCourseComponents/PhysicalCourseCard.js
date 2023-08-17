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



	return (
		<div className={styles.typeOfCourseCardWrapper}>
			<div className='cursor-pointer' onClick={() => handleNavigation(catagoryName, courseDetail)}>
				<CoverImg height={215} url={courseDetail.pictureKey ? mediaUrl(courseDetail.pictureBucket, courseDetail.pictureKey) : '/images/anaOstori.png'} />
			</div>
			<div className={styles.detailsBox}>
				{/* <div style={{ maxHeight: '205px', overflow: 'auto' }}> */}
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
										{metaData.link ?
											<Link href={`${metaData.link}` ?? ""} className={`link ${styles.listItemText}`} target='_blank'>{metaData.text}</Link>
											: metaData.tailLinkName ?
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
				{/* </div> */}
				<div className={styles.priceBoxWrapper}>
					{courseDetail.discount == null ?
						<div>
							<p className={`fontBold pt-4 pr-3 ${styles.detailText}`}>الأسعار شاملة الضريبة</p>
							<div className={styles.onePersonPriceBox}>
								<p className={` ${styles.onePersonDetailText}`}>للشخص الواحد</p>
								<p className={`fontBold ${styles.price}`}>{oneUserPrice} ر.س</p>
							</div>
						</div>
						:
						<div className='pt-4 pr-4'>
							<div className='flex'>
								<p className={styles.MainDisHead}>الآن بـ <span className={`head2 ${styles.basePrice}`}>{courseDetail.discount} ر.س</span></p>
								<p className={styles.percentageBox}>خصم {(100 - ((courseDetail.discount / courseDetail.price) * 100)).toFixed(2)} % </p>
							</div>
							<div className='flex'>
								<p className={styles.oldPrice}>سابقًا {courseDetail.price} ر.س</p>
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
								<p className={styles.detailText}>{discountShow ? 'إخفاء خصم المجموعات' : 'عرض خصم المجموعات'}</p>
							</div>
						</div>
						{discountShow &&
							<>
								<div className={styles.twoPersonPriceBox}>
									<div>
										<p className={styles.detailText}>للشخصين</p>
									</div>
									<div style={{ textAlign: 'end' }}>
										<p className={`fontBold ${styles.price}`}>{courseDetail.discountForTwo} ر.س</p>
										<p className={` ${styles.eachPersonDetailText}`}>على كل شخص</p>
									</div>
								</div>
								<div className={styles.threePersonPriceBox}>
									<div>
										<p className={styles.detailText}>3 أشخاص أو أكثر</p>
									</div>
									<div style={{ textAlign: 'end' }}>
										<p className={`fontBold ${styles.price}`}>{courseDetail.discountForThreeOrMore} ر.س</p>
										<p className={` ${styles.eachPersonDetailText}`}>على كل شخص</p>
									</div>
								</div>
							</>
						}
					</>}
					<div className={styles.btnBox}>
						<button className='primaryStrockedBtn' onClick={() => handleNavigation(catagoryName, courseDetail)}>قراءة تفاصيل الدورة</button>
					</div>
				</div>
			</div>
		</div >
	)
}
