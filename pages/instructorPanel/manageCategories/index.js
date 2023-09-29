import React, { useEffect, useState } from 'react'
import styles from '../../../styles/InstructorPanelStyleSheets/ManageCategories.module.scss'
import Image from 'next/legacy/image'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { useSelector } from 'react-redux'
import { fullDate } from '../../../constants/DateConverter'
import { mediaUrl } from '../../../constants/DataManupulation';
import ModelForAddCategory from '../../../components/ManageCategories/ModelForAddCategory'
import Spinner from '../../../components/CommonComponents/spinner'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import Empty from '../../../components/CommonComponents/Empty'
import Switch from '../../../components/antDesignCompo/Switch'
import { editCatagoryAPI, getCatagoriesAPI } from '../../../services/apisService'
import { useDispatch } from 'react-redux'
import { getNewToken } from '../../../services/fireBaseAuthService'
import { adminPanelCategoryConst } from '../../../constants/adminPanelConst/categoryConst/categoryConst'
import { toast } from 'react-toastify'


const Index = () => {

    const [isEdit, setIsEdit] = useState(false)
    const [isModelForAddCategory, setIsModelForAddCategory] = useState(false)
    const storeData = useSelector((state) => state?.globalStore);
    const categoriesDetails = storeData?.catagories
    const [editCategory, setEditCategory] = useState()
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        if (categoriesDetails) {
            setLoading(false)
        }
    }, [categoriesDetails])

    const handleAddCategory = () => {
        setIsModelForAddCategory(true)
        setIsEdit(false)
    }

    const handleEditCategory = (category) => {
        setIsModelForAddCategory(true)
        setIsEdit(true)
        setEditCategory(category)
    }

    const getCategoryListReq = async () => {
        await getCatagoriesAPI().then((res) => {
            dispatch({
                type: 'SET_CATAGORIES',
                catagories: res.data
            });
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getCatagoriesAPI().then(res => {
                        dispatch({
                            type: 'SET_CATAGORIES',
                            catagories: res.data
                        });
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }

    const handlePublishedCategory = async (e, catagoryId) => {
        let body = {
            id: catagoryId,
            published: e
        }
        await editCatagoryAPI(body).then((res) => {
            if (e == true) {
                toast.success(adminPanelCategoryConst.showCategoryMsg)
            } else {
                toast.success(adminPanelCategoryConst.hideCategoryMsg)
            }
            getCategoryListReq()
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <>
            {loading ?
                <div className={`relative ${styles.mainLoadingPage}`}>
                    <Spinner borderwidth={7} width={6} height={6} />
                </div>
                :
                <div className='maxWidthDefault px-4'>
                    <div className='py-2'>
                        <BackToPath
                            backPathArray={
                                [
                                    { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel' },
                                    { lable: 'إضافة وإدارة المجالات', link: null },
                                ]
                            }
                        />
                    </div>
                    <div className={`${styles.headerWrapper}`}>
                        <h1 className={`head2 py-8`}>المجالات</h1>
                        <div className={`flex ${styles.createCourseHeaderText}`}>
                            <div className={`${styles.createCourseBtnBox}`}>
                                <button className='primarySolidBtn' onClick={() => handleAddCategory()}>إضافة مجال</button>
                            </div>
                        </div>
                    </div>
                    <table className={styles.tableArea}>
                        <thead className={styles.tableHeaderArea}>
                            <tr>
                                <th className={`${styles.tableHeadText} ${styles.tableHead1}`}>عنوان المجال</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>حالة الظهور</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead3}`}>تاريخ الإنشاء</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead4}`}>اخر تعديل</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead5}`}>الإجراءات</th>
                            </tr>
                        </thead>
                        {categoriesDetails.length > 0 &&
                            <tbody className={styles.tableBodyArea}>
                                {categoriesDetails?.map((category, index) => {
                                    return (
                                        <tr key={`tableRow${index}`} className={styles.tableRow}>
                                            <td>
                                                <div className='flex'>
                                                    <div className={styles.courseInfoImage}>
                                                        <Image src={category?.pictureKey ? mediaUrl(category?.pictureBucket, category?.pictureKey) : '/images/anaOstori.png'} alt="Course Cover Image" layout="fill" objectFit="cover" priority />
                                                    </div>
                                                    <div className={styles.skillCourseDetails}>
                                                        <h1 className={`fontBold ${styles.courseNameHeader}`}>{category.name}</h1>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.publishState}>
                                                    <Switch defaultChecked={category.published} onChange={handlePublishedCategory} params={category.id} ></Switch>
                                                    <p className='pr-2'>{category.published ? 'إظهار' : 'مخفي'}</p>
                                                </div>
                                            </td>
                                            <td>{fullDate(category.createdAt)}</td>
                                            <td>{fullDate(category.updatedAt)}</td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <div className='cursor-pointer' onClick={() => handleEditCategory(category)}>
                                                        <AllIconsComponenet iconName={'newEditIcon'} height={24} width={24} color={'#000000'} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        }
                    </table>
                    {categoriesDetails.length < 0 &&
                        <div>
                            <Empty buttonText={'إضافة مجال'} emptyText={'ما أضفت مجال'} containerhight={500} onClick={() => handleAddCategory()} />
                        </div>
                    }
                    {isModelForAddCategory &&
                        <ModelForAddCategory
                            isModelForAddCategory={isModelForAddCategory}
                            setIsModelForAddCategory={setIsModelForAddCategory}
                            isEdit={isEdit}
                            editCategory={editCategory}
                            setEditCategory={setEditCategory}
                            getCategoryListReq={getCategoryListReq}
                        />
                    }
                </div>
            }
        </>
    )
}

export default Index