# Book Shop Backend Modifications Required

**Date:** January 29, 2026  
**Priority:** High

---

## 1. New Address Fields in `deliveryAddress`

The `createBookOrder` endpoint needs to accept and store additional address fields:

### Updated Request Payload
```json
{
  "bookId": "string",
  "quantity": "number",
  "buyerFullName": "string",
  "buyerPhone": "string", 
  "buyerEmail": "string",
  "deliveryAddress": {
    "city": "string (required)",
    "district": "string (required)",      // NEW
    "street": "string (required)",
    "buildingNumber": "string (required)", // NEW
    "additionalCode": "string (optional)", // NEW
    "postalCode": "string (required)",
    "shortAddress": "string (optional)",   // NEW
    "country": "string (required)"
  }
}
```

### Schema Updates for `BookOrders`

Add these columns to the `deliveryAddress` object/JSON:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `district` | string | ✅ | الحي (Neighborhood/District) |
| `buildingNumber` | string | ✅ | رقم المبنى (Building number) |
| `additionalCode` | string | ❌ | الرمز الإضافي (Additional code) |
| `shortAddress` | string | ❌ | العنوان المختصر (Short address - Saudi National Address format) |

---

## 2. VAT Handling

**No backend change required.**

Book prices stored in the database are already inclusive of VAT. The frontend has been updated to:
- Remove VAT calculation from the order total
- Display a note: "الأسعار شاملة ضريبة القيمة المضافة"

---

## Summary

| Component | Change | Priority |
|-----------|--------|----------|
| `BookOrders` schema | Add 4 new address fields | High |
| `createBookOrder` handler | Accept new address fields | High |
| VAT calculation | No change needed | - |

---

## 3. Payment Gateway Status Fix (URGENT)

**Issue:** When attempting to initiate payment via `bookPaymentGateway`, the backend returns:
```
"Cannot initiate payment for order with status: waiting"
```

**Current Behavior:**
- `createBookOrder` creates an order with status `"waiting"`
- `bookPaymentGateway` rejects payment initiation for orders with status `"waiting"`

**Required Fix:**
The `bookPaymentGateway` handler must allow payment initiation for orders with status `"waiting"`. This is the expected flow:

1. User fills delivery form → `createBookOrder` → Order created with status `"waiting"`
2. User selects payment method → `bookPaymentGateway` → Should work for status `"waiting"`
3. Payment completed → Order status updated to `"paid"` or `"pending_payment"`

**Solution Options:**
1. **Update payment gateway handler** - Allow status `"waiting"` in the valid statuses for payment initiation
2. **Change initial status** - Create orders with a status that's already accepted by the payment gateway

**Priority:** CRITICAL - Blocking all book purchases

