import styles from '../styles/UploadInvoice.module.scss'
import * as PaymentConst from '../constants/PaymentConst'
import BankDetailsCard from '../components/CommonComponents/BankDetailCard/BankDetailsCard'
import { useState, useEffect } from 'react';
import axios from 'axios';
import CoverImg from '../components/CommonComponents/CoverImg';
import { useRouter } from 'next/router';
import useWindowSize from '../hooks/useWindoSize';
import AllIconsComponenet from '../Icons/AllIconsComponenet';
import { inputErrorMessages } from '../constants/ar';
import { mediaUrl } from '../constants/DataManupulation';


export async function getServerSideProps({ req, res, resolvedUrl }) {
    const orderId = resolvedUrl.split('=')[1].split('%2F')[0]
    const token = resolvedUrl.split('=')[1].split('%2F')[1]
    const courseDetail = await axios.get(`${process.env.API_BASE_URL}/order/displayUploadInfo/${orderId}`)
        .then((response) => (response.data)).catch((error) => error);

    if (courseDetail == null) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            courseDetail,
            token: token ?? null
        }
    }

}

export default function ApproveTrans(props) {
    const courseDetail = props.courseDetail
    const token = props.token
    const router = useRouter()
    const noOfUser = PaymentConst.noOfUsersTag2
    const bankDetails = PaymentConst.bankDetails
    const [showBankDetails, setShowBankDetails] = useState(false)
    const [uplodedFileName, setUplodedFileName] = useState("")
    const [uplodedFile, setUplodedFile] = useState("")
    const [error, setError] = useState('')
    const isMediumScreen = useWindowSize().mediumScreen
    const isSmallScreen = useWindowSize().smallScreen

    const [isFileUpload, setIsFileUpload] = useState(false)

    const totalDiscount = courseDetail?.orderItems.length == 1 ?
        ((courseDetail?.couponDiscount * courseDetail?.basePrice) / 100).toFixed(2)
        : courseDetail?.orderItems.length == 2 ?
            ((courseDetail?.couponDiscount * ((courseDetail?.basePrice - ((courseDetail?.basePrice * 5) / 100)) * 2)) / 100).toFixed(2)
            :
            ((courseDetail?.couponDiscount * ((courseDetail?.basePrice * 10) / 100) * courseDetail?.orderItems.length) / 100).toFixed(2)

    const isValidFileUploaded = (file) => {
        const validExtensions = ['png', 'jpeg', 'jpg', 'pdf']
        const fileExtension = file.type.split('/')[1]
        return validExtensions.includes(fileExtension)
    }

    const uploadFile = (e) => {
        if (e.target.files[0] == undefined) { return }
        setUplodedFileName(e.target.files[0]?.name)
        setUplodedFile(e.target.files[0])
        setIsFileUpload(true)

        if (isValidFileUploaded(e.target.files[0])) {
            setError()
        } else {
            setError(inputErrorMessages.allowedFilesTypeMsg)
            return
        }

        if (e.target.files[0]?.size < 6291456) {
            setError()
        } else {
            setError(inputErrorMessages.fileSizeMsg)
            return
        }
    }
    const handleUploadFile = async (uplodedFile) => {
        let formData = new FormData();
        formData.append("file", uplodedFile);
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/recipt/upload/${courseDetail.id}`, formData).then(res => {
            if (res.status != 200) { return }
            router.push({
                pathname: '/invoiceUploaded',
                query: { orderDetails: res.data.buyerPhone },
            })
        }).catch(error => {
            console.log(error)
        });
    }

    return (
        <>
            <div className={styles.headArea}>
                <div className='maxWidthDefault'>
                    <h1 className={`fontBold text-center text-white ${styles.pageHeadText}`}>تأكيد التحويل البنكي</h1>
                </div>
            </div>
            <div className={`maxWidthDefault ${styles.bodyArea}`}>
                <div className={styles.billSummeryMainBox}>
                    <h3 className={`fontBold ${styles.billSummeryText}`}>ملخص الطلب</h3>
                    <div className='flex pb-4'>
                        <div className={styles.courseImageBox}>
                            <CoverImg height={isSmallScreen ? 80 : isMediumScreen ? 100 : 120} url={courseDetail?.course.pictureKey ? mediaUrl(courseDetail?.course.pictureBucket, courseDetail?.course.pictureKey) : '/images/anaOstori.png'} />
                        </div>
                        <div className={styles.billSummeryInfoBox}>
                            <p className={`fontBold ${styles.totalStudentsText}`}>{courseDetail?.courseName} - {noOfUser[courseDetail.orderItems.length - 1]} </p>
                            <p className={styles.invoicNoText}>فاتورة رقم {courseDetail?.id}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={`flex justify-between ${styles.paymentInfoBox}`}>
                        <p className={styles.paymentInfoText}>سعر الدورة</p>
                        <p className={styles.paymentInfoText}>{courseDetail?.totalPrice.toFixed(2)} ر.س</p>
                    </div>
                    <div className={`flex justify-between ${styles.paymentInfoBox}`}>
                        <p className={styles.paymentInfoText}>ضريبة القيمة المضافة</p>
                        <p className={styles.paymentInfoText}>{courseDetail?.totalVat.toFixed(2)} ر.س</p>
                    </div>
                    {courseDetail?.couponUsed && <div className={`flex justify-between ${styles.paymentInfoBox}`}>
                        <p className={styles.paymentInfoText}>خصم الكود ({courseDetail.couponName})</p>
                        <p className={styles.paymentInfoText}>  {totalDiscount}- ر.س</p>
                    </div>}
                    <div className={`flex justify-between ${styles.paymentInfoBox}`}>
                        <p className={`fontBold ${styles.paymentInfoText}`}>الإجمالي المطلوب</p>
                        <p className={`fontBold ${styles.paymentInfoText}`}>{((courseDetail?.totalPrice + courseDetail?.totalVat)).toFixed(2)} ر.س</p>
                    </div>
                </div>
                <div>
                    <div className={styles.uploadFileWrapper}>
                        {!isFileUpload ?
                            <div className={styles.uploadBtn}>
                                <input type='file' accept=".png,.pdf,.jpeg" onChange={(e) => uploadFile(e)} />
                                <div className={`flex ${styles.uploadFileareaWrapper}`}>
                                    <div className={styles.uploadFileIcon}>
                                        <AllIconsComponenet iconName={'uploadFile'} height={20} width={30} color={'#F26722'} />
                                    </div>
                                    <div className={`fontMedium ${styles.uploadFileText}`}>
                                        <p> رفع الإيصال (تقدر ترفع صورة او ملف)</p>
                                    </div>
                                </div>
                            </div>
                            :
                            <>
                                <div className={styles.reUploadBtn}>
                                    <input type='file' className='hidden' id='reuploadBtn' accept=".png,.pdf,.jpeg" onChange={(e) => uploadFile(e)} />
                                    <label htmlFor='reuploadBtn' className={`fontMedium ${styles.reUploadFileText}`}> إعادة الرفع </label>
                                </div>
                                <div className={styles.fileDetailsBox}>
                                    <p className={`fontMedium ${styles.fielDetailName}`}>عنوان الملف المرفوع:</p>
                                    <div className='flex pt-2' >
                                        <div className={styles.circle}>
                                            <AllIconsComponenet iconName={'checkCircleRoundIcon'} height={12} width={12} color={'#FFFFFF'} />
                                        </div>
                                        <p className={styles.fileNameText}>{uplodedFileName}</p>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>

                {error && <p className='pb-4 text-red-700'>{error}</p>}

                <div className={styles.uploadBtnBox}>
                    {isFileUpload & !error ?
                        <button className='primarySolidBtn mb-4' onClick={() => handleUploadFile(uplodedFile)}>إرسال</button>
                        :
                        <button className={`primarySolidBtn cursor-not-allowed ${styles.submitBtn}`}>إرسال</button>
                    }
                </div>
                <div className='pt-4 pb-4'>
                    <div className={`fontMedium ${styles.bankDetailText}`} onClick={() => setShowBankDetails(!showBankDetails)}>
                        <div style={{ height: '20px' }}>
                            <div className={showBankDetails ? `${styles.rotateArrow}` : ''}>
                                <AllIconsComponenet iconName={'keyBoardDownIcon'} height={20} width={30} color={'#0075FF'} />
                            </div>
                        </div>
                        عرض حساباتنا البنكية
                    </div>
                    {showBankDetails &&
                        <>
                            <p className={`fontMedium text-center ${styles.bankAccMainHeadText1}`}>المستفيد: شركة سنام لخدمات الأعمال</p>
                            <div className={`flex flex-wrap ${styles.bankDetailSubWrapper}`}>
                                {bankDetails.map((bank, index) => {
                                    return (
                                        <div key={`bank${index}`} className={`py-4 ${styles.bankDetailsBox}`}>
                                            <BankDetailsCard bank={bank} index={index} />
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    )
}
