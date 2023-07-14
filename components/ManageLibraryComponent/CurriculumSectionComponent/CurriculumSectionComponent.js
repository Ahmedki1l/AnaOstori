import React, { Fragment, useEffect } from 'react'
import styles from './CurriculumSectionComponent.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { useState } from 'react'
import Icon from '../../CommonComponents/Icon'
import ModelForDeleteItems from '../ModelForDeleteItems/ModelForDeleteItems'

const dummyData = [
    {
        sectionName: 'section1',
        showSectionList: false,
        itemList: []
    },
    {
        sectionName: 'section2',
        showSectionList: false,
        itemList: []
    },
    {
        sectionName: 'section3',
        showSectionList: false,
        itemList: [
            {
                itemName: 'video1',
                itemType: 'video',
                discription: "20 دقيقة"
            },
            {
                itemName: 'file1',
                itemType: 'file',
                discription: "20 دقيقة"
            },
            {
                itemName: 'folder1',
                itemType: 'folder',
                discription: "20 دقيقة"
            }
        ]
    },
    {
        sectionName: 'section4',
        showSectionList: false,
        itemList: []
    }
]
const CurriculumSectionComponent = ({ folderType }) => {
    console.log(folderType);

    const [sectionDetails, setSectionDetails] = useState(dummyData)
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)
    const [tableDataType, setTableDataType] = useState("folder")

    const showSectionItem = (index) => {
        console.log(index);
        const data = [...sectionDetails]
        data[index].showSectionList = !data[index].showSectionList
        setSectionDetails(data)
    }

    const handleDeleteFolderItems = () => {
        setIsmodelForDeleteItems(true)
    }
    const onCloseModal = () => {
        setIsmodelForDeleteItems(false)
    }


    return (
        <div>
            <div className={styles.addSectionArea}>
                <p className={styles.sectionName}>الأقسام</p>
                <p className={styles.addSections} onClick={() => add()}>+ إضافة قسم</p>
            </div>
            {sectionDetails.map((section, index) => {
                const { showSectionList } = section
                return (
                    <div key={`section ${index}`} className='mb-4'>
                        <div className={styles.curriculimSectionHead}>
                            <div className={styles.curriculimHeadText}>
                                <AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#FFFFFF'} />
                                <p className={styles.sectionTitle}>{section.sectionName}</p>
                                <p className={styles.numberOfItems}>(0 عنصر)</p>
                            </div>
                            <div className={styles.headerActionWrapper} >
                                <div><AllIconsComponenet iconName={'plus'} height={24} width={24} alt={'key'} color={'#FFFFFF'} /></div>
                                <div><AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#FFFFFF'} /></div>
                                <div onClick={() => handleDeleteFolderItems()}><AllIconsComponenet iconName={'deletecourse'} height={20} width={20} color={'#FFFFFF'} /></div>
                                <div className={`${styles.arrowIcon} ${showSectionList && 'rotate-180'}`} onClick={() => showSectionItem(index)}>
                                    <svg width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.4819 11.386C17.7674 12.1735 16.7732 12.2352 15.9 11.386L9.49827 4.77389L3.0967 11.386C2.22335 12.2352 1.22733 12.1735 0.518761 11.386C0.185286 10.9984 0 10.4894 0 9.96095C0 9.43246 0.185286 8.92348 0.518761 8.53589C1.18416 7.79801 8.20939 0.591263 8.20939 0.591263C8.37654 0.404284 8.57698 0.255548 8.79872 0.153955C9.02045 0.0523634 9.25894 0 9.49989 0C9.74085 0 9.97933 0.0523634 10.2011 0.153955C10.4228 0.255548 10.6232 0.404284 10.7904 0.591263C10.7904 0.591263 17.8124 7.79801 18.4808 8.53589C18.8146 8.92335 19 9.43239 19 9.96095C19 10.4895 18.8146 10.9985 18.4808 11.386H18.4819Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {section.showSectionList &&
                            <div className={styles.curriculumSectionBody}>
                                {section.itemList == 0 &&
                                    <div className='p-4'><p className={` ${styles.addItems} `} onClick={() => add()}>+  إضافة عنصر</p></div>
                                }
                                {section.itemList?.map((data, index) => {
                                    return (
                                        <Fragment key={`data${index}`}>
                                            <div className={styles.curriculumDataArea}>
                                                <div className={styles.curriculimDetailsData}>
                                                    <AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#BFBFBF'} />
                                                    <Icon
                                                        height={24}
                                                        width={24}
                                                        iconName={data.itemType == 'video' ? 'videoIcon' : data.itemType == 'file' ? 'pdfIcon' : 'quizNotAttemptIcon'}
                                                        alt={'Quiz Logo'}
                                                    />
                                                    <p className={styles.sectionTitle}>
                                                        <p>{data.itemName}</p>
                                                    </p>
                                                </div>
                                                <div className={styles.curriculimDetailsActions}>
                                                    <AllIconsComponenet iconName={'lock2'} height={24} width={20} color={'#BC0303'} />
                                                    <svg width="24" height="24" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M13.8125 7.7H5.3125V5.5C5.3125 4.62 5.63125 3.85 6.26875 3.19C7.54375 1.87 9.5625 1.87 10.7313 3.19C11.1562 3.63 11.3687 4.18 11.5812 4.73C11.6875 5.28 12.325 5.61 12.8563 5.5C13.3875 5.39 13.8125 4.73 13.6 4.18C13.3875 3.19 12.8562 2.31 12.2188 1.65C11.2625 0.55 9.88125 0 8.5 0C5.525 0 3.1875 2.42 3.1875 5.5V7.7C1.38125 7.7 0 9.13 0 11V18.7C0 20.57 1.38125 22 3.1875 22H13.8125C15.6187 22 17 20.57 17 18.7V11C17 9.13 15.6187 7.7 13.8125 7.7ZM9.5625 16.5C9.5625 17.16 9.1375 17.6 8.5 17.6C7.8625 17.6 7.4375 17.16 7.4375 16.5V13.2C7.4375 12.54 7.8625 12.1 8.5 12.1C9.1375 12.1 9.5625 12.54 9.5625 13.2V16.5Z" fill="#00CF0F" />
                                                    </svg>
                                                    <AllIconsComponenet iconName={'deletecourse'} height={20} width={18} color={'#BFBFBF'} />
                                                </div>
                                            </div>
                                        </Fragment>
                                    )
                                })}
                            </div>
                        }
                    </div>
                )
            })}
            <ModelForDeleteItems
                ismodelForDeleteItems={ismodelForDeleteItems}
                onCloseModal={onCloseModal}
                folderType={folderType}
                tableDataType={tableDataType}
            />
        </div>
    )
}
export default CurriculumSectionComponent