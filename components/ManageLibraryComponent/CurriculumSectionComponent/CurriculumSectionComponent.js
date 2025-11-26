import React, { useEffect } from 'react'
import styles from './CurriculumSectionComponent.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { useState } from 'react'
import ModelForDeleteItems from '../ModelForDeleteItems/ModelForDeleteItems'
import ModelForAddItemCurriculum from '../ModelForAddItemCurriculum/ModelForAddItemCurriculum'
import ModelWithOneInput from '../../CommonComponents/ModelWithOneInput/ModelWithOneInput'
import { postRouteAPI } from '../../../services/apisService'
import { useRouter } from 'next/router'
import { toastErrorMessage } from '../../../constants/ar'
import { toast } from 'react-toastify'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import SectionItems from './SectionItem/SectionItems'
import { noOfItemTag } from '../../../constants/adminPanelConst/commonConst'
import { curriculumConst } from '../../../constants/adminPanelConst/manageLibraryConst/manageLibraryConst'
import Empty from '../../CommonComponents/Empty'
import { getNewToken } from '../../../services/fireBaseAuthService'




const CurriculumSectionComponent = ({ sectionList }) => {
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
    const existingItemName = sectionList?.map(item => item.name)

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
        let body = {
            routeName: 'createSection',
            name: name,
            curriculumId: router.query.coursePathId,
            order: sectionDetails?.length + 1
        }
        await postRouteAPI(body).then((res) => {
            let newSection = res.data
            newSection.items = []
            sectionDetails.push(newSection)
            setIsModelForAddFolderOpen(false)
            setSelectedSection()
        }).catch((error) => {
            console.log(error);
            if (error?.response?.data?.message == "section name already in use in this curriculum") {
                toast.error(curriculumConst.curriculumToastMsgConst.sectionNameDuplicateErrorMsg, { rtl: true, })
            }
        })
    }

    const handleEditSection = async (section) => {
        if (existingItemName.includes(section.name)) {
            toast.error(curriculumConst.curriculumToastMsgConst.sectionNameDuplicateErrorMsg, { rtl: true, })
            return
        }
        let editSectionName = {
            name: section.name,
            id: selectedSection?.id,
        }
        let body = {
            routeName: 'updateSection',
            ...editSectionName,
        }
        await postRouteAPI(body).then((res) => {
            setIsModelForAddFolderOpen(false)
            setSelectedSection()
            const newSections = sectionDetails?.map((item, index) => {
                if (item.id == selectedSection.id) {
                    item.name = res.data.data.name
                }
                return item
            })
            setSectionDetails(newSections)
        }).catch((error) => {
            console.log(error);
            if (error?.response?.data?.message == "section name already in use in this curriculum") {
                toast.error(curriculumConst.curriculumToastMsgConst.sectionNameDuplicateErrorMsg, { rtl: true, })
            }
        })
    }

    const openSectionNameModel = (section) => {
        setIsModelForAddFolderOpen(true)
        setSelectedSection(section)
        setEditSectionName(true)
    }

    const handleAddItemtoSection = async (itemList) => {
        // Calculate order for new items
        const currentSection = sectionDetails.find(s => s.id === selectedSection?.id);
        const currentItems = currentSection?.items || [];
        const maxOrder = currentItems.length > 0 
            ? Math.max(...currentItems.map(item => item.sectionItem?.order || 0))
            : 0;
        
        // Add order to items if not already present
        console.log("Adding items to section. itemList:", itemList);
        const itemsWithOrder = itemList.map((item, index) => ({
            ...item,
            order: item.order || (maxOrder + index + 1)
        }));
        
        let body = {
            routeName: 'addItemToSection',
            sectionId: selectedSection?.id,
            items: itemsWithOrder
        }
        await postRouteAPI(body).then((res) => {
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
            toast.error(toastErrorMessage.sameFileError, { rtl: true, });
        })
    }


    const handleDeleteSectionItem = async () => {
        let body = {
            sectionId: deleteItemSectionId,
            itemId: deleteItemId,
            routeName: 'removeItemToSection'
        }
        await postRouteAPI(body).then(async (res) => {
            let newItems = res.data.items
            let newSectionDetails = sectionDetails.map((section) => {
                if (section.id == deleteItemSectionId) {
                    section.items = newItems
                }
                return section
            })
            setSectionDetails(newSectionDetails)
            
            // Reorder remaining items to ensure sequential order starting from 1
            const remainingItems = newItems
                .filter(item => item.id !== deleteItemId)
                .sort((a, b) => (a.sectionItem?.order || 0) - (b.sectionItem?.order || 0));
            
            if (remainingItems.length > 0) {
                const reorderData = remainingItems.map((item, index) => ({
                    sectionId: deleteItemSectionId,
                    itemId: item.id,
                    order: index + 1
                }));
                
                // Update order if needed
                const needsReorder = remainingItems.some((item, index) => 
                    (item.sectionItem?.order || 0) !== (index + 1)
                );
                
                if (needsReorder) {
                    try {
                        await postRouteAPI({
                            routeName: 'updateSectionItem',
                            data: reorderData
                        });
                    } catch (reorderError) {
                        console.error('Error reordering items after deletion:', reorderError);
                    }
                }
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleDeleteSection = async () => {
        let body = {
            routeName: 'updateSection',
            name: selectedSection?.name,
            isDeleted: true,
            id: selectedSection?.id,
        }
        await postRouteAPI(body).then((res) => {
            setIsModelForAddFolderOpen(false)
            const newSections = sectionDetails?.filter((item, index) => {
                return item.id != selectedSection?.id
            })
            setSectionDetails(newSections)
        }).catch(async (error) => {
            console.log(error);
            if (error?.response?.data?.message == "Curriculum name already in use") {
                toast.error(toastErrorMessage.curriculumNameError, { rtl: true, })
            }
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postRouteAPI(body).then(async (res) => {
                        setIsModelForAddFolderOpen(false)
                        const newSections = sectionDetails?.filter((item, index) => {
                            return item.id != selectedSection?.id
                        })
                        setSectionDetails(newSections)
                    })
                })
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
            routeName: 'updateSection',
            data: data,
            type: 'multipleOrder'
        }
        await postRouteAPI(body).then((res) => {
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
            <div className={styles.addSectionArea}>
                <p className={styles.sectionName}>الأقسام</p>
                <p className={styles.addSections} onClick={() => handleAddSection()}>+ إضافة قسم</p>
            </div>
            {sectionDetails?.length == 0 &&
                <div className={styles.tableBodyArea}>
                    <Empty
                        onClick={() => handleAddSection()}
                        containerhight={240}
                        buttonText={'+ إضافة قسم'}
                        emptyText={'باقي ما أضفت قسم'}
                    />
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
                                                            <AllIconsComponenet iconName={'dragIcon'} height={24} width={24} color={'#00000094'} />
                                                        </div>
                                                        <p className={styles.sectionTitle}>{section.name}</p>
                                                        <p className={styles.numberOfItems}>({noOfItemTag(section?.items?.length)}) </p>
                                                    </div>
                                                    <div className={styles.headerActionWrapper} >
                                                        <div style={{ height: '14px' }} onClick={() => handleAddItemInSection(section)}>
                                                            <AllIconsComponenet iconName={'plus'} height={18} width={18} alt={'key'} color={'#000000'} />
                                                        </div>
                                                        <div style={{ height: '20px' }} onClick={() => openSectionNameModel(section)}>
                                                            <AllIconsComponenet iconName={'newEditIcon'} height={24} width={24} color={'#000000'} />
                                                        </div>
                                                        <div style={{ height: '16px' }} onClick={() => handleDeleteFolderItems('section', section)} >
                                                            <AllIconsComponenet iconName={'newDeleteIcon'} height={22} width={22} color={'#000000'} />
                                                        </div>
                                                        <div style={{ height: '20px' }} className={`${styles.arrowIcon} ${section.showSectionList && 'rotate-180'}`} onClick={() => showSectionItem(index)}>
                                                            <AllIconsComponenet iconName={'keyBoardDownIcon'} height={22} width={22} color={'#000000'} />
                                                        </div>
                                                    </div>
                                                </label>
                                                <div className={`${styles.curriculumSectionBody} ${section.showSectionList ? `${styles.showCurriculumSectionBody}` : ""}`}>
                                                    {section?.items?.length == 0 &&
                                                        <div className='p-4'><p className={` ${styles.addItems} `} onClick={() => handleAddItemInSection(section)}>+ إضافة عنصر</p></div>
                                                    }
                                                    {section?.items?.length > 0 &&
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
            {isModelForAddFolderOpen &&
                <ModelWithOneInput
                    open={isModelForAddFolderOpen}
                    setOpen={setIsModelForAddFolderOpen}
                    isEdit={editSectionName}
                    onSave={editSectionName ? handleEditSection : handleCreateSection}
                    itemName={selectedSection?.name}
                    curriCulumSection={'addSection'}
                />}
            {ismodelForDeleteItems &&
                <ModelForDeleteItems
                    ismodelForDeleteItems={ismodelForDeleteItems}
                    onCloseModal={onCloseModal}
                    deleteItemType={deleteItemType}
                    onDelete={handleDeleteSection}
                />}
            {isModelForAddCurriculum &&
                <ModelForAddItemCurriculum
                    isModelForAddCurriculum={isModelForAddCurriculum}
                    handleAddItemtoSection={handleAddItemtoSection}
                    setIsModelForAddCurriculum={setIsModelForAddCurriculum}
                />
            }

        </div >
    )
}
export default CurriculumSectionComponent
