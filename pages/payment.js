import styles from '../styles/PaymentDone.module.scss'
import Link from 'next/link';
import * as LinkConst from '../constants/LinkConst'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthRouteAPI, getPaymentInfoAPI } from '../services/apisService';
import * as fbq from '../lib/fpixel'
import AllIconsComponenet from '../Icons/AllIconsComponenet';
import Spinner from '../components/CommonComponents/spinner';
import { mediaUrl } from '../constants/DataManupulation';
import { useDispatch } from 'react-redux';



export default function Payment(props) {
    const whatsAppLink = LinkConst.WhatsApp_Link
    const [transactionDetails, setTransactionDetails] = useState([])
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)
    const router = useRouter()
    const orderID = router.asPath?.split("=")[1]?.split("&")[0]
    const transactionID = router.asPath?.split("=")[2]?.split("&")[0]
    const [loading, setLoading] = useState(true)
    const [invoiceUrl, setInvoiceUrl] = useState('')
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isLoading) {
                event.preventDefault();
                alert('Please wait for the payment to complete');
                event.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isLoading]);

    useEffect(() => {
        const getPaymentData = async () => {
            let data = {
                orderId: orderID,
                transactionId: transactionID,
            }
            await getPaymentInfoAPI(data).then(async (response) => {
                ((response.data[0].result.code == "000.000.000" || response.data[0].result.code == "000.100.110") ? (fbq.event('Purchase Successfull', { orderId: orderID })) : (fbq.event('Purchase Fail', { orderId: orderID })))
                setTransactionDetails(response.data)
                setIsPaymentSuccess(response.data[0].result.code == "000.000.000" || response.data[0].result.code == "000.100.110" ? true : false)
                setLoading(false)
                setInvoiceUrl(mediaUrl(response.data[0]?.orderDetails?.invoiceBucket, response.data[0]?.orderDetails?.invoiceKey))
                const getMyCourseReq = getAuthRouteAPI({ routeName: 'myCourses' })
                const [myCourseData] = await Promise.all([getMyCourseReq])
                dispatch({
                    type: 'SET_ALL_MYCOURSE',
                    myCourses: myCourseData?.data,
                });
            }).catch((error) => {
                console.log(error)
                setLoading(false)
            })
        }
        getPaymentData()
    }, [orderID, transactionID])



    return (
        <>
            {loading ?
                <div>
                    <div className={`relative ${styles.mainArea}`}>
                        <Spinner borderwidth={7} width={6} height={6} />
                        <h1 style={{ textAlign: 'center' }}>انتظر الله يسعدك، بنتحقق من عملية الدفع</h1>
                    </div>
                </div>
                :
                <>
                    {(transactionDetails && isPaymentSuccess && invoiceUrl) ?
                        <div className={`maxWidthDefault ${styles.mainArea}`}>
                            <div className='m-5'>
                                <div className={styles.circle}>
                                    <AllIconsComponenet iconName={'checkCircleRoundIcon'} height={40} width={35} color={'#FFFFFF'} />
                                </div>
                            </div>
                            <h1 className={`head1 ${styles.pageHeader}`}>شكرا لك، اكتملت عملية الشراء</h1>
                            <p className={`fontMedium ${styles.note1}`}> فريق الدعم راح يتواصل معك ويضيفك في قروب واتس الدورة في أقرب وقت. إذا احتجت مساعدة تواصل معنا على  <Link href={whatsAppLink} className='link'>الواتساب</Link></p>
                            <p className={`fontMedium ${styles.note2}`}>رسلنا الفاتورة على الواتساب وعلى الايميل. وتقدر تشوفها ايضا من <Link href={'/purchaseInquiry'} className='link'>صفحة استعلام وتأكيد الحجوزات</Link>.</p>
                            <Link target='_blank' href={invoiceUrl || ''} className={`${styles.btnsBox} no-underline`}>
                                <button className='primarySolidBtn flex justify-center items-center'>
                                    <div className='pl-2'>
                                        <AllIconsComponenet height={20} width={20} iconName={'downloadIcon'} color={'#FFFFFF'} />
                                    </div>
                                    تحميل الفاتورة
                                </button>
                            </Link>
                        </div>
                        :
                        <div className={`maxWidthDefault ${styles.mainArea}`}>
                            <h1>Payment Fail</h1>
                        </div>
                    }
                </>
            }
        </>
    )
}
