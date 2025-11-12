# Tamara QA Checklist

Use this guide to validate the Tamara via Hyperpay integration in both sandbox and production-like environments.

## 1. Availability & Messaging
- Trigger checkout for orders eligible for Tamara and confirm the option renders with instalment copy from `available_payment_labels` (Arabic/English).
- Force an ineligible order amount and verify the UI hides Tamara, shows the fallback toast, and displays the unavailable banner.
- Toggle locale and confirm the Tamara copy, fallback, and toast messages localize correctly.

## 2. Checkout Launch
- Select Tamara and ensure the widget script loads from `NEXT_PUBLIC_HYPERPAY` with brand `TAMARA`.
- Submit the Hyperpay form and verify the redirect target is `/payment?type=tamara&orderId=<id>&res=<status>`.
- Confirm the local storage context (`tamaraCheckoutContext`) stores checkout id, payment id, and clears after completion.

## 3. Redirect Handling
- `res=success`: check the payment page keeps polling until the backend reports a terminal status, then shows the localized success message and invoice link.
- `res=cancel`: ensure the payment page stops polling, clears context, and displays the cancellation message.
- `res=failure`: validate the failure message, absence of spinner, and that retrying Tamara is allowed.

## 4. Verification & Polling
- During a delayed authorization, confirm the spinner remains while polling (up to the configured attempts) and transitions to success once the backend marks the payment accepted.
- Simulate API errors or timeouts and confirm the UI surfaces the generic failure message and clears stored context.
- Verify `/orders/verifyTamaraPayment` receives the expected payload: `orderId`, `paymentId`.

## 5. Regression Checks
- Run payments with existing Hyperpay brands (`mada`, `credit`, `applepay`) to ensure no regressions in widget loading or submission.
- Validate coupons, free payments, and bank transfer flows still behave as before when Tamara is absent.
- Ensure analytics events (`Purchase Successfull` / `Purchase Fail`) fire appropriately for Tamara and other methods.

## 6. Custom Page (`customePage: true`)
- Trigger Tamara checkout with `customePage: true` and confirm the frontend behaviour matches the standard flow.
- Validate order data is hydrated from Mongo-backed orders and the widget still launches with the returned checkout id.

