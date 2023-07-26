import React, { useEffect, useState } from 'react'
import styles from './ManageLibraryTableComponent.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { fullDate } from '../../../constants/DateConverter'
import Icon from '../../CommonComponents/Icon'
import ModelForAddFolder from '../ModelForAddFolder/ModelForAddFolder'
import ModelForDeleteItems from '../ModelForDeleteItems/ModelForDeleteItems'
import ModelForAddItemLibrary from '../ModelForAddItemLibrary/ModelForAddItemLibrary'
import Spinner from '../../CommonComponents/spinner'


const ManageLibraryTableComponent = ({
    folderTableData,
    onclose,
    folderType,
    typeOfListdata,
    setTypeOfListData,
    setSelectedFolderId,
    getItemList,
    loading,
}) => {
    const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false)
    const [isModelForAddItemOpen, setIsModelForAddItemOpen] = useState(false)
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)
    const [selectedItem, setSelectedItem] = useState()
    const [selectedFolder, setSelectedFolder] = useState()
    const tableDataType = typeOfListdata
    const [deleteItemType, setDeleteItemType] = useState('folder')


    const onEdit = async (item) => {
        if (tableDataType == "folder") {
            setIsModelForAddFolderOpen(true);
        } else {
            setSelectedItem(item)
            setIsModelForAddItemOpen(true)
        }
        setSelectedItem(item)
    };

    const handleDeleteFolderItems = () => {
        setDeleteItemType(tableDataType == 'folder' ? 'folder' : folderType == 'quiz' ? 'quiz' : folderType == 'file' ? 'file' : 'video')
        setIsmodelForDeleteItems(true)
    }

    const onCloseModal = () => {
        setIsmodelForDeleteItems(false)
    }

    const showItemListOfSelectedFolder = async (item) => {
        console.log(item);
        if (tableDataType == "item") return
        setTypeOfListData("item")
        setSelectedFolder(item)
        setSelectedFolderId(item.id)
        getItemList(item.id)
    }

    const showFolderList = () => {
        setTypeOfListData("folder")
    }

    return (
        <>
            <div className={styles.tableContainer}>
                <div>
                    {tableDataType == "item" &&
                        <div>
                            <div className={styles.folderDetailsTable}>
                                <p className={`cursor-pointer ${styles.folderDetailsVideo}`} onClick={() => showFolderList()}>الفيديوهات</p>
                                <p>{'>'}</p>
                                <p className={styles.folderDetailsName}> {selectedFolder.name ? selectedFolder.name : "الفيديوهات"}</p>
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
                        {(folderTableData.length > 0 && !loading) &&
                            <tbody className={styles.tableBodyArea}>
                                {folderTableData.map((item, index) => {
                                    return (
                                        <tr className={styles.tableRow} key={item.id}>
                                            <td>
                                                <div className={styles.videoFolderList} onClick={() => showItemListOfSelectedFolder(item)}>
                                                    {tableDataType == "folder" ?
                                                        <AllIconsComponenet iconName={'folderIcon'} height={24} width={24} />
                                                        :
                                                        <Icon
                                                            height={24}
                                                            width={24}
                                                            iconName={folderType == 'quiz' ? 'quizNotAttemptIcon' : folderType == 'file' ? 'pdfIcon' : 'videoIcon'}
                                                            alt={'Quiz Logo'} />
                                                    }
                                                    <p className={`cursor-pointer ${styles.numberOfAddedVideoNames}`}>{item?.name}</p>
                                                    <p className={styles.numberOfAddedVideo}>{` (${item?.numberOfItem}  عنصر / عناصر  )`}</p>
                                                </div>
                                            </td>
                                            <td>{fullDate(item?.createdAt)}</td>
                                            <td>{fullDate(item?.updatedAt)}</td>
                                            <td>
                                                <div className={styles.videoeventButtons}>
                                                    <div className='cursor-pointer' onClick={() => onEdit(item)}>
                                                        <AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#000000'} />
                                                    </div>
                                                    <div className='cursor-pointer' onClick={() => handleDeleteFolderItems()}>
                                                        <AllIconsComponenet iconName={'deletecourse'} height={18} width={18} color={'#000000'} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody >
                        }
                    </table>
                    {(folderTableData.length == 0 && !loading) &&
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
                    {loading &&
                        <div className={styles.tableBodyArea}>
                            <div className={styles.noDataMainArea}>
                                <div className={`relative ${styles.loadingWrapper}`}>
                                    <Spinner borderwidth={7} width={6} height={6} />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {isModelForAddFolderOpen && <ModelForAddFolder
                isModelForAddFolderOpen={isModelForAddFolderOpen}
                setIsModelForAddFolderOpen={setIsModelForAddFolderOpen}
                selectedItem={selectedItem}
                onclose={onclose}
            />}
            {isModelForAddItemOpen && <ModelForAddItemLibrary
                isModelForAddItemOpen={isModelForAddItemOpen}
                setIsModelForAddItemOpen={setIsModelForAddItemOpen}
                selectedItem={selectedItem}
                selectedFolder={selectedFolder}
                folderType={folderType}
            />}
            {ismodelForDeleteItems && <ModelForDeleteItems
                ismodelForDeleteItems={ismodelForDeleteItems}
                onCloseModal={onCloseModal}
                deleteItemType={deleteItemType}
            />}
        </>
    )
}

export default ManageLibraryTableComponent