import styles from '../styles/PaymentDone.module.scss'
import Link from 'next/link';
import * as LinkConst from '../constants/LinkConst'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthRouteAPI, getPaymentInfoAPI } from '../services/apisService';
import { dateWithDay, timeDuration2 } from '../constants/DateConverter';
import * as fbq from '../lib/fpixel'
import AllIconsComponenet from '../Icons/AllIconsComponenet';
import Spinner from '../components/CommonComponents/spinner';
import { mediaUrl } from '../constants/DataManupulation';
import { useDispatch } from 'react-redux';
import { VerifyPaymentConst } from '../constants/verifyPaymentConst';
import { sendMessage } from '../services/morasalaty'; // Import the sendMessage function


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
        if (router.query.orderId && router.query.id) {
            getPaymentData()
        }
    }, [router.query.orderId, router.query.id])

    const getPaymentData = async () => {
        let data = {
            orderId: router.query.orderId,
            transactionId: router.query.id,
        }

        let paymentData;

        await getPaymentInfoAPI(data).then(async (response) => {
            ((response.data[0].result.code == "000.000.000" || response.data[0].result.code == "000.100.110") ? (fbq.event('Purchase Successfull', { orderId: orderID })) : (fbq.event('Purchase Fail', { orderId: orderID })))
            setTransactionDetails(response.data)
            console.log(response.data[0])
            paymentData = response.data[0];
            const flag = response.data[0].result.code == "000.000.000" || response.data[0].result.code == "000.100.110" ? true : false;
            setIsPaymentSuccess(flag);
            setLoading(false)
            setInvoiceUrl(mediaUrl(response.data[0]?.orderDetails?.invoiceBucket, response.data[0]?.orderDetails?.invoiceKey))
            const getMyCourseReq = getAuthRouteAPI({ routeName: 'myCourses' })
            const [myCourseData] = await Promise.all([getMyCourseReq])
            dispatch({
                type: 'SET_ALL_MYCOURSE',
                myCourses: myCourseData?.data,
            });

            // If payment is successful, send WhatsApp message
            if (flag) {
                await sendWhatsAppMessage(paymentData);
            }

        }).catch(async (error) => {
            setLoading(false)
        })
    }

    const sendWhatsAppMessage = async (orderDetail) => {
        console.log(orderDetail);
        const buyerPhone = orderDetail.orderDetails.buyerPhone;
        const buyerFullName = orderDetail.orderDetails.buyerFullName;
        const buyerEmail = orderDetail.orderDetails.buyerEmail;
        const gender = router.query.gender || 'male'; // Default gender if not provided

        const registeredDate = JSON.parse(localStorage.getItem('registeredDate'));
        const courseTitle = registeredDate.course.name?.trim() || '';
        const locationText = registeredDate.course.locationName?.trim() || registeredDate.course.link?.trim() || '';
        const locationURL = registeredDate.course.location?.trim() || '';
        const date = `من ${dateWithDay(registeredDate.dateFrom)} إلى ${dateWithDay(registeredDate.dateTo)}`;
        const duration = timeDuration2(registeredDate.timeFrom, registeredDate.timeTo);

        const whatsAppGroupLinks = registeredDate.whatsappGroupLink?.trim() || '';
        const classRoomCode = registeredDate.classRoomCode?.trim() || '';

        if (whatsAppGroupLinks && classRoomCode) {
            const groupLinks = whatsAppGroupLinks.split(/\s+/);
            if (groupLinks.length === 2) {
                const [maleLink, femaleLink] = groupLinks;
                const whatsapplink = gender === 'male' ? maleLink : femaleLink;
                try {
                    // Call the sendMessage function from morasalaty.js
                    const result = await sendMessage(buyerPhone, buyerFullName, buyerEmail, courseTitle, locationText, locationURL, date, duration, gender, whatsapplink, classRoomCode);

                    if (result.status === 'ok') {
                        console.log('WhatsApp message sent successfully.');
                    } else {
                        console.error('Failed to send WhatsApp message:', result.message);
                    }
                } catch (error) {
                    console.error('Error sending WhatsApp message:', error);
                }
            } else if (groupLinks.length === 1) {
                const [maleLink] = groupLinks;
                const whatsapplink = maleLink;
                try {
                    // Call the sendMessage function from morasalaty.js
                    const result = await sendMessage(buyerPhone, buyerFullName, buyerEmail, courseTitle, locationText, locationURL, date, duration,  gender, whatsapplink, classRoomCode);

                    if (result.status === 'ok') {
                        console.log('WhatsApp message sent successfully.');
                    } else {
                        console.error('Failed to send WhatsApp message:', result.message);
                    }
                } catch (error) {
                    console.error('Error sending WhatsApp message:', error);
                }
            }
        } else if (whatsAppGroupLinks) {
            const groupLinks = whatsAppGroupLinks.split(/\s+/);
            if (groupLinks.length === 2) {
                const [maleLink, femaleLink] = groupLinks;
                const whatsapplink = gender === 'male' ? maleLink : femaleLink;
                try {
                    // Call the sendMessage function from morasalaty.js
                    const result = await sendMessage(buyerPhone, buyerFullName, buyerEmail, courseTitle, locationText, locationURL, date, duration,  gender, whatsapplink, "");

                    if (result.status === 'ok') {
                        console.log('WhatsApp message sent successfully.');
                    } else {
                        console.error('Failed to send WhatsApp message:', result.message);
                    }
                } catch (error) {
                    console.error('Error sending WhatsApp message:', error);
                }
            } else if (groupLinks.length === 1) {
                const [maleLink] = groupLinks;
                const whatsapplink = maleLink;
                try {
                    // Call the sendMessage function from morasalaty.js
                    const result = await sendMessage(buyerPhone, buyerFullName, buyerEmail, courseTitle, locationText, locationURL, date, duration,  gender, whatsapplink, "");

                    if (result.status === 'ok') {
                        console.log('WhatsApp message sent successfully.');
                    } else {
                        console.error('Failed to send WhatsApp message:', result.message);
                    }
                } catch (error) {
                    console.error('Error sending WhatsApp message:', error);
                }
            }
        } else if (classRoomCode) {
            try {
                // Call the sendMessage function from morasalaty.js
                const result = await sendMessage(buyerPhone, buyerFullName, buyerEmail, courseTitle, locationText, locationURL, date, duration,  gender, "", classRoomCode);

                if (result.status === 'ok') {
                    console.log('WhatsApp message sent successfully.');
                } else {
                    console.error('Failed to send WhatsApp message:', result.message);
                }
            } catch (error) {
                console.error('Error sending WhatsApp message:', error);
            }
        } else {
            try {
                // Call the sendMessage function from morasalaty.js
                const result = await sendMessage(buyerPhone, buyerFullName, buyerEmail, courseTitle, locationText, locationURL, date, duration,  gender, "", "");

                if (result.status === 'ok') {
                    console.log('WhatsApp message sent successfully.');
                } else {
                    console.error('Failed to send WhatsApp message:', result.message);
                }
            } catch (error) {
                console.error('Error sending WhatsApp message:', error);
            }
        }
    };

    const courseType = transactionDetails[0]?.orderDetails?.courseType;
    console.log(transactionDetails);
    const handleFillInformation = () => {
        router.push({
            pathname: (`/studentInformation`),
            query: {
                courseId: transactionDetails[0]?.orderDetails?.courseId,
                courseType: transactionDetails[0]?.orderDetails?.courseType,
            }
        })
    }
    return (
        <>
            {loading ?
                <div>
                    <div className={`relative ${styles.mainArea}`}>
                        <Spinner borderwidth={7} width={6} height={6} />
                        <h1 style={{ textAlign: 'center' }}>{VerifyPaymentConst.paymentProcessConst}</h1>
                        <h3 style={{ textAlign: 'center', padding: '0 1rem' }}>{VerifyPaymentConst.doNotRefreshPageConst}</h3>
                    </div>
                </div>
                :
                <>
                    {(transactionDetails && isPaymentSuccess) ?
                        <div className={`maxWidthDefault ${styles.mainArea}`}>
                            <div className={styles.paymentSuccessArea}>
                                <div className='m-5'>
                                    <div className={styles.circle}>
                                        <AllIconsComponenet iconName={'checkCircleRoundIcon'} height={40} width={35} color={'#FFFFFF'} />
                                    </div>
                                </div>
                                <h1 className={`head1 `}>{VerifyPaymentConst.paymentProcessCompletedConst}</h1>
                                {courseType === 'on-demand' ?
                                    <p className={`fontMedium text-lg p-2`}>{VerifyPaymentConst.invoiceSendWhatsAppText}</p>
                                    :
                                    <>
                                        <p className={`fontMedium text-lg p-2`}>{VerifyPaymentConst.contactAsOnWhatsAppConstText1}</p>
                                        <p className={`fontMedium text-lg p-2`}>{VerifyPaymentConst.contactAsOnWhatsAppConstText2}</p>
                                    </>
                                }
                                <div className={styles.subsciptionInfoArea}>
                                    <div className='flex'>
                                        <div className='mt-3'>
                                            <AllIconsComponenet height={20} width={20} iconName={'informationIcon'} color={'#1C26FF'} />
                                        </div>
                                        <p className={`fontMedium text-lg p-2`}>{VerifyPaymentConst.subsciptionInformationConst}</p>
                                    </div>
                                </div>
                                <div className={styles.paymentSuccessBtnWrapper}>
                                    {/* <Link href={'/studentInformation'} className={`${styles.btnsBox} no-underline`}>
                                        <button className='primarySolidBtn flex justify-center items-center'>
                                            {VerifyPaymentConst.fillInformationBtnText}
                                        </button>
                                    </Link> */}
                                    <div className={`${styles.btnsBox}`} onClick={() => handleFillInformation()}>
                                        <button className='primarySolidBtn flex justify-center items-center'>
                                            {VerifyPaymentConst.fillInformationBtnText}
                                        </button>
                                    </div>
                                    {courseType === 'on-demand' ?
                                        <Link href={'/myProfile'} className={`${styles.btnsBox} no-underline`}>
                                            <button className='primaryStrockedBtn flex justify-center items-center'>
                                                {VerifyPaymentConst.watchCourseContentConst}
                                            </button>
                                        </Link>
                                        :
                                        invoiceUrl &&
                                        <Link target={'_blank'} href={invoiceUrl || ''} className={`${styles.btnsBox} no-underline`}>
                                            <button className='primaryStrockedBtn flex justify-center items-center'>
                                                <div className='pl-2' style={{ height: '1.5rem' }}>
                                                    <AllIconsComponenet height={24} width={24} iconName={'newDownloadIcon'} color={'#F26722'} />
                                                </div>
                                                {VerifyPaymentConst.downloadInvoiceBtnText}
                                            </button>
                                        </Link>
                                    }
                                </div>
                            </div>
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
