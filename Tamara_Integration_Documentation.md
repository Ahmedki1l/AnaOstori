# Tamara via Hyperpay Integration Guide

This document explains how the frontend should integrate the new Tamara payment option that runs through Hyperpay’s checkout flow.

## 1. Trigger Tamara Checkout

Call the existing checkout endpoint with `type: "tamara"`.

```json
POST /testPaymentGateway
{
  "orderId": 12345,
  "type": "tamara",
  "customePage": false
}
```

### Response Shape

The handler returns an array. For Tamara the shape is:

```json
[
  {
    "id": "8ac7a4c...checkout-id",
    "result": { "code": "000.200.100", "description": "successfully created checkout" },
    "tamaraOptions": {
      "has_available_payment_options": true,
      "available_payment_labels": [
        {
          "payment_type": "PAY_BY_INSTALMENTS",
          "instalment": 4,
          "description_en": "Split in up to 4 payments or pay in full with Tamara",
          "description_ar": "قسم فاتورتك حتى 4 دفعات أو ادفعها كاملة بكل سهولة وأمان مع تمارا"
        }
      ]
    },
    "timestamp": "...",
    "ndc": "..."
  },
  {
    "id": 12345,
    "paymentMethod": "tamara",
    "cardType": "tamara",
    "...": "order fields"
  }
]
```

Key details for the UI:
- `checkoutResult.id` is the Hyperpay checkout ID (`CheckoutId`) used to launch the payment widget.
- `checkoutResult.tamaraOptions.available_payment_labels` provides the copy you should display beside the payment button.

## 2. Launch Hyperpay Checkout

Embed Hyperpay’s widget as usual, passing the checkout ID from step 1.

```html
<script src="https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=CHECKOUT_ID"></script>

<form action="https://www.anaostori.com/payment" class="paymentWidgets" data-brands="TAMARA"></form>
```

Notes:
- Use the `eu-test` host in sandbox and `eu-prod` in production.
- `data-brands` must include `TAMARA` for this flow.
- The widget automatically redirects to Tamara’s page because the backend adds `testMode=EXTERNAL`.

## 3. Display Tamara Messaging

Provide instalment details near the payment button or in the order summary. Example React snippet:

```tsx
const tamaraLabel = checkoutResult.tamaraOptions?.available_payment_labels?.[0];

return (
  <div>
    <button onClick={startHyperpay}>Pay with Tamara</button>
    {tamaraLabel && (
      <small className="tamara-copy">
        {selectedLocale === 'ar'
          ? tamaraLabel.description_ar
          : tamaraLabel.description_en}
      </small>
    )}
  </div>
);
```

## 4. Handle Redirects

Hyperpay/Tamara redirects users back with `https://www.anaostori.com/payment?type=tamara&orderId=<id>&res=<status>`. The frontend should:
1. Read the query string.
2. Display a status message (success, cancel, failure).
3. Optionally poll `/verifyPayment` until the backend confirms status `accepted`.

## 5. Custom Page (`customePage: true`)

The same response structure is returned when `customePage` is `true`. The difference is that the backend pulls order data from MongoDB. Frontend behaviour does not change.

## 6. Error Surface

- If Hyperpay declines the checkout creation the endpoint responds with HTTP 400 and the Hyperpay payload; surface a generic failure message and re-enable the payment button.
- If `tamaraOptions.available_payment_labels` is empty, disable Tamara for that order and show a fallback message (“Tamara is not available for this amount”).

## 7. QA Checklist

1. Confirm the Tamara option appears only when available (label array length > 0).
2. Ensure the instalment copy renders in both English and Arabic.
3. Verify redirects handle `res=success|cancel|failure`.
4. After success, confirm `/verifyPayment` or the webhook sets the order’s `paymentMethod` to `tamara`.
5. Regression: verify other Hyperpay brands still function (`mada`, `credit`, `applepay`).

Refer to `Tamara_Hyperpay_Testing.md` for detailed sandbox steps. Once these behaviours are confirmed the frontend integration is complete.

