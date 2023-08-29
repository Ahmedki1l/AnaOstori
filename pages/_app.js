import '../styles/globals.scss'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import Head from 'next/head'
import { useRouter } from "next/router";
import WhatsAppLinkComponent from '../components/CommonComponents/WhatsAppLink';
import { useEffect, useMemo, useState } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../components/GlobalStore/store';
import * as fbq from '../lib/fpixel'
import Script from 'next/script'
import GoogleAnalytics from '../lib/GoogleAnalytics';
import * as allMetaTags from '../lib/metaData'


function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const [pageTitle, setPageTitle] = useState('الرئيسية')
	const [isBookSeatPageOpen, setIsBookSeatPageOpen] = useState(false)
	const pathName = router.pathname
	const removeFooterFrom = ['watchCourse', 'login', 'register', 'forgotPassword', 'updateProfile', 'accountInformation', 'forgot-password', 'myCourse', 'instructorPanel']
	const removeWhatsAppFrom = ['watchCourse', 'login', 'register', 'forgotPassword', 'updateProfile', 'accountInformation', 'forgot-password', 'myCourse', 'instructorPanel', '/[catagoryName]/[courseName]', '/[catagoryName]/[courseName]/[bookSit]']
	const hasFooterShown = removeFooterFrom.some(value => router.asPath.includes(value)) ? true : false
	const hasWhatsAppShown = removeWhatsAppFrom.some(value => pathName.includes(value)) ? true : false
	const storeData = store?.getState()?.globalStore;
	const protectedRoutes = useMemo(() => [
		'/myProfile',
		'/updateProfile',
		'/accountInformation',
		'/purchaseInquiry',
		'/watchCourse/',
		'/invoiceUploaded',
		'/uploadInvoice',
		'/payment',
		'/receiveRequest',
		'/instructorPanel',
	], []);

	const isUserInstructor = storeData?.isUserInstructor
	console.log(router);
	useEffect(() => {
		if (!isUserInstructor && router.pathname.includes('/instructorPanel')) {
			router.replace('/');
		}
	}, [router, isUserInstructor]);

	useEffect(() => {
		if (!storeData?.accessToken && protectedRoutes.includes(router.pathname)) {
			router.replace('/login');
		}
	}, [router, router.pathname, storeData?.accessToken, protectedRoutes]);


	useEffect(() => {
		if (pathName == "/[catagoryName]/[courseName]" || pathName == "/[catagoryName]/[courseName]/[booksit]") {
			setIsBookSeatPageOpen(true)
		} else {
			setIsBookSeatPageOpen(false)
		}
	}, [router.asPath, pathName])

	useEffect(() => {
		switch (pathName) {
			case "/[catagoryName]": setPageTitle(router.query.catagoryName)
				break;
			case "/[catagoryName]/[courseName]": setPageTitle(router.query.catagoryName)
				break;
			case "/[catagoryName]/[courseName]/[bookSit]": setPageTitle('تعبئة البيانات')
				break;
			case "/purchaseInquiry":
				setPageTitle('استعلام وتأكيد الحجوزات')
				break;
			case "/studentFeedback":
				setPageTitle('تجارب الأساطير')
				break;
			case "/receiveRequest":
				setPageTitle('استلام الطلب')
				break;
			case "/uploadInvoice":
				setPageTitle('تأكيد التحويل البنكي')
				break;
			case "/invoiceUploaded":
				setPageTitle('استلام الإيصال')
				break;
			case "/terms":
				setPageTitle('الشروط والأحكام')
				break;
			case "/privacyAndPolicy":
				setPageTitle('سياسة الخصوصية ')
				break;
			case "/register":
				setPageTitle('إنشاء حساب ')
				break;
			case "/login":
				setPageTitle('تسجيل الدخول ')
				break;
			case "/myProfile":
				setPageTitle('الملف الشخصي ')
				break;
			case "/updateProfile":
				setPageTitle('تعديل الملف الشخصي')
				break;
			case "/":
				setPageTitle('الرئيسية')
		}
	}, [router.asPath, pathName, router.query.catagoryName]);

	useEffect(() => {
		const jQuery = document.createElement('script');
		jQuery.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
		document.head.appendChild(jQuery);
	}, []);

	useEffect(() => {
		fbq.pageview()

		const handleRouteChange = () => {
			fbq.pageview()
		}

		router.events.on('routeChangeComplete', handleRouteChange)
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [router.events])

	const defaultMetaTags = {
		title: 'Default Title',
		description: 'Default Description',
		keywords: 'Default Keywords',
	};

	const currentRoute = router.pathname;
	console.log(router);
	const metaTags = (router.pathname == "/[catagoryName]/[courseName]" ? allMetaTags.metaTagsByCourse[router.query.catagoryName] : allMetaTags.metaTagsByRoute[currentRoute]) || defaultMetaTags


	return (
		<>
			<Head>
				<title>{`${pageTitle} | أنا أسطوري`}</title>
				<link rel="icon" href="/favicon.png" className='rounded-full' />
				<meta name="description" content={metaTags.description} />
				<meta name="keywords" content={metaTags.keywords} />
				<meta property="og:title" content={metaTags.title} />
				<meta property="og:description" content={metaTags.description} />
				<meta property="og:url" content={`https://anaostori.com${router.asPath}`} />
				<meta property="og:type" content={`https://anaostori.com}`} />
				<meta property="og:image" content={`${metaTags.image}`} />
			</Head>
			<div dir='rtl'>
				<GoogleAnalytics pathName={pathName} />
				<Script
					id="fb-pixel"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: `
						!function(f,b,e,v,n,t,s)
						{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
						n.callMethod.apply(n,arguments):n.queue.push(arguments)};
						if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
						n.queue=[];t=b.createElement(e);t.async=!0;
						t.src=v;s=b.getElementsByTagName(e)[0];
						s.parentNode.insertBefore(t,s)}(window, document,'script',
						'https://connect.facebook.net/en_US/fbevents.js');
						fbq('init', ${fbq.FB_PIXEL_ID});
						fbq('track', 'PageView');
						`,
					}}
				/>
				{/* <Script
					id="snap-pixel"
					strategy="afterInteractive"
					type='text/javascript'
					dangerouslySetInnerHTML={{
						__html: `
						(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function() 
							{a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)}; 
							a.queue=[];var s='script';r=t.createElement(s);r.async=!0; r.src=n;
							var u=t.getElementsByTagName(s)[0]; u.parentNode.insertBefore(r,u);})
							(window,document, 'https://sc-static.net/scevent.min.js'); 
							snaptr('init', 'be39bfb2-47f6-403e-be65-f75f7232436c', 
							{ 'user_email': '__INSERT_USER_EMAIL__' }); 
							snaptr('track', 'PAGE_VIEW');
						`,
					}}
				/> */}
				<noscript><img height="1" width="1" style={{ display: 'none' }}
					src={`https://www.facebook.com/tr?id=${fbq.FB_PIXEL_ID}&ev=PageView&noscript=1`}
					alt={'fbPixelNoScriptAlt'}
				/></noscript>
				<ToastContainer />
				<Provider store={store} >
					<PersistGate loading={null} persistor={persistor}>
						<Navbar />
						<Component {...pageProps} />
					</PersistGate>
				</Provider>
				{!hasFooterShown &&
					<Footer />
				}
				{!hasWhatsAppShown &&
					<WhatsAppLinkComponent isBookSeatPageOpen={isBookSeatPageOpen} />
				}
			</div>
		</>
	)
}

export default MyApp
