import React, { useState } from 'react'
import { Dialog, DialogContent } from '@mui/material';
import styles from './CommingSoonModal.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import loader from '../../../public/icons/loader.svg'
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import CloseIcon from '@mui/icons-material/Close';




function CommingSoonModal(props) {

    const { open, setCommingSoonModalOpen } = props;
    const [showLoader, setShowLoader] = useState(false)

    const router = useRouter();

    const closeCommingSoonModal = () => {
        router.push('/?دوراتنا')
        setShowLoader(true)
        setTimeout(() => {
            setCommingSoonModalOpen(false)
            setShowLoader(false)
        }, 2000);
    }

    const handleContentClick = (event) => {
        event.stopPropagation();
    };

    return (
        <Dialog className='breniusDialogWrapper' open={open} onClick={() => setCommingSoonModalOpen(false)} dir='rtl' >
            <DialogContent className={styles.commingSoonModalBox} onClick={handleContentClick}>
                <div style={{ direction: 'ltr' }}>
                    <CloseIcon style={{ position: 'inherit' }} className={`cursor-pointer ${styles.closeIconWrapper}`} onClick={() => setCommingSoonModalOpen(false)} />
                </div>
                <div className='flex flex-col items-center'>
                    <AllIconsComponenet height={46} width={46} iconName={'lock3'} color={''} />
                    <p className={`fontBold pt-2 ${styles.modalTitleText}`}> التسجيل غير متاح حاليًا </p>
                </div>
                <p className={styles.modalParaText}>
                    شكرًا لإهتمامك، قاعدين نطبخ المنهج على نار هادية 👨‍🍳، تفضل تصفح باقي دوراتنا إلى ما تجهز الطبخة
                </p>
                <div className={`${styles.buttonModalDiv} flex justify-center items-center`}>
                    <button className={`primarySolidBtn ${styles.cancelBtn}`} onClick={closeCommingSoonModal}>{showLoader ? <Image src={loader} width={50} height={30} alt={'loader'} /> : ""} تصفح دوراتنا </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommingSoonModal