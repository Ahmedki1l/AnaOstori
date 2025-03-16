import React, { useEffect } from 'react'

export default function CreditCardDetailForm(props) {

	const checkoutID = props.checkoutID
	const orderID = props.orderID

	useEffect(() => {

		const creditCardForm = document.createElement('script');
		// creditCardForm.src = `https://eu-prod.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutID}`;
		creditCardForm.src = `${process.env.NEXT_PUBLIC_HYPERPAY}/v1/paymentWidgets.js?checkoutId=${checkoutID}`
		creditCardForm.integrity = `${props.integrity}`;
		creditCardForm.crossOrigin = "anonymous";
		creditCardForm.async = true;
		document.head.appendChild(creditCardForm);

		return () => document.head.removeChild(creditCardForm);

	}, [checkoutID]);

	// function generateSecureNonce(length) {
	// 	const array = new Uint8Array(length);
	// 	window.crypto.getRandomValues(array);
	// 	// Convert each byte to a hexadecimal string and join them together
	// 	return Array.from(array, byte => ('0' + byte.toString(16)).slice(-2)).join('');
	// }

	useEffect(() => {
		const creditDesignScript = document.createElement('script');
		creditDesignScript.nonce = Math.random().toString(36).substring(2, 15);
		creditDesignScript.innerHTML = `
		var wpwlOptions = {
			style: "plain",
			locale: "ar",
			paymentTarget:"_top",
			iframeStyles: {
				'card-number-placeholder': {
					'color': '#ccc',
					'font-family': 'Tajawal-Regular',
					'font-size': '16px',
				},
				'cvv-placeholder': {
					'color': '#ccc',
					'font-family': 'Tajawal-Regular',
					'font-size': '16px',
				},
			},
			brandDetection: true,
			brandDetectionType: "binlist",
			brandDetectionPriority: ["CARTEBANCAIRE","VISA","MAESTRO","MASTER"],
					
			onReady: function() {
				ready = true;
				$(".wpwl-group-cardHolder").after($(".wpwl-group-expiry"));
				$(".wpwl-group-cardNumber").before($(".wpwl-group-cardHolder"));
				$(".wpwl-control-cardNumber").css({'direction': 'ltr' , "text-align":"right"});
			},
			onChangeBrand: function() {
				hideBrands();
			}
		};

		var ready = false;
		var dotsClicked = false;
		function hideBrands() {
			if (!ready || dotsClicked) {
				return;
			}
			
			// Clears all previous dots-hidden logos, if any
			$(".wpwl-group-card-logos-horizontal > div").removeClass("dots-hidden");
			
			// Selects all non-hidden logos. They are detected brands which otherwise would be shown by default.
			var $logos = $(".wpwl-group-card-logos-horizontal > div:not(.wpwl-hidden)");
			if ($logos.length < 2) {
				return;
			}
			
			// Hides all except the first logo, and displays three dots (...)
			$logos.first().after($("<div>...</div>").addClass("dots"));
			$logos.filter(function(index) { return index > 0; }).addClass("dots-hidden");
			
			// If ... is clicked, un-hides the logos
			$(".dots").click(function() {
				dotsClicked = true;
				$(".dots-hidden").removeClass("dots-hidden");
				$(this).remove();
			});
		}`
		document.head.appendChild(creditDesignScript);

		return () => document.head.removeChild(creditDesignScript);
	}, [])

	return (
		<div>
			{/* <form action={`https://www.anaostori.com/payment?orderId=${orderID}`} className="paymentWidgets" data-brands="VISA MASTER AMEX"></form> */}
			<form action={`${process.env.NEXT_PUBLIC_WEB_URL}/payment?orderId=${orderID}`} className="paymentWidgets" data-brands="VISA MASTER AMEX"></form>
		</div>
	)
}
