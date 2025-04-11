import React, { useState } from 'react';
import styles from './QuestionsBankComponent.module.scss';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import { fullDate } from '../../constants/DateConverter';
import ModelForDeleteItems from '../ManageLibraryComponent/ModelForDeleteItems/ModelForDeleteItems';
import ModelForAddQuestion from './ModelForAddQuestion';
import Spinner from '../CommonComponents/spinner';
import ModelWithOneInput from '../CommonComponents/ModelWithOneInput/ModelWithOneInput';
import { postRouteAPI } from '../../services/apisService';
import Empty from '../CommonComponents/Empty';
import BackToPath from '../CommonComponents/BackToPath';
import { getNewToken } from '../../services/fireBaseAuthService';
import { toast } from 'react-toastify';
import { questionsConst } from '../../constants/adminPanelConst/questionsBank/questionsConst';

const QuestionsBankComponent = ({
  questionsData,
  typeOfListdata,
  setTypeOfListData,
  setSelectedFolderId,
  getQuestionsList, // should accept: (folderId, type, page, limit) 
  getFolderList,    // should accept: (type, page, limit)
  loading,
  handleCreateFolder,
}) => {
  const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false);
  const [isModelForAddQuestionOpen, setIsModelForAddQuestionOpen] = useState(false);
  const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [selectedFolder, setSelectedFolder] = useState();
  const [deleteItemType, setDeleteItemType] = useState('folder');
  const [editFolder, setEditFolder] = useState(false);

  // Pagination state (applies to both folders and questions)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Items per page

  const { folderToastMsgConst, questionToastMsgConst } = questionsConst;
  const existingItemName = questionsData?.map((item) => item.name);

  // Wrapper functions to fetch list data and update pagination
  const fetchFolderList = (pageNumber = 1) => {
    // Assume getFolderList returns a promise that resolves with
    // { data: [...], totalDocuments, page, limit, totalPages }
    getFolderList('questions', pageNumber, limit)
      .then((response) => {
        setPage(response.page);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.error('Error fetching folder list', error);
      });
  };

  const fetchQuestionsList = (folderId, pageNumber = 1) => {
    // Assume getQuestionsList returns a promise that resolves with
    // { data: [...], totalDocuments, page, limit, totalPages }
    getQuestionsList(folderId, 'questions', pageNumber, limit)
      .then((response) => {
        setPage(response.page);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.error('Error fetching questions list', error);
      });
  };

  const showQuestionsOfSelectedFolder = async (item) => {
    if (typeOfListdata === "question") return;
    setTypeOfListData("question");
    setSelectedFolder(item);
    setSelectedFolderId(item._id);
    // Reset to first page when folder changes
    setPage(1);
    fetchQuestionsList(item._id, 1);
  };

  const showFolderList = () => {
    setTypeOfListData("folder");
    setPage(1);
    fetchFolderList(1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      if (typeOfListdata === "folder") {
        fetchFolderList(newPage);
      } else if (selectedFolder) {
        fetchQuestionsList(selectedFolder._id, newPage);
      }
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      if (typeOfListdata === "folder") {
        fetchFolderList(newPage);
      } else if (selectedFolder) {
        fetchQuestionsList(selectedFolder._id, newPage);
      }
    }
  };

  const handleEditIconClick = async (item) => {
    if (typeOfListdata === "folder") {
      setIsModelForAddFolderOpen(true);
      setSelectedFolder(item);
      setEditFolder(true);
    } else {
      setSelectedQuestion(item);
      setIsModelForAddQuestionOpen(true);
    }
  };

  const handleEditFolder = async ({ name }) => {
    let editFolderBody = {
      id: selectedFolder?._id,
      name: name,
      type: selectedFolder?.type,
    };
    let data = {
      routeName: 'updateFolderHandler',
      ...editFolderBody,
    };
    await postRouteAPI(data)
      .then(() => {
        toast.success(folderToastMsgConst.updateFolderSuccessMsg, { rtl: true });
        setIsModelForAddFolderOpen(false);
        showFolderList();
      })
      .catch(async (error) => {
        if (error?.response?.status === 401) {
          await getNewToken().then(async () => {
            await postRouteAPI(data).then(() => {
              toast.success(folderToastMsgConst.updateFolderSuccessMsg, { rtl: true });
              setIsModelForAddFolderOpen(false);
              showFolderList();
            });
          });
        } else {
          toast.error('حدث خطأ أثناء تحديث المجلد', { rtl: true });
        }
      });
  };

  const hendleCreateFolder = (name) => {
    handleCreateFolder(name);
    setIsModelForAddFolderOpen(false);
  };

  const onCloseModal = () => {
    setIsmodelForDeleteItems(false);
  };

  const onQuestionModelClose = () => {
    setSelectedQuestion();
    setIsModelForAddQuestionOpen(false);
  };

  const handleDeleteFolderItems = (item) => {
    if (typeOfListdata === 'question') {
      setSelectedQuestion(item);
    } else {
      setSelectedFolder(item);
    }
    setDeleteItemType(typeOfListdata === 'folder' ? 'folder' : 'question');
    setIsmodelForDeleteItems(true);
  };

  const handleDeleteFolderData = async () => {
    if (typeOfListdata === 'question') {
      let deleteItemBody = {
        id: selectedQuestion.id,
        isDeleted: true,
      };
      let data = {
        routeName: 'updateQuestionHandler',
        ...deleteItemBody,
      };
      await postRouteAPI(data)
        .then(() => {
          toast.success(questionToastMsgConst.deleteQuestionSuccessMsg, { rtl: true });
          fetchQuestionsList(selectedFolder._id, page);
        })
        .catch(async (error) => {
          if (error?.response?.status === 401) {
            await getNewToken().then(async () => {
              await postRouteAPI(data).then(() => {
                toast.success(questionToastMsgConst.deleteQuestionSuccessMsg, { rtl: true });
                fetchQuestionsList(selectedFolder._id, page);
              });
            }).catch((error) => {
              console.error("Error:", error);
            });
          }
        });
    } else {
      let deleteFolderBody = {
        id: selectedFolder._id,
        isDeleted: true,
      };
      let data = {
        routeName: 'updateFolderHandler',
        ...deleteFolderBody,
      };
      await postRouteAPI(data)
        .then(() => {
          toast.success(folderToastMsgConst.deleteFolderSuccessMsg, { rtl: true });
          showFolderList();
        })
        .catch(async (error) => {
          if (error?.response?.status === 401) {
            await getNewToken().then(async () => {
              await postRouteAPI(data).then(() => {
                showFolderList();
                toast.success(folderToastMsgConst.deleteFolderSuccessMsg, { rtl: true });
              });
            }).catch((error) => {
              console.error("Error:", error);
            });
          }
        });
    }
  };

  const handleAddModalOpen = () => {
    if (typeOfListdata === "question") {
      setIsModelForAddQuestionOpen(true);
    } else {
      setIsModelForAddFolderOpen(true);
    }
  };

  const handlePreviewQuestion = (question) => {
    // Preview question implementation
    console.log("Preview question:", question);
    // This could open a modal to preview the question
  };

  console.log("questionsData", questionsData);

  return (
    <>
      <div className={styles.tableContainer}>
        <div>
          {typeOfListdata === "question" && (
            <div className={styles.folderDetailsTable}>
              <BackToPath
                backpathForTabel={true}
                backPathArray={[
                  { lable: 'بنك الأسئلة', handleClick: showFolderList },
                  { lable: selectedFolder?.name, link: null },
                ]}
              />
            </div>
          )}
          <table className={styles.tableArea}>
            <thead className={styles.tableHeaderArea}>
              <tr>
                <th className={`${styles.tableHeadText} ${styles.tableHead1}`}>العنوان</th>
                <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>{typeOfListdata === "folder" ? "تاريخ الإنشاء" : "نوع السؤال"}</th>
                <th className={`${styles.tableHeadText} ${styles.tableHead3}`}>تاريخ اخر تعديل</th>
                <th className={`${styles.tableHeadText} ${styles.tableHead4}`}>الإجراءات</th>
              </tr>
            </thead>
            {questionsData.length > 0 && !loading && (
              <tbody className={styles.tableBodyArea}>
                {questionsData.map((item) => (
                  <tr className={styles.tableRow} key={item.id}>
                    <td>
                      <div className={styles.questionFolderList} onClick={() => showQuestionsOfSelectedFolder(item)}>
                        {typeOfListdata === "folder" ? (
                          <AllIconsComponenet iconName={'newFolderIcon'} height={24} width={24} />
                        ) : (
                          <AllIconsComponenet iconName={'quiz'} height={24} width={24} />
                        )}
                        <p className={`cursor-pointer ${styles.numberOfAddedQuestionNames}`}>
                          {typeOfListdata === "folder"
                            ? item?.name
                            : item?.text?.length > 50
                            ? `${item?.text.substring(0, 50)}...`
                            : item?.text}
                        </p>
                      </div>
                    </td>
                    <td>{typeOfListdata === "folder" ? fullDate(item?.createdAt) : item?.questionType || "متعدد الخيارات"}</td>
                    <td>{fullDate(item?.updatedAt)}</td>
                    <td>
                      <div className={styles.eventButtons}>
                        <div onClick={() => handleEditIconClick(item)}>
                          <AllIconsComponenet iconName={'newEditIcon'} height={24} width={24} color={'#000000'} />
                        </div>
                        {typeOfListdata === "question" && (
                          <div onClick={() => handlePreviewQuestion(item)}>
                            <AllIconsComponenet iconName={'newVisibleIcon'} height={24} width={24} color={'#000000'} />
                          </div>
                        )}
                        <div onClick={() => handleDeleteFolderItems(item)}>
                          <AllIconsComponenet iconName={'newDeleteIcon'} height={24} width={24} color={'#000000'} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {(!loading && questionsData.length > 0) && (
            <div className={styles.paginationContainer}>
              <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>
            </div>
          )}
          {questionsData.length === 0 && !loading && (
            <Empty
              onClick={handleAddModalOpen}
              containerhight={448}
              emptyText={typeOfListdata === 'folder' ? 'ما أضفت مجلد' : 'ما أضفت سؤال'}
              buttonText={typeOfListdata === 'folder' ? 'إضافة مجلد' : 'إضافة سؤال'}
            />
          )}
          {loading && (
            <div className={styles.tableBodyArea}>
              <div className={styles.noDataMainArea}>
                <div className={`relative ${styles.loadingWrapper}`}>
                  <Spinner borderwidth={7} width={6} height={6} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isModelForAddFolderOpen && (
        <ModelWithOneInput
          open={isModelForAddFolderOpen}
          setOpen={setIsModelForAddFolderOpen}
          onSave={editFolder ? handleEditFolder : hendleCreateFolder}
          isEdit={editFolder}
          itemName={selectedFolder?.name}
          onDelete={handleDeleteFolderData}
          curriCulumSection={'folder'}
        />
      )}
      {isModelForAddQuestionOpen && (
        <ModelForAddQuestion
          isModelForAddQuestionOpen={isModelForAddQuestionOpen}
          selectedQuestion={selectedQuestion}
          selectedFolder={selectedFolder}
          getQuestionsList={getQuestionsList}
          onCloseModal={onQuestionModelClose}
          onDelete={handleDeleteFolderData}
          existingItemName={existingItemName}
        />
      )}
      {ismodelForDeleteItems && (
        <ModelForDeleteItems
          ismodelForDeleteItems={ismodelForDeleteItems}
          onCloseModal={onCloseModal}
          deleteItemType={deleteItemType}
          onDelete={handleDeleteFolderData}
        />
      )}
    </>
  );
};

export default QuestionsBankComponent;
