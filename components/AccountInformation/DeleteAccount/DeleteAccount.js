import { postAuthRouteAPI } from '../../../services/apisService';
import styles from './DeleteAccount.module.scss';
import { toast } from "react-toastify";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { toastSuccessMessage } from '../../../constants/ar';
import Image from 'next/legacy/image';
import loader from '../../../public/icons/loader.svg'
import { getNewToken } from '../../../services/fireBaseAuthService';
import { countRemainingDays } from '../../../constants/DataManupulation';
import { DeleteAccoutConst } from '../../../constants/DeleteAccountConst';




const DeleteAccount = ({ data }) => {
    const [accountsSectionType, setAccountsSectionType] = useState(data?.inActiveAt ? 'accountRecovery' : 'default');
    const dispatch = useDispatch();
    const router = useRouter()
    const [showLoader, setShowLoader] = useState(false);
    const [deleteProfileRes, setDelteProfileRes] = useState()

    const handleDeleteAccount = async () => {
        setShowLoader(true)
        await postAuthRouteAPI({ routeName: "deleteProfile" }).then(async (res) => {
            setDelteProfileRes(res.data)
            dispatch({
                type: 'SET_PROFILE_DATA',
                viewProfileData: res?.data,
            });
            setShowLoader(false)
        }).catch(async (error) => {
            console.log(error);
            setShowLoader(false)
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postAuthRouteAPI({ routeName: "deleteProfile" }).then(async (res) => {
                        dispatch({
                            type: 'SET_PROFILE_DATA',
                            viewProfileData: res?.data,
                        });
                        setShowLoader(false)
                    })
                })
            }
        })
        setAccountsSectionType('accountRecovery')
    }

    const handleAccountRecovery = async () => {
        await postAuthRouteAPI({ routeName: "activateProfile" }).then(async (res) => {
            dispatch({
                type: 'SET_PROFILE_DATA',
                viewProfileData: res?.data,
            });
            setAccountsSectionType('default')
            toast.success(toastSuccessMessage.accountRestoreSuccessMsg, { rtl: true, })
        }).catch(async (error) => {
            console.log(error);
            toast.error(error, { rtl: true, })
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postAuthRouteAPI({ routeName: "activateProfile" }).then(async (res) => {
                        dispatch({
                            type: 'SET_PROFILE_DATA',
                            viewProfileData: res?.data,
                        });
                        setShowLoader(false)
                    })
                })
            }
        })
    }

    return (
        <>
            {accountsSectionType == 'default' ?
                <div className='mt-4'>
                    <p className={` ${styles.paraText}`}>{DeleteAccoutConst.nameText} <span className='fontBold'> {data?.fullName ? data?.fullName : data?.firstName}  🙏</span></p>
                    <p className={` ${styles.paraText}`}>{DeleteAccoutConst.deleteAccountText1}</p>
                    <div className='flex items-baseline'>
                        <p className='pr-2'>1.</p>
                        <p className={styles.paraPoints}>{DeleteAccoutConst.point11} <span className='fontMedium text-red-500'>30 {DeleteAccoutConst.point12}</span>  {DeleteAccoutConst.point14}</p>
                    </div>
                    <div className='flex items-baseline'>
                        <p className='pr-2'>2.</p>
                        <p className={styles.paraPoints}>{DeleteAccoutConst.point2}</p>
                    </div>
                    <div className='flex items-baseline'>
                        <p className='pr-2'>3.</p>
                        <p className={styles.paraPoints}>{DeleteAccoutConst.point31} <span className='fontMedium'>{DeleteAccoutConst.point32} .</span></p>
                    </div>
                    <div className={`${styles.buttonDiv}`}>
                        <button className={`primarySolidBtn ${styles.updateRetreat}`} onClick={() => router.push('/')}>{DeleteAccoutConst.AccountNotDeleteBtnText}</button>
                        <button className={styles.updateDeleteBtn} onClick={() => handleDeleteAccount()} disabled={showLoader} > {showLoader ? <Image src={loader} width={30} height={30} alt={'loader'} /> : ""}{DeleteAccoutConst.confirmAccountDeleteBtnText}</button>
                    </div>
                </div>
                :
                <>
                    <h3 className={`fontBold ${styles.sectionHeader}`}>{data?.fullName ? data?.fullName : data?.firstName}</h3>
                    <p className={styles.paraText}>{DeleteAccoutConst.recoveryText11} <span style={{ color: '#E5342F' }}>{countRemainingDays(data?.inActiveAt)}</span> {DeleteAccoutConst.recoveryText12}</p>
                    <p className={styles.paraText}>{DeleteAccoutConst.recoveryText21} <span className='fontMedium'>{DeleteAccoutConst.recoveryText22}</span></p>
                    <div className={styles.accountRecoveryBtnBox}>
                        <button className={`primarySolidBtn`} onClick={() => handleAccountRecovery()} disabled={showLoader} > {showLoader ? <Image src={loader} width={30} height={30} alt={'loader'} color='#FF0000' /> : ""}{DeleteAccoutConst.accountRecoverBtnText}</button>
                    </div>
                </>
            }
        </>
    )
}

export default DeleteAccount;