import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../../styles/customeCourses.module.scss";
import BankDetailsCard from '../../components/CommonComponents/BankDetailCard/BankDetailsCard';
import CreditCardDetailForm from '../../components/PaymentPageComponents/PaymentInfoForm/CreditCardDetailForm';
import MadaCardDetailForm from '../../components/PaymentPageComponents/PaymentInfoForm/MadaCardDetailForm';
import ApplePayForm from '../../components/PaymentPageComponents/PaymentInfoForm/ApplePayForm';
import TabbyCheckoutForm from '../../components/PaymentPageComponents/PaymentInfoForm/TabbyCheckout';
import Logo from '../../components/CommonComponents/Logo';
import * as fbq from '../../lib/fpixel'
import * as PaymentConst from '../../constants/PaymentConst';
import { postAuthRouteAPI } from '../../services/apisService';
import { getNewToken } from '../../services/fireBaseAuthService';
import { toast } from 'react-toastify';

const CustomeCourses = () => {
    const router = useRouter();

    // Fetch courses from server
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-any`,
                    { params: { collection: "customeCourses" } }
                );
                setCourses(res.data);
            } catch (err) {
                console.error("Failed to load courses:", err);
                setFetchError("لم أستطع جلب الدورات من الخادم.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const bankDetails = PaymentConst.bankDetails;

    // ─── selection & stage ────────────────────────────────────
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedAppointments, setSelectedAppointments] = useState({}); // courseId → apptId
    const [currentStage, setCurrentStage] = useState(1);

    // Payment
    const [paymentType, setPaymentType] = useState("");
    const [checkoutID, setCheckoutId] = useState(null);
    const [isCanMakeApplePay, setIsCanMakeApplePay] = useState(false);
    const [tabbyUrl, setTabbyUrl] = useState(null);
    const [tabbyStatus, setTabbyStatus] = useState("");
    const [hyperPayIntegrity, setHyperPayIntegrity] = useState(null);

    // User details + page-specific request
    const [userFullName, setUserFullName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [pageRequest, setPageRequest] = useState("");
    const [errors, setErrors] = useState({});
    const [isDetailsSubmitted, setIsDetailsSubmitted] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);

    useEffect(() => {
        setIsCanMakeApplePay(!!window.ApplePaySession);
    }, []);

    // ─── helpers ───────────────────────────────────────────────
    const toggleCourseSelection = courseId => {
        setSelectedCourses(prev => {
            if (prev.includes(courseId)) {
                // deselect removes appointment too
                setSelectedAppointments(apps => {
                    const { [courseId]: _, ...rest } = apps;
                    return rest;
                });
                return prev.filter(id => id !== courseId);
            }
            return [...prev, courseId];
        });
    };

    const handleAppointmentSelect = (courseId, apptId) => {
        // set this appt, and ensure course is selected
        setSelectedAppointments(prev => ({ ...prev, [courseId]: apptId }));
        if (!selectedCourses.includes(courseId)) {
            setSelectedCourses(prev => [...prev, courseId]);
        }
    };


    const calculateTotalCost = () =>
        selectedCourses.reduce((sum, id) => {
            const c = courses.find(x => x._id === id);
            return sum + (c?.cost || 0);
        }, 0);

    const calculateVAT = () => calculateTotalCost() * 0.15;
    const calculateTotal = () => calculateTotalCost() + calculateVAT();
    const formatPrice = p => Number(p).toFixed(2);

    const proceedToNextStage = () => setCurrentStage(2);
    const goBackToSelection = () => {
        setCurrentStage(1);
        setIsDetailsSubmitted(false);
        setPaymentType("");
    };

    const handleSubmitDetails = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!userFullName.trim()) errs.fullName = "الاسم الكامل مطلوب";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) errs.email = "البريد الإلكتروني غير صالح";
        if (!/^(?:\+9665|05)\d{8}$/.test(userPhone)) errs.phone = "رقم الجوال يجب أن يكون سعودي صحيح";
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }

        const order = {
            fullName: userFullName,
            email: userEmail,
            phone: userPhone,
        };

        const organizedSelectedCourses = selectedCourses.map(courseId => ({
            courseId: courseId,
            appointmentId: selectedAppointments[courseId]
        }));
        
        let orderPayload = {
            routeName: 'createOrder',
            courses: organizedSelectedCourses,
            people: order,
            customeCourses: true
        }

        await postAuthRouteAPI(orderPayload).then(res => {
            setCreatedOrder(res.data)
        }).catch(async (error) => {
            console.log(error)
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postAuthRouteAPI(orderPayload).then(res => {
                        setCreatedOrder(res.data)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                    toast.error("يجب عليك إنشاء حساب أولا", { rtl: true, });
                });
            }
        });
        setIsDetailsSubmitted(true);
    };

    const generateCheckoutId = async (type) => {
        fbq.event('Initiate checkout', { orderId: createdOrder.orderId, paymentMode: type });

        let data = {
            orderId: createdOrder.orderId,
            withcoupon: false,
            couponId: null,
            type: type,
            customePage: true
        };

        let res;
        try {
            res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/testPaymentGateway`, data);
            if (res.status === 200) {
                setPaymentType(type);
                setCheckoutId(res.data[0]?.id);
                if (type === "tabby") {
                    if (res.data[0]?.url !== "") {
                        setTabbyUrl(res.data[0]?.url);
                    } else {
                        setTabbyUrl(null);
                    }
                    setTabbyStatus(res.data[0]?.status);

                    if (res.data[0]?.status === "rejected") {
                        if (res.data[0]?.rejection_reason === "not_available") {
                            toast.error(`نأسف، تابي غير قادرة على الموافقة على هذه العملية. الرجاء استخدام طريقة دفع أخرى.`);
                        } else if (res.data[0]?.rejection_reason === "order_amount_too_high") {
                            toast.error(`قيمة الطلب تفوق الحد الأقصى المسموح به حاليًا مع تابي. يُرجى تخفيض قيمة السلة أو استخدام وسيلة دفع أخرى.`);
                        } else if (res.data[0]?.rejection_reason === "order_amount_too_low") {
                            toast.error(`قيمة الطلب أقل من الحد الأدنى المطلوب لاستخدام خدمة تابي. يُرجى زيادة قيمة الطلب أو استخدام وسيلة دفع أخرى.`);
                        } else {
                            toast.error(`حاول مرة أخرى`);
                        }
                    }
                } else {
                    setHyperPayIntegrity(res.data[2]);
                }
            }
        } catch (error) {
            console.log(res);
            console.error("Error generating checkout ID:", error);
        }
    };

    const handleBankTransfer = async () => {
        fbq.event('Initiate checkout', { orderId: createdOrder.orderId, paymentMode: 'Bank Transfer' })
        let data = {
            orderId: createdOrder.orderId,
            withcoupon: false,
            couponId: null,
            customePage: true
        }
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/choosePaymentMethod`, data).then(res => {
            if (res.status != 200) { return }
            router.push({
                pathname: '/receiveRequest',
                query: { orderId: res.data.id },
            })
        }).catch(error => {
            console.log(error)
        });
    }

    // ─── CourseCard with selectable & styled appointments ───────
    const CourseCard = ({ course }) => {
        const courseSelected = selectedCourses.includes(course._id);
        const chosenAppt = selectedAppointments[course._id];

        return (
            <div
                className={`${styles.courseCard} ${courseSelected ? styles.selected : ""}`}
                dir="rtl"
            >
                <div className={styles.courseDetails}>
                    <h3>{course.title}</h3>
                    <p className={styles.courseDate}>اليوم: {course.day}</p>
                    <p className={styles.courseDate}>المواعيد:</p>

                    <div className={styles.appointmentList}>
                        {course.appointments.map(a => (
                            <div
                                key={a.id}
                                className={`
                                ${styles.appointmentItem}
                                ${chosenAppt === a.id ? styles.appointmentItemSelected : ""}
                                `}
                                onClick={() => handleAppointmentSelect(course._id, a.id)}
                            >
                                <span className={styles.appointmentTime}>
                                    {a.from} – {a.to}
                                </span>
                            </div>
                        ))}
                    </div>

                    <p className={styles.courseCost}>{course.cost} ر.س</p>
                </div>

                <div className={styles.selectionIndicator}
                    onClick={() => courseSelected ? toggleCourseSelection(course._id) : {}}
                >
                    {courseSelected ? "تم الاختيار" : "اختر موعداً"}
                </div>
            </div>
        );
    };

    const renderPaymentStage = () => (
        <div className={styles.paymentStage}>
            <h2>اختر طريقة الدفع</h2>
            <div className={styles.paymentOptions}>
                {isCanMakeApplePay && (
                    <>
                        <input
                            type="radio"
                            id="applePay"
                            name="paymentDetails"
                            className="hidden peer"
                            onClick={() => generateCheckoutId('applepay')}
                        />
                        <label htmlFor="applePay" className="relative">
                            <div className={`${styles.radioBtnBox} ${styles.radioBtnBox1}`}>
                                <div className="flex items-center">
                                    <div className={styles.circle}><div /></div>
                                    <p className={`fontMedium ${styles.labelText}`}>ابل باي (Apple Pay)</p>
                                </div>
                                <Logo height={27} width={53} logoName="applePayLogo" alt="Apple Pay" />
                            </div>
                            {checkoutID && paymentType === 'applepay' && hyperPayIntegrity && (
                                <ApplePayForm
                                    checkoutID={checkoutID}
                                    orderID={createdOrder.id}
                                    integrity={hyperPayIntegrity}
                                />
                            )}
                        </label>
                    </>
                )}

                <input
                    type="radio"
                    id="madaCardDetails"
                    name="paymentDetails"
                    className="hidden peer"
                    onClick={() => generateCheckoutId('mada')}
                />
                <label htmlFor="madaCardDetails" className="relative">
                    <div className={`${styles.radioBtnBox} ${isCanMakeApplePay ? styles.radioBtnBox2 : styles.radioBtnBox1}`}>
                        <div className="flex items-center">
                            <div className={styles.circle}><div /></div>
                            <p className={`fontMedium ${styles.labelText}`}>بطاقة مدى البنكية</p>
                        </div>
                        <Logo height={27} width={53} logoName="madaPaymentLogo" alt="Mada" />
                    </div>
                    {checkoutID && paymentType === 'mada' && hyperPayIntegrity && (
                        <MadaCardDetailForm
                            checkoutID={checkoutID}
                            orderID={createdOrder.id}
                            integrity={hyperPayIntegrity}
                        />
                    )}
                </label>

                {/* <input
                    type="radio"
                    id="tabbyPay"
                    name="paymentDetails"
                    className="hidden peer"
                    onClick={() => generateCheckoutId('tabby')}
                />
                <label htmlFor="tabbyPay" className="relative">
                    <div className={`${styles.radioBtnBox} ${styles.radioBtnBox2}`}>
                        <div className="flex items-center">
                            <div className={styles.circle}><div /></div>
                            <p className={`fontMedium ${styles.labelText}`}>قسّمها على 4. بدون فوائد</p>
                        </div>
                        <Logo height={40} width={70} logoName="tabbyPaymentLogo" alt="Tabby" />
                    </div>
                    {checkoutID && tabbyUrl && paymentType === 'tabby' && (
                        <TabbyCheckoutForm
                            checkoutID={checkoutID}
                            orderID={createdOrder.id}
                            redirectURL={tabbyUrl}
                            amount={calculateTotal()}
                        />
                    )}
                </label> */}

                <input
                    type="radio"
                    id="creditCardDetails"
                    name="paymentDetails"
                    className="hidden peer"
                    onClick={() => generateCheckoutId('credit')}
                />
                <label htmlFor="creditCardDetails" className="relative">
                    <div className={`${styles.radioBtnBox} ${styles.radioBtnBox2}`}>
                        <div className="flex items-center">
                            <div className={styles.circle}><div /></div>
                            <p className={`fontMedium ${styles.labelText}`}>بطاقة ائتمانية</p>
                        </div>
                        <Logo height={27} width={120} logoName="creditCardPaymentLogo" alt="Credit" />
                    </div>
                    {checkoutID && paymentType === 'credit' && hyperPayIntegrity && (
                        <CreditCardDetailForm
                            checkoutID={checkoutID}
                            orderID={createdOrder.id}
                            integrity={hyperPayIntegrity}
                        />
                    )}
                </label>

                <input type="radio" id="bankDetails" name="paymentDetails" className="hidden peer" />
                <label htmlFor="bankDetails">
                    <div className={`${styles.radioBtnBox} ${styles.radioBtnBox3}`}>
                        <div className={styles.circle}><div /></div>
                        <p className={`fontMedium ${styles.labelText}`}>تحويل بنكي</p>
                    </div>
                    <div className={`${styles.creditCardWrapper} ${styles.bankDetailWrapper}`}>
                        <p className={styles.creditcardWrapperText}>
                            نرجوا إتمام عملية التحويل خلال <span className="text-red-500 fontBold">24 ساعة كحد أقصى</span>
                        </p>
                        <ul className={styles.list}>
                            <li className={`pt-2 ${styles.creditcardWrapperText}`}>
                                ١. بضغطك على زر <span className="fontMedium">“إرسال الطلب”</span> مقعدك محجوز مؤقتاً حتى إتمام التحويل.
                            </li>
                            <li className={`pt-2 ${styles.creditcardWrapperText}`}>
                                ٢. بعد التحويل ارفق الإيصال من صفحة <span className="underline">استعلام المشتريات</span>.
                            </li>
                        </ul>
                        <div className={`flex flex-wrap ${styles.bankDetailSubWrapper}`}>
                            {bankDetails.map((bank, idx) => (
                                <div key={idx} className={`py-4 ${styles.bankDetailsBox}`}>
                                    <BankDetailsCard bank={bank} index={idx} />
                                </div>
                            ))}
                        </div>
                        <div className={styles.paymentBtnBox}>
                            <button className="primarySolidBtn" onClick={handleBankTransfer}>
                                إرسال الطلب
                            </button>
                        </div>
                    </div>
                </label>
            </div>
        </div>
    );

    return (
        <div className={styles.mainContainer} dir="rtl">
            <div className={styles.header}>
                <h1>الدورات المخصصة</h1>
                <div className={styles.stagesIndicator}>
                    <div className={`${styles.stage} ${currentStage === 1 ? styles.activeStage : ''}`}>١. اختيار الدورات</div>
                    <div className={styles.stageDivider} />
                    <div className={`${styles.stage} ${currentStage === 2 ? styles.activeStage : ''}`}>٢. المراجعة والدفع</div>
                </div>
            </div>

            {currentStage === 1 ? (
                <div className={styles.courseSelectionStage}>
                    <h2>الدورات المتاحة</h2>
                    <p>اختر الدورات التي ترغب في التسجيل بها:</p>
                    {loading && <p>جاري تحميل الدورات…</p>}
                    {fetchError && <p className="text-red-500">{fetchError}</p>}

                    {!loading && !fetchError && (
                        <div className={styles.coursesGrid}>
                            {courses.map(c => <CourseCard key={c.id} course={c} />)}
                        </div>
                    )}
                    <div className={styles.selectionSummary}>
                        <p>تم اختيار: {selectedCourses.length} {selectedCourses.length === 1 ? 'دورة' : 'دورات'}</p>
                        <p>التكلفة الإجمالية: {formatPrice(calculateTotalCost())} ر.س</p>
                    </div>
                    <button
                        className={styles.proceedButton}
                        onClick={proceedToNextStage}
                        disabled={!selectedCourses.length}
                    >
                        الانتقال للمراجعة
                    </button>
                </div>
            ) : (
                <div className={styles.reviewAndPaymentStage}>
                    {!isDetailsSubmitted ? (
                        <form onSubmit={handleSubmitDetails} className={styles.detailsForm}>
                            <h2>معلومات العميل</h2>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>الاسم الكامل</label>
                                    <input
                                        type="text"
                                        value={userFullName}
                                        onChange={e => setUserFullName(e.target.value)}
                                    />
                                    {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        value={userEmail}
                                        onChange={e => setUserEmail(e.target.value)}
                                    />
                                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>رقم الجوال (السعودية)</label>
                                <input
                                    type="tel"
                                    placeholder="05XXXXXXXX"
                                    value={userPhone}
                                    onChange={e => setUserPhone(e.target.value)}
                                />
                                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                            </div>
                            <button type="submit" className={styles.proceedButton}>
                                تأكيد البيانات
                            </button>
                        </form>
                    ) : (
                        <>
                            <div className={styles.reviewAndPaymentContainer}>
                                <div className={styles.paymentSection}>
                                    {renderPaymentStage()}
                                    <div className={styles.backBtnContainer}>
                                        <button className={styles.backButton} onClick={goBackToSelection}>
                                            <span className={styles.backArrow}>&#x2190;</span> العودة للاختيار
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.orderSummarySection}>
                                    <h2>ملخص الطلب</h2>
                                    <div className={styles.selectedCoursesPreview}>
                                        {selectedCourses.map(id => {
                                            const c = courses.find(x => x._id === id);
                                            const appointmentId = selectedAppointments[id];
                                            const appointment = c.appointments.find(x => x.id === appointmentId);
                                            return (
                                                <div key={id} className={styles.selectedCoursePreviewItem}>
                                                    <div className={styles.courseImage}>
                                                        <div className={styles.courseImagePlaceholder} />
                                                    </div>
                                                    <div className={styles.coursePreviewDetails}>
                                                        <h3>{c.title}</h3>
                                                        <p>اليوم: {c.day}</p>
                                                    </div>
                                                    <div className={styles.coursePreviewDetails}>
                                                        <h3>من: {appointment.from}</h3>
                                                        <p>إلى: {appointment.to}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className={styles.orderTotals}>
                                        <div className={styles.orderRow}>
                                            <span className={styles.orderRowLabel}>سعر الدورة</span>
                                            <span className={styles.orderRowValue}>{formatPrice(calculateTotalCost())} ر.س</span>
                                        </div>
                                        <div className={styles.orderRow}>
                                            <span className={styles.orderRowLabel}>ضريبة القيمة المضافة (15%)</span>
                                            <span className={styles.orderRowValue}>{formatPrice(calculateVAT())} ر.س</span>
                                        </div>
                                        <div className={styles.orderTotalRow}>
                                            <span className={styles.orderRowLabel}>المبلغ الإجمالي</span>
                                            <span className={styles.orderRowValue}>{formatPrice(calculateTotal())} ر.س</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomeCourses;
