# Book Shop - Backend API Requirements

> **Document Version**: 1.0  
> **Date**: 2026-01-28  
> **For**: Backend Development Team  

---

## Overview

This document outlines the backend API requirements for implementing the book selling feature on Anaostori. The frontend team needs these APIs to be implemented before we can complete the integration.

---

## 1. Books Collection (MongoDB)

### Collection Schema: `Books`

```javascript
{
  _id: ObjectId,                    // Auto-generated
  title: String,                    // Required, Book title
  description: String,              // Required, Book description (supports markdown)
  price: Number,                    // Required, Base price in SAR (excluding VAT)
  pictureKey: String,               // S3 key for book cover image
  pictureBucket: String,            // S3 bucket name
  stock: Number,                    // Available stock quantity (default: 0)
  published: Boolean,               // Whether book is visible on shop (default: false)
  createdAt: Date,                  // Auto-set on creation
  updatedAt: Date                   // Auto-update on modification
}
```

### API Endpoints

#### 1.1 GET `/get-any?collection=Books`
Fetch all books. Filter by `published: true` for customer-facing page.

**Response (200):**
```json
[
  {
    "_id": "64abc123...",
    "title": "كتاب القدرات الشامل",
    "description": "دليلك الشامل لاختبار القدرات...",
    "price": 150,
    "pictureKey": "books/book1.jpg",
    "pictureBucket": "phase2anaostori",
    "stock": 100,
    "published": true,
    "createdAt": "2026-01-28T10:00:00Z",
    "updatedAt": "2026-01-28T10:00:00Z"
  }
]
```

#### 1.2 POST `/insert-any` (Admin Only - Requires Auth)
Create a new book.

**Request:**
```json
{
  "collection": "Books",
  "title": "كتاب جديد",
  "description": "وصف الكتاب",
  "price": 200,
  "pictureKey": "books/new-book.jpg",
  "pictureBucket": "phase2anaostori",
  "stock": 50,
  "published": false
}
```

**Response (201):**
```json
{
  "_id": "64abc456...",
  "title": "كتاب جديد",
  ...
}
```

#### 1.3 PUT `/update-any` (Admin Only - Requires Auth)
Update an existing book.

**Request:**
```json
{
  "collection": "Books",
  "_id": "64abc123...",
  "price": 175,
  "stock": 80,
  "published": true
}
```

#### 1.4 DELETE `/delete-any` (Admin Only - Requires Auth)
Delete a book.

**Request:**
```json
{
  "collection": "Books",
  "_id": "64abc123..."
}
```

---

## 2. Shop Configuration Collection (MongoDB)

### Collection Schema: `ShopConfiguration`

```javascript
{
  _id: ObjectId,
  deliveryFee: Number,              // Delivery fee in SAR
  vatPercentage: Number,            // VAT percentage (default: 15)
  currency: String,                 // Currency code (default: "SAR")
  updatedAt: Date
}
```

### API Endpoints

#### 2.1 GET `/get-any?collection=ShopConfiguration`
Fetch shop configuration.

**Response (200):**
```json
[
  {
    "_id": "config123...",
    "deliveryFee": 30,
    "vatPercentage": 15,
    "currency": "SAR",
    "updatedAt": "2026-01-28T10:00:00Z"
  }
]
```

#### 2.2 PUT `/update-any` (Admin Only)
Update shop configuration.

**Request:**
```json
{
  "collection": "ShopConfiguration",
  "_id": "config123...",
  "deliveryFee": 35
}
```

---

## 3. Book Orders (RDS - Similar to existing Orders table)

### Table Schema: `BookOrders`

