import styles from '../styles/PaymentDone.module.scss'
import Link from 'next/link';
import * as LinkConst from '../constants/LinkConst'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getPaymentInfoAPI } from '../services/apisService';
import * as fbq from '../lib/fpixel'



// MI icons
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';



export default function Payment(props) {
    const storeData = useSelector((state) => state?.globalStore);
    const whatsAppLink = LinkConst.WhatsApp_Link
    const [transactionDetails, setTransactionDetails] = useState([])
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)
    const router = useRouter()
    const orderID = router.asPath?.split("=")[1]?.split("&")[0]
    const transactionID = router.asPath?.split("=")[2]?.split("&")[0]

    useEffect(() => {
        const getPaymentData = async () => {
            let data = {
                orderID: orderID,
                transactionID: transactionID,
                accessToken: storeData?.accessToken
            }
            await getPaymentInfoAPI(data).then((response) => {
                return (
                    setTransactionDetails(response.data),
                    setIsPaymentSuccess(response.data[0].result.code == "000.000.000" ? true : false),
                    response.data[0].result.code == "000.000.000" ? (fbq.event('Purchase Successfull', { orderId: orderID })) : (fbq.event('Purchase Fail', { orderId: orderID }))
                )
            }).catch((error) => console.log(error));
        }
        getPaymentData()
    }, [orderID, transactionID])



    return (
        <>
            {transactionDetails && isPaymentSuccess ?
                <div className={`maxWidthDefault ${styles.mainArea}`}>
                    <CheckCircleRoundedIcon className={styles.checkIcon} />
                    <h1 className={`head1 ${styles.pageHeader}`}>شكرا لك، اكتملت عملية الشراء</h1>
                    <p className={`fontMedium ${styles.note1}`}> فريق الدعم راح يتواصل معك ويضيفك في قروب واتس الدورة في أقرب وقت. إذا احتجت مساعدة تواصل معنا على  <Link href={whatsAppLink} className='link'>الواتساب</Link></p>
                    <p className={`fontMedium ${styles.note2}`}>رسلنا الفاتورة على الواتساب وعلى الايميل. وتقدر تشوفها ايضا من <Link href={'/search'} className='link'>صفحة استعلام وتأكيد الحجوزات</Link>.</p>
                    <div className={styles.btnsBox}>
                        <button className='primarySolidBtn flex justify-center items-center'><SaveAltIcon className={styles.downloadIcon} />تحميل الفاتورة </button>
                    </div>
                </div>
                :
                <div className={`maxWidthDefault ${styles.mainArea}`}>
                    <h1>Payment Fail</h1>
                </div>
            }
        </>
    )
}
