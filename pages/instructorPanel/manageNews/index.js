import React, { useEffect } from 'react'
import styles from '../../../styles/InstructorPanelStyleSheets/ManageNews.module.scss'
import ModelForAddNews from '../../../components/ManageNews/ModelForAddNews'
import { useState } from 'react'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import axios from 'axios'



const index = () => {

    const [isModelForNews, setIsModelForNews] = useState()
    const [isEdit, setIsEdit] = useState(false)
    const [editNews, setEditNews] = useState()
    const [newsDataList, setNewsDataList] = useState([])

    useEffect(() => {
        getNewsList()
    }, []);

    const getNewsList = () => {
        axios.get(`${process.env.API_BASE_URL}/news`).then((res) => {
            setNewsDataList(res.data);
        }).catch((err) => {
            console.error(err);
        });
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


    return (
        <div>
            <div className='maxWidthDefault px-4'>
                <div dir='ltr'>
                    <div className={styles.createNewsBtnBox}>
                        <button className={`primarySolidBtn`} disabled={newsDataList ? true : false} onClick={() => handleAddNews()}>إضافة مدرب </button>
                    </div>
                </div>
                <table className={styles.tableArea}>
                    <thead className={styles.tableHeaderArea}>
                        <tr>
                            <th className={`${styles.tableHeadText} ${styles.tableHead1}`}>المدرب</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>الايميل</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead4}`}>الإجراءات</th>
                        </tr>
                    </thead>
                    {newsDataList.length > 0 &&
                        <tbody className={styles.tableBodyArea}>
                            {newsDataList.map((news, index) => {
                                return (
                                    <tr key={`tableRow${index}`} className={styles.tableRow}>
                                        <td>{news.content}</td>
                                        <td>{news.link}</td>
                                        <td>
                                            <div className='cursor-pointer' onClick={() => handleEditNews(news)}>
                                                <AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#000000'} />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    }
                </table>
                {newsDataList?.length == 0 &&
                    <div className={styles.noDataTableBodyArea}>
                        <div className={styles.noDataManiArea}>
                            <div>
                                <AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
                                <p className='fontBold py-2' style={{ fontSize: '18px' }}>ما أنشئت أي موعد</p>
                            </div>
                        </div>
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
        </div>
    )
}

export default index