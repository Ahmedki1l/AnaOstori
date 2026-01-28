# Book Shop - Frontend Integration Guide

This guide provides all the information needed to integrate the Book Shop APIs into the Anaostori frontend.

---

## Base URL

```
https://your-api-gateway-url.execute-api.eu-central-1.amazonaws.com
```

---

## API Endpoints

### 1. Get Books (Customer View)

```http
GET /get-any?collection=Books
```

**Response:**
```json
[
  {
    "_id": "65abc123...",
    "title": "اسم الكتاب",
    "price": 100.00,
    "stock": 50,
    "pictureKey": "books/cover.jpg",
    "pictureBucket": "phase2anaostori",
    "published": true,
    "description": "وصف الكتاب",
    "createdAt": "2026-01-28T00:00:00Z"
  }
]
```

**Frontend Note:** Filter by `published: true` for customer-facing views.

---

### 2. Get Shop Configuration

```http
GET /get-any?collection=ShopConfiguration
```

**Response:**
```json
[
  {
    "deliveryFee": 30,
    "vatPercentage": 15
  }
]
```

---

### 3. Create Book Order

```http
POST /order/createBookOrder
Authorization: Bearer <firebase_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "bookId": "65abc123...",
  "quantity": 2,
  "buyerFullName": "أحمد محمد",
  "buyerPhone": "+966500000000",
  "buyerEmail": "ahmed@example.com",
  "deliveryAddress": {
    "street": "شارع الملك فهد",
    "city": "الرياض",
    "postalCode": "12345",
    "country": "Saudi Arabia"
  }
}
```

**Success Response (201):**
```json
{
  "id": 1234,
  "bookId": "65abc123...",
  "bookTitle": "اسم الكتاب",
  "quantity": 2,
  "unitPrice": 100.00,
  "totalPrice": 200.00,
  "deliveryFee": 30.00,
  "totalVat": 30.00,
  "grandTotal": 260.00,
  "status": "pending",
  "book": {
    "pictureKey": "books/cover.jpg",
    "pictureBucket": "phase2anaostori"
  },
  "deliveryAddress": {
    "street": "شارع الملك فهد",
    "city": "الرياض",
    "postalCode": "12345",
    "country": "Saudi Arabia"
  },
  "createdAt": "2026-01-28T12:00:00Z"
}
```

**Error Responses:**

| Code | Condition |
|------|-----------|
| 400 | Missing required fields |
| 404 | Book not found |
| 422 | Insufficient stock |

---

### 4. Initiate Payment

```http
POST /order/bookPaymentGateway
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderId": 1234,
  "type": "mada"
}
```

**Payment Types:**
- `mada` - Mada debit card
- `credit` - Visa/Mastercard
- `applepay` - Apple Pay
- `tamara` - Tamara BNPL
- `tabby` - Tabby BNPL

**Success Response (HyperPay - mada/credit/applepay):**
```json
[
  {
    "id": "8ac7a4c9...",
    "result": { "code": "000.200.100" }
  },
  { /* order object */ },
  "integrity_hash_string"
]
```

**Success Response (Tabby):**
```json
[
  {
    "id": "tabby_session_id",
    "url": "https://checkout.tabby.ai/...",
    "status": "created"
  },
  { /* order object */ }
]
```

---

### 5. Verify Payment

```http
POST /orders/verifyBookPayment
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderId": 1234,
  "transactionId": "8ac7a4c9..."
}
```

**Success Response:**
```json
[
  {
    "result": { "code": "000.000.000" },
    "paymentBrand": "MADA",
    "orderDetails": {
      "id": 1234,
      "bookTitle": "اسم الكتاب",
      "status": "paid",
      "invoiceKey": "orders/book-1234/invoice/file.pdf",
      "invoiceBucket": "phase2anaostori"
    }
  }
]
```

**Success Codes:**
- `000.000.000` - Transaction approved
- `000.100.110` - Request processed
- `000.100.111` - Transaction pending
- `000.100.112` - Transaction pending (acquirer)

---

### 6. Admin: List Book Orders

```http
POST /route
Content-Type: application/json
```

