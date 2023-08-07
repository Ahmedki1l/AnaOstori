import React, { Fragment } from 'react'
import styles from './CurriculumSectionComponent.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { useState } from 'react'
import Icon from '../../CommonComponents/Icon'
import ModelForDeleteItems from '../ModelForDeleteItems/ModelForDeleteItems'
import ModelForAddItemCurriculum from '../ModelForAddItemCurriculum/ModelForAddItemCurriculum'
import ModelWithOneInput from '../../CommonComponents/ModelWithOneInput/ModelWithOneInput'
import { addItemIntoSectionAPI, createCurriculumSectionAPI, updateCurriculumSectionAPI } from '../../../services/apisService'
import { useRouter } from 'next/router'

const CurriculumSectionComponent = ({ onclose, sectionList }) => {

    const [sectionDetails, setSectionDetails] = useState(sectionList)
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)
    const [deleteItemType, setDeleteItemType] = useState('section')
    const [isModelForAddCurriculum, setIsModelForAddCurriculum] = useState(false)
    const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false)
    const [selectedSection, setSelectedSection] = useState()
    const [editSectionName, setEditSectionName] = useState(false)


    const router = useRouter()
    const showSectionItem = (index) => {
        const data = [...sectionDetails]
        data[index].showSectionList = !data[index].showSectionList
        setSectionDetails(data)
    }

    const handleDeleteFolderItems = (item) => {
        setDeleteItemType(item)
        setIsmodelForDeleteItems(true)
    }
    const onCloseModal = () => {
        setIsmodelForDeleteItems(false)
    }
    const handleAddCurriculum = () => {
        setIsModelForAddCurriculum(true)
    }
    const handleAddSection = () => {
        setEditSectionName(false)
        setIsModelForAddFolderOpen(true)
    }
    const handleAddItemInSection = (section) => {
        setIsModelForAddCurriculum(true)
        setSelectedSection(section)
    }
    const handleCreateSection = async ({ name }) => {
        let data = {
            data: {
                name: name,
                curriculumId: router.query.coursePathId,
                order: 4
            }
        }
        await createCurriculumSectionAPI(data).then((res) => {
            setIsModelForAddFolderOpen(false)
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleEditSectionName = async (section) => {
        let editSectionName = {
            name: section.name,
            id: selectedSection?.id,
        }
        let body = {
            data: editSectionName
        }
        await updateCurriculumSectionAPI(body).then((res) => {
            courseForm.setFieldValue(item.pathTitle)
            setCurriculumName(res.data.data.name)
        }).catch((error) => {
            console.log(error);
            if (error.response.data.message == "Curriculum name already in use") {
                toast.error(toastErrorMessage.curriculumNameError)
            }
        })
    }

    const openSectionNameModel = (section) => {
        setIsModelForAddFolderOpen(true)
        setSelectedSection(section)
        setEditSectionName(true)
    }
    const handleAddItemtoSection = async (itemList) => {
        let body = {
            data: {
                sectionId: selectedSection?.id,
                items: itemList
            }
        }
        console.log(body);
        await addItemIntoSectionAPI(body).then((res) => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <div>
            {sectionDetails.length > 0 &&
                <div className={styles.addSectionArea}>
                    <p className={styles.sectionName}>الأقسام</p>
                    <p className={styles.addSections} onClick={() => handleAddSection()}>+ إضافة قسم</p>
                </div>
            }
            {sectionDetails.map((section, index) => {
                const { showSectionList } = section
                return (
                    <div key={`section ${index}`} className='mb-4'>
                        <input className={`hidden ${styles.tab}`} type="checkbox" id={`tab$[index]`} />
                        <label htmlFor={`tab$[index]`} className={`${styles.curriculimSectionHead} ${section.showSectionList ? `${styles.showCurriculumSectionHead}` : ""}`}>
                            <div className={styles.curriculimHeadText}>
                                <AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#FFFFFF'} />
                                <p className={styles.sectionTitle}>{section.name}</p>
                                <p className={styles.numberOfItems}>({section.items.length} عنصر) </p>
                            </div>
                            <div className={styles.headerActionWrapper} >
                                <div onClick={() => handleAddItemInSection(section)}><AllIconsComponenet iconName={'plus'} height={24} width={24} alt={'key'} color={'#FFFFFF'} /></div>
                                <div onClick={() => openSectionNameModel(section)}><AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#FFFFFF'} /></div>
                                <div onClick={() => handleDeleteFolderItems('section')}><AllIconsComponenet iconName={'deletecourse'} height={20} width={20} color={'#FFFFFF'} /></div>
                                <div className={`${styles.arrowIcon} ${showSectionList && 'rotate-180'}`} onClick={() => showSectionItem(index)}>
                                    <svg width="19" height="15" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.4819 11.386C17.7674 12.1735 16.7732 12.2352 15.9 11.386L9.49827 4.77389L3.0967 11.386C2.22335 12.2352 1.22733 12.1735 0.518761 11.386C0.185286 10.9984 0 10.4894 0 9.96095C0 9.43246 0.185286 8.92348 0.518761 8.53589C1.18416 7.79801 8.20939 0.591263 8.20939 0.591263C8.37654 0.404284 8.57698 0.255548 8.79872 0.153955C9.02045 0.0523634 9.25894 0 9.49989 0C9.74085 0 9.97933 0.0523634 10.2011 0.153955C10.4228 0.255548 10.6232 0.404284 10.7904 0.591263C10.7904 0.591263 17.8124 7.79801 18.4808 8.53589C18.8146 8.92335 19 9.43239 19 9.96095C19 10.4895 18.8146 10.9985 18.4808 11.386H18.4819Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                        </label>
                        <div className={`${styles.curriculumSectionBody} ${section.showSectionList ? `${styles.showCurriculumSectionBody}` : ""}`}>
                            {section.items == 0 &&
                                <div className='p-4'><p className={` ${styles.addItems} `} onClick={() => handleAddCurriculum()}>+  إضافة عنصر</p></div>
                            }
                            {section.items?.map((data, index) => {
                                return (
                                    <Fragment key={`data${index}`}>
                                        <div className={styles.curriculumDataArea}>
                                            <div className={styles.curriculimDetailsData}>
                                                <AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#BFBFBF'} />
                                                <Icon
                                                    height={data.type == 'video' ? 24 : data.type == 'file' ? 24 : 26}
                                                    width={data.type == 'video' ? 24 : data.type == 'file' ? 24 : 28}
                                                    iconName={data.type == 'video' ? 'videoIcon' : data.type == 'file' ? 'pdfIcon' : 'quizNotAttemptIcon'}
                                                    alt={'Quiz Logo'}
                                                />
                                                <div className={styles.sectionTitle}>
                                                    <p>{data.name}</p>
                                                    <p className={styles.duration}>(efreg)</p>
                                                </div>
                                            </div>
                                            <div className={styles.curriculimDetailsActions}>
                                                <svg width="24" height="28" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12.0005 10.9302C12.9942 10.9302 13.7997 10.067 13.7997 9.0022C13.7997 7.93741 12.9942 7.07422 12.0005 7.07422C11.0067 7.07422 10.2012 7.93741 10.2012 9.0022C10.2012 10.067 11.0067 10.9302 12.0005 10.9302Z" fill="#BFBFBF" />
                                                    <path d="M23.8393 8.36008C23.0716 6.93337 18.8493 -0.225875 11.6761 0.00548329C5.04276 0.185428 1.20429 6.4321 0.160706 8.36008C0.0554256 8.55547 0 8.77712 0 9.00274C0 9.22836 0.0554256 9.45001 0.160706 9.6454C0.916405 11.0464 4.9588 18 12.024 18H12.3239C18.9572 17.8201 22.8077 11.5734 23.8393 9.6454C23.9446 9.45001 24 9.22836 24 9.00274C24 8.77712 23.9446 8.55547 23.8393 8.36008ZM12 13.5014C11.1696 13.5014 10.3579 13.2375 9.66753 12.7432C8.97712 12.2489 8.43901 11.5463 8.12125 10.7243C7.80349 9.90227 7.72034 8.99775 7.88234 8.1251C8.04433 7.25245 8.44418 6.45088 9.03133 5.82173C9.61848 5.19259 10.3665 4.76413 11.1809 4.59055C11.9953 4.41697 12.8395 4.50606 13.6066 4.84655C14.3738 5.18704 15.0295 5.76364 15.4908 6.50344C15.9521 7.24323 16.1983 8.113 16.1983 9.00274C16.1983 10.1959 15.756 11.3401 14.9687 12.1838C14.1813 13.0274 13.1135 13.5014 12 13.5014Z" fill="#BFBFBF" />
                                                </svg>
                                                <AllIconsComponenet iconName={'lock2'} height={24} width={20} color={'#BC0303'} />
                                                <svg width="24" height="24" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M13.8125 7.7H5.3125V5.5C5.3125 4.62 5.63125 3.85 6.26875 3.19C7.54375 1.87 9.5625 1.87 10.7313 3.19C11.1562 3.63 11.3687 4.18 11.5812 4.73C11.6875 5.28 12.325 5.61 12.8563 5.5C13.3875 5.39 13.8125 4.73 13.6 4.18C13.3875 3.19 12.8562 2.31 12.2188 1.65C11.2625 0.55 9.88125 0 8.5 0C5.525 0 3.1875 2.42 3.1875 5.5V7.7C1.38125 7.7 0 9.13 0 11V18.7C0 20.57 1.38125 22 3.1875 22H13.8125C15.6187 22 17 20.57 17 18.7V11C17 9.13 15.6187 7.7 13.8125 7.7ZM9.5625 16.5C9.5625 17.16 9.1375 17.6 8.5 17.6C7.8625 17.6 7.4375 17.16 7.4375 16.5V13.2C7.4375 12.54 7.8625 12.1 8.5 12.1C9.1375 12.1 9.5625 12.54 9.5625 13.2V16.5Z" fill="#00CF0F" />
                                                </svg>
                                                <div onClick={() => handleDeleteFolderItems('sectionItem')}><AllIconsComponenet iconName={'deletecourse'} height={20} width={18} color={'#BFBFBF'} /></div>
                                            </div>
                                        </div>
                                    </Fragment>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
            <ModelWithOneInput
                open={isModelForAddFolderOpen}
                setOpen={setIsModelForAddFolderOpen}
                isEdit={editSectionName}
                onSave={editSectionName ? handleEditSectionName : handleCreateSection}

                itemName={selectedSection?.name}
            />
            <ModelForDeleteItems
                ismodelForDeleteItems={ismodelForDeleteItems}
                onCloseModal={onCloseModal}
                deleteItemType={deleteItemType}
            />
            {isModelForAddCurriculum && <ModelForAddItemCurriculum
                isModelForAddCurriculum={isModelForAddCurriculum}
                handleAddItemtoSection={handleAddItemtoSection}
                setIsModelForAddCurriculum={setIsModelForAddCurriculum}
                onclose={onclose}
            />}
        </div>
    )
}
export default CurriculumSectionComponent