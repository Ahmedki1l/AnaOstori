import React, { useEffect } from 'react'

export default function GoogleAnalytics() {

	useEffect(() => {

		const googleAnalytics = document.createElement('script');
		// googleAnalytics.src = 'https://www.googletagmanager.com/gtm.js?id=G-DXRRV0FNGE'
		googleAnalytics.src = 'https://www.googletagmanager.com/gtm.js?id=G-MCGDYQ715J'
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

			gtag('config', 'G-MCGDYQ715J',{
				page_path:window.location.pathname
			});
		`
		document.head.appendChild(googleAnalyticsArg);

	}, [])
}
