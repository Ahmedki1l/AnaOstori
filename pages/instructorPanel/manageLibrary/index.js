import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Spinner from '../../../components/CommonComponents/spinner';
import styles from '../../../styles/InstructorPanelStyleSheets/ManageLibrary.module.scss'
import ModelForAddFolder from '../../../components/CommonComponents/ModelForAddFolder/ModelForAddFolder';
import ModelForAddItems from '../../../components/CommonComponents/ModelForAddItems/ModelForAddItems';
import VideosLibrary from '../../../components/ManageLibraryComponent/videosLibrary/videosLibrary';
import FilesLibrary from '../../../components/ManageLibraryComponent/filesLibrary/filesLibrary';
import ExamsLibrary from '../../../components/ManageLibraryComponent/examsLibrary/examsLibrary';
import CoursePathLibrary from '../../../components/ManageLibraryComponent/coursePathLibrary/coursePathLibrary';


function Index() {
    const storeData = useSelector((state) => state?.globalStore);
    const isUserInstructor = storeData?.isUserInstructor;
    const [selectedItem, setSelectedItem] = useState(1);
    const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false)
    const [isModelForAddItemsOpen, setIsModelForAddItemsOpen] = useState(false)
    const [isModalForAddItem, setIsModalForAddItem] = useState(false)
    const [isModalForAddFolder, setIsModalForAddFolder] = useState(false)


    const handleItemSelect = (id) => {
        setSelectedItem(id)
    }
    const handleAddFolder = (type) => {
        if (type == 'addFolder') setIsModalForAddFolder(true)
        setIsModelForAddFolderOpen(true);
    };
    const handleAddItems = () => {
        setIsModelForAddItemsOpen(true);
    };

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
                                        <button className={`primaryStrockedBtn`} onClick={() => handleAddItems()}> إضافة فيديو</button>
                                    </div>
                                    <div className={`${styles.createCourseBtnBox}  mr-2`}>
                                        <button className='primarySolidBtn' onClick={() => handleAddFolder('addFolder')}> إضافة مجلد</button>
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
                            {selectedItem == 1 && <VideosLibrary setIsModalForAddItem={setIsModalForAddItem} />}
                            {selectedItem == 2 && <FilesLibrary />}
                            {selectedItem == 3 && <ExamsLibrary />}
                            {selectedItem == 4 && <CoursePathLibrary />}
                        </div>
                    </div>
                </div>
            }
            <ModelForAddFolder
                isModelForAddFolderOpen={isModelForAddFolderOpen}
                setIsModelForAddFolderOpen={setIsModelForAddFolderOpen}
                isModalForAddFolder={isModalForAddFolder}
            />
            <ModelForAddItems
                isModelForAddItemsOpen={isModelForAddItemsOpen}
                setIsModelForAddItemsOpen={setIsModelForAddItemsOpen}
            />
        </>
    )
}

export default Index

