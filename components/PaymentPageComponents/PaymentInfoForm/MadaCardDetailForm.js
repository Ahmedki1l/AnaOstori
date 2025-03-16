import React, { useEffect } from 'react'

export default function MadaCardDetailForm(props) {

	const checkoutID = props.checkoutID
	const orderID = props.orderID

	useEffect(() => {
		const madaCardForm = document.createElement('script');
		// madaCardForm.src = `https://eu-prod.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutID}`;
		madaCardForm.src = `${process.env.NEXT_PUBLIC_HYPERPAY}/v1/paymentWidgets.js?checkoutId=${checkoutID}`
		madaCardForm.integrity = `${props.integrity}`;
		madaCardForm.crossOrigin = "anonymous";
		madaCardForm.async = true;
		document.head.appendChild(madaCardForm);

		return () => document.head.removeChild(madaCardForm);

	}, [checkoutID]);

	function generateSecureNonce(length) {
		const array = new Uint8Array(length);
		window.crypto.getRandomValues(array);
		// Convert each byte to a hexadecimal string and join them together
		return Array.from(array, byte => ('0' + byte.toString(16)).slice(-2)).join('');
	}

	useEffect(() => {
		const madaDesignScript = document.createElement('script');
		madaDesignScript.nonce = generateSecureNonce(16);
		madaDesignScript.innerHTML = `
		var wpwlOptions = {
			style: "plain",
			locale: "ar",
			paymentTarget:"_top",
			iframeStyles: {
				'card-number-placeholder': {
					'font-family': 'Tajawal-Regular',
					'color': '#ccc',
					'font-size': '16px',
				},
				'cvv-placeholder': {
					'font-family': 'Tajawal-Regular',
					'color': '#ccc',
					'font-size': '16px',
				},
			},
									
			onReady: function() {
				ready = true;
				$(".wpwl-group-cardHolder").after($(".wpwl-group-expiry"));
				$(".wpwl-group-cardNumber").before($(".wpwl-group-cardHolder"));
				$(".wpwl-control-cardNumber").css({'direction': 'ltr' , "text-align":"right"});
			},
		}`
		document.head.appendChild(madaDesignScript);
		return () => document.head.removeChild(madaDesignScript);
	}, [])

	return (
		<div>
			{/* <form action={`https://www.anaostori.com/payment?orderId=${orderID}`} className="paymentWidgets" data-brands="MADA"></form> */}
			<form action={`${process.env.NEXT_PUBLIC_WEB_URL}/payment?orderId=${orderID}`} className="paymentWidgets" data-brands="MADA"></form>
		</div>
	)
}
