# دليل استخدام APIs للفرونت اند - نظام الدورات المسجلة

## تاريخ الوثيقة
**التاريخ:** ديسمبر 2024  
**النسخة:** 1.0

---

## نظرة عامة

هذا الدليل يشرح كيفية استخدام الـ APIs المطلوبة لدعم نظام الدورات المسجلة والعينات المجانية في الفرونت اند.

---

## API 1: `getItemByIdNoAuth`

### الوصف
API للوصول إلى محتوى الدروس (items) بدون authentication، مع السماح بالوصول للدروس المجانية فقط.

### Endpoint
```
GET /route/fetch?routeName=getItemByIdNoAuth&courseId={courseId}&itemId={itemId}
```

### Parameters
- `routeName` (required): `getItemByIdNoAuth`
- `courseId` (required): معرف الدورة (UUID)
- `itemId` (required): معرف الدرس/العنصر (UUID)

### Authentication
- **غير مطلوب** - يمكن الوصول بدون تسجيل دخول
- إذا كان المستخدم مسجل دخول، سيتم التحقق من enrollment تلقائياً

### Response Format (Success - 200)
```json
{
  "data": {
    "id": "itemId",
    "name": "اسم الدرس",
    "description": "وصف الدرس",
    "type": "video|file|quiz",
    "url": "https://...", 
    "linkKey": "...",
    "linkBucket": "...",
    "sectionItem": {
      "freeUsage": true,
      "order": 1
    }
  }
}
```

### Error Responses

#### 403 Forbidden
```json
{
  "message": "Access denied. This content requires enrollment."
}
```

#### 404 Not Found
```json
{
  "message": "item not found"
}
```
أو
```json
{
  "message": "item not found in this course"
}
```

### مثال على الاستخدام

#### JavaScript/TypeScript
```javascript
async function getItemByIdNoAuth(courseId, itemId) {
  try {
    const response = await fetch(
      `/route/fetch?routeName=getItemByIdNoAuth&courseId=${courseId}&itemId=${itemId}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      if (response.status === 403) {
        console.error('Access denied:', error.message);
        // عرض رسالة للمستخدم: "هذا المحتوى يتطلب التسجيل في الدورة"
      } else if (response.status === 404) {
        console.error('Item not found:', error.message);
      }
      throw new Error(error.message);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching item:', error);
    throw error;
  }
}

// استخدام
const itemData = await getItemByIdNoAuth('course-123', 'item-456');
console.log('Video URL:', itemData.url);
```

#### React Hook Example
```typescript
import { useState, useEffect } from 'react';

