import React, { useEffect, useState } from 'react'
import styles from './SectionItems.module.scss'
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet'
import Icon from '../../../CommonComponents/Icon'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Modal } from 'antd'
import styled from 'styled-components'
import { mediaUrl } from '../../../../constants/DataManupulation'
import ModelForDeleteItems from '../../ModelForDeleteItems/ModelForDeleteItems'
import { updateItemOfSectionAPI } from '../../../../services/apisService'


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

const SectionItems = ({ itemList, handleDeleteSectionItem, setDeleteItemId, setDeleteItemSectionId, sectionId }) => {
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)
    const [sectionItemList, setSectionItemList] = useState(itemList)
    const [fileSrc, setFileSrc] = useState()
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setSectionItemList(itemList)
    }, [itemList])

    const openDeleteModal = async (itemId) => {
        setIsmodelForDeleteItems(true)
        setDeleteItemSectionId(sectionId)
        setDeleteItemId(itemId)
    }

    const onCloseModal = () => {
        setIsmodelForDeleteItems(false)
    }

    const handleItemDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }
        const newSectionOrder = Array.from(sectionItemList);
        const [reorderedSection] = newSectionOrder.splice(result.source.index, 1);
        newSectionOrder.splice(result.destination.index, 0, reorderedSection);
        setSectionItemList(newSectionOrder)

        const data = newSectionOrder.map((e, index) => {
            return {
                sectionId: sectionId,
                itemId: e.id,
                order: index + 1
            }
        })
        console.log(data);
        await updateItemOfSectionAPI(data).then((res) => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        })
    };


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
        <>
            <DragDropContext onDragEnd={handleItemDragEnd}>
                <Droppable droppableId="items" direction="vertical" >
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {sectionItemList?.map((data, index) => (
                                <Draggable key={`item ${index}`} draggableId={`item-${index}`} index={index}>
                                    {(provided) => (
                                        <div
                                            key={`data${index}`}
                                            className={styles.curriculumDataArea}
                                            {...provided.draggableProps}
                                            ref={provided.innerRef}
                                        >
                                            <div className={styles.curriculimDetailsData}>
                                                <div {...provided.dragHandleProps} className={styles.updownArrowWrapper}>
                                                    <AllIconsComponenet iconName={'updownarrow'} height={20} width={20} color={'#BFBFBF'} />
                                                </div>
                                                <div className='px-1'>
                                                    <Icon
                                                        height={data.type == 'quiz' ? 26 : 24}
                                                        width={data.type == 'quiz' ? 28 : 24}
                                                        iconName={data.type == 'video' ? 'videoIcon' : data.type == 'file' ? 'pdfIcon' : 'quizNotAttemptIcon'}
                                                        alt={'Quiz Logo'}
                                                    />
                                                </div>
                                                <div className={styles.sectionTitle}>
                                                    <p>{data.name}</p>
                                                    <p className={styles.duration}>(efreg)</p>
                                                </div>
                                            </div>
                                            <div className={styles.curriculimDetailsActions}>
                                                <div style={{ height: '25px', cursor: 'pointer' }} onClick={() => handleOpenPdfModel(data)}>
                                                    <AllIconsComponenet iconName={'visibilityIcon'} height={22} width={22} color={'#BFBFBF'} />
                                                </div>
                                                <div>
                                                    <AllIconsComponenet iconName={'lock2'} height={22} width={22} color={'#00CF0F'} />
                                                </div>
                                                <div>
                                                    <AllIconsComponenet iconName={'lock2'} height={22} width={22} color={'#BC0303'} />
                                                </div>
                                                <div style={{ height: '25px' }} onClick={() => openDeleteModal(data.id)}>
                                                    <AllIconsComponenet iconName={'deletecourse'} height={20} width={18} color={'#BFBFBF'} />
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
            </DragDropContext>

            {ismodelForDeleteItems &&
                <ModelForDeleteItems
                    ismodelForDeleteItems={ismodelForDeleteItems}
                    onCloseModal={onCloseModal}
                    deleteItemType={'sectionItem'}
                    onDelete={handleDeleteSectionItem}
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
        </>
    )
}
export default SectionItems