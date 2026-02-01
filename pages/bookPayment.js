import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/legacy/image';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from '../styles/BookPayment.module.scss';
import DeliveryInfoForm from '../components/BookPayment/DeliveryInfoForm';
import BookOrderSummary from '../components/BookPayment/BookOrderSummary';
import BankTransferConfirmModal from '../components/BookPayment/BankTransferConfirmModal';
import Logo from '../components/CommonComponents/Logo';
import Spinner from '../components/CommonComponents/spinner';
import AllIconsComponenet from '../Icons/AllIconsComponenet';
import * as fbq from '../lib/fpixel';
import { createBookOrderAPI, createBookPaymentCheckoutAPI, createTamaraCheckoutAPI } from '../services/apisService';
import TamaraCheckoutForm from '../components/PaymentPageComponents/PaymentInfoForm/TamaraCheckout';
import ApplePayForm from '../components/PaymentPageComponents/PaymentInfoForm/ApplePayForm';
import MadaCardDetailForm from '../components/PaymentPageComponents/PaymentInfoForm/MadaCardDetailForm';
import CreditCardDetailForm from '../components/PaymentPageComponents/PaymentInfoForm/CreditCardDetailForm';
import { getNewToken } from '../services/fireBaseAuthService';

export default function BookPaymentPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Delivery Info, 2: Payment
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [bookData, setBookData] = useState(null);
    const [deliveryFee, setDeliveryFee] = useState(30); // Default, will be fetched
    const [createdOrder, setCreatedOrder] = useState(null);
    const [checkoutId, setCheckoutId] = useState(null);
    const [paymentType, setPaymentType] = useState('');
    const [hyperPayIntegrity, setHyperPayIntegrity] = useState(null);
    const [showBankTransferModal, setShowBankTransferModal] = useState(false);
    const [bankTransferLoading, setBankTransferLoading] = useState(false);
    const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);

    const [formData, setFormData] = useState({
        buyerFullName: '',
        buyerPhone: '',
        buyerEmail: '',
        city: '',
        district: '',
        street: '',
        buildingNumber: '',
        additionalCode: '',
        postalCode: '',
        shortAddress: '',
        country: 'Saudi Arabia'
    });

    const [errors, setErrors] = useState({});
    
    // Tamara payment state (matching PaymentInfoForm pattern)
    const [tamaraLabel, setTamaraLabel] = useState(null);
    const [tamaraAvailability, setTamaraAvailability] = useState({ status: 'unknown', message: '' });
    const [tamaraCheckoutLoading, setTamaraCheckoutLoading] = useState(false);
    const selectedLocale = router.locale || 'ar';
    const tamaraFallbackCopy = {
        ar: 'تمارا غير متاحة لهذا المبلغ.',
        en: 'Tamara is not available for this amount.',
    };
    const tamaraGenericErrorCopy = {
        ar: 'حدث خطأ أثناء إنشاء جلسة تمارا. يرجى المحاولة مرة أخرى.',
        en: 'Something went wrong while starting the Tamara checkout. Please try again.',
    };

    const clearSelectedPaymentRadio = () => {
        if (typeof document === 'undefined') {
            return;
        }
        const selected = document.querySelector('input[type=radio][name=paymentMethod]:checked');
        if (selected) {
            selected.checked = false;
        }
    };

    // Fetch book data from localStorage on mount
    useEffect(() => {
        const storedBookData = localStorage.getItem('bookOrderData');
        if (storedBookData) {
            try {
                const parsed = JSON.parse(storedBookData);
                setBookData(parsed);
            } catch (error) {
                console.error('Error parsing book data:', error);
                router.push('/books');
                return;
            }
        } else {
            router.push('/books');
            return;
        }

        // Fetch shop configuration for delivery fee
        fetchShopConfiguration();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Detect Apple Pay availability (works on Apple devices in any browser)
    useEffect(() => {
        const checkApplePay = () => {
            // Method 1: Check for ApplePaySession API (Safari and WKWebView on iOS)
            if (window.ApplePaySession) {
                setIsApplePayAvailable(true);
                return;
            }
            
            // Method 2: Check if we're on an Apple device (iOS/macOS) for HyperPay Apple Pay
            const userAgent = navigator.userAgent || navigator.vendor;
            const platform = navigator.platform || '';
            const isIOS = /iPad|iPhone|iPod/.test(userAgent) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            const isMacOS = /Mac/.test(platform);
            
            // Apple Pay via HyperPay works on Apple devices even in Chrome
            if (isIOS || isMacOS) {
                setIsApplePayAvailable(true);
            }
        };
        
        checkApplePay();
    }, []);

    const fetchShopConfiguration = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-any`, {
                params: { collection: 'ShopConfiguration' }
            });
            if (response.data && response.data.length > 0) {
                setDeliveryFee(response.data[0].deliveryFee || 30);
            }
        } catch (error) {
            console.error('Error fetching shop configuration:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.buyerFullName.trim()) {
            newErrors.buyerFullName = 'الاسم الكامل مطلوب';
        }

        if (!formData.buyerPhone.trim()) {
            newErrors.buyerPhone = 'رقم الجوال مطلوب';
        } else if (!/^[\d+\s-]{9,15}$/.test(formData.buyerPhone.replace(/\s/g, ''))) {
            newErrors.buyerPhone = 'رقم الجوال غير صحيح';
        }

        if (!formData.buyerEmail.trim()) {
            newErrors.buyerEmail = 'البريد الإلكتروني مطلوب';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.buyerEmail)) {
            newErrors.buyerEmail = 'البريد الإلكتروني غير صحيح';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'المدينة مطلوبة';
        }

        if (!formData.district.trim()) {
            newErrors.district = 'الحي مطلوب';
        }

        if (!formData.street.trim()) {
            newErrors.street = 'الشارع مطلوب';
        }

        if (!formData.buildingNumber.trim()) {
            newErrors.buildingNumber = 'رقم المبنى مطلوب';
        }

        if (!formData.postalCode.trim()) {
            newErrors.postalCode = 'الرمز البريدي مطلوب';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitDeliveryInfo = async () => {
        if (!validateForm()) {
            toast.error('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        setSubmitting(true);

        try {
            // Create book order
            const orderPayload = {
                bookId: bookData.bookId,
                quantity: bookData.quantity,
                buyerFullName: formData.buyerFullName,
                buyerPhone: formData.buyerPhone,
                buyerEmail: formData.buyerEmail,
                deliveryAddress: {
                    city: formData.city,
                    district: formData.district,
                    street: formData.street,
                    buildingNumber: formData.buildingNumber,
                    additionalCode: formData.additionalCode,
                    postalCode: formData.postalCode,
                    shortAddress: formData.shortAddress,
                    country: formData.country
                }
            };

            let response;
            try {
                response = await createBookOrderAPI(orderPayload);
            } catch (err) {
                if (err?.response?.status === 401) {
                    await getNewToken();
                    response = await createBookOrderAPI(orderPayload);
                } else {
                    throw err;
                }
            }

            if (response.data) {
                setCreatedOrder(response.data);
                setStep(2);
                fbq.event('InitiateCheckout', { 
                    orderId: response.data.id,
                    bookId: bookData.bookId,
                    quantity: bookData.quantity 
                });
            }
        } catch (error) {
            console.error('Error creating book order:', error);
            toast.error('حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.');
        } finally {
            setSubmitting(false);
        }
    };

    const clearPaymentWidget = () => {
        // Clear checkout state
        setCheckoutId(null);
        setHyperPayIntegrity(null);
        setPaymentType(null);
        
        // Remove any existing HyperPay scripts and widget safely
        try {
            const existingScripts = document.querySelectorAll('script[src*="paymentWidgets"]');
            existingScripts.forEach(script => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            });
        } catch (e) {
            console.warn('Error removing payment scripts:', e);
        }
        
        // Clear wpwlOptions
        if (typeof window !== 'undefined') {
            window.wpwlOptions = undefined;
        }
        
        // Clear any existing widget elements safely
        try {
            const widgetElements = document.querySelectorAll('.wpwl-container, .wpwl-form');
            widgetElements.forEach(el => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        } catch (e) {
            console.warn('Error removing widget elements:', e);
        }
    };

    const generateCheckoutId = async (type) => {
        if (!createdOrder) return;

        // Clear existing widget first
        clearPaymentWidget();

        fbq.event('Initiate checkout', { orderId: createdOrder.id, paymentMode: type });

        const payload = {
            orderId: createdOrder.id,
            orderType: 'book',
            type: type
        };

        try {
            let response;
            try {
                response = await createBookPaymentCheckoutAPI(payload);
            } catch (err) {
                if (err?.response?.status === 401) {
                    await getNewToken();
                    response = await createBookPaymentCheckoutAPI(payload);
                } else {
                    throw err;
                }
            }

            if (response.status === 200) {
                setPaymentType(type);
                setCheckoutId(response.data[0]?.id);
                setHyperPayIntegrity(response.data[2]);
            }
        } catch (error) {
            console.error(`Error generating checkout ID for ${type}:`, error);
            toast.error('حدث خطأ أثناء تجهيز الدفع. يرجى المحاولة مرة أخرى.');
        }
    };

    const openBankTransferModal = () => {
        if (!createdOrder) return;
        
        // Clear existing widget first
        clearPaymentWidget();
        setShowBankTransferModal(true);
    };

    const confirmBankTransfer = async () => {
        if (!createdOrder) return;

        setBankTransferLoading(true);
        fbq.event('Initiate checkout', { orderId: createdOrder.id, paymentMode: 'Bank Transfer' });

        try {
            let response;
            try {
                response = await createBookPaymentCheckoutAPI({ orderId: createdOrder.id, type: 'bank_transfer' });
            } catch (err) {
                if (err?.response?.status === 401) {
                    await getNewToken();
                    response = await createBookPaymentCheckoutAPI({ orderId: createdOrder.id, type: 'bank_transfer' });
                } else {
                    throw err;
                }
            }

            if (response.status === 200) {
                setShowBankTransferModal(false);
                // Navigate to upload page with order ID
                router.push({
                    pathname: '/bankTransferUpload',
                    query: { orderId: createdOrder.id }
                });
            }
        } catch (error) {
            console.error('Error processing bank transfer:', error);
            toast.error('حدث خطأ. يرجى المحاولة مرة أخرى.');
        } finally {
            setBankTransferLoading(false);
        }
    };

    const handleTabbyPayment = async () => {
        if (!createdOrder) return;

        fbq.event('Initiate checkout', { orderId: createdOrder.id, paymentMode: 'tabby' });

        try {
            let response;
            try {
                response = await createBookPaymentCheckoutAPI({ orderId: createdOrder.id, type: 'tabby' });
            } catch (err) {
                if (err?.response?.status === 401) {
                    await getNewToken();
                    response = await createBookPaymentCheckoutAPI({ orderId: createdOrder.id, type: 'tabby' });
                } else {
                    throw err;
                }
            }

            if (response.status === 200 && response.data?.[0]?.url) {
                // Redirect to Tabby checkout
                window.location.href = response.data[0].url;
            }
        } catch (error) {
            console.error('Error initiating Tabby payment:', error);
            toast.error('حدث خطأ في تابي. يرجى المحاولة مرة أخرى.');
        }
    };

    const handleTamaraPayment = async () => {
        if (!createdOrder) return;

        // Clear existing widget first
        clearPaymentWidget();

        fbq.event('Initiate checkout', { orderId: createdOrder.id, paymentMode: 'tamara' });

        const basePayload = {
            orderId: createdOrder.id,
            orderType: 'book',
            type: 'tamara',
        };

        setTamaraCheckoutLoading(true);
        try {
            let response;
            try {
                response = await createTamaraCheckoutAPI(basePayload);
            } catch (err) {
                if (err?.response?.status === 401) {
                    await getNewToken();
                    response = await createTamaraCheckoutAPI(basePayload);
                } else {
                    throw err;
                }
            }

            const checkoutResult = response?.data?.[0];
            const orderDetails = response?.data?.[1];
            const availableLabels = checkoutResult?.tamaraOptions?.available_payment_labels || [];

            if (!availableLabels.length) {
                setTamaraAvailability({
                    status: 'unavailable',
                    message: selectedLocale === 'ar' ? tamaraFallbackCopy.ar : tamaraFallbackCopy.en,
                });
                setTamaraLabel(null);
                setCheckoutId(null);
                setPaymentType('');
                clearSelectedPaymentRadio();
                toast.info(selectedLocale === 'ar' ? tamaraFallbackCopy.ar : tamaraFallbackCopy.en);
                window.localStorage.removeItem('tamaraCheckoutContext');
                return;
            }

            setTamaraAvailability({ status: 'available', message: '' });
            setPaymentType('tamara');
            setCheckoutId(checkoutResult?.id || null);
            setTamaraLabel(availableLabels[0]);
            setHyperPayIntegrity(null);

            const tamaraContext = {
                orderId: orderDetails?.id || createdOrder.id,
                checkoutId: checkoutResult?.id,
                ndc: checkoutResult?.ndc,
                timestamp: Date.now(),
                availablePaymentLabels: availableLabels,
                tamaraPaymentId: orderDetails?.tamaraPaymentId || orderDetails?.paymentId || null,
            };

            window.localStorage.setItem('tamaraCheckoutContext', JSON.stringify(tamaraContext));
        } catch (error) {
            console.error('Error generating Tamara checkout ID:', error);
            setTamaraAvailability({
                status: 'error',
                message: selectedLocale === 'ar' ? tamaraGenericErrorCopy.ar : tamaraGenericErrorCopy.en,
            });
            setTamaraLabel(null);
            setCheckoutId(null);
            setPaymentType('');
            clearSelectedPaymentRadio();
            toast.error(selectedLocale === 'ar' ? tamaraGenericErrorCopy.ar : tamaraGenericErrorCopy.en);
            window.localStorage.removeItem('tamaraCheckoutContext');
        } finally {
            setTamaraCheckoutLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spinner borderwidth={7} width={6} height={6} />
                <p>جاري تحميل بيانات الطلب...</p>
            </div>
        );
    }

    if (!bookData) {
        return null;
    }

    return (
        <>
            <Head>
                <title>إتمام الشراء - أنا أستوري</title>
                <meta name="description" content="إتمام شراء الكتاب" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <main className={styles.paymentContainer}>
                <div className="maxWidthDefault">
                    {/* Progress Indicator */}
                    <div className={styles.progressIndicator}>
                        <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ''}`}>
                            <div className={styles.stepNumber}>1</div>
                            <span className={styles.stepLabel}>معلومات التوصيل</span>
                        </div>
                        <div className={styles.progressLine}></div>
                        <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ''}`}>
                            <div className={styles.stepNumber}>2</div>
                            <span className={styles.stepLabel}>الدفع</span>
                        </div>
                    </div>

                    <div className={styles.contentWrapper}>
                        {/* Left Section - Form */}
                        <div className={styles.formSection}>
                            {step === 1 && (
                                <>
                                    <DeliveryInfoForm 
                                        formData={formData}
                                        setFormData={setFormData}
                                        errors={errors}
                                    />
                                    <div className={styles.actionButtons}>
                                        <button 
                                            className={`primarySolidBtn ${styles.submitBtn}`}
                                            onClick={handleSubmitDeliveryInfo}
                                            disabled={submitting}
                                        >
                                            {submitting ? 'جاري المعالجة...' : 'متابعة للدفع'}
                                        </button>
                                        <button 
                                            className={`primaryStrockedBtn ${styles.backBtn}`}
                                            onClick={() => router.push('/books')}
                                        >
                                            العودة للمتجر
                                        </button>
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <div className={styles.paymentSection}>
                                    <h2 className={styles.paymentTitle}>اختر طريقة الدفع</h2>
                                    
                                    <div className={styles.paymentOptions}>
                                        {/* Mada Payment */}
                                        <label className={styles.paymentOption}>
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                onClick={() => generateCheckoutId('mada')}
                                            />
                                            <div className={styles.paymentCard}>
                                                <div className={styles.paymentInfo}>
                                                    <span className={styles.paymentLabel}>بطاقة مدى البنكية</span>
                                                </div>
                                                <Logo height={27} width={53} logoName={'madaPaymentLogo'} alt={'Mada'} />
                                            </div>
                                            {/* Mada form rendered when selected */}
                                            {(checkoutId && paymentType === 'mada' && hyperPayIntegrity) && (
                                                <div className={styles.paymentFormContainer}>
                                                    <MadaCardDetailForm 
                                                        checkoutID={checkoutId} 
                                                        orderID={createdOrder.id} 
                                                        integrity={hyperPayIntegrity} 
                                                    />
                                                </div>
                                            )}
                                        </label>

                                        {/* Credit Card */}
                                        <label className={styles.paymentOption}>
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                onClick={() => generateCheckoutId('credit')}
                                            />
                                            <div className={styles.paymentCard}>
                                                <div className={styles.paymentInfo}>
                                                    <span className={styles.paymentLabel}>بطاقة ائتمانية</span>
                                                </div>
                                                <Logo height={27} width={120} logoName={'creditCardPaymentLogo'} alt={'Credit Card'} />
                                            </div>
                                            {/* Credit Card form rendered when selected */}
                                            {(checkoutId && paymentType === 'credit' && hyperPayIntegrity) && (
                                                <div className={styles.paymentFormContainer}>
                                                    <CreditCardDetailForm 
                                                        checkoutID={checkoutId} 
                                                        orderID={createdOrder.id} 
                                                        integrity={hyperPayIntegrity} 
                                                    />
                                                </div>
                                            )}
                                        </label>

                                        {/* Apple Pay - Only shown on Apple devices */}
                                        {isApplePayAvailable && (
                                            <label className={styles.paymentOption}>
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    onClick={() => generateCheckoutId('applepay')}
                                                />
                                                <div className={styles.paymentCard}>
                                                    <div className={styles.paymentInfo}>
                                                        <span className={styles.paymentLabel}>Apple Pay</span>
                                                    </div>
                                                    <Logo height={27} width={60} logoName={'applePayLogo'} alt={'Apple Pay'} />
                                                </div>
                                                {/* Apple Pay form rendered when selected */}
                                                {(checkoutId && paymentType === 'applepay' && hyperPayIntegrity) && (
                                                    <div className={styles.paymentFormContainer}>
                                                        <ApplePayForm 
                                                            checkoutID={checkoutId} 
                                                            orderID={createdOrder.id} 
                                                            integrity={hyperPayIntegrity} 
                                                        />
                                                    </div>
                                                )}
                                            </label>
                                        )}

                                        {/* Bank Transfer */}
                                        <label className={styles.paymentOption}>
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                onClick={openBankTransferModal}
                                            />
                                            <div className={styles.paymentCard}>
                                                <div className={styles.paymentInfo}>
                                                    <span className={styles.paymentLabel}>تحويل بنكي</span>
                                                </div>
                                                <AllIconsComponenet iconName={'bankTransfer'} height={27} width={40} />
                                            </div>
                                        </label>

                                        {/* Tamara - Buy Now Pay Later */}
                                        {tamaraAvailability.status !== 'unavailable' && (
                                            <label className={styles.paymentOption}>
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    onClick={handleTamaraPayment}
                                                    disabled={tamaraCheckoutLoading}
                                                />
                                                <div className={`${styles.paymentCard} ${tamaraCheckoutLoading ? styles.paymentCardDisabled : ''}`}>
                                                    <div className={styles.paymentInfo}>
                                                        <span className={styles.paymentLabel}>تمارا - اشتري الآن وادفع لاحقاً</span>
                                                        <span className={styles.paymentSubtext}>بدون فوائد</span>
                                                    </div>
                                                    <div style={{ width: '70px', height: '40px', position: 'relative' }}>
                                                        <Image src="/logos/Tamara.png" alt="Tamara" layout="fill" objectFit="contain" />
                                                    </div>
                                                </div>
                                                {/* Tamara loading and form container */}
                                                {tamaraCheckoutLoading && (
                                                    <div className={styles.tamaraLoadingState}>
                                                        <span>{selectedLocale === 'ar' ? 'جارٍ تجهيز خيار تمارا...' : 'Preparing Tamara checkout…'}</span>
                                                    </div>
                                                )}
                                                {(checkoutId && paymentType === 'tamara') && (
                                                    <div className={styles.paymentFormContainer}>
                                                        <TamaraCheckoutForm
                                                            orderId={createdOrder.id}
                                                            checkoutId={checkoutId}
                                                            tamaraLabel={tamaraLabel}
                                                            selectedLocale={selectedLocale}
                                                            onError={(error) => {
                                                                console.error('Tamara payment error:', error);
                                                                toast.error(selectedLocale === 'ar' ? tamaraGenericErrorCopy.ar : tamaraGenericErrorCopy.en);
                                                                setTamaraAvailability({
                                                                    status: 'error',
                                                                    message: selectedLocale === 'ar' ? tamaraGenericErrorCopy.ar : tamaraGenericErrorCopy.en,
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </label>
                                        )}
                                        {tamaraAvailability.status === 'unavailable' && (
                                            <div className={styles.paymentUnavailable}>
                                                <p>{tamaraAvailability.message}</p>
                                            </div>
                                        )}
                                        {tamaraAvailability.status === 'error' && tamaraAvailability.message && (
                                            <p className={styles.paymentError}>
                                                {tamaraAvailability.message}
                                            </p>
                                        )}
                                    </div>

                                    <button 
                                        className={`primaryStrockedBtn ${styles.backBtn}`}
                                        onClick={() => setStep(1)}
                                    >
                                        <AllIconsComponenet height={20} width={20} iconName={'rightArrowIcon'} color={'#F26722'} />
                                        الرجوع للخطوة السابقة
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right Section - Order Summary */}
                        <div className={styles.summarySection}>
                            <BookOrderSummary 
                                bookData={bookData}
                                quantity={bookData.quantity}
                                deliveryFee={deliveryFee}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Bank Transfer Confirmation Modal */}
            <BankTransferConfirmModal
                isOpen={showBankTransferModal}
                onClose={() => setShowBankTransferModal(false)}
                onConfirm={confirmBankTransfer}
                loading={bankTransferLoading}
            />
        </>
    );
}
