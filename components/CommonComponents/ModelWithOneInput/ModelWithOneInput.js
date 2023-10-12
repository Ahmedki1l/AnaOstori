import React, { useEffect } from 'react';
import { Form, Modal } from 'antd';
import styles from './ModelWithOneInput.module.scss'
import { FormItem } from '../../antDesignCompo/FormItem';
import Input from '../../antDesignCompo/Input';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import CustomButton from '../CustomButton';
import { folderConst, curriculumConst, commonLibraryConst } from '../../../constants/adminPanelConst/manageLibraryConst/manageLibraryConst'

const ModelWithOneInput = ({
    open,
    setOpen,
    isEdit,
    onSave,
    onDelete,
    itemName,
    curriCulumSection,
}) => {

    useEffect(() => {
        if (!isEdit) return
        inputForm.setFieldValue('name', itemName)
    }, [itemName])

    const [inputForm] = Form.useForm();

    const handleCreateFolder = async (values) => {
        onSave(values)
        inputForm.resetFields()
    }

    const onModalClose = () => {
        inputForm.resetFields()
        setOpen(false)
    }

    return (
        <>
            <Modal
                className='addAppoinmentModal'
                open={open}
                onCancel={() => onModalClose()}
                closeIcon={false}
                footer={false}
            >
                <div className={styles.modalHeader}>
                    <button onClick={() => onModalClose()} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} />
                    </button>
                    {curriCulumSection == 'addSection' ?
                        <p className={`fontBold ${styles.createappointment}`}>{isEdit ? curriculumConst.addSectionModelConst.editSectionTitle : curriculumConst.addSectionModelConst.addSectionTitle}</p>
                        :
                        <p className={`fontBold ${styles.createappointment}`}>{isEdit ? folderConst.addAndEditFolderModelConst.editPopUpTitle : folderConst.addAndEditFolderModelConst.addPopUpTitle}</p>
                    }
                </div>
                <div dir='rtl'>
                    <Form form={inputForm} onFinish={handleCreateFolder}>
                        <div className={styles.createAppointmentFields}>
                            <FormItem
                                name={'name'}
                                rules={[{ required: true, message: curriCulumSection == 'addSection' ? curriculumConst.addSectionModelConst.sectionTitleInputError : folderConst.addAndEditFolderModelConst.folderNameInputError }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={curriCulumSection == 'addSection' ? curriculumConst.addSectionModelConst.sectionTitleInputPlaceholder : folderConst.addAndEditFolderModelConst.folderNameInputPlaceholder}
                                />
                            </FormItem>
                        </div>
                        <div className={styles.AppointmentFieldBorderBottom}>
                            <div className='pt-2'>
                                <CustomButton
                                    btnText={isEdit ? commonLibraryConst.updateBtnText : commonLibraryConst.addBtnText}
                                    width={80}
                                    height={37}
                                    fontSize={16}
                                />
                            </div>
                            {/* {isEdit && <div className={styles.deleteVideoBtn}>
                                <button className='deleteBtn' onClick={() => handleDelete()} >حذف المجلد </button>
                            </div>} */}
                        </div>
                    </Form>
                </div>
            </Modal>
        </>
    );
}

export default ModelWithOneInput