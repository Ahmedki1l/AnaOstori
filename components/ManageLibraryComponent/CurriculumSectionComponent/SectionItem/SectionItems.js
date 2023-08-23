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
        setSectionItemList(itemList?.sort((a, b) => a.sectionItem.order - b.sectionItem.order))
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
        let body = {
            data: data
        }
        console.log(body);
        await updateItemOfSectionAPI(body).then((res) => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        })
    };

    const handleFreeUsage = async (e) => {
        let body = {
            data: [{
                sectionId: sectionId,
                itemId: e.id,
                freeUsage: !e.sectionItem.freeUsage,
                order: e.sectionItem.order + 1
            }]
        }
        await updateItemOfSectionAPI(body).then((res) => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        })
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
                                            {console.log(data)}
                                            <div className={styles.curriculimDetailsData}>
                                                <div {...provided.dragHandleProps} className={styles.updownArrowWrapper}>
                                                    {/* <AllIconsComponenet iconName={'updownarrow'} height={20} width={20} color={arrowColor} /> */}
                                                    <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5.54706 22C5.27433 21.9953 5.01378 21.8489 4.82091 21.592C4.62805 21.3352 4.51812 20.9882 4.51456 20.625V4.69344L1.76122 8.36009C1.56763 8.61758 1.3052 8.76221 1.03159 8.76221C0.757978 8.76221 0.495552 8.61758 0.301958 8.36009C0.108605 8.10227 0 7.7528 0 7.38842C0 7.02405 0.108605 6.67458 0.301958 6.41676L4.81742 0.403468C4.90904 0.272979 5.02214 0.172571 5.14782 0.110136C5.27385 0.0374836 5.40973 0 5.54706 0C5.68439 0 5.82026 0.0374836 5.94629 0.110136C6.07198 0.172571 6.18507 0.272979 6.27669 0.403468L10.7509 6.36176C10.9332 6.62242 11.0325 6.96717 11.0278 7.32338C11.0231 7.6796 10.9147 8.01947 10.7256 8.27139C10.5364 8.52331 10.2812 8.66762 10.0137 8.67391C9.74619 8.68019 9.48732 8.54796 9.29159 8.30509L6.53826 4.63844V20.57C6.54581 20.9335 6.44638 21.2865 6.26119 21.5536C6.076 21.8208 5.81972 21.981 5.54706 22ZM16.5604 0.000137249C16.2877 0.00488549 16.0271 0.151274 15.8342 0.408113C15.6414 0.664952 15.5315 1.01193 15.5279 1.37513V17.3067L12.7746 13.6401C12.581 13.3826 12.3185 13.2379 12.0449 13.2379C11.7713 13.2379 11.5089 13.3826 11.3153 13.6401C11.1219 13.8979 11.0133 14.2473 11.0133 14.6117C11.0133 14.9761 11.1219 15.3256 11.3153 15.5834L15.7895 21.5417C15.8811 21.6722 15.9942 21.7726 16.1199 21.835C16.2459 21.9077 16.3818 21.9451 16.5191 21.9451C16.6564 21.9451 16.7923 21.9077 16.9183 21.835C17.044 21.7726 17.1571 21.6722 17.2487 21.5417L21.7229 15.5834C21.9053 15.3227 22.0046 14.978 21.9998 14.6218C21.9951 14.2655 21.8868 13.9257 21.6976 13.6737C21.5084 13.4218 21.2532 13.2775 20.9857 13.2712C20.7182 13.2649 20.4593 13.3972 20.2636 13.6401L17.5103 17.3067V1.37513C17.508 1.02996 17.4095 0.698217 17.234 0.444185C17.0585 0.190153 16.8185 0.0319168 16.5604 0.000137249Z" fill="#BFBFBF" />
                                                    </svg>
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
                                                <div onClick={() => handleFreeUsage(data)}>
                                                    <AllIconsComponenet iconName={'lock2'} height={22} width={22} color={data.sectionItem.freeUsage ? '#00CF0F' : '#BC0303'} />
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