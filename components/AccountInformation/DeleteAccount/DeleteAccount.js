import { accountRecovery, deleteAccount, viewProfileAPI } from '../../../services/apisService';
import styles from './DeleteAccount.module.scss';
import { toast } from "react-toastify";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { toastSuccessMessage } from '../../../constants/ar';
import Image from 'next/legacy/image';
import loader from '../../../public/icons/loader.svg'




const DeleteAccount = ({ data }) => {
    const [accountsSectionType, setAccountsSectionType] = useState(data?.inActiveAt ? 'accountRecovery' : 'default');
    const dispatch = useDispatch();
    const router = useRouter()
    const [showLoader, setShowLoader] = useState(false);

    const handleDeleteAccount = async () => {
        setShowLoader(true)
        await deleteAccount().then(async (res) => {
            await viewProfileAPI().then(res => {
                dispatch({
                    type: 'SET_PROFILE_DATA',
                    viewProfileData: res?.data,
                });
                setShowLoader(false)
            }).catch(error => {
                console.log(error);
                setShowLoader(false)
            })
            setAccountsSectionType('accountRecovery')
        }).catch(error => {
            setShowLoader(false)
            console.log(error);
            toast.error(error)
        })
    }

    const handleAccountRecovery = async () => {
        await accountRecovery().then(res => {
            dispatch({
                type: 'SET_PROFILE_DATA',
                viewProfileData: res?.data,
            });
            setAccountsSectionType('default')
            toast.success(toastSuccessMessage.accountRestoredMsg)
        }).catch(error => {
            console.log(error);
            toast.error(error)
        })
    }

    return (
        <>
            {accountsSectionType == 'default' ?
                <>
                    <h3 className={`fontBold ${styles.sectionHeader}`}>حذف الحساب</h3>
                    <p className={`fontMedium ${styles.paraText}`}>رح نفتدقك يا  <span className='fontBold'> {data?.firstName} </span> <br />
                        تقدر تتراجع عن قرار حذف حسابك بمدة أقصاها <span style={{ color: "red" }}>30 يوم</span>  وبعدها رح يتم حذف حسابك بشكل كامل وراح تفقد وصولك إلى الدورات اللي اشتريتها وما بتقدر تسترجع فلوسك</p>

                    <div className={`${styles.buttonDiv} flex justify-center items-center`}>
                        <button className={`primaryStrockedBtn ${styles.updateRetreat}`} onClick={() => router.push('/')}  >تراجع </button>
                        <button className={styles.updateDeleteBtn} onClick={() => handleDeleteAccount()} disabled={showLoader} > {showLoader ? <Image src={loader} width={30} height={30} alt={'loader'} /> : ""}  حذف الحساب  </button>
                    </div>
                </>
                :
                <>
                    <h3 className={`fontBold ${styles.sectionHeader}`}>استعادة الحساب</h3>
                    <p className={styles.paraText}>حسابك راح ينحذف خلال x يوم، بإمكانك استعادة حسابك بالنقر على زر استعادة الحساب</p>
                    <div className={styles.accountRecoveryBtnBox}>
                        <button className={`primarySolidBtn ${styles.accountRecoveryBtn}`} onClick={() => handleAccountRecovery()} disabled={showLoader} > {showLoader ? <Image src={loader} width={30} height={30} alt={'loader'} color='#FF0000' /> : ""} استعادة الحساب</button>
                    </div>
                </>
            }
        </>
    )
}

export default DeleteAccount;