```sql
CREATE TABLE BookOrders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bookId VARCHAR(50) NOT NULL,
  bookTitle VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unitPrice DECIMAL(10,2) NOT NULL,
  deliveryFee DECIMAL(10,2) NOT NULL DEFAULT 0,
  totalPrice DECIMAL(10,2) NOT NULL,
  totalVat DECIMAL(10,2) NOT NULL,
  grandTotal DECIMAL(10,2) NOT NULL,
  
  -- Buyer Information
  buyerFullName VARCHAR(255) NOT NULL,
  buyerPhone VARCHAR(20) NOT NULL,
  buyerEmail VARCHAR(255) NOT NULL,
  
  -- Delivery Address
  deliveryStreet VARCHAR(500),
  deliveryCity VARCHAR(100),
  deliveryPostalCode VARCHAR(20),
  deliveryCountry VARCHAR(100) DEFAULT 'Saudi Arabia',
  
  -- Payment Information
  paymentMethod VARCHAR(50),            -- 'hyperpay', 'bank_transfer', 'tamara'
  cardType VARCHAR(50),                 -- 'mada', 'credit', 'apple'
  cardBrand VARCHAR(50),                -- 'visa', 'mastercard'
  transactionId VARCHAR(255),
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
  
  -- Invoice
  invoiceKey VARCHAR(255),
  invoiceBucket VARCHAR(100),
  
  -- Tracking
  assistanceAquired BOOLEAN DEFAULT FALSE,
  
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Order Status Flow

```
pending → paid → processing → shipped → delivered
                    ↓            ↓          ↓
              cancelled    cancelled   (final)
