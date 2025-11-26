import React, { useEffect, useState } from 'react'
import styles from './SectionItems.module.scss'
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { mediaUrl } from '../../../../constants/DataManupulation'
import ModelForDeleteItems from '../../ModelForDeleteItems/ModelForDeleteItems'
import { postRouteAPI } from '../../../../services/apisService'
import ModalForVideo from '../../../CommonComponents/ModalForVideo/ModalForVideo'
import Switch from '../../../../components/antDesignCompo/Switch'
import { secondsToMinutes } from '../../../../constants/DataManupulation'

const SectionItems = ({ itemList, handleDeleteSectionItem, setDeleteItemId, setDeleteItemSectionId, sectionId }) => {
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)
    const [sectionItemList, setSectionItemList] = useState(itemList)
    const [videoModalOpen, setVideoModalOpen] = useState(false)
    const [fileSrc, setFileSrc] = useState()
    const [deleteItemType, setDeleteItemType] = useState()

    useEffect(() => {
        setSectionItemList(itemList?.sort((a, b) => a.sectionItem?.order - b.sectionItem?.order))
    }, [itemList])

    const openDeleteModal = async (item) => {
        setIsmodelForDeleteItems(true)
        setDeleteItemSectionId(sectionId)
        setDeleteItemId(item.id)
        setDeleteItemType(item.type == 'video' ? 'videoDelete' : item.type == 'file' ? 'fileDelete' : 'quizDelete')
    }

    const onCloseModal = () => {
        setIsmodelForDeleteItems(false)
    }

    const handleItemDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }
        
        // Save original order for rollback on error
        const originalOrder = Array.from(sectionItemList);
        
        const newSectionOrder = Array.from(sectionItemList);
        const [reorderedSection] = newSectionOrder.splice(result.source.index, 1);
        newSectionOrder.splice(result.destination.index, 0, reorderedSection);
        setSectionItemList(newSectionOrder)

        // Update order starting from 1 (not 0)
        const data = newSectionOrder.map((e, index) => {
            return {
                sectionId: sectionId,
                itemId: e.id,
                order: index + 1  // Start from 1, not 0
            }
        })
        let body = {
            routeName: 'updateSectionItem',
            data: data
        }
        await postRouteAPI(body).then((res) => {
            // Success - order updated
        }).catch((error) => {
            console.log(error);
            // Revert to original order on error
            setSectionItemList(originalOrder);
        })
    };

    const handleFreeUsage = async (e, itemId) => {
        let body = {
            routeName: 'updateSectionItem',
            data: [{
                sectionId: sectionId,
                itemId: itemId,
                freeUsage: e,
            }]
        }
        await postRouteAPI(body).then((res) => {
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleOpenPdfModel = (item) => {
        if (item.type == 'video') {
            setFileSrc(mediaUrl(item.linkBucket, item.linkKey))
            setVideoModalOpen(true);
        }
        else if (item.type == 'file') {
            window.open(mediaUrl(item.linkBucket, item.linkKey))
        }
        else {
            window.open(item.linkKey)
        }
    };

    return (
        <>
            <DragDropContext onDragEnd={handleItemDragEnd}>
                <Droppable droppableId="items" direction="vertical" >
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {sectionItemList?.map((data, index) => (
                                <Draggable key={`item ${index}`} draggableId={`item-${index}`} index={index}>
                                    {(provided) => (
                                        < div
                                            key={`data${index}`}
                                            className={styles.curriculumDataArea}
                                            {...provided.draggableProps}
                                            ref={provided.innerRef}
                                        >
                                            <div className={styles.curriculimDetailsData}>
                                                <div {...provided.dragHandleProps} className={styles.updownArrowWrapper}>
                                                    <AllIconsComponenet height={18} width={18} iconName={'updownarrow'} color={'#00000094'} />
                                                </div>
                                                <div className='px-1'>
                                                    <AllIconsComponenet height={24} width={24} iconName={`${data?.type == "video" ? 'curriculumNewVideoIcon' : data?.type == "file" ? 'curriculumNewFileIcon' : 'curriculumNewQuizIcon'}`} color={'#000000'} />
                                                </div>
                                                <div className={styles.sectionTitle}>
                                                    <p>{data.name}</p>
                                                    <p className={styles.duration}>
                                                        {data?.type == "video" ? `${secondsToMinutes(data?.duration)} دقائق` :
                                                            data?.type == "quiz" ? `${data.numberOfQuestions} سؤال` :
                                                                `${data.discription ? data.discription : ''}`}
                                                    </p>

                                                </div>
                                            </div>
                                            <div className={styles.curriculimDetailsActions}>
                                                <div className='flex'>
                                                    <Switch defaultChecked={data?.sectionItem?.freeUsage} onChange={handleFreeUsage} params={data.id}></Switch>
                                                    <p className='pr-2'>عينة مجانية</p>
                                                </div>
                                                <div style={{ height: '25px', cursor: 'pointer' }} onClick={() => handleOpenPdfModel(data)}>
                                                    <AllIconsComponenet iconName={'newVisibleIcon'} height={20} width={20} color={'#BFBFBF'} />
                                                </div>
                                                <div className='cursor-pointer' style={{ height: '25px' }} onClick={() => openDeleteModal(data)}>
                                                    <AllIconsComponenet iconName={'newDeleteIcon'} height={24} width={24} color={'#000000'} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext >

            {ismodelForDeleteItems &&
                <ModelForDeleteItems
                    ismodelForDeleteItems={ismodelForDeleteItems}
                    onCloseModal={onCloseModal}
                    deleteItemType={deleteItemType}
                    onDelete={handleDeleteSectionItem}
                />
            }
            {
                videoModalOpen &&
                <ModalForVideo
                    videoModalOpen={videoModalOpen}
                    setVideoModalOpen={setVideoModalOpen}
                    sourceFile={fileSrc}
                />
            }
        </>
    )
}
export default SectionItems