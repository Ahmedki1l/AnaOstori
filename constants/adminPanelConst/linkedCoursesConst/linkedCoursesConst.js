export const manageLinkedCoursesConst = {
    tabTitle: 'الدورات المرتبطة',
    sectionHeading: 'الدورات المرتبطة بهذه الدورة',
    helperText: 'عند شراء هذه الدورة، يحصل الطالب تلقائياً على الدورات التالية',
    addButton: 'إضافة ربط',
    drawerTitle: 'إضافة دورات مرتبطة',
    drawerHelper: 'اختر الدورات التي ستُضاف تلقائياً عند شراء هذه الدورة',

    targetsLabel: 'الدورات المراد ربطها',
    targetsPlaceHolder: 'اختر دورة أو أكثر',
    targetsError: 'اختر دورة واحدة على الأقل',

    filterCategoryLabel: 'المجال',
    filterLanguageLabel: 'اللغة',
    filterTypeLabel: 'نوع الدورة',
    allOption: 'الكل',

    columnCourse: 'الدورة المرتبطة',
    columnCategory: 'المجال',
    columnLanguage: 'اللغة',
    columnType: 'نوع الدورة',
    columnCreatedAt: 'تاريخ الربط',
    columnActions: 'الإجراءات',

    emptyText: 'ما ربطت أي دورة بعد',
    saveBtn: 'حفظ الربط',
    cancelBtn: 'تراجع',

    toastCreated: 'تم إضافة الربط بنجاح',
    toastDeleted: 'تم حذف الربط بنجاح',
    toastSameCourseError: 'لا يمكن ربط الدورة بنفسها',
    toastGenericError: 'حدث خطأ، حاول مرة أخرى',
};

export const courseLanguageOptions = [
    { value: 'ar', label: 'العربية' },
    { value: 'en', label: 'English' },
];

export const courseTypeOptions = [
    { value: 'physical', label: 'حضورية' },
    { value: 'online', label: 'مباشرة عن بعد' },
    { value: 'on-demand', label: 'مسجلة' },
];

export const courseLanguageLabel = (lang) =>
    courseLanguageOptions.find((o) => o.value === lang)?.label || lang;

export const courseTypeLabel = (type) =>
    courseTypeOptions.find((o) => o.value === type)?.label || type;
