export const couponTypes = [
    { value: 'limited', label: 'محدود' },
    { value: 'notLimited', label: ' لا محدود ' }
]

export const discountModes = [
    { label: 'نسبة مئوية', value: 'percentage' },
    { label: 'قيمة ثابتة', value: 'fixedAmount' },
]

export const manageCouponConst = {
    createCouponHead: 'إضافة كوبون',
    updateCouponHead: 'تعديل الكوبون',

    couponNameHead: 'عنوان الكوبون*', //address
    couponNamePlaceHolder: 'مثلا اليوم الوطني',
    couponNameError: 'اكتب العنوان',

    couponCodeHead: 'الكود*',
    couponCodePlaceHolder: 'مثلا SND93',
    couponCodeError: 'اكتب الكود',
    
    // Auto-generate code
    autoGenerateCodeBtn: 'إنشاء تلقائي',
    codeLengthHead: 'عدد الأحرف',
    codeLengthPlaceHolder: '8',

    couponPercantageHead: 'نسبة الخصم*',
    couponPercantagePlaceHolder: 'نسبة الخصم',
    couponPercantageError: 'حدد نسبة الخصم',

    couponAmountHead: 'قيمة الخصم*',
    couponAmountPlaceHolder: 'قيمة الخصم',
    couponAmountError: 'حدد قيمة الخصم',

    couponDiscountType: 'نوع الخصم*',
    couponDiscountTypePlaceHolder: 'اختار نوع الخصم',
    couponDiscountTypeError: 'حدد نوع الخصم',

    couponExpiryDate: 'تاريخ الانتهاء*',
    couponExpiryDatePlaceHolder: 'تاريخ انتهاء الكوبون ',
    couponExpiryDateError: 'حدد تاريخ الانتهاء',

    couponAppliedCourseHead: 'تطبق على هذه الدورات*',
    couponAppliedCoursePlaceHolder: 'اختر الدورات',
    couponAppliedCourseError: 'اختار الدورات',

    couponLimitHead: 'اكتب العدد*',
    couponLimitPlaceHolder: 'محدد بعدد (من سبق لبق)',
    couponLimitError: 'حدد العدد',

    // Coupon Conditions
    couponConditionsHead: 'شروط الكوبون',
    singlePersonBookingLabel: 'الحجز لشخص واحد فقط',
    singlePersonBookingDescription: 'يمنع تطبيق الكوبون على الحجوزات لعدة أشخاص',

    couponCreateSuccessMsg: 'تم إضافة الكوبون بنجاح',
    couponUpdateSuccessMsg: 'تم تحديث الكوبون بنجاح',
    addBtnText: 'إضافة',
    saveBtnText: 'حفظ',
}