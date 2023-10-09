import React, { useEffect, useState } from 'react'
import styles from "./CoursePathLibrary.module.scss"
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { fullDate } from '../../../constants/DateConverter'
import { useRouter } from 'next/router'
import ModelForDeleteItems from '../ModelForDeleteItems/ModelForDeleteItems'
import { getCurriculumIdsAPI, updateCurriculumAPI } from '../../../services/apisService'
import { useSelector, useDispatch } from 'react-redux'
import { getNewToken } from '../../../services/fireBaseAuthService'
import Empty from '../../CommonComponents/Empty'
import { noOfItemTag } from '../../../constants/adminPanelConst/commonConst'

const CoursePathLibrary = () => {

    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)
    const [selectedCurriculum, setSelectedCurriculum] = useState()
    const storeData = useSelector((state) => state?.globalStore);
    const [curriculumList, SetCurriculumList] = useState(storeData.curriculumIds)
    const dispatch = useDispatch();
    const router = useRouter()

    const openDeleteFolderItems = (item) => {
        setIsmodelForDeleteItems(true)
        setSelectedCurriculum(item)
    }

    const onCloseModal = () => {
        setIsmodelForDeleteItems(false)
    }

    const handleDeleteFolderItems = async () => {
        let editBody = {
            data: {
                isDeleted: true,
                name: selectedCurriculum.name,
                id: selectedCurriculum.id,
            }
        }
        await updateCurriculumAPI(editBody).then(async (res) => {
            await getCurriculumIdsAPI().then((res) => {
                dispatch({
                    type: 'SET_CURRICULUMIDS',
                    curriculumIds: res.data,
                });
                SetCurriculumList(res.data)
            })
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await updateCurriculumAPI(editBody).then(async (res) => {
                        await getCurriculumIdsAPI().then((res) => {
                            dispatch({
                                type: 'SET_CURRICULUMIDS',
                                curriculumIds: res.data,
                            });
                            SetCurriculumList(res.data)
                        })
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }


    const onEdit = (item) => {
        router.push({
            pathname: `/instructorPanel/manageLibrary/editCoursePath`,
            query: { coursePathId: item.id },
        });
    }
    const handleRoute = () => {
        router.push(`/instructorPanel/manageLibrary/createCoursePath`)
    }
    return (
        <>
            <div>
                <div className={styles.tableContainer}>
                    <div>
                        <table className={styles.tableArea}>
                            <thead className={styles.tableHeaderArea}>
                                <tr>
                                    <th className={`${styles.tableHeadText} ${styles.tableHead1}`}>العنوان</th>
                                    <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>تاريخ الإنشاء  </th>
                                    <th className={`${styles.tableHeadText} ${styles.tableHead3}`}>اخر تعديل</th>
                                    <th className={`${styles.tableHeadText} ${styles.tableHead4}`}>حالة الاستخدام</th>
                                    <th className={`${styles.tableHeadText} ${styles.tableHead5}`}>الإجراءات</th>
                                </tr>
                            </thead>
                            {curriculumList.length > 0 &&
                                <tbody className={styles.tableBodyArea}>
                                    {curriculumList.map((item, index) => {
                                        return (
                                            <tr className={styles.tableRow} key={item.id}>
                                                <td>
                                                    <div className={styles.videoFolderList}>
                                                        <AllIconsComponenet iconName={'redBook'} height={24} width={24} />
                                                        {/* <AllIconsComponenet iconName={'greenBook'} height={24} width={24} /> */}
                                                        <p className={`cursor-pointer ${styles.numberOfAddedVideoNames}`}>{item?.name}</p>
                                                        <p className={styles.numberOfAddedVideo}>({noOfItemTag(item?.itemCount)})</p>
                                                    </div>
                                                </td>
                                                <td>{fullDate(item?.createdAt)}</td>
                                                <td>{fullDate(item?.updatedAt)}</td>
                                                <td>
                                                    {item.courses.length == 0 ?
                                                        <p className='p-2'>-</p>
                                                        :
                                                        <>
                                                            {item.courses.map((course, index) => {
                                                                return (
                                                                    <p key={index} className='p-2'>{course.name}</p>
                                                                )
                                                            })}
                                                        </>
                                                    }
                                                </td>
                                                <td>
                                                    <div className={styles.videoeventButtons}>
                                                        <div className='cursor-pointer' onClick={() => onEdit(item)}>
                                                            <AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#000000'} />
                                                        </div>
                                                        {item?.courses?.length == 0 &&
                                                            <div className='cursor-pointer' onClick={() => openDeleteFolderItems(item)}>
                                                                <AllIconsComponenet iconName={'deletecourse'} height={18} width={18} color={'#000000'} />
                                                            </div>}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody >
                            }
                        </table>
                        {curriculumList.length == 0 &&
                            <Empty
                                onClick={handleRoute}
                                containerhight={450}
                                buttonText={'إضافة مقرر'}
                                emptyText={'ما أضفت مقرر'}
                            />
                        }
                    </div>
                </div>
            </div>
            {ismodelForDeleteItems &&
                <ModelForDeleteItems
                    ismodelForDeleteItems={ismodelForDeleteItems}
                    onCloseModal={onCloseModal}
                    deleteItemType={'curriculum'}
                    onDelete={handleDeleteFolderItems}
                />}
        </>
    )
}

export default CoursePathLibrary



