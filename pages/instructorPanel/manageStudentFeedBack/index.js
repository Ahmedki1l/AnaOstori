import React, { use, useEffect, useState } from 'react'
import styles from '../../../styles/InstructorPanelStyleSheets/ManageStudentFeedBack.module.scss'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import { Table } from 'antd'
import Empty from '../../../components/CommonComponents/Empty'
import { postRouteAPI } from '../../../services/apisService'
import ModelForStudentFeedBack from '../../../components/ManageStudentFeedBack/ModelForStudentFeedBack'

const Index = () => {

    const [listOfStudentFeedBack, setListOfStudentFeedBack] = useState()
    const [isModelForStudentFeedBack, setIsModelForStudentFeedBack] = useState(true)
    const [isEdit, setIsEdit] = useState(false)

    const tableColumns = [
        {
            title: 'اسم الطالب',
            dataIndex: 'studentName',
        },
        {
            title: 'تصنيف المجال',
            dataIndex: 'categoryTitle',
        },
        {
            title: 'عدد الصور',
            dataIndex: 'noOfPhotos',
        },
        {
            title: 'تاريخ الانشاء',
            dataIndex: 'createdAt',
        },
        {
            title: 'تاريخ اخر تحديث',
            dataIndex: 'updatedAt',
        },
        {
            title: 'الإجراءات',
            dataIndex: 'action',
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

    const handleAddStudentFeedBack = () => {
        setIsModelForStudentFeedBack(true)
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
                    isEdit={isEdit}
                />}
        </div>
    )
}

export default Index