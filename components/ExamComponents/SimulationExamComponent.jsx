import React, { useState, useEffect } from 'react';
import { Modal } from 'antd'; // or use open if your version supports it
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ModelForAddQuestion from './ModelForAddQuestion'; // reuse your question modal component
import ModelWithOneInput from '../CommonComponents/ModelWithOneInput/ModelWithOneInput';
import ModelForDeleteItems from '../ManageLibraryComponent/ModelForDeleteItems/ModelForDeleteItems';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import BackToPath from '../CommonComponents/BackToPath';
import Spinner from '../CommonComponents/spinner';
import Empty from '../CommonComponents/Empty';
import { fullDate } from '../../constants/DateConverter';
import { postRouteAPI } from '../../services/apisService';
import { getNewToken } from '../../services/fireBaseAuthService';
import { toast } from 'react-toastify';
import { questionsConst } from '../../constants/adminPanelConst/questionsBank/questionsConst';
import styles from './SimulationExamComponent.module.scss';
import ModelForAddExam from './ModelForAddExam';

const SimulationExamComponent = ({
  questionsData,          // Contains both exam folders and exam questions
  typeOfListdata,         // "folder" for exam folders; "simulationExam" for simulation exams (with questions)
  setTypeOfListData,
  setSelectedFolderId,
  getQuestionsList,       // Should accept: (folderId, type, page, limit)
  getFolderList,          // Should accept: (type, page, limit)
  loading,
  handleCreateFolder,
  page,
  setPage,
  totalPages,
  setTotalPages,
  isModelForAddFolderOpen,
  setIsModelForAddFolderOpen,
  isModelForAddQuestionOpen,
  setIsModelForAddQuestionOpen
}) => {
  const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false);
  const [isExamModalOpen, setExamModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState();
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [selectedFolder, setSelectedFolder] = useState(); // exam folder
  const [deleteItemType, setDeleteItemType] = useState('folder');
  const [editFolder, setEditFolder] = useState(false);
  const [gotoPage, setGotoPage] = useState("");
  // When in exam mode, we store and manage exam questions here.
  const [examQuestions, setExamQuestions] = useState([]);

  // Available questions that can be added to an exam (might come from your question bank)
  const [existingQuestions, setExistingQuestions] = useState([]);

  const { folderToastMsgConst, questionToastMsgConst } = questionsConst;

  // If we are in exam mode, update our examQuestions local state.
  useEffect(() => {
    if (typeOfListdata === 'exam') {
      setExamQuestions(questionsData);
    }
  }, [questionsData, typeOfListdata]);

  // Wrapper functions to fetch list data and update pagination (using a limit of 10)
  const limit = 10;

  const fetchFolderList = (pageNumber = 1) => {
    // Assume getFolderList returns a promise that resolves with { data: [...], totalDocuments, page, limit, totalPages }
    getFolderList('simulationExam', pageNumber, limit);
  };

  const fetchQuestionsList = (folderId, pageNumber = 1) => {
    // Assume getQuestionsList returns a promise that resolves with exam questions list
    getQuestionsList(folderId, 'simulationExam', pageNumber, limit);
  };

  const returnQuestionsList = (folderId, type) => {
    getQuestionsList(folderId, 'simulationExam', page, limit);
  };

  const showQuestionsOfSelectedFolder = async (item) => {
    // Switch from folder view to exam mode
    if (typeOfListdata === "exam") return;
    setTypeOfListData("exam");
    setSelectedFolder(item);
    setSelectedFolderId(item._id);
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

  // Handle direct page navigation.
  const handleGotoPage = () => {
    const gotoPageNum = parseInt(gotoPage, 10);
    if (isNaN(gotoPageNum) || gotoPageNum < 1) {
      setGotoPage("");
      return;
    }
    if (gotoPageNum > totalPages) {
      setGotoPage("");
      return;
    }
    setPage(gotoPageNum);
    if (typeOfListdata === "folder") {
      fetchFolderList(gotoPageNum);
    } else if (selectedFolder) {
      fetchQuestionsList(selectedFolder._id, gotoPageNum);
    }
    setGotoPage("");
  };

  const handleEditIconClick = async (item) => {
    if (typeOfListdata === "folder") {
      setIsModelForAddFolderOpen(true);
      setSelectedFolder(item);
      setEditFolder(true);
    } else {
    //   setSelectedQuestion(item);
      setSelectedExam(item);
    //   setIsModelForAddQuestionOpen(true);
      setExamModalOpen(true);
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

  // Handler to open the modal for adding a new exam
  const openExamModal = () => {
    setSelectedExam(null); // clear if you're not editing an exam
    setExamModalOpen(true);
  };

  // Handler to close the modal
  const handleCloseModal = () => {
    setExamModalOpen(false);
  };

  const handleDeleteFolderItems = (item) => {
    if (typeOfListdata === 'exam') {
      setSelectedQuestion(item);
    } else {
      setSelectedFolder(item);
    }
    setDeleteItemType(typeOfListdata === 'folder' ? 'folder' : 'exam');
    setIsmodelForDeleteItems(true);
  };

  const handleDeleteFolderData = async () => {
    if (typeOfListdata === 'exam') {
      let deleteItemBody = {
        id: selectedQuestion.id,
        isDeleted: true,
      };
      let data = {
        routeName: 'updateExamHandler', // exam-specific route
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
    if (typeOfListdata === "exam") {
    //   setIsModelForAddQuestionOpen(true);
      setExamModalOpen(true);
    } else {
      setIsModelForAddFolderOpen(true);
    }
  };

  const handlePreviewQuestion = (question) => {
    // Here you can implement preview functionality for an exam question.
    console.log("Preview question:", question);
  };

  // Drag-and-drop handler for reordering exam questions (only used if in exam mode)
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(examQuestions);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setExamQuestions(reordered);
  };

  console.log("questionsData", questionsData);

  return (
    <>
      <div className={styles.tableContainer}>
        <div>
          {/* If we are in exam mode, show a back navigation */}
          {typeOfListdata === "exam" && (
            <div className={styles.folderDetailsTable}>
              <BackToPath
                backpathForTabel={true}
                backPathArray={[
                  { lable: 'قائمة الامتحانات', handleClick: showFolderList },
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
                            : item?.title?.length > 50
                              ? `${item?.title.substring(0, 50)}...`
                              : item?.title}
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
          {/* {typeOfListdata === "exam" && (
            <div className={styles.examDragAndDropWrapper}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="examQuestions">
                  {(provided) => (
                    <ul
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={styles.examQuestionsList}
                    >
                      {examQuestions.map((question, index) => (
                        <Draggable key={question.id} draggableId={question.id} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={styles.examQuestionItem}
                            >
                              <span>{question.text}</span>
                              <button
                                className={styles.removeQuestionButton}
                                onClick={() => {
                                  setExamQuestions(examQuestions.filter(q => q.id !== question.id));
                                  toast.info('تم إزالة السؤال من الامتحان');
                                }}
                              >
                                <AllIconsComponenet iconName={'cross'} height={16} width={16} />
                              </button>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )} */}

          {(!loading && questionsData.length > 0) && (
            <div className={styles.paginationWrapper}>
              <div className={styles.paginationCenter}>
                <button onClick={handlePrevPage} disabled={page === 1}>{"<"}</button>
                <span>صفحة {page} من {totalPages}</span>
                <button onClick={handleNextPage} disabled={page === totalPages}>{">"}</button>
              </div>
              <div className={styles.gotoPageContainer}>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={gotoPage}
                  onChange={(e) => setGotoPage(e.target.value)}
                  placeholder="ادخل رقم الصفحة"
                  className={styles.gotoPageInput}
                />
                <button onClick={handleGotoPage} className={styles.gotoPageButton}>
                  الذهاب للصفحة
                </button>
              </div>
            </div>
          )}

          {questionsData.length === 0 && !loading && (
            <Empty
              onClick={handleAddModalOpen}
              containerhight={448}
              emptyText={typeOfListdata === 'folder' ? 'لم يتم إضافة مجلد' : 'لم يتم إضافة امتحان'}
              buttonText={typeOfListdata === 'folder' ? 'إضافة مجلد' : 'إضافة امتحان'}
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
      {/* {isModelForAddQuestionOpen && (
        <ModelForAddQuestion
          isModelForAddQuestionOpen={isModelForAddQuestionOpen}
          selectedQuestion={selectedQuestion}
          selectedFolder={selectedFolder}
          getQuestionsList={returnQuestionsList}
          onCloseModal={onQuestionModelClose}
          onDelete={handleDeleteFolderData}
          existingItemName={existingItemName}
        />
      )} */}
      {isExamModalOpen && (
        <ModelForAddExam
          isModelForAddExamOpen={isExamModalOpen}
          selectedExam={selectedExam}
          selectedFolder={selectedFolder}
          getExamsList={getQuestionsList}
          onCloseModal={handleCloseModal}
          existingQuestions={existingQuestions}
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

export default SimulationExamComponent;
