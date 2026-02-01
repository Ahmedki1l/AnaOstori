import React, { useEffect } from 'react'

export default function CreditCardDetailForm(props) {

	const checkoutID = props.checkoutID
	const orderID = props.orderID
	const orderType = props.orderType || 'course' // Default to course for backward compatibility
	
	// Use different verification URL based on order type
	const verifyUrl = orderType === 'book' 
		? `${process.env.NEXT_PUBLIC_WEB_URL}/bookPaymentVerify?orderId=${orderID}`
		: `${process.env.NEXT_PUBLIC_WEB_URL}/payment?orderId=${orderID}`

	useEffect(() => {
		// IMPORTANT: Set wpwlOptions BEFORE loading the HyperPay script
		// The widget reads these options when it initializes
		window.wpwlOptions = {
			style: "plain",
			locale: "ar",
			paymentTarget: "_top",
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
			brandDetectionPriority: ["CARTEBANCAIRE", "VISA", "MAESTRO", "MASTER"],
			onReady: function() {
				try {
					if (typeof $ !== 'undefined' && $) {
						$(".wpwl-group-cardHolder").after($(".wpwl-group-expiry"));
						$(".wpwl-group-cardNumber").before($(".wpwl-group-cardHolder"));
						$(".wpwl-control-cardNumber").css({'direction': 'ltr', "text-align": "right"});
					}
				} catch (e) {
					console.warn('jQuery not available for field rearrangement:', e);
				}
			},
			onChangeBrand: function() {
				try {
					if (typeof $ !== 'undefined' && $) {
						// Hide brands logic
						var $logos = $(".wpwl-group-card-logos-horizontal > div:not(.wpwl-hidden)");
						if ($logos.length >= 2) {
							$(".wpwl-group-card-logos-horizontal > div").removeClass("dots-hidden");
							if (!$(".dots").length) {
								$logos.first().after($("<div>...</div>").addClass("dots"));
								$logos.filter(function(index) { return index > 0; }).addClass("dots-hidden");
								$(".dots").click(function() {
									$(".dots-hidden").removeClass("dots-hidden");
									$(this).remove();
								});
							}
						}
					}
				} catch (e) {
					console.warn('jQuery not available for brand hiding:', e);
				}
			}
		};

		// Now load the HyperPay script
		const creditCardForm = document.createElement('script');
		creditCardForm.src = `${process.env.NEXT_PUBLIC_HYPERPAY}/v1/paymentWidgets.js?checkoutId=${checkoutID}`;
		creditCardForm.integrity = `${props.integrity}`;
		creditCardForm.crossOrigin = "anonymous";
		creditCardForm.async = true;
		document.head.appendChild(creditCardForm);

		return () => {
			// Cleanup
			if (creditCardForm.parentNode) {
				creditCardForm.parentNode.removeChild(creditCardForm);
			}
			// Clean up wpwlOptions
			delete window.wpwlOptions;
		};

	}, [checkoutID, props.integrity]);

	return (
		<div>
			<form action={verifyUrl} className="paymentWidgets" data-brands="VISA MASTER AMEX"></form>
		</div>
	)
}

