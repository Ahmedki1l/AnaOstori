import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import styles from '../styles/BankTransferUpload.module.scss';
import Logo from '../components/CommonComponents/Logo';
import AllIconsComponenet from '../Icons/AllIconsComponenet';
import Spinner from '../components/CommonComponents/spinner';
import { uploadFileSevices } from '../services/UploadFileSevices';
import { postAuthRouteAPI } from '../services/apisService';
import { getNewToken } from '../services/fireBaseAuthService';

export default function BankTransferUploadPage() {
    const router = useRouter();
    const { orderId } = router.query;
    
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!orderId && router.isReady) {
            router.push('/books');
        }
    }, [orderId, router.isReady]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                toast.error('يرجى اختيار صورة (JPG, PNG) أو ملف PDF');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
                return;
            }

            setSelectedFile(file);
            
            // Create preview for images
            if (file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadProgress(0);
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            toast.error('يرجى اختيار صورة الإيصال');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            // Upload file to S3
            const uploadedUrl = await uploadFileSevices(
                selectedFile,
                (progress) => setUploadProgress(progress),
                null,
                null // use default signedUrl type
            );

            if (uploadedUrl) {
                // Extract key and bucket from URL
                const urlParts = uploadedUrl.split('.s3.');
                let receiptKey = '';
                let receiptBucket = '';
                
                if (urlParts.length > 1) {
                    const pathParts = urlParts[1].split('/');
                    receiptBucket = urlParts[0].replace('https://', '');
                    receiptKey = pathParts.slice(1).join('/').split('?')[0];
                }

                // Submit receipt to backend
                const payload = {
                    routeName: 'uploadBankTransferReceipt',
                    orderId: orderId,
                    receiptUrl: uploadedUrl,
                    receiptKey: receiptKey,
                    receiptBucket: receiptBucket
                };

                try {
                    await postAuthRouteAPI(payload);
                } catch (err) {
                    if (err?.response?.status === 401) {
                        await getNewToken();
                        await postAuthRouteAPI(payload);
                    } else {
                        throw err;
                    }
                }

                setSubmitted(true);
                toast.success('تم رفع الإيصال بنجاح! سيتم مراجعته خلال 24-48 ساعة.');
            }
        } catch (error) {
            console.error('Error uploading receipt:', error);
            toast.error('حدث خطأ أثناء رفع الإيصال. يرجى المحاولة مرة أخرى.');
        } finally {
            setUploading(false);
        }
    };

    if (!orderId) {
        return (
            <div className={styles.loadingContainer}>
                <Spinner borderwidth={7} width={6} height={6} />
            </div>
        );
    }

    if (submitted) {
        return (
            <>
                <Head>
                    <title>تم رفع الإيصال - أنا أستوري</title>
                </Head>
                <main className={styles.container}>
                    <div className={styles.successCard}>
                        <div className={styles.successIcon}>
                            <AllIconsComponenet iconName={'checkmarkCircle'} height={60} width={60} color={'#22C55E'} />
                        </div>
                        <h1 className={styles.successTitle}>تم رفع الإيصال بنجاح!</h1>
                        <p className={styles.successMessage}>
                            شكراً لك! سيتم مراجعة الإيصال وتأكيد الطلب خلال 24-48 ساعة عمل.
                            ستصلك رسالة على بريدك الإلكتروني عند تأكيد الطلب.
                        </p>
                        <div className={styles.orderInfo}>
                            <span className={styles.orderLabel}>رقم الطلب:</span>
                            <span className={styles.orderValue}>{orderId}</span>
                        </div>
                        <button 
                            className={styles.homeBtn}
                            onClick={() => router.push('/books')}
                        >
                            العودة للمتجر
                        </button>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>رفع إيصال التحويل - أنا أستوري</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.uploadCard}>
                    <div className={styles.header}>
                        <div className={styles.iconWrapper}>
                            <AllIconsComponenet iconName={'uploadFile'} height={32} width={32} />
                        </div>
                        <h1 className={styles.title}>رفع إيصال التحويل</h1>
                        <p className={styles.subtitle}>
                            يرجى رفع صورة واضحة لإيصال التحويل البنكي
                        </p>
                    </div>

                    <div className={styles.orderInfo}>
                        <span className={styles.orderLabel}>رقم الطلب:</span>
                        <span className={styles.orderValue}>{orderId}</span>
                    </div>

                    <div className={styles.uploadSection}>
                        {!selectedFile ? (
                            <label className={styles.uploadZone}>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                                    onChange={handleFileSelect}
                                    className={styles.fileInput}
                                />
                                <div className={styles.uploadContent}>
                                    <AllIconsComponenet iconName={'uploadCloud'} height={48} width={48} color={'#F26722'} />
                                    <p className={styles.uploadText}>اضغط لاختيار الملف أو اسحبه هنا</p>
                                    <span className={styles.uploadHint}>JPG, PNG أو PDF (حد أقصى 5 ميجابايت)</span>
                                </div>
                            </label>
                        ) : (
                            <div className={styles.previewContainer}>
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                                ) : (
                                    <div className={styles.pdfPreview}>
                                        <AllIconsComponenet iconName={'pdfFile'} height={48} width={48} />
                                        <span>{selectedFile.name}</span>
                                    </div>
                                )}
                                <button 
                                    className={styles.removeBtn}
                                    onClick={handleRemoveFile}
                                    disabled={uploading}
                                >
                                    <AllIconsComponenet iconName={'closeicon'} height={16} width={16} />
                                </button>
                            </div>
                        )}

                        {uploading && (
                            <div className={styles.progressContainer}>
                                <div className={styles.progressBar}>
                                    <div 
                                        className={styles.progressFill} 
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <span className={styles.progressText}>{uploadProgress}%</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <button
                            className={styles.submitBtn}
                            onClick={handleSubmit}
                            disabled={!selectedFile || uploading}
                        >
                            {uploading ? 'جاري الرفع...' : 'إرسال الإيصال'}
                        </button>
                        <button
                            className={styles.cancelBtn}
                            onClick={() => router.push('/books')}
                            disabled={uploading}
                        >
                            إلغاء
                        </button>
                    </div>

                    <div className={styles.noteBox}>
                        <p>
                            💡 سيتم مراجعة الإيصال خلال 24-48 ساعة عمل وستصلك رسالة تأكيد على بريدك الإلكتروني
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
