import React, { useEffect, useMemo, useState } from 'react';
import styles from './ChangePassword.module.scss'
import loader from '../../../public/icons/loader.svg'
import { toast } from "react-toastify";
import Image from 'next/image'
import { handleUpdatePassword, verifyPassword } from '../../../services/fireBaseAuthService';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { toastErrorMessage, toastSuccessMessage } from '../../../constants/ar';
import { ChangePasswordConst } from '../../../constants/ChangePasswordConst';



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

    const [initPasswordError, setInitPasswordError] = useState({
		minLength: true,
		capitalLetter: true,
		number: true,
		specialCharacter: true,
	});

    const [showLoader, setShowLoader] = useState(false);
    const regexPassword = useMemo(() => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, []);

    const validateInputs = () => {
        if (!oldPassword) {
            setIsOldPasswordError(ChangePasswordConst.oldPasswordError);
            // return false
        }
        if (!newPassword) {
            setIsNewPasswordError(ChangePasswordConst.newPasswordError);
            // return false
        }
        if (newPassword && (!regexPassword.test(newPassword))) {
            setIsNewPasswordError('New password must be at least 8 characters');
            return false
        }
        if (!confirmPassword) {
            setIsConfirmPasswordError(ChangePasswordConst.confirmPasswordError);
            // return false
        }
        if (confirmPassword && confirmPassword !== newPassword) {
            setIsConfirmPasswordError('Passwords do not match');
            return false
        }
        return true
    }


    useEffect(() => {
        
		let data = { ...initPasswordError }
        if(newPassword?.length){
		if (newPassword.length > 7) {
			data.minLength = false
			setInitPasswordError(data)
		} else {
			data.minLength = true
			setInitPasswordError(data)
		}
		if (newPassword.match(/[A-Z]/g)) {
			data.capitalLetter = false
			setInitPasswordError(data)
		} else {
			data.capitalLetter = true
			setInitPasswordError(data)
		}
		if (newPassword.match(/[0-9]/g)) {
			data.number = false
			setInitPasswordError(data)
		} else {
			data.number = true
			setInitPasswordError(data)
		}
		if (newPassword.match(/[!@#$%^&*]/g)) {
			data.specialCharacter = false
			setInitPasswordError(data)
		} else {
			data.specialCharacter = true
			setInitPasswordError(data)
		}
		if (newPassword.length > 7 && newPassword.match(/[A-Z]/g) && newPassword.match(/[0-9]/g) && newPassword.match(/[!@#$%^&*]/g)) {
			setIsNewPasswordError(null)
		} else {
			setIsNewPasswordError(ChangePasswordConst.passwordFormateMsg)
		}
    }
    },[newPassword])


    const handleSubmit = async (e) => {
        setShowLoader(true)
        e.preventDefault();
        if (!validateInputs()) return
        await verifyPassword(data?.email, oldPassword).then(async (res) => {
            await handleUpdatePassword(newPassword).then(res => {
                setActiveTab(0)
                toast.success(toastSuccessMessage.passwordUpdateMsg, { rtl: true, })
                setOldPassword('')
                setNewPassword('')
                setConfirmPassword('')
            }).catch(error => {
                console.log(error);
                toast.error(error?.message, { rtl: true, })
            })
            setShowLoader(false)
        }).catch(error => {
            if (error.code == 'auth/wrong-password') {
                toast.error(toastErrorMessage.passWordIncorrectErrorMsg, { rtl: true, })
            }
            setShowLoader(false)
        })
    }


    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.changePasswordContainer}>
                <div className={styles.phoneTitleDiv} >
                    <h3>{ChangePasswordConst?.heading}</h3>
                </div>

                <div className={`formInputBox ${styles.passwordInputBox}`}>
                    <div className={styles.IconDiv}>
                        <AllIconsComponenet height={24} width={24} iconName={'lock'} color={'#808080'} />
                    </div>
                    <input className={`formInput ${isOldPasswordError ? `${styles.formInputError}` : `${styles.formInputText}`}`}
                        id="oldPassword"
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => { setOldPassword(e.target.value); setIsOldPasswordError('') }}
                        placeholder=' '
                    />
                    <label className={`formLabel ${isOldPasswordError ? `${styles.formInputPlaceHolderError}` : `${styles.formInputLabel}`}`} htmlFor="oldPassword">{ChangePasswordConst?.oldPasswordLabel}</label>
                    {oldPassword &&
                    <div className={styles.passwordIconDiv}>
                        {!showOldPassword ?
                            <div onClick={() => setShowOldPassword(true)}>
                                <AllIconsComponenet height={24} width={24} iconName={'visibilityIcon'} color={'#00000080'} />
                            </div>
                            :
                            <div onClick={() => setShowOldPassword(false)}>
                                <AllIconsComponenet height={24} width={24} iconName={'visibilityOffIcon'} color={'#00000080'} />
                            </div>
                        }
                    </div>
                    }
                </div>
                {isOldPasswordError && <p className={styles.errorText}>{isOldPasswordError}</p>}

                <div className={`formInputBox ${styles.passwordInputBox}`}>
                    <div className={styles.IconDiv}>
                        <AllIconsComponenet height={24} width={24} iconName={'lock'} color={'#808080'} />
                    </div>
                    <input className={`formInput ${isNewPasswordError ? `${styles.formInputError}` : `${styles.formInputText}`}`}
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setIsNewPasswordError("") }}
                        placeholder=' '
                    />
                    <label className={`formLabel ${isNewPasswordError ? `${styles.formInputPlaceHolderError}` : `${styles.formInputLabel}`}`} htmlFor="newPassword">{ChangePasswordConst?.newPasswordLabel}</label>
                    {newPassword &&
                    <div className={styles.passwordIconDiv}>
                        {!showNewPassword ?
                            <div onClick={() => setShowNewPassword(true)}>
                                <AllIconsComponenet height={24} width={24} iconName={'visibilityIcon'} color={'#00000080'} />
                            </div>
                            :
                            <div onClick={() => setShowNewPassword(false)}>
                                <AllIconsComponenet height={24} width={24} iconName={'visibilityOffIcon'} color={'#00000080'} />
                            </div>
                        }
                    </div>
                    }
                </div>
                {!isNewPasswordError && <p className={styles.passwordHintText}>{ChangePasswordConst?.passwordHintHeading}</p>}
                {isNewPasswordError && <p className={styles.errorText}>{isNewPasswordError}</p>}

                {/* <div>        
                <p className={styles.notes}>{!oldPassword && !newPassword && !confirmPassword ? <AllIconsComponenet iconName={'checkCircleIcon'} height={20} width={20} color={'#808080'} /> : !regexPassword.test(newPassword) ? <AllIconsComponenet iconName={'passwordAlertIcon'} height={20} width={20} color={'#808080'} /> : <AllIconsComponenet iconName={'checkCircleIcon'} height={20} width={20} color={'#7FDF4B'} />}<span>{ChangePasswordConst?.hint1}</span></p>
                <p className={styles.notes}>{!oldPassword && !newPassword && !confirmPassword ? <AllIconsComponenet iconName={'checkCircleIcon'} height={20} width={20} color={'#808080'} /> : !regexPassword.test(newPassword) ? <AllIconsComponenet iconName={'passwordAlertIcon'} height={20} width={20} color={'#808080'} /> : <AllIconsComponenet iconName={'checkCircleIcon'} height={20} width={20} color={'#7FDF4B'} />}<span>{ChangePasswordConst?.hint2}</span></p>
                <p className={styles.notes}>{!oldPassword && !newPassword && !confirmPassword ? <AllIconsComponenet iconName={'checkCircleIcon'} height={20} width={20} color={'#808080'} /> : !regexPassword.test(newPassword) ? <AllIconsComponenet iconName={'passwordAlertIcon'} height={20} width={20} color={'#808080'} /> : <AllIconsComponenet iconName={'checkCircleIcon'} height={20} width={20} color={'#7FDF4B'} />}<span>{ChangePasswordConst?.hint3}</span></p>
                <p className={styles.notes}>{!oldPassword && !newPassword && !confirmPassword ? <AllIconsComponenet iconName={'checkCircleIcon'} height={20} width={20} color={'#808080'} /> : !regexPassword.test(newPassword) ? <AllIconsComponenet iconName={'passwordAlertIcon'} height={20} width={20} color={'#808080'} /> : <AllIconsComponenet iconName={'checkCircleIcon'} height={20} width={20} color={'#7FDF4B'} />}<span>{ChangePasswordConst?.hint4}</span></p>
                </div>         */}

                <div className={styles.errorMsgWraper}>
							<>
								<AllIconsComponenet
									iconName={(!newPassword && !isNewPasswordError) ? "checkCircleIcon" : (!newPassword && isNewPasswordError) ? 'alertIcon' : (newPassword && initPasswordError?.minLength) ? 'alertIcon' : 'checkCircleIcon'}
									color={(!newPassword && !isNewPasswordError) ? "#808080" : (!newPassword && isNewPasswordError) ? "#E5342F" : (newPassword && initPasswordError?.minLength) ? '#E5342F' : '#7FDF4B'}
									height={20}
									width={20}
								/>
								<p className='p-1'>{ChangePasswordConst.hint1}</p>
							</>
						</div>
						<div className={styles.errorMsgWraper}>
							<>
								<AllIconsComponenet
									iconName={(!newPassword && !isNewPasswordError) ? "checkCircleIcon" : (!newPassword && isNewPasswordError) ? 'alertIcon' : (newPassword && initPasswordError?.capitalLetter) ? 'alertIcon' : 'checkCircleIcon'}
									color={(!newPassword && !isNewPasswordError) ? "#808080" : (!newPassword && isNewPasswordError) ? "#E5342F" : (newPassword && initPasswordError?.capitalLetter) ? '#E5342F' : '#7FDF4B'}
									height={20}
									width={20}
								/>
								<p className='p-1'>{ChangePasswordConst.hint2}</p>
							</>
						</div>
						<div className={styles.errorMsgWraper}>
							<>
								<AllIconsComponenet
									iconName={(!newPassword && !isNewPasswordError) ? "checkCircleIcon" : (!newPassword && isNewPasswordError) ? 'alertIcon' : (newPassword && initPasswordError?.number) ? 'alertIcon' : 'checkCircleIcon'}
									color={(!newPassword && !isNewPasswordError) ? "#808080" : (!newPassword && isNewPasswordError) ? "#E5342F" : (newPassword && initPasswordError?.number) ? '#E5342F' : '#7FDF4B'}
									height={20}
									width={20}
								/>
								<p className='p-1'>{ChangePasswordConst.hint3}</p>
							</>
						</div>
						<div className={styles.errorMsgWraper}>
							<>
								<AllIconsComponenet
									iconName={(!newPassword && !isNewPasswordError) ? "checkCircleIcon" : (!newPassword && isNewPasswordError) ? 'alertIcon' : (newPassword && initPasswordError?.specialCharacter) ? 'alertIcon' : 'checkCircleIcon'}
									color={(!newPassword && !isNewPasswordError) ? "#808080" : (!newPassword && isNewPasswordError) ? "#E5342F" : (newPassword && initPasswordError?.specialCharacter) ? '#E5342F' : '#7FDF4B'}
									height={20}
									width={20}
								/>
								<p className='p-1'>{ChangePasswordConst.hint4}</p>
							</>
						</div>

                <div className={`formInputBox ${styles.passwordInputBox}`}>
                    <div className={styles.IconDiv}>
                        <AllIconsComponenet height={24} width={24} iconName={'lock'} color={'#808080'} />
                    </div>
                    <input className={`formInput ${isConfirmPasswordError ? `${styles.formInputError}` : `${styles.formInputText}`}`}
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value), setIsConfirmPasswordError("") }}
                        placeholder=' '
                    />
                    <label className={`formLabel ${isConfirmPasswordError ? `${styles.formInputPlaceHolderError}` : `${styles.formInputLabel}`}`} htmlFor="confirmPassword">{ChangePasswordConst?.confirmPasswordLabel}</label>
                   {confirmPassword &&
                    <div className={styles.passwordIconDiv}>
                        {!showConfirmPassword ?
                            <div onClick={() => setShowConfirmPassword(true)}>
                                <AllIconsComponenet height={24} width={24} iconName={'visibilityIcon'} color={'#00000080'} />
                            </div>
                            :
                            <div onClick={() => setShowConfirmPassword(false)}>
                                <AllIconsComponenet height={24} width={24} iconName={'visibilityOffIcon'} color={'#00000080'} />
                            </div>
                        }
                    </div>
                    }
                </div>
                {isConfirmPasswordError && <p className={styles.errorText}>{isConfirmPasswordError}</p>}
                <div className={styles.changePasswordBtnBox}>
                    <button className='primarySolidBtn' type='submit' disabled={isOldPasswordError || isNewPasswordError || isConfirmPasswordError}>{showLoader ? <Image src={loader} width={50} height={30} alt={'loader'} /> : ""} {ChangePasswordConst?.saveBtn}</button>
                </div>
            </div>
        </form>
    )
}

export default ChangePassword