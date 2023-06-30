import React, { useState } from 'react'
import styles from './ManageLibraryTableComponent.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { fullDate } from '../../../constants/DateConverter'
import ModelForAddItems from '../../../components/CommonComponents/ModelForAddItems/ModelForAddItems'
import ModelForDeleteItems from '../ModelForDeleteItems/ModelForDeleteItems'

const initialFolderArray = [
    {
        folderName: 'folder1',
        numberOfVideo: '5',
        createdAt: "2023-06-27T07:37:20.000Z",
        updatedAt: "2023-07-09T07:33:47.000Z"
    },
    {
        folderName: 'folder2',
        numberOfVideo: '4',
        createdAt: "2023-06-28T07:37:20.000Z",
        updatedAt: "2023-07-01T07:33:47.000Z"
    },
    {
        folderName: 'folder3',
        numberOfVideo: '7',
        createdAt: "2023-06-29T07:37:20.000Z",
        updatedAt: "2023-07-19T07:33:47.000Z"
    },
    {
        folderName: 'folder4',
        numberOfVideo: '10',
        createdAt: "2023-06-30T07:37:20.000Z",
        updatedAt: "2023-07-20T07:33:47.000Z"
    },
    {
        folderName: 'folder1',
        numberOfVideo: '5',
        createdAt: "2023-06-27T07:37:20.000Z",
        updatedAt: "2023-07-09T07:33:47.000Z"
    },
    {
        folderName: 'folder2',
        numberOfVideo: '4',
        createdAt: "2023-06-28T07:37:20.000Z",
        updatedAt: "2023-07-01T07:33:47.000Z"
    },
    {
        folderName: 'folder3',
        numberOfVideo: '7',
        createdAt: "2023-06-29T07:37:20.000Z",
        updatedAt: "2023-07-19T07:33:47.000Z"
    },
    {
        folderName: 'folder4',
        numberOfVideo: '10',
        createdAt: "2023-06-30T07:37:20.000Z",
        updatedAt: "2023-07-20T07:33:47.000Z"
    },
    {
        folderName: 'folder1',
        numberOfVideo: '5',
        createdAt: "2023-06-27T07:37:20.000Z",
        updatedAt: "2023-07-09T07:33:47.000Z"
    },
    {
        folderName: 'folder2',
        numberOfVideo: '4',
        createdAt: "2023-06-28T07:37:20.000Z",
        updatedAt: "2023-07-01T07:33:47.000Z"
    },
    {
        folderName: 'folder3',
        numberOfVideo: '7',
        createdAt: "2023-06-29T07:37:20.000Z",
        updatedAt: "2023-07-19T07:33:47.000Z"
    },
    {
        folderName: 'folder4',
        numberOfVideo: '10',
        createdAt: "2023-06-30T07:37:20.000Z",
        updatedAt: "2023-07-20T07:33:47.000Z"
    },
    {
        folderName: 'folder1',
        numberOfVideo: '5',
        createdAt: "2023-06-27T07:37:20.000Z",
        updatedAt: "2023-07-09T07:33:47.000Z"
    },
    {
        folderName: 'folder2',
        numberOfVideo: '4',
        createdAt: "2023-06-28T07:37:20.000Z",
        updatedAt: "2023-07-01T07:33:47.000Z"
    },
    {
        folderName: 'folder3',
        numberOfVideo: '7',
        createdAt: "2023-06-29T07:37:20.000Z",
        updatedAt: "2023-07-19T07:33:47.000Z"
    },
    {
        folderName: 'folder4',
        numberOfVideo: '10',
        createdAt: "2023-06-30T07:37:20.000Z",
        updatedAt: "2023-07-20T07:33:47.000Z"
    },
    {
        folderName: 'folder1',
        numberOfVideo: '5',
        createdAt: "2023-06-27T07:37:20.000Z",
        updatedAt: "2023-07-09T07:33:47.000Z"
    },
    {
        folderName: 'folder2',
        numberOfVideo: '4',
        createdAt: "2023-06-28T07:37:20.000Z",
        updatedAt: "2023-07-01T07:33:47.000Z"
    },
    {
        folderName: 'folder3',
        numberOfVideo: '7',
        createdAt: "2023-06-29T07:37:20.000Z",
        updatedAt: "2023-07-19T07:33:47.000Z"
    },
    {
        folderName: 'folder4',
        numberOfVideo: '10',
        createdAt: "2023-06-30T07:37:20.000Z",
        updatedAt: "2023-07-20T07:33:47.000Z"
    },
    {
        folderName: 'folder1',
        numberOfVideo: '5',
        createdAt: "2023-06-27T07:37:20.000Z",
        updatedAt: "2023-07-09T07:33:47.000Z"
    },
    {
        folderName: 'folder2',
        numberOfVideo: '4',
        createdAt: "2023-06-28T07:37:20.000Z",
        updatedAt: "2023-07-01T07:33:47.000Z"
    },
    {
        folderName: 'folder3',
        numberOfVideo: '7',
        createdAt: "2023-06-29T07:37:20.000Z",
        updatedAt: "2023-07-19T07:33:47.000Z"
    },
    {
        folderName: 'folder4',
        numberOfVideo: '10',
        createdAt: "2023-06-30T07:37:20.000Z",
        updatedAt: "2023-07-20T07:33:47.000Z"
    },

]
console.log(initialFolderArray);


