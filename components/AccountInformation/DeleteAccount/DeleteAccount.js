import { accountRecovery, deleteAccount, viewProfileAPI } from '../../../services/apisService';
import styles from './DeleteAccount.module.scss';
import { toast } from "react-toastify";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { toastSuccessMessage } from '../../../constants/ar';




const DeleteAccount = ({ data }) => {
    const [accountsSectionType, setAccountsSectionType] = useState(data?.inActiveAt ? 'accountRecovery' : 'default');
    const dispatch = useDispatch();
    const storeData = useSelector((state) => state?.globalStore);
    const router = useRouter()

    const handleDeleteAccount = async () => {
        await deleteAccount(storeData?.accessToken).then(async (res) => {
            await viewProfileAPI(storeData?.accessToken).then(res => {
                dispatch({
                    type: 'SET_PROFILE_DATA',
                    viewProfileData: res?.data,
                });
            }).catch(error => {
                console.log(error);
            })
            setAccountsSectionType('accountRecovery')
        }).catch(error => {
            console.log(error);
            toast.error(error)
        })
    }

    const handleAccountRecovery = async () => {
        await accountRecovery(storeData?.accessToken).then(res => {
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
                        <button className={styles.updateDeleteBtn} onClick={() => handleDeleteAccount()} >حذف الحساب </button>
                    </div>
                </>
                :
                <>
                    <h3 className={`fontBold ${styles.sectionHeader}`}>استعادة الحساب</h3>
                    <p className={styles.paraText}>حسابك راح ينحذف خلال x يوم، بإمكانك استعادة حسابك بالنقر على زر استعادة الحساب</p>
                    <div className={styles.accountRecoveryBtnBox}>
                        <button className={`primarySolidBtn ${styles.accountRecoveryBtn}`} onClick={() => handleAccountRecovery()}  >استعادة الحساب</button>
                    </div>
                </>
            }
        </>
    )
}

export default DeleteAccount;