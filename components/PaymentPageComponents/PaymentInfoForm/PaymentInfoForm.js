import React, { useEffect, useState } from 'react'
import SecondPageIndicator from '../PaymentPageIndicator/SecondPageIndicator'
import styles from './PaymentInfoFrom.module.scss'
import Logo from '../../CommonComponents/Logo'
import BankDetailsCard from '../../CommonComponents/BankDetailCard/BankDetailsCard'
import CoverImg from '../../CommonComponents/CoverImg'
import axios from 'axios'
import { useRouter } from 'next/router'
import CreditCardDetailForm from './CreditCardDetailForm'
import MadaCardDetailForm from './MadaCardDetailForm'
import ApplePayForm from './ApplePayForm'
import useWindowSize from '../../../hooks/useWindoSize'
import * as fbq from '../../../lib/fpixel'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { inputErrorMessages, inputSuccessMessages } from '../../../constants/ar'
import { mediaUrl } from '../../../constants/DataManupulation'
import { getRouteAPI } from '../../../services/apisService'
import * as PaymentConst from '../../../constants/PaymentConst'
import TabbyPomoForm from './TabbyPromo'
import TabbyCheckoutForm from './TabbyCheckout'
import { toast } from 'react-toastify';
import PaymentConfirmButton from './FreePaymentDetailForm'

