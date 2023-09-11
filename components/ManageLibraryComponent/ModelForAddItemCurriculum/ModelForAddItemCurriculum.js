import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import styles from './ModelForAddItemCurriculum.module.scss'
import styled from 'styled-components';
import SearchInput from '../../antDesignCompo/SearchInput';
import { getFolderListAPI, getItemListAPI } from '../../../services/apisService';
import { useDispatch } from 'react-redux';
import { signOutUser } from '../../../services/fireBaseAuthService';
import Table from '../../antDesignCompo/Table';
import { fullDate } from '../../../constants/DateConverter';
import Icon from '../../CommonComponents/Icon';
import { useRouter } from 'next/router';
import BackToPath from '../../CommonComponents/BackToPath';

const StylesModal = styled(Modal)`
    .ant-modal-close{
        display:none;
    }
   .ant-modal-content{
        border-radius: 3px;
        padding: 0px;
    }
`
const tableColumns = [
    {
        title: 'العنوان',
        dataIndex: 'itemName',
    },
    {
        title: 'تاريخ الإنشاء',
        dataIndex: 'createAt',
    },
    {
        title: 'تاريخ اخر تعديل',
        dataIndex: 'updateAt',
    },
];


const ModelForAddItemCurriculum = ({
    isModelForAddCurriculum,
    setIsModelForAddCurriculum,
    onclose,
    handleAddItemtoSection,
}) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [selectedFolderType, setSelectedFolderType] = useState('video');
    const [folderList, setFolderList] = useState([])
    const [rowSelection, setRowSelection] = useState(false)
    const [videoFolder, setVideoFolder] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)
    const [typeOfListdata, setTypeOfListData] = useState('folder')//folder or item
    const [selectedItems, setSelectedItems] = useState([]);
    const [tableLoading, setTableLoading] = useState(false)
    const [backpathForTabel, setBackPathForTabel] = useState(true)
    const [folderName, setFolderName] = useState()

    const IconCell = ({ item, index, icontype }) => {
        return (
            <div className='flex items-center' onClick={() => handleClickOnIconCell(item, index)}>
                {icontype == "folder" && <AllIconsComponenet iconName={'folderIcon'} height={24} width={24} />}
                {icontype == "item" &&
                    <Icon
                        height={24}
                        width={24}
                        iconName={item?.type == 'video' ? "videoIcon" : item?.type == 'file' ? 'pdfIcon' : 'quizNotAttemptIcon'}
                        alt={'Quiz Logo'} />}
                <p className='pr-2'>{item?.name}</p>
            </div>
        )
    }
    const handleClickOnIconCell = async (folderId, index) => {
        setTableLoading(true)
        let body = {
            folderId: folderId.id
        }
        await getItemListAPI(body).then((res) => {
            setTypeOfListData("item")

            let data = res.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)).map((item) => {
                return {
                    itemName: <IconCell item={item} icontype={"item"} />,
                    createAt: fullDate(item?.createdAt),
                    updateAt: fullDate(item?.updatedAt),
                    key: item.id
                }
            })
            setFolderList(data)
            setTableLoading(false)
        }).catch((error) => {
            setTableLoading(false)
            setFolderList([])
            console.log(error);
        })
        setRowSelection(true)
        setSelectedRow(index)
    }


    useEffect(() => {
        getfolderList(selectedFolderType)
    }, [selectedFolderType])

    const getfolderList = async (folderType) => {
        setTableLoading(true)
        let data = {
            folderType: folderType,
        }
        await getFolderListAPI(data).then((res) => {
            setFolderName(res.data)
            setTypeOfListData("folder")
            let data = res.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)).map((item) => {
                return {
                    itemName: <IconCell item={item} icontype={"folder"} />,
                    createAt: fullDate(item?.createdAt),
                    updateAt: fullDate(item?.updatedAt),
                    key: item.id
                }
            })
            setRowSelection(false)
            setFolderList(data)
            setTableLoading(false)
        }).catch((error) => {
            console.log(error);
            setTableLoading(false)
            setFolderList([])
            if (error?.response?.status == 401) {
                signOutUser()
                dispatch({
                    type: 'EMPTY_STORE'
                });
            }
        })
    }

    const handleItemSelect = async (type) => {
        setSelectedFolderType(type)
        setRowSelection(false)
    }

    const showFolderList = () => {
        setVideoFolder(false)
        getfolderList(selectedFolderType)
    }

    const handleItemAddInToSection = async () => {
        handleAddItemtoSection(selectedItems)
        setSelectedItems([])
        showFolderList()
    }

    const onItemSelection = (itelList) => {
        setSelectedItems(itelList)
    }

    const onEmptyBtnClick = () => {
        router.push({
            pathname: `/instructorPanel/manageLibrary/`,
            query: { folderType: selectedFolderType },
        });
    }
    return (
        <div>
            <StylesModal
                open={isModelForAddCurriculum}
                onCancel={() => setIsModelForAddCurriculum(false)}
                footer={null}
                afterClose={onclose}
                width={766}
            >
                <div dir='rtl'>
                    <div className={styles.curriculumHead}>
                        <div className={styles.modalHeader}>
                            <p className={`fontBold ${styles.createappointment}`}>إضافة عناصر</p>
                            <button onClick={() => setIsModelForAddCurriculum(false)} className={styles.closebutton}>
                                <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                        </div>
                        <div className={styles.navItems}>
                            <p onClick={() => handleItemSelect('video')} className={selectedFolderType == 'video' ? styles.activeItem : ""}> الفيديوهات</p>
                            <p onClick={() => handleItemSelect('file')} className={selectedFolderType == 'file' ? styles.activeItem : ""}> الملفات </p>
                            <p onClick={() => handleItemSelect('quiz')} className={selectedFolderType == 'quiz' ? styles.activeItem : ""}>الاختبارات</p>
                        </div>
                    </div>
                    <div className={styles.curriculumBody}>
                        <div className={styles.searchWrapper}>
                            <SearchInput
                                placeholder={'ابحث باسم العنصر'}
                            />
                        </div>
                        {typeOfListdata == "item" &&
                            <div className={`px-2 ${styles.folderDetailsTable}`}>
                                <BackToPath
                                    backpathForTabel={backpathForTabel}
                                    backPathArray={
                                        [
                                            { lable: 'مكتبة الملفات', handleClick: showFolderList },
                                            { lable: 'folderName', link: null },
                                        ]
                                    }
                                />
                            </div>
                        }
                        <Table
                            typeOfListdata={typeOfListdata}
                            minheight={typeOfListdata == "item" ? 250 : 400}
                            rowSelection={rowSelection}
                            tableColumns={tableColumns}
                            tableData={folderList.length > 0 ? folderList : []}
                            onItemSelection={onItemSelection}
                            tableLoading={tableLoading}
                            onEmptyBtnClick={onEmptyBtnClick}
                            selectedItems={selectedItems}
                        />
                        {typeOfListdata == "item" &&
                            <div className={styles.createSectionBtnBox}>
                                <button className='primarySolidBtn' type='submit' onClick={() => handleItemAddInToSection()}>إضافة x عنصر</button>
                            </div>
                        }
                    </div>
                </div>
            </StylesModal>
        </div>
    )
}

export default ModelForAddItemCurriculum