import styles from '../styles/PaymentDone.module.scss'
import Link from 'next/link';
import * as LinkConst from '../constants/LinkConst'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthRouteAPI, getPaymentInfoAPI, getTabbyPaymentInfoAPI, getTamaraPaymentInfoAPI, getFreePaymentInfoAPI } from '../services/apisService';
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
    const locale = router.locale || 'ar'

    const [tabbyResponseMessages, setTabbyResponseMessages] = useState({
        cancel: {
            en: "You aborted the payment. Please retry or choose another payment method.",
            ar: "لقد ألغيت الدفعة. فضلاً حاول مجددًا أو اختر طريقة دفع أخرى."
        },
        failure: {
            en: "Sorry, Tabby is unable to approve this purchase. Please use an alternative payment method for your order.",
            ar: "نأسف، تابي غير قادرة على الموافقة على هذه العملية. الرجاء استخدام طريقة دفع أخرى."
        }
    });

    const [tamaraResponseMessages, setTamaraResponseMessages] = useState({
        cancel: {
            en: "You aborted the payment. Please retry or choose another payment method.",
            ar: "لقد ألغيت الدفعة. فضلاً حاول مجددًا أو اختر طريقة دفع أخرى."
        },
        failure: {
            en: "Sorry, Tamara is unable to approve this purchase. Please use an alternative payment method for your order.",
            ar: "نأسف، تمارا غير قادرة على الموافقة على هذه العملية. الرجاء استخدام طريقة دفع أخرى."
        },
        success: {
            en: "Payment completed successfully with Tamara.",
            ar: "تمت عملية الدفع بنجاح عبر تمارا."
        }
    });

    const getTamaraCheckoutContext = () => {
        if (typeof window === 'undefined') {
            return null;
        }
        try {
            const raw = window.localStorage.getItem('tamaraCheckoutContext');
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            console.error('Failed to parse Tamara checkout context:', error);
            return null;
        }
    };

    const clearTamaraCheckoutContext = () => {
        if (typeof window === 'undefined') {
            return;
        }
        window.localStorage.removeItem('tamaraCheckoutContext');
    };

    const resolveTamaraMessage = (key) => {
        const messages = tamaraResponseMessages[key];
        if (!messages) {
            return null;
        }
        return locale === 'ar' ? messages.ar : messages.en;
    };

    const { orderId, id, type, payment_id, res } = router.query;

    const orderID = orderId || router.query.orderId || null;
    const isFreePayment = router.query.freePayment || false;
    const transactionID = id || router.query.id || null;
    const extractedType = type || null;
    const extractedPaymentID = payment_id || null;
    const redirectStatus = typeof res === 'string' ? res.toLowerCase() : null;
    const tabbyResultedResponse = redirectStatus || null;

    const [loading, setLoading] = useState(true)
    const [invoiceUrl, setInvoiceUrl] = useState('')
    const [paymentMessage, setPaymentMessage] = useState('Payment Fail');
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(true);
    const [tamaraContext, setTamaraContext] = useState(null);
    const tamaraVerificationStartedRef = useRef(false);
    const tamaraPollingTimeoutRef = useRef(null);
    const TAMARA_SUCCESS_STATUSES = ['AUTHORIZED', 'CLOSED', 'CAPTURED', 'ACCEPTED'];
    const TAMARA_PENDING_STATUSES = ['PENDING', 'IN_PROGRESS', 'OPEN'];
    const TAMARA_MAX_POLL_ATTEMPTS = 5;
    const TAMARA_POLL_INTERVAL = 3000;

    const tamaraContextOrderId = tamaraContext?.orderId || null;
    const tamaraContextPaymentId = tamaraContext?.tamaraPaymentId || tamaraContext?.paymentId || null;
    const resolvedTamaraOrderId = orderID || tamaraContextOrderId;
    const resolvedTamaraPaymentId = extractedPaymentID || tamaraContextPaymentId || null;

    useEffect(() => {
        return () => {
            if (tamaraPollingTimeoutRef.current) {
                clearTimeout(tamaraPollingTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (extractedType === 'tamara') {
            const context = getTamaraCheckoutContext();
            if (context) {
                setTamaraContext(context);
            }
        } else if (extractedType) {
            setTamaraContext(null);
            clearTamaraCheckoutContext();
        }
    }, [extractedType]);

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
        if (isFreePayment && orderID) {
            getFreePaymentData();
            return;
        }

        if (extractedType === 'tamara') {
            if (redirectStatus === 'cancel' || redirectStatus === 'failure') {
                const messageKey = redirectStatus === 'cancel' ? 'cancel' : 'failure';
                const localizedMessage =
                    resolveTamaraMessage(messageKey) ||
                    (locale === 'ar'
                        ? tamaraResponseMessages[messageKey]?.ar
                        : tamaraResponseMessages[messageKey]?.en) ||
                    'Payment could not be completed.';
                setPaymentMessage(localizedMessage);
                setIsPaymentSuccess(false);
                setLoading(false);
                if (tamaraPollingTimeoutRef.current) {
                    clearTimeout(tamaraPollingTimeoutRef.current);
                    tamaraPollingTimeoutRef.current = null;
                }
                clearTamaraCheckoutContext();
                tamaraVerificationStartedRef.current = true;
                return;
            }

            if ((redirectStatus === 'success' || !redirectStatus) && resolvedTamaraOrderId && resolvedTamaraPaymentId) {
                if (!tamaraVerificationStartedRef.current) {
                    tamaraVerificationStartedRef.current = true;
                    setLoading(true);
                    getPaymentData(resolvedTamaraOrderId, resolvedTamaraPaymentId, 0);
                }
            }
            return;
        }

        if ((!extractedType && router.query.orderId && router.query.id) || (extractedType && orderID && extractedPaymentID)) {
            getPaymentData();
        }
    }, [
        extractedType,
        redirectStatus,
        resolvedTamaraOrderId,
        resolvedTamaraPaymentId,
        orderID,
        extractedPaymentID,
        isFreePayment,
        router.query.orderId,
        router.query.id,
        locale,
        tamaraResponseMessages,
    ])

    const getPaymentData = async (overrideOrderId = null, overridePaymentId = null, tamaraAttempt = 0) => {
        if (!extractedType) {
            const data = {
                orderId: router.query.orderId,
                transactionId: router.query.id,
            };

            try {
                const response = await getPaymentInfoAPI(data);
                const paymentData = response.data?.[0];
                ((paymentData?.result?.code === '000.000.000' || paymentData?.result?.code === '000.100.110')
                    ? fbq.event('Purchase Successfull', { orderId: orderID })
                    : fbq.event('Purchase Fail', { orderId: orderID }));
                setTransactionDetails(response.data || []);
                const flag = paymentData?.result?.code === '000.000.000' || paymentData?.result?.code === '000.100.110';
                setIsPaymentSuccess(Boolean(flag));
                setLoading(false);
                setInvoiceUrl(mediaUrl(paymentData?.orderDetails?.invoiceBucket, paymentData?.orderDetails?.invoiceKey));
                const getMyCourseReq = getAuthRouteAPI({ routeName: 'myCourses' });
                const [myCourseData] = await Promise.all([getMyCourseReq]);
                dispatch({
                    type: 'SET_ALL_MYCOURSE',
                    myCourses: myCourseData?.data,
                });
            } catch (error) {
                setLoading(false);
            }
            return;
        }

        if (extractedType === 'tamara') {
            const targetOrderId = overrideOrderId || orderId || resolvedTamaraOrderId;
            const targetPaymentId = overridePaymentId || extractedPaymentID || resolvedTamaraPaymentId;

            if (!targetOrderId || !targetPaymentId) {
                setLoading(false);
                setPaymentMessage(resolveTamaraMessage('failure') || 'Tamara payment could not be located.');
                clearTamaraCheckoutContext();
                setTamaraContext(null);
                return;
            }

            const payload = {
                orderId: targetOrderId,
                paymentId: targetPaymentId,
            };

            try {
                const response = await getTamaraPaymentInfoAPI(payload);
                const paymentData = response.data?.[0] || null;
                const status = paymentData?.status;
                const isSuccessStatus = TAMARA_SUCCESS_STATUSES.includes(status);
                const isPendingStatus = TAMARA_PENDING_STATUSES.includes(status);

                setTransactionDetails(response.data || []);
                setIsPaymentSuccess(isSuccessStatus);
                if (isSuccessStatus) {
                    fbq.event('Purchase Successfull', { orderId: targetOrderId });
                } else if (!isPendingStatus && (redirectStatus === 'success' || !redirectStatus)) {
                    fbq.event('Purchase Fail', { orderId: targetOrderId });
                }

                if (isPendingStatus && tamaraAttempt < TAMARA_MAX_POLL_ATTEMPTS && (redirectStatus === 'success' || !redirectStatus)) {
                    if (tamaraPollingTimeoutRef.current) {
                        clearTimeout(tamaraPollingTimeoutRef.current);
                    }
                    tamaraPollingTimeoutRef.current = setTimeout(() => {
                        getPaymentData(targetOrderId, targetPaymentId, tamaraAttempt + 1);
                    }, TAMARA_POLL_INTERVAL);
                    return;
                }

                if (redirectStatus === 'cancel' || redirectStatus === 'failure') {
                    const messageKey = redirectStatus === 'cancel' ? 'cancel' : 'failure';
                    const localizedMessage =
                        resolveTamaraMessage(messageKey) ||
                        (locale === 'ar'
                            ? tamaraResponseMessages[messageKey]?.ar
                            : tamaraResponseMessages[messageKey]?.en);
                    setPaymentMessage(localizedMessage || 'Payment could not be completed.');
                } else if (isSuccessStatus) {
                    const localizedMessage =
                        locale === 'ar'
                            ? paymentData?.messageAR
                            : paymentData?.messageEn || paymentData?.messageEN || paymentData?.messageAr || paymentData?.messageAR;
                    setPaymentMessage(localizedMessage || resolveTamaraMessage('success') || 'Payment completed successfully.');
                } else if (isPendingStatus) {
                    setPaymentMessage(resolveTamaraMessage('failure') || 'Payment confirmation timed out. Please contact support.');
                } else {
                    setPaymentMessage(resolveTamaraMessage('failure') || 'Payment could not be completed.');
                }

                setLoading(false);
                setInvoiceUrl(mediaUrl(paymentData?.orderDetails?.invoiceBucket, paymentData?.orderDetails?.invoiceKey));
                const getMyCourseReq = getAuthRouteAPI({ routeName: 'myCourses' });
                const [myCourseData] = await Promise.all([getMyCourseReq]);
                dispatch({
                    type: 'SET_ALL_MYCOURSE',
                    myCourses: myCourseData?.data,
                });

                if (!isPendingStatus) {
                    if (tamaraPollingTimeoutRef.current) {
                        clearTimeout(tamaraPollingTimeoutRef.current);
                        tamaraPollingTimeoutRef.current = null;
                    }
                    clearTamaraCheckoutContext();
                    setTamaraContext(null);
                }
            } catch (error) {
                if (tamaraAttempt < TAMARA_MAX_POLL_ATTEMPTS - 1 && (redirectStatus === 'success' || !redirectStatus)) {
                    if (tamaraPollingTimeoutRef.current) {
                        clearTimeout(tamaraPollingTimeoutRef.current);
                    }
                    tamaraPollingTimeoutRef.current = setTimeout(() => {
                        getPaymentData(targetOrderId, targetPaymentId, tamaraAttempt + 1);
                    }, TAMARA_POLL_INTERVAL);
                    return;
                }
                const fallbackMessage =
                    resolveTamaraMessage('failure') ||
                    (locale === 'ar' ? tamaraResponseMessages.failure.ar : tamaraResponseMessages.failure.en) ||
                    'Payment could not be completed.';
                setPaymentMessage(fallbackMessage);
                fbq.event('Purchase Fail', { orderId: targetOrderId });
                setIsPaymentSuccess(false);
                setLoading(false);
                clearTamaraCheckoutContext();
                setTamaraContext(null);
            }
            return;
        }

        if (!extractedPaymentID) {
            setLoading(false);
            setPaymentMessage(tabbyResponseMessages.failure.ar);
            return;
        }

        const data = {
            orderId: orderId,
            paymentId: extractedPaymentID,
        };

        try {
            const response = await getTabbyPaymentInfoAPI(data);
            const paymentData = response.data?.[0];
            const flag = paymentData?.status === 'AUTHORIZED' || paymentData?.status === 'CLOSED';

            setTransactionDetails(response.data || []);
            setIsPaymentSuccess(flag);
            if (tabbyResultedResponse !== 'success') {
                if (tabbyResultedResponse === 'cancel') {
                    setPaymentMessage(tabbyResponseMessages.cancel.ar);
                } else {
                    setPaymentMessage(tabbyResponseMessages.failure.ar);
                }
            } else {
                setPaymentMessage(paymentData?.messageAR);
            }
            setLoading(false);
            setInvoiceUrl(mediaUrl(paymentData?.orderDetails?.invoiceBucket, paymentData?.orderDetails?.invoiceKey));
            const getMyCourseReq = getAuthRouteAPI({ routeName: 'myCourses' });
            const [myCourseData] = await Promise.all([getMyCourseReq]);
            dispatch({
                type: 'SET_ALL_MYCOURSE',
                myCourses: myCourseData?.data,
            });
        } catch (error) {
            setLoading(false);
        }
    };

    const getFreePaymentData = async () => {
        let data = {
            orderId: router.query.orderId,
            transactionId: router.query.id,
        }

        let paymentData;

        await getFreePaymentInfoAPI(data).then(async (response) => {
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

            // // If payment is successful, send WhatsApp message
            // if (flag) {
            //     await sendWhatsAppMessage(paymentData);
            // }

        }).catch(async (error) => {
            setLoading(false)
        });
    }

    const sendWhatsAppMessage = async (orderDetail) => {
        console.log(orderDetail);
        const buyerPhone = orderDetail.orderDetails.buyerPhone;
        const buyerFullName = orderDetail.orderDetails.buyerFullName;
        const buyerEmail = orderDetail.orderDetails.buyerEmail;
        const gender = JSON.parse(localStorage.getItem('gender')) || "male";

        const registeredDate = JSON.parse(localStorage.getItem('registeredDate')) ? JSON.parse(localStorage.getItem('registeredDate')) : "";
        const courseType = JSON.parse(localStorage.getItem('courseType'));
        const courseTitle = registeredDate?.course.name?.trim() || '';
        const locationText = registeredDate?.locationName?.trim() || registeredDate?.course?.link?.trim() || '';
        const locationURL = registeredDate?.location?.trim() || '';
        const date = `من ${dateWithDay(registeredDate?.dateFrom)} إلى ${dateWithDay(registeredDate?.dateTo)}`;
        const duration = timeDuration2(registeredDate?.timeFrom, registeredDate?.timeTo);

        const whatsAppGroupLinks = registeredDate?.whatsappGroupLink?.trim() || '';
        console.log("whatsappGroupLink: ", whatsAppGroupLinks);
        const classRoomCode = registeredDate?.classRoomCode?.trim() || '';

        if (whatsAppGroupLinks && classRoomCode) {
            const groupLinks = whatsAppGroupLinks.split(/\s+/);
            console.log("groupLinks: ", groupLinks);
            if (groupLinks.length === 2) {
                const [maleLink, femaleLink] = groupLinks;
                const whatsapplink = gender === 'male' ? maleLink : femaleLink;
                try {
                    // Call the sendMessage function from morasalaty.js
                    const result = await sendMessage(buyerPhone, buyerFullName, buyerEmail, courseTitle, locationText, locationURL, date, duration, gender, whatsapplink, courseType, classRoomCode);

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
                    const result = await sendMessage(buyerPhone, buyerFullName, buyerEmail, courseTitle, locationText, locationURL, date, duration, gender, whatsapplink, courseType, classRoomCode);

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
                    const result = await sendMessage(buyerPhone, buyerFullName, buyerEmail, courseTitle, locationText, locationURL, date, duration, gender, whatsapplink, courseType, "");

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
                    const result = await sendMessage(buyerPhone, buyerFullName, buyerEmail, courseTitle, locationText, locationURL, date, duration, gender, whatsapplink, courseType, "");

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
                const result = await sendMessage(buyerPhone, buyerFullName, buyerEmail, courseTitle, locationText, locationURL, date, duration, gender, "", courseType, classRoomCode);

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
                const result = await sendMessage(buyerPhone, buyerFullName, buyerEmail, courseTitle, locationText, locationURL, date, duration, gender, "", courseType, "");

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
                            <h1>{paymentMessage}</h1>
                        </div>
                    }
                </>
            }
        </>
    )
}
