import React, { useState } from 'react'
import styles from './CourseCompleteDialog.module.scss'
import Image from 'next/legacy/image';
import { useSelector } from 'react-redux';

// MiIcon
import { Dialog, DialogContent, Link } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

function CourseCompleteDialog() {

    const [openVideo, setOpenVideo] = useState(true)
    const storeData = useSelector((state) => state?.globalStore);

    const handleVideoClick = (event) => {
        event.stopPropagation();
    };

    return (
        <Dialog open={openVideo} maxWidth="lg" className='courseCompeletDialog' onClick={() => setOpenVideo(false)} >
            <DialogContent onClick={handleVideoClick}>
                <CloseIcon className={styles.dialogCloseBtn} onClick={() => setOpenVideo(false)} />
                <div className={styles.dialogWrapper}>
                    <Image src="/gif/celebration1.gif" alt='Gif Image' layout='fill' objectFit="cover" priority />
                    <div className={styles.dialogSubWrapper}>
                        <div className={styles.celebration2GIF}>
                            <Image src="/gif/celebration2.gif" alt='Gif Image' layout='fill' objectFit="cover" priority />
                        </div>
                        <div className='flex justify-center items-center pt-2'>
                            <div className={styles.fireOmageDiv}>
                                <Image src="/images/fire.png" alt='Gif Image' layout='fill' objectFit="cover" priority />
                            </div>
                            <p className={`fontBold px-2 ${styles.headerText}`}>{storeData?.viewProfileData?.fullName} أسطوري يا </p>
                        </div>
                        <p className='text-center'>بكذا قفلت على الدورة ومتأكدين انك رح تجلد الاختبار <br /> نتمنى منك تشاركنا تقييمك للدورة عشان نحسن الدورة للأفضل ونساعد دفع الأساطير الجاية</p>
                        <div className='flex justify-center items-center'>
                            <Link href={'/'} className={styles.homeBtnBox}>
                                <button className='primaryStrockedBtn'>الرجوع إلى الرئيسية</button>
                            </Link>
                            <div className={styles.reviewBtnBox}>
                                <button className='primarySolidBtn'>تقييم الدورة</button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CourseCompleteDialog