import React, { useEffect } from 'react'

export default function GoogleAnalytics() {

	useEffect(() => {

		const googleAnalytics = document.createElement('script');
		//prod
		// googleAnalytics.src = 'https://www.googletagmanager.com/gtm.js?id=G-MM29291KH1'

		//dev
		googleAnalytics.src = 'https://www.googletagmanager.com/gtm.js?id=G-DXRRV0FNGE'


		googleAnalytics.async = true;
		googleAnalytics.strategy = "afterInteractive"
		document.head.appendChild(googleAnalytics);

		// return () => document.head.removeChild(applePayCardForm);

	}, []);

	useEffect(() => {
		const googleAnalyticsArg = document.createElement('script');
		googleAnalyticsArg.innerHTML = `
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());

			//prod
			// gtag('config', 'G-MM29291KH1',{
			// 	page_path:window.location.pathname
			// });

			//dev
			gtag('config', 'G-DXRRV0FNGE',{
				page_path:window.location.pathname
			});
		`
		document.head.appendChild(googleAnalyticsArg);

	}, [])
}

