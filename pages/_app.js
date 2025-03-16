import '../styles/globals.scss'
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
import Navbar from '../components/Navbar/Navbar';
import { QueryClient, QueryClientProvider } from 'react-query';

// const queryClient = new QueryClient({
// 	defaultOptions: {
// 		queries: {
// 			refetchOnWindowFocus: false,
// 		},
// 	},
// });
const queryClient = new QueryClient();
function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const [pageTitle, setPageTitle] = useState('الرئيسية')
	const [isBookSeatPageOpen, setIsBookSeatPageOpen] = useState(false)
	const pathName = router.pathname
	const removeFooterFrom = ['watchCourse', 'updateProfile', 'accountInformation', 'myCourse', 'instructorPanel']
	const removeWhatsAppFrom = ['watchCourse', 'login', 'register', 'forgotPassword', 'updateProfile', 'accountInformation', 'forgot-password', 'myCourse', 'instructorPanel', '/[catagoryName]/[courseName]', '/[catagoryName]/[courseName]/[bookSit]']
	const hasFooterShown = removeFooterFrom.some(value => router.asPath.includes(value)) ? true : false
	const hasWhatsAppShown = removeWhatsAppFrom.some(value => pathName.includes(value)) ? true : false
	const storeData = store?.getState()?.globalStore;
	const isUserLogin = typeof window !== 'undefined' && localStorage?.getItem('accessToken') ? true : false;

	const protectedRoutes = useMemo(() => [
		'/myProfile',
		'/updateProfile',
		'/accountInformation',
		'/purchaseInquiry',
		'/watchCourse/',
		'/invoiceUploaded',
		// '/uploadInvoice',
		'/payment',
		'/receiveRequest',
		'/instructorPanel',
	], []);

	const isUserInstructor = storeData?.isUserInstructor
	useEffect(() => {
		if (!isUserInstructor && router.pathname.includes('/instructorPanel')) {
			router.replace('/');
		}
	}, [router, isUserInstructor]);

	useEffect(() => {
		if (!isUserLogin && protectedRoutes.includes(router.pathname)) {
			router.replace('/login');
		}
	}, [router, router.pathname, isUserLogin, protectedRoutes]);


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
			case "/accountInformation":
				setPageTitle('إعدادات الحساب')
				break;
			case "/purchaseInquiry":
				setPageTitle('استعلام الحجوزات')
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
				setPageTitle('تعديل البيانات الشخصية')
				break;
			case "/":
				setPageTitle('الرئيسية')
				break;
			case "/instructorPanel":
				setPageTitle('صفحة الادمن الرئيسية')
				break;
			case "/instructorPanel/manageCategories":
				setPageTitle('إدارة وإضافة المجالات')
				break;
			case "/instructorPanel/manageInstructor":
				setPageTitle(' إدارة وإضافة المدربين')
				break;
			case "/instructorPanel/managePurchaseOrder":
				setPageTitle('استعلام المشتريات')
				break;
			case "/instructorPanel/manageNews":
				setPageTitle('إضافة وتعديل الشريط التسويقي')
				break;
			case "/instructorPanel/manageCouponCourse":
				setPageTitle('إضافة وتعديل كوبونات الخصم')
				break;
			case "/instructorPanel/manageUserList":
				setPageTitle('بيانات المستخدمين')
				break;
			case "/instructorPanel/manageLibrary":
				setPageTitle('إدارة المكتبة الرقمية')
				break;
			case "/forgot-password":
				setPageTitle(' نسيت كلمة السر')
				break;
			case "/payment":
				setPageTitle('مراجعة الطلب والدفع')
				break;
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
	const metaTags = (router.pathname == "/[catagoryName]/[courseName]" ? allMetaTags.metaTagsByCourse[router.query.catagoryName] : allMetaTags.metaTagsByRoute[currentRoute]) || defaultMetaTags


	return (
		<>
			<QueryClientProvider client={queryClient}>
				<Head>
					<title>{`${pageTitle} | منصة أنا أسطوري`}</title>
					<link rel="icon" href="/favicon.png" className='rounded-full' />
					<meta name="viewport" content="width=device-width, initial-scale=1"></meta>
					<meta name="description" content={metaTags.description} />
					<meta name="keywords" content={metaTags.keywords} />
					<meta property="og:title" content={metaTags.title} />
					<meta property="og:description" content={metaTags.description} />
					<meta property="og:url" content={`https://anaostori.com${router.asPath}`} />
					<meta property="og:type" content={`https://anaostori.com}`} />
					<meta property="og:image" content={`${metaTags.image}`} />
					<meta http-equiv="Content-Security-Policy"
						content="
						style-src 'self' https://eu-test.oppwa.com 'unsafe-inline' ;
						frame-src 'self' https://eu-test.oppwa.com;
						script-src 'self' https://eu-test.oppwa.com 'nonce-${NONCE_ID}' ;
						connect-src 'self' https://eu-test.oppwa.com;
						img-src 'self' https://eu-test.oppwa.com;
						">
					</meta>
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
					<Script
						id='tiktok-pixel'
						strategy='afterInteractive'
						dangerouslySetInnerHTML={{
							__html: `
						!function (w, d, t) {
						w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
						ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],
						ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
						for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
						ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++
						)ttq.setAndDefer(e,ttq.methods[n]);return e},
						ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
						ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
						n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=i+"?sdkid="+e+"&lib="+t;
						e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
						ttq.load('${process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID}');
						ttq.page();
						}(window, document, 'ttq');
						`,
						}}
					/>
					<Script
						id='snap-pixel'
						strategy='afterInteractive'
						dangerouslySetInnerHTML={{
							__html: `
						(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
						{a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
						a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
						r.src=n;var u=t.getElementsByTagName(s)[0];
						u.parentNode.insertBefore(r,u);})(window,document,
						'https://sc-static.net/scevent.min.js');
						snaptr('init','${process.env.NEXT_PUBLIC_SNAPCHAT_PIXEL_ID}', {
						'user_email': '__INSERT_USER_EMAIL__'
						});
						snaptr('track', 'PAGE_VIEW');
						`,
						}}
					/>
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
			</QueryClientProvider>
		</>
	)
}

export default MyApp