**Request Body:**
```json
{
  "routeName": "bookOrderList",
  "page": 1,
  "limit": 10,
  "order": "DESC",
  "status": "paid",
  "searchValue": "ahmed@example.com",
  "startDate": "2026-01-01",
  "endDate": "2026-01-31"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1234,
      "bookTitle": "اسم الكتاب",
      "quantity": 2,
      "grandTotal": 260.00,
      "buyerFullName": "أحمد محمد",
      "buyerPhone": "+966500000000",
      "buyerEmail": "ahmed@example.com",
      "status": "paid",
      "createdAt": "2026-01-28T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Filter Options:**
- `status`: pending, waiting, paid, processing, shipped, delivered, cancelled, failed
- `searchValue`: Searches buyerEmail, buyerPhone, buyerFullName, bookTitle
- `startDate`, `endDate`: Date range filter (YYYY-MM-DD)

---

### 7. Admin: Update Book Order

```http
POST /auth/route/post
Authorization: Bearer <admin_firebase_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "routeName": "updateBookOrder",
  "orderId": 1234,
  "status": "shipped",
  "assistanceAquired": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book order updated successfully.",
  "data": {
    "id": 1234,
    "status": "shipped",
    "assistanceAquired": true,
    "updatedAt": "2026-01-28T15:00:00Z"
  }
}
```

---

### 8. Admin: Create/Update/Delete Books

**Create Book:**
```http
POST /insert-any
Content-Type: application/json

{
  "collection": "Books",
  "title": "اسم الكتاب الجديد",
  "price": 150.00,
  "stock": 100,
  "pictureKey": "books/new-cover.jpg",
  "pictureBucket": "phase2anaostori",
  "published": true,
  "description": "وصف الكتاب"
}
```

**Update Book:**
```http
PUT /update-any
Content-Type: application/json

{
  "collection": "Books",
  "_id": "65abc123...",
  "price": 120.00,
  "stock": 75
}
```

**Delete Book:**
```http
DELETE /delete-any
Content-Type: application/json

{
  "collection": "Books",
  "_id": "65abc123..."
}
```

---

## Order Status Flow

```
pending → waiting → paid → processing → shipped → delivered
                  ↘ failed
pending → cancelled
```

| Status | Description |
|--------|-------------|
| `pending` | Order created, awaiting payment |
| `waiting` | Payment initiated |
| `paid` | Payment confirmed |
| `processing` | Admin preparing order |
| `shipped` | Order dispatched |
| `delivered` | Order received |
| `cancelled` | Order cancelled |
| `failed` | Payment failed |

---

## HyperPay Integration (mada/credit/applepay)

After getting checkout ID from `/order/bookPaymentGateway`, render the payment form:

```javascript
const checkoutId = response[0].id;
const integrity = response[2];

// Load HyperPay script
const script = document.createElement('script');
script.src = `https://eu-prod.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
script.setAttribute('data-brands', 'MADA VISA MASTER APPLEPAY');
document.head.appendChild(script);

// On payment complete, verify:
await fetch('/orders/verifyBookPayment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderId, transactionId: checkoutId })
});
```

---

## Tabby Integration

After getting checkout URL from `/order/bookPaymentGateway`:

```javascript
const tabbyUrl = response[0].url;
window.location.href = tabbyUrl;

// User redirects back to:
// - Success: /book-payment?type=tabby&orderId=1234&res=success
// - Cancel: /book-payment?type=tabby&orderId=1234&res=cancel
// - Failure: /book-payment?type=tabby&orderId=1234&res=failure
```

---

## Invoice Download

```javascript
const invoiceUrl = `https://${order.invoiceBucket}.s3.amazonaws.com/${order.invoiceKey}`;
window.open(invoiceUrl, '_blank');
```

---

## Price Calculation (for display)

```javascript
const calculatePrices = (unitPrice, quantity, deliveryFee, vatPercentage = 15) => {
  const totalPrice = unitPrice * quantity;
  const totalVat = totalPrice * (vatPercentage / 100);
  const grandTotal = totalPrice + totalVat + deliveryFee;
  
  return {
    unitPrice,
    totalPrice,
    totalVat,
    deliveryFee,
    grandTotal
  };
};
```

---

## Error Handling

All endpoints return consistent error format:

```json
{
  "message": "Error description",
  "error": "Technical error details"
}
```

| HTTP Code | Meaning |
|-----------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 404 | Not Found - Resource doesn't exist |
| 422 | Unprocessable - Business logic error (e.g., insufficient stock) |
| 500 | Server Error |
