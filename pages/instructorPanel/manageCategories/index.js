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


const Index = () => {

    const [isEdit, setIsEdit] = useState(false)
    const [isModelForAddCategory, setIsModelForAddCategory] = useState(false)
    const storeData = useSelector((state) => state?.globalStore);
    const categoriesDetails = storeData?.catagories
    const [editCategory, setEditCategory] = useState()
    const [loading, setLoading] = useState(true)

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
                                    { lable: 'إدارة وإضافة المجالات', link: null },
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
                                <th className={`${styles.tableHeadText} ${styles.tableHead1}`}>بيانات المجال</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>حالة النشر</th>
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
                                                    <AllIconsComponenet iconName={'circleicon'} height={18} width={18} color={category.published ? '#2A7E19' : "#ebf550"} />
                                                    <p className='pr-2'>منشور</p>
                                                </div>
                                            </td>
                                            <td>{fullDate(category.createdAt)}</td>
                                            <td>{fullDate(category.updatedAt)}</td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <div className='cursor-pointer' onClick={() => handleEditCategory(category)}>
                                                        <AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#000000'} />
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
                        />
                    }
                </div>
            }
        </>
    )
}

export default Index