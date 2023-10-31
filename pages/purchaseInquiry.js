import { useEffect, useState } from "react";
import styles from "../styles/purchaseInquiry.module.scss";
import * as linkConst from '../constants/LinkConst';
import Link from "next/link";
import useWindowSize from "../hooks/useWindoSize";
import { useRouter } from "next/router";
import { getAuthRouteAPI } from "../services/apisService";
import { getNewToken } from "../services/fireBaseAuthService";
import AllIconsComponenet from "../Icons/AllIconsComponenet";
import { mediaUrl } from "../constants/DataManupulation";
import { dateRange, fullDate } from "../constants/DateConverter";
import { inqPaymentStateConst, inqTabelHeaderConst } from "../constants/purchaseInqConst";
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
			const data = {
				routeName: "orderQuery"
			}
			await getAuthRouteAPI(data).then((res) => {
				setSearchData(res.data.filter((item) => !(item.paymentMethod == "hyperpay" && item.status == "witing")).sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
				setLoading(false)
			}).catch(async (error) => {
				if (error?.response?.status == 401) {
					await getNewToken().then(async (token) => {
						await getAuthRouteAPI(data).then((res) => {
							setSearchData(res.data.filter((item) => !(item.paymentMethod == "hyperpay" && item.status == "witing")).sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
						})
					}).catch(error => {
						console.error("Error:", error);
					});
				}
				console.log(error)
				setLoading(false)
			})
		}
		getMyOrder()
	}, [])



	return (
		<>
			<div className={styles.searchHeader}>
				<h1 className={`head2 text-white text-center ${styles.headText}`}>استعلام الحجوزات</h1>
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
												{data.orderItems?.map((student, j = index) => {
													return (
														<div className={`pb-4 ${styles.userInfoBox}`} key={`student${j}`}>
															<p>{student.fullName}</p>
															<p>{data.courseName}</p>
															{data.course.type != "on-demand" && <p>{dateRange(student?.availability?.dateFrom, student?.availability?.dateTo)}</p>}
														</div>
													)
												})}
											</td>
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
											<td className={styles.tbodyInvoice}>
												{(data?.status == "accepted" && data?.invoiceKey) ?
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
														{data.orderItems?.map((student, j = index) => {
															return (
																<div className={styles.userInfoBox} key={`student${j}`}>
																	<p>{student.fullName}</p>
																	<p>{data.courseName}</p>
																	{data.course.type != 'on-demand' && <p>{dateRange(student.availability?.dateFrom, student.availability?.dateTo)}</p>}
																</div>
															)
														})}
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
														{(data?.status == "accepted" && data?.invoiceKey) ?
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
									<p className={`fontBold py-2 ${styles.detailsText}`} >ما حجزت بأي دورة</p>
									<p style={{ fontSize: '14px' }}>تصفح مجالاتنا وسجّل معنا، متأكدين انك راح تستفيد وتكون أسطورتنا الجاي بإذن الله 🥇😎</p>
									<div className={` pt-4 ${styles.btnWrapper}`}>
										<div className={styles.submitBtnBox}><button className='primarySolidBtn ml-4' onClick={() => router.push('/')}>تصفح المجالات</button></div>
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
