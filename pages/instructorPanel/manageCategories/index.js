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
import { getAuthRouteAPI, postRouteAPI } from '../../../services/apisService'
import { useDispatch } from 'react-redux'
import { getNewToken } from '../../../services/fireBaseAuthService'
import { adminPanelCategoryConst } from '../../../constants/adminPanelConst/categoryConst/categoryConst'
import { toast } from 'react-toastify'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'



const Index = () => {

    const [isEdit, setIsEdit] = useState(false)
    const [isModelForAddCategory, setIsModelForAddCategory] = useState(false)
    const storeData = useSelector((state) => state?.globalStore);
    const [categoriesDetails, setCategorisDetails] = useState(storeData?.catagories)
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
        let data = {
            routeName: 'categories'
        }
        await getAuthRouteAPI(data).then((res) => {
            dispatch({
                type: 'SET_CATAGORIES',
                catagories: res.data
            });
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getAuthRouteAPI(data).then(res => {
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
            routeName: 'updateCategory',
            id: catagoryId,
            published: e
        }
        await postRouteAPI(body).then((res) => {
            if (e == true) {
                toast.success(adminPanelCategoryConst.showCategoryMsg, { rtl: true, })
            } else {
                toast.success(adminPanelCategoryConst.hideCategoryMsg, { rtl: true, })
            }
            getCategoryListReq()
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleSectionDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }
        const newSectionOrder = Array.from(categoriesDetails);
        const [reorderedSection] = newSectionOrder.splice(result.source.index, 1);
        newSectionOrder.splice(result.destination.index, 0, reorderedSection);
        setCategorisDetails(newSectionOrder)

        const data = newSectionOrder.map((e, index) => {
            return {
                categoryId: e.id,
                order: index + 1
            }
        })
        let body = {
            routeName: 'updateCategory',
            data: data,
        }
        await postRouteAPI(body).then((res) => {
            // toast.success(adminPanelCategoryConst.updateCategoryOrderMsg, { rtl: true, })
            dispatch({
                type: 'SET_CATAGORIES',
                catagories: res.data
            });

        }).catch((error) => {
            console.log(error);
        })
    };

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
                            // <tbody className={styles.tableBodyArea}>
                            //     {categoriesDetails?.map((category, index) => {
                            //         return (
                            //             <tr key={`tableRow${index}`} className={styles.tableRow}>
                            //                 <td>
                            //                     <div className='flex'>
                            //                         <div className={styles.courseInfoImage}>
                            //                             <Image src={category?.pictureKey ? mediaUrl(category?.pictureBucket, category?.pictureKey) : '/images/anaOstori.png'} alt="Course Cover Image" layout="fill" objectFit="cover" priority />
                            //                         </div>
                            //                         <div className={styles.skillCourseDetails}>
                            //                             <h1 className={`fontBold ${styles.courseNameHeader}`}>{category.name}</h1>
                            //                         </div>
                            //                     </div>
                            //                 </td>
                            //                 <td>
                            //                     <div className={styles.publishState}>
                            //                         <Switch defaultChecked={category.published} onChange={handlePublishedCategory} params={category.id} ></Switch>
                            //                         <p className='pr-2'>{category.published ? 'إظهار' : 'مخفي'}</p>
                            //                     </div>
                            //                 </td>
                            //                 <td>{fullDate(category.createdAt)}</td>
                            //                 <td>{fullDate(category.updatedAt)}</td>
                            //                 <td>
                            //                     <div className={styles.actions}>
                            //                         <div className='cursor-pointer pl-2' onClick={() => handleEditCategory(category)}>
                            //                             <AllIconsComponenet iconName={'newEditIcon'} height={24} width={24} color={'#000000'} />
                            //                         </div>
                            //                         {/* <div className='cursor-pointer' onClick={() => handleDeleteCatagory(category)}>
                            //                             <AllIconsComponenet iconName={'deletecourse'} height={18} width={18} color={'#000000'} />
                            //                         </div> */}
                            //                     </div>
                            //                 </td>
                            //             </tr>
                            //         )
                            //     })}
                            // </tbody>
                            <DragDropContext onDragEnd={handleSectionDragEnd}>
                                <Droppable droppableId="sections" direction="vertical" >
                                    {(provided) => (
                                        <tbody className={styles.tableBodyArea} {...provided.droppableProps} ref={provided.innerRef}>
                                            {categoriesDetails?.map((category, index) => (
                                                <Draggable key={`section ${index}`} draggableId={`section-${index}`} index={index}>
                                                    {(provided) => (
                                                        <tr
                                                            {...provided.draggableProps}
                                                            ref={provided.innerRef}
                                                            className={styles.tableRow}
                                                        >
                                                            <td className={styles.tableHead1}>
                                                                <div className='flex items-center pr-4'>
                                                                    <div className={styles.updownSectionIcon}  {...provided.dragHandleProps}>
                                                                        <AllIconsComponenet iconName={'dragIcon'} height={24} width={24} color={'#00000094'} />
                                                                    </div>
                                                                    <div className={styles.courseInfoImage}>
                                                                        <Image src={category?.pictureKey ? mediaUrl(category?.pictureBucket, category?.pictureKey) : '/images/anaOstori.png'} alt="Course Cover Image" layout="fill" objectFit="cover" priority />
                                                                    </div>
                                                                    <div className={styles.skillCourseDetails}>
                                                                        <h1 className={`fontBold ${styles.courseNameHeader}`}>{category.name}</h1>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className={styles.tableHead2}>
                                                                <div className={styles.publishState}>
                                                                    <Switch defaultChecked={category.published} onChange={handlePublishedCategory} params={category.id} ></Switch>
                                                                    <p className='pr-2'>{category.published ? 'إظهار' : 'مخفي'}</p>
                                                                </div>
                                                            </td>
                                                            <td className={styles.tableHead3}>{fullDate(category.createdAt)}</td>
                                                            <td className={styles.tableHead4}>{fullDate(category.updatedAt)}</td>
                                                            <td className={styles.tableHead5}>
                                                                <div className={styles.actions}>
                                                                    <div className='cursor-pointer pl-2' onClick={() => handleEditCategory(category)}>
                                                                        <AllIconsComponenet iconName={'newEditIcon'} height={24} width={24} color={'#000000'} />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </tbody>
                                    )}
                                </Droppable>
                            </DragDropContext>
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