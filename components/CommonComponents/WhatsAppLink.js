import Link from 'next/link';
import * as linkConst from '../../constants/LinkConst';
import useWindowSize from '../../hooks/useWindoSize';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import useScrollEvent from '../../hooks/useScrollEvent';


export default function WhatsAppLinkComponent(props) {

	const screenWidth = useWindowSize().width
	const isBookSeatPageOpen = props.isBookSeatPageOpen
	const offset = useScrollEvent().offset
	const discountShow = props.discountShow
	const paymentInfoChangePage = props.paymentInfoChangePage
	const groupDiscountEligible = props?.courseDetail?.groupDiscountEligible

	return (
		<div className={`whatsAppLogoWrapper 
		    ${(groupDiscountEligible == false && offset > 512) && 'notShowWrapperUP'}
		 	${discountShow == true ? `discountShowWrapperUp` : ``} 
		 	${(isBookSeatPageOpen && offset > 512) ? `whatsAppLogoWrapperUp` : `whatsAppLogoWrapperDown`}
		    ${paymentInfoChangePage && 'pageChangeLogoWrapper'}`}>

			<div className='whatsAppLogo'>
				<Link href={`${linkConst.WhatsApp_Link}`} target='_blank' className='normalLinkText'>
					<div className='flex'>
						<AllIconsComponenet height={screenWidth < 769 ? 54 : 60} width={screenWidth < 769 ? 54 : 60} iconName={'whatsApp_whiteBorder'} color={'#ffffff'} />
						<div className='whatsAppMessageWrapper'>
							<p>محتاج مساعدة؟</p>
							<p>تفضل تواصل معنا</p>
						</div>
					</div>
				</Link>
			</div>
		</div>
	)

}
