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

---

## 4. Bank Transfer Receipt Upload Flow (NEW)

The frontend now implements a bank transfer payment flow where users upload their transfer receipt. The backend needs to support this.

### 4.1 New Endpoint: `uploadBankTransferReceipt`

**Route:** `POST /order/uploadBankTransferReceipt` (or via `postAuthRoute`)

**Request Payload:**
```json
{
  "routeName": "uploadBankTransferReceipt",
  "orderId": "string",
  "receiptUrl": "string (S3 URL)",
  "receiptKey": "string (S3 key)",
  "receiptBucket": "string (S3 bucket)"
}
```

**Expected Behavior:**
1. Update the BookOrder with the receipt information
2. Change order status to `"pending_review"` or `"receipt_uploaded"`
3. Return success response

### 4.2 Schema Updates for `BookOrders`

Add these fields to store receipt information:

| Field | Type | Description |
|-------|------|-------------|
| `receiptUrl` | string | Full S3 URL of the uploaded receipt |
| `receiptKey` | string | S3 object key |
| `receiptBucket` | string | S3 bucket name |
| `receiptUploadedAt` | datetime | When the receipt was uploaded |
| `paymentVerifiedAt` | datetime | When admin verified the payment |
| `paymentVerifiedBy` | string | Admin user who verified |

### 4.3 New Order Statuses

Add these statuses for bank transfer orders:

| Status | Description |
|--------|-------------|
| `pending_receipt` | Order created, waiting for receipt upload |
| `pending_review` | Receipt uploaded, waiting for admin review |
| `payment_verified` | Admin verified, ready to ship |
| `payment_rejected` | Admin rejected the receipt |

### 4.4 Admin Order Management Updates

The admin "إدارة طلبات الكتب" (Book Orders Management) page needs to:

1. **Filter by payment status** - Show orders pending receipt review
2. **Display receipt** - View uploaded receipt image/PDF
3. **Verify/Reject actions:**
   - "تأكيد الدفع" (Verify Payment) → Changes status to `payment_verified`
   - "رفض الإيصال" (Reject Receipt) → Changes status to `payment_rejected` + optional reason

#### Updated `bookOrderList` Response

The `bookOrderList` endpoint must include these additional fields in each order object:

```json
{
  "id": "string",
  "bookTitle": "string",
  "quantity": "number",
  "buyerFullName": "string",
  "status": "string",
  "grandTotal": "number",
  "createdAt": "datetime",
  
  // NEW: Receipt fields (for bank transfer orders)
  "receiptUrl": "string | null",
  "receiptKey": "string | null",
  "receiptBucket": "string | null",
  "receiptUploadedAt": "datetime | null",
  
  // NEW: Verification fields
  "paymentVerifiedAt": "datetime | null",
  "paymentVerifiedBy": "string | null",
  "paymentRejectionReason": "string | null",
  
  // Existing fields...
  "buyerPhone": "string",
  "buyerEmail": "string",
  "deliveryStreet": "string",
  "deliveryCity": "string",
  "deliveryPostalCode": "string",
  "deliveryCountry": "string",
  "unitPrice": "number",
  "totalPrice": "number",
  "totalVat": "number",
  "deliveryFee": "number",
  "invoiceKey": "string | null",
  "invoiceBucket": "string | null"
}
```

**Frontend expects:**
- Receipt is viewable if `receiptUrl` OR (`receiptKey` AND `receiptBucket`) is present
- Verify/Reject buttons shown only when `status === 'pending_review'`
- Verification info shown when `paymentVerifiedAt` is present

### 4.5 New Admin Endpoint: `verifyBankTransferPayment`

**Route:** `POST /order/verifyBankTransferPayment` (or via `postAuthRoute`)

**Request Payload:**
```json
{
  "routeName": "verifyBankTransferPayment",
  "orderId": "string",
  "action": "verify" | "reject",
  "rejectionReason": "string (optional, for reject action)"
}
```

**Expected Behavior:**
- **verify:** Update status to `payment_verified`, set `paymentVerifiedAt` and `paymentVerifiedBy`
- **reject:** Update status to `payment_rejected`, store reason, send notification to user

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully" | "Payment rejected",
  "order": { /* updated order object */ }
}
```

---

## Updated Summary

| Component | Change | Priority |
|-----------|--------|----------|
| `BookOrders` schema | Add 4 new address fields | High |
| `BookOrders` schema | Add receipt upload fields | High |
| `BookOrders` schema | Add new bank transfer statuses | High |
| `createBookOrder` handler | Accept new address fields | High |
| `bookPaymentGateway` handler | Allow "waiting" status | CRITICAL |
| `uploadBankTransferReceipt` | New endpoint for receipt upload | High |
| `verifyBankTransferPayment` | New admin endpoint | High |
| `bookOrderList` response | Include receipt & verification fields | High |
| Admin orders page | View receipt, verify/reject actions | High |
| VAT calculation | No change needed | - |
