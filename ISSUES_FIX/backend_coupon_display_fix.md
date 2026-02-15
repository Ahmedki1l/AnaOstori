# Backend Fix Required: Admin Panel Shows Full Price Instead of Discounted Price

## Problem

When a user subscribes using a **coupon code**, the admin panel shows the **full course price** instead of the **discounted price** the user actually paid.

## Root Cause

The frontend admin panel (`managePurchaseOrder/index.js`) displays the order amount using this formula:

```javascript
// Line 165 in pages/instructorPanel/managePurchaseOrder/index.js
Number(Number(_record.totalPrice) + Number(_record.totalVat)).toFixed(2)
```

The admin reads **only** `totalPrice` and `totalVat` from the order record. There is **no** `couponDiscount`, `discountAmount`, or `couponCode` field available on the order object returned by the `orderList` API.

## What Needs to Change (Backend)

The `totalPrice` stored in the order record should reflect the **actual amount paid after coupon discount**, OR the API should return additional coupon fields so the frontend can display both.

### Option A: Store the discounted price as `totalPrice` (Recommended)
When an order is created with a coupon, set `totalPrice` = original price − coupon discount.  
This way the admin automatically sees the correct amount with zero frontend changes.

### Option B: Add coupon fields to the order record
Add these fields to the order model and include them in the `orderList` API response:

| Field | Type | Description |
|---|---|---|
| `couponUsed` | Boolean | Whether a coupon was applied |
| `couponCode` | String | The coupon code used |
| `couponDiscount` | Number | The discount percentage or fixed amount |
| `discountAmount` | Number | The actual amount deducted (in SAR) |

Then the frontend can display:
- المبلغ الأصلي (original): `totalPrice + totalVat`
- الخصم (discount): `discountAmount`
- المبلغ المدفوع (paid): `totalPrice + totalVat - discountAmount`

### API Affected
- **Route**: `orderList` (used by `postRouteAPI` with `routeName: "orderList"`)
- **File**: Wherever the order model/handler processes coupon-applied orders

### Also Check
- The **invoice generation** (`uploadInvoice.js`) already uses `couponDiscount` and `couponName` — confirm these fields are populated correctly on the order when a coupon is applied.
- The `confirmFreePayment` endpoint should also store coupon info when a 100% discount coupon is used.
