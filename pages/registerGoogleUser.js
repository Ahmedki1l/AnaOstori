import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import styles from '../styles/Login.module.scss'
import { useRouter } from 'next/router'
import { myCoursesAPI, updateProfile, viewProfileAPI } from '../services/apisService'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux'
import AllIconsComponenet from '../Icons/AllIconsComponenet'
import * as fbq from '../lib/fpixel'



export default function RegisterGoogleUser() {

    const [phoneNumber, setPhoneNumber] = useState("");
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [gender, setGender] = useState("")

    const [isGenderError, setIsGenderError] = useState(false);
    const [isPhoneNumberError, setIsPhoneNumberError] = useState(false);

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState(false);

    const [user, setUser] = useState();

    const router = useRouter();
    const dispatch = useDispatch();

    const storeData = useSelector((state) => state?.globalStore);

    const handleStoreUpdate = async (accessToken) => {
        try {
            const viewProfileReq = viewProfileAPI(accessToken)
            const getMyCourseReq = myCoursesAPI(accessToken)

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

    const regexEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

    const regexPassword = useMemo(() => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, []);

    const regexPhone = useMemo(() => /^(\+?\d{1,3}[- ]?)?\d{10}$/, []);


    useEffect(() => {

        if (firstName) {
            setFirstNameError(false)
        }

        if (lastName) {
            setLastNameError(false)
        }

        if (phoneNumber && !(phoneNumber.startsWith("05"))) {
            setIsPhoneNumberError(true)
            setPhoneNumberError(false)
        }
        else {
            setIsPhoneNumberError(false)
        }

    }, [firstName, lastName, phoneNumber, regexEmail, regexPassword, regexPhone])


    const handleUpdateProfile = async () => {

        if (!firstName) {
            setFirstNameError("فضلا ادخل اسمك الاول")
        }
        if (!lastName) {
            setLastNameError("فضلا ادخل اسم العائلة")
        }
        if (!gender) {
            setIsGenderError("فضلا اختر الجنس")
        }
        if (!phoneNumber) {
            setPhoneNumberError("رقم الجوال مطلوب")
        }

        if (firstName && lastName && phoneNumber && gender) {
            const body = {
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                gender: gender
            }

            const params = {
                data: body,
                accessToken: storeData?.accessToken
            }
            await updateProfile(params).then(res => {
                handleStoreUpdate(storeData?.accessToken)
                fbq.event('Sign up', { email: storeData.viewProfileData.email, phone: phoneNumber })
                router.push('/')
            }).catch(error => {
                toast.error(error)
                console.log("errors : ", error)
            });
        }
    }



    return (
        <div className={`relative ${styles.mainPage}`}>
            <div className={styles.loginFormDiv}>
                <h1 className={`fontBold ${styles.signUpPageHead}`}>إنشاء حساب</h1>
                <p className={`pb-2 ${styles.signUpPageSubText}`}>فضلا اكتب بياناتك بدقة، حيث ستٌعتمد وقت تسجيلك بالدورات</p>
                <div className='flex justify-between'>
                    <div>
                        <div className={`formInputBox ${styles.loginPageSmallInputBox}`}>
                            <div className='formInputIconDiv'>
                                <AllIconsComponenet height={19} width={16} iconName={'persone1'} color={'#00000080'} />
                            </div>
                            <input className={`formInput ${styles.loginFormInput}`} id='firstName' type="text" name='firstName' value={user?._tokenResponse?.firstName ? user?._tokenResponse?.firstName : firstName} onChange={(e) => setFirstName(e.target.value)} placeholder=' ' />
                            <label className={`formLabel ${styles.loginFormLabel}`} htmlFor="firstName">الاسم الاول</label>
                        </div>
                        {firstNameError ? <p className={styles.errorText}>{firstNameError}</p> : ""}
                    </div>
                    <div>
                        <div className={`formInputBox ${styles.loginPageSmallInputBox}`}>
                            <div className='formInputIconDiv'>
                                <AllIconsComponenet height={19} width={16} iconName={'persone1'} color={'#00000080'} />
                            </div>
                            <input className={`formInput ${styles.loginFormInput}`} type="text" name='lastName' id='lastName' value={user?._tokenResponse?.lastName ? user?._tokenResponse?.lastName : lastName} onChange={(e) => setLastName(e.target.value)} placeholder=' ' />
                            <label className={`formLabel ${styles.loginFormLabel}`} htmlFor="lastName">اسم العائلة</label>
                        </div>
                        {lastNameError ? <p className={styles.errorText}>{lastNameError}</p> : ""}
                    </div>
                </div>
                <div className={`formInputBox ${styles.radioBtnDiv}`}>
                    <p className={`pl-4 ${styles.genderText}`}>الجنس</p>
                    <input type="radio" name="gender" className={styles.radioBtns} id="maleGender" value="male" onChange={(e) => setGender(e.target.value)} />
                    <label className='pr-1 pl-4' htmlFor='maleGender'>ذكر</label>
                    <input type="radio" name="gender" className={styles.radioBtns} id="femaleGender" value="female" onChange={(e) => setGender(e.target.value)} />
                    <label className='pr-1' htmlFor="femaleGender">أنثى</label>
                </div>
                <div className='formInputBox'>
                    <div className='formInputIconDiv'>
                        <AllIconsComponenet height={19} width={16} iconName={'mobile'} color={'#00000080'} />
                    </div>
                    <input className={`formInput ${styles.loginFormInput}`} name='phoneNo' id='phoneNo' type="number" value={user?.user?.phoneNumber ? user?.user?.phoneNumber : phoneNumber} onChange={(e) => { if (e.target.value.length > 10) return; setPhoneNumber(e.target.value) }} placeholder=' ' />
                    <label className={`formLabel ${styles.loginFormLabel}`} htmlFor="phoneNo">رقم الجوال</label>
                </div>
                {isPhoneNumberError ? <p className={styles.errorText}>الصيغة المدخلة غير صحيحة، فضلا اكتب الرقم بصيغة 05</p> : phoneNumberError ? <p className={styles.errorText}>{phoneNumberError}</p> : ""}

                <div className={styles.loginBtnBox}>
                    <button className='primarySolidBtn' type='submit' onClick={() => handleUpdateProfile()}>انشاء حساب</button>
                </div>

                <p className={`fontMedium ${styles.gotoPageText}`} > عندك حساب؟ <Link href={'/login'} className="primarylink"> تسجيل الدخول</Link></p>
            </div>
        </div>
    )
}
