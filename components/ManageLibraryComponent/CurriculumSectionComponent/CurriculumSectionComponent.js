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
import Empty from '../../CommonComponents/Empty'
import { noOfItemTag } from '../../../constants/adminPanelConst/commonConst'




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
    console.log(isModelForAddFolderOpen);
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
            setSelectedSection()
        }).catch((error) => {
            console.log(error);
            if (error?.response?.data?.message == "section name already in use in this curriculum") {
                toast.error(toastErrorMessage.sameSectionNameError)
            }
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
            setSelectedSection()
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
                        onClick={handleAddSection}
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
                                                            <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M5.54706 22C5.27433 21.9953 5.01378 21.8489 4.82091 21.592C4.62805 21.3352 4.51812 20.9882 4.51456 20.625V4.69344L1.76122 8.36009C1.56763 8.61758 1.3052 8.76221 1.03159 8.76221C0.757978 8.76221 0.495552 8.61758 0.301958 8.36009C0.108605 8.10227 0 7.7528 0 7.38842C0 7.02405 0.108605 6.67458 0.301958 6.41676L4.81742 0.403468C4.90904 0.272979 5.02214 0.172571 5.14782 0.110136C5.27385 0.0374836 5.40973 0 5.54706 0C5.68439 0 5.82026 0.0374836 5.94629 0.110136C6.07198 0.172571 6.18507 0.272979 6.27669 0.403468L10.7509 6.36176C10.9332 6.62242 11.0325 6.96717 11.0278 7.32338C11.0231 7.6796 10.9147 8.01947 10.7256 8.27139C10.5364 8.52331 10.2812 8.66762 10.0137 8.67391C9.74619 8.68019 9.48732 8.54796 9.29159 8.30509L6.53826 4.63844V20.57C6.54581 20.9335 6.44638 21.2865 6.26119 21.5536C6.076 21.8208 5.81972 21.981 5.54706 22ZM16.5604 0.000137249C16.2877 0.00488549 16.0271 0.151274 15.8342 0.408113C15.6414 0.664952 15.5315 1.01193 15.5279 1.37513V17.3067L12.7746 13.6401C12.581 13.3826 12.3185 13.2379 12.0449 13.2379C11.7713 13.2379 11.5089 13.3826 11.3153 13.6401C11.1219 13.8979 11.0133 14.2473 11.0133 14.6117C11.0133 14.9761 11.1219 15.3256 11.3153 15.5834L15.7895 21.5417C15.8811 21.6722 15.9942 21.7726 16.1199 21.835C16.2459 21.9077 16.3818 21.9451 16.5191 21.9451C16.6564 21.9451 16.7923 21.9077 16.9183 21.835C17.044 21.7726 17.1571 21.6722 17.2487 21.5417L21.7229 15.5834C21.9053 15.3227 22.0046 14.978 21.9998 14.6218C21.9951 14.2655 21.8868 13.9257 21.6976 13.6737C21.5084 13.4218 21.2532 13.2775 20.9857 13.2712C20.7182 13.2649 20.4593 13.3972 20.2636 13.6401L17.5103 17.3067V1.37513C17.508 1.02996 17.4095 0.698217 17.234 0.444185C17.0585 0.190153 16.8185 0.0319168 16.5604 0.000137249Z" fill='#FFFFFF' />
                                                            </svg>
                                                            {/* <AllIconsComponenet iconName={'updownarrow'} height={20} width={20} color={'#FFFFFF'} /> */}
                                                        </div>
                                                        <p className={styles.sectionTitle}>{section.name}</p>
                                                        <p className={styles.numberOfItems}>({noOfItemTag(section.items.length)}) </p>
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
                                                        <div className='p-4'><p className={` ${styles.addItems} `} onClick={() => handleAddItemInSection(section)}>+ إضافة عنصر</p></div>
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
                    onclose={onclose}
                />
            }

        </div >
    )
}
export default CurriculumSectionComponent