function useItemByIdNoAuth(courseId: string, itemId: string) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItem() {
      try {
        setLoading(true);
        const response = await fetch(
          `/route/fetch?routeName=getItemByIdNoAuth&courseId=${courseId}&itemId=${itemId}`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
        
        const result = await response.json();
        setItem(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (courseId && itemId) {
      fetchItem();
    }
  }, [courseId, itemId]);

  return { item, loading, error };
}
```

**ملاحظة مهمة:** هذا API (`getItemByIdNoAuth`) **جاهز من Backend** لكن **لم يُستخدم بعد في الكود الحالي**. الكود الحالي في `handleCourseItemClick` يستخدم `mediaUrl(item.linkBucket, item.linkKey)` مباشرة. 

**الشغل المنجز في Frontend:**
- ✅ تم إضافة التحقق من `freeUsage` في `handleCourseItemClick`
- ✅ تم إضافة التحقق من `enrollment` للطلاب المسجلين
- ✅ تم تحسين UI لعرض العينات المجانية
- ⏳ **متبقي:** تحديث الكود لاستخدام `getItemByIdNoAuth` للوصول للعينات المجانية بدلاً من `mediaUrl` مباشرة

---

## API 2: `getCourseCurriculumNoAuth`

### الوصف
API للحصول على محتوى الدورة بدون authentication. يعيد جميع sections و items مع خاصية `freeUsage`.

### Endpoint
```
GET /route/fetch?routeName=getCourseCurriculumNoAuth&courseId={courseId}
```

### Parameters
- `routeName` (required): `getCourseCurriculumNoAuth`
- `courseId` (required): معرف الدورة (UUID)

### Response Format (Success - 200)
```json
{
  "sections": [
    {
      "id": "sectionId",
      "name": "اسم القسم",
      "order": 1,
      "items": [
        {
          "id": "itemId",
          "name": "اسم الدرس",
          "type": "video|file|quiz",
          "sectionItem": {
            "freeUsage": true,
            "order": 1
          }
        }
      ]
    }
  ],
  "course": {
    "id": "courseId",
    "name": "اسم الدورة"
  }
}
```

**ملاحظة:** إذا كان Backend يعيد response في `data` wrapper، سيتم تحويله تلقائياً بواسطة axios. الكود الحالي يستخدم `response.data` مباشرة.

### مثال على الاستخدام

```javascript
async function getCourseCurriculum(courseId) {
  const response = await fetch(
    `/route/fetch?routeName=getCourseCurriculumNoAuth&courseId=${courseId}`
  );
  const result = await response.json();
  return result;
}

// استخدام
const curriculum = await getCourseCurriculum('course-123');

// عرض items المجانية فقط
curriculum.sections.forEach(section => {
  section.items.forEach(item => {
    if (item.sectionItem.freeUsage) {
      console.log('Free item:', item.name);
    }
  });
});
```

**الشغل المنجز في Frontend:**
- ✅ تم استخدام هذا API في `getServerSideProps` في `pages/[catagoryName]/[courseName]/index.js`
- ✅ تم عرض المحتوى في صفحة الكورس مع خاصية `freeUsage`
- ✅ تم تحسين `handleCourseItemClick` للتحقق من `freeUsage` قبل عرض المحتوى

---

## API 3: `addItemToSection` (محسّن)

### الوصف
API لإضافة عناصر جديدة إلى قسم في الدورة. يدعم `order` كمعامل اختياري.

### Endpoint
```
POST /route
```

### Request Body
```json
{
  "routeName": "addItemToSection",
  "sectionId": "sectionId",
  "items": [
    {
      "id": "itemId1",
      "order": 1
    },
    {
      "id": "itemId2"
    }
  ]
}
```

**أو** (الصيغة القديمة المدعومة):
```json
{
  "routeName": "addItemToSection",
  "sectionId": "sectionId",
  "items": ["itemId1", "itemId2"]
}
```

### Response Format (Success - 200)
```json
{
  "data": {
    "items": [
      {
        "id": "itemId1",
        "sectionItem": {
          "order": 1
        }
      },
      {
        "id": "itemId2",
        "sectionItem": {
          "order": 2
        }
      }
    ]
  }
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "message": "Duplicate order values found: 1, 2"
}
```

```json
{
  "message": "Order must be greater than 0"
}
```

### مثال على الاستخدام

```javascript
async function addItemsToSection(sectionId, items) {
  const response = await fetch('/route', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      routeName: 'addItemToSection',
      sectionId: sectionId,
      items: items
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const result = await response.json();
  return result.data;
}

// استخدام - مع order محدد
const items = [
  { id: 'item-1', order: 1 },
  { id: 'item-2', order: 2 }
];
const result = await addItemsToSection('section-123', items);

// استخدام - بدون order (سيتم حسابه تلقائياً)
const items2 = ['item-1', 'item-2'];
const result2 = await addItemsToSection('section-123', items2);
```

---

## API 4: `removeItemToSection` (محسّن)

### الوصف
API لحذف عنصر من قسم في الدورة. يعيد قائمة العناصر المتبقية مع ترتيب محدث تلقائياً.

### Endpoint
```
POST /route
```

### Request Body
```json
{
  "routeName": "removeItemToSection",
  "sectionId": "sectionId",
  "itemId": "itemId"
}
```

### Response Format (Success - 200)
```json
{
  "data": {
    "items": [
      {
        "id": "itemId1",
        "sectionItem": {
          "order": 1
        }
      },
      {
        "id": "itemId2",
        "sectionItem": {
          "order": 2
        }
      }
    ]
  }
}
```

### Error Responses

#### 404 Not Found
```json
{
  "message": "Item not found in this section"
}
```

### مثال على الاستخدام

```javascript
async function removeItemFromSection(sectionId, itemId) {
  const response = await fetch('/route', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      routeName: 'removeItemToSection',
      sectionId: sectionId,
      itemId: itemId
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const result = await response.json();
  return result.data;
}

// استخدام
const result = await removeItemFromSection('section-123', 'item-456');
// العناصر المتبقية ستُعاد مع order محدث تلقائياً [1, 2, 3...]
console.log('Remaining items:', result.items);
```

---

## API 5: `updateSectionItem`

### الوصف
API لتحديث order للعناصر في قسم. يدعم batch update.

### Endpoint
```
POST /route
```

### Request Body
```json
{
  "routeName": "updateSectionItem",
  "data": [
    {
      "sectionId": "sectionId",
      "itemId": "itemId1",
      "order": 1
    },
    {
      "sectionId": "sectionId",
      "itemId": "itemId2",
      "order": 2
    }
  ]
}
```

### Response Format (Success - 200)
```json
{
  "message": "successfully updated"
}
```

### مثال على الاستخدام

```javascript
async function updateSectionItems(updates) {
  const response = await fetch('/route', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      routeName: 'updateSectionItem',
      data: updates
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const result = await response.json();
  return result;
}

// استخدام
const updates = [
  { sectionId: 'section-123', itemId: 'item-1', order: 1 },
  { sectionId: 'section-123', itemId: 'item-2', order: 2 }
];
await updateSectionItems(updates);
```

---

## سيناريوهات الاستخدام الشائعة

### سيناريو 1: عرض العينات المجانية للطالب غير المسجل

```javascript
async function displayFreeSamples(courseId) {
  // 1. جلب curriculum الدورة
  const curriculum = await getCourseCurriculum(courseId);
  
  // 2. تصفية items المجانية فقط
  const freeItems = [];
  curriculum.sections.forEach(section => {
    section.items.forEach(item => {
      if (item.sectionItem.freeUsage === true) {
        freeItems.push({
          ...item,
          sectionName: section.name
        });
      }
    });
  });
  
  // 3. عرض items المجانية
  return freeItems;
}

// استخدام
const freeSamples = await displayFreeSamples('course-123');
freeSamples.forEach(item => {
  console.log(`Free: ${item.name} (${item.sectionName})`);
});
```

### سيناريو 2: الوصول لمحتوى مجاني

```javascript
async function accessFreeContent(courseId, itemId) {
  try {
    const item = await getItemByIdNoAuth(courseId, itemId);
    
    // التحقق من أن المحتوى مجاني
    if (!item.sectionItem.freeUsage) {
      throw new Error('This content is not free');
    }
    
    // عرض المحتوى
    if (item.type === 'video') {
      // عرض الفيديو
      playVideo(item.url);
    } else if (item.type === 'file') {
      // تحميل الملف
      downloadFile(item.url);
    }
    
    return item;
  } catch (error) {
    if (error.message.includes('Access denied')) {
      // عرض رسالة: "هذا المحتوى يتطلب التسجيل في الدورة"
      showEnrollmentPrompt();
    }
    throw error;
  }
}
```

### سيناريو 3: إدارة ترتيب العناصر في القسم

```javascript
async function reorderSectionItems(sectionId, itemIds) {
  // إنشاء array من updates مع order جديد
  const updates = itemIds.map((itemId, index) => ({
    sectionId: sectionId,
    itemId: itemId,
    order: index + 1
  }));
  
  // تحديث الترتيب
  await updateSectionItems(updates);
  
  console.log('Items reordered successfully');
}

// استخدام
const itemIds = ['item-3', 'item-1', 'item-2'];
await reorderSectionItems('section-123', itemIds);
// الترتيب الجديد: item-3 (order: 1), item-1 (order: 2), item-2 (order: 3)
```

### سيناريو 4: حذف عنصر وإعادة الترتيب التلقائي

```javascript
async function deleteItemAndReorder(sectionId, itemId) {
  try {
    const result = await removeItemFromSection(sectionId, itemId);
    
    // العناصر المتبقية مع order محدث تلقائياً
    console.log('Remaining items:', result.items);
    
    // تحديث UI
    updateUI(result.items);
    
    return result;
  } catch (error) {
    if (error.message.includes('not found')) {
      console.error('Item does not exist in this section');
    }
    throw error;
  }
}
```

---

## Error Handling Best Practices

### 1. معالجة الأخطاء بشكل شامل

```javascript
async function handleApiCall(apiFunction, ...args) {
  try {
    return await apiFunction(...args);
  } catch (error) {
    // تسجيل الخطأ
    console.error('API Error:', error);
    
    // عرض رسالة للمستخدم
    if (error.message.includes('Access denied')) {
      showError('هذا المحتوى يتطلب التسجيل في الدورة');
    } else if (error.message.includes('not found')) {
      showError('المحتوى غير موجود');
    } else {
      showError('حدث خطأ. يرجى المحاولة مرة أخرى');
    }
    
    throw error;
  }
}
```

### 2. Retry Logic للطلبات الفاشلة

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

---

## ملاحظات مهمة

1. **Signed URLs**: الـ URLs المُرجعة من `getItemByIdNoAuth` هي signed URLs وتنتهي صلاحيتها بعد 3 ساعات. يجب إعادة جلبها عند الحاجة.

2. **Order Management**: 
   - ✅ **تم في Frontend:** عند إضافة عناصر، يتم حساب order تلقائياً في `handleAddItemtoSection`
   - ✅ **تم في Frontend:** عند الحذف، يتم إعادة الترتيب تلقائياً في `handleDeleteSectionItem`
   - ✅ **تم في Frontend:** عند السحب والإفلات، يتم تحديث order مع error handling في `handleItemDragEnd`

3. **Free Usage Check**: 
   - ✅ **تم في Frontend:** تم إضافة التحقق من `sectionItem.freeUsage` في `handleCourseItemClick`
   - ✅ **تم في Frontend:** تم تحسين UI لعرض العينات المجانية للطلاب غير المسجلين

4. **Error Status Codes**: 
   - `403`: محاولة الوصول لمحتوى مدفوع بدون enrollment
   - `404`: العنصر أو الدورة غير موجود
   - `400`: معاملات غير صحيحة أو duplicate orders

## الشغل المنجز في Frontend

### APIs المستخدمة حالياً:
- ✅ `getCourseCurriculumNoAuth` - مستخدم في `getServerSideProps` في `pages/[catagoryName]/[courseName]/index.js`
- ✅ `addItemToSection` - مستخدم مع حساب order تلقائي في `handleAddItemtoSection`
- ✅ `removeItemToSection` - مستخدم مع إعادة ترتيب تلقائية في `handleDeleteSectionItem`
- ✅ `updateSectionItem` - مستخدم في drag & drop وإعادة الترتيب

### APIs جاهزة من Backend لكن لم تُستخدم بعد:
- ⏳ `getItemByIdNoAuth` - جاهز من Backend، يحتاج تحديث `handleCourseItemClick` لاستخدامه

### التحسينات المطبقة في Frontend:
- ✅ إضافة حساب order تلقائي عند إضافة عناصر جديدة
- ✅ إضافة إعادة ترتيب تلقائية عند حذف عناصر
- ✅ إضافة error handling مع rollback في drag & drop
- ✅ إضافة التحقق من `freeUsage` و `enrollment` قبل عرض المحتوى
- ✅ تحسين UI للعينات المجانية

---

## التواصل

في حالة وجود أي استفسارات أو مشاكل في استخدام الـ APIs، يرجى التواصل مع فريق Backend.

---

**آخر تحديث:** ديسمبر 2024

