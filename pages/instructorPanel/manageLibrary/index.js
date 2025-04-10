import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Spinner from '../../../components/CommonComponents/spinner';
import styles from '../../../styles/InstructorPanelStyleSheets/ManageLibrary.module.scss'
import { getAuthRouteAPI, getRouteAPI, postAuthRouteAPI } from '../../../services/apisService';
import { getNewToken } from '../../../services/fireBaseAuthService';
import { useRouter } from 'next/router';
import CoursePathLibrary from '../../../components/ManageLibraryComponent/CoursePathLibrary/CoursePathLibrary'
import QuestionsBankComponent from '../../../components/ExamComponents/QuestionsBankComponent';
import ManageLibraryTableComponent from '../../../components/ManageLibraryComponent/ManageLibraryTableComponent/ManageLibraryTableComponent';
import ModelForAddItemLibrary from '../../../components/ManageLibraryComponent/ModelForAddItemLibrary/ModelForAddItemLibrary';
import ModelWithOneInput from '../../../components/CommonComponents/ModelWithOneInput/ModelWithOneInput';
import BackToPath from '../../../components/CommonComponents/BackToPath';
import { toast } from 'react-toastify';
import { commonLibraryConst, folderConst } from '../../../constants/adminPanelConst/manageLibraryConst/manageLibraryConst';


