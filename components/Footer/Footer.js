import { useState } from 'react';
import styles from './Footer.module.scss'
import Logo from '../CommonComponents/Logo';
import Link from 'next/link';
import * as linkConst from '../../constants/LinkConst';
import useWindowSize from '../../hooks/useWindoSize';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';


export default function Footer() {

	const isMediumScreen = useWindowSize().mediumScreen
	const isSmallScreen = useWindowSize().smallScreen

	const [locationIconColor, setLocationIconColor] = useState("#000000")
	const [phoneIconColor, setPhoneIconColor] = useState("#000000")
	const [instaIconColor, setInstaIconColor] = useState("#2D2E2D")
	const [youtubeIconColor, setYoutubeIconColor] = useState("#2D2E2D")
	const [twitterIconColor, setTwitterIconColor] = useState("#2D2E2D")
	const [tiktokIconColor, setTiktokIconColor] = useState("#2D2E2D")


	return (
		<div className={styles.footerWrapper}>
			<div className={`maxWidthDefault ${styles.footerSubWrapper}`}>
				<div className={styles.footerMainBox}>
					<div className={`${styles.section1} ${styles.section}`}>
						<Logo height={isSmallScreen ? 49 : 98} width={isSmallScreen ? 89 : 177} logoName={'anaOstoriLogo'} alt={'Ana Ostori Logo'} />
						<p className={styles.footerSubText}>نقدم دورات القدرات والتحصيلي للجنسين بروح شبابية، عندنا طاقم متكامل من المدربين والمدربات والمشرفين والمشرفات</p>
						<div className='pb-4'>
							<div className={styles.socialMediaIconWraper}>
								<Link href={`${linkConst.Youtube_Link}`} target='_blank' className={styles.youtubeWrapper} onMouseEnter={() => setYoutubeIconColor('#F26722')} onMouseLeave={() => setYoutubeIconColor('#000000')}>
									<div className={styles.youtubeBlack}>
										<AllIconsComponenet height={isMediumScreen ? 24 : 26} width={isMediumScreen ? 29 : 31} iconName={'youtubeIcon'} color={youtubeIconColor} />
									</div>
								</Link>
								<Link href={`${linkConst.Twitter_Link}`} target='_blank' className={styles.twitterWrapper} onMouseEnter={() => setTwitterIconColor('#F26722')} onMouseLeave={() => setTwitterIconColor('#000000')}>
									<div className={styles.twitterBlack}>
										<AllIconsComponenet height={isMediumScreen ? 24 : 27} width={isMediumScreen ? 24 : 27} iconName={'twitterIcon'} color={twitterIconColor} />
									</div>
								</Link>
								<Link href={`${linkConst.Instagram_Link}`} target='_blank' className={styles.instaWrapper} onMouseEnter={() => setInstaIconColor('#F26722')} onMouseLeave={() => setInstaIconColor('#000000')}>
									<div className={styles.instaBlack}>
										<AllIconsComponenet height={isMediumScreen ? 24 : 27} width={isMediumScreen ? 24 : 27} iconName={'instaIcon'} color={instaIconColor} />
									</div>
								</Link>
								<Link href={`${linkConst.TikTok_Link}`} target='_blank' className={styles.tiktokWrapper} onMouseEnter={() => setTiktokIconColor('#F26722')} onMouseLeave={() => setTiktokIconColor('#000000')}>
									<div className={styles.tiktokBlack}>
										<AllIconsComponenet height={isMediumScreen ? 24 : 27} width={isMediumScreen ? 24 : 27} iconName={'tiktokIcon'} color={tiktokIconColor} />
									</div>
								</Link>
							</div>
						</div>
					</div>
					<div className={`${styles.section2} ${styles.section}`}>
						<Link href={`${linkConst.VAT_Link}`} target='_blank' className={styles.regiDetailsBox1}>
							<Logo height={isMediumScreen ? 57 : 50} width={isMediumScreen ? 40 : 38} logoName={'sanamCompamyLogo'} alt={'Sanam Company for Business Services Logo'} />
							<div className={styles.regiDetailsTextBox}>
								<p>رقم التسجيل الضريبي 310646534500003</p>
								<p>رقم السجل التجاري 1010644475</p>
							</div>
						</Link>
						<div className={styles.regiDetailsBox2}>
							<Logo height={isMediumScreen ? 53 : 50} width={isMediumScreen ? 40 : 38} logoName={'tvtcLogo'} alt={'TVTC Logo'} />
							<div className={styles.regiDetailsTextBox}>
								<p>مرخص من المؤسسة العامة للتدريب المهني والتقني</p>
								<p>رخصة رقم 4174536814</p>
							</div>
						</div>
					</div>
					<div className={`${styles.section3} ${styles.section}`}>
						<h3>الروابط المهمة</h3>
						<ul>
							<Link href={'/privacyAndPolicy'} target='_blank' className='normalLinkText'>
								<li>سياسة الخصوصية</li>
							</Link>
							<Link href={'/terms'} target='_blank' className='normalLinkText'>
								<li>الشروط والأحكام</li>
							</Link>
							<Link href={'/FAQs'} target='_blank' className='normalLinkText'>
								<li>الأسئلة الشائعة</li>
							</Link>
							<Link href={'https://docs.google.com/forms/d/1dcKqdRcUnOy3AeMDrNz1XkA6npMal2Gi3bltvT1ef7o/viewform?edit_requested=true'} target='_blank' className='normalLinkText'>
								<li>التسويق بالعمولة</li>
							</Link>
							<Link href={'https://api.whatsapp.com/send/?phone=966581662413&text&type=phone_number&app_absent=0'} target='_blank' className='normalLinkText'>
								<li>للشراكات الاستراتيجية</li>
							</Link>
						</ul>
					</div>
					<div className={`${styles.section4} ${styles.section}`}>
						<h3>خلنا على تواصل</h3>
						<ul>
							<Link href={`${linkConst.WhatsApp_Link}`} target='_blank' className='normalLinkText inline-block'>
								<li className={styles.whatsAppWrapper} onMouseEnter={() => setPhoneIconColor('#F26722')} onMouseLeave={() => setPhoneIconColor('#000000')}>
									<div className={styles.whatsAppBlack}>
										<AllIconsComponenet height={32} width={32} iconName={'whatsappFill'} color={phoneIconColor} />
									</div>
									<p>0502413980</p>
								</li>
							</Link>
							<Link href={`${linkConst.GoogleMap_Link}`} target='_blank' className='normalLinkText '>
								<li className={styles.locationWrapper} onMouseEnter={() => setLocationIconColor('#F26722')} onMouseLeave={() => setLocationIconColor('#000000')}>
									<div className={styles.locationBlack}>
										<AllIconsComponenet height={32} width={32} iconName={'location'} color={locationIconColor} />
									</div>
									<p style={{ color: locationIconColor }}>الرياض، حي الياسمين</p>
								</li>
							</Link>
						</ul>
					</div>
					<div className={styles.section5}>
						<h3>حمل التطبيق الان</h3>
						<div className='flex pt-4'>
							<Link href={`${linkConst.Ios_APP_URL}`} target='_blank' className='normalLinkText'>
								<li className={styles.appLogoWrapper}>
									<Logo height={26} width={22} logoName={'appStoreLogo'} alt={'App Store Logo'} />
									<div className='pr-2'>
										<p className={styles.subHeadding}>تنزيل من</p>
										<p className={`font-bold ${styles.storeNameText}`}>App Store</p>
									</div>
								</li>
							</Link>
							<Link href={`${linkConst.Android_APP_URL}`} className='normalLinkText' target='_blank'>
								<li className={styles.appLogoWrapper}>
									<Logo height={26} width={22} logoName={'googlePlayLogo'} alt={'Google Play Logo'} />
									<div className='pr-2'>
										<p className={styles.subHeadding}>تنزيل من</p>
										<p className={`font-bold ${styles.storeNameText}`}>Google Play</p>
									</div>
								</li>
							</Link>
						</div>
					</div>
				</div>
				<div className={styles.footerBottom}>
					<p>جميع الحقوق محفوظة لشركة سنام لخدمات الأعمال © 2023</p>
					<div className={styles.bankLogoDiv}>
						<Logo height={isMediumScreen ? 30 : 35} width={isMediumScreen ? 270 : 280} logoName={'paymentMethodLogoIOS'} alt={'Payment Methode Logo'} />
					</div>
				</div>
			</div>
		</div>
	)
}