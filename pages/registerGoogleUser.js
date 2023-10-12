import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import styles from '../styles/Login.module.scss'
import { useRouter } from 'next/router'
import { myCoursesAPI, updateProfile, viewProfileAPI } from '../services/apisService'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux'
import AllIconsComponenet from '../Icons/AllIconsComponenet'
import * as fbq from '../lib/fpixel'
import { inputErrorMessages } from '../constants/ar'



export default function RegisterGoogleUser() {

    const [phoneNumber, setPhoneNumber] = useState("");
    const [firstName, setFirstName] = useState("")
    const [gender, setGender] = useState("")


    const [firstNameError, setFirstNameError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [phoneNumberValidError, setPhoneNumberValidError] = useState('')

    const [showFirstNameError, setShowFirstNameError] = useState(false)
    const [showPhoneError, setShowPhoneError] = useState(false)


    const router = useRouter();
    const dispatch = useDispatch();

    const storeData = useSelector((state) => state?.globalStore);
    const handleStoreUpdate = async () => {
        try {
            const viewProfileReq = viewProfileAPI()
            const getMyCourseReq = myCoursesAPI()

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

    // useEffect(() => {

    //     if (firstName) {
    //         setFirstNameError('')
    //     } else {
    //         setFirstNameError(inputErrorMessages.firstNameErrorMsg);
    //     }

    //     if (phoneNumber && !(phoneNumber.startsWith("05"))) {
    //         setShowPhoneError(true)
    //         setPhoneNumberValidError(inputErrorMessages.mobileNumberFormatErrorMsg)
    //     }

    // }, [firstName, phoneNumber])


    useEffect(() => {
        if (firstName && (firstName.split(" ").length - 1) < 2) {
			setFirstNameError(inputErrorMessages.nameThreeFoldErrorMsg);
		}
		else{
			setFirstNameError(null)
		}

		if (phoneNumber && !(phoneNumber.startsWith("05"))) {
			setPhoneNumberError(inputErrorMessages.mobileNumberFormatErrorMsg)
		}
		else {
			setPhoneNumberError(null);
		}
    },[firstName,phoneNumber])



    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        if (!firstName) {
            setFirstNameError(inputErrorMessages.firstNameErrorMsg)   
        }
        else if ((firstName.split(" ").length - 1) < 2) {
            setFirstNameError(inputErrorMessages.nameThreeFoldErrorMsg)
           
        }
        if(!phoneNumber){
            setPhoneNumberError(inputErrorMessages.mobileRequiredErrorMsg)
        }
        else if (firstNameError == null && phoneNumberError == null){
            const body = {
                firstName: firstName,
                phone: phoneNumber ? phoneNumber.replace(/[0-9]/, "+966") : null,
                gender: gender
            }

            const params = {
                data: body,
            }
            await updateProfile(params).then(res => {
                handleStoreUpdate()
                fbq.event('Sign up', { email: storeData.viewProfileData.email, phone: phoneNumber })
                router.push('/')
            }).catch(error => {
                toast.error(error)
                console.log(error)
            });
        }
    }



    return (
        <div className={`relative ${styles.mainPage}`}>
            <div className={styles.loginFormDiv}>
                <h1 className={`fontBold ${styles.signUpPageHead}`}>خطوات بسيطة ويجهز حسابك 🥳</h1>
                <p className={`pb-2 ${styles.signUpPageSubText}`}>فضلا اكتب بياناتك بدقة، حيث ستٌعتمد وقت تسجيلك بالدورات</p>
                <form onSubmit={handleUpdateProfile}>
                    <div className={`formInputBox ${styles.formInputField}`}>
                        <div className='formInputIconDiv'>
                            <AllIconsComponenet height={19} width={16} iconName={'persone1'} color={'#00000080'} />
                        </div>
                        <input className={`formInput ${styles.loginFormInput}`} id='firstName' type="text" name='firstName' value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder=' ' />
                        <label className={`formLabel ${styles.loginFormLabel}`} htmlFor="firstName">الاسم الثلاثي</label>
                    </div>
                    {firstNameError !== null ? <p className={styles.errorText}>{firstNameError}</p> : <p className={styles.noteText}>مثال: هشام محمود خضر</p>}
                    <div className={`formInputBox ${styles.radioBtnDiv}`}>
                        <p className={`pl-4 ${styles.genderText}`}>الجنس</p>
                        <input type="radio" name="gender" className={styles.radioBtns} id="maleGender" value="male" onChange={(e) => setGender(e.target.value)} />
                        <label className='pr-1 pl-4' htmlFor='maleGender'>ذكر</label>
                        <input type="radio" name="gender" className={styles.radioBtns} id="femaleGender" value="female" onChange={(e) => setGender(e.target.value)} />
                        <label className='pr-1' htmlFor="femaleGender">أنثى</label>
                    </div>
                    <div className={`formInputBox ${styles.formInputField}`}>
                        <div className='formInputIconDiv'>
                            <AllIconsComponenet height={19} width={16} iconName={'mobile'} color={'#00000080'} />
                        </div>
                        <input className={`formInput ${styles.loginFormInput}`} name='phoneNo' id='phoneNo' type="number" value={phoneNumber} onChange={(e) => { if (e.target.value.length > 10) return; setPhoneNumber(e.target.value) }} placeholder=' ' />
                        <label className={`formLabel ${styles.loginFormLabel}`} htmlFor="phoneNo">رقم الجوال (اختياري)</label>
                    </div>
                    {phoneNumberError !== null ? <p className={styles.errorText}>{phoneNumberError}</p> : <p className={styles.noteText}>بصيغة 05xxxxxxxx</p>}
                    <div className={styles.loginBtnBox}>
                        <button className='primarySolidBtn' type='submit' disabled={(firstNameError || phoneNumberError || !firstName || !phoneNumber) ? true : false} >انشاء حساب</button>
                    </div>
                </form>
                <p className={`fontMedium ${styles.gotoPageText}`} > عندك حساب؟ <Link href={'/login'} className="primarylink"> تسجيل الدخول</Link></p>
            </div>
        </div>
    )
}
