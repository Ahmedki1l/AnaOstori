import React, { Fragment, useEffect } from 'react'
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
import SectionItems from './SectionItem/SectionItems'




const CurriculumSectionComponent = ({ onclose, sectionList }) => {
    const [sectionDetails, setSectionDetails] = useState()
    const router = useRouter()
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)
    const [deleteItemType, setDeleteItemType] = useState('section')
    const [isModelForAddCurriculum, setIsModelForAddCurriculum] = useState(false)
    const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false)
    const [selectedSection, setSelectedSection] = useState()
    const [editSectionName, setEditSectionName] = useState(false)
    const [deleteItemId, setDeleteItemId] = useState()
    const [deleteItemSectionId, setDeleteItemSectionId] = useState()

    useEffect(() => {
        setSectionDetails(sectionList?.sort((a, b) => a.order - b.order))
    }, [sectionList])

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
                order: sectionDetails?.length + 1
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

    const handleEditSection = async (section) => {
        let editSectionName = {
            name: section.name,
            id: selectedSection?.id,
        }
        let body = {
            data: editSectionName
        }
        await updateCurriculumSectionAPI(body).then((res) => {
            setIsModelForAddFolderOpen(false)
            const newSections = sectionDetails?.map((item, index) => {
                if (item.id == selectedSection.id) {
                    item.name = res.data.data.name
                }
                return item
            })
            setSectionDetails(newSections)
            setCurriculumName(res.data.data.name)
        }).catch((error) => {
            console.log(error);
            if (error?.response?.data?.message == "Curriculum name already in use") {
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

    const handleDeleteSection = async () => {
        let body = {
            data: {
                name: selectedSection?.name,
                isDeleted: true,
                id: selectedSection?.id,
            }
        }
        await updateCurriculumSectionAPI(body).then((res) => {
            setIsModelForAddFolderOpen(false)
            const newSections = sectionDetails?.filter((item, index) => {
                return item.id != selectedSection?.id
            })
            setSectionDetails(newSections)
        }).catch((error) => {
            console.log(error);
            if (error?.response?.data?.message == "Curriculum name already in use") {
                toast.error(toastErrorMessage.curriculumNameError)
            }
        })
    }

    const handleSectionDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }
        const newSectionOrder = Array.from(sectionDetails);
        const [reorderedSection] = newSectionOrder.splice(result.source.index, 1);
        newSectionOrder.splice(result.destination.index, 0, reorderedSection);
        setSectionDetails(newSectionOrder)

        const data = newSectionOrder.map((e, index) => {
            return {
                sectionId: e.id,
                order: index + 1
            }
        })

        let body = {
            data: data
        }
        await updateMultipleSectionOrderAPI(body).then((res) => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        })
    };

    const handleDeleteFolderItems = (type, section) => {
        setDeleteItemType(type)
        setIsmodelForDeleteItems(true)
        setSelectedSection(section)
    }


    return (
        <div>
            {sectionDetails?.length > 0 &&
                <div className={styles.addSectionArea}>
                    <p className={styles.sectionName}>الأقسام</p>
                    <p className={styles.addSections} onClick={() => handleAddSection()}>+ إضافة قسم</p>
                </div>
            }
            {(sectionDetails?.length == 0) &&
                <div>
                    <div className={`head2 py-2`}>
                        <p>الأقسام</p>
                    </div>
                    <div>
                        <div className={styles.tableBodyArea}>
                            <div className={styles.noDataMainArea}>
                                <AllIconsComponenet height={92} width={92} iconName={'noData'} color={'#00000080'} />
                                <p className={`font-semibold py-2 `}>باقي ما أنشئت قسم</p>
                                <div className={styles.createCourseBtnBox}>
                                    <button className='primarySolidBtn' onClick={() => handleAddSection()}>إضافة قسم</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {sectionDetails?.length > 0 &&
                <DragDropContext onDragEnd={handleSectionDragEnd}>
                    <Droppable droppableId="sections" direction="vertical" >
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {sectionDetails?.map((section, index) => (
                                    <Draggable key={`section ${index}`} draggableId={`section-${index}`} index={index}>
                                        {(provided) => (
                                            <div
                                                {...provided.draggableProps}
                                                ref={provided.innerRef}
                                            >
                                                <input className={`hidden ${styles.tab}`} type="checkbox" id={`tab${index}`} />
                                                <label htmlFor={`tab${index}`} className={`${styles.curriculimSectionHead} ${section.showSectionList ? `${styles.showCurriculumSectionHead}` : ""}`}>
                                                    <div className={styles.curriculimHeadText} >
                                                        <div className={styles.updownSectionIcon}  {...provided.dragHandleProps}>
                                                            <AllIconsComponenet iconName={'updownarrow'} height={20} width={20} color={'#FFFFFF'} />
                                                        </div>
                                                        <p className={styles.sectionTitle}>{section.name}</p>
                                                        <p className={styles.numberOfItems}>({section.items.length} عنصر) </p>
                                                    </div>
                                                    <div className={styles.headerActionWrapper} >
                                                        <div style={{ height: '25px' }} onClick={() => handleAddItemInSection(section)}>
                                                            <AllIconsComponenet iconName={'plus'} height={24} width={24} alt={'key'} color={'#FFFFFF'} />
                                                        </div>
                                                        <div style={{ height: '17px' }} onClick={() => openSectionNameModel(section)}>
                                                            <AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#FFFFFF'} />
                                                        </div>
                                                        <div style={{ height: '19px' }} onClick={() => handleDeleteFolderItems('section', section)} >
                                                            <AllIconsComponenet iconName={'deletecourse'} height={20} width={20} color={'#FFFFFF'} />
                                                        </div>
                                                        <div className={`${styles.arrowIcon} ${section.showSectionList && 'rotate-180'}`} onClick={() => showSectionItem(index)}>
                                                            <AllIconsComponenet iconName={'keyBoardDownIcon'} height={24} width={24} color={'#FFFFFF'} />
                                                        </div>
                                                    </div>
                                                </label>
                                                <div className={`${styles.curriculumSectionBody} ${section.showSectionList ? `${styles.showCurriculumSectionBody}` : ""}`}>
                                                    {section.items.length == 0 &&
                                                        <div className='p-4'><p className={` ${styles.addItems} `} onClick={() => handleAddItemInSection(section)}>+  إضافة عنصر</p></div>
                                                    }
                                                    {section.items.length > 0 &&
                                                        <SectionItems
                                                            sectionId={section.id}
                                                            itemList={section.items}
                                                            handleDeleteSectionItem={handleDeleteSectionItem}
                                                            setDeleteItemId={setDeleteItemId}
                                                            setDeleteItemSectionId={setDeleteItemSectionId}
                                                        />
                                                    }
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

            }
            <ModelWithOneInput
                open={isModelForAddFolderOpen}
                setOpen={setIsModelForAddFolderOpen}
                isEdit={editSectionName}
                onSave={editSectionName ? handleEditSection : handleCreateSection}
                itemName={selectedSection?.name}
            />
            <ModelForDeleteItems
                ismodelForDeleteItems={ismodelForDeleteItems}
                onCloseModal={onCloseModal}
                deleteItemType={deleteItemType}
                onDelete={handleDeleteSection}
            />
            {isModelForAddCurriculum &&
                <ModelForAddItemCurriculum
                    isModelForAddCurriculum={isModelForAddCurriculum}
                    handleAddItemtoSection={handleAddItemtoSection}
                    setIsModelForAddCurriculum={setIsModelForAddCurriculum}
                    onclose={onclose}
                />
            }

        </div >
    )
}
export default CurriculumSectionComponent
