import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../components/CommonComponents/spinner';
import styles from '../../../styles/InstructorPanelStyleSheets/ManageLibrary.module.scss'
import { createFolderAPI, getFolderListAPI, getItemListAPI } from '../../../services/apisService';
import { signOutUser } from '../../../services/fireBaseAuthService';
import { useRouter } from 'next/router';
import CoursePathLibrary from '../../../components/ManageLibraryComponent/CoursePathLibrary/CoursePathLibrary'
import ManageLibraryTableComponent from '../../../components/ManageLibraryComponent/ManageLibraryTableComponent/ManageLibraryTableComponent';
import ModelForAddItemLibrary from '../../../components/ManageLibraryComponent/ModelForAddItemLibrary/ModelForAddItemLibrary';
import ModelWithOneInput from '../../../components/CommonComponents/ModelWithOneInput/ModelWithOneInput';



function Index() {
    const storeData = useSelector((state) => state?.globalStore);
    const router = useRouter()
    const dispatch = useDispatch()
    const isUserInstructor = storeData?.isUserInstructor;
    const [selectedItem, setSelectedItem] = useState(router.query.folderType ? router.query.folderType : 'video');
    const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false)
    const [isModelForAddItemOpen, setIsModelForAddItemOpen] = useState(false)
    const [typeOfListdata, setTypeOfListData] = useState('folder') // folder or item
    const [folderList, setFolderList] = useState([])
    const [selectedFolderId, setSelectedFolderId] = useState()
    const [loading, setLoading] = useState(false)

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
        }).catch((error) => {
            console.log(error);
            setLoading(false)
            if (error?.response?.status == 401) {
                signOutUser()
                dispatch({
                    type: 'EMPTY_STORE'
                });
            }
        })
    }

    const getItemList = async (folderId) => {
        setFolderList([])
        setLoading(true)
        let body = {
            folderId: folderId
        }
        await getItemListAPI(body).then((res) => {
            setFolderList(res.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
            setLoading(false)
        }).catch((error) => {
            setLoading(false)
            console.log(error);
        })
    }

    const handleAddFolder = () => {
        setIsModelForAddFolderOpen(true);
    };
    const handleAddItems = () => {
        setIsModelForAddItemOpen(true);
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
        console.log(data);
        await createFolderAPI(data).then((res) => {
            console.log(res);
            setIsModelForAddFolderOpen(false)
            getfolderList(selectedItem)
        })
    }

    const handleDeleteSection = () => {
        // don't delete 
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
                            <div className={`${styles.headerWrapper}`}>
                                <div>
                                    <h1 className={`head2 py-8`}>مكتبة المرفقات</h1>
                                </div>
                                <div className={`flex ${styles.createCourseHeaderText}`}>
                                    <div className={`${styles.createCourseBtnBox}`}>
                                        {(selectedItem !== 'curriculum' && typeOfListdata == 'item') && <button className={`primaryStrockedBtn`} onClick={() => handleAddItems()}>{selectedItem == 'video' ? "إضافة فيديو" : selectedItem == 'file' ? "إضافة ملف" : "إضافة اختبار"}</button>}
                                    </div>
                                    <div className={`${styles.createCourseBtnBox}  mr-2`}>
                                        {selectedItem !== 'curriculum' && <button className='primarySolidBtn' onClick={() => handleAddFolder('addFolder')}> إضافة مجلد</button>}
                                        {selectedItem == 'curriculum' && <button className='primarySolidBtn' onClick={() => handleRoute()}>إضافة قسم</button>}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.navItems}>
                                <p onClick={() => handleItemSelect('video')} className={selectedItem == 'video' ? styles.activeItem : ""}> والغياب</p>
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
            <ModelForAddItemLibrary
                isModelForAddItemOpen={isModelForAddItemOpen}
                folderType={selectedItem}
                setIsModelForAddItemOpen={setIsModelForAddItemOpen}
                selectedFolderId={selectedFolderId}
            />
        </>
    )
}

export default Index

