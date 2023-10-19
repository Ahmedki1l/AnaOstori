import Image from 'next/image'
import loader from '../public/icons/loader.svg'
import loaderColor from '../public/icons/loaderColor.svg'
import styles from '../styles/updateProfile.module.scss'
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import { postAuthRouteAPI, uploadProfileImage } from '../services/apisService';
import Router, { useRouter } from "next/router";
import ProfilePicture from '../components/CommonComponents/ProfilePicture';
import { useDispatch, useSelector } from 'react-redux'
import { signOutUser } from '../services/fireBaseAuthService';
import { inputErrorMessages, toastErrorMessage, toastSuccessMessage } from '../constants/ar';
import { mediaUrl } from '../constants/DataManupulation';
import AllIconsComponenet from '../Icons/AllIconsComponenet';


const UpdateProfile = () => {
    const storeData = useSelector((state) => state?.globalStore);
    const [fullName, setFullName] = useState(storeData?.viewProfileData?.fullName)


    const [showLoader, setShowLoader] = useState(false);

    const [profileUrl, setProfileUrl] = useState(storeData?.viewProfileData?.avatarKey == null ? storeData?.viewProfileData?.avatar : mediaUrl(storeData?.viewProfileData?.avatarBucket, storeData?.viewProfileData?.avatarKey));

    const [uploadLoader, setUploadLoader] = useState(false)
    const [gender, setGender] = useState(storeData?.viewProfileData?.gender);

    const [fullNameError, setFullNameError] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(storeData?.viewProfileData?.phone?.replace('966', '0'));
    const [phoneNumberError, setPhoneNumberError] = useState(null);

    const dispatch = useDispatch();
    const router = useRouter()
    // useEffect(() => {
    //     setFullName(storeData?.viewProfileData?.fullName);
    //     if (storeData?.viewProfileData?.phone) {
    //         setPhoneNumber(storeData?.viewProfileData?.phone.replace('966', '0'));
    //     }
    //     setProfileUrl(storeData?.viewProfileData?.avatarKey == null ? storeData?.viewProfileData?.avatar : mediaUrl(storeData?.viewProfileData?.avatarBucket, storeData?.viewProfileData?.avatarKey))
    // }, [storeData?.viewProfileData])

    const uploadPhoto = async (e) => {
        setUploadLoader(true)

        let formData = new FormData();
        formData.append("file", e.target.files[0]);

        const data = {
            formData,
        }

        await uploadProfileImage(data).then((response) => {
            setProfileUrl(mediaUrl(response?.data?.avatarBucket, response?.data?.avatarKey))
            setUploadLoader(false)
        }).catch((error) => {
            console.error("Error:", error)
            setUploadLoader(false)
            toast.success(toastErrorMessage.imageUploadFailedMsg, { rtl: true, })
            if (error?.response?.status == 401) {
                signOutUser()
                dispatch({
                    type: 'EMPTY_STORE'
                });
                dispatch({
                    type: 'SET_RETURN_URL',
                    returnUrl: router.pathname
                })
            }
        })
    };


    useEffect(() => {
        if (fullName && (fullName.split(" ").length - 1) < 2) {
            setFullNameError(inputErrorMessages.nameThreeFoldErrorMsg);
        }
        else {
            setFullNameError(null)
        }

        if (phoneNumber && !(phoneNumber.startsWith("05"))) {
            setPhoneNumberError(inputErrorMessages.mobileNumberFormatErrorMsg)
        }
        else {
            setPhoneNumberError(null);
        }
    }, [fullName, phoneNumber])


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!fullName) {
            setFullNameError(inputErrorMessages.fullNameErrorMsg)
        }
        else if ((fullName.split(" ").length - 1) < 2) {
            setFullNameError(inputErrorMessages.nameThreeFoldErrorMsg)

        }
        if (!phoneNumber) {
            setPhoneNumberError(inputErrorMessages.mobileRequiredErrorMsg)
        }
        else if (fullNameError == null && phoneNumberError == null) {
            if (!fullName) return
            setShowLoader(true)

            const data = {
                fullName: fullName,
                phone: phoneNumber && phoneNumber.replace(/[0-9]/, '+966'),
                gender: gender
            }

            if (!phoneNumber?.length) {
                delete data.phoneNumber;
            }

            const params = {
                routeName: 'updateProfileHandler',
                ...data,
            }
            await postAuthRouteAPI(params).then(async (res) => {
                toast.success(toastSuccessMessage.profileUpdateMsg, { rtl: true, })
                setShowLoader(false)
                dispatch({
                    type: 'SET_PROFILE_DATA',
                    viewProfileData: res?.data,
                });
                Router.push('/myProfile')
            }).catch(error => {
                toast.error(error, { rtl: true, })
                setShowLoader(false)
            });
        }
    }



    return (
        <>
            <div className={`maxWidthDefault`}>
                <div className="p-4">
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className={`maxWidthDefault ${styles.updateProfileWrapper}`}>
                                <ProfilePicture height={116} width={116} alt={'Profile Picture'} pictureKey={profileUrl} />
                                <label className={styles.defaultText} style={uploadLoader ? { color: "#808080" } : { color: "#F26722" }} htmlFor="image">
                                    <span>تغيير الصورة الشخصية</span> {uploadLoader ? <Image src={loaderColor} width={20} height={15} alt="Loder Picture" /> : ""}
                                </label>
                                <input style={{ display: "none" }} id="image" type="file" onChange={uploadPhoto}
                                />
                                <div className='w-full'>
                                    <p className={styles.notePara}><span>ملاحظة:</span> جميع البيانات مطلوبة ما عدا الصورة الشخصية</p>
                                </div>
                                <div className='w-full'>
                                    <div className={`formInputBox ${styles.formFieldDiv}`}>
                                        <div className={`formInputIconDiv ${styles.iconDiv}`}>
                                            <AllIconsComponenet height={19} width={16} iconName={'persone1'} color={'#00000080'} />
                                        </div>
                                        <input className={fullNameError ? `formInput ${styles.formFieldInputError}` : `formInput ${styles.formFieldInput}`} name='fullName' id='fullName' value={fullName} onChange={(e) => { setFullName(e.target.value) }} placeholder=' ' />
                                        <label className={fullNameError ? `formLabel ${styles.formFieldLabelError}` : `formLabel ${styles.formFieldLabel}`} htmlFor="fullName">الاسم الثلاثي</label>
                                    </div>
                                    {fullNameError !== null ? <p className={styles.errorText}>{fullNameError}</p> : <p className={styles.noteText}>مثال: هشام محمود خضر</p>}
                                </div>
                                <div className='w-full'>
                                    <div className={`formInputBox ${styles.formFieldDiv}`}>
                                        <div className={`formInputIconDiv ${styles.iconDiv}`}>
                                            <AllIconsComponenet height={19} width={16} iconName={'mobile'} color={'#00000080'} />
                                        </div>
                                        <input className={phoneNumberError ? `formInput ${styles.formFieldInputError}` : `formInput ${styles.formFieldInput}`} name='phoneNo' id='phoneNo' type="number" value={phoneNumber} onChange={(e) => { if (e.target.value.length > 10) return; setPhoneNumber(e.target.value) }} placeholder=' ' />
                                        <label className={phoneNumberError ? `formLabel ${styles.formFieldLabelError}` : `formLabel ${styles.formFieldLabel}`} htmlFor="phoneNo">رقم الجوال</label>
                                    </div>
                                    {phoneNumberError !== null ? <p className={styles.errorText}>{phoneNumberError}</p> : <p className={styles.noteText}>بصيغة 05xxxxxxxx</p>}
                                </div>
                                <div className='w-full'>
                                    <p className={styles.titleLabel}>الجنس</p>
                                    <div className={styles.genderBtnBox}>
                                        <button className={`${styles.maleBtn} ${gender == "male" ? `${styles.genderActiveBtn}` : ''}`} onClick={(e) => { e.preventDefault(); setGender("male") }}>
                                            <AllIconsComponenet height={26} width={15} iconName={'male'} color={gender == "male" ? '#FFFFFF' : '#808080'} />
                                            <span>ذكر</span>
                                        </button>
                                        <button className={`${styles.femaleBtn} ${gender == 'female' ? `${styles.genderActiveBtn}` : ''}`} onClick={(e) => { e.preventDefault(); setGender('female') }}>
                                            <AllIconsComponenet height={26} width={15} iconName={'female'} color={gender == "female" ? '#FFFFFF' : '#808080'} />
                                            <span>أنثى</span>
                                        </button>
                                    </div>
                                </div>

                                {/* <div className={`${styles.loginPageInputBox} ${styles.loginPageSmallInputBox}`}>
                                    <div className={styles.loginPageIconDiv}>
                                        <Icon height={19} width={16} iconName={'person'} alt={'Persone Icon'} />
                                    </div>
                                    <input className={styles.inputBox} type="text" name='lastName' value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder='اسم العائلة' />
                                </div> */}
                                <div className={styles.loginBtnBox}>
                                    <button className={`primarySolidBtn ${styles.updateProfileBtn}`} name="submit" type='submit'>{showLoader ? <Image src={loader} width={50} height={30} alt="Loder Picture" /> : ""} حفظ</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateProfile;