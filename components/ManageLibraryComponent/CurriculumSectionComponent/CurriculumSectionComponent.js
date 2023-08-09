import React, { Fragment } from 'react'
import styles from './CurriculumSectionComponent.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { useState } from 'react'
import Icon from '../../CommonComponents/Icon'
import ModelForDeleteItems from '../ModelForDeleteItems/ModelForDeleteItems'
import ModelForAddItemCurriculum from '../ModelForAddItemCurriculum/ModelForAddItemCurriculum'
import ModelWithOneInput from '../../CommonComponents/ModelWithOneInput/ModelWithOneInput'
import { addItemIntoSectionAPI, createCurriculumSectionAPI, removeItemFromSectionAPI, updateCurriculumSectionAPI, updateMultipleSectionOrderAPI } from '../../../services/apisService'
import { useRouter } from 'next/router'
import { toastErrorMessage } from '../../../constants/ar'
import { toast } from 'react-toastify'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { mediaUrl } from '../../../constants/DataManupulation'

import styled from 'styled-components';
import { Modal } from 'antd'
import { error } from 'jquery'


const StylesModal = styled(Modal)`
    .ant-modal-close{
        display:none;
    }
    .ant-modal-content{
        border-radius: 5px;
        padding: 0px;
        overflow:hidden;
    }
    .ant-modal-body {
        height: 800px;
    }
`

const CurriculumSectionComponent = ({ onclose, sectionList }) => {

    // const [sectionDetails, setSectionDetails] = useState(sectionList.sort((a, b) => a.order - b.order))
    const router = useRouter()
    const [sectionDetails, setSectionDetails] = useState(sectionList)
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)
    const [deleteItemType, setDeleteItemType] = useState('section')
    const [isModelForAddCurriculum, setIsModelForAddCurriculum] = useState(false)
    const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false)
    const [selectedSection, setSelectedSection] = useState()
    const [editSectionName, setEditSectionName] = useState(false)
    const [deleteItemId, setDeleteItemId] = useState()
    const [deleteItemSectionId, setDeleteItemSectionId] = useState()
    const [fileSrc, setFileSrc] = useState()
    const [open, setOpen] = useState(false);

    const showSectionItem = (index) => {
        const data = [...sectionDetails]
        data[index].showSectionList = !data[index].showSectionList
        setSectionDetails(data)
    }

    const onCloseModal = () => {
        setIsmodelForDeleteItems(false)
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
                order: sectionDetails.length
            }
        }
        await createCurriculumSectionAPI(data).then((res) => {
            let newSection = res.data
            newSection.items = []
            sectionDetails.push(newSection)
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
        await addItemIntoSectionAPI(body).then((res) => {
            let newItems = res.data.items
            let newSectionDetails = sectionDetails.map((section) => {
                if (section.id == selectedSection?.id) {
                    section.items = newItems
                }
                return section
            })
            setSectionDetails(newSectionDetails)
        }).catch((error) => {
            console.log(error);
            toast.error(toastErrorMessage.sameFileError);
        })
    }

    const openDeleteModal = async (itemType, itemId, sectionId) => {
        setDeleteItemType(itemType)
        setIsmodelForDeleteItems(true)
        setDeleteItemSectionId(sectionId)
        setDeleteItemId(itemId)
    }

    const handleDeleteSectionItem = async () => {
        let body = {
            sectionId: deleteItemSectionId,
            itemId: deleteItemId
        }
        await removeItemFromSectionAPI(body).then((res) => {
            let newItems = res.data.items
            let newSectionDetails = sectionDetails.map((section) => {
                if (section.id == deleteItemSectionId) {
                    section.items = newItems
                }
                return section
            })
            setSectionDetails(newSectionDetails)
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }
        const newSectionOrder = Array.from(sectionDetails);
        const [reorderedSection] = newSectionOrder.splice(result.source.index, 1);
        newSectionOrder.splice(result.destination.index, 0, reorderedSection);
        setSectionDetails(newSectionOrder)

        const body = newSectionOrder.map((e, index) => {
            return {
                sectionId: e.id,
                order: `${index + 1}`
            }
        })
        await updateMultipleSectionOrderAPI(body).then((res) => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        })
    };

    const handleDeleteFolderItems = () => {
        setIsmodelForDeleteItems(true)
    }

    const handleOpenPdfModel = (item) => {
        if (item.type != 'quiz') {
            setFileSrc(mediaUrl(item.linkBucket, item.linkKey))
            setOpen(true);
        }
        else {
            window.open(item.linkKey)
        }
    };
    const closePdfModel = () => {
        setOpen(false);
        setFileSrc(undefined)
    };

    return (
        <div>
            {sectionDetails.length > 0 &&
                <div className={styles.addSectionArea}>
                    <p className={styles.sectionName}>الأقسام</p>
                    <p className={styles.addSections} onClick={() => handleAddSection()}>+ إضافة قسم</p>
                </div>
            }
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections" direction="vertical" >
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {sectionDetails.map((section, index) => (
                                <Draggable key={`section ${index}`} draggableId={`section-${index}`} index={index}>
                                    {(provided) => (
                                        <div
                                            {...provided.draggableProps}
                                            ref={provided.innerRef}
                                        >
                                            <input className={`hidden ${styles.tab}`} type="checkbox" id={`tab${index}`} />
                                            <label htmlFor={`tab${index}`} className={`${styles.curriculimSectionHead} ${section.showSectionList ? `${styles.showCurriculumSectionHead}` : ""}`}>
                                                <div className={styles.curriculimHeadText} onClick={() => showSectionItem(index)} >
                                                    <div  {...provided.dragHandleProps}>
                                                        <AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#FFFFFF'} />
                                                    </div>
                                                    <p className={styles.sectionTitle}>{section.name}</p>
                                                    <p className={styles.numberOfItems}>({section.items.length} عنصر) </p>
                                                </div>
                                                <div className={styles.headerActionWrapper} >
                                                    <div style={{ height: '25px' }} onClick={() => handleAddItemInSection(section)}><AllIconsComponenet iconName={'plus'} height={24} width={24} alt={'key'} color={'#FFFFFF'} /></div>
                                                    <div style={{ height: '17px' }} onClick={() => openSectionNameModel(section)}><AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#FFFFFF'} /></div>
                                                    <div style={{ height: '19px' }} onClick={() => handleDeleteFolderItems('section')} ><AllIconsComponenet iconName={'deletecourse'} height={20} width={20} color={'#FFFFFF'} /></div>
                                                    <div className={`${styles.arrowIcon} ${section.showSectionList && 'rotate-180'}`} onClick={() => showSectionItem(index)}>
                                                        <AllIconsComponenet iconName={'keyBoardDownIcon'} height={24} width={24} color={'#FFFFFF'} />
                                                    </div>
                                                </div>
                                            </label>
                                            <div className={`${styles.curriculumSectionBody} ${section.showSectionList ? `${styles.showCurriculumSectionBody}` : ""}`}>
                                                {section.items == 0 &&
                                                    <div className='p-4'><p className={` ${styles.addItems} `} onClick={() => handleAddItemInSection(section)}>+  إضافة عنصر</p></div>
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
                                                                    <div style={{ height: '25px', cursor: 'pointer' }} onClick={() => handleOpenPdfModel(data)}><AllIconsComponenet iconName={'visibilityIcon'} height={22} width={22} color={'#BFBFBF'} /></div>
                                                                    <div><AllIconsComponenet iconName={'lock2'} height={22} width={22} color={'#00CF0F'} /></div>
                                                                    <div><AllIconsComponenet iconName={'lock2'} height={22} width={22} color={'#BC0303'} /></div>
                                                                    <div style={{ height: '25px' }} onClick={() => openDeleteModal('sectionItem', data.id, section.id)}><AllIconsComponenet iconName={'deletecourse'} height={20} width={18} color={'#BFBFBF'} /></div>
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
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
                onDelete={handleDeleteSectionItem}
            />
            {isModelForAddCurriculum && <ModelForAddItemCurriculum
                isModelForAddCurriculum={isModelForAddCurriculum}
                handleAddItemtoSection={handleAddItemtoSection}
                setIsModelForAddCurriculum={setIsModelForAddCurriculum}
                onclose={onclose}
            />}
            <StylesModal
                footer={false}
                closeIcon={false}
                open={open}
                width={1100}
                onCancel={closePdfModel}
            >
                {/* <div className='pdfCloseIcon' onClick={closePdfModel}>
                    <AllIconsComponenet iconName={'closeicon'} height={16} width={16} color={'#000000'} />
                </div> */}
                <embed src={fileSrc} width="100%" height="100%" type="application/pdf" />
            </StylesModal>
        </div>
    )
}
export default CurriculumSectionComponent



{/* <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections" direction="vertical" >
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {sectionDetails.map((section, index) => (
                                <Draggable key={`section ${index}`} draggableId={`section-${index}`} index={index}>
                                    {(provided) => (
                                        <div
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                        >
                                            <input className={`hidden ${styles.tab}`} type="checkbox" id={`tab$[index]`} />
                                            <label htmlFor={`tab$[index]`} className={`${styles.curriculimSectionHead} ${section.showSectionList ? `${styles.showCurriculumSectionHead}` : ""}`}>
                                                <div className={styles.curriculimHeadText}>
                                                    <div><AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#FFFFFF'} /></div>
                                                    <p className={styles.sectionTitle}>{section.name}</p>
                                                    <p className={styles.numberOfItems}>({section.items.length} عنصر) </p>
                                                </div>
                                                <div className={styles.headerActionWrapper} >
                                                    <div onClick={() => handleAddItemInSection(section)}><AllIconsComponenet iconName={'plus'} height={24} width={24} alt={'key'} color={'#FFFFFF'} /></div>
                                                    <div onClick={() => openSectionNameModel(section)}><AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#FFFFFF'} /></div>
                                                    <div onClick={() => handleDeleteFolderItems('section')} ><AllIconsComponenet iconName={'deletecourse'} height={20} width={20} color={'#FFFFFF'} /></div>
                                                    <div className={`${styles.arrowIcon} ${section.showSectionList && 'rotate-180'}`} onClick={() => showSectionItem(index)}>
                                                        <AllIconsComponenet iconName={'keyBoardDownIcon'} height={24} width={24} color={'#FFFFFF'} />
                                                    </div>
                                                </div>
                                            </label>
                                            <div className={`${styles.curriculumSectionBody} ${section.showSectionList ? `${styles.showCurriculumSectionBody}` : ""}`}>
                                                {section.items == 0 &&
                                                    <div className='p-4'><p className={` ${styles.addItems} `} onClick={() => handleAddItemInSection(section)}>+  إضافة عنصر</p></div>
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
                                                                    <div style={{ height: '21px' }}><AllIconsComponenet iconName={'visibilityIcon'} height={18} width={24} color={"#BFBFBF"} /></div>
                                                                    <div><AllIconsComponenet iconName={'lock2'} height={22} width={22} color={'#00CF0F'} /></div>
                                                                    <div><AllIconsComponenet iconName={'lock2'} height={22} width={22} color={'#BC0303'} /></div>
                                                                    <div style={{ height: '25px' }} onClick={() => handleDeleteFolderItems('sectionItem')}><AllIconsComponenet iconName={'deletecourse'} height={20} width={18} color={'#BFBFBF'} /></div>
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext> */}
