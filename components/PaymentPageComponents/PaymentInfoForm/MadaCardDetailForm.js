import React, { useEffect } from 'react'

export default function MadaCardDetailForm(props) {

	const checkoutID = props.checkoutID
	const orderID = props.orderID

	useEffect(() => {
		const madaCardForm = document.createElement('script');
		madaCardForm.src = `https://eu-prod.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutID}`;
		// madaCardForm.src = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutID}`
		madaCardForm.async = true;
		document.head.appendChild(madaCardForm);

		return () => document.head.removeChild(madaCardForm);

	}, [checkoutID]);

	useEffect(() => {
		const madaDesignScript = document.createElement('script');
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
			<form action={`https://www.anaostori.com/payment?orderId=${orderID}`} className="paymentWidgets" data-brands="MADA"></form>
			{/* <form action={`http://localhost:3000/payment?orderId=${orderID}`} className="paymentWidgets" data-brands="MADA"></form> */}
		</div>
	)
}
