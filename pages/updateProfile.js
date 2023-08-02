import Image from 'next/image'
import loader from '../public/icons/loader.svg'
import loaderColor from '../public/icons/loaderColor.svg'
import styles from '../styles/updateProfile.module.scss'
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import Icon from '../components/CommonComponents/Icon';
import { updateProfile, uploadProfileImage, viewProfileAPI } from '../services/apisService';
import Router from "next/router";
import ProfilePicture from '../components/CommonComponents/ProfilePicture';
import { useDispatch, useSelector } from 'react-redux'
import { signOutUser } from '../services/fireBaseAuthService';
import { toastErrorMessage, toastSuccessMessage } from '../constants/ar';
import { mediaUrl } from '../constants/DataManupulation';


const UpdateProfile = () => {

    const storeData = useSelector((state) => state?.globalStore);

    const [firstName, setFirstName] = useState(storeData?.viewProfileData?.firstName)

    const [lastName, setLastName] = useState(storeData?.viewProfileData?.lastName)

    const [showLoader, setShowLoader] = useState(false);

    const [profileUrl, setProfileUrl] = useState(mediaUrl(storeData?.viewProfileData?.avatarBucket, storeData?.viewProfileData?.avatarKey));

    const [uploadLoader, setUploadLoader] = useState(false)

    const dispatch = useDispatch();


    useEffect(() => {
        setFirstName(storeData?.viewProfileData?.firstName);
        setLastName(storeData?.viewProfileData?.lastName)
        setProfileUrl(mediaUrl(storeData?.viewProfileData?.avatarBucket, storeData?.viewProfileData?.avatarKey))
    }, [storeData?.viewProfileData])

    const uploadPhoto = async (e) => {
        setUploadLoader(true)

        let formData = new FormData();
        formData.append("file", e.target.files[0]);

        const data = {
            formData,
            accessToken: storeData?.accessToken
        }

        await uploadProfileImage(data).then((response) => {
            setProfileUrl(mediaUrl(response?.data?.avatarBucket, response?.data?.avatarKey))
            setUploadLoader(false)
            toast.success(toastSuccessMessage.profilePictureUpdateMsg)
        }).catch((error) => {
            console.error("Error:", error)
            setUploadLoader(false)
            toast.success(toastErrorMessage.imageUploadFailedMsg)
            if (error?.response?.status == 401) {
                signOutUser()
                dispatch({
                    type: 'EMPTY_STORE'
                });
            }
        })
    };



    const handleSubmit = async (event) => {

        setShowLoader(true)
        event.preventDefault();

        const data = {
            firstName: firstName,
            lastName: lastName
        }

        const params = {
            data,
            accessToken: storeData?.accessToken
        }

        await updateProfile(params).then(async (res) => {
            toast.success(toastSuccessMessage.profileUpdateMsg)
            setShowLoader(false)
            await viewProfileAPI(storeData?.accessToken).then(res => {
                dispatch({
                    type: 'SET_PROFILE_DATA',
                    viewProfileData: res?.data,
                });
                Router.push('/myProfile')
            }).catch(error => {
                console.log(error);
            })
        }).catch(error => {
            toast.error(error)
            setShowLoader(false)
        });
    }



    return (
        <>
            <div className={`maxWidthDefault`}>
                <div className="p-4">
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className={`maxWidthDefault ${styles.updateProfileWrapper}`}>
                                <div>
                                    <ProfilePicture height={116} width={116} alt={'Profile Picture'} pictureKey={profileUrl} />
                                    <label className={styles.defaultText} style={uploadLoader ? { color: "#808080" } : { color: "#F26722" }} htmlFor="image">
                                        <span>   تغيير صورة الملف </span> {uploadLoader ? <Image src={loaderColor} width={20} height={15} alt="Loder Pictur" /> : ""}
                                    </label>
                                    <input style={{ display: "none" }} id="image" type="file" onChange={uploadPhoto}
                                    />
                                </div>
                                <div className={`${styles.loginPageInputBox} ${styles.loginPageSmallInputBox}`}>
                                    <div className={styles.loginPageIconDiv}>
                                        <Icon height={19} width={16} iconName={'person'} alt={'Persone Icon'} />
                                    </div>
                                    <input className={styles.inputBox} type="text" name='firstName' value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder='الاسم الاول' />
                                </div>
                                <div className={`${styles.loginPageInputBox} ${styles.loginPageSmallInputBox}`}>
                                    <div className={styles.loginPageIconDiv}>
                                        <Icon height={19} width={16} iconName={'person'} alt={'Persone Icon'} />
                                    </div>
                                    <input className={styles.inputBox} type="text" name='lastName' value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder='اسم العائلة' />
                                </div>
                                <div className={styles.loginBtnBox}>
                                    <button className={`primarySolidBtn ${styles.updateProfileBtn}`} name="submit" type='submit'>{showLoader ? <Image src={loader} width={50} height={30} alt="Loder Pictur" /> : ""} حفظ</button>
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