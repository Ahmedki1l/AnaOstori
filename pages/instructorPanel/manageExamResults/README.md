# إدارة نتائج الاختبارات - Exam Results Management

## نظرة عامة
هذه الصفحة تتيح للمدربين إدارة نتائج الاختبارات للطلاب، بما في ذلك رفع النتائج وعرضها وتحميلها وحذفها.

## الميزات الرئيسية

### 1. عرض نتائج الاختبارات
- عرض قائمة بجميع نتائج الاختبارات في جدول منظم
- تصفية النتائج حسب الاختبار المحدد
- البحث في النتائج حسب اسم الطالب أو اسم الاختبار
- عرض معلومات الطالب (الاسم والصورة)
- عرض الدرجة والحالة (ناجح/راسب)
- عرض تواريخ الاختبار والرفع
- تمييز الاختبارات المنتهية تلقائياً بسبب التشتيت

### 2. رفع نتائج الاختبارات
- رفع ملفات Excel أو CSV تحتوي على نتائج متعددة
- إدخال النتائج يدوياً للطلاب الفرديين
- دعم إضافة ملاحظات لكل نتيجة
- تحديد تاريخ الاختبار لكل نتيجة

### 3. التقديم التلقائي للنتائج
- **تقديم تلقائي**: يتم حفظ نتائج الاختبار تلقائياً عند انتهاء الطالب من الاختبار
- **حماية من التكرار**: لا يمكن للطالب تقديم نفس الاختبار مرتين
- **معالجة الانقطاع**: يتم حفظ النتائج حتى لو تم إنهاء الاختبار بسبب التشتيت
- **معلومات التشتيت**: يتم تسجيل أحداث التشتيت وعدد التحذيرات

### 3. عرض تفاصيل النتيجة
- عرض معلومات مفصلة عن الطالب
- عرض تفاصيل الاختبار والتواريخ
- عرض الدرجة مع مؤشر بصري (دائرة تقدم)
- عرض تفصيل الأقسام (إن وجد)
- عرض معلومات الوقت المستغرق
- عرض الملاحظات الإضافية

### 4. تحميل وحذف النتائج
- تحميل نتيجة اختبار كملف PDF
- حذف النتائج مع تأكيد الحذف

## هيكل الملفات

```
pages/instructorPanel/manageExamResults/
├── index.js                          # الصفحة الرئيسية
└── README.md                         # هذا الملف

components/ManageExamResults/
├── ModelForUploadExamResults.js      # نموذج رفع النتائج
├── ModelForUploadExamResults.module.scss
├── ModelForViewExamResults.js        # نموذج عرض التفاصيل
└── ModelForViewExamResults.module.scss

styles/InstructorPanelStyleSheets/
└── ManageExamResults.module.scss     # أنماط الصفحة الرئيسية

constants/adminPanelConst/examResultsConst/
└── examResultsConst.js               # ثوابت النصوص
```

## API Endpoints المطلوبة

### 1. جلب قائمة الاختبارات
```javascript
{
  routeName: 'getItemByCourseId',
  type: 'quiz'
}
```

### 2. جلب نتائج الاختبار
```javascript
{
  routeName: 'getExamResults',
  examId: 'exam_id'
}
```

### 3. رفع نتائج الاختبار (يدوياً)
```javascript
{
  routeName: 'uploadExamResults',
  examId: 'exam_id',
  results: 'JSON string of results array',
  files: 'FormData files'
}
```

### 4. تقديم نتائج الاختبار (تلقائياً)
```javascript
{
  routeName: 'submitExamResult',
  examId: 'exam_id',
  courseId: 'course_id',
  studentId: 'student_id',
  examData: {
    examName: 'اسم الاختبار',
    examDuration: 'مدة الاختبار',
    totalQuestions: 30,
    score: 85,
    correctAnswers: 25,
    wrongAnswers: 5,
    unansweredQuestions: 0,
    markedQuestions: 2,
    timeSpent: '20:30',
    totalTime: '25:00',
    sections: [...],
    sectionDetails: [...],
    reviewQuestions: [...],
    examDate: '2024-01-15T10:30:00Z',
    status: 'pass',
    distractionEvents: [...],
    distractionStrikes: 0,
    isCompleted: true,
    isTerminated: false,
    terminationReason: null,
    submissionType: 'completed' // 'completed' أو 'terminated'
  }
}
```

**ملاحظة**: عند إنهاء الاختبار بسبب التشتيت، يتم إرسال:
```javascript
{
  isTerminated: true,
  terminationReason: 'سبب الانتهاء',
  submissionType: 'terminated'
}
```

### 5. جلب نتيجة طالب محدد
```javascript
{
  routeName: 'getStudentExamResult',
  examId: 'exam_id',
  studentId: 'student_id'
}
```

### 6. تحميل نتيجة
```javascript
{
  routeName: 'downloadExamResult',
  resultId: 'result_id'
}
```

### 7. حذف نتيجة
```javascript
{
  routeName: 'deleteExamResult',
  resultId: 'result_id'
}
```

## هيكل البيانات

### نتيجة الاختبار
```javascript
{
  id: 'result_id',
  studentName: 'اسم الطالب',
  studentId: 'رقم الطالب',
  studentAvatar: 'رابط الصورة',
  examName: 'اسم الاختبار',
  score: 85, // النسبة المئوية
  status: 'pass', // 'pass' أو 'fail'
  examDate: '2024-01-15',
  uploadDate: '2024-01-16',
  notes: 'ملاحظات إضافية',
  sections: [
    {
      title: 'اسم القسم',
      score: 8,
      totalQuestions: 10,
      skills: [
        {
          title: 'اسم المهارة',
          correctAnswers: 4,
          numberOfQuestions: 5,
          score: 80
        }
      ]
    }
  ],
  sectionDetails: [
    {
      title: 'اسم القسم',
      score: 80,
      correctAnswers: 8,
      numberOfQuestions: 10,
      time: '15:30'
    }
  ],
  timeSpent: '45:30',
  totalTime: '60:00',
  distractionEvents: [
    {
      type: 'tab_hidden',
      time: 1642234567890,
      data: {}
    }
  ],
  distractionStrikes: 2,
  isCompleted: true,
  isTerminated: false,
  terminationReason: null,
  submissionType: 'completed' // 'completed' أو 'terminated'
}
```

## الاستخدام

### الوصول للصفحة
1. انتقل إلى لوحة المدرب
2. انقر على "إدارة نتائج الاختبارات"

### رفع نتائج جديدة
1. انقر على "رفع نتائج اختبار"
2. اختر الاختبار من القائمة المنسدلة
3. ارفع ملف Excel/CSV أو أدخل النتائج يدوياً
4. انقر على "رفع النتائج"

### عرض تفاصيل النتيجة
1. في الجدول، انقر على أيقونة العين بجانب النتيجة
2. ستظهر نافذة منبثقة تحتوي على جميع التفاصيل

### تحميل النتيجة
1. في الجدول، انقر على أيقونة التحميل
2. سيتم تحميل النتيجة كملف PDF

### حذف النتيجة
1. في الجدول، انقر على أيقونة الحذف
2. أكد الحذف في النافذة المنبثقة

## الملاحظات التقنية

- الصفحة تدعم التصميم المتجاوب
- جميع النصوص باللغة العربية
- يتم التعامل مع أخطاء API تلقائياً
- يدعم إعادة المحاولة عند انتهاء صلاحية التوكن
- يتم عرض رسائل نجاح/خطأ للمستخدم 