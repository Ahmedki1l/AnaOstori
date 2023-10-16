import React, { useState } from 'react'
import styles from '../../../styles/InstructorPanelStyleSheets/ManageInstructor.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import ModelForAddInstructor from '../../../components/ManageInstructor/ModelForAddInstructor'
import { useSelector } from 'react-redux'
import { fullDate } from '../../../constants/DateConverter'
import ProfilePicture from '../../../components/CommonComponents/ProfilePicture'
import { mediaUrl } from '../../../constants/DataManupulation'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import ModelForDeleteItems from '../../../components/ManageLibraryComponent/ModelForDeleteItems/ModelForDeleteItems'
import { getRouteAPI, postRouteAPI } from '../../../services/apisService'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { getNewToken } from '../../../services/fireBaseAuthService'
import Empty from '../../../components/CommonComponents/Empty'
import { adminPanelInstructorConst } from '../../../constants/adminPanelConst/instructorConst/instructorConst'
import { instructorConst } from '../../../constants/adminPanelConst/instructorConst'

const Index = () => {

    const storeData = useSelector((state) => state?.globalStore);
    const [isModelForAddInstructor, setIsModelForAddInstructor] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const instructorDetails = storeData?.instructorList
    const [editInstructor, setEditInstructor] = useState()
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)
    const dispatch = useDispatch()

    const getInstructorListReq = async () => {
        await getRouteAPI({ routeName: 'getAllInstructors' }).then((res) => {
            dispatch({
                type: 'SET_INSTRUCTOR',
                instructorList: res?.data,
            })
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getRouteAPI({ routeName: 'getAllInstructors' }).then(res => {
                        dispatch({
                            type: 'SET_INSTRUCTOR',
                            instructorList: res?.data,
                        })
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }

    const handleAddInstructor = () => {
        setIsModelForAddInstructor(true)
        setIsEdit(false)
    }
    const handleEditInstructor = (instructor) => {
        setEditInstructor(instructor)
        setIsModelForAddInstructor(true)
        setIsEdit(true)
    }

    const onCloseModal = () => {
        setIsmodelForDeleteItems(false)
    }
    const openDeleteFolderItems = (instructor) => {
        setEditInstructor(instructor);
        setIsmodelForDeleteItems(true)
    }
    const handleDeleteFolderItems = async () => {
        let body = {
            routeName: "updateInstructorHandler",
            id: editInstructor.id,
            isDeleted: true
        }
        await postRouteAPI(body).then((res) => {
            toast.success(instructorConst.successConfirmDeleteInstructorToast)
            getInstructorListReq()
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <div>
            <div className='maxWidthDefault px-4'>
                <div>
                    <div className='flex justify-between items-center'>
                        <BackToPath
                            backpathForPage={true}
                            backPathArray={
                                [
                                    { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                                    { lable: 'إضافة وإدارة المدربين', link: null },
                                ]
                            }
                        />
                    </div>
                    <div className={`${styles.headerWrapper}`}>
                        <h1 className={`head2 py-8`}>المدربين</h1>
                        <div className={styles.createNewInstructorBtnBox}>
                            <button className='primarySolidBtn' onClick={() => handleAddInstructor()}>إضافة مدرب </button>
                        </div>
                    </div>
                    <table className={styles.tableArea}>
                        <thead className={styles.tableHeaderArea}>
                            <tr>
                                <th className={styles.tableHead1}>اسم المدرب</th>
                                <th className={styles.tableHead2}>تاريخ الإنشاء</th>
                                <th className={styles.tableHead3}>اخر تعديل</th>
                                <th className={styles.tableHead4}>الإجراءات</th>
                            </tr>
                        </thead>
                        {instructorDetails.length > 0 &&
                            <tbody className={styles.tableBodyArea}>
                                {instructorDetails.map((instructor, index) => {
                                    return (
                                        <tr key={`tableRow${index}`} className={styles.tableRow}>
                                            <td>
                                                <div className={styles.StudentListImage}>
                                                    <ProfilePicture height={34} width={34} alt={'avatar image'} pictureKey={instructor.avatarKey == null ? '/images/anaOstori.png' : `${mediaUrl(instructor.avatarBucket, instructor.avatarKey)}`} />
                                                    <p className='pr-4'>{instructor.name}</p>
                                                </div>
                                            </td>
                                            <td>{fullDate(instructor.createdAt)}</td>
                                            <td>{fullDate(instructor.updatedAt)}</td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <div className='cursor-pointer' onClick={() => handleEditInstructor(instructor)}>
                                                        <AllIconsComponenet iconName={'newEditIcon'} height={24} width={24} color={'#000000'} />
                                                    </div>
                                                    <div className='cursor-pointer' onClick={() => openDeleteFolderItems(instructor)}>
                                                        <AllIconsComponenet iconName={'newDeleteIcon'} height={24} width={24} color={'#000000'} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        }
                    </table>
                    {instructorDetails.length == 0 &&
                        <div className={styles.tableBodyArea}>
                            <Empty buttonText={'إضافة مدرب'} emptyText={'ما أضفت مدرب'} containerhight={500} onClick={() => handleAddInstructor()} />
                        </div>
                    }
                </div>
            </div>
            {isModelForAddInstructor &&
                <ModelForAddInstructor
                    isModelForAddInstructor={isModelForAddInstructor}
                    setIsModelForAddInstructor={setIsModelForAddInstructor}
                    isEdit={isEdit}
                    instructorDetails={editInstructor}
                    setEditInstructor={setEditInstructor}
                    getInstructorListReq={getInstructorListReq}
                />
            }
            {ismodelForDeleteItems &&
                <ModelForDeleteItems
                    ismodelForDeleteItems={ismodelForDeleteItems}
                    onCloseModal={onCloseModal}
                    deleteItemType={'instructor'}
                    onDelete={handleDeleteFolderItems}
                />}
        </div>
    )
}

export default Index