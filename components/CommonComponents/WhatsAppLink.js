import Link from 'next/link';
import * as linkConst from '../../constants/LinkConst';
import useWindowSize from '../../hooks/useWindoSize';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';


export default function WhatsAppLinkComponent(props) {

	const screenWidth = useWindowSize().width
	const isBookSeatPageOpen = props.isBookSeatPageOpen

	return (
		<div className={`whatsAppLogoWrapper ${isBookSeatPageOpen ? `whatsAppLogoWrapperUp` : ``}`}>
			<Link href={`${linkConst.WhatsApp_Link}`} target='_blank' className='normalLinkText'>
				<div className='whatsAppLogo' >
					<div className='whatsAppLogoRoundWrapper'>
						<AllIconsComponenet height={screenWidth < 769 ? 35 : 50} width={screenWidth < 769 ? 35 : 50} iconName={'whatsapp'} color={'#ffffff'} />
					</div>
				</div>
				<div className='whatsAppMessageWrapper'>
					<p>محتاج مساعدة؟</p>
					<p>تفضل تواصل معنا</p>
				</div>
			</Link>
		</div>
	)

}
