import React from 'react'
import { Dialog, DialogContent } from '@mui/material';
import styles from './ModalForUpdateProfile.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { postAuthRouteAPI } from '../../services/apisService';
import { toast } from 'react-toastify';
import { getNewToken } from '../../services/fireBaseAuthService';
import { profileInfoUpdateReminderPopUpConst, updateProfileConst } from '../../constants/ar';

const StyledDialogContent = styled(DialogContent)`
    padding: 14px !important;
`

function ModalForUpdateProfile(props) {

    const { open, setUpdateProfileModalOpen } = props;
    const router = useRouter();
    const dispatch = useDispatch();
    const storeData = useSelector((state) => state?.globalStore);
    const reminderPopup = storeData?.viewProfileData?.reminderPopUpAttempt;
    let count = reminderPopup === null ? 1 : reminderPopup + 1;

    const handleContentClick = (event) => {
        event.stopPropagation();
    };

    const handleUpdateInfo = () => {
        setUpdateProfileModalOpen(false);
        router.push('/updateProfile')
    }

    const handleSkipInfo = async () => {
        setUpdateProfileModalOpen(false);
        let params = {
            routeName: 'updateProfileHandler',
            reminderPopUpAttempt: count
        };
        await postAuthRouteAPI(params).then(async (res) => {
            toast.success(updateProfileConst.profileUpdateMsg, { rtl: true, })
            dispatch({
                type: 'SET_PROFILE_DATA',
                viewProfileData: res?.data,
            });
            router.push('/myProfile')
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postAuthRouteAPI(params).then(async (res) => {
                        toast.success(updateProfileConst.profileUpdateMsg, { rtl: true, })
                        dispatch({
                            type: 'SET_PROFILE_DATA',
                            viewProfileData: res?.data,
                        });
                        router.push('/myProfile')
                    })
                })
            }
            toast.error(error, { rtl: true, })
            setShowLoader(false)
        });
    }

    return (
        <Dialog open={open} onClick={() => setUpdateProfileModalOpen(false)} dir='rtl' >
            <StyledDialogContent className={styles.reminderPopup} onClick={handleContentClick}>
                <div style={{ direction: 'ltr' }}>
                    <CloseIcon style={{ position: 'inherit' }} className={`cursor-pointer ${styles.closeIconWrapper}`} onClick={() => setUpdateProfileModalOpen(false)} />
                </div>
                <div className='mt-6'>
                    <div className='text-center text-2xl' >
                        <p>{profileInfoUpdateReminderPopUpConst.modalHeaderText}</p>
                    </div>
                    <div className='flex items-center w-full gap-4'>
                        <div className={`${styles.buttonModalDiv} flex justify-center items-center`} onClick={() => handleUpdateInfo()}>
                            <button className={`primarySolidBtn ${styles.cancelBtn}`} >{profileInfoUpdateReminderPopUpConst.updateInfoBtnText}</button>
                        </div>
                        <div className={`${styles.buttonModalDiv} flex justify-center items-center`} onClick={() => handleSkipInfo()}>
                            <button className={`primarySolidBtn ${styles.cancelBtn}`} >{profileInfoUpdateReminderPopUpConst.s}</button>
                        </div>
                    </div>
                </div>
            </StyledDialogContent>
        </Dialog>
    )
}

export default ModalForUpdateProfile;