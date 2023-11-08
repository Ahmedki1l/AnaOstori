import React, { useEffect, useMemo, useState } from 'react';
import styles from '../styles/AccountInformation.module.scss'
import loader from '../public/icons/loader.svg'
import { toast } from "react-toastify";
import { getAuthRouteAPI } from '../services/apisService';
import { changeEmail, signOutUser, verifyPassword } from '../services/fireBaseAuthService';
import Image from 'next/image'
import ChangePassword from '../components/AccountInformation/ChangePassword/ChangePassword';
import DeleteAccount from '../components/AccountInformation/DeleteAccount/DeleteAccount';
import { useDispatch, useSelector } from 'react-redux';
import AllIconsComponenet from '../Icons/AllIconsComponenet';
import useWindowSize from '../hooks/useWindoSize';
import { inputErrorMessages, toastErrorMessage, toastSuccessMessage } from '../constants/ar';
import { AccountInformationConst } from '../constants/AccountInformationConst';


export default function AccountInformation() {
    const storeData = useSelector((state) => state?.globalStore);
    const [activeTab, setActiveTab] = useState(storeData.loginWithoutPassword == true ? 2 : 0);
    const [showLoader, setShowLoader] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [userProfileData, setUserProfileData] = useState({});
    const [gender, setGender] = useState();
    const [sectionType, setSectionType] = useState('default');
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isPhoneNumberError, setIsPhoneNumberError] = useState(false);
    const [email, setEmail] = useState()
    const [emailError, setEmailError] = useState(null);
    const [isEmailError, setIsEmailError] = useState(false);
    const [isPasswordError, setIsPasswordError] = useState(false);
    // const regexEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
    const regexEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, [])
    const regexPassword = useMemo(() => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, []);
    const regexPhone = useMemo(() => /^(\+?\d{1,3}[- ]?)?\d{10}$/, []);
    const isSmallScreen = useWindowSize().smallScreen
    const [isTabListShown, setIsTabListShown] = useState(true);
    const [isTabContentShown, setIsTabContentShown] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        setUserProfileData(storeData?.viewProfileData);
        setPhoneNumber(storeData?.viewProfileData?.phone?.replace("966", "0"))
        setEmail(storeData?.viewProfileData?.email)
        setGender(storeData?.viewProfileData?.gender);
    }, [storeData?.viewProfileData])


    useEffect(() => {

        if (email) {
            setIsEmailError(null)
        }

        if (password) {
            setPasswordError(null)
        }

        if (email && !(regexEmail.test(email))) {
            setEmailError(true)
        }
        else {
            setEmailError(false)
        }

        if (password && !(regexPassword.test(password))) {
            setIsPasswordError(true)
        }
        else {
            setIsPasswordError(false)
        }
        if (phoneNumber && !(phoneNumber.startsWith("05"))) {
            setIsPhoneNumberError(true)
        }
        else {
            setIsPhoneNumberError(false)
        }
    }, [email, password, phoneNumber, regexEmail, regexPassword, regexPhone])

    useEffect(() => {
        if (isSmallScreen) {
            setIsTabListShown(true)
            setIsTabContentShown(false)
        } else {
            setIsTabListShown(true)
            setIsTabContentShown(true)
        }
    }, [isSmallScreen])

    const handleTabClick = (tabData) => {
        if (tabData == 1 && storeData.loginWithoutPassword == true) return
        setActiveTab(tabData);
        setSectionType("default")
        if (isSmallScreen) {
            setIsTabListShown(false)
            setIsTabContentShown(true)
        }
    };

    const getProfileData = async (type) => {
        const data = {
            routeName: "viewProfile"
        }
        await getAuthRouteAPI(data).then(res => {
            dispatch({
                type: 'SET_PROFILE_DATA',
                viewProfileData: res?.data,
            });
            setSectionType('default')
        }).catch(error => {
            console.log(error);
            if (error?.response?.status == 401) {
                signOutUser()
                dispatch({
                    type: 'EMPTY_STORE'
                });
            }
        })
    }

    const handleCheckPassword = async () => {
        if (!password) {
            setPasswordError(inputErrorMessages.noPasswordMsg)
            return
        }
        if (!password || passwordError) return
        else {
            setShowLoader(true)
            await verifyPassword(userProfileData?.email, password).then(async (res) => {
                toast.success(toastSuccessMessage.passwordVerifiedSuccessMsg, { rtl: true, })
                if (res?.user?.accessToken) {
                    await changeEmail(email).then(res => {
                        toast.success(AccountInformationConst.emailUpdateSuccessToastMsg, { rtl: true, })
                        setShowLoader(false)
                        setEmail(email)
                        setPassword("")
                        setSectionType('default')
                        getProfileData('email')
                    }).catch(error => {
                        setShowLoader(false)
                        console.log(error);
                    })
                }
                else {
                    setShowLoader(false)
                }

            }).catch(error => {
                setShowLoader(false)
                if (error.code == 'auth/wrong-password') {
                    toast.error(toastErrorMessage.passWordIncorrectErrorMsg, { rtl: true, })
                }
                console.log(error);
            })
        }
    }
    const handleEmailNextBtn = (e) => {
        if (!email?.length || emailError || isEmailError) {
            setIsEmailError(true)
        }
        else if (email == storeData.viewProfileData.email) {
            toast.error(AccountInformationConst.emailNotChangedMsg, { rtl: true, })
            return
        }
        else {
            setIsEmailError(false)
            setSectionType('password')
        }
    }

    const handleArraowClick = () => {
        setIsTabListShown(true)
        setIsTabContentShown(false)
    }

    return (
        <>
            <div className={`${styles.verticalTabsContainer}`}>
                {(isTabListShown) &&
                    <div className={styles.tabsList}>
                        {storeData.loginWithoutPassword == false &&
                            <>
                                {isSmallScreen ?
                                    <div className={styles.smallScreenTabTitleDiv} onClick={() => handleTabClick(0)}>
                                        <div className={styles.tabTitleDiv}>
                                            <AllIconsComponenet height={25} width={25} iconName={'newEmailIcon'} color={'#000000'} />
                                            <p className={`fontMedium pr-2 ${styles.tabTitle}`}>تعديل الايميل</p>
                                        </div>
                                        <div style={{ height: '17px', cursor: 'pointer' }}>
                                            <AllIconsComponenet height={17} width={10} iconName={'arrowLeft'} color={'#000000'} />
                                        </div>
                                    </div>
                                    :
                                    <div className={`${styles.tab} ${activeTab == 0 && `${styles.active}`}`} onClick={() => handleTabClick(0)}>
                                        <div className={styles.tabDiv}>
                                            <AllIconsComponenet height={25} width={25} iconName={'newEmailIcon'} color={'#000000'} />
                                            <div className={styles.tabTitleDiv}>
                                                <p className={`fontMedium pr-2 ${styles.tabTitle}`}>تعديل الايميل</p>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {isSmallScreen ?
                                    <div className={styles.smallScreenTabTitleDiv} onClick={() => handleTabClick(1)}>
                                        <div className={styles.tabTitleDiv}>
                                            <AllIconsComponenet height={25} width={25} iconName={'newLockIcon'} color={'#000000'} />
                                            <p className={`fontMedium pr-2 ${styles.tabTitle}`}>تغيير كلمة السر</p>
                                        </div>
                                        <div style={{ height: '17px', cursor: 'pointer' }}>
                                            <AllIconsComponenet height={17} width={10} iconName={'arrowLeft'} color={'#000000'} />
                                        </div>
                                    </div>
                                    :
                                    <div className={`${styles.tab} ${activeTab == 1 && `${styles.active}`}`} onClick={() => handleTabClick(1)}>
                                        {storeData.loginWithoutPassword == true && <div className={styles.disable}></div>}
                                        <div className={styles.tabDiv}>
                                            <AllIconsComponenet height={25} width={25} iconName={'newLockIcon'} color={'#000000'} />
                                            <div className={styles.tabTitleDiv}>
                                                <p className={`fontMedium pr-2 ${styles.tabTitle}`}>تغيير كلمة السر</p>
                                            </div>
                                        </div>
                                    </div>}
                            </>
                        }
                        {isSmallScreen ?
                            <div className={styles.smallScreenTabTitleDiv} onClick={() => handleTabClick(2)}>
                                <div className={styles.tabTitleDiv}>
                                    <AllIconsComponenet height={25} width={25} iconName={`${userProfileData?.inActiveAt == null ? 'accountDelet' : 'accountRestore'}`} color={'#000000'} />
                                    <p className={`fontMedium pr-2 ${styles.tabTitle}`}>{`${userProfileData?.inActiveAt == null ? 'حذف الحساب' : 'استرجاع الحساب'}`}</p>
                                </div>
                                <div style={{ height: '17px', cursor: 'pointer' }}>
                                    <AllIconsComponenet height={17} width={10} iconName={'arrowLeft'} color={'#000000'} />
                                </div>
                            </div>
                            :
                            <div className={`${styles.tab} ${activeTab == 2 && `${styles.active}`}`} onClick={() => handleTabClick(2)}>
                                <div className={styles.tabDiv}>
                                    <AllIconsComponenet height={25} width={25} iconName={`${userProfileData?.inActiveAt == null ? 'accountDelet' : 'accountRestore'}`} color={'#000000'} />
                                    <div className={styles.tabTitleDiv}>
                                        <p className={`fontMedium pr-2 ${styles.tabTitle}`}>{`${userProfileData?.inActiveAt == null ? 'حذف الحساب' : 'استرجاع الحساب'}`}</p>
                                    </div>
                                </div>
                            </div>}
                    </div>
                }
                <div className={styles.tabContent}>
                    {isTabContentShown &&
                        <>
                            {activeTab == 0 ?
                                <>
                                    {sectionType == 'default' ?
                                        <div className={styles.phoneContainer}>
                                            <p className={`font-medium ${styles.existingDetailText}`}>{AccountInformationConst?.currentEmailText}: {userProfileData?.email}</p>
                                            <div className='formInputBox'>
                                                <div className='formInputIconDiv'>
                                                    <AllIconsComponenet height={24} width={24} iconName={'email'} color={'#808080'} />
                                                </div>
                                                <input className={`formInput ${emailError || isEmailError ? `${styles.formInputError}` : `${styles.formInputText}`}`} name='email' id='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=' ' />
                                                <label className={`formLabel ${emailError || isEmailError ? `${styles.formInputPlaceHolderError}` : `${styles.formInputLabel}`}`} htmlFor="email">{AccountInformationConst.emailLabel}</label>
                                            </div>
                                            {emailError ? <p className={styles.errorText}>{AccountInformationConst.emptyEmailError}</p> : isEmailError == true && <p className={styles.errorText}>{AccountInformationConst.emailError}</p>}
                                            <div className={styles.submitBtnBox}>
                                                <button className='primarySolidBtn flex items-center' type='submit' onClick={() => handleEmailNextBtn()} >{showLoader ? <Image src={loader} width={50} height={30} alt={'loader'} /> : ""} {AccountInformationConst.submitBtn}</button>
                                            </div>
                                            {isSmallScreen &&
                                                <div className={styles.submitBtnBox}>
                                                    <button className={`flex items-center ${styles.cancelBtn}`} onClick={() => handleArraowClick()}>{AccountInformationConst.cancelBtn}</button>
                                                </div>}
                                        </div>
                                        : sectionType == 'password' ?
                                            <div className={styles.phoneContainer}>
                                                <h3 className='py-4'>تأكيد كلمة السر</h3>
                                                <p>دخل كلمة السر عشان تقدر تعدل ايميلك</p>
                                                <div className={`formInputBox`}>
                                                    <div className={styles.IconDiv}>
                                                        <AllIconsComponenet height={24} width={24} iconName={'lock'} color={'#808080'} />
                                                    </div>
                                                    <input className={`formInput ${passwordError || isPasswordError ? `${styles.formInputError}` : `${styles.formInputText}`}`} id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} name="password" title="Password" placeholder=' ' />
                                                    <label className={`formLabel ${passwordError || isPasswordError ? `${styles.formInputPlaceHolderError}` : `${styles.formInputLabel}`}`} htmlFor="Password">كلمة السر</label>
                                                    <div className={styles.passwordIconDiv}>
                                                        {!showPassword ?
                                                            <div onClick={() => setShowPassword(true)}>
                                                                <AllIconsComponenet height={24} width={24} iconName={'newVisibleIcon'} color={'#808080'} />
                                                            </div>
                                                            :
                                                            <div onClick={() => setShowPassword(false)}>
                                                                <AllIconsComponenet height={24} width={24} iconName={'newVisibleOffIcon'} color={'#808080'} />
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                {passwordError ? <p className={styles.errorText}>كلمة السر لاهنت</p> : isPasswordError && <p className={styles.errorText}>{AccountInformationConst.passwordIncorrecterrorMsg} </p>}
                                                <div className={styles.submitBtnBox}>
                                                    <button className='primarySolidBtn flex items-center' type='submit' onClick={() => handleCheckPassword()}>{showLoader ? <Image src={loader} width={50} height={30} alt={'loader'} /> : ""} تحديث وحفظ </button>
                                                </div>
                                                {/* <div className={styles.submitBtnBox}>
                                                    <button className={`flex items-center ${styles.cancelBtn}`} onClick={() => setSectionType('default')}>{AccountInformationConst.cancelBtn}</button>
                                                </div> */}
                                            </div>
                                            : ""
                                    }
                                </>
                                : activeTab == 1 ?
                                    <>
                                        <ChangePassword data={userProfileData} setActiveTab={setActiveTab} />
                                    </>
                                    :
                                    <>
                                        <DeleteAccount data={userProfileData} setActiveTab={setActiveTab} />
                                    </>
                            }
                        </>
                    }
                </div>
            </div >
        </>
    )
}