import React, { useState } from 'react'
import styles from './ManageLibraryTableComponent.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { fullDate } from '../../../constants/DateConverter'
import Icon from '../../CommonComponents/Icon'
import ModelForDeleteItems from '../ModelForDeleteItems/ModelForDeleteItems'
import ModelForAddItemLibrary from '../ModelForAddItemLibrary/ModelForAddItemLibrary'
import Spinner from '../../CommonComponents/spinner'
import ModelWithOneInput from '../../CommonComponents/ModelWithOneInput/ModelWithOneInput'
import { updateFolderAPI } from '../../../services/apisService'
import Empty from '../../CommonComponents/Empty'
import BackToPath from '../../CommonComponents/BackToPath'
import { getNewToken } from '../../../services/fireBaseAuthService'


const ManageLibraryTableComponent = ({
    folderTableData,
    folderType,
    typeOfListdata,
    setTypeOfListData,
    setSelectedFolderId,
    getItemList,
    getFolderList,
    loading,
}) => {

    const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false)
    const [isModelForAddItemOpen, setIsModelForAddItemOpen] = useState(false)
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)
    const [selectedItem, setSelectedItem] = useState()
    const [selectedFolder, setSelectedFolder] = useState()
    const tableDataType = typeOfListdata
    const [deleteItemType, setDeleteItemType] = useState('folder')

    const handleEditIconClick = async (item) => {
        console.log(item);
        if (tableDataType == "folder") {
            setIsModelForAddFolderOpen(true);
            setSelectedFolder(item)
        } else {
            setSelectedItem(item)
            setIsModelForAddItemOpen(true)
        }
        // setSelectedItem(item)
    };

    const handleEditFolder = async ({ name }) => {
        let editFolderBody = {
            id: selectedFolder?.id,
            name: name,
            type: selectedFolder?.type,
        }
        let data = {
            data: editFolderBody
        }
        await updateFolderAPI(data).then((res) => {
            setIsModelForAddFolderOpen(false)
            getFolderList(folderType)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await updateFolderAPI(data).then(res => {
                        setIsModelForAddFolderOpen(false)
                        getFolderList(folderType)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }

    const handleDeleteFolderItems = (item) => {
        setSelectedItem(item);
        setDeleteItemType(tableDataType == 'folder' ? 'folder' : folderType == 'quiz' ? 'quiz' : folderType == 'file' ? 'file' : 'video')
        setIsmodelForDeleteItems(true)
    }

    const onCloseModal = () => {
        setIsmodelForDeleteItems(false)
    }

    const onItemModelClose = (folderId) => {
        getItemList(folderId)
        setSelectedItem()
        setIsModelForAddItemOpen(false)
    }

    const showItemListOfSelectedFolder = async (item) => {
        if (tableDataType == "item") return
        setTypeOfListData("item")
        setSelectedFolder(item)
        setSelectedFolderId(item.id)
        getItemList(item.id)
    }

    const showFolderList = () => {
        setTypeOfListData("folder")
        getFolderList(folderType)
    }
    const handleDeleteFolderData = () => {
        console.log(selectedItem);
        // let data = {

        // }
    }
    const handleAddModalOpen = () => {
        if (tableDataType == "item") {
            setIsModelForAddItemOpen(true)
        } else {
            setIsModelForAddFolderOpen(true)
        }
    }

    return (
        <>
            <div className={styles.tableContainer}>
                <div>
                    {tableDataType == "item" &&
                        <div className={styles.folderDetailsTable}>
                            <BackToPath
                                backpathForTabel={true}
                                backPathArray={
                                    [
                                        { lable: 'صفحة الأدمن الرئيسية', handleClick: showFolderList },
                                        { lable: selectedFolder.name ? selectedFolder.name : "الفيديوهات", link: null },
                                    ]
                                }
                            />
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
                                                    <p className={styles.numberOfAddedVideo}>{`(${item?.numberOfItem}  عنصر / عناصر)`}</p>
                                                </div>
                                            </td>
                                            <td>{fullDate(item?.createdAt)}</td>
                                            <td>{fullDate(item?.updatedAt)}</td>
                                            <td>
                                                <div className={tableDataType == "item" ? `${styles.eventButtons}` : ""}>
                                                    <div className='cursor-pointer' onClick={() => handleEditIconClick(item)}>
                                                        <AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#000000'} />
                                                    </div>
                                                    {tableDataType == "item" &&
                                                        <div className='cursor-pointer' onClick={() => handleDeleteFolderItems(item)}>
                                                            <AllIconsComponenet iconName={'deletecourse'} height={18} width={18} color={'#000000'} />
                                                        </div>
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        }
                    </table>
                    {(folderTableData.length == 0 && !loading) &&
                        <Empty buttonText={'إضافة مجلد'} onClick={() => handleAddModalOpen()} emptyText={'ما رفعت أي محتوى'} containerhight={450} />
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
            {isModelForAddFolderOpen && <ModelWithOneInput
                open={isModelForAddFolderOpen}
                setOpen={setIsModelForAddFolderOpen}
                onSave={handleEditFolder}
                isEdit={true}
                itemName={selectedFolder?.name}
            />}
            {isModelForAddItemOpen && <ModelForAddItemLibrary
                isModelForAddItemOpen={isModelForAddItemOpen}
                selectedItem={selectedItem}
                selectedFolder={selectedFolder}
                folderType={folderType}
                onCloseModal={onItemModelClose}
            />}
            {ismodelForDeleteItems && <ModelForDeleteItems
                ismodelForDeleteItems={ismodelForDeleteItems}
                onCloseModal={onCloseModal}
                deleteItemType={deleteItemType}
                onDelete={handleDeleteFolderData}
            />}
        </>
    )
}

export default ManageLibraryTableComponent