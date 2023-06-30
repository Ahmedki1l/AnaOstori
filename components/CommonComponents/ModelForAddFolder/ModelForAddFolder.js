import React from 'react';
import { Form, Modal } from 'antd';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import styles from './ModelForAddFolder.module.scss'
import { FormItem } from '../../antDesignCompo/FormItem';
import Input from '../../antDesignCompo/Input';

const ModelForAddFolder = ({
    isModelForAddFolderOpen,
    setIsModelForAddFolderOpen,
    isModalForAddFolder,
}) => {

    const handleVideoSave = () => {
        setIsModelForAddFolderOpen(false)
    }

    return (
        <>
            <Modal
                className='addAppoinmentModal'
                open={isModelForAddFolderOpen}
                onCancel={() => setIsModelForAddFolderOpen(false)}
                closeIcon={false}
                footer={false}>

                <div className={styles.modalHeader}>
                    <button onClick={() => setIsModelForAddFolderOpen(false)} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                    <p className={`fontBold ${styles.createappointment}`}> إضافة مجلد</p>
                </div>
                <div dir='rtl'>
                    <Form>
                        <div className={styles.createAppointmentFields}>
                            <FormItem
                                name={'folderTitle'}
                                rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder="عنوان المجلد"
                                />
                            </FormItem>
                        </div>
                        <div className={styles.AppointmentFieldBorderBottom}>
                            <div className={styles.createAppointmentBtnBox} onClick={() => handleVideoSave()}>
                                <button key='modalFooterBtn' className={styles.AddFolderBtn} type={'submit'} >إنشاء</button>
                            </div>
                            {isModalForAddFolder && <div className={styles.deleteVideoBtn}>
                                <button className='deleteBtn' type={'submit'} >حذف الفيديو</button>
                            </div>}
                        </div>
                    </Form>
                </div>
            </Modal>
        </>
    );
}

export default ModelForAddFolder