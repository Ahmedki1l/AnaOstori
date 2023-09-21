import React, { useEffect, useState } from 'react'
import { Form, FormItem } from '../antDesignCompo/FormItem'
import Select from '../antDesignCompo/Select'
import * as paymentConst from '../../constants/PaymentConst'
import { createOrderAPI } from '../../services/apisService'
import styles from './purchaseOrderDrawer.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import Icon from '../CommonComponents/Icon'
import axios from 'axios'
import { mediaUrl } from '../../constants/DataManupulation'
import Link from 'next/link'
import { dateRange, fullDate } from '../../constants/DateConverter'
import CustomButton from '../CommonComponents/CustomButton'
import { getNewToken } from '../../services/fireBaseAuthService'


const PurchaseOrderDrawer = (props) => {
    const selectedOrder = props.selectedOrder
    const [orderForm] = Form.useForm()
    const paymentStatus = paymentConst.paymentStatus
    const [showBtnLoader, setShowBtnLoader] = useState(false)

    const handleSaveOrder = async (value) => {
        setShowBtnLoader(true)
        if (value.status == selectedOrder.status) {
            props.onClose(false)
            return
        }
        if (value.status == 'accepted') {
            await axios.post("https://yts36bs5s8.execute-api.eu-central-1.amazonaws.com/order/checkAcceptPayment/" + (selectedOrder.id).toString(), {
                secretKey: "EAATuzkf5IYoBAN7fkM0ZAuCTiYWOf1nFZAjKScRJTdYEQHHzOZCRxFqD2MvmdYbrUBmZAH3YydU3Q2hWce0ycRBJhwqlykGbyIrbHtt0rjd8HSPKaYAoqE25iwDZAmSBihukFLdB5"
            }).then((res) => {
                setShowBtnLoader(false)
                props.onClose(true)
            }).catch(async (error) => {
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await axios.post("https://yts36bs5s8.execute-api.eu-central-1.amazonaws.com/order/checkAcceptPayment/" + (selectedOrder.id).toString(), {
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
                orderUpdate: true,
                id: selectedOrder.id,
                status: value.status
            }
            await createOrderAPI(body).then((res) => {
                props.onClose(true)
            }).catch(async (error) => {
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await createOrderAPI(body).then((res) => {
                            props.onClose(true)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
            })
        }
    }
    useEffect(() => {
        orderForm.setFieldValue('status', selectedOrder.status)
    })

    return (
        <Form form={orderForm} onFinish={handleSaveOrder}>
            <p className='fontBold py-2' style={{ fontSize: '18px' }}>تفاصيل الحجز</p>
            <p style={{ fontSize: '18px' }}>عنوان الدورة</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.courseName}</p>
            </div>
            <p style={{ fontSize: '18px' }}>عدد المسجلين</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.qty}</p>
            </div>
            <p style={{ fontSize: '18px' }}>حالة الحجز</p>
            <FormItem
                name={'status'}>
                <Select
                    width={425}
                    height={47}
                    OptionData={paymentStatus}
                    placeholder='حالة الحجز'
                />
            </FormItem>
            {(selectedOrder.status == "rejected" || selectedOrder.status == "failed") &&
                <div className={styles.purchaseOrderBox}>
                    <p>{selectedOrder.paymentMethod}</p>
                </div>
            }
            <p style={{ fontSize: '18px' }}>طريقة الدفع</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.paymentMethod}</p>
            </div>
            {selectedOrder.reciptKey &&
                <>
                    <p style={{ fontSize: '18px' }}>معاينة الإيصال</p>
                    <Link href={mediaUrl(selectedOrder.reciptBucket, selectedOrder.reciptKey)} target='_blank'>
                        <div className={`border-dashed border-2  ${styles.downloadInvoice}`}>
                            <div className={styles.receiptItem}>
                                <div className={styles.uploadInvoiceBtn}>
                                    <AllIconsComponenet iconName={'uploadIncvoice'} />
                                </div>
                                <p>تحميل الفاتورة</p>
                            </div>
                        </div>
                    </Link>
                </>
            }
            <p style={{ fontSize: '18px' }}>سعر الدورة بدون ضريبة</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.totalPrice}</p>
            </div>
            <p style={{ fontSize: '18px' }}>قيمة الضريبة</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.totalVat}</p>
            </div>
            <p style={{ fontSize: '18px' }}>قيمة خصم الكوبون</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.totalDiscount}</p>
            </div>
            <p style={{ fontSize: '18px' }}>السعر المطلوب</p>
            <div className={styles.purchaseOrderBox}>
                <p>{(selectedOrder.totalPrice + selectedOrder.totalVat) - selectedOrder.totalDiscount}</p>
            </div>
            <p style={{ fontSize: '18px' }}>المبلغ المدفوع</p>
            <div className={styles.purchaseOrderBox}>
                <p>{(selectedOrder.totalPrice + selectedOrder.totalVat) - selectedOrder.totalDiscount}</p>
            </div>
            <p style={{ fontSize: '18px' }}>تاريخ الحجز</p>
            <div className={styles.purchaseOrderBox}>
                <p>{fullDate(selectedOrder.createdAt)}</p>
            </div>
            <p style={{ fontSize: '18px' }}>تاريخ اخر تحديث</p>
            <div className={styles.purchaseOrderBox}>
                <p>{fullDate(selectedOrder.updatedAt)}</p>
            </div>

            <div className={styles.borderedDiv}></div>

            <p className='fontBold py-2' style={{ fontSize: '18px' }}>بيانات الحاجز</p>

            <p style={{ fontSize: '18px' }}>اسم الحاجز</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.buyerFullName}</p>
            </div>
            <p style={{ fontSize: '18px' }}>الجنس</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.userProfile.gender ? selectedOrder.userProfile.gender : '---'}</p>
            </div>
            <p style={{ fontSize: '18px' }}>رقم الجوال</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.buyerPhone.replace('+966', '0')}</p>
            </div>
            <p style={{ fontSize: '18px' }}>الايميل</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.buyerEmail}</p>
            </div>

            <div className={styles.borderedDiv}></div>

            <p className='fontBold py-2' style={{ fontSize: '18px' }}>بيانات المسجلين</p>

            {selectedOrder.orderItems.map((item, index) => {
                return (
                    <div key={`order${index}`}>
                        <p style={{ fontSize: '18px' }}>الاسم الثلاثي</p>
                        <div className={styles.purchaseOrderBox}>
                            <p>{item.fullName}</p>
                        </div>
                        <p style={{ fontSize: '18px' }}>الجنس</p>
                        <div className={styles.purchaseOrderBox}>
                            <p> {item.gender}</p>
                        </div>
                        <p style={{ fontSize: '18px' }}>رقم الجوال</p>
                        <div className={styles.purchaseOrderBox}>
                            <p> {item.phoneNumber.replace('+966', '0')}</p>
                        </div>
                        <p style={{ fontSize: '18px' }}>الايميل</p>
                        <div className={styles.purchaseOrderBox}>
                            <p> {item.email}</p>
                        </div>
                        <p style={{ fontSize: '18px' }}>موعد الدورة</p>
                        <div className={styles.purchaseOrderBox}>
                            <p>{dateRange(item.createdAt, item.updatedAt
                            )}</p>
                        </div>
                    </div>
                )
            })}

            {selectedOrder.invoiceKey &&
                <>
                    <div className={styles.borderedDiv}></div>
                    <p style={{ fontSize: '18px' }}>نسخة الفاتورة</p>
                    <Link href={mediaUrl(selectedOrder.invoiceBucket, selectedOrder.invoiceKey)} target='_blank'>
                        <div className={`border-dashed border-2  ${styles.downloadInvoice}`}>
                            <div className={styles.receiptItem}>
                                <div className={styles.uploadInvoiceBtn}>
                                    <Icon iconName={'downloadIcon'} height={20} width={20} />
                                </div>
                                <p>تحميل الفاتورة</p>
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
        </Form>
    )
}

export default PurchaseOrderDrawer