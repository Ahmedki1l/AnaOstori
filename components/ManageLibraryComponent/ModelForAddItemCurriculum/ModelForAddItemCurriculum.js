import { ConfigProvider, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import styles from './ModelForAddItemCurriculum.module.scss'
import styled from 'styled-components';
import { FormItem } from '../../antDesignCompo/FormItem';
import SearchInput from '../../antDesignCompo/SearchInput';
import ManageLibraryTableComponent from '../ManageLibraryTableComponent/ManageLibraryTableComponent';
import { getFolderListAPI } from '../../../services/apisService';
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

    const handleSelectedFolder = (item) => {
        console.log(item);
        setRowSelection(true)
        return {
            itemName: <IconCell item={item.name} />,
            createAt: fullDate(item.createdAt),
            updateAt: fullDate(item.updatedAt),
        }
    }

    const IconCell = ({ item }) => {
        return (
            <div className='flex items-center' onClick={() => handleSelectedFolder(item)}>
                {<AllIconsComponenet iconName={'folderIcon'} height={24} width={24} />}
                <p className='pr-2'>{item.name}</p>
            </div>
        )
    }

    const data = folderList.map((item, index) => {
        return {
            itemName: <IconCell item={item} />,
            createAt: fullDate(item.createdAt),
            updateAt: fullDate(item.updatedAt),
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

    const handleDeleteCurriculum = () => {
        onclose()
    };

    const handleItemSelect = async (id) => {
        setSelectedItem(id)
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
                        <ConfigProvider renderEmpty={customizeRenderEmpty}>
                            <Table rowSelection={rowSelection} selectedItem={selectedItem} tableColumns={tableColumns} tableData={data} />
                        </ConfigProvider>
                    </div>
                </div>
            </StylesModal>
        </div>
    )
}

export default ModelForAddItemCurriculum