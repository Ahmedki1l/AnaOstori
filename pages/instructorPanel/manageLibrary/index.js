import React from 'react'
import { useSelector } from 'react-redux';
import Spinner from '../../../components/CommonComponents/spinner';

function Index() {
    const storeData = useSelector((state) => state?.globalStore);
    const isUserInstructor = storeData?.isUserInstructor
    return (
        <>
            {!isUserInstructor ?
                <div className='flex justify-center items-center'>
                    <Spinner />
                </div>
                :
                <div>ManageLibrary</div>

            }
        </>
    )
}

export default Index