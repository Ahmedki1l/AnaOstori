import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../components/CommonComponents/spinner';
import styles from '../../../styles/InstructorPanelStyleSheets/ManageLibrary.module.scss'
import { createFolderAPI, getFolderListAPI, getItemListAPI } from '../../../services/apisService';
import { getNewToken } from '../../../services/fireBaseAuthService';
import { useRouter } from 'next/router';
import CoursePathLibrary from '../../../components/ManageLibraryComponent/CoursePathLibrary/CoursePathLibrary'
import ManageLibraryTableComponent from '../../../components/ManageLibraryComponent/ManageLibraryTableComponent/ManageLibraryTableComponent';
import ModelForAddItemLibrary from '../../../components/ManageLibraryComponent/ModelForAddItemLibrary/ModelForAddItemLibrary';
import ModelWithOneInput from '../../../components/CommonComponents/ModelWithOneInput/ModelWithOneInput';
import BackToPath from '../../../components/CommonComponents/BackToPath';



function Index() {
    const storeData = useSelector((state) => state?.globalStore);
    const router = useRouter()
    const dispatch = useDispatch()
    const isUserInstructor = storeData?.isUserInstructor;
    const [selectedItem, setSelectedItem] = useState();
    const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false)
    const [isModelForAddItemOpen, setIsModelForAddItemOpen] = useState(false)
    const [typeOfListdata, setTypeOfListData] = useState('folder') // folder or item
    const [folderList, setFolderList] = useState([])
    const [selectedFolderId, setSelectedFolderId] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setSelectedItem(router.query.folderType ? router.query.folderType : 'video')
    }, [])

    useEffect(() => {
        getfolderList(selectedItem)
    }, [selectedItem])


    const handleItemSelect = async (selcetedItem) => {
        getfolderList(selcetedItem)
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
            folderType: selectedItem,
        }
        await getFolderListAPI(data).then((res) => {
            setFolderList(res.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
            setLoading(false)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getFolderListAPI(data).then(res => {
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
            folderId: folderId
        }
        await getItemListAPI(body).then((res) => {
            setFolderList(res.data.filter(item => item !== null).sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
            setLoading(false)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getItemListAPI(body).then(res => {
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
        }
        else {
            setIsModelForAddFolderOpen(true);
        }
    };
    const handleRoute = () => {
        router.push(`/instructorPanel/manageLibrary/createCoursePath`)
    }

    const handleCreateFolder = async ({ name }) => {
        let data = {
            data: {
                name: name,
                type: selectedItem,
            }
        }
        await createFolderAPI(data).then((res) => {
            setIsModelForAddFolderOpen(false)
            getfolderList(selectedItem)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await createFolderAPI(body).then(res => {
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
        getItemList(folderId)
    }

    return (
        <>
            {!isUserInstructor ?
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
                                {/* <div className={`flex ${styles.createCourseHeaderText}`}>
                                    <div className={`${styles.createCourseBtnBox}`}>
                                        {(selectedItem !== 'curriculum' && typeOfListdata == 'item') && <button className={`primaryStrockedBtn`} onClick={() => handleAddItems()}>{selectedItem == 'video' ? "إضافة فيديو" : selectedItem == 'file' ? "إضافة ملف" : "إضافة اختبار"}</button>}
                                    </div>
                                    <div className={`${styles.createCourseBtnBox}  mr-2`}>
                                        {selectedItem !== 'curriculum' && <button className='primarySolidBtn' onClick={() => handleAddFolder('addFolder')}> إضافة مجلد</button>}
                                        {selectedItem == 'curriculum' && <button className='primarySolidBtn' onClick={() => handleRoute()}>إضافة قسم</button>}
                                    </div>
                                </div> */}
                                <div className={`flex ${styles.createCourseHeaderText}`}>
                                    <div className={`${styles.createCourseBtnBox}  mr-2`}>
                                        {selectedItem !== 'curriculum' &&
                                            <button className='primarySolidBtn' onClick={() => handleAddItemsOrFolder()}>
                                                {typeOfListdata == 'folder' ? 'إضافة مجلد' : selectedItem == 'video' ? "إضافة فيديو" : selectedItem == 'file' ? "إضافة ملف" : "إضافة اختبار"}
                                            </button>
                                        }
                                        {selectedItem == 'curriculum' &&
                                            <button className='primarySolidBtn' onClick={() => handleRoute()}>إضافة قسم</button>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={styles.navItems}>
                                <p onClick={() => handleItemSelect('video')} className={selectedItem == 'video' ? styles.activeItem : ""}> الفيديوهات</p>
                                <p onClick={() => handleItemSelect('file')} className={selectedItem == 'file' ? styles.activeItem : ""}> الملفات </p>
                                <p onClick={() => handleItemSelect('quiz')} className={selectedItem == 'quiz' ? styles.activeItem : ""}>الاختبارات</p>
                                <p onClick={() => handleItemSelect('curriculum')} className={selectedItem == 'curriculum' ? styles.activeItem : ""}>المقررات</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='maxWidthDefault p-4'>
                            {(selectedItem == 'video' || selectedItem == 'file' || selectedItem == 'quiz') &&
                                <ManageLibraryTableComponent
                                    onclose={onclose}
                                    folderTableData={folderList}
                                    getItemList={getItemList}
                                    getFolderList={getfolderList}
                                    folderType={selectedItem}
                                    setSelectedFolderId={setSelectedFolderId}
                                    typeOfListdata={typeOfListdata}
                                    setTypeOfListData={setTypeOfListData}
                                    loading={loading}
                                    setLoading={setLoading}
                                />
                            }
                            {selectedItem == 'curriculum' &&
                                <CoursePathLibrary />
                            }
                        </div>
                    </div>
                </div>
            }
            <ModelWithOneInput
                open={isModelForAddFolderOpen}
                setOpen={setIsModelForAddFolderOpen}
                onSave={handleCreateFolder}
                onDelete={handleDeleteSection}
                isEdit={false}
            />
            {isModelForAddItemOpen &&
                <ModelForAddItemLibrary
                    isModelForAddItemOpen={isModelForAddItemOpen}
                    folderType={selectedItem}
                    selectedFolderId={selectedFolderId}
                    onCloseModal={handleModelClose}
                />}
        </>
    )
}

export default Index

