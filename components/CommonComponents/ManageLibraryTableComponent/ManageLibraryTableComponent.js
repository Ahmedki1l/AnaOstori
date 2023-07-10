import React, { useState } from 'react'
import styles from './ManageLibraryTableComponent.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { fullDate } from '../../../constants/DateConverter'
import ModelForDeleteItems from '../ModelForDeleteItems/ModelForDeleteItems'
import ModelForAddFolder from '../ModelForAddFolder/ModelForAddFolder'
import ModelForAddItems from '../ModelForAddItems/ModelForAddItems'



const ManageLibraryTableComponent = ({ folderTableData, onclose }) => {

    const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false)
    const [isModelForAddItemOpen, setIsModelForAddItemOpen] = useState(false)
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)
    const [showVideoList, setShowVideoList] = useState(false)
    const [selectedFolder, setSelectedFolder] = useState()

    const handleEditFolderItems = async (item) => {
        setIsModelForAddFolderOpen(true);
        setSelectedFolder(item)
    };

    const handleDeleteFolderItems = () => {
        setIsmodelForDeleteItems(true)
    }


    const showSelectedVideoList = () => {
        setShowVideoList(true)
    }

    return (
        <>
            <div className={styles.tableContainer}>
                <div>
                    {showVideoList &&
                        <div>
                            <div className={styles.folderDetailsTable}>
                                <p className={styles.folderDetailsVideo}>الفيديوهات</p>
                                <p>{'>'}</p>
                                <p className={styles.folderDetailsName}> تجميعات سنة 23ب </p>
                            </div>
                        </div>
                    }
                    <table className={styles.tableArea}>
                        <thead className={styles.tableHeaderArea}>
                            <tr>
                                <th className={`${styles.tableHeadText} ${styles.tableHead1}`}>العنوان</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>تاريخ الإنشاء</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead3}`}>تاريخ اخر تعديل</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead4}`}>الإجراءات</th>
                            </tr>
                        </thead>
                        {folderTableData.length > 0 &&
                            <tbody className={styles.tableBodyArea}>
                                {folderTableData.map((item, index) => {
                                    return (
                                        <>
                                            <tr className={styles.tableRow} key={item.id}>
                                                <td>
                                                    <div className={styles.videoFolderList} onClick={showSelectedVideoList}>
                                                        <AllIconsComponenet iconName={'folderIcon'} height={24} width={24} />
                                                        <p className={styles.numberOfAddedVideoNames}>{item?.name}</p>
                                                        <p className={styles.numberOfAddedVideo}>{` (${item?.numberOfItem}  عنصر / عناصر  )`}</p>
                                                    </div>
                                                </td>
                                                <td>{fullDate(item?.createdAt)}</td>
                                                <td>{fullDate(item?.updatedAt)}</td>
                                                <td>
                                                    <div className={styles.videoeventButtons}>
                                                        <div onClick={() => handleEditFolderItems(item)}>
                                                            <AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#000000'} />
                                                        </div>
                                                        <div onClick={() => handleDeleteFolderItems()}>
                                                            <AllIconsComponenet iconName={'deletecourse'} height={18} width={18} color={'#000000'} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    )
                                })}
                            </tbody >
                        }
                    </table>
                    {folderTableData.length == 0 &&
                        <div className={styles.tableBodyArea}>
                            <div className={styles.noDataMainArea}>
                                <div>
                                    <AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
                                    <p className={`fontBold py-2 ${styles.raisedcontent}`}>ما رفعت أي محتوى</p>
                                    <div className={styles.createCourseBtnBox}>
                                        <button className='primarySolidBtn'>إضافة مجلد</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <ModelForAddFolder
                isModelForAddFolderOpen={isModelForAddFolderOpen}
                setIsModelForAddFolderOpen={setIsModelForAddFolderOpen}
                selectedFolder={selectedFolder}
                onclose={onclose}
            />
            <ModelForAddItems
                isModelForAddItemOpen={isModelForAddItemOpen}
                setIsModelForAddItemOpen={setIsModelForAddItemOpen}
            ></ModelForAddItems>
            <ModelForDeleteItems
                ismodelForDeleteItems={ismodelForDeleteItems}
                setIsmodelForDeleteItems={setIsmodelForDeleteItems}
            ></ModelForDeleteItems>
        </>
    )
}

export default ManageLibraryTableComponent