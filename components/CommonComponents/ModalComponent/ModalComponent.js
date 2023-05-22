import { Box, Modal } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { accountRecovery, viewProfileAPI } from '../../../services/apisService';
import styles from './ModalComponent.module.scss'
import { toast } from "react-toastify";
import { useEffect } from 'react';
import { signOutUser } from '../../../services/fireBaseAuthService';


const ModalComponent = (props) => {

    const { handleClose, setAccountsSectionType, open, modalType } = props;

    const storeData = useSelector((state) => state?.globalStore);

    const dispatch = useDispatch();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: 'none',
        outline: 'none',
        boxShadow: 24,
        borderRadius: 1.5,
        p: 3,
        direction: 'rtl'
    };

    const handleAccountRecovery = async () => {
        await accountRecovery(storeData?.accessToken).then(async (res) => {
            await viewProfileAPI(storeData?.accessToken).then(res => {
                dispatch({
                    type: 'SET_PROFILE_DATA',
                    viewProfileData: res?.data,
                });
                handleClose();
            }).catch(error => {
                console.log(error);
            })
            handleClose();
            toast.success('تم استعادة الحساب بنجاح')
        }).catch(error => {
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
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <p className={`fontBold ${styles.modalTitleText}`}> تنبيه </p>
                    <p className={styles.modalParaText}>
                        حسابك راح ينحذف خلال x يوم/ أيام وراح تفقد الوصول إلى جميع الدورات المشترك بها
                    </p>
                    <div className={`${styles.buttonModalDiv} flex justify-center items-center`}>
                        <button className={`primarySolidBtn ${styles.accountRecoveryModalBtn}`} onClick={handleAccountRecovery}  >استعادة الحساب</button>
                        <button className={`secondryStrockedBtn ${styles.cancelBtn}`} onClick={handleCancel} >تجاهل </button>
                    </div>
                </Box>
            </Modal>
        </>
    )

}
export default ModalComponent;