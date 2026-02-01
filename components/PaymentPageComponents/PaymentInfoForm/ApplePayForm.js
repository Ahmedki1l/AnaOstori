import React, { useEffect } from 'react'

export default function ApplePayForm(props) {
	const checkoutID = props.checkoutID
	const orderID = props.orderID
	const orderType = props.orderType || 'course' // Default to course for backward compatibility
	
	// Use different verification URL based on order type
	const verifyUrl = orderType === 'book' 
		? `${process.env.NEXT_PUBLIC_WEB_URL}/bookPaymentVerify?orderId=${orderID}`
		: `${process.env.NEXT_PUBLIC_WEB_URL}/payment?orderId=${orderID}`

	useEffect(() => {

		const applePayCardForm = document.createElement('script');
		applePayCardForm.src = `${process.env.NEXT_PUBLIC_HYPERPAY}/v1/paymentWidgets.js?checkoutId=${checkoutID}`;
		applePayCardForm.integrity = `${props.integrity}`;
		applePayCardForm.crossOrigin = "anonymous";
		applePayCardForm.async = true;
		document.head.appendChild(applePayCardForm);

		return () => {
			// Safely remove script only if it's still attached to the DOM
			if (applePayCardForm.parentNode) {
				applePayCardForm.parentNode.removeChild(applePayCardForm);
			}
		};

	}, [checkoutID]);

	// function generateSecureNonce(length) {
	// 	const array = new Uint8Array(length);
	// 	window.crypto.getRandomValues(array);
	// 	// Convert each byte to a hexadecimal string and join them together
	// 	return Array.from(array, byte => ('0' + byte.toString(16)).slice(-2)).join('');
	// }


	useEffect(() => {
		const applePayDesignScript = document.createElement('script');
		applePayDesignScript.nonce = Math.random().toString(36).substring(2, 15);
		applePayDesignScript.innerHTML = `
		var wpwlOptions = {
			applePay: {
				displayName: "AnaOstori",
				total: { label: "Sanam Company, INC." },
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

		return () => {
			// Safely remove script only if it's still attached to the DOM
			if (applePayDesignScript.parentNode) {
				applePayDesignScript.parentNode.removeChild(applePayDesignScript);
			}
		};
	}, [])

	return (
		<div>
			<form action={verifyUrl} className="paymentWidgets" data-brands="APPLEPAY"></form>
		</div>
	)
}
