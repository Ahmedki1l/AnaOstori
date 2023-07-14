import React from 'react'
import styles from "./CoursePathLibrary.module.scss"
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import Icon from '../../CommonComponents/Icon'
import { fullDate } from '../../../constants/DateConverter'

const CoursePathLibrary = ({ folderTableData, tableDataType, folderType }) => {


    const handleDeleteFolderItems = () => {
        // setIsmodelForDeleteItems(true)
    }
    return (
        <div>
            <div className={styles.tableContainer}>
                <div>
                    {tableDataType == "item" &&
                        <div>
                            <div className={styles.folderDetailsTable}>
                                <p className={`cursor-pointer ${styles.folderDetailsVideo}`} onClick={() => showFolderList()}>الفيديوهات</p>
                                <p>{'>'}</p>
                                <p className={styles.folderDetailsName}> {selectedItem.name ? selectedItem.name : "الفيديوهات"}</p>
                            </div>
                        </div>
                    }
                    <table className={styles.tableArea}>
                        <thead className={styles.tableHeaderArea}>
                            <tr>
                                <th className={`${styles.tableHeadText} ${styles.tableHead1}`}>عنوان المقرر</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>تاريخ الإنشاء  </th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead3}`}>اخر تعديل</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead4}`}>حالة الاستخدام</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead5}`}>الإجراءات</th>
                            </tr>
                        </thead>
                        {folderTableData.length > 0 &&
                            <tbody className={styles.tableBodyArea}>
                                {folderTableData.map((item, index) => {
                                    return (
                                        <>
                                            <tr className={styles.tableRow} key={item.id}>
                                                <td>
                                                    <div className={styles.videoFolderList} onClick={() => showItemListOfSelectedFolder(item)}>
                                                        {tableDataType == "folder" ?
                                                            <AllIconsComponenet iconName={'folderIcon'} height={24} width={24} />
                                                            :
                                                            <Icon
                                                                height={24}
                                                                width={24}
                                                                iconName={folderType == 'quiz' ? 'quizNotAttemptIcon' : folderType == 'file' ? 'pdfIcon' : 'videoIcon'}
                                                                alt={'Quiz Logo'} />
                                                        }
                                                        <p className={`cursor-pointer ${styles.numberOfAddedVideoNames}`}>{item?.name}</p>
                                                        <p className={styles.numberOfAddedVideo}>{` (${item?.numberOfItem}  عنصر / عناصر  )`}</p>
                                                    </div>
                                                </td>
                                                <td>{fullDate(item?.createdAt)}</td>
                                                <td>{fullDate(item?.updatedAt)}</td>
                                                <td>دورة القدرات الحضورية</td>
                                                <td>
                                                    <div className={styles.videoeventButtons}>
                                                        <div className='cursor-pointer' onClick={() => onEdit(item)}>
                                                            <AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#000000'} />
                                                        </div>
                                                        <div className='cursor-pointer' onClick={() => handleDeleteFolderItems()}>
                                                            <AllIconsComponenet iconName={'deletecourse'} height={18} width={18} color={'#000000'} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    )
                                })}
                            </tbody >
                        }
                    </table>
                    {folderTableData.length == 0 &&
                        <div className={styles.tableBodyArea}>
                            <div className={styles.noDataMainArea}>
                                <div>
                                    <AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
                                    <p className={`fontBold py-2 ${styles.raisedcontent}`}>ما رفعت أي محتوى</p>
                                    <div className={styles.createCourseBtnBox}>
                                        <button className='primarySolidBtn'>إضافة مجلد</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default CoursePathLibrary