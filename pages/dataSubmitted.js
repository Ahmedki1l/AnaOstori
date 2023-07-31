import React, { useState } from 'react'
import styles from '../styles/PaymentDone.module.scss'
import { useRouter } from 'next/router';
import Link from 'next/link';
import AllIconsComponenet from '../Icons/AllIconsComponenet';



export default function DataSubmitted() {
    const router = useRouter()
    const [contactIs, setContactIs] = useState("phone")
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{10}$/;

    if (emailRegex.test(router.query.constact)) {
        setContactIs("email")
    }

    return (
        <div className={`maxWidthDefault ${styles.mainArea}`}>
            <div className='m-5'>
                <div className={styles.circle}>
                    <AllIconsComponenet iconName={'checkCircleRoundIcon'} height={40} width={35} color={'#FFFFFF'} />
                </div>
            </div>
            <h1 className={`head2 ${styles.pageHeader}`}>شكرا لك، استلمنا طلبك</h1>
            {contactIs == "email" ?
                <p className={`fontMedium ${styles.note3}`}>راح نرسلك ايميل اول ما نوسع المقاعد او نضيف مقاعد جديدة</p>
                :
                <p className={`fontMedium ${styles.note3}`}> راح نرسلك رسالة على الواتس اول ما نوسع المقاعد او نضيف مقاعد جديدة</p>
            }
            <div className={styles.dataSubmitBtnBox}>
                <Link href={'/'}>
                    <button className='primarySolidBtn' >الرجوع إلى الصفحة الرئيسية</button>
                </Link>
            </div>
        </div>
    )
}
