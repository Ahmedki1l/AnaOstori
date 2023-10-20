import React, { useEffect, useMemo, useState } from 'react'
import styles from '../styles/Login.module.scss'
import AllIconsComponenet from '../Icons/AllIconsComponenet'
import { inputErrorMessages } from '../constants/ar'
import { useSelector } from 'react-redux'
import { getAuthRouteAPI, postAuthRouteAPI } from '../services/apisService'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import * as fbq from '../lib/fpixel'
import { useRouter } from 'next/router'

export default function RegisterWithGoogleAndApple() {

    const [fullName, setFullName] = useState("")
    const [gender, setGender] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("");
    const [fullNameError, setFullNameError] = useState("");
    const [genderError, setGenderError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const dispatch = useDispatch();
    const regexPhone = useMemo(() => /^(\+?\d{1,3}[- ]?)?\d{10}$/, []);

    useEffect(() => {
        if (fullName && (fullName.split(" ").length - 1) < 2) {
            setFullNameError(inputErrorMessages.nameThreeFoldErrorMsg);
        } else {
            setFullNameError(null)
        }
        if (phoneNumber && !(phoneNumber.startsWith("05"))) {
            setPhoneNumberError(inputErrorMessages.mobileNumberFormatErrorMsg)
        } else {
            setPhoneNumberError(null);
        }
        if (gender) {
            setGenderError(null)
        }

    }, [fullName, phoneNumber, gender, regexPhone])

    const storeData = useSelector((state) => state?.globalStore);

    const handleStoreUpdate = async () => {
        try {
            const viewProfileReq = getAuthRouteAPI({ routeName: "viewProfile" })
            const getMyCourseReq = getAuthRouteAPI({ routeName: 'myCourses' })

            const [viewProfileData, myCourseData] = await Promise.all([
                viewProfileReq, getMyCourseReq
            ])
            dispatch({
                type: 'SET_ALL_MYCOURSE',
                myCourses: myCourseData?.data,
            });
            dispatch({
                type: 'SET_PROFILE_DATA',
                viewProfileData: viewProfileData?.data,
            });
            dispatch({
                type: 'IS_USER_INSTRUCTOR',
                isUserInstructor: viewProfileData?.data?.role === 'instructor' ? true : false,
            });

        } catch (error) {
            console.log(error);
        }
    }

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!fullName) {
            setFullNameError(inputErrorMessages.fullNameErrorMsgForRegister)
        } else if (fullName && (fullName.split(" ").length - 1) < 2) {
            setFullNameError(inputErrorMessages.nameThreeFoldErrorMsg);
        }
        if (!gender) {
            setGenderError(inputErrorMessages.genderErrorMsg);
        }
        if (!fullNameError && !genderError && !phoneNumberError) {
            setLoading(true)
            let data = {
                fullName: fullName,
                gender: gender,
                phoneNumber: phoneNumber
            }
            const params = {
                routeName: 'updateProfileHandler',
                ...data,
            }
            await postAuthRouteAPI(params).then(async (res) => {
                handleStoreUpdate()
                fbq.event('Sign up', { email: storeData.viewProfileData.email, phone: phoneNumber })
                router.push('/')
                setLoading(false)
            }).catch(async (error) => {
                toast.error(error, { rtl: true, })
                console.log(error)
                setLoading(false)
            });
        }
    }

    return (
        <div className={`relative ${styles.mainPage}`}>
            <div className={styles.loginFormDiv}>
                <h1 className={`fontBold ${styles.signUpPageHead}`}>خطوات بسيطة ويجهز حسابك 🥳</h1>
                <p className={`p-2 ${styles.signUpPageSubText}`}>اكتب بياناتك بدقة، لأننا حنعتمدها وقت ما تسجل بالدورات</p>
                <div className='flex'>
                    <p style={{ color: 'red' }} >ملاحظة :</p>
                    <p className='mr-2'> جميع البيانات مطلوبة ما عدا رقم الجوال  </p>
                </div>
                <div className={`formInputBox`}>
                    <div className='formInputIconDiv'>
                        <AllIconsComponenet height={24} width={24} iconName={'newPersonIcon'} color={'#808080'} />
                    </div>
                    <input className={`formInput ${fullNameError ? `${styles.inputError}` : `${styles.loginFormInput}`}`} id='fullName' type="text" name='fullName' value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder=' ' />
                    <label className={`formLabel ${fullNameError ? `${styles.inputPlaceHoldererror}` : `${styles.loginFormLabel}`}`} htmlFor="fullName">الاسم الثلاثي</label>
                </div>
                {fullNameError ? <p className={styles.errorText}>{fullNameError}</p> : ""}
                <div>
                    <p className={styles.titleLabel}>الجنس</p>
                    <div className={genderError ? `${styles.inputErrorBox}` : `${styles.genderBtnBox}`} >
                        <button className={`${styles.maleBtn} ${gender == "male" ? `${styles.genderActiveBtn}` : `${styles.genderNotActiveBtn}`}`} onClick={(e) => { e.preventDefault(); setGender("male") }}>
                            <AllIconsComponenet height={26} width={15} iconName={'male'} color={gender == "male" ? '#F26722 ' : '#808080'} />
                            <span>ذكر</span>
                        </button>
                        <button className={`${styles.femaleBtn} ${gender == 'female' ? `${styles.genderActiveBtn}` : 'border-none'}`} onClick={(e) => { e.preventDefault(); setGender('female') }}>
                            <AllIconsComponenet height={26} width={15} iconName={'female'} color={gender == "female" ? '#F26722 ' : '#808080'} />
                            <span>أنثى</span>
                        </button>
                    </div>
                </div>
                {gender == '' ? <p className={styles.errorText}>{genderError}</p> : ""}
                <div className='formInputBox'>
                    <div className='formInputIconDiv'>
                        <AllIconsComponenet height={24} width={24} iconName={'newMobileIcon'} color={'#808080'} />
                    </div>
                    <input className={`formInput ${styles.loginFormInput}`} name='phoneNo' id='phoneNo' type="number" value={phoneNumber} onChange={(e) => { if (e.target.value.length > 10) return; setPhoneNumber(e.target.value) }} placeholder=' ' />
                    <label className={`formLabel ${styles.loginFormLabel}`} htmlFor="phoneNo">رقم الجوال (اختياري)</label>
                </div>
                {phoneNumberError ?
                    <p className={styles.errorText}>{phoneNumberError}</p>
                    :
                    <p className={styles.passwordHintMsg}>بصيغة 05xxxxxxxx</p>}
                <div className={styles.loginBtnBox}>
                    <button className='primarySolidBtn' type='submit' onClick={handleSignIn} disabled={loading}>تسجيل الدخول</button>
                </div>
            </div>
        </div>
    )
}