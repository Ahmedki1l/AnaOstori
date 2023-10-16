import React, { useState } from 'react'
import styles from './ManageLibraryTableComponent.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { fullDate } from '../../../constants/DateConverter'
import ModelForDeleteItems from '../ModelForDeleteItems/ModelForDeleteItems'
import ModelForAddItemLibrary from '../ModelForAddItemLibrary/ModelForAddItemLibrary'
import Spinner from '../../CommonComponents/spinner'
import ModelWithOneInput from '../../CommonComponents/ModelWithOneInput/ModelWithOneInput'
import { postRouteAPI } from '../../../services/apisService'
import Empty from '../../CommonComponents/Empty'
import BackToPath from '../../CommonComponents/BackToPath'
import { getNewToken } from '../../../services/fireBaseAuthService'
import ModalForVideo from '../../CommonComponents/ModalForVideo/ModalForVideo'
import { mediaUrl } from '../../../constants/DataManupulation'
import { toast } from 'react-toastify'
import { folderConst, pdfFileConst, quizConst, videoFileConst } from '../../../constants/adminPanelConst/manageLibraryConst/manageLibraryConst'


const ManageLibraryTableComponent = ({
    folderTableData,
    folderType,
    typeOfListdata,
    setTypeOfListData,
    setSelectedFolderId,
    getItemList,
    getFolderList,
    loading,
    handleCreateFolder,
}) => {
    const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false)
    const [isModelForAddItemOpen, setIsModelForAddItemOpen] = useState(false)
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)
    const [selectedItem, setSelectedItem] = useState()
    const [selectedFolder, setSelectedFolder] = useState()
    const tableDataType = typeOfListdata
    const [deleteItemType, setDeleteItemType] = useState('folder')
    const [fileSrc, setFileSrc] = useState()
    const [videoModalOpen, setVideoModalOpen] = useState(false)
    const [editFolder, setEditFolder] = useState(false)
    const existingItemName = folderTableData?.map(item => item.name)
    const { videoToastMsgConst } = videoFileConst
    const { pdfToastMsgConst } = pdfFileConst
    const { examToastMsgConst } = quizConst
    const { folderToastMsgConst } = folderConst


    const handleEditIconClick = async (item) => {
        if (tableDataType == "folder") {
            setIsModelForAddFolderOpen(true);
            setSelectedFolder(item)
            setEditFolder(true)
        } else {
            setSelectedItem(item)
            setIsModelForAddItemOpen(true)
        }
    };
    const handleEditFolder = async ({ name }) => {
        let editFolderBody = {
            id: selectedFolder?.id,
            name: name,
            type: selectedFolder?.type,
        }
        let data = {
            routeName: 'updateFolderHandler',
            ...editFolderBody
        }
        await postRouteAPI(data).then((res) => {
            toast.success(folderToastMsgConst.updateFolderSuccessMsg)
            setIsModelForAddFolderOpen(false)
            getFolderList(folderType)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postRouteAPI(data).then(res => {
                        toast.success(folderToastMsgConst.updateFolderSuccessMsg)
                        setIsModelForAddFolderOpen(false)
                        getFolderList(folderType)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }

    const hendleCreateFolder = (name) => {
        handleCreateFolder(name)
        setIsModelForAddFolderOpen(false)
    }

    const onCloseModal = () => {
        setIsmodelForDeleteItems(false)
    }

    const onItemModelClose = () => {
        // getItemList(folderId)
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

    const handleDeleteFolderItems = (item) => {
        if (tableDataType == 'item') {
            setSelectedItem(item);
        } else {
            setSelectedFolder(item)
        }
        setDeleteItemType(tableDataType == 'folder' ? 'folder' : folderType == 'quiz' ? 'quiz' : folderType == 'file' ? 'file' : 'video')
        setIsmodelForDeleteItems(true)
    }

    const handleDeleteFolderData = async () => {
        if (tableDataType == 'item') {
            let deleteItemBody = {
                id: selectedItem.id,
                isDeleted: true
            }
            let data = {
                routeName: 'updateItemHandler',
                ...deleteItemBody
            }
            await postRouteAPI(data).then((res) => {
                toast.success(folderType == "video" ? videoToastMsgConst.deleteVideoSuccessMsg :
                    folderType == "file" ? pdfToastMsgConst.deletePdfSuccessMsg :
                        examToastMsgConst.deleteExamSuccessMsg)
                getItemList(selectedFolder.id)
            }).catch(async (error) => {
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await postRouteAPI(data).then(res => {
                            toast.success(folderType == "video" ? videoToastMsgConst.deleteVideoSuccessMsg :
                                folderType == "file" ? pdfToastMsgConst.deletePdfSuccessMsg :
                                    examToastMsgConst.deleteExamSuccessMsg)
                            getItemList(selectedFolder.id)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
            })
        }
        else {
            let deleteFolderBody = {
                id: selectedFolder.id,
                isDeleted: true
            }
            let data = {
                routeName: 'updateFolderHandler',
                ...deleteFolderBody
            }
            await postRouteAPI(data).then((res) => {
                toast.success(folderToastMsgConst.deleteFolderSuccessMsg)
                getFolderList(folderType)
            }).catch(async (error) => {
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await postRouteAPI(data).then(res => {
                            getFolderList(folderType)
                            toast.success(folderToastMsgConst.deleteFolderSuccessMsg)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
            })
        }
    }

    const handleAddModalOpen = () => {
        if (tableDataType == "item") {
            setIsModelForAddItemOpen(true)
        } else {
            setIsModelForAddFolderOpen(true)
        }
    }

    const handlePreviewItem = (item) => {
        if (item.type == 'quiz') {
            window.open(item.quizLink)
        }
        else if (item.type == 'video') {
            setFileSrc(mediaUrl(item.linkBucket, item.linkKey))
            setVideoModalOpen(true);
        }
        else {
            window.open(mediaUrl(item.linkBucket, item.linkKey))
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
                                        { lable: folderType == 'video' ? 'الفيديوهات' : folderType == 'file' ? 'الملفات' : 'الاختبارات', handleClick: showFolderList },
                                        { lable: selectedFolder?.name, link: null },
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
                                                        <AllIconsComponenet iconName={'newFolderIcon'} height={24} width={24} />
                                                        :
                                                        <AllIconsComponenet iconName={folderType == 'quiz' ? 'quizNotAttemptIcon' : folderType == 'file' ? 'pdfIcon' : 'newVideoIcon'} height={24} width={24} />
                                                    }
                                                    <p className={`cursor-pointer ${styles.numberOfAddedVideoNames}`}>{item?.name}</p>
                                                    {/* {tableDataType == "folder" && <p className={styles.numberOfAddedVideo}>{`(${item?.numberOfItem}  عنصر / عناصر)`}</p>} */}
                                                </div>
                                            </td>
                                            <td>{fullDate(item?.createdAt)}</td>
                                            <td>{fullDate(item?.updatedAt)}</td>
                                            <td>
                                                <div className={styles.eventButtons}>
                                                    <div onClick={() => handleEditIconClick(item)}>
                                                        <AllIconsComponenet iconName={'newEditIcon'} height={24} width={24} color={'#000000'} />
                                                    </div>
                                                    {tableDataType == "item" &&
                                                        <div onClick={() => handlePreviewItem(item)}>
                                                            <AllIconsComponenet iconName={'newVisibleIcon'} height={24} width={24} color={'#000000'} />
                                                        </div>
                                                    }
                                                    <div onClick={() => handleDeleteFolderItems(item)}>
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
                    {(folderTableData.length == 0 && !loading) &&
                        <Empty
                            onClick={() => handleAddModalOpen()}
                            containerhight={448}
                            emptyText={typeOfListdata == 'folder' ? 'ما أضفت مجلد' : folderType == 'video' ? 'ما أضفت فيديو' : folderType == 'file' ? 'ما أضفت ملف' : 'ما أضفت اختبار'}
                            buttonText={typeOfListdata == 'folder' ? 'إضافة مجلد' : folderType == 'video' ? 'إضافة فيديو' : folderType == 'file' ? 'إضافة ملف' : 'إضافة اختبار'}
                        />
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
            {isModelForAddFolderOpen &&
                <ModelWithOneInput
                    open={isModelForAddFolderOpen}
                    setOpen={setIsModelForAddFolderOpen}
                    onSave={editFolder ? handleEditFolder : hendleCreateFolder}
                    isEdit={editFolder}
                    itemName={selectedFolder?.name}
                    onDelete={handleDeleteFolderData}
                    curriCulumSection={'folder'}
                />
            }
            {isModelForAddItemOpen &&
                <ModelForAddItemLibrary
                    isModelForAddItemOpen={isModelForAddItemOpen}
                    selectedItem={selectedItem}
                    selectedFolder={selectedFolder}
                    folderType={folderType}
                    getItemList={getItemList}
                    onCloseModal={onItemModelClose}
                    onDelete={handleDeleteFolderData}
                    existingItemName={existingItemName}
                />
            }
            {ismodelForDeleteItems &&
                <ModelForDeleteItems
                    ismodelForDeleteItems={ismodelForDeleteItems}
                    onCloseModal={onCloseModal}
                    deleteItemType={deleteItemType}
                    onDelete={handleDeleteFolderData}
                />
            }
            {videoModalOpen &&
                <ModalForVideo
                    videoModalOpen={videoModalOpen}
                    setVideoModalOpen={setVideoModalOpen}
                    sourceFile={fileSrc}
                />
            }
        </>
    )
}

export default ManageLibraryTableComponent