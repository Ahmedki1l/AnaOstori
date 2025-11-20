import React, { useEffect, useMemo, useRef } from 'react'

export default function TamaraCheckoutForm({
	orderId,
	checkoutId,
	tamaraLabel,
	selectedLocale = 'ar',
	onError,
}) {
	const formRef = useRef(null)
	const locale = selectedLocale === 'ar' ? 'ar' : 'en'

	const tamaraCopy = useMemo(() => {
		if (!tamaraLabel) {
			return null
		}

		const localized = locale === 'ar' ? tamaraLabel.description_ar : tamaraLabel.description_en
		const fallback = locale === 'ar' ? tamaraLabel.description_en : tamaraLabel.description_ar

		return localized || fallback || null
	}, [tamaraLabel, locale])

	useEffect(() => {
		if (!checkoutId) {
			return
		}

		if (typeof window === 'undefined' || typeof document === 'undefined') {
			return
		}

		const previousWpwlOptions = window.wpwlOptions
		window.wpwlOptions = {
			locale,
			style: 'plain',
			paymentTarget: '_top',
		}

		const handleScriptError = () => {
			if (onError) {
				onError(new Error('Failed to load Tamara payment widget'))
			}
		}

		const script = document.createElement('script')
		script.src = `${process.env.NEXT_PUBLIC_HYPERPAY}/v1/paymentWidgets.js?checkoutId=${checkoutId}`
		script.async = true
		script.addEventListener('error', handleScriptError)
		document.head.appendChild(script)

		return () => {
			if (previousWpwlOptions) {
				window.wpwlOptions = previousWpwlOptions
			} else {
				delete window.wpwlOptions
			}

			script.removeEventListener('error', handleScriptError)
			if (document.head.contains(script)) {
				document.head.removeChild(script)
			}

			if (formRef.current) {
				formRef.current.innerHTML = ''
			}
		}
	}, [checkoutId, locale, onError])

	return (
		<div className="w-full p-4">
			{tamaraCopy && (
				<div className="mb-3 text-sm leading-6 text-gray-700 tamara-copy">
					{tamaraCopy}
				</div>
			)}
			<form
				ref={formRef}
				action={`${process.env.NEXT_PUBLIC_WEB_URL}/payment?type=tamara&orderId=${orderId}`}
				className="paymentWidgets"
				data-brands="TAMARA"
			/>
			<p className="mt-2 text-xs text-center text-gray-500">
				{locale === 'ar'
					? 'سيتم توجيهك إلى صفحة تمارا لإتمام عملية الدفع.'
					: 'You will be redirected to Tamara to complete the payment.'}
			</p>
		</div>
	)
} 