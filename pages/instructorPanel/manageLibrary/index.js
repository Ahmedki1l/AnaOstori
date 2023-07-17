import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../components/CommonComponents/spinner';
import styles from '../../../styles/InstructorPanelStyleSheets/ManageLibrary.module.scss'
import { getFolderListAPI } from '../../../services/apisService';
import { signOutUser } from '../../../services/fireBaseAuthService';
import { useRouter } from 'next/router';
import ModelForAddFolder from '../../../components/ManageLibraryComponent/ModelForAddFolder/ModelForAddFolder';
import CoursePathLibrary from '../../../components/ManageLibraryComponent/CoursePathLibrary/CoursePathLibrary'
import ManageLibraryTableComponent from '../../../components/ManageLibraryComponent/ManageLibraryTableComponent/ManageLibraryTableComponent';
import ModelForAddItemLibrary from '../../../components/ManageLibraryComponent/ModelForAddItemLibrary/ModelForAddItemLibrary';



function Index() {
    const storeData = useSelector((state) => state?.globalStore);
    const router = useRouter()
    const dispatch = useDispatch()
    const isUserInstructor = storeData?.isUserInstructor;
    const [selectedItem, setSelectedItem] = useState(4);
    const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false)
    const [isModelForAddItemOpen, setIsModelForAddItemOpen] = useState(false)
    const [folderType, setFolderType] = useState("video")
    const [folderList, setFolderList] = useState([])

    useEffect(() => {
        getfolderList(folderType)
    }, [folderType])

    const onModelClose = () => {
        getfolderList(folderType)
    }

    const handleItemSelect = async (id) => {
        setSelectedItem(id)
        setFolderType(id == 1 ? "video" : id == 2 ? "file" : id == 2 ? "quiz" : 'curriculumItem')
    }

    const getfolderList = async (folderType) => {
        let data = {
            folderType: folderType,
            accessToken: storeData?.accessToken
        }
        await getFolderListAPI(data).then((res) => {
            console.log(res);
            setFolderList(res.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
        }).catch((error) => {
            console.log(error);
            if (error?.response?.status == 401) {
                signOutUser()
                dispatch({
                    type: 'EMPTY_STORE'
                });
            }
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
                                        {selectedItem !== 4 && <button className={`primaryStrockedBtn`} onClick={() => handleAddItems()}>{selectedItem == 1 ? "إضافة فيديو" : selectedItem == 2 ? "إضافة ملف" : "إضافة اختبار"}</button>}
                                    </div>
                                    <div className={`${styles.createCourseBtnBox}  mr-2`}>
                                        {selectedItem !== 4 && <button className='primarySolidBtn' onClick={() => handleAddFolder('addFolder')}> إضافة مجلد</button>}
                                        {selectedItem == 4 && <button className='primarySolidBtn' onClick={() => handleRoute()}>إنشاء مقرر</button>}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.navItems}>
                                <p onClick={() => handleItemSelect(1)} className={selectedItem == 1 ? styles.activeItem : ""}> والغياب</p>
                                <p onClick={() => handleItemSelect(2)} className={selectedItem == 2 ? styles.activeItem : ""}> الملفات </p>
                                <p onClick={() => handleItemSelect(3)} className={selectedItem == 3 ? styles.activeItem : ""}>الاختبارات</p>
                                <p onClick={() => handleItemSelect(4)} className={selectedItem == 4 ? styles.activeItem : ""}>المقررات</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className='maxWidthDefault p-4'>
                            {(selectedItem == 1 || selectedItem == 2 || selectedItem == 3) && <ManageLibraryTableComponent onclose={onclose} folderTableData={folderList} folderType={folderType} />}
                            {selectedItem == 4 && <CoursePathLibrary folderTableData={folderList} onclose={onclose} folderType={folderType} />}
                        </div>
                    </div>
                </div>
            }
            <ModelForAddFolder
                isModelForAddFolderOpen={isModelForAddFolderOpen}
                setIsModelForAddFolderOpen={setIsModelForAddFolderOpen}
                folderType={folderType}
                onclose={onModelClose}
            />
            <ModelForAddItemLibrary
                isModelForAddItemOpen={isModelForAddItemOpen}
                folderType={folderType}
                setIsModelForAddItemOpen={setIsModelForAddItemOpen}
            />
        </>
    )
}

export default Index

