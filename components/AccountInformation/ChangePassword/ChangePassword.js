import React, { useEffect, useMemo, useState } from 'react';
import styles from './ChangePassword.module.scss'
import loader from '../../../public/icons/loader.svg'
import { toast } from "react-toastify";
import Image from 'next/image'
import { handleUpdatePassword, verifyPassword } from '../../../services/fireBaseAuthService';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { toastErrorMessage, toastSuccessMessage } from '../../../constants/ar';



const ChangePassword = ({ data, setActiveTab }) => {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isOldPasswordError, setIsOldPasswordError] = useState(false);
    const [isNewPasswordError, setIsNewPasswordError] = useState(false);
    const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false);

    const [showLoader, setShowLoader] = useState(false);
    const regexPassword = useMemo(() => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, []);

    const validateInputs = () => {
        if (!oldPassword) {
            setIsOldPasswordError('Old password is required');
            return false
        }
        if (!newPassword) {
            setIsNewPasswordError('New password is required');
            return false
        }
        if (newPassword && (!regexPassword.test(newPassword))) {
            setIsNewPasswordError('New password must be at least 8 characters');
            return false
        }
        if (!confirmPassword) {
            setIsConfirmPasswordError('Confirm password is required');
            return false
        }
        if (confirmPassword && confirmPassword !== newPassword) {
            setIsConfirmPasswordError('Passwords do not match');
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        setShowLoader(true)
        e.preventDefault();
        if (!validateInputs()) return
        await verifyPassword(data?.email, oldPassword).then(async (res) => {
            await handleUpdatePassword(newPassword).then(res => {
                setActiveTab(0)
                toast.success(toastSuccessMessage.passwordUpdateMsg)
                setOldPassword('')
                setNewPassword('')
                setConfirmPassword('')
            }).catch(error => {
                console.log(error);
                toast.error(error?.message)
            })
            setShowLoader(false)
        }).catch(error => {
            if (error.code == 'auth/wrong-password') {
                toast.error(toastErrorMessage.passWordIncorrectErrorMsg)
            }
            setShowLoader(false)
        })
    }



    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.changePasswordContainer}>
                <div className={styles.phoneTitleDiv} >
                    <h3>تغيير كلمة السر</h3>
                </div>

                <div className={`formInputBox ${styles.passwordInputBox}`}>
                    <div className={styles.IconDiv}>
                        <AllIconsComponenet height={18} width={16} iconName={'lock'} color={'#00000080'} />
                    </div>
                    <input className='formInput'
                        id="oldPassword"
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => { setOldPassword(e.target.value); setIsOldPasswordError('') }}
                        placeholder=' '
                    />
                    <label className={`formLabel ${styles.labels}`} htmlFor="oldPassword">كلمة السر الحالية</label>
                    <div className={styles.passwordIconDiv}>
                        {!showOldPassword ?
                            <div onClick={() => setShowOldPassword(true)}>
                                <AllIconsComponenet height={20} width={24} iconName={'visibilityIcon'} color={'#00000080'} />
                            </div>
                            :
                            <div onClick={() => setShowOldPassword(false)}>
                                <AllIconsComponenet height={20} width={24} iconName={'visibilityOffIcon'} color={'#00000080'} />
                            </div>
                        }
                    </div>
                </div>
                {isOldPasswordError && <p className={styles.errorText}>{isOldPasswordError}</p>}


                <div className={`formInputBox ${styles.passwordInputBox}`}>
                    <div className={styles.IconDiv}>
                        <AllIconsComponenet height={18} width={16} iconName={'lock'} color={'#00000080'} />
                    </div>
                    <input className='formInput'
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setIsNewPasswordError("") }}
                        placeholder=' '
                    />
                    <label className={`formLabel ${styles.labels}`} htmlFor="newPassword">كلمة السر الجديدة</label>
                    <div className={styles.passwordIconDiv}>
                        {!showNewPassword ?
                            <div onClick={() => setShowNewPassword(true)}>
                                <AllIconsComponenet height={20} width={24} iconName={'visibilityIcon'} color={'#00000080'} />
                            </div>
                            :
                            <div onClick={() => setShowNewPassword(false)}>
                                <AllIconsComponenet height={20} width={24} iconName={'visibilityOffIcon'} color={'#00000080'} />
                            </div>
                        }

                    </div>
                </div>
                <p className={styles.passwordHintText}>يجب ان تحتوي على 8 احرف كحد ادنى، حرف واحد كبير على الاقل، رقم، وعلامة مميزة </p>
                {isNewPasswordError && <p className={styles.errorText}>{isNewPasswordError}</p>}

                <div className={`formInputBox ${styles.passwordInputBox}`}>
                    <div className={styles.IconDiv}>
                        <AllIconsComponenet height={18} width={16} iconName={'lock'} color={'#00000080'} />
                    </div>
                    <input className='formInput'
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value), setIsConfirmPasswordError("") }}
                        placeholder=' '
                    />
                    <label className={`formLabel ${styles.labels}`} htmlFor="confirmPassword">تأكيد كلمة السر الجديدة</label>
                    <div className={styles.passwordIconDiv}>
                        {!showConfirmPassword ?
                            <div onClick={() => setShowConfirmPassword(true)}>
                                <AllIconsComponenet height={20} width={24} iconName={'visibilityIcon'} color={'#00000080'} />
                            </div>
                            :
                            <div onClick={() => setShowConfirmPassword(false)}>
                                <AllIconsComponenet height={20} width={24} iconName={'visibilityOffIcon'} color={'#00000080'} />
                            </div>
                        }
                    </div>
                </div>
                {isConfirmPasswordError && <p className={styles.errorText}>{isConfirmPasswordError}</p>}
                <div className={styles.changePasswordBtnBox}>
                    <button className='primarySolidBtn' type='submit' disabled={!oldPassword || !newPassword || !confirmPassword || isOldPasswordError || isNewPasswordError || isConfirmPasswordError}>{showLoader ? <Image src={loader} width={50} height={30} alt={'loader'} /> : ""} حفظ</button>
                </div>
            </div>
        </form>
    )
}

export default ChangePassword