import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../components/CommonComponents/Icon';
import styles from '../styles/AccountInformation.module.scss'
import loader from '../public/icons/loader.svg'
import { toast } from "react-toastify";
import { updateProfile, viewProfileAPI } from '../services/apisService';
import { changeEmail, signOutUser, verifyPassword } from '../services/fireBaseAuthService';
import Image from 'next/image'
import ChangePassword from '../components/AccountInformation/ChangePassword/ChangePassword';
import DeleteAccount from '../components/AccountInformation/DeleteAccount/DeleteAccount';
import { useDispatch, useSelector } from 'react-redux';
import AllIconsComponenet from '../Icons/AllIconsComponenet';
import useWindowSize from '../hooks/useWindoSize';
import { toastErrorMessage, toastSuccessMessage } from '../constants/ar';


export default function AccountInformation() {
    const storeData = useSelector((state) => state?.globalStore);
    const [activeTab, setActiveTab] = useState(0);
    const [showLoader, setShowLoader] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [userProfileData, setUserProfileData] = useState({});
    const [gender, setGender] = useState();
    const [sectionType, setSectionType] = useState('default');
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isPhoneNumberError, setIsPhoneNumberError] = useState(false);
    const [email, setEmail] = useState()
    const [isEmailError, setIsEmailError] = useState(false);
    const [isPasswordError, setIsPasswordError] = useState(false);
    const regexEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
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
        if (!email?.length) {
            setIsEmailError(true)
        }
        else if (email && !(regexEmail.test(email))) {
            setIsEmailError(true)
        }
        else if (password && !(regexPassword.test(password))) {
            setIsPasswordError(true)
        }
        else {
            setIsEmailError(false)
            setIsPasswordError(false)
        }
        if (phoneNumber && !(phoneNumber.startsWith("05"))) {
            setIsPhoneNumberError(true)
        }
        else {
            setIsPhoneNumberError(false)
        }
    }, [email, password, phoneNumber, regexEmail, regexPassword, regexPhone])

    const subContentData = [
        {
            subTitle: 'رقم الجوال',
            subContentvalue: userProfileData?.phone?.replace("966", "0"),
            type: 'phone'
        },
        {
            subTitle: 'الايميل',
            subContentvalue: userProfileData?.email,
            type: 'email'
        },
        {
            subTitle: 'الجنس',
            subContentvalue: userProfileData?.gender == 'male' ? 'ذكر' : userProfileData?.gender == 'female' ? 'أنثى' : ' ',
            type: 'gender'
        }
    ]
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
        if (tabData == 1 && storeData.googleLogin == true) return
        setActiveTab(tabData);
        setSectionType("default")
        if (isSmallScreen) {
            setIsTabListShown(false)
            setIsTabContentShown(true)
        }
    };

    const getProfileData = async (type) => {
        await viewProfileAPI(storeData?.accessToken).then(res => {
            dispatch({
                type: 'SET_PROFILE_DATA',
                viewProfileData: res?.data,
            });
            toast.success(type == 'phone' ? toastSuccessMessage.mobileNoUpdateMsg : type == 'email' ? toastSuccessMessage.emailUpdateMsg : toastSuccessMessage.genderUpdateMsg)
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

    const handleUpdateDetails = async (type) => {
        setShowLoader(true)
        let body = {};
        if (type == 'phone') {
            body = {
                phone: phoneNumber.replace(/[0-9]/, "+966")
            }
        } else {
            body = {
                gender: gender
            }
        }
        const params = {
            data: body,
            accessToken: storeData?.accessToken
        }

        await updateProfile(params).then(async (res) => {
            setShowLoader(false)
            getProfileData(type)
        }).catch(error => {
            setShowLoader(false)
            console.log("errors : ", error)
            if (error?.response?.status == 401) {
                signOutUser()
            }
        });
    }

    const handleCheckPassword = async () => {
        setShowLoader(true)
        await verifyPassword(userProfileData?.email, password).then(async (res) => {
            if (res?.user?.accessToken) {
                await changeEmail(email).then(res => {
                    setShowLoader(false)
                    setEmail(email)
                    setPassword("")
                    setSectionType('default')
                    getProfileData('email')
                }).catch(error => {
                    setShowLoader(false)
                    console.log("error :", error);
                })
            }
            else {
                setShowLoader(false)
            }

        }).catch(error => {
            setShowLoader(false)
            if (error.code == 'auth/wrong-password') {
                toast.error(toastErrorMessage.passWordIncorrectErrorMsg)
            }
            console.log(error);
        })
    }

    const handleEmailNextBtn = (e) => {
        if (!email?.length) {
            setEmail("")
            setSectionType('الايميل')
        } else {
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
                        <div className={`${styles.tab} ${activeTab == 0 && `${styles.active}`}`} onClick={() => handleTabClick(0)}>
                            <div className={styles.tabDiv}>
                                <AllIconsComponenet height={25} width={25} iconName={'persone2'} color={'#000000'} />
                                <div className={styles.tabTitleDiv}>
                                    <p className={`${activeTab == 0 ? 'fontBold' : 'fontRegular'} ${styles.tabTitle}`}>معلومات الحساب</p>
                                    <p className={`fontRegular ${styles.tab1SubTitle}`}>تعديل رقم الجوال، الايميل، الجنس</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.tab} ${activeTab == 1 && `${styles.active}`}`} onClick={() => handleTabClick(1)}>
                            {storeData.googleLogin == true && <div className={styles.disable}></div>}
                            <div className={styles.tabDiv}>
                                <AllIconsComponenet height={25} width={25} iconName={'key'} color={'#000000'} />
                                <div className={styles.tabTitleDiv}>
                                    <p className={`${activeTab == 1 ? 'fontBold' : 'fontRegular'} ${styles.tabTitle}`}>تغيير كلمة السر</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.tab} ${activeTab == 2 && `${styles.active}`}`} onClick={() => handleTabClick(2)}>
                            <div className={styles.tabDiv}>
                                <AllIconsComponenet height={25} width={25} iconName={`${userProfileData?.inActiveAt == null ? 'accountDelet' : 'accountRestore'}`} color={'#000000'} />
                                <div className={styles.tabTitleDiv}>
                                    <p className={`${activeTab == 2 ? 'fontBold' : 'fontRegular'} ${styles.tabTitle}`}>{`${userProfileData?.inActiveAt == null ? 'حذف الحساب' : 'استعادة الحساب'}`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <div className={styles.tabContent}>
                    {isTabContentShown &&
                        <>
                            {sectionType == 'default' && isSmallScreen &&
                                <div className={styles.rightArrowDiv} onClick={() => handleArraowClick()}>
                                    <AllIconsComponenet height={17} width={10} iconName={'arrowRight'} color={'#000000'} />
                                </div>
                            }
                            {activeTab == 0 ?
                                <>
                                    {sectionType == 'default' ?
                                        subContentData?.map((items, index) => {
                                            return (
                                                <div className={`content-center ${styles.subContentDiv}`} key={index} onClick={() => setSectionType(items?.type)}>
                                                    <div>
                                                        <h5 className={`fontMedium ${styles.userDetailTitle}`}>{items?.subTitle}</h5>
                                                    </div>
                                                    <div className={`${styles.subContentValueDiv}`} >
                                                        <p className={`fontMedium ${styles.userDetailText}`}>{items?.subContentvalue}</p>
                                                        <AllIconsComponenet height={17} width={10} iconName={'arrowLeft'} color={'#000000'} />
                                                    </div>
                                                </div>
                                            )
                                        })
                                        : sectionType == 'phone' ?
                                            <div className={styles.phoneContainer}>
                                                <div className={styles.phoneTitleDiv} onClick={() => setSectionType('default')}>
                                                    <AllIconsComponenet height={17} width={10} iconName={'arrowRight'} color={'#000000'} />
                                                    <h3 className='fontBold'>تحديث رقم الجوال</h3>
                                                </div>
                                                <p className={`font-medium ${styles.existingDetailText}`}>رقم الجوال الحالي : {userProfileData?.phone?.replace("966", "0")}</p>
                                                <div className={`formInputBox ${styles.passwordInputBox}`}>
                                                    <div className={styles.IconDiv}>
                                                        <AllIconsComponenet height={20} width={20} iconName={'phone'} color={'#00000080'} />
                                                    </div>
                                                    <input className='formInput' id="phone" type="tel" name="phone" title="Phone" placeholder=' '
                                                        value={phoneNumber}
                                                        onChange={(e) => {
                                                            if (e.target.value.length > 10) return
                                                            setPhoneNumber(e.target.value)
                                                        }}
                                                    />
                                                    <label className='formLabel' htmlFor="Phone">رقم الجوال الجديد</label>
                                                </div>
                                                {isPhoneNumberError && <p className={styles.errorText}>الصيغة المدخلة غير صحيحة، فضلا اكتب الرقم بصيغة 05</p>}
                                                <div className={styles.submitBtnBox}>
                                                    <button className='primarySolidBtn flex items-center' disabled={!phoneNumber} type='submit' onClick={() => handleUpdateDetails('phone')}>{showLoader ? <Image src={loader} width={50} height={30} alt={'loader'} /> : ""} تحديث وحفظ </button>
                                                </div>
                                            </div>
                                            : sectionType == 'gender' ?
                                                <div className={styles.phoneContainer}>
                                                    <div className={styles.phoneTitleDiv} onClick={() => setSectionType('default')}>
                                                        <AllIconsComponenet height={17} width={10} iconName={'arrowRight'} color={'#000000'} />
                                                        <h3>تعديل الجنس</h3>
                                                    </div>
                                                    <div className={styles.genderBtnBox}>
                                                        <button className={`${styles.maleBtn} ${gender == "male" ? `${styles.genderActiveBtn}` : ''}`} onClick={() => setGender("male")}>
                                                            <AllIconsComponenet height={26} width={15} iconName={'male'} color={gender == "male" ? '#FFFFFF' : '#808080'} />
                                                            <span>ذكر</span>
                                                        </button>
                                                        <button className={`${styles.femaleBtn} ${gender == 'female' ? `${styles.genderActiveBtn}` : ''}`} onClick={() => setGender('female')}>
                                                            <AllIconsComponenet height={26} width={15} iconName={'female'} color={gender == "female" ? '#FFFFFF' : '#808080'} />
                                                            <span>أنثى</span>
                                                        </button>
                                                    </div>
                                                    <div className={styles.submitBtnBox}>
                                                        <button className='primarySolidBtn flex items-center' disabled={!gender} type='submit' onClick={() => handleUpdateDetails('gender')} >{showLoader ? <Image src={loader} width={50} height={30} alt={'loader'} /> : ""} حفظ </button>
                                                    </div>
                                                </div>
                                                : sectionType == 'email' ?
                                                    <div className={styles.phoneContainer}>
                                                        <div className={styles.phoneTitleDiv} onClick={() => setSectionType('default')}>
                                                            <AllIconsComponenet height={17} width={10} iconName={'arrowRight'} color={'#000000'} />
                                                            <h3>تحديث الايميل</h3>
                                                        </div>
                                                        <p className={`font-medium ${styles.existingDetailText}`}>الايميل الحالي: {userProfileData?.email}</p>
                                                        <div className={`formInputBox ${styles.passwordInputBox}`}>
                                                            <div className={styles.IconDiv}>
                                                                <AllIconsComponenet height={20} width={20} iconName={'email'} color={'#00000080'} />
                                                            </div>
                                                            <input className={`formInput ${storeData.googleLogin == true && `${styles.disableFormInput}`}`} id="email" type="email" name="email" title="Email" placeholder=' '
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                disabled={storeData.googleLogin == true}
                                                            />
                                                            <label className='formLabel' htmlFor="Phone">الايميل الجديد</label>
                                                        </div>
                                                        {isEmailError && <p className={styles.errorText}>Email is not valid</p>}
                                                        <div className={styles.submitBtnBox}>
                                                            <button className='primarySolidBtn flex items-center' type='submit' onClick={() => handleEmailNextBtn()} disabled={isEmailError || storeData.googleLogin == true}>{showLoader ? <Image src={loader} width={50} height={30} alt={'loader'} /> : ""} تحديث وحفظ</button>
                                                        </div>
                                                    </div>
                                                    : sectionType == 'password' ?
                                                        <div className={styles.phoneContainer}>
                                                            <div className={styles.phoneTitleDiv} onClick={() => setSectionType('default')}>
                                                                <AllIconsComponenet height={17} width={10} iconName={'arrowRight'} color={'#000000'} />
                                                                <h3>تأكيد كلمة السر</h3>
                                                            </div>
                                                            <p>دخل كلمة السر عشان تقدر تعدل ايميلك</p>
                                                            <div className={`formInputBox ${styles.passwordInputBox}`}>
                                                                <div className={styles.IconDiv}>
                                                                    <AllIconsComponenet height={18} width={16} iconName={'lock'} color={'#00000080'} />
                                                                </div>
                                                                <input className='formInput' id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} name="password" title="Password" placeholder=' ' />
                                                                <label className={`formLabel ${styles.formInputLable}`} htmlFor="Password">كلمة السر</label>
                                                                <div className={styles.passwordIconDiv}>
                                                                    {!showPassword ?
                                                                        <div onClick={() => setShowPassword(true)}>
                                                                            <AllIconsComponenet height={14} width={17} iconName={'visibilityIcon'} color={'##00008a'} />
                                                                        </div>
                                                                        :
                                                                        <div onClick={() => setShowPassword(false)}>
                                                                            <AllIconsComponenet height={14} width={17} iconName={'visibilityOffIcon'} color={'##00008a'} />
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                            {isPasswordError && <p className={styles.errorText}>يجب ان تحتوي على 8 احرف كحد ادنى، حرف واحد كبير على الاقل، رقم، وعلامة مميزة </p>}
                                                            <div className={styles.submitBtnBox}>
                                                                <button className='primarySolidBtn flex items-center' type='submit' onClick={() => handleCheckPassword()}>{showLoader ? <Image src={loader} width={50} height={30} alt={'loader'} /> : ""} تحديث وحفظ </button>
                                                            </div>
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
            </div>
        </>
    )
}