import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Courses.module.scss';
import CoverImg from '../CommonComponents/CoverImg';
import Icon from '../CommonComponents/Icon';
import Link from 'next/link';
import * as linkConst from '../../constants/LinkConst';
import useWindowSize from '../../hooks/useWindoSize';

// MI Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';



export default function PhysicalCourseCard(props) {
	const courseDetail = props.courseDetails
	const groupDiscountEligible = courseDetail?.groupDiscountEligible
	const catagoryName = props.catagoryName
	const [discountShow, setDiscountShow] = useState(false)
	const router = useRouter();

	const handleNavigation = (catagoryName, courseDetail) => {
		if (courseDetail.isEnrolled) {
			router.push(`/myCourse/${courseDetail.id}`)
		} else {
			router.push(`/${courseDetail.name.replace(/ /g, "-")}/${catagoryName.replace(/ /g, "-")}`)
		}
	}


	const oneUserPrice = courseDetail.price

	const isSmallScreen = useWindowSize().smallScreen


	const imageBaseUrl = linkConst.File_Base_Url

	const coverImgUrl = courseDetail.pictureKey ? `${imageBaseUrl}/${courseDetail.pictureKey}` : ""



	return (
		<div className={styles.typeOfCourseCardWrapper}>
			<div className='cursor-pointer' onClick={() => handleNavigation(catagoryName, courseDetail)}>
				<CoverImg height={215} url={coverImgUrl} />
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
										{metaData.link ?
											<Link href={`${metaData.link}` ?? ""} className={`link ${styles.listItemText}`} target='_blank'>{metaData.text}</Link>
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
					{courseDetail.discount == null ?
						<div className={styles.onePersonPriceBox}>
							<p className={`fontMedium ${styles.detailText}`}>سعر الدورة للشخص</p>
							<p className={`fontBold ${styles.price}`}>{oneUserPrice} ر.س</p>
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
						<div className={styles.specialPriceBox}>
							<p className={styles.detailText}>*سعر خاص للمجموعات</p>
							<div className='flex items-center cursor-pointer select-none' onClick={() => { setDiscountShow(!discountShow) }}>
								<KeyboardArrowDownIcon className={`${styles.arrowIcon} ${discountShow == true ? 'rotate-180' : ''}`} />
								<p className={styles.seemoreText}>{discountShow == true ? 'إخفاء الأسعار' : 'إظهار الأسعار'}</p>
							</div>
						</div>
						{discountShow && <>
							<div className={styles.twoPersonPriceBox}>
								<p className={styles.detailText}>{courseDetail.discountForTwo} ر.س على كل شخص</p>
								<p className={`fontBold ${styles.price}`}>{courseDetail.discountForTwo * 2} ر.س</p>
							</div>
							<div className={styles.threePersonPriceBox}>
								<p className={styles.detailText}>{courseDetail.discountForThreeOrMore} ر.س على كل شخص</p>
								<p className={`fontBold ${styles.price}`}>مخصص</p>
							</div>
						</>}
					</>}
					<div className={styles.btnBox}>
						<button className='primaryStrockedBtn' onClick={() => handleNavigation(catagoryName, courseDetail)}>قراءة تفاصيل الدورة</button>
					</div>
				</div>
			</div>
		</div>
	)
}
