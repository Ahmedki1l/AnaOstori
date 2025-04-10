import React, { useState } from 'react'
import styles from './QuestionsBankComponent.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import { fullDate } from '../../constants/DateConverter'
import ModelForDeleteItems from '../ManageLibraryComponent/ModelForDeleteItems/ModelForDeleteItems'
import ModelForAddQuestion from './ModelForAddQuestion'
import Spinner from '../CommonComponents/spinner'
import ModelWithOneInput from '../CommonComponents/ModelWithOneInput/ModelWithOneInput'
import { postRouteAPI } from '../../services/apisService'
import Empty from '../CommonComponents/Empty'
import BackToPath from '../CommonComponents/BackToPath'
import { getNewToken } from '../../services/fireBaseAuthService'
import { toast } from 'react-toastify'
import { questionsConst } from '../../constants/adminPanelConst/questionsBank/questionsConst'

const QuestionsBankComponent = ({
    questionsData,
    typeOfListdata,
    setTypeOfListData,
    setSelectedFolderId,
    getQuestionsList,
    getFolderList,
    loading,
    handleCreateFolder,
}) => {
    const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false)
    const [isModelForAddQuestionOpen, setIsModelForAddQuestionOpen] = useState(false)
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState()
    const [selectedFolder, setSelectedFolder] = useState()
    const tableDataType = typeOfListdata
    const [deleteItemType, setDeleteItemType] = useState('folder')
    const [editFolder, setEditFolder] = useState(false)
    const existingItemName = questionsData?.map(item => item.name)
    const { folderToastMsgConst, questionToastMsgConst } = questionsConst

    const handleEditIconClick = async (item) => {
        if (tableDataType == "folder") {
            setIsModelForAddFolderOpen(true);
            setSelectedFolder(item)
            setEditFolder(true)
        } else {
            setSelectedQuestion(item)
            setIsModelForAddQuestionOpen(true)
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
            toast.success(folderToastMsgConst.updateFolderSuccessMsg, { rtl: true, })
            setIsModelForAddFolderOpen(false)
            getFolderList('questions')
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postRouteAPI(data).then(res => {
                        toast.success(folderToastMsgConst.updateFolderSuccessMsg, { rtl: true, })
                        setIsModelForAddFolderOpen(false)
                        getFolderList('questions')
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

    const onQuestionModelClose = () => {
        setSelectedQuestion()
        setIsModelForAddQuestionOpen(false)
    }

    const showQuestionsOfSelectedFolder = async (item) => {
        if (tableDataType == "question") return
        setTypeOfListData("question")
        setSelectedFolder(item)
        setSelectedFolderId(item.id)
        getQuestionsList(item.id)
    }

    const showFolderList = () => {
        setTypeOfListData("folder")
        getFolderList('questions')
    }

    const handleDeleteFolderItems = (item) => {
        if (tableDataType == 'question') {
            setSelectedQuestion(item);
        } else {
            setSelectedFolder(item)
        }
        setDeleteItemType(tableDataType == 'folder' ? 'folder' : 'question')
        setIsmodelForDeleteItems(true)
    }

    const handleDeleteFolderData = async () => {
        if (tableDataType == 'question') {
            let deleteItemBody = {
                id: selectedQuestion.id,
                isDeleted: true
            }
            let data = {
                routeName: 'updateQuestionHandler',
                ...deleteItemBody
            }
            await postRouteAPI(data).then((res) => {
                toast.success(questionToastMsgConst.deleteQuestionSuccessMsg, { rtl: true, })
                getQuestionsList(selectedFolder.id)
            }).catch(async (error) => {
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await postRouteAPI(data).then(res => {
                            toast.success(questionToastMsgConst.deleteQuestionSuccessMsg, { rtl: true, })
                            getQuestionsList(selectedFolder.id)
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
                toast.success(folderToastMsgConst.deleteFolderSuccessMsg, { rtl: true, })
                getFolderList('questions')
            }).catch(async (error) => {
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await postRouteAPI(data).then(res => {
                            getFolderList('questions')
                            toast.success(folderToastMsgConst.deleteFolderSuccessMsg, { rtl: true, })
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
            })
        }
    }

    const handleAddModalOpen = () => {
        if (tableDataType == "question") {
            setIsModelForAddQuestionOpen(true)
        } else {
            setIsModelForAddFolderOpen(true)
        }
    }

    const handlePreviewQuestion = (question) => {
        // Preview question implementation
        console.log("Preview question:", question);
        // Could open a modal to preview the question
    }

    return (
        <>
            <div className={styles.tableContainer}>
                <div>
                    {tableDataType == "question" &&
                        <div className={styles.folderDetailsTable}>
                            <BackToPath
                                backpathForTabel={true}
                                backPathArray={
                                    [
                                        { lable: 'بنك الأسئلة', handleClick: showFolderList },
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
                                <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>نوع السؤال</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead3}`}>تاريخ اخر تعديل</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead4}`}>الإجراءات</th>
                            </tr>
                        </thead>
                        {(questionsData.length > 0 && !loading) &&
                            <tbody className={styles.tableBodyArea}>
                                {questionsData.map((item, index) => {
                                    return (
                                        <tr className={styles.tableRow} key={item.id}>
                                            <td>
                                                <div className={styles.questionFolderList} onClick={() => showQuestionsOfSelectedFolder(item)}>
                                                    {tableDataType == "folder" ?
                                                        <AllIconsComponenet iconName={'newFolderIcon'} height={24} width={24} />
                                                        :
                                                        <AllIconsComponenet iconName={'quiz'} height={24} width={24} />
                                                    }
                                                    <p className={`cursor-pointer ${styles.numberOfAddedQuestionNames}`}>
                                                        {tableDataType === "folder" 
                                                            ? item?.name 
                                                            : item?.text?.length > 50 
                                                                ? `${item?.text.substring(0, 50)}...` 
                                                                : item?.text}
                                                    </p>
                                                </div>
                                            </td>
                                            <td>{tableDataType === "folder" ? "-" : item?.questionType || "متعدد الخيارات"}</td>
                                            <td>{fullDate(item?.updatedAt)}</td>
                                            <td>
                                                <div className={styles.eventButtons}>
                                                    <div onClick={() => handleEditIconClick(item)}>
                                                        <AllIconsComponenet iconName={'newEditIcon'} height={24} width={24} color={'#000000'} />
                                                    </div>
                                                    {tableDataType == "question" &&
                                                        <div onClick={() => handlePreviewQuestion(item)}>
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
                    {(questionsData.length == 0 && !loading) &&
                        <Empty
                            onClick={() => handleAddModalOpen()}
                            containerhight={448}
                            emptyText={typeOfListdata == 'folder' ? 'ما أضفت مجلد' : 'ما أضفت سؤال'}
                            buttonText={typeOfListdata == 'folder' ? 'إضافة مجلد' : 'إضافة سؤال'}
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
            {isModelForAddQuestionOpen &&
                <ModelForAddQuestion
                    isModelForAddQuestionOpen={isModelForAddQuestionOpen}
                    selectedQuestion={selectedQuestion}
                    selectedFolder={selectedFolder}
                    getQuestionsList={getQuestionsList}
                    onCloseModal={onQuestionModelClose}
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
        </>
    )
}

export default QuestionsBankComponent