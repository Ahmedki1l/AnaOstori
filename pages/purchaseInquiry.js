import { useEffect, useState } from "react";
import styles from "../styles/purchaseInquiry.module.scss";
import * as linkConst from '../constants/LinkConst';
import Link from "next/link";
import useWindowSize from "../hooks/useWindoSize";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { getMyOrderAPI } from "../services/apisService";
import { getNewToken, signOutUser } from "../services/fireBaseAuthService";
import AllIconsComponenet from "../Icons/AllIconsComponenet";
import { mediaUrl } from "../constants/DataManupulation";



export default function PurchaseInquiry(props) {
	const whatsAppLink = linkConst.WhatsApp_Link
	const [searchData, setSearchData] = useState([])
	// const [queryData, setQueryData] = useState(props.orderId ? `0${props.orderId.slice(3)}` : '')
	// const [searchData, setSearchData] = useState(props.searchData ? props.searchData.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)) : [])

	const isMediumScreen = useWindowSize().mediumScreen

	const [isOrderFound, setIsOrderFound] = useState('hide')

	const router = useRouter()
	const storeData = useSelector((state) => state?.globalStore);

	useEffect(() => {
		const getMyOrder = async () => {
			await getMyOrderAPI().then((res) => {
				setSearchData(res.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
			}).catch(async (error) => {
				if (error?.response?.status == 401) {
					await getNewToken().then(async (token) => {
						await getMyOrderAPI().then((res) => {
							setSearchData(res.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
						})
					}).catch(error => {
						console.error("Error:", error);
					});
				}
				console.log(error)
			})
		}
		getMyOrder()
	}, [])


	return (
		<>
			<div className={styles.searchHeader}>
				<h1 className={`head2 text-white text-center ${styles.headText}`}>استعلام الفواتير وتأكيد الحجوزات</h1>
			</div>
			<div className={`maxWidthDefault`}>
				{searchData.length > 0 && !isMediumScreen ?
					<table className={styles.tableArea}>
						<thead className={styles.thead}>
							<tr>
								<th className={styles.theadOrder}>رقم الفاتورة</th>
								<th className={styles.theadDate}>تاريخ الشراء</th>
								<th className={styles.theadName}>تفاصيل الطلب</th>
								<th className={styles.theadStatus}>حالة التسجيل</th>
								<th className={styles.theadInvoice}>الفاتورة</th>
							</tr>
						</thead>
						<tbody className={styles.body}>
							{searchData.map((data, i = index) => {
								return (
									<tr key={`order${i}`}>
										<td className={styles.tbodyOrder}>{data.id}</td>
										<td className={styles.tbodyDate}>{new Date(data.createdAt).toLocaleDateString('en-US', { timeZone: "UTC", day: 'numeric' })} {new Date(data.createdAt).toLocaleDateString('ar-AE', { timeZone: "UTC", month: 'long' })} {new Date(data.createdAt).toLocaleDateString('en-US', { timeZone: "UTC", year: 'numeric' })}</td>
										<td className={styles.tbodyName}>
											{data.orderItems?.map((student, j = index) => {
												return (
													<div className={`pb-4 ${styles.userInfoBox}`} key={`student${j}`}>
														<p>{student.fullName}</p>
														<p>{data.courseName} - {new Date(student?.availability?.dateFrom).toLocaleDateString('en-US', { timeZone: "UTC", day: 'numeric' })} {new Date(student?.availability?.dateFrom).toLocaleDateString('ar-AE', { timeZone: "UTC", month: 'long' })}  الى&nbsp;
															{new Date(student?.availability?.dateTo).toLocaleDateString('en-US', { timeZone: "UTC", day: 'numeric' })} {new Date(student?.availability?.dateTo).toLocaleDateString('ar-AE', { timeZone: "UTC", month: 'long' })}
														</p>
													</div>
												)
											})}
										</td>
										<td className={styles.tbodyStatus}>
											{data?.status == "accepted" ?
												<p className={`${styles.greenBox} ${styles.colorBox}`}>مؤكد</p>
												: data?.status == "review" ?
													<>
														<p className={`${styles.yellowBox} ${styles.colorBox}`}>بنراجع طلبك</p>
														<p className="py-2">استلمنا إيصالك بنراجعه قريب وتواصل معنا&nbsp;
															<Link className='link' href={whatsAppLink} target='_blank'>واتساب</Link> لو محتاج مساعدة
														</p>
													</>
													: data?.status == "witing" ?
														<>
															<p className={`${styles.redBox} ${styles.colorBox}`}>بانتظار الحوالة</p>
															<p className="py-2">عندك مهلة 24 ساعة لتأكيد حجزك، تفضل حولنا المبلغ من&nbsp;
																<Link className='link' href={`/uploadInvoice?orderId=${data.id}`}>صفحة تأكيد التحويل البنكي</Link>، وتواصل معنا&nbsp;
																<Link className='link' href={whatsAppLink} target='_blank'>واتساب</Link>&nbsp; لو محتاج مساعدة
															</p>
														</>
														:
														<>
															<p className={`${styles.redBox} ${styles.colorBox}`}>ملغى</p>
															<p className="py-2">الحجز ملغى لعدم سدادك المبلغ في المدة المحددة</p>
															<p> نرجو منك الحجز مرة أخرى وللمساعدة تواصل معنا واتساب
																<Link className='link' href={whatsAppLink} target='_blank'>واتساب</Link>
															</p>
														</>
											}
										</td>
										<td className={styles.tbodyInvoice}>
											{(data?.status == "accepted" && data?.invoiceKey) ?
												<Link href={mediaUrl(data?.invoiceBucket, data?.invoiceKey)} target={'_blank'} className="noUnderlineLink flex items-center justify-center">
													<div>
														<AllIconsComponenet height={20} width={20} iconName={'downloadIcon'} color={'#0075FF'} />
													</div>
													<p className={`${styles.downloadSearchText} mr-2`}>تحميل الفاتورة</p>
												</Link>
												:
												<div>Invoice not generated</div>
											}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
					:
					<table className={styles.tableArea} >
						<tbody className={styles.body}>
							{searchData?.map((data, i = index) => {
								return (
									<div className={styles.rowDiv} key={`order${i}`}>
										<tr>
											<th className={styles.theadOrder}>رقم الفاتورة</th>
											<th className={styles.theadDate}>تاريخ الشراء</th>
											<th className={styles.theadName}>تفاصيل الطلب</th>
											<th className={styles.theadStatus}>حالة التسجيل</th>
											<th className={styles.theadInvoice}>الفاتورة</th>
										</tr>
										<tr>
											<td className={styles.tbodyOrder}>{data.id}</td>
											<td className={styles.tbodyDate}>{new Date(data.createdAt).toLocaleDateString('ar-AE', { timeZone: "UTC", year: 'numeric', day: 'numeric', month: 'long' })}</td>
											<td className={styles.tbodyName}>
												{data.orderItems?.map((student, j = index) => {
													return (
														<div className={`pb-4 ${styles.userInfoBox}`} key={`student${j}`}>
															<p>{student.fullName}</p>
															<p>{data.courseName} - {new Date(student.availability.dateFrom).toLocaleDateString('ar-AE', { timeZone: "UTC", day: 'numeric', month: 'long' })}  الى&nbsp;
																{new Date(student.availability.dateTo).toLocaleDateString('ar-AE', { timeZone: "UTC", day: 'numeric', month: 'long' })}
															</p>
														</div>
													)
												})}
											</td>
											<td className={styles.tbodyStatus}>
												{data?.status == "accepted" ?
													<p className={`${styles.greenBox} ${styles.colorBox}`}>مؤكد</p>
													: data?.status == "review" ?
														<>
															<p className={`${styles.yellowBox} ${styles.colorBox}`}>بنراجع طلبك</p>
															<p className="py-2">استلمنا إيصالك بنراجعه قريب وتواصل معنا&nbsp;
																<Link className='link' href={whatsAppLink} target='_blank'>واتساب</Link> لو محتاج مساعدة
															</p>
														</>
														: data?.status == "witing" ?
															<>
																<p className={`${styles.redBox} ${styles.colorBox}`}>بانتظار الحوالة</p>
																<p className="py-2">عندك مهلة 24 ساعة لتأكيد حجزك، تفضل حولنا المبلغ من&nbsp;
																	<Link className='link' href={'/bankDetails'}>صفحة تأكيد التحويل البنكي</Link>، وتواصل معنا&nbsp;
																	<Link className='link' href={whatsAppLink} target='_blank'>واتساب</Link>&nbsp; لو محتاج مساعدة
																</p>
															</>
															:
															<>
																<p className={`${styles.redBox} ${styles.colorBox}`}>ملغى</p>
																<p className="py-2">الحجز ملغى لعدم سدادك المبلغ في المدة المحددة</p>
																<p> نرجو منك الحجز مرة أخرى وللمساعدة تواصل معنا واتساب
																	<Link className='link' href={whatsAppLink} target='_blank'>واتساب</Link>
																</p>
															</>
												}
											</td>
											<td className={styles.tbodyInvoice}>
												{data?.status == "accepted" ?
													<Link href={mediaUrl(data.invoiceBucket, data.invoiceKey)} target={'_blank'} className="flex items-center justify-center">
														<div>
															<AllIconsComponenet height={20} width={20} iconName={'downloadIcon'} color={'#0075FF'} />
														</div>
														<p className={styles.downloadSearchText}>تحميل الفاتورة</p>
													</Link>
													:
													<div>Invoice not generated</div>
												}
											</td>
										</tr>
									</div>
								)
							})}
						</tbody>
					</table>
				}
				{searchData?.length == 0 &&
					<div className={`maxWidthDefault`}>
						<div className={styles.noDataManiArea} >
							<div className={styles.noDataiconWrapper}>
								<AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
							</div>
							<p className={`fontBold py-2 ${styles.detailsText}`} >خلك الأسطوري الجاي!</p>
							<p style={{ fontSize: '14px' }}>ما عندك مشتريات، تصفح دوراتنا ومتأكدين انها بتعجبك و بتكون الأسطوري الجاي بإذن الله</p>
							<div className={` pt-4 ${styles.btnWrapper}`}>
								<div className={styles.submitBtnBox}><button className='primarySolidBtn ml-4'>تصفح الدورات</button></div>
								<div className={styles.cancleBtnBox}><button className='primaryStrockedBtn' >مشاهدة تجارب الأساطير</button></div>
							</div>
						</div>
					</div>
				}
				{isOrderFound == 'show' &&
					<div className={`pt-8 ${styles.noSearchdataContainer}`}>
						<p className="text-center">ما عندك طلب بهذا الرقم</p>
						<p className="text-center">لطلب المساعدة تواصل مع فريق الدعم الفني او تفضل بتصفح دوراتنا</p>
						<div className={styles.btnsBox}>
							<div className={styles.btnBox}>
								<Link href={'/?دوراتنا'}>
									<button className='primarySolidBtn'>تصفح الدورات </button>
								</Link>
							</div>
							<div className={styles.btnBox}>
								<Link href={whatsAppLink} target='_blank'>
									<button className='primaryStrockedBtn'>طلب مساعدة واتساب</button>
								</Link>
							</div>
						</div>
					</div>
				}
			</div>
		</>
	);
}
