import { useDispatch, useSelector } from 'react-redux';
import styles from './ModalComponent.module.scss'
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import { accountRecovery, getRouteAPI } from '../../../services/apisService';
import { signOutUser } from '../../../services/fireBaseAuthService';
import { Modal } from 'antd';
import styled from 'styled-components';
import { toastSuccessMessage } from '../../../constants/ar';
import Image from 'next/image';
import loader from '../../../public/icons/loader.svg'

const StylesModal = styled(Modal)`
    .ant-modal-close{
        display:none;
    }
    .ant-modal-body {
        direction:rtl
    }
    .ant-modal-content{
        width:420px;
        border-radius: 5px;
        padding: 1.5rem;
		overflow:hidden;
    }
`

const ModalComponent = (props) => {

    const { handleClose, setAccountsSectionType, open, modalType } = props;

    const storeData = useSelector((state) => state?.globalStore);
    const [showLoader, setShowLoader] = useState(false);
    const dispatch = useDispatch();

    const handleAccountRecovery = async () => {
        setShowLoader(true)
        const data = {
            routeName: "viewProfile"
        }
        await accountRecovery().then(async (res) => {
            await getRouteAPI(data).then(res => {
                dispatch({
                    type: 'SET_PROFILE_DATA',
                    viewProfileData: res?.data,
                });
                setShowLoader(false)
                handleClose();
            }).catch(error => {
                setShowLoader(false)
                console.log(error);
            })
            handleClose();
            toast.success(toastSuccessMessage.accountRestoredMsg)
        }).catch(error => {
            setShowLoader(false)
            console.log(error);
            toast.error(error)
            if (error?.response?.status == 401) {
                signOutUser()
                dispatch({
                    type: 'EMPTY_STORE'
                });
            }
        })
    }

    const handleCancel = () => {
        if (modalType == 'accountInformation') {
            setAccountsSectionType('accountRecovery');
            handleClose();
        }
        else {
            handleClose();
        }
    }

    useEffect(() => {

        if (!storeData?.viewProfileData?.inActiveAt) {
            handleClose();
        }

    }, [storeData?.viewProfileData?.inActiveAt])

    return (
        <>
            <StylesModal
                closeIcon={false}
                footer={false}
                open={open}
                onClose={handleClose}
                centered
            >
                <p className={`fontBold ${styles.modalTitleText}`}> تنبيه </p>
                <p className={styles.modalParaText}>
                    حسابك راح ينحذف خلال x يوم/ أيام وراح تفقد الوصول إلى جميع الدورات المشترك بها
                </p>
                <div className={`${styles.buttonModalDiv} flex justify-center items-center`}>
                    <button className={`primarySolidBtn ml-2 ${styles.accountRecoveryModalBtn}`} onClick={handleAccountRecovery} disabled={showLoader} > {showLoader ? <Image src={loader} width={30} height={30} alt={'loader'} /> : ""}استعادة الحساب</button>
                    <button className={`secondryStrockedBtn ${styles.cancelBtn}`} onClick={handleCancel} >تجاهل </button>
                </div>
            </StylesModal>
        </>
    )

}
export default ModalComponent;