const ManageLibraryTableComponent = ({ setIsModalForAddItem }) => {

    const [isModelForAddItemsOpen, setIsModelForAddItemsOpen] = useState(false)

    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)

    const handeleEditFolderItems = () => {
        setIsModelForAddItemsOpen(true);
    };

    const handleDeleteFolderItems = () => {
        setIsmodelForDeleteItems(true)
    }

    const videoFolderList = initialFolderArray.map((data) => {
        return {
            folderName: data.folderName,
            numberOfVideo: data.numberOfVideo,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }
    })

    return (
        <div className={styles.tableContainer}>
            <div>
                <table className={styles.tableArea}>
                    <thead className={styles.tableHeaderArea}>
                        <tr>
                            <th className={`${styles.tableHeadText} ${styles.tableHead1}`}>العنوان</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>تاريخ الإنشاء</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead3}`}>تاريخ اخر تعديل</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead4}`}>الإجراءات</th>
                        </tr>
                    </thead>
                    {/* {videoFolderList.length > 0 && */}
                    <tbody className={styles.tableBodyArea}>
                        {videoFolderList.map((videoFolder, index) => {
                            return (
                                <>
                                    <tr className={styles.tableRow} key={`videoFolderItem${index}`}>
                                        <td>
                                            <div className={styles.videoFolderList}>
                                                <AllIconsComponenet iconName={'folderIcon'} height={24} width={24} />
                                                <p className={styles.numberOfAddedVideoNames}>{videoFolder.folderName}</p>
                                                <p className={styles.numberOfAddedVideo}>{` (${videoFolder.numberOfVideo}  عنصر / عناصر  )`}</p>
                                            </div>
                                        </td>
                                        <td>{fullDate(videoFolder.createdAt)}</td>
                                        <td>{fullDate(videoFolder.updatedAt)}</td>
                                        <td>
                                            <div className={styles.videoeventButtons}>
                                                <div onClick={() => handeleEditFolderItems()}>
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
                    {/* }  */}
                </table>
                {/* {videoFolderList.length == 0 &&
                    <div className={styles.tableBodyArea}>
                        <div className={styles.noDataManiArea} >
                            <div>
                                <AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
                                <p className={`fontBold py-2 ${styles.raisedcontent}`}>ما رفعت أي محتوى</p>
                                <div className={styles.createCourseBtnBox}>
                                    <button className='primarySolidBtn'>إضافة مجلد</button>
                                </div>
                            </div>
                        </div>
                    </div>
                } */}
            </div>
            <ModelForAddItems
                isModelForAddItemsOpen={isModelForAddItemsOpen}
                setIsModelForAddItemsOpen={setIsModelForAddItemsOpen}
            ></ModelForAddItems>
            <ModelForDeleteItems
                ismodelForDeleteItems={ismodelForDeleteItems}
                setIsmodelForDeleteItems={setIsmodelForDeleteItems}
            ></ModelForDeleteItems>
        </div>
    )
}

export default ManageLibraryTableComponent