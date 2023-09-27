const noOfUsersTag = [
    'الشخص الاول',
    'الشخص الثاني',
    'الشخص الثالث',
    'الشخص الرابع',
    'الشخص الخامس',
    'الشخص السادس',
    'الشخص السابع',
    'الشخص الثامن',
    'الشخص التاسع',
    'الشخص العاشر',
]

const noOfUsersTag2 = [
    'شخص 1',
    'شخصين',
    '3 اشخاص',
    '4 اشخاص',
    '5 اشخاص',
    '6 اشخاص',
    '7 اشخاص',
    '8 اشخاص',
    '9 اشخاص',
    '10 اشخاص',
]

const noOfUsersTag3 = [
    'للشخص',
    'لشخصين',
    'لـ3 أشخاص',
    'لـ4 أشخاص',
    'لـ5 أشخاص',
    'لـ6 أشخاص',
    'لـ7 أشخاص',
    'لـ8 أشخاص',
    'لـ9 أشخاص',
    'لـ10 أشخاص'
]

const iosProductIdList = [
    {
        label: '749',
        value: 'tier22_content_AN',
        key: 'tier22_content_AN',
    },
    {
        label: '699',
        value: 'tier21_content_AN',
        key: 'tier21_content_AN',
    },
    {
        label: '649',
        value: 'tier20_content_AN',
        key: 'tier20_content_AN'
    },
    {
        label: '599',
        value: 'tier19_content_AN',
        key: 'tier19_content_AN',
    },
    {
        label: '549',
        value: 'tier18_content_AN',
        key: 'tier18_content_AN',
    },
    {
        label: '499',
        value: 'tier17_content_AN',
        key: 'tier17_content_AN',
    },
    {
        label: '474.99',
        value: 'tier16_content_AN',
        key: 'tier16_content_AN',
    },
    {
        label: '449',
        value: 'tier15_content_AN',
        key: 'tier15_content_AN',
    },
    {
        label: '424.99',
        value: 'tier14_content_AN',
        key: 'tier14_content_AN',
    },
    {
        label: '399',
        value: 'tier13_content_AN',
        key: 'tier13_content_AN',
    },
    {
        label: '374.99 ',
        value: 'tier12_content_AN',
        key: 'tier12_content_AN',
    },
    {
        label: '349',
        value: 'tier11_content_AN',
        key: 'tier11_content_AN',
    },
    {
        label: '324.99',
        value: 'tier10_content_AN',
        key: 'tier10_content_AN',
    },
    {
        label: '299',
        value: 'tier9_content_AN',
        key: 'tier9_content_AN',
    },
    {
        label: '274.99',
        value: 'tier8_content_AN',
        key: 'tier8_content_AN',
    },
    {
        label: '249',
        value: 'tier7_content_AN',
        key: 'tier7_content_AN',
    },
    {
        label: '224.99',
        value: 'tier6_content_AN',
        key: 'tier6_content_AN',
    },
    {
        label: '199',
        value: 'tier5_content_AN',
        key: 'tier5_content_AN',
    },
    {
        label: '173.99',
        value: 'tier4_content_AN',
        key: 'tier4_content_AN',
    },
    {
        label: '149',
        value: 'tier3_content_AN',
        key: 'tier3_content_AN',
    },
    {
        label: '123.99',
        value: 'tier2_content_AN',
        key: 'tier2_content_AN',
    },
    {
        label: '99',
        value: 'tier1_content_AN',
        key: 'tier1_content_AN',
    },
]

const genders = [
    { value: 'male', label: 'شاب' },
    { value: 'female', label: 'بنت' }
]

const bankDetails = [
    { accountNumber: '68202782277000', IBANnumber: 'SA92 0500 0068 2027 8227 7000', bankLogo: 'alinmaBankLogo', brndColor: '#522D24' },
    { accountNumber: '497608010167872', IBANnumber: 'SA74 8000 0497 6080 1016 7872', bankLogo: 'alrajhiBankLogo', brndColor: '#1B4297' },
    { accountNumber: '25500000685307', IBANnumber: 'SA89 1000 0025 5000 0068 5307', bankLogo: 'alahliBankLogo', brndColor: '#034537' },
]

const paymentStatus = [
    {
        key: 1,
        label: 'بانتظار الحوالة',
        value: 'witing',
        color: 'yellow'
    },
    {
        key: 2,
        label: 'خلنا نراجع الايصال',
        value: 'review',
        color: 'geekblue'
    },
    {
        key: 3,
        label: 'مؤكد',
        value: 'accepted',
        color: 'green'
    },
    {
        key: 4,
        label: 'ردينا فلوسه',
        value: 'refund',
        color: 'black'
    },
    {
        key: 5,
        label: 'ملغي',
        value: 'rejected',
        color: 'red'
    },
    {
        key: 6,
        label: 'مرفوضة',
        value: 'failed',
        color: 'red'
    },
    {
        key: 7,
        label: 'init',
        value: 'init',
        color: 'orange'
    }
]


export { noOfUsersTag, noOfUsersTag2, noOfUsersTag3, genders, bankDetails, iosProductIdList, paymentStatus };