export default function PaymentInfoForm(props) {
	const createdOrder = props.createdOrder
	const studentsData = props.studentsData
	const bankDetails = PaymentConst.bankDetails
	const noOfUser = PaymentConst.noOfUsersTag2
	const numberOfUser = PaymentConst.noOfUsersTag3
	const router = useRouter()
	const screenWidth = useWindowSize().width
	const isSmallScreen = useWindowSize().smallScreen

	const [couponCode, setCouponCode] = useState();
	const [couponError, setCouponError] = useState(false);
	const [couponAppliedData, setCouponAppliedData] = useState();
	const [checkoutID, setCheckoutId] = useState(props.checkoutId);
	const [tabbyUrl, setTabbyUrl] = useState(null);
	const [freePayment, setFreePayment] = useState(false);
	const [tabbyStatus, setTabbyStatus] = useState('');
	const [tabbyRejectionReason, setTabbyRejectionReason] = useState('');
	const [paymentType, setPaymentType] = useState('');
	const [isCanMakePayments, setIsCanMakePayments] = useState(false);
	const [hyperPayIntegrity, setHyperPayIntegrity] = useState(null);

	const [tabbyPreScoringMessages, setTabbyPreScoringMessages] = useState({
		not_available: {
			ar: "نأسف، تابي غير قادرة على الموافقة على هذه العملية. الرجاء استخدام طريقة دفع أخرى.",
			en: "Sorry, Tabby is unable to approve this purchase. Please use an alternative payment method for your order."
		},
		order_amount_too_high: {
			ar: "قيمة الطلب تفوق الحد الأقصى المسموح به حاليًا مع تابي. يُرجى تخفيض قيمة السلة أو استخدام وسيلة دفع أخرى.",
			en: "This purchase is above your current spending limit with Tabby, try a smaller cart or use another payment method."
		},
		order_amount_too_low: {
			ar: "قيمة الطلب أقل من الحد الأدنى المطلوب لاستخدام خدمة تابي. يُرجى زيادة قيمة الطلب أو استخدام وسيلة دفع أخرى.",
			en: "The purchase amount is below the minimum amount required to use Tabby, try adding more items or use another payment method."
		}
	})

	const generateCheckoutId = async (type) => {
		fbq.event('Initiate checkout', { orderId: createdOrder.id, paymentMode: type });

		let data = {
			orderId: createdOrder.id,
			withcoupon: couponAppliedData ? true : false,
			couponId: couponAppliedData ? couponAppliedData.id : null,
			type: type,
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

	const handleFreePayment = async () => {
		fbq.event('Initiate checkout', { orderId: createdOrder.id, paymentMode: 'Free Payment' })

		let data = {
			orderId: createdOrder.id,
			withcoupon: couponAppliedData ? true : false,
			couponId: couponAppliedData ? couponAppliedData.id : null,
		}

		try {
			const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/confirmFreePayment`, data);
			if (res.status === 200) {
				setFreePayment(true);

			}
		} catch (error) {
			console.error("Error confirming free payment:", error);
			toast.error("حدث خطأ أثناء تأكيد الدفع. يرجى المحاولة مرة أخرى.");
		}
	}
	// useEffect(() => {
	// 	if (tabbyRejectionReason) {
	// 		if (tabbyRejectionReason === "not_available") {
	// 			toast.error(`نأسف، تابي غير قادرة على الموافقة على هذه العملية. الرجاء استخدام طريقة دفع أخرى.`);
	// 		} else if (tabbyRejectionReason === "order_amount_too_high") {
	// 			toast.error(`قيمة الطلب تفوق الحد الأقصى المسموح به حاليًا مع تابي. يُرجى تخفيض قيمة السلة أو استخدام وسيلة دفع أخرى.`);
	// 		} else if (tabbyRejectionReason === "order_amount_too_low") {
	// 			toast.error(`قيمة الطلب أقل من الحد الأدنى المطلوب لاستخدام خدمة تابي. يُرجى زيادة قيمة الطلب أو استخدام وسيلة دفع أخرى.`);
	// 		} else {
	// 			toast.error(`حاول مرة أخرى`);
	// 		}
	// 	}
	// }, [tabbyRejectionReason]);

	const handleBankTransfer = async () => {
		fbq.event('Initiate checkout', { orderId: createdOrder.id, paymentMode: 'Bank Transfer' })
		let data = {
			orderId: createdOrder.id,
			withcoupon: couponAppliedData ? true : false,
			couponId: couponAppliedData ? couponAppliedData.id : null,
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

	const handleCheckCouponIsValid = async () => {
		let data = {
			routeName: 'checkCouponValidity',
			courseId: createdOrder.courseId,
			coupon: couponCode,
		};

		try {
			const res = await getRouteAPI(data);
			if (res.status === 200) {
				setCouponAppliedData(res.data);
				setCouponError(false);

				// Regenerate the checkout ID if a payment type is already selected
				if (paymentType) {
					setPaymentType('')
					var radio = document.querySelector('input[type=radio][name=paymentDetails]:checked');
					if (radio) {
						radio.checked = false;
					}
				}
			}
		} catch (error) {
			console.error("Error checking coupon validity:", error);
			setCouponAppliedData(null);
			setCouponError(true);
		}
	};

	useEffect(() => {
		if (window.ApplePaySession) {
			setIsCanMakePayments(true)
		} else {
			setIsCanMakePayments(false)
		}
	}, [setIsCanMakePayments])

	const zeroCostFlag = ((Number(createdOrder.totalPrice) + Number(createdOrder.totalVat)) - (couponAppliedData ? ((Number(couponAppliedData?.percentage) * (Number(createdOrder.totalPrice) + Number(createdOrder.totalVat))) / 100) : 0)) === 0;

	return (
		<div className='maxWidthDefault'>
			{isSmallScreen &&
				<div className={styles.backBarWrapper}>
					<div className={styles.backArrowIcon} onClick={() => props.backToUserForm(studentsData, false)}>
						<AllIconsComponenet height={20} width={24} iconName={'arrowRight'} color={'#000000'} />
					</div>
					<p className='py-4 text-center w-100'>مراجعة الطلب والدفع</p>
				</div>
			}
			{createdOrder.course.type != "on-demand" && <SecondPageIndicator />}
			<div className={`${styles.paymentInfoMainArea} createdOrder.course.type != "on-demand" && pt-4`}>
				<div className={`px-4 ${styles.paymentInfoContainer}`}>
					<h1 className='head2'>اختار طريقة الدفع</h1>
					<div className={styles.paymentInfoDiv}>
						{(isCanMakePayments) &&
							<>
								<input type="radio" id="applePay" name="paymentDetails" className="hidden peer" onClick={() => generateCheckoutId('applepay')} />
								<label htmlFor="applePay" className='relative'>
									<div className={`${styles.radioBtnBox} ${styles.radioBtnBox1}`}>
										<div className='flex items-center'>
											<div className={styles.circle}><div></div></div>
											<p className={`fontMedium ${styles.labelText}`}>ابل باي (Apple Pay)</p>
										</div>
										<Logo height={27} width={53} logoName={'applePayLogo'} alt={'Payment Methode Logo'} />
									</div>
									<div className={styles.creditCardWrapper}>
										{(checkoutID && paymentType == 'applepay' && hyperPayIntegrity) &&
											<ApplePayForm checkoutID={checkoutID} orderID={createdOrder.id} integrity={hyperPayIntegrity} />
										}
									</div>
								</label>
							</>
						}

						<input type="radio" id="madaCardDetails" name="paymentDetails" className="hidden peer" onClick={() => generateCheckoutId('mada')} />
						<label htmlFor="madaCardDetails" className='relative'>
							<div className={`${styles.radioBtnBox} ${isCanMakePayments == true ? `${styles.radioBtnBox2}` : `${styles.radioBtnBox1}`}`}>
								<div className='flex items-center'>
									<div className={styles.circle}><div></div></div>
									<p className={`fontMedium ${styles.labelText}`}>بطاقة مدى البنكية</p>
								</div>
								<Logo height={27} width={53} logoName={'madaPaymentLogo'} alt={'Payment Methode Logo'} />
							</div>
							<div className={styles.creditCardWrapper}>
								{(checkoutID && paymentType == 'mada' && hyperPayIntegrity) &&
									<MadaCardDetailForm checkoutID={checkoutID} orderID={createdOrder.id} integrity={hyperPayIntegrity} />
								}
							</div>
						</label>
						{/* Tabby Payment Option */}
						<input type="radio" id="tabbyPay" name="paymentDetails" className="hidden peer" onClick={() => generateCheckoutId('tabby')}
						/>
						<label htmlFor="tabbyPay" className='relative'>
							<div className={`${styles.radioBtnBox} ${styles.radioBtnBox2}`}>
								<div className='flex items-center'>
									<div className={styles.circle}><div></div></div>
									<p className={`fontMedium ${styles.labelText}`}>{`قسّمها على 4. بدون أي فوائد، أو رسوم.`}</p>
								</div>
								<Logo height={40} width={70} logoName={'tabbyPaymentLogo'} alt={'Payment Methode Logo'} />

								{/* <TabbyPomoForm
									amount={Number(createdOrder.totalPrice) + Number(createdOrder.totalVat)}
								/> */}
							</div>
							<div className={styles.creditCardWrapper}>
								{(checkoutID && tabbyUrl && paymentType === 'tabby') && (
									<TabbyCheckoutForm
										checkoutID={checkoutID}
										orderID={createdOrder.id}
										redirectURL={tabbyUrl}
										amount={Number(createdOrder.totalPrice) + Number(createdOrder.totalVat)}
										couponAppliedData={couponAppliedData}
									/>
								)}
							</div>
						</label>
						<input type="radio" id="creditCardDetails" name="paymentDetails" className="hidden peer" onClick={() => generateCheckoutId('credit')} />
						<label htmlFor="creditCardDetails" className='relative'>
							<div className={`${styles.radioBtnBox} ${styles.radioBtnBox2}`}>
								<div className='flex items-center'>
									<div className={styles.circle}><div></div></div>
									<p className={`fontMedium ${styles.labelText}`}>بطاقة ائتمانية </p>
								</div>
								<Logo height={27} width={120} logoName={'creditCardPaymentLogo'} alt={'Payment Methode Logo'} />
							</div>
							<div className={styles.creditCardWrapper}>
								{(checkoutID && paymentType == 'credit' && hyperPayIntegrity) &&
									<CreditCardDetailForm checkoutID={checkoutID} orderID={createdOrder.id} integrity={hyperPayIntegrity} />
								}
							</div>
						</label>
						{zeroCostFlag && <>
							<input type="radio" id="freePayment" name="paymentDetails" className="hidden peer" onClick={() => handleFreePayment()} />
							<label htmlFor="freePayment" className='relative'>
								<div className={`${styles.radioBtnBox} ${styles.radioBtnBox2}`}>
									<div className='flex items-center'> 

										<div className={styles.circle}><div></div></div>
										<p className={`fontMedium ${styles.labelText}`}>دفع مجاني بدون بطاقة</p>
									</div>
									{/* <Logo height={27} width={120} logoName={'creditCardPaymentLogo'} alt={'Payment Methode Logo'} /> */}
								</div>
								<div className={styles.creditCardWrapper}>
									{freePayment && <PaymentConfirmButton />}
								</div>
							</label>
						</>}
						<input type="radio" id="bankDetails" name="paymentDetails" className="hidden peer" />
						<label htmlFor="bankDetails">
							<div className={`${styles.radioBtnBox} ${styles.radioBtnBox3}`}>
								<div className={styles.circle}><div></div></div>
								<p className={`fontMedium ${styles.labelText}`}>تحويل بنكي</p>
							</div>
							<div className={`${styles.creditCardWrapper} ${styles.bankDetailWrapper}`}>
								<p className={styles.creditcardWrapperText}> نرجوا إتمام عملية التحويل خلال <span className='text-red-500 fontBold'>24 ساعة كحد أقصى</span></p>
								<p className={`fontBold ${styles.creditcardWrapperText}`}>ملاحظات:</p>
								<ul className={styles.list}>
									<li className={`pt-2 ${styles.creditcardWrapperText}`}>
										١. بضغطك على زر <span className='fontMedium'>“إرسال الطلب”</span> مقعدك رح يكون محجوز بشكل مؤقت الى ما تحولنا المبلغ.
									</li>
									<li className={`pt-2 ${styles.creditcardWrapperText}`}>
										٢. بعد التحويل ارفق ايصال الحوالة من صفحة <span className='underline'>استعلام المشتريات</span> او من خلال الرابط اللي بيوصلك بالايميل و الواتس
									</li>

								</ul>
								<div className={`flex flex-wrap ${styles.bankDetailSubWrapper}`}>
									{bankDetails.map((bank, index) => {
										return (
											<div key={`bank${index}`} className={`py-4 ${styles.bankDetailsBox}`}>
												<BankDetailsCard bank={bank} index={index} />``
											</div>
										)
									})}
								</div>
								<div className={styles.paymentBtnBox}>
									<button className='primarySolidBtn' onClick={() => handleBankTransfer()}>إرسال الطلب</button>
								</div>
							</div>
						</label>
					</div>
					{(!isSmallScreen && createdOrder.course.type != "on-demand") &&
						<div className={styles.backBtnBox}>
							<button className='fontBold primaryStrockedBtn'>
								<div className={styles.arrowIcon}>
									<AllIconsComponenet height={20} width={20} iconName={'rightArrowIcon'} color={'#F26722'} />
								</div>
								الصفحة السابقة </button>
						</div>
					}
				</div>
				<div className={`ml-4 ${styles.courseInfoBox}`}>
					<h1 className='head2 pb-2'>ملخص الطلب</h1>
					<div className='flex'>
						<div className={styles.courseCover}>
							<CoverImg height={screenWidth > 1085 ? 113 : 81} url={createdOrder.course?.pictureKey ? mediaUrl(createdOrder.course?.pictureBucket, createdOrder.course?.pictureKey) : '/images/anaOstori.png'} />
						</div>
						<div>
							<p className={`fontBold pr-3 ${styles.courseTitle}`}>{createdOrder.courseName}</p>
							<p className={`fontRegular pr-3 ${styles.noOfUsersTagText}`}>{noOfUser[createdOrder.orderItems.length - 1]}</p>
						</div>
					</div>
					<div className={`formInputBox ${styles.couponCodeInputBox}`}>
						<input id='couponCode' type="text" className={`formInput ${styles.couponCodeInput}`} placeholder=' ' onChange={(e) => setCouponCode(e.target.value)} />
						<label className={`formLabel ${styles.couponCodeLabel}`} htmlFor="couponCode">كود الخصم</label>
						<div className={styles.applyCouponBtnBox}>
							{couponCode?.length > 0 ?
								<button className={`fontMedium cursor-pointer ${styles.couponCodeBtn}`} onClick={() => handleCheckCouponIsValid()}>تطبيق</button>
								:
								<button className={`${styles.couponCodeBtn} ${styles.DisCouponCodeBtn}`}>تطبيق</button>
							}
						</div>
					</div>
					{couponError &&
						<p className={styles.errorText}>{inputErrorMessages.incorrectCodeErrorMsg}</p>
					}
					{couponAppliedData &&
						<p className={styles.sucessText}>{inputSuccessMessages.discountAppliedMsg}</p>
					}
					<div className={styles.priceDetailsBox}>
						<div className='flex justify-between  py-2'>
							<p>{numberOfUser[createdOrder.orderItems.length - 1]}سعر الدورة</p>
							<p>{Number(createdOrder.totalPrice).toFixed(2)} ر.س</p>
						</div>
						<div className='flex justify-between  py-2'>
							<p>ضريبة القيمة المضافة</p>
							<p>{Number(createdOrder.totalVat).toFixed(2)} ر.س</p>
						</div>
						<div className='flex justify-between py-2 '>
							<p className='fontBold'>المبلغ الإجمالي</p>
							<p className='fontBold pb-2'>{(Number(Number(createdOrder.totalPrice) + Number(createdOrder.totalVat)).toFixed(2))} ر.س</p>
						</div>
						{(couponAppliedData?.percentage) &&
							<>
								<div className='flex justify-between'>
									<p style={{ color: '#00bd5d' }} className='fontBold  pb-2'>خصم كود ({couponAppliedData?.percentage} %) </p>
									<p style={{ color: '#00bd5d' }}> {(couponAppliedData ? ((Number(couponAppliedData?.percentage) * (Number(createdOrder.totalPrice) + Number(createdOrder.totalVat))) / 100) : 0)}- ر.س</p>
								</div>
								<div className='flex justify-between '>
									<p style={{ color: '#F26722' }} className='fontBold'>المبلغ المطلوب</p>
									<p className='fontBold pb-2'>{((((Number(createdOrder.totalPrice) + Number(createdOrder.totalVat)) - (couponAppliedData ? ((Number(couponAppliedData?.percentage) * (Number(createdOrder.totalPrice) + Number(createdOrder.totalVat))) / 100) : 0)).toFixed(2)))} ر.س</p>
								</div>
							</>
						}

						{/* <TabbyPomoForm
							amount={Number(createdOrder.totalPrice) + Number(createdOrder.totalVat)}
						/> */}
					</div>
				</div>
			</div>
		</div>
	)
}
