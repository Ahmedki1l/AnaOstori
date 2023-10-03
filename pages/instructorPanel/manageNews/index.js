import React, { useEffect } from 'react'
import styles from '../../../styles/InstructorPanelStyleSheets/ManageNews.module.scss'
import ModelForAddNews from '../../../components/ManageNews/ModelForAddNews'
import { useState } from 'react'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import axios from 'axios'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import Empty from '../../../components/CommonComponents/Empty'
import ModelForDeleteItems from '../../../components/ManageLibraryComponent/ModelForDeleteItems/ModelForDeleteItems'
import { getNewToken } from '../../../services/fireBaseAuthService'
import { routeAPI } from '../../../services/apisService'
import { toast } from 'react-toastify'
import { manageNewsConst } from '../../../constants/ar'



const Index = () => {

    const [isModelForNews, setIsModelForNews] = useState()
    const [isEdit, setIsEdit] = useState(false)
    const [editNews, setEditNews] = useState()
    const [newsDataList, setNewsDataList] = useState([])
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)

    useEffect(() => {
        getNewsList()
    }, []);

    const getNewsList = async () => {
        let body = {
            routeName: "listNewsBar",
        }
        await routeAPI(body).then((res) => {
            setNewsDataList(res.data);
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    axios.get(`${process.env.API_BASE_URL}/news`).then((res) => {
                        setNewsDataList(res.data);
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }
    const handleAddNews = () => {
        setIsModelForNews(true)
        setIsEdit(false)
    }

    const handleEditNews = (news) => {
        setEditNews(news)
        setIsModelForNews(true)
        setIsEdit(true)
    }

    const openDeleteFolderItems = (news) => {
        setEditNews(news)
        setIsmodelForDeleteItems(true)
    }
    const onCloseModal = () => {
        setIsmodelForDeleteItems(false)
    }
    const handleDeleteNews = async () => {
        let body = {
            routeName: "listNewsBar",
            id: editNews.id,
            isDeleted: true
        }
        await routeAPI(body).then((res) => {
            toast.success(manageNewsConst.deleteNewsSuccessMsg)
            getNewsList()
        }).catch((err) => {
            console.log(err);
        })
    }
    return (
        <div>
            <div className='maxWidthDefault px-4'>
                <div>
                    <BackToPath
                        backpathForPage={true}
                        backPathArray={
                            [
                                { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                                { lable: 'إضافة وتعديل الشريط التسويقي', link: null },
                            ]
                        }
                    />
                </div>
                <div className={`flex justify-between items-center`}>
                    <h1 className={`head2 py-8`}>النصوص التسويقية</h1>
                    <div className={styles.createNewsBtnBox}>
                        <button className={`primarySolidBtn`} disabled={newsDataList.length > 0 ? true : false} onClick={() => handleAddNews()}>إضافة نص</button>
                    </div>
                </div>
                <table className={styles.tableArea}>
                    <thead className={styles.tableHeaderArea}>
                        <tr>
                            <th className={`${styles.tableHeadText} ${styles.tableHead1}`}>النص</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead4}`}>الإجراءات</th>
                        </tr>
                    </thead>
                    {newsDataList.length > 0 &&
                        <tbody className={styles.tableBodyArea}>
                            {newsDataList.map((news, index) => {
                                return (
                                    <tr key={`tableRow${index}`} className={styles.tableRow}>
                                        <td>{news.content}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <div className='cursor-pointer' onClick={() => handleEditNews(news)}>
                                                    <AllIconsComponenet iconName={'newEditIcon'} height={24} width={24} color={'#000000'} />
                                                </div>
                                                <div className='cursor-pointer' onClick={() => openDeleteFolderItems(news)}>
                                                    <AllIconsComponenet iconName={'newDeleteIcon'} height={24} width={24} color={'#000000'} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    }
                </table>
                {newsDataList?.length == 0 &&
                    <div>
                        <Empty buttonText={'إضافة نص'} emptyText={'ما أضفت نص تسويقي'} containerhight={500} onClick={() => handleAddNews()} />
                    </div>
                }
            </div>
            {isModelForNews &&
                <ModelForAddNews
                    isModelForNews={isModelForNews}
                    setIsModelForNews={setIsModelForNews}
                    isEdit={isEdit}
                    editNews={editNews}
                    getNewsList={getNewsList}
                    setEditNews={setEditNews}
                />}
            {ismodelForDeleteItems &&
                <ModelForDeleteItems
                    ismodelForDeleteItems={ismodelForDeleteItems}
                    onCloseModal={onCloseModal}
                    deleteItemType={'news'}
                    onDelete={handleDeleteNews}
                />}
        </div>
    )
}

export default Index