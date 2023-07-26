import { ConfigProvider, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import styles from './ModelForAddItemCurriculum.module.scss'
import styled from 'styled-components';
import SearchInput from '../../antDesignCompo/SearchInput';
import { getFolderListAPI, getItemListAPI } from '../../../services/apisService';
import { useDispatch, useSelector } from 'react-redux';
import { signOutUser } from '../../../services/fireBaseAuthService';
import Table from '../../antDesignCompo/Table';
import { fullDate } from '../../../constants/DateConverter';
import Icon from '../../CommonComponents/Icon';

const StylesModal = styled(Modal)`
    .ant-modal-close{
        display:none;
    }
   .ant-modal-content{
        border-radius: 3px;
        padding: 0px
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
}) => {

    const storeData = useSelector((state) => state?.globalStore);
    const dispatch = useDispatch()
    const [selectedItem, setSelectedItem] = useState('video');
    const [folderList, setFolderList] = useState([])
    const [rowSelection, setRowSelection] = useState(false)
    const [videoFolder, setVideoFolder] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)
    const [typeOfListdata, setTypeOfListData] = useState('folder')//folder or item

    const handleClickOnIconCell = async (folderId, index) => {
        let body = {
            accessToken: storeData?.accessToken,
            folderId: folderId.id
        }
        await getItemListAPI(body).then((res) => {
            setFolderList(res.data.sort((a, b) => -a.createdAt.localeCompare(b.createdAt)))
        }).catch((error) => {
            console.log(error);
        })
        setRowSelection(true)
        setSelectedRow(index)
        setTypeOfListData("item")
    }

    const IconCell = ({ item, index }) => {
        console.log(item.type);
        return (
            <div className='flex items-center' onClick={() => handleClickOnIconCell(item, index)}>
                {typeOfListdata == "folder" && <AllIconsComponenet iconName={'folderIcon'} height={24} width={24} />}
                {typeOfListdata == "item" &&
                    <Icon
                        height={24}
                        width={24}
                        iconName={item?.type == 'video' ? "" : item?.type == 'file' ? 'pdfIcon' : 'quizNotAttemptIcon'}
                        alt={'Quiz Logo'} />}
                <p className='pr-2'>{item?.name}</p>
            </div>
        )
    }

    const data = folderList.map((item, index) => {
        return {
            itemName: <IconCell item={item} />,
            createAt: fullDate(item?.createdAt),
            updateAt: fullDate(item?.updatedAt),
            selected: selectedRow === index
        }
    })

    useEffect(() => {
        getfolderList(selectedItem)
    }, [selectedItem])

    const getfolderList = async (folderType) => {
        let data = {
            folderType: folderType,
            accessToken: storeData?.accessToken
        }
        await getFolderListAPI(data).then((res) => {
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

    const handleItemSelect = async (id) => {
        setSelectedItem(id)
        setTypeOfListData("folder")
        setRowSelection(false)
    }

    const customizeRenderEmpty = () => (
        <div className={styles.tableBodyArea}>
            <div className={styles.noDataManiArea}>
                <AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
                <p className={styles.noElements}>لا توجد عناصر بهذا المجلد</p>
                <button className={styles.libraryBtn}  >الإنتقال إلى إدارة المكتبة</button>
            </div>
        </div >
    );
    const showFolderList = () => {
        setVideoFolder(false)
        setTypeOfListData("folder")
        setRowSelection(false)
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
                            <p onClick={() => handleItemSelect('video')} className={selectedItem == 'video' ? styles.activeItem : ""}> الفيديوهات</p>
                            <p onClick={() => handleItemSelect('file')} className={selectedItem == 'file' ? styles.activeItem : ""}> الملفات </p>
                            <p onClick={() => handleItemSelect('quiz')} className={selectedItem == 'quiz' ? styles.activeItem : ""}>الاختبارات</p>
                        </div>
                    </div>
                    <div className={styles.curriculumBody}>
                        <div className={styles.searchWrapper}>
                            <SearchInput
                                placeholder={'ابحث باسم العنصر'}
                            />
                        </div>
                        {typeOfListdata == "item" &&
                            <div className={styles.folderDetailsTable}>
                                <p className={`cursor-pointer ${styles.folderDetailsVideo}`} onClick={() => showFolderList()}>مكتبة الفيديوهات</p>
                                <p className={styles.folderDetailsName}>{'>'}</p>
                                <p className={styles.folderDetailsName}> {videoFolder ? videoFolder : "الفيديوهات"}</p>
                            </div>
                        }
                        <ConfigProvider renderEmpty={customizeRenderEmpty}>
                            <Table typeOfListdata={typeOfListdata} setTypeOfListData={setTypeOfListData} rowSelection={rowSelection} selectedItem={selectedItem} tableColumns={tableColumns} tableData={data} />
                        </ConfigProvider>
                    </div>
                </div>
            </StylesModal>
        </div>
    )
}

export default ModelForAddItemCurriculum