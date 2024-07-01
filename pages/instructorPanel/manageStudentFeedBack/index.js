import React, { use, useEffect, useState } from 'react'
import styles from '../../../styles/InstructorPanelStyleSheets/ManageStudentFeedBack.module.scss'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import { Table } from 'antd'
import Empty from '../../../components/CommonComponents/Empty'
import { postAuthRouteAPI, postRouteAPI } from '../../../services/apisService'
import ModelForStudentFeedBack from '../../../components/ManageStudentFeedBack/ModelForStudentFeedBack'
import { fullDate } from '../../../constants/DateConverter'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import ModelForDeleteItems from '../../../components/ManageLibraryComponent/ModelForDeleteItems/ModelForDeleteItems'
import { getNewToken } from '../../../services/fireBaseAuthService'

const Index = () => {

    const [listOfStudentFeedBack, setListOfStudentFeedBack] = useState()
    const [isModelForStudentFeedBack, setIsModelForStudentFeedBack] = useState(false)
    const [editStudetReviews, setEditStudetReviews] = useState()
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)

    const tableColumns = [
        {
            title: 'اسم الطالب',
            dataIndex: 'fullName',
        },
        {
            title: 'تصنيف المجال',
            dataIndex: 'categoryTitle',
            render: (text, _record) => {
                return (_record?.course?.catagory?.name)
            }
        },
        {
            title: 'عدد الصور',
            dataIndex: 'noOfPhotos',
            render: (text, _record) => {
                const noOfPhotos = _record?.noOfPhotos
            }
        },
        {
            title: 'تاريخ الانشاء',
            dataIndex: 'createdAt',
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            render: (text, _date) => {
                return (fullDate(_date.createdAt))
            }
        },
        {
            title: 'تاريخ اخر تحديث',
            dataIndex: 'updatedAt',
            sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
            render: (text, _date) => {
                return (fullDate(_date.updatedAt))
            }
        },
        {
            title: 'الإجراءات',
            dataIndex: 'action',
            render: (text, _record) => {
                const handleEditReview = () => {
                    setIsModelForStudentFeedBack(true)
                    setEditStudetReviews(_record);
                }
                const handleDeleteModalOpen = () => {
                    setIsmodelForDeleteItems(true)
                    setEditStudetReviews(_record)
                }
                return (
                    <div className='flex'>
                        <div className='pl-2 cursor-pointer' onClick={handleEditReview}>
                            <AllIconsComponenet iconName={'newEditIcon'} height={16} width={16} color={'#000000'} />
                        </div>
                        <div className='pl-2 cursor-pointer' onClick={handleDeleteModalOpen}>
                            <AllIconsComponenet iconName={'newDeleteIcon'} height={16} width={16} color={'#000000'} />
                        </div>
                    </div>
                )
            }
        },
    ]
    useEffect(() => {
        getStudetnFeedBackList()
    }, [])

    const getStudetnFeedBackList = async () => {
        let body = {
            routeName: "allReviews",
        }
        await postRouteAPI(body).then((res) => {
            const newList = res.data.map((item) => {
                return {
                    ...item,
                    key: item.id
                }
            })
            setListOfStudentFeedBack(newList?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        }).catch((err) => {

        })
    }
    const handleDeleteReview = async () => {
        let data = {
            routeName: 'updateCourseReview',
            id: editStudetReviews.id,
            isDeleted: true
        }
        await postAuthRouteAPI(data).then((res) => {
            getStudetnFeedBackList();
            setIsmodelForDeleteItems(false);
        }).catch(async (err) => {
            if (err.response.status === 401) {
                await getNewToken().then(async (res) => {
                    await postAuthRouteAPI(createReviewMedia).then((res) => {
                        setIsModelForStudentFeedBack(false)
                        getStudetnFeedBackList();
                    }).catch(async (err) => {
                        console.log(err);
                    })
                }).catch(async (err) => {
                    console.log(err);
                })
            }
            console.log(err);
        })
    }
    const handleAddStudentFeedBack = () => {
        setIsModelForStudentFeedBack(true)
    }
    const onCloseModal = () => {
        setIsmodelForDeleteItems(false)
    }
    const customEmptyComponent = (
        <Empty emptyText={'ما أضفت تجربة'} containerhight={400} buttonText={'إضافة تجربة'} onClick={() => handleAddStudentFeedBack()} />
    )

    return (
        <div className='maxWidthDefault px-4'>
            <div style={{ height: 30 }}>
                <BackToPath
                    backpathForPage={true}
                    backPathArray={
                        [
                            { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                            { lable: 'إضافة وتعديل تجارب الطلاب ', link: null },
                        ]
                    }
                />
            </div>
            <div className={styles.studentFeedBackHeadArea}>
                <h1 className={`head2`}>تجارب الطلاب</h1>
                <div className={`${styles.createStudentFeedBckBtnBox}`}>
                    <button className='primarySolidBtn' onClick={() => handleAddStudentFeedBack()}>إضافة تجربة</button>
                </div>
            </div>

            <Table
                columns={tableColumns}
                minheight={400}
                dataSource={listOfStudentFeedBack}
                locale={{ emptyText: customEmptyComponent }}
            />

            {isModelForStudentFeedBack &&
                <ModelForStudentFeedBack
                    isModelForStudentFeedBack={isModelForStudentFeedBack}
                    setIsModelForStudentFeedBack={setIsModelForStudentFeedBack}
                    getStudetnFeedBackList={getStudetnFeedBackList}
                    editStudetReviews={editStudetReviews}
                    setEditStudetReviews={setEditStudetReviews}
                />}
            {ismodelForDeleteItems &&
                <ModelForDeleteItems
                    ismodelForDeleteItems={ismodelForDeleteItems}
                    onCloseModal={onCloseModal}
                    deleteItemType={'studentReview'}
                    onDelete={handleDeleteReview}
                />}
        </div>
    )
}

export default Index