```

---

## 4. Book Order API Endpoints

### 4.1 POST `/order/createBookOrder`
Create a new book order.

**Request (Authenticated):**
```json
{
  "bookId": "64abc123...",
  "quantity": 2,
  "buyerFullName": "أحمد محمد",
  "buyerPhone": "+966501234567",
  "buyerEmail": "ahmed@example.com",
  "deliveryAddress": {
    "street": "شارع الملك فهد، حي النخيل",
    "city": "الرياض",
    "postalCode": "12345",
    "country": "Saudi Arabia"
  }
}
```

**Backend Logic:**
1. Fetch book from `Books` collection
2. Check stock availability (`book.stock >= quantity`)
3. Fetch `ShopConfiguration` for delivery fee and VAT percentage
4. Calculate prices:
   - `unitPrice = book.price`
   - `totalPrice = unitPrice * quantity`
   - `totalVat = totalPrice * (vatPercentage / 100)`
   - `grandTotal = totalPrice + totalVat + deliveryFee`
5. Create order in `BookOrders` table with status `pending`
6. (Optional) Reduce book stock

**Response (201):**
```json
{
  "id": 1001,
  "bookId": "64abc123...",
  "bookTitle": "كتاب القدرات الشامل",
  "quantity": 2,
  "unitPrice": 150,
  "totalPrice": 300,
  "deliveryFee": 30,
  "totalVat": 45,
  "grandTotal": 375,
  "status": "pending",
  "book": {
    "pictureKey": "books/book1.jpg",
    "pictureBucket": "phase2anaostori"
  },
  "createdAt": "2026-01-28T12:00:00Z"
}
```

---

### 4.2 POST `/order/bookPaymentGateway`
Initiate payment for book order. **Similar to existing `/order/testPaymentGateway`**.

**Request (Authenticated):**
```json
{
  "orderId": 1001,
  "orderType": "book",
  "type": "mada",           // "mada" | "credit" | "applepay" | "tamara"
  "withcoupon": false,
  "couponId": null
}
```

**Backend Logic:**
1. Fetch order from `BookOrders`
2. Validate order status is `pending`
3. Calculate total (apply coupon if provided)
4. Create HyperPay/Tamara checkout
5. Return checkout ID

**Response (200):**
```json
[
  {
    "id": "8AC7A4C9...",      // checkoutId
    "result": {
      "code": "000.200.100",
      "description": "successfully created checkout"
    }
  },
  {
    "id": 1001,               // orderId
    "grandTotal": 375
  },
  "sha384-integrity-hash"    // integrity for HyperPay
]
```

For Tamara, include `tamaraOptions`:
```json
{
  "id": "8AC7A4C9...",
  "tamaraOptions": {
    "available_payment_labels": ["pay_in_4"]
  }
}
```

---

### 4.3 POST `/orders/verifyBookPayment`
Verify book order payment. **Similar to existing `/orders/verifyPayment`**.

**Request (Authenticated):**
```json
{
  "orderId": 1001,
  "transactionId": "8AC7A4C9..."
}
```

**Backend Logic:**
1. Call HyperPay to verify payment
2. Update order status to `paid` if successful
3. Generate invoice (PDF to S3)
4. Update `invoiceKey` and `invoiceBucket`

**Response (200):**
```json
[
  {
    "result": {
      "code": "000.000.000",
      "description": "Transaction succeeded"
    },
    "orderDetails": {
      "id": 1001,
      "bookTitle": "كتاب القدرات الشامل",
      "status": "paid",
      "invoiceKey": "invoices/book-order-1001.pdf",
      "invoiceBucket": "phase2anaostori"
    }
  }
]
```

---

### 4.4 POST `/route` with `routeName: bookOrderList`
Fetch paginated book orders for admin.

**Request:**
```json
{
  "routeName": "bookOrderList",
  "page": 1,
  "limit": 10,
  "order": "createdAt DESC",
  "searchType": "buyerEmail",       // Optional: "buyerEmail" | "buyerPhone" | "buyerFullName"
  "searchValue": "ahmed@",          // Optional
  "filterType": "status",           // Optional
  "filterValue": "processing",      // Optional
  "startDate": "2026-01-01",        // Optional
  "endDate": "2026-01-31"           // Optional
}
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1001,
      "bookId": "64abc123...",
      "bookTitle": "كتاب القدرات الشامل",
      "quantity": 2,
      "grandTotal": 375,
      "buyerFullName": "أحمد محمد",
      "buyerPhone": "+966501234567",
      "buyerEmail": "ahmed@example.com",
      "status": "processing",
      "paymentMethod": "hyperpay",
      "cardType": "mada",
      "assistanceAquired": false,
      "createdAt": "2026-01-28T12:00:00Z",
      "updatedAt": "2026-01-28T14:00:00Z"
    }
  ],
  "totalItems": 50,
  "currentPage": 1,
  "totalPages": 5
}
```

---

### 4.5 POST `/auth/route/post` with `routeName: updateBookOrder`
Update book order (admin).

**Request (Admin Auth Required):**
```json
{
  "routeName": "updateBookOrder",
  "orderUpdate": true,
  "id": 1001,
  "status": "shipped"
}
```

**Also support `assistanceAquired` toggle:**
```json
{
  "routeName": "updateBookOrder",
  "orderUpdate": true,
  "id": 1001,
  "assistanceAquired": true
}
```

**Response (200):**
```json
{
  "id": 1001,
  "status": "shipped",
  "updatedAt": "2026-01-28T16:00:00Z"
}
```

---

## 5. File Upload (Existing)

Use existing `/file/upload` endpoint for book cover images.

---

## 6. Priority & Timeline

| Priority | Task | Estimated Effort |
|----------|------|------------------|
| P0 | Books collection CRUD | 2 hours |
| P0 | ShopConfiguration collection | 1 hour |
| P0 | BookOrders table + createBookOrder | 4 hours |
| P0 | bookPaymentGateway (reuse existing) | 3 hours |
| P0 | verifyBookPayment (reuse existing) | 2 hours |
| P1 | bookOrderList (admin) | 2 hours |
| P1 | updateBookOrder | 1 hour |
| P2 | Invoice generation for books | 2 hours |

**Total Estimated Effort**: ~17 hours

---

## 7. Notes for Backend Team

1. **Reuse Existing Payment Infrastructure**: The `bookPaymentGateway` and `verifyBookPayment` should follow the same logic as `testPaymentGateway` and `verifyPayment`. The main difference is the order type and table.

2. **Stock Management**: Consider deducting stock when order is paid, not when created (to handle payment failures).

3. **VAT Calculation**: Use the same 15% VAT as courses.

4. **Invoice Generation**: Extend existing invoice template for book orders.

5. **Authorization**: 
   - Customer endpoints require Firebase auth token
   - Admin endpoints require instructor/admin role check

6. **Error Handling**: Return appropriate error codes:
   - 400: Invalid request (missing fields, invalid quantity)
   - 401: Unauthorized
   - 404: Book not found
   - 422: Out of stock
   - 500: Server error

---

## 8. Contact

For questions or clarifications, please reach out to the frontend team.
