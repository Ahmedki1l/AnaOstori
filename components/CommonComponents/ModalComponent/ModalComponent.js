import { useDispatch, useSelector } from 'react-redux';
import styles from './ModalComponent.module.scss'
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import { getAuthRouteAPI, postAuthRouteAPI } from '../../../services/apisService';
import { signOutUser } from '../../../services/fireBaseAuthService';
import { Modal } from 'antd';
import styled from 'styled-components';
import { toastSuccessMessage } from '../../../constants/ar';
import Image from 'next/image';
import loader from '../../../public/icons/loader.svg'
import { countRemainingDays } from '../../../constants/DataManupulation';

const StylesModal = styled(Modal)`
    .ant-modal-close{
        display:none;
    }
    .ant-modal-body {
        direction:rtl
    }
    .ant-modal-content{
        width:358px;
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
        await postAuthRouteAPI({ routeName: "activateProfile" }).then(async (res) => {
            await getAuthRouteAPI({ routeName: "viewProfile" }).then(res => {
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
            toast.success(toastSuccessMessage.accountRestoredMsg, { rtl: true, })
        }).catch(error => {
            setShowLoader(false)
            console.log(error);
            toast.error(error, { rtl: true, })
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
                    حسابك بينحذف بعد <span style={{ color: 'red' }}>{countRemainingDays(storeData?.viewProfileData?.inActiveAt)}</span> وراح تفقد وصولك بجميع الدورات والمحتوى الرقمي اللي مسجل فيه
                </p>
                <div className={`${styles.buttonModalDiv}`}>
                    <button className={`primarySolidBtn mb-2 ${styles.accountRecoveryModalBtn}`} onClick={handleAccountRecovery} disabled={showLoader} > {showLoader ? <Image src={loader} width={30} height={30} alt={'loader'} /> : ""}بسترجع الحساب</button>
                    <button className={`primaryStrockedBtn ${styles.cancelBtn}`} onClick={handleCancel} >تجاهل </button>
                </div>
            </StylesModal>
        </>
    )

}
export default ModalComponent;
