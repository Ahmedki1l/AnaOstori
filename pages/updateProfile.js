import Image from 'next/image'
import loader from '../public/icons/loader.svg'
import loaderColor from '../public/icons/loaderColor.svg'
import styles from '../styles/updateProfile.module.scss'
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from 'react';
import { getRouteAPI, postAuthRouteAPI, uploadProfileImage } from '../services/apisService';
import Router, { useRouter } from "next/router";
import ProfilePicture from '../components/CommonComponents/ProfilePicture';
import { useDispatch, useSelector } from 'react-redux'
import { getNewToken, signOutUser } from '../services/fireBaseAuthService';
import { inputErrorMessages, toastErrorMessage, toastSuccessMessage, updateProfileConst } from '../constants/ar';
import { mediaUrl } from '../constants/DataManupulation';
import AllIconsComponenet from '../Icons/AllIconsComponenet';

const educationalLevelList = [
    { value: 'first_secondary_school', label: 'أول ثانوي' },
    { value: 'second_secondary_school', label: 'ثاني ثانوي' },
    { value: 'third_secondary_school', label: 'ثالث ثانوي' },
    { value: 'other', label: 'أخرى' }
];

const UpdateProfile = () => {

    const storeData = useSelector((state) => state?.globalStore);
    const [fullName, setFullName] = useState(storeData?.viewProfileData?.fullName)
    const [showLoader, setShowLoader] = useState(false);
    const [profileUrl, setProfileUrl] = useState(storeData?.viewProfileData?.avatarKey == null ? storeData?.viewProfileData?.avatar : mediaUrl(storeData?.viewProfileData?.avatarBucket, storeData?.viewProfileData?.avatarKey));
    const [uploadLoader, setUploadLoader] = useState(false)
    const [gender, setGender] = useState(storeData?.viewProfileData?.gender);
    const [fullNameError, setFullNameError] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(storeData?.viewProfileData?.phone?.replace('966', '0'));
    const [parentPhoneNo, setParentPhoneNumber] = useState(storeData?.viewProfileData?.parentsContact?.replace('+966', '0') || null);
    const [phoneNumberError, setPhoneNumberError] = useState(null);
    const [parentPhoneNumberError, setParentPhoneNumberError] = useState(null);
    const [isGenderError, setIsGenderError] = useState(null);
    const [selectedCity, setSelectedCity] = useState(storeData?.viewProfileData?.city);
    const [selectedEducationLevel, setSelectedEducationLevel] = useState(storeData?.viewProfileData?.educationLevel);
    const dropdownRef = useRef(null);
    const [isOpenForCity, setIsOpenForCity] = useState(false);
    const [isOpenForEducationLevel, setIsOpenForEducationLevel] = useState(false);
    const [citiesList, setCitiesList] = useState('')
    const [otherEducationLevel, setOtherEducationLevel] = useState(false);
    const [otherEducation, setOtherEducation] = useState('');

    const initialState = {
        fullName: storeData?.viewProfileData?.fullName,
        phoneNumber: storeData?.viewProfileData?.phone?.replace('966', '0'),
        gender: storeData?.viewProfileData?.gender,
        parentPhoneNo: storeData?.viewProfileData?.parentsContact?.replace('+966', '0'),
        selectedCity: storeData?.viewProfileData?.city,
        selectedEducationLevel: storeData?.viewProfileData?.educationLevel,
        reminderPopUpAttempt: storeData?.viewProfileData?.reminderPopUpAttempt
    }
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        getCityList()
    }, [])

    const getCityList = async () => {
        await getRouteAPI({ routeName: 'listCity' }).then((res) => {
            const formattedData = res?.data?.sort((a, b) => parseInt(a.code) - parseInt(b.code)).map(item => ({
                value: item.nameAr,
                label: item.nameAr,
                key: item.id,
                cityCode: item.code
            }));
            formattedData?.push({ value: 'other', label: 'أخرى', value: 'other' });
            setCitiesList(formattedData);
        }).catch((error) => {
            console.log(error);
        });
    }

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
        } else {
            setFullNameError(null)
        }
        if (phoneNumber && !(phoneNumber.startsWith("05"))) {
            setPhoneNumberError(inputErrorMessages.mobileNumberFormatErrorMsg)
        } else if (phoneNumber && phoneNumber.length < 10) {
            setPhoneNumberError(inputErrorMessages.phoneNumberLengthMsg)
        } else {
            setPhoneNumberError(null);
        }
        if (parentPhoneNo && !(parentPhoneNo.startsWith("05"))) {
            setParentPhoneNumberError(inputErrorMessages.mobileNumberFormatErrorMsg)
        } else if (parentPhoneNo && parentPhoneNo.length < 10) {
            setParentPhoneNumberError(inputErrorMessages.phoneNumberLengthMsg)
        } else {
            setParentPhoneNumberError(null);
        }
        if (gender) {
            setIsGenderError(null)
        }
    }, [fullName, phoneNumber, gender, parentPhoneNo])

    const toggleDropdownforCities = () => {
        setIsOpenForCity(!isOpenForCity);
    };
    const toggleDropdownForEducationLevel = () => {
        setIsOpenForEducationLevel(!isOpenForEducationLevel);
    }
    const handleSelectEducationLevel = (obj) => {
        if (obj.value == 'other') {
            setSelectedEducationLevel(obj.label);
            setOtherEducationLevel(true);
            setIsOpenForEducationLevel(false);
        } else {
            setSelectedEducationLevel(obj.label);
            setIsOpenForEducationLevel(false);
            setOtherEducationLevel(false);
        }
    }
    const handleSelectCity = (city) => {
        setSelectedCity(city.label);
        setIsOpenForCity(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (showLoader) return
        if (!fullName) {
            setFullNameError(inputErrorMessages.fullNameErrorMsgForRegister);
        } else if ((fullName.split(" ").length - 1) < 2) {
            setFullNameError(inputErrorMessages.nameThreeFoldErrorMsg);
        } else {
            setFullNameError(null);
        }
        if (!phoneNumber) {
            setPhoneNumberError(inputErrorMessages.mobileRequiredErrorMsg);
        } else if (phoneNumber && phoneNumber.length < 10 || phoneNumber && !(phoneNumber.startsWith("05"))) {
            setPhoneNumberError(inputErrorMessages.mobileNumberFormatErrorMsg);
        } else {
            setPhoneNumberError(null);
        }
        if (!gender) {
            setIsGenderError(inputErrorMessages.genderErrorMsg);
        } else {
            setIsGenderError(null)
        }
        if ((!phoneNumber || phoneNumberError) || (!fullName || fullNameError) || (!gender || isGenderError)) {
            return
        }
        if (JSON.stringify(initialState) === JSON.stringify({ fullName, phoneNumber, gender, parentPhoneNo, selectedCity, selectedEducationLevel })) {
            if (router.asPath !== storeData?.returnUrl) {
                router.push(storeData?.returnUrl);
            }
            else {
                router.push('/myProfile')
            }
        } else {
            setShowLoader(true)
            const data = {
                fullName: fullName,
                phone: phoneNumber && phoneNumber.replace(/[0-9]/, '+966'),
                gender: gender,
                parentsContact: parentPhoneNo ? parentPhoneNo.replace(/[0-9]/, '+966') : null,
                city: selectedCity ? selectedCity : null,
                educationLevel: selectedEducationLevel ? selectedEducationLevel : null,
                reminderPopUpAttempt: storeData?.viewProfileData?.reminderPopUpAttempt
            }
            if (Object.values(data).every((val) => val !== null)) {
                data.reminderPopUpAttempt = 3
            }
            console.log('data', data);
            const params = {
                routeName: 'updateProfileHandler',
                ...data,
            }
            setShowLoader(false)
            await postAuthRouteAPI(params).then(async (res) => {
                toast.success(updateProfileConst.profileUpdateMsg, { rtl: true, })
                setShowLoader(false)
                dispatch({
                    type: 'SET_PROFILE_DATA',
                    viewProfileData: res?.data,
                });
                if (router.asPath !== storeData?.returnUrl) {
                    router.push(storeData?.returnUrl);
                }
                else {
                    router.push('/myProfile')
                }
            }).catch(async (error) => {
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await postAuthRouteAPI(params).then(async (res) => {
                            toast.success(updateProfileConst.profileUpdateMsg, { rtl: true, })
                            setShowLoader(false)
                            dispatch({
                                type: 'SET_PROFILE_DATA',
                                viewProfileData: res?.data,
                            });
                            if (router.asPath !== storeData?.returnUrl) {
                                router.push(storeData?.returnUrl);
                            }
                            else {
                                router.push('/myProfile')
                            }
                        })
                    })
                }
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
                                    <div className={`formInputBox `}>
                                        <div className={`formInputIconDiv `}>
                                            <AllIconsComponenet height={24} width={24} iconName={'newPersonIcon'} color={'#00000080'} />
                                        </div>
                                        <input className={`formInput  ${styles.loginFormInput}  ${fullNameError && `${styles.inputError}`}`} id='fullName' type="text" name='fullName' value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder=' ' />
                                        <label className={`formLabel  ${styles.loginFormLabel} ${fullNameError && `${styles.inputPlaceHoldererror}`}`} htmlFor="fullName">{updateProfileConst.fullnamePlaceHolder}</label>
                                    </div>
                                    {fullNameError !== null ? <p className={styles.errorText}>{fullNameError}</p> : <p className={styles.noteText}>{updateProfileConst.fullNameHintMsg}</p>}
                                </div>
                                <div className='w-full'>
                                    <div className={`formInputBox`}>
                                        <div className={`formInputIconDiv`}>
                                            <AllIconsComponenet height={24} width={24} iconName={'newMobileIcon'} color={'#00000080'} />
                                        </div>
                                        <input className={`formInput ${styles.loginFormInput}  ${phoneNumberError && styles.inputError}`} name='phoneNo' inputMode='tel' id='phoneNo' type="number" value={phoneNumber} onChange={(e) => { if (e.target.value.length > 10) return; setPhoneNumber(e.target.value) }} placeholder=' ' />
                                        <label className={`formLabel  ${styles.loginFormLabel} ${phoneNumberError && styles.inputPlaceHoldererror}`} htmlFor="phoneNo">{updateProfileConst.phoneNumberPlaceHolder}</label>
                                    </div>
                                    {phoneNumberError ? <p className={styles.errorText}>{phoneNumberError}</p> : <p className={styles.noteText}>{inputErrorMessages.phoneNoFormateMsg}</p>}
                                </div>
                                <div className='w-full'>
                                    <div className={`formInputBox`}>
                                        <div className={`formInputIconDiv`}>
                                            <AllIconsComponenet height={24} width={24} iconName={'newMobileIcon'} color={'#00000080'} />
                                        </div>
                                        <input className={`formInput ${styles.loginFormInput}  ${parentPhoneNumberError && styles.inputError}`} name='parentPhoneNo' inputMode='tel' id='parentPhoneNo' type="number" value={parentPhoneNo} onChange={(e) => { if (e.target.value.length > 10) return; setParentPhoneNumber(e.target.value) }} placeholder=' ' />
                                        <label className={`formLabel  ${styles.loginFormLabel} ${parentPhoneNumberError && styles.inputPlaceHoldererror}`} htmlFor="parentPhoneNo">{updateProfileConst.parentPhoneNumberPlaceHolder}</label>
                                    </div>
                                    {parentPhoneNumberError ? <p className={styles.errorText}>{parentPhoneNumberError}</p> : <p className={styles.noteText}>{inputErrorMessages.phoneNoFormateMsg}</p>}
                                </div>

                                <div className='formInputBox'>
                                    <div className='formInputIconDiv'>
                                        <AllIconsComponenet height={30} width={20} iconName={'graduate'} color={'#808080'} />
                                    </div>
                                    <div className="selectContainer" ref={dropdownRef}>
                                        <div className={`customDropdown ${isOpenForEducationLevel ? 'open' : ''}`} onClick={toggleDropdownForEducationLevel}>
                                            <div className="pr-8">
                                                {selectedEducationLevel || 'اختار السنة الدراسية'}
                                            </div>
                                            <div className="icon pl-2 pt-2">
                                                <AllIconsComponenet height={8} width={14} iconName={'dropDown'} color={'#808080'} />
                                            </div>
                                        </div>
                                        {isOpenForEducationLevel && (
                                            <ul className="dropdownMenu">
                                                {educationalLevelList.map(educationLevel => (
                                                    <li key={educationLevel.value} onClick={() => handleSelectEducationLevel(educationLevel)} className="dropdownMenuItem">
                                                        {educationLevel.label}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                {otherEducationLevel &&
                                    <div className='formInputBox'>
                                        <div className='formInputIconDiv'>
                                            <AllIconsComponenet height={24} width={24} iconName={'graduate'} color={'#808080'} />
                                        </div>
                                        <input className={`formInput ${styles.loginFormInput}`} name='educationLevel' id='educationLevel' type="text" value={otherEducation} onChange={(e) => setOtherEducation(e.target.value)} placeholder=' ' />
                                        <label className={`formLabel ${styles.loginFormLabel}`} htmlFor="educationLevel">السنة الدراسية</label>
                                    </div>
                                }

                                <div className='formInputBox'>
                                    <div className='formInputIconDiv'>
                                        <AllIconsComponenet height={30} width={20} iconName={'location'} color={'#808080'} />
                                    </div>
                                    <div className="selectContainer" ref={dropdownRef}>
                                        <div className={`customDropdown ${isOpenForCity ? 'open' : ''}`} onClick={toggleDropdownforCities}>
                                            <div className="pr-8">
                                                {selectedCity || 'ادخل المدينة والحي'}
                                            </div>
                                            <div className="icon pl-2 pt-2">
                                                <AllIconsComponenet height={8} width={14} iconName={'dropDown'} color={'#808080'} />
                                            </div>
                                        </div>
                                        {isOpenForCity && (
                                            <ul className="dropdownMenu">
                                                {citiesList.map(city => (
                                                    <li key={city.value} onClick={() => handleSelectCity(city)} className="dropdownMenuItem">
                                                        {city.label}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div className='w-full'>
                                    <p className={styles.titleLabel}>الجنس</p>
                                    <div className={`${styles.genderBtnBox} ${isGenderError && `${styles.inputErrorBox}`}`} >
                                        <button className={`${styles.maleBtn} ${gender == "male" ? `${styles.genderActiveBtn}` : `${styles.genderNotActiveBtn}`}`} onClick={(e) => { e.preventDefault(); setGender("male") }}>
                                            <AllIconsComponenet height={24} width={24} iconName={'newMaleIcon'} color={gender == "male" ? '#F26722 ' : '#808080'} />
                                            <span>ذكر</span>
                                        </button>
                                        <button className={`${styles.femaleBtn} ${gender == 'female' ? `${styles.genderActiveBtn}` : 'border-none'}`} onClick={(e) => { e.preventDefault(); setGender('female') }}>
                                            <AllIconsComponenet height={24} width={24} iconName={'newFemaleIcon'} color={gender == "female" ? '#F26722 ' : '#808080'} />
                                            <span>أنثى</span>
                                        </button>
                                    </div>
                                    {isGenderError && <p className={styles.errorText}>{isGenderError}</p>}
                                </div>
                                <div className={styles.loginBtnBox}>
                                    <button className={`primarySolidBtn ${styles.updateProfileBtn}`} name="submit" type='submit'>{showLoader ? <Image src={loader} width={40} height={25} alt="Loder Picture" /> : ""} حفظ</button>
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