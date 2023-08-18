import React, { useEffect } from 'react'

export default function GoogleAnalytics() {
    useEffect(() => {
        const applePayDesignScript = document.createElement('script');
        applePayDesignScript.innerHTML = `
		var wpwlOptions = {
			applePay: {
				displayName: "AnaOstori",
				total: { label: "Sanam Conpany, INC." },
				style: "black",
				merchantIdentifier: "merchant.com.anaostori",
				currencyCode:"SAR",
				countryCode:"SA",
				supportedNetworks: ["masterCard", "visa", "mada"],
				merchantCapabilities: ["supports3DS"],
				supportedCountries: ["SA","AE"],
				version: 3
			},
		}`
        document.head.appendChild(applePayDesignScript);

    }, [])
    //   return (
    //     <div>GoogleAnalytics</div>
    //   )
}