function Index() {
    const storeData = useSelector((state) => state?.globalStore);
    const router = useRouter()
    const isUserInstructor = storeData?.isUserInstructor;
    const [selectedItem, setSelectedItem] = useState('');
    const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false)
    const [isModelForAddItemOpen, setIsModelForAddItemOpen] = useState(false)
    const [typeOfListdata, setTypeOfListData] = useState('folder') // folder or item
    const [folderList, setFolderList] = useState([])
    const [selectedFolderId, setSelectedFolderId] = useState()
    const [loading, setLoading] = useState(false)
    const [existingItemName, setExistingItemName] = useState()
    const [cancleUpload, setCancleUpload] = useState(false)

    useEffect(() => {
        setSelectedItem(router.query.folderType ? router.query.folderType : 'video')
        if (router.query.folderType !== 'curriculum') {
            getfolderList(router.query.folderType)
        }
    }, [router.query.folderType])

    useEffect(() => {
        setExistingItemName(folderList.map(item => item.name))
    }, [folderList])

    const handleItemSelect = async (selcetedItem) => {
        setSelectedItem(selcetedItem)
        router.push({
            pathname: '/instructorPanel/manageLibrary',
            query: { folderType: selcetedItem }
        })
        setTypeOfListData("folder")
        setLoading(true)
    }

    const getfolderList = async (selectedItem) => {
        setFolderList([])
        setLoading(true)
        let data = {
            routeName: 'getFolderByType',
            type: selectedItem
        }
        await getAuthRouteAPI(data).then((res) => {
            setFolderList(res.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
            setLoading(false)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getAuthRouteAPI(data).then(res => {
                        setFolderList(res.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
                        setLoading(false)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
            setLoading(false)
        })
    }

    const getItemList = async (folderId) => {
        setFolderList([])
        setLoading(true)
        let body = {
            routeName: 'getItem',
            folderId: folderId
        }
        await getRouteAPI(body).then((res) => {
            setFolderList(res.data.filter(item => item !== null).sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
            setLoading(false)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getRouteAPI(body).then(res => {
                        setFolderList(res.data.filter(item => item !== null).sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
                        setLoading(false)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
            setLoading(false)
            console.log(error);
        })
    }

    const handleAddItemsOrFolder = () => {
        if (typeOfListdata == 'item') {
            setIsModelForAddItemOpen(true);
            setCancleUpload(false)
        }
        else {
            setIsModelForAddFolderOpen(true);
        }
    };
    const handleRoute = () => {
        router.push(`/instructorPanel/manageLibrary/createCoursePath`)
    }
    const handleCreateFolder = async ({ name }) => {
        if (existingItemName.includes(name)) {
            toast.error(commonLibraryConst.nameDuplicateErrorMsg, { rtl: true, })
            return
        }
        let data = {
            routeName: 'createFolder',
            name: name,
            type: selectedItem,
        }
        await postAuthRouteAPI(data).then((res) => {
            toast.success(folderConst.folderToastMsgConst.createFolderSuccessMsg, { rtl: true, })
            setIsModelForAddFolderOpen(false)
            getfolderList(selectedItem)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postAuthRouteAPI(data).then(res => {
                        toast.success(folderConst.folderToastMsgConst.createFolderSuccessMsg, { rtl: true, })
                        setIsModelForAddFolderOpen(false)
                        getfolderList(selectedItem)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
            console.log(error);
        })
    }

    const handleDeleteSection = () => {
        // don't delete 
    }
    const handleModelClose = (folderId) => {
        setIsModelForAddItemOpen(false)
        setCancleUpload(true)
        // getItemList(folderId)
    }

    return (
        <>
            {(!isUserInstructor && selectedItem) ?
                <div className='flex justify-center items-center'>
                    <Spinner />
                </div>
                :
                <div>
                    <div className={styles.borderBottomNavbar}>
                        <div className='maxWidthDefault px-4'>
                            <div className='m-0'>
                                <BackToPath
                                    backpathForPage={true}
                                    backPathArray={
                                        [
                                            { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                                            { lable: 'إدارة المكتبة الرقمية', link: null },
                                        ]
                                    }
                                />
                            </div>
                            <div className={`${styles.headerWrapper}`}>
                                <div>
                                    <h1 className={`head2 py-8`}>إدارة المكتبة الرقمية</h1>
                                </div>
                                <div className={`flex ${styles.createCourseHeaderText}`}>
                                    <div className={`${styles.createCourseBtnBox}  mr-2`}>
                                        {selectedItem !== 'curriculum' &&
                                            <button className='primarySolidBtn' onClick={() => handleAddItemsOrFolder()}>
                                                {typeOfListdata == 'folder' ? 'إضافة مجلد' : selectedItem == 'video' ? "إضافة فيديو" : selectedItem == 'file' ? "إضافة ملف" : "إضافة اختبار"}
                                            </button>
                                        }
                                        {selectedItem == 'curriculum' &&
                                            <button className='primarySolidBtn' onClick={() => handleRoute()}>إضافة مقرر</button>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={styles.navItems}>
                                <p onClick={() => handleItemSelect('video')} className={selectedItem == 'video' ? styles.activeItem : ""}> الفيديوهات</p>
                                <p onClick={() => handleItemSelect('file')} className={selectedItem == 'file' ? styles.activeItem : ""}> الملفات </p>
                                <p onClick={() => handleItemSelect('questions')} className={selectedItem == 'questions' ? styles.activeItem : ""}> بنك الأسئلة </p>
                                <p onClick={() => handleItemSelect('quiz')} className={selectedItem == 'quiz' ? styles.activeItem : ""}>الاختبارات</p>
                                <p onClick={() => handleItemSelect('curriculum')} className={selectedItem == 'curriculum' ? styles.activeItem : ""}>المقررات</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='maxWidthDefault p-4'>
                            {(selectedItem == 'video' || selectedItem == 'file' || selectedItem == 'quiz') &&
                                <ManageLibraryTableComponent
                                    folderTableData={folderList}
                                    getItemList={getItemList}
                                    getFolderList={getfolderList}
                                    folderType={selectedItem}
                                    setSelectedFolderId={setSelectedFolderId}
                                    typeOfListdata={typeOfListdata}
                                    setTypeOfListData={setTypeOfListData}
                                    loading={loading}
                                    handleCreateFolder={handleCreateFolder}
                                />
                            }
                            {selectedItem == 'curriculum' &&
                                <CoursePathLibrary folderType={selectedItem} />
                            }
                            {selectedItem == 'questions' &&
                                <QuestionsBankComponent
                                    questionsData={folderList}
                                    typeOfListdata={typeOfListdata}
                                    setTypeOfListData={setTypeOfListData}
                                    setSelectedFolderId={setSelectedFolderId}
                                    getQuestionsList={getfolderList}
                                    getFolderList={getfolderList}
                                    loading={loading}
                                    handleCreateFolder={handleCreateFolder}
                                />
                            }
                        </div>
                    </div>
                </div>
            }
            {isModelForAddFolderOpen &&
                <ModelWithOneInput
                    open={isModelForAddFolderOpen}
                    setOpen={setIsModelForAddFolderOpen}
                    onSave={handleCreateFolder}
                    onDelete={handleDeleteSection}
                    isEdit={false}
                    curriCulumSection={'folder'}
                />}
            {isModelForAddItemOpen &&
                <ModelForAddItemLibrary
                    isModelForAddItemOpen={isModelForAddItemOpen}
                    folderType={selectedItem}
                    selectedFolderId={selectedFolderId}
                    onCloseModal={handleModelClose}
                    getItemList={getItemList}
                    existingItemName={existingItemName}
                    cancleUpload={cancleUpload}
                />
            }
        </>
    )
}

export default Index

