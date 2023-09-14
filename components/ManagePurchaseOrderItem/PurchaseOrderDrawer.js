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
import { fullDate } from '../../constants/DateConverter'


const PurchaseOrderDrawer = (props) => {
    const selectedOrder = props.selectedOrder
    const [orderForm] = Form.useForm()
    const paymentStatus = paymentConst.paymentStatus
    console.log(selectedOrder);
    const handleSaveOrder = async (value) => {
        if (value.status == 'accepted') {
            await axios.post("https://yts36bs5s8.execute-api.eu-central-1.amazonaws.com/order/checkAcceptPayment/" + (selectedOrder.id).toString(), {
                secretKey: "EAATuzkf5IYoBAN7fkM0ZAuCTiYWOf1nFZAjKScRJTdYEQHHzOZCRxFqD2MvmdYbrUBmZAH3YydU3Q2hWce0ycRBJhwqlykGbyIrbHtt0rjd8HSPKaYAoqE25iwDZAmSBihukFLdB5"
            });
        }
        else {
            let body = {
                orderUpdate: true,
                id: selectedOrder.id,
                status: value.status
            }
            console.log(body);
            await createOrderAPI(body).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
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
            <p style={{ fontSize: '18px' }}>طريقة الدفع</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.paymentMethod}</p>
            </div>
            {selectedOrder.reciptKey &&
                <>
                    <p style={{ fontSize: '18px' }}>نسخة الإيصال</p>
                    <Link href={mediaUrl(selectedOrder.reciptBucket, selectedOrder.reciptKey)} >
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
                <p>value</p>
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
                <p>{selectedOrder.gender}</p>
            </div>
            <p style={{ fontSize: '18px' }}>رقم الجوال</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.buyerPhone}</p>
            </div>
            <p style={{ fontSize: '18px' }}>الايميل</p>
            <div className={styles.purchaseOrderBox}>
                <p>{selectedOrder.buyerEmail}</p>
            </div>

            <div className={styles.borderedDiv}></div>

            <p className='fontBold py-2' style={{ fontSize: '18px' }}>بيانات المسجلين</p>

            {selectedOrder.orderItems.map((item, index) => {
                return (
                    <div>
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
                            <p> {item.phoneNumber}</p>
                        </div>
                        <p style={{ fontSize: '18px' }}>الايميل</p>
                        <div className={styles.purchaseOrderBox}>
                            <p> {item.email}</p>
                        </div>
                        <p style={{ fontSize: '18px' }}>موعد الدورة</p>
                        <div className={styles.purchaseOrderBox}>
                            <p>showInfo</p>
                        </div>
                    </div>
                )
            })}

            {selectedOrder.invoiceKey &&
                <>
                    <div className={styles.borderedDiv}></div>
                    <p style={{ fontSize: '18px' }}>نسخة الفاتورة</p>
                    <Link href={mediaUrl(selectedOrder.invoiceBucket, selectedOrder.invoiceKey)} >
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
            <div>
                <button className='primarySolidBtn' type='submit'>حفظ</button>
            </div>
        </Form>
    )
}

export default PurchaseOrderDrawer