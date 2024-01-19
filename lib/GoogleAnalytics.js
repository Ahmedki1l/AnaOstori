import React, { useEffect } from 'react'

export default function GoogleAnalytics() {

	useEffect(() => {

		const googleAnalytics = document.createElement('script');
		//prod
		// googleAnalytics.src = 'https://www.googletagmanager.com/gtm.js?id=G-MM29291KH1'

		//dev
		googleAnalytics.src = 'https://www.googletagmanager.com/gtm.js?id=G-6J0CD1Y9R2'


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
			gtag('config', 'G-6J0CD1Y9R2',{
				page_path:window.location.pathname
			});
		`
		document.head.appendChild(googleAnalyticsArg);

	}, [])
}

<script async src="https://www.googletagmanager.com/gtag/js?id=G-6J0CD1Y9R2"></script>
