export const questionsConst = {
    folderToastMsgConst: {
        addFolderSuccessMsg: "تم إضافة المجلد بنجاح",
        updateFolderSuccessMsg: "تم تحديث المجلد بنجاح",
        deleteFolderSuccessMsg: "تم حذف المجلد بنجاح",
        createFolderErrorMsg: "حدث خطأ أثناء إنشاء المجلد",
        updateFolderErrorMsg: "حدث خطأ أثناء تحديث المجلد",
        deleteFolderErrorMsg: "حدث خطأ أثناء حذف المجلد"
    },
    questionToastMsgConst: {
        addQuestionSuccessMsg: "تم إضافة السؤال بنجاح",
        updateQuestionSuccessMsg: "تم تحديث السؤال بنجاح",
        deleteQuestionSuccessMsg: "تم حذف السؤال بنجاح",
        createQuestionErrorMsg: "حدث خطأ أثناء إنشاء السؤال",
        updateQuestionErrorMsg: "حدث خطأ أثناء تحديث السؤال",
        deleteQuestionErrorMsg: "حدث خطأ أثناء حذف السؤال"
    },
    questionTypes: {
        multipleChoice: {
            id: "multipleChoice",
            name: "متعدد الخيارات",
            description: "سؤال مع خيارات متعددة وإجابة واحدة صحيحة"
        },
        contextual: {
            id: "contextual",
            name: "سياقي",
            description: "سؤال يعتمد على سياق أو نص معين"
        },
        numerical: {
            id: "numerical",
            name: "عددي",
            description: "سؤال تكون إجابته رقمية"
        },
        essay: {
            id: "essay",
            name: "مقالي",
            description: "سؤال يتطلب إجابة مكتوبة مطولة"
        },
        trueFalse: {
            id: "trueFalse",
            name: "صح/خطأ",
            description: "سؤال تكون إجابته إما صح أو خطأ"
        }
    },
    contextTypes: {
        contextualError: {
            id: "contextualError",
            name: "الخطأ السياقي",
            description: "تحديد الكلمة التي لا يتفق معناها مع المعنى العام للجملة"
        },
        readingComprehension: {
            id: "readingComprehension",
            name: "فهم المقروء",
            description: "قراءة نص والإجابة على أسئلة تتعلق به"
        },
        wordDefinition: {
            id: "wordDefinition",
            name: "تعريف الكلمات",
            description: "تحديد معنى كلمة في سياق معين"
        }
    },
    formLabels: {
        questionType: "نوع السؤال",
        questionText: "نص السؤال",
        contextType: "نوع السياق",
        contextDescription: "وصف السياق",
        options: "الخيارات",
        correctAnswer: "الإجابة الصحيحة",
        addImage: "إضافة صورة (اختياري)",
        folderName: "اسم المجلد"
    },
    buttonLabels: {
        add: "إضافة",
        save: "حفظ",
        cancel: "إلغاء",
        delete: "حذف",
        addFolder: "إضافة مجلد",
        addQuestion: "إضافة سؤال",
        chooseImage: "اختر صورة",
        saveChanges: "حفظ التغييرات"
    },
    modalTitles: {
        addFolder: "إضافة مجلد جديد",
        editFolder: "تعديل المجلد",
        addQuestion: "إضافة سؤال جديد",
        editQuestion: "تعديل السؤال",
        deleteFolder: "حذف المجلد",
        deleteQuestion: "حذف السؤال"
    },
    confirmMessages: {
        deleteFolder: "هل أنت متأكد من حذف هذا المجلد؟ سيتم حذف جميع الأسئلة الموجودة فيه.",
        deleteQuestion: "هل أنت متأكد من حذف هذا السؤال؟"
    },
    placeholders: {
        folderName: "أدخل اسم المجلد",
        questionText: "أدخل نص السؤال هنا",
        contextType: "مثال: الخطأ السياقي",
        contextDescription: "أدخل وصف السياق هنا",
        option: "الخيار"
    },
    validationErrors: {
        requiredField: "هذا الحقل مطلوب",
        emptyQuestion: "يرجى إدخال نص السؤال",
        emptyOptions: "يرجى إدخال جميع الخيارات",
        noCorrectAnswer: "يرجى تحديد الإجابة الصحيحة",
        emptyFolder: "يرجى إدخال اسم المجلد"
    },
    tableHeaders: {
        title: "العنوان",
        questionType: "نوع السؤال",
        lastModified: "تاريخ اخر تعديل",
        actions: "الإجراءات"
    },
    emptyStates: {
        noFolders: "ما أضفت مجلد",
        noQuestions: "ما أضفت سؤال"
    }
};