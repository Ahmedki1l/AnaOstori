# Phase 1: Independent Frontend Fixes

No backend changes required.

---

## Issue 1: Navbar Order (Store Before Blog)

**File**: `components/Navbar/Navbar.js`

Swap link order in desktop (~L425-429) and mobile (~L476-479):
```diff
- <Link href={'/blog'}>المدونة</Link>
- <Link href={'/books'}>متجر الكتب</Link>
+ <Link href={'/books'}>متجر الكتب</Link>
+ <Link href={'/blog'}>المدونة</Link>
```

---

## Issue 2: Books Link in Tahsili Course

**File**: Course description page component

Add promotional link when course is "التحصيلي":
```jsx
{course?.category?.name === 'التحصيلي' && (
    <Link href="/books" className={styles.booksPromo}>
        📚 تصفح كتب التحصيلي
    </Link>
)}
```

---

## Issue 5: Phone/Email Validation

**File**: `pages/bookPayment.js` (L137-178)

Saudi phone regex:
```javascript
const saudiPhoneRegex = /^(05|5|9665|00966|\+9665)[0-9]{8}$/;
const normalizedPhone = formData.buyerPhone.replace(/[\s-]/g, '');
if (!saudiPhoneRegex.test(normalizedPhone)) {
    newErrors.buyerPhone = 'رقم الجوال غير صحيح - يجب أن يبدأ بـ 05';
}
```

---

## Issue 6: Back Button Behavior

**File**: `pages/bookPayment.js`

History API handling:
```javascript
useEffect(() => {
    if (step === 2) {
        window.history.pushState({ step: 2 }, '', window.location.href);
    }
    const handlePopState = (e) => {
        if (step === 2) {
            e.preventDefault();
            setStep(1);
            window.history.pushState({ step: 1 }, '', window.location.href);
        }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
}, [step]);
```

---

## Issue 8: Navbar Spacing

**File**: `components/Navbar/Navbar.module.scss`

Visual investigation needed for specific spacing values.

---

## Testing Checklist

- [x] Store appears before Blog in navbar
- [x] Books link visible on Tahsili course page
- [x] Phone `0512345678` ✅, `123456789` ❌
- [x] Browser back on payment step → returns to summary
- [ ] Navbar spacing is consistent (needs visual verification)
