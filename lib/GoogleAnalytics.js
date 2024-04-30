import React, { useEffect } from 'react'


export default function GoogleAnalytics() {

	const googleAnalyticsStreamId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_STREM_ID

	useEffect(() => {

		const googleAnalytics = document.createElement('script');
		googleAnalytics.src = `{https://www.googletagmanager.com/gtm.js?id=${googleAnalyticsStreamId}`
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
			gtag('config', ${googleAnalyticsStreamId},{
				page_path:window.location.pathname
			});
		`
		document.head.appendChild(googleAnalyticsArg);

	}, [])

}
