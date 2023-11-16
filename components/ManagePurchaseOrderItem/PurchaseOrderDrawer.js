import React, { useEffect, useState } from 'react'
import { Form, FormItem } from '../antDesignCompo/FormItem'
import Select from '../antDesignCompo/Select'
import * as paymentConst from '../../constants/PaymentConst'
import { postAuthRouteAPI } from '../../services/apisService'
import styles from './purchaseOrderDrawer.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import Icon from '../CommonComponents/Icon'
import axios from 'axios'
import { mediaUrl } from '../../constants/DataManupulation'
import Link from 'next/link'
import { dateRange, fullDate } from '../../constants/DateConverter'
import CustomButton from '../CommonComponents/CustomButton'
import { getNewToken } from '../../services/fireBaseAuthService'
import Input from '../antDesignCompo/Input'
import { managePuchaseOrderDrawerConst, paymentTypeConst } from '../../constants/adminPanelConst/managePurchaseOrderConst/managePurchaseOrderConst'


const PurchaseOrderDrawer = (props) => {
    const selectedOrder = props.selectedOrder
    const [orderForm] = Form.useForm()
    const { paymentStatusBank, paymentStatusOther } = paymentConst
    const [showBtnLoader, setShowBtnLoader] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState(selectedOrder.status)


    const handleSaveOrder = async (value) => {
        setShowBtnLoader(true)
        if (value.status == selectedOrder.status && selectedOrder.failedReason == value.failedReason) {
            props.onClose(false)
            return
        }
        if (value.status == 'accepted') {
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/checkAcceptPayment/` + (selectedOrder.id).toString(), {
                secretKey: "EAATuzkf5IYoBAN7fkM0ZAuCTiYWOf1nFZAjKScRJTdYEQHHzOZCRxFqD2MvmdYbrUBmZAH3YydU3Q2hWce0ycRBJhwqlykGbyIrbHtt0rjd8HSPKaYAoqE25iwDZAmSBihukFLdB5"
            }).then((res) => {
                setShowBtnLoader(false)
                props.onClose(true)
            }).catch(async (error) => {
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/checkAcceptPayment/` + (selectedOrder.id).toString(), {
                            secretKey: "EAATuzkf5IYoBAN7fkM0ZAuCTiYWOf1nFZAjKScRJTdYEQHHzOZCRxFqD2MvmdYbrUBmZAH3YydU3Q2hWce0ycRBJhwqlykGbyIrbHtt0rjd8HSPKaYAoqE25iwDZAmSBihukFLdB5"
                        }).then((res) => {
                            setShowBtnLoader(false)
                            props.onClose(true)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
                setShowBtnLoader(false)
            })
        }
        else {
            let body = {
                routeName: 'createOrder',
                orderUpdate: true,
                id: selectedOrder.id,
                status: value.status,
                failedReason: value.failedReason
            }
            await postAuthRouteAPI(body).then((res) => {
                setShowBtnLoader(false)
                props.onClose(true)
            }).catch(async (error) => {
                setShowBtnLoader(false)
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await postAuthRouteAPI(body).then((res) => {
                            props.onClose(true)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
                console.log(error);
            })
        }
    }
    useEffect(() => {
        orderForm.setFieldValue('status', selectedOrder.status)
        orderForm.setFieldValue('failedReason', selectedOrder.failedReason)
    }, [])

    const orderItems = selectedOrder.orderItems.map((item, index) => {
        return item.course.type
    })

    const handleStatusChange = (e) => {
        setPaymentStatus(e)
        orderForm.setFieldValue('status', e)
    }

    return (
        <Form form={orderForm} onFinish={handleSaveOrder}>
            <p className='fontBold py-2' style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.bookingDetailsTitle}</p>
            <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.selectedOrderCourseTitle}</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.courseName}</p>
            </div>
            {orderItems != 'on-demand' &&
                <>
                    <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.noOfRegisteredStudentsTitle}</p>
                    <div className={styles.purchaseOrderBox}>
                        <p>{selectedOrder.qty}</p>
                    </div>
                </>}
            <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.selectedOrderStatusTitle}</p>
            <FormItem
                name={'status'}>
                <Select
                    width={425}
                    height={47}
                    OptionData={selectedOrder?.paymentMethod != 'bank_transfer' ? paymentStatusOther.filter(item => item.value != "failed") : paymentStatusBank}
                    placeholder={managePuchaseOrderDrawerConst.selectedOrderStatusPlaceHolder}
                    onChange={handleStatusChange}
                />
            </FormItem>
            {/* {paymentStatus == 'refund' &&
                <FormItem
                    name={'refund'}>
                    <Input
                        width={425}
                        height={47}
                        placeholder='refund'
                    />
                </FormItem>
            } */}
            {paymentStatus == "rejected" &&
                <>
                    <p style={{ fontSize: '18px' }}>توضيح السبب  </p>
                    <FormItem
                        name={'failedReason'}
                        rules={[{ required: true, message: 'please enter reason for rejecting this order' }]}
                    >
                        <Input
                            width={425}
                            height={47}
                            placeholder='توضيح السبب '
                        />
                    </FormItem>
                </>
            }
            {paymentStatus == "failed" &&
                <>
                    <p style={{ fontSize: '18px' }}>رسالة الرفض</p>
                    <div className={styles.failedReasonBox}>
                        <p>{selectedOrder.failedReason}</p>
                    </div>
                </>
            }

            <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.selectedOrderPaymentMethodTitle}</p>
            <div className={styles.purchaseOrderBox}>
                <p>
                    {selectedOrder.paymentMethod == 'hyperpay' ? selectedOrder.cardType == 'credit' ? selectedOrder.cardBrand == 'visa' ? paymentTypeConst.visaPayment : paymentTypeConst.masterCardPayment :
                        selectedOrder.cardType == 'mada' ? paymentTypeConst.madaPaymet : paymentTypeConst.applePayment :
                        (selectedOrder.paymentMethod == 'bank_transfer' ? paymentTypeConst.bankTransferPayment : paymentTypeConst.inAppPurchasePayment)}
                </p>
            </div>
            {selectedOrder.reciptKey &&
                <>
                    <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.userReceiptTitle}</p>
                    <Link href={mediaUrl(selectedOrder.reciptBucket, selectedOrder.reciptKey)} target='_blank'>
                        <div className={`border-dashed border-2  ${styles.downloadInvoice}`}>
                            <div className={styles.receiptItem}>
                                <div className={styles.uploadInvoiceBtn}>
                                    <AllIconsComponenet iconName={'uploadInvoice'} />
                                </div>
                                <p>{managePuchaseOrderDrawerConst.userReceiptBtnText}</p>
                            </div>
                        </div>
                    </Link>
                </>
            }
            <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.totalPriceTitle}</p>
            <div className={styles.purchaseOrderBox}>
                <p>{Number(selectedOrder.totalPrice)}</p>
            </div>
            <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.totalVatTitle}</p>
            <div className={styles.purchaseOrderBox}>
                <p>{Number(selectedOrder.totalVat)}</p>
            </div>
            <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.totalDiscountTitle}</p>
            <div className={styles.purchaseOrderBox}>
                <p>{Number(selectedOrder.totalDiscount)}</p>
            </div>
            <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.askingPriceTitle}</p>
            <div className={styles.purchaseOrderBox}>
                <p>{(Number(selectedOrder.totalPrice) + Number(selectedOrder.totalVat)) - Number(selectedOrder.totalDiscount)}</p>
            </div>
            <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.amountPaidTitle}</p>
            <div className={styles.purchaseOrderBox}>
                <p>{(Number(selectedOrder.totalPrice) + Number(selectedOrder.totalVat)) - Number(selectedOrder.totalDiscount)}</p>
            </div>
            <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.createdAddTitle}</p>
            <div className={styles.purchaseOrderBox}>
                <p>{fullDate(selectedOrder.createdAt)}</p>
            </div>
            <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.updatedAttTitle}</p>
            <div className={styles.purchaseOrderBox}>
                <p>{fullDate(selectedOrder.updatedAt)}</p>
            </div>

            <div className={styles.borderedDiv}></div>

            <p className='fontBold py-2' style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.buyerDataTitle}</p>

            <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.buyerNameTitle}</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.buyerFullName}</p>
            </div>
            <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.buyerGenderTitle}</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.userProfile.gender ? selectedOrder.userProfile.gender == "male" ? "شاب" : "بنت" : '---'}</p>
            </div>
            <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.buyerPhoneTitle}</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.buyerPhone.replace('+966', '0')}</p>
            </div>
            <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.buyerEmailTitle}</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.buyerEmail}</p>
            </div>

            <div className={styles.borderedDiv}></div>

            <p className='fontBold py-2' style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.registrationInfoTitle}</p>

            {selectedOrder.orderItems.map((item, index) => {
                return (
                    <div key={`order${index}`}>
                        <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.userFullNameTitle}</p>
                        <div className={styles.purchaseOrderBox}>
                            <p>{item.fullName}</p>
                        </div>
                        <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.buyerGenderTitle}</p>
                        <div className={styles.purchaseOrderBox}>
                            <p> {item.gender == 'male' ? 'شاب' : 'بنت'}</p>
                        </div>
                        <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.buyerPhoneTitle}</p>
                        <div className={styles.purchaseOrderBox}>
                            <p> {item.phoneNumber.replace('+966', '0')}</p>
                        </div>
                        <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.buyerEmailTitle}</p>
                        <div className={styles.purchaseOrderBox}>
                            <p> {item.email}</p>
                        </div>
                        {orderItems != 'on-demand' &&
                            <>
                                <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.availabilityTitle}</p>
                                <div className={styles.purchaseOrderBox}>
                                    <p>{dateRange(item.availability.dateFrom, item.availability.dateTo)}</p>
                                </div>
                            </>
                        }
                    </div>
                )
            })
            }
            {selectedOrder.invoiceKey &&
                <>
                    <div className={styles.borderedDiv}></div>
                    <p style={{ fontSize: '18px' }}>{managePuchaseOrderDrawerConst.invoiceCopyTitle}</p>
                    <Link href={mediaUrl(selectedOrder.invoiceBucket, selectedOrder.invoiceKey)} target='_blank'>
                        <div className={`border-dashed border-2  ${styles.downloadInvoice}`}>
                            <div className={styles.receiptItem}>
                                <div className={styles.uploadInvoiceBtn}>
                                    <Icon iconName={'downloadIcon'} height={20} width={20} />
                                </div>
                                <p>{managePuchaseOrderDrawerConst.downloadInvoiceTitle}</p>
                            </div>
                        </div>
                    </Link>
                </>
            }
            <div className='pt-5'>
                <CustomButton
                    btnText='حفظ'
                    height={37}
                    showLoader={showBtnLoader}
                    fontSize={16}
                />
            </div>
        </Form >
    )
}

export default PurchaseOrderDrawer