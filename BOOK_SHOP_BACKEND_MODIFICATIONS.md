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
