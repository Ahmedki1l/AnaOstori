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


	return (
		<div className={styles.footerWrapper}>
			<div className={`maxWidthDefault ${styles.footerSubWrapper}`}>
				<div className={styles.footerMainBox}>
					<div className={`${styles.section1} ${styles.section}`}>
						<Logo height={isSmallScreen ? 75 : 102} width={isSmallScreen ? 103 : 140} logoName={'newAnaostoriLogo'} alt={'Ana Ostori Logo'} />
						<p className={styles.footerSubText}>نقدم دورات القدرات والتحصيلي للجنسين بروح شبابية، عندنا طاقم متكامل من المدربين والمدربات والمشرفين والمشرفات</p>
						<div className='pb-4'>
							<Link href={`${linkConst.GoogleMap_Link}`} target='_blank' className='normalLinkText'>
								<li className={styles.locationLinkBox} >
									<AllIconsComponenet height={isSmallScreen ? 24 : 32} width={isSmallScreen ? 24 : 32} iconName={'coloredGoogleMapIcon'} />
									<p className={`pr-2 ${styles.locationLinkText}`}>المقر الرئيسي، الرياض، حي الياسمين</p>
								</li>
							</Link>
							<div className={styles.socialMediaIconWraper}>
								<Link href={`${linkConst.Youtube_Link}`} target='_blank' className={styles.youtubeWrapper}>
									<div className={styles.youtubeBlack}>
										<AllIconsComponenet height={isMediumScreen ? 24 : 32} width={isMediumScreen ? 24 : 32} iconName={'coloredYoutubeIcon'} color={'#CE1312'} />
									</div>
								</Link>
								<Link href={`${linkConst.Twitter_Link}`} target='_blank' className={styles.twitterWrapper}>
									<div className={styles.twitterBlack}>
										<AllIconsComponenet height={isMediumScreen ? 24 : 32} width={isMediumScreen ? 24 : 32} iconName={'coloredTwittericon'} color={'#03A9F4'} />
									</div>
								</Link>
								<Link href={`${linkConst.Instagram_Link}`} target='_blank' className={styles.instaWrapper}>
									<div className={styles.instaBlack}>
										<AllIconsComponenet height={isMediumScreen ? 24 : 32} width={isMediumScreen ? 24 : 32} iconName={'coloredInstaIcon'} />
									</div>
								</Link>
								<Link href={`${linkConst.TikTok_Link}`} target='_blank' className={styles.tiktokWrapper}>
									<div className={styles.tiktokBlack}>
										<AllIconsComponenet height={isMediumScreen ? 24 : 32} width={isMediumScreen ? 24 : 32} iconName={'tiktokIcon'} color={'#000000'} />
									</div>
								</Link>
							</div>
						</div>
					</div>
					<div className={`mt-20 ${styles.section2} ${styles.section}`}>
						<Link href={`${linkConst.VAT_Link}`} target='_blank' className={styles.regiDetailsBox1}>
							<Logo height={isMediumScreen ? 25 : 40} width={isMediumScreen ? 20 : 32} logoName={'sanamCompamyLogo'} alt={'Sanam Company for Business Services Logo'} />
							<div className={styles.regiDetailsTextBox}>
								<p>رقم التسجيل الضريبي 310646534500003</p>
								<p>رقم السجل التجاري 1010644475</p>
							</div>
						</Link>
						<div className={styles.regiDetailsBox2}>
							<Logo height={isMediumScreen ? 25 : 40} width={isMediumScreen ? 20 : 32} logoName={'tvtcLogo'} alt={'TVTC Logo'} />
							<div className={styles.regiDetailsTextBox}>
								<p>مرخص من المؤسسة العامة للتدريب المهني والتقني</p>
								<p>رخصة رقم 4174536814</p>
							</div>
						</div>
					</div>
					<div className={styles.section}>
						<h3 className={isSmallScreen ? `${styles.sectionWrapper}` : ''}>الروابط المهمة</h3>
						<ul className={styles.linkTextWrapper}>
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
					<div className={`${styles.section} ${styles.contactSections}`}>
						<h3>خلنا على تواصل</h3>
						<ul>
							<Link href={`${linkConst.WhatsApp_Link}`} target='_blank' className='normalLinkText'>
								<li className={styles.whatsAppWrapper} >
									<AllIconsComponenet height={isSmallScreen ? 28 : 36} width={isSmallScreen ? 28 : 36} iconName={'whatsApp_whiteBorder'} color={'#40C351'} />
									<p>0502413980</p>
								</li>
							</Link>
							<Link href={`mailto:${'anaostori@scbs.sa'}`} target='_blank' className='normalLinkText'>
								<li className={styles.locationWrapper}>
									<AllIconsComponenet height={isSmallScreen ? 24 : 32} width={isSmallScreen ? 24 : 32} iconName={'coloredEmailIcon'} color={"#F8B84E"} />
									<p>anaostori@scbs.sa</p>
								</li>
							</Link>
						</ul>
					</div>
				</div>
				<div className={styles.footerBottom}>
					<div className={styles.footerLink}>
						<p>جميع الحقوق محفوظة </p>
						<Link style={{ color: '#0075FF' }} target={'_blank'} href={`https://www.linkedin.com/company/scbs-sa/`}> لشركة سنام لخدمات الأعمال © 2023</Link>
					</div>
					<div className={styles.bankLogoDiv}>
						<Logo height={isMediumScreen ? 30 : 35} width={isMediumScreen ? 270 : 280} logoName={'paymentMethodLogoIOS'} alt={'Payment Methode Logo'} />
					</div>
				</div>
			</div>
		</div >
	)
}