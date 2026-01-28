import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../styles/PaymentDone.module.scss';
import Spinner from '../components/CommonComponents/spinner';
import AllIconsComponenet from '../Icons/AllIconsComponenet';
import { mediaUrl } from '../constants/DataManupulation';
import * as fbq from '../lib/fpixel';

export default function BookPaymentVerify() {
    const router = useRouter();
    const { orderId, id, type, payment_id, res } = router.query;

    const [loading, setLoading] = useState(true);
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const [paymentMessage, setPaymentMessage] = useState('');
    const [invoiceUrl, setInvoiceUrl] = useState('');

    const verificationStartedRef = useRef(false);

    useEffect(() => {
        if (!router.isReady) return;

        const targetOrderId = orderId || router.query.orderId;
        const targetTransactionId = id || router.query.id || payment_id;

        if (targetOrderId && !verificationStartedRef.current) {
            verificationStartedRef.current = true;
            verifyPayment(targetOrderId, targetTransactionId);
        }
    }, [router.isReady, orderId, id, payment_id]);

    const verifyPayment = async (orderIdParam, transactionIdParam) => {
        // Check if this is a Tabby response via query params
        if (type === 'tabby' && res) {
            handleTabbyResponse(orderIdParam, res);
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/verifyBookPayment`,
                {
                    orderId: orderIdParam,
                    transactionId: transactionIdParam
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const paymentData = response.data?.[0];
            
            if (paymentData) {
                setTransactionDetails(paymentData);
                
                // Check for all success codes from HyperPay
                const successCodes = ['000.000.000', '000.100.110', '000.100.111', '000.100.112'];
                const resultCode = paymentData?.result?.code;
                const isSuccess = successCodes.includes(resultCode);
                
                setIsPaymentSuccess(isSuccess);

                if (isSuccess) {
                    fbq.event('Purchase', { 
                        orderId: orderIdParam,
                        value: paymentData?.orderDetails?.grandTotal,
                        currency: 'SAR'
                    });

                    // Set invoice URL if available
                    if (paymentData?.orderDetails?.invoiceBucket && paymentData?.orderDetails?.invoiceKey) {
                        setInvoiceUrl(mediaUrl(
                            paymentData.orderDetails.invoiceBucket, 
                            paymentData.orderDetails.invoiceKey
                        ));
                    }

                    // Clear book order data from localStorage
                    localStorage.removeItem('bookOrderData');
                } else {
                    setPaymentMessage(paymentData?.result?.description || 'فشل الدفع. يرجى المحاولة مرة أخرى.');
                    fbq.event('Purchase Failed', { orderId: orderIdParam });
                }
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            setPaymentMessage('حدث خطأ أثناء التحقق من الدفع. يرجى التواصل معنا.');
            setIsPaymentSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    const handleTabbyResponse = async (orderIdParam, result) => {
        if (result === 'success') {
            // Verify with backend for Tabby
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/verifyBookPayment`,
                    {
                        orderId: orderIdParam,
                        type: 'tabby'
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const paymentData = response.data?.[0];
                if (paymentData) {
                    setTransactionDetails(paymentData);
                    setIsPaymentSuccess(true);
                    
                    if (paymentData?.orderDetails?.invoiceBucket && paymentData?.orderDetails?.invoiceKey) {
                        setInvoiceUrl(mediaUrl(
                            paymentData.orderDetails.invoiceBucket, 
                            paymentData.orderDetails.invoiceKey
                        ));
                    }
                    
                    localStorage.removeItem('bookOrderData');
                    fbq.event('Purchase', { orderId: orderIdParam, currency: 'SAR' });
                }
            } catch (error) {
                console.error('Error verifying Tabby payment:', error);
                setIsPaymentSuccess(true); // Still show success since Tabby redirected with success
                localStorage.removeItem('bookOrderData');
            }
        } else if (result === 'cancel') {
            setPaymentMessage('تم إلغاء عملية الدفع.');
            setIsPaymentSuccess(false);
        } else {
            setPaymentMessage('فشل الدفع عبر تابي. يرجى المحاولة مرة أخرى.');
            setIsPaymentSuccess(false);
            fbq.event('Purchase Failed', { orderId: orderIdParam });
        }
        setLoading(false);
    };

    return (
        <>
            <Head>
                <title>{isPaymentSuccess ? 'تم الدفع بنجاح' : 'نتيجة الدفع'} - أنا أستوري</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            {loading ? (
                <div className={`relative ${styles.mainArea}`}>
                    <Spinner borderwidth={7} width={6} height={6} />
                    <h1 style={{ textAlign: 'center' }}>جاري التحقق من الدفع...</h1>
                    <h3 style={{ textAlign: 'center', padding: '0 1rem' }}>
                        يرجى عدم إغلاق هذه الصفحة
                    </h3>
                </div>
            ) : (
                <>
                    {isPaymentSuccess ? (
                        <div className={`maxWidthDefault ${styles.mainArea}`}>
                            <div className={styles.paymentSuccessArea}>
                                <div className='m-5'>
                                    <div className={styles.circle}>
                                        <AllIconsComponenet iconName={'checkCircleRoundIcon'} height={40} width={35} color={'#FFFFFF'} />
                                    </div>
                                </div>
                                <h1 className='head1'>تم الدفع بنجاح!</h1>
                                <p className='fontMedium text-lg p-2'>
                                    شكراً لك! تم استلام طلبك بنجاح وسيتم شحنه في أقرب وقت.
                                </p>
                                <p className='fontMedium text-lg p-2'>
                                    سيتم إرسال تفاصيل الشحن على بريدك الإلكتروني.
                                </p>

                                <div className={styles.orderInfoBox}>
                                    <div className='flex'>
                                        <div className='mt-3'>
                                            <AllIconsComponenet height={20} width={20} iconName={'informationIcon'} color={'#1C26FF'} />
                                        </div>
                                        <p className='fontMedium text-lg p-2'>
                                            رقم الطلب: #{transactionDetails?.orderDetails?.id || orderId}
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.paymentSuccessBtnWrapper}>
                                    <Link href={'/books'} className={`${styles.btnsBox} no-underline`}>
                                        <button className='primarySolidBtn flex justify-center items-center'>
                                            العودة للمتجر
                                        </button>
                                    </Link>
                                    
                                    {invoiceUrl && (
                                        <Link target={'_blank'} href={invoiceUrl} className={`${styles.btnsBox} no-underline`}>
                                            <button className='primaryStrockedBtn flex justify-center items-center'>
                                                <div className='pl-2' style={{ height: '1.5rem' }}>
                                                    <AllIconsComponenet height={24} width={24} iconName={'newDownloadIcon'} color={'#F26722'} />
                                                </div>
                                                تحميل الفاتورة
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={`maxWidthDefault ${styles.mainArea}`}>
                            <div className={styles.paymentFailArea}>
                                <div className='m-5'>
                                    <AllIconsComponenet iconName={'errorCircleIcon'} height={60} width={60} color={'#DC3545'} />
                                </div>
                                <h1 className='head1' style={{ color: '#DC3545' }}>فشل الدفع</h1>
                                <p className='fontMedium text-lg p-2'>
                                    {paymentMessage || 'لم نتمكن من إتمام عملية الدفع. يرجى المحاولة مرة أخرى.'}
                                </p>

                                <div className={styles.paymentSuccessBtnWrapper}>
                                    <Link href={'/books'} className={`${styles.btnsBox} no-underline`}>
                                        <button className='primarySolidBtn flex justify-center items-center'>
                                            العودة للمتجر
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
