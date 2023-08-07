import React, { useEffect } from 'react'

export default function ApplePayForm(props) {
	const checkoutID = props.checkoutID
	const orderID = props.orderID

	useEffect(() => {

		const applePayCardForm = document.createElement('script');
		applePayCardForm.src = `https://eu-prod.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutID}`;
		applePayCardForm.async = true;
		document.head.appendChild(applePayCardForm);

		return () => document.head.removeChild(applePayCardForm);

	}, [checkoutID]);


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

		return () => document.head.removeChild(applePayDesignScript);
	}, [])

	return (
		<div>
			<form action={`https://www.anaostori.com/payment?orderId=${orderID}`} className="paymentWidgets" data-brands="APPLEPAY"></form>
		</div>
	)
}
