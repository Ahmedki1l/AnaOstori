# Phase 2: Backend-Dependent Frontend Fixes

⚠️ **Blocked until backend endpoints are ready.**

---

## Issue 3: Coupon/Discount UI

**Blocked by**: `validateBookCoupon` endpoint

### Changes Required
1. **[NEW]** `CouponInputField` component
2. **[MODIFY]** `pages/bookPayment.js` - Add coupon state and API call
3. **[MODIFY]** `components/BookPayment/BookOrderSummary.js` - Display discount

### Implementation
```jsx
// CouponInputField.js
const CouponInputField = ({ onApply, discount }) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleApply = async () => {
        setLoading(true);
        const result = await validateBookCouponAPI(code);
        onApply(result);
        setLoading(false);
    };
    
    return (
        <div className={styles.couponField}>
            <input value={code} onChange={(e) => setCode(e.target.value)} />
            <button onClick={handleApply} disabled={loading}>تطبيق</button>
        </div>
    );
};
```

---

## Issue 7: Guest Checkout UI

**Blocked by**: `createGuestBookOrder` endpoint

### Changes Required
1. **[MODIFY]** `pages/bookPayment.js` - Guest checkout flow
2. **[MODIFY]** `services/apisService.js` - Non-auth API call

### Implementation
```jsx
// Detect guest vs authenticated
const isGuest = !user;

const handleSubmit = async () => {
    if (isGuest) {
        await createGuestBookOrderAPI(orderData);
    } else {
        await createBookOrderAPI(orderData);
    }
};
```

---

## Issue 9: Book Orders in Purchase Inquiry

**Blocked by**: Book orders in `orderQuery` response

### Changes Required
1. **[MODIFY]** `pages/purchaseInquiry.js` - Handle both order types

### Implementation
```jsx
// Display based on order type
{data.type === 'book' ? (
    <td>
        <p>{data.bookTitle}</p>
        <p>الكمية: {data.quantity}</p>
        <p>{data.deliveryAddress?.city}</p>
    </td>
) : (
    <td>
        {data.orderItems?.map(...)}  // existing course logic
    </td>
)}
```

---

## Testing Checklist (After Backend Ready)

- [ ] Coupon applies discount correctly
- [ ] Guest can complete purchase without login
- [ ] Book orders appear in purchase inquiry with correct details
