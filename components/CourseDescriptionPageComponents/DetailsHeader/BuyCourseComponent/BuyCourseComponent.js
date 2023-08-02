import styles from './BuyCourseComponent.module.scss'
import Link from 'next/link';
import Icon from '../../../CommonComponents/Icon'
import Logo from '../../../CommonComponents/Logo';
import CoursePriceBox from '../Common/CoursePriceBox';
import useWindowSize from '../../../../hooks/useWindoSize';
import { useEffect, useState } from 'react';
import CoverImg from '../../../CommonComponents/CoverImg';
import { mediaUrl } from '../../../../constants/DataManupulation';



export default function BuyCourseComponent(props) {
	const courseDetail = props.courseDetail
	const handleBookSitButtonClick = props.handleBookSitButtonClick
	const isMediumScreen = useWindowSize().mediumScreen
	const [isUserUseApple, setIsUserUseApple] = useState(false)
	const lang = props.lang
	useEffect(() => {
		if (window.ApplePaySession) {
			setIsUserUseApple(true)
		}
	}, [setIsUserUseApple])


	return (
		<div className={`${styles.BuyCourseMainArea} ${lang == 'en' ? `${styles.rightSide}` : `${styles.leftSide}`}`}>
			<div className={styles.BuyCourseWrapper}>
				<CoverImg height={190} url={courseDetail.pictureKey ? mediaUrl(courseDetail.pictureBucket, courseDetail.pictureKey) : '/images/anaOstori.png'} />

				{/* <VideoThumnail pictureKey={courseDetail.pictureKey} videoKey={courseDetail.videoKey} thumnailHeight={190} /> */}

				<CoursePriceBox courseDetail={courseDetail} handleBookSitButtonClick={handleBookSitButtonClick} bookSeatButtonText={props.bookSeatButtonText} lang={lang} />
				<div className='flex justify-center py-3.5'>
					{isUserUseApple ?
						<Logo height={isMediumScreen ? 30 : 40} width={isMediumScreen ? 290 : 322} logoName={'paymentMethodLogoIOS'} alt={'Payment Methode Logo'} />
						:
						<Logo height={isMediumScreen ? 38 : 42} width={isMediumScreen ? 272 : 257} logoName={'paymentMethodLogo'} alt={'Payment Methode Logo'} />
					}
				</div>
				<p className={`fontBold ${styles.featureHead}`}>{lang == 'en' ? `Subscription Info` : `تفاصيل الاشتراك`}  </p>
				<ul className={styles.feturesList}>
					{courseDetail.courseDetailsMetaData.map((item, index) => {
						return (
							<li key={`courseDetailsMetaData12${index}`}>
								<div>
									<Icon height={item.icon == 'shildIcon' ? (isMediumScreen ? 23 : 21) : (isMediumScreen ? 20 : 19)} width={(isMediumScreen ? 20 : 19)} iconName={`${item.icon}`} alt={'Icons'} />
								</div>
								<div className='flex flex-wrap mr-2 items-center'>
									{item.link == null || item.link.length === 0 ?
										<div className='flex items-center'>
											<p className={`fontMedium ${styles.listText}`}>{item.text}
												{item.tailLink != null && item.tailLink.length != 0 &&
													<Link href={item.tailLink ?? ""} className={`fontMedium link mx-1 ${styles.listText}`} target='_blank'>{item.tailLinkName}</Link>
												}
											</p>
										</div>
										:
										<Link href={item.link ?? ""} className={`fontMedium link ${styles.listText}`} target='_blank'>{item.text}</Link>
									}
									<p className={styles.grayText}>{item.grayedText ? `(${item.grayedText})` : ''}</p>
								</div>
							</li>
						)
					})}
				</ul>
			</div>
			{/* <Link href={coursePlanUrl ?? ""} target='_blank' className={`flex items-center justify-center normalLinkText ${styles.downloadPlanBox}`} >
				<SaveAltIcon className={`text-blue-500`} />
				<p className={`fontMedium ${styles.downloadPlanText}`}>تنزيل خطة الدورة</p>
			</Link> */}
		</div>
	)
}
