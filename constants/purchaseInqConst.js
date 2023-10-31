import Link from "next/link";

export const paymentStateConst = {

}

export const inqTabelHeaderConst = {
    header1: 'رقم الحجز',
    header2: 'تاريخ الطلب',
    header3: 'التفاصيل',
    header4: 'الحالة',
    header5: 'الفاتورة',
}

export const inqPaymentStateConst = {
    accepted: 'مؤكد',
    witing: 'بانتظار الحوالة',
    review: 'تحت المراجعة',
    refund: 'تم استرجاع المبلغ',
    rejected: 'ملّغى',
    failed: 'مرفوضة',
}


export const generateLink = (link, text, additionalText) => {
    return (
      <div>
        <Link className='link' href={link} target='_blank'>
          {text}
        </Link>
        &nbsp; {additionalText}
      </div>
    );
  };
