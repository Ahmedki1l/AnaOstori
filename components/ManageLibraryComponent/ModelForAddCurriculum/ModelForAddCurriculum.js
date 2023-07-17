import { Modal } from 'antd'
import React, { useState } from 'react'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import styles from './ModelForAddCurriculum.module.scss'
import styled from 'styled-components';
import { FormItem } from '../../antDesignCompo/FormItem';
import SearchInput from '../../antDesignCompo/SearchInput';

const StylesModal = styled(Modal)`
    .ant-modal-close{
        display:none;
    }
   .ant-modal-content{
        border-radius: 3px;
        padding: 0px
    }
`


const ModelForAddCurriculum = ({
    isModelForAddCurriculum,
    setIsModelForAddCurriculum,
    onclose,
}) => {
    const [selectedItem, setSelectedItem] = useState(1);


    const handleDeleteCurriculum = () => {
        onclose()
    };
    const handleItemSelect = async (id) => {
        setSelectedItem(id)
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
                            <p onClick={() => handleItemSelect(1)} className={selectedItem == 1 ? styles.activeItem : ""}> الفيديوهات</p>
                            <p onClick={() => handleItemSelect(2)} className={selectedItem == 2 ? styles.activeItem : ""}> الملفات </p>
                            <p onClick={() => handleItemSelect(3)} className={selectedItem == 3 ? styles.activeItem : ""}>الاختبارات</p>
                        </div>
                    </div>
                    <div className={styles.curriculumBody}>
                        <div className='p-4'>
                            <SearchInput
                                placeholder={'ابحث باسم العنصر'}
                            />
                        </div>
                    </div>
                </div>
            </StylesModal>
        </div>
    )
}

export default ModelForAddCurriculum