import { useEffect, useState } from "react";
import styles from "../styles/purchaseInquiry.module.scss";
import * as linkConst from '../constants/LinkConst';
import Link from "next/link";
import useWindowSize from "../hooks/useWindoSize";
import { useRouter } from "next/router";
import { getAuthRouteAPI, getMyBookOrdersAPI } from "../services/apisService";
import { getNewToken } from "../services/fireBaseAuthService";
import AllIconsComponenet from "../Icons/AllIconsComponenet";
import { mediaUrl } from "../constants/DataManupulation";
import { dateRange, fullDate } from "../constants/DateConverter";
import { generateLink, inqPaymentStateConst, inqTabelHeaderConst } from "../constants/purchaseInqConst";
import { Tag } from "antd";
import styled from "styled-components";
import Spinner from "../components/CommonComponents/spinner";

const StyledTag = styled(Tag)`
	font-family: 'Tajawal-Regular';
	height: 37px;
	align-items: center;
    display: flex;
    width: max-content;
`

export default function PurchaseInquiry(props) {
	const whatsAppLink = linkConst.WhatsApp_Link
	const [searchData, setSearchData] = useState([])
	const isMediumScreen = useWindowSize().mediumScreen
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const getMyOrder = async () => {
			setLoading(true)
			try {
				// Fetch both course orders and book orders in parallel
				const [courseOrdersRes, bookOrdersRes] = await Promise.all([
					getAuthRouteAPI({ routeName: "orderQuery" }).catch(() => ({ data: [] })),
					getMyBookOrdersAPI().catch(() => ({ data: [] }))
				]);

				// Tag course orders
				const courseOrders = (courseOrdersRes.data || [])
					.filter((item) => !(item.paymentMethod == "hyperpay" && item.status == "witing"))
					.map(order => ({ ...order, orderType: 'course' }));

				// Tag book orders
				const bookOrders = (bookOrdersRes.data || [])
					.map(order => ({ ...order, orderType: 'book' }));

				// Combine and sort by date
				const allOrders = [...courseOrders, ...bookOrders]
					.sort((a, b) => -a.createdAt.localeCompare(b.createdAt));

				setSearchData(allOrders);
				setLoading(false);
			} catch (error) {
				if (error?.response?.status == 401) {
					try {
						await getNewToken();
						// Retry after token refresh
						const [courseOrdersRes, bookOrdersRes] = await Promise.all([
							getAuthRouteAPI({ routeName: "orderQuery" }).catch(() => ({ data: [] })),
							getMyBookOrdersAPI().catch(() => ({ data: [] }))
						]);
						const courseOrders = (courseOrdersRes.data || [])
							.filter((item) => !(item.paymentMethod == "hyperpay" && item.status == "witing"))
							.map(order => ({ ...order, orderType: 'course' }));
						const bookOrders = (bookOrdersRes.data || [])
							.map(order => ({ ...order, orderType: 'book' }));
						setSearchData([...courseOrders, ...bookOrders].sort((a, b) => -a.createdAt.localeCompare(b.createdAt)));
					} catch (retryError) {
						console.error("Error:", retryError);
					}
				}
				console.log(error);
				setLoading(false);
			}
		}
		getMyOrder()
	}, [])

	// Shipping status mapping for book orders (Torod + internal statuses)
	const shippingStatusMap = {
		'quote_created': 'تم طلب عرض الشحن',
		'pending': 'في الانتظار',
		'created': 'تم إنشاء الشحنة',
		'ready_for_pickup': 'جاهز للشحن',
		'picked_up': 'تم الاستلام',
		'processing': 'قيد التجهيز',
		'shipped': 'تم الشحن',
		'in_transit': 'في الطريق',
		'out_for_delivery': 'خارج للتسليم',
		'delivered': 'تم التوصيل',
		'returned': 'مرتجع',
		'cancelled': 'ملغي',
		'shipment_failed': 'فشل الشحن',
		'on_hold': 'معلق',
		'undelivered': 'لم يتم التسليم',
		'exception': 'استثناء'
	};



	return (
		<>
			<div className={styles.searchHeader}>
				<h1 className={`text-white text-center ${styles.headText}`}>استعلام الحجوزات</h1>
			</div>
			{loading ?
				<div className={`relative ${styles.mainLoadingPage}`}>
					<Spinner borderwidth={7} width={6} height={6} />
				</div>
				:
				<div className={`maxWidthDefault`}>
					{(searchData.length > 0 && !isMediumScreen) ?
						<table className={styles.tableArea}>
							<thead className={styles.tableHead}>
								<tr>
									<th className={styles.theadOrder}>{inqTabelHeaderConst.header1}</th>
									<th className={styles.theadDate}>{inqTabelHeaderConst.header2}</th>
									<th className={styles.theadName}>{inqTabelHeaderConst.header3}</th>
									<th className={styles.theadStatus}>{inqTabelHeaderConst.header4}</th>
									<th className={styles.theadInvoice}>{inqTabelHeaderConst.header5}</th>
								</tr>
							</thead>
							<tbody className={styles.body}>
								{searchData.map((data, i = index) => {
									return (
										<tr key={`order${i}`}>
											<td className={styles.tbodyOrder}>{data?.status == "accepted" ? data.id : "-"}</td>
											<td >{fullDate(data.createdAt)}</td>
											<td className={styles.tbodyName}>
												{data.orderType === 'book' ? (
													// Book order display
													<div className={`pb-4 ${styles.userInfoBox}`}>
														<p className="font-bold">📚 {data.bookTitle}</p>
														<p>الكمية: {data.quantity}</p>
														<p>{data.grandTotal?.toFixed(2)} ر.س</p>
														{data.deliveryAddress && (
															<p className="text-gray-600">{data.deliveryAddress.city}, {data.deliveryAddress.district}</p>
														)}
														{data.shippingStatus && (
															<p className="text-blue-600">{shippingStatusMap[data.shippingStatus] || data.shippingStatus}</p>
														)}
														{data.shippingTrackingUrl && (
															<a href={data.shippingTrackingUrl} target="_blank" rel="noopener noreferrer"
																style={{ color: '#F26722', fontSize: '13px', textDecoration: 'underline' }}
															>📦 تتبع الشحنة</a>
														)}
													</div>
												) : (
													// Course order display (existing)
													data.orderItems?.map((student, j = index) => {
														return (
															<div className={`pb-4 ${styles.userInfoBox}`} key={`student${j}`}>
																<p>{student.fullName}</p>
																<p>{data.courseName}</p>
																{data.course?.type != "on-demand" && <p>{dateRange(student?.availability?.dateFrom, student?.availability?.dateTo)}</p>}
															</div>
														)
													})
												)}
											</td>
											<td className={styles.tbodyStatus}>
												{data?.status == "accepted" ?
													<StyledTag color="green">{inqPaymentStateConst.accepted}</StyledTag>

													: data?.status == "review" ?
														<>
															<StyledTag color="gold">{inqPaymentStateConst.review}</StyledTag>
															<p className="py-2">استلمنا إيصالك وبنراجعه بأقرب وقت، تواصل معنا&nbsp;
																{/* <Link className='link' href={whatsAppLink} target='_blank'>واتساب</Link> لو احتجت مساعدة */}
																{generateLink(whatsAppLink, 'واتساب', 'لو احتجت مساعدة')}
															</p>
														</>

														: data?.status == "witing" ?
															<>
																<StyledTag color="red">{inqPaymentStateConst.witing}</StyledTag>
																<p className="py-2">عندك مهلة 24 ساعة تأكد فيها حجزك، تفضل حولنا المبلغ من&nbsp;
																	<Link className='link' href={`/uploadInvoice?orderId=${data.id}`}>صفحة تأكيد التحويل البنكي</Link>، وتواصل معنا&nbsp;
																	<Link className='link' href={whatsAppLink} target='_blank'>واتساب</Link>&nbsp; لو احتجت مساعدة
																</p>
															</>

															: data?.status == "failed" ?
																<StyledTag color="red">{inqPaymentStateConst.failed}</StyledTag>
																: data?.status == "rejected" ?
																	<>
																		<StyledTag color="red">{inqPaymentStateConst.rejected}</StyledTag>
																		<p className="py-2">ملّغى لعدم سدادك المبلغ في المدة المحددة، احجز مرة ثانية وتواصل معنا&nbsp;
																			{/* <Link className='link' href={whatsAppLink} target='_blank'>واتساب</Link> لو احتجت مساعدة */}
																			{generateLink(whatsAppLink, 'واتساب', 'لو احتجت مساعدة')}
																		</p>
																	</>

																	:
																	<>
																		<StyledTag color="gray">{inqPaymentStateConst.refund}</StyledTag>
																	</>
												}
											</td>
											<td className={styles.tbodyInvoice}>
												{(data?.orderType === 'book' ? data?.invoiceKey : (data?.status == "accepted" && data?.invoiceKey)) ?
													<Link href={mediaUrl(data?.invoiceBucket, data?.invoiceKey)} target={'_blank'} className="noUnderlineLink flex items-center justify-center">
														<div>
															<AllIconsComponenet height={20} width={20} iconName={'downloadIcon'} color={'#0075FF'} />
														</div>
														<p className={`${styles.downloadSearchText} mr-2`}>تحميل الفاتورة</p>
													</Link>
													:
													<div>الفاتورة تظهر بعد تأكيد الحوالة</div>
												}
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
						:
						(searchData.length > 0 && isMediumScreen) ?
							<>
								{searchData?.map((data, i = index) => {
									return (
										<div className={styles.tableAreaDiv} key={`order${i}`}>
											<table className={styles.rowDiv} >
												<tr>
													<th className={styles.theadOrder}>{inqTabelHeaderConst.header1}</th>
													<td className={styles.tbodyOrder}>{data?.status == "accepted" ? data.id : "-"}</td>
												</tr>
												<tr>
													<th className={styles.theadDate}>{inqTabelHeaderConst.header2}</th>
													<td className={styles.tbodyDate}>{fullDate(data.createdAt)}</td>
												</tr>
												<tr>
									<th className={styles.theadName}>{inqTabelHeaderConst.header3}</th>
									<td className={styles.tbodyName}>
										{data.orderType === 'book' ? (
											// Book order display for mobile
											<div className={styles.userInfoBox}>
												<p className="font-bold">📚 {data.bookTitle}</p>
												<p>الكمية: {data.quantity}</p>
												<p>{data.grandTotal?.toFixed(2)} ر.س</p>
												{data.deliveryAddress && (
													<p>{data.deliveryAddress.city}, {data.deliveryAddress.district}</p>
												)}
												{data.shippingStatus && (
													<p style={{color: '#2563eb'}}>{shippingStatusMap[data.shippingStatus] || data.shippingStatus}</p>
												)}
												{data.shippingTrackingUrl && (
													<a href={data.shippingTrackingUrl} target="_blank" rel="noopener noreferrer"
														style={{ color: '#F26722', fontSize: '13px', textDecoration: 'underline' }}
													>📦 تتبع الشحنة</a>
												)}
											</div>
										) : (
											// Course order display for mobile
											data.orderItems?.map((student, j = index) => {
												return (
													<div className={styles.userInfoBox} key={`student${j}`}>
														<p>{student.fullName}</p>
														<p>{data.courseName}</p>
														{data.course?.type != 'on-demand' && <p>{dateRange(student.availability?.dateFrom, student.availability?.dateTo)}</p>}
													</div>
												)
											})
										)}
									</td>
								</tr>
												<tr>
													<th className={styles.theadStatus}>{inqTabelHeaderConst.header4}</th>
													<td className={styles.tbodyStatus}>
														{data?.status == "accepted" ?
															<StyledTag color="green">{inqPaymentStateConst.accepted}</StyledTag>

															: data?.status == "review" ?
																<>
																	<StyledTag color="gold">{inqPaymentStateConst.review}</StyledTag>
																	<p className="py-2">استلمنا إيصالك وبنراجعه بأقرب وقت، تواصل معنا&nbsp;
																		<Link className='link' href={whatsAppLink} target='_blank'>واتساب</Link> لو احتجت مساعدة
																	</p>
																</>

																: data?.status == "witing" ?
																	<>
																		<StyledTag color="red">{inqPaymentStateConst.witing}</StyledTag>
																		<p className="py-2">عندك مهلة 24 ساعة تأكد فيها حجزك، تفضل حولنا المبلغ من&nbsp;
																			<Link className='link' href={`/uploadInvoice?orderId=${data.id}`}>صفحة تأكيد التحويل البنكي</Link>، وتواصل معنا&nbsp;
																			<Link className='link' href={whatsAppLink} target='_blank'>واتساب</Link>&nbsp; لو احتجت مساعدة
																		</p>
																	</>

																	: data?.status == "failed" ?
																		<StyledTag color="red">{inqPaymentStateConst.failed}</StyledTag>
																		: data?.status == "rejected" ?
																			<>
																				<StyledTag color="red">{inqPaymentStateConst.rejected}</StyledTag>
																				<p className="py-2">ملّغى لعدم سدادك المبلغ في المدة المحددة، احجز مرة ثانية وتواصل معنا&nbsp;
																					<Link className='link' href={whatsAppLink} target='_blank'>واتساب</Link> لو احتجت مساعدة
																				</p>
																			</>

																			:
																			<>
																				<StyledTag color="gray">{inqPaymentStateConst.refund}</StyledTag>
																			</>
														}
													</td>
												</tr>
												<tr>
													<th className={styles.theadInvoice}>{inqTabelHeaderConst.header5}</th>
													<td className={styles.tbodyInvoice}>
														{(data?.orderType === 'book' ? data?.invoiceKey : (data?.status == "accepted" && data?.invoiceKey)) ?
															<Link href={mediaUrl(data.invoiceBucket, data.invoiceKey)} target={'_blank'} className="flex items-center normalLinkText">
																<div style={{ height: '34px' }}>
																	<AllIconsComponenet height={14} width={14} iconName={'downloadIcon'} color={'#0075FF'} />
																</div>
																<p className={` mr-2 ${styles.downloadSearchText}`}>تحميل الفاتورة</p>
															</Link>
															:
															<div>الفاتورة تظهر بعد تأكيد الحوالة</div>
														}
													</td>
												</tr>
											</table>
										</div>
									)
								})}
							</>
							:
							<div className={`maxWidthDefault`}>
								<div className={styles.noDataManiArea} >
									<div className={styles.noDataiconWrapper}>
										<AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
									</div>
									<p className={`fontMedium py-2 ${styles.detailsText}`} >ما حجزت بأي دورة</p>
									<p className={styles.peragraph}>تصفح مجالاتنا وسجّل معنا، متأكدين انك راح تستفيد وتكون أسطورتنا الجاي بإذن الله 🥇😎</p>
									<div className={` pt-4 ${styles.btnWrapper}`}>
										<div className={styles.submitBtnBox}><button className='primarySolidBtn ml-4' onClick={() => router.push('/?دوراتنا')}>تصفح المجالات</button></div>
										{/* <div className={styles.cancleBtnBox}><button className='primaryStrockedBtn' >مشاهدة تجارب الأساطير</button></div> */}
									</div>
								</div>
							</div>
					}
				</div>
			}
		</>
	);
}
