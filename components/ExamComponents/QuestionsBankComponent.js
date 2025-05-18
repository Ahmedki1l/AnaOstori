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
  getQuestionsList,
  getFolderList,
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
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [selectedFolder, setSelectedFolder] = useState();
  const [deleteItemType, setDeleteItemType] = useState('folder');
  const [editFolder, setEditFolder] = useState(false);
  const [gotoPage, setGotoPage] = useState("");

  // Pagination state (applies to both folders and questions)
  const limit = 10; // Items per page

  const { folderToastMsgConst, questionToastMsgConst } = questionsConst;
  const existingItemName = questionsData?.map((item) => item.name);

  // Categories
  const categories = ["عام", "قدرات", "تحصيلي"];
  const [selectedCategory, setSelectedCategory] = useState("عام");

  // Only filter when we're showing questions
  const filteredQuestions = typeOfListdata === "question"
    ? (
      // “عام” means “all” → show everything
      selectedCategory === "عام"
        ? questionsData
        : questionsData.filter(q => {
          if (q.section) {
            if (selectedCategory === "تحصيلي") {
              return (q.section === selectedCategory || q.section === "SAAT")
            } else if (selectedCategory === "قدرات") {
              return (q.section === selectedCategory || q.section === "GAT")
            }
          }
        })
    )
    : questionsData;

  // Wrapper functions to fetch list data and update pagination
  const fetchFolderList = (pageNumber = 1) => {
    // Assume getFolderList returns a promise that resolves with
    // { data: [...], totalDocuments, page, limit, totalPages }
    getFolderList('questions', pageNumber, limit);
  };

  const fetchQuestionsList = (folderId, pageNumber = 1) => {
    // Assume getQuestionsList returns a promise that resolves with
    // { data: [...], totalDocuments, page, limit, totalPages }
    getQuestionsList(folderId, 'questions', pageNumber, limit);
  };

  const returnQuestionsList = (folderId, type) => {
    getQuestionsList(folderId, 'questions', page, limit);
  }

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

  // Handle direct page navigation
  const handleGotoPage = () => {
    const gotoPageNum = parseInt(gotoPage, 10);
    if (isNaN(gotoPageNum) || gotoPageNum < 1) {
      // Invalid page number; clear input and do nothing.
      setGotoPage("");
      return;
    }
    if (gotoPageNum > totalPages) {
      // If entered page is greater than total pages, ignore.
      setGotoPage(""); // Optionally, you could show a toast or error here.
      return;
    }
    // Valid page number: update page state and fetch corresponding list.
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
        id: selectedQuestion._id,
        type: 'question',
        isDeleted: true,
      };
      let data = {
        routeName: 'updateItemHandler',
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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  console.log("questionsData", questionsData);

  return (
    <>
      {/* Categories Tab Bar */}
      <div className={styles.categoriesTabBar}>
        {categories.map((category) => (
          <div
            key={category}
            className={`${styles.categoryTab} ${selectedCategory === category ? styles.activeTab : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </div>
        ))}
      </div>
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
            {filteredQuestions.length > 0 && !loading && (
              <tbody className={styles.tableBodyArea}>
                {filteredQuestions.map((item) => (
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
                    <td>{typeOfListdata === "folder" ? fullDate(item?.createdAt) : (item?.type && item?.type === "contextualError" ? "الخطأ السياقي" : "متعدد الخيارات" ) || "متعدد الخيارات"}</td>
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
          {(!loading && filteredQuestions.length > 0) && (
            <div className={styles.paginationWrapper}>
              {/* Central pagination area */}
              <div className={styles.paginationCenter}>
                <button onClick={handlePrevPage} disabled={page === 1}>{"<"}</button>
                <span>صفحة {page} من {totalPages}</span>
                <button onClick={handleNextPage} disabled={page === totalPages}>{">"}</button>
              </div>
              {/* Direct page navigation field pinned to the right */}
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

          {filteredQuestions.length === 0 && !loading && (
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
          getQuestionsList={returnQuestionsList}
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
