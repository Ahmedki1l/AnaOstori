import React, { useState } from 'react';
import { Form, Modal } from 'antd';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import styles from './ModelForAddItems.module.scss'
import { FormItem } from '../../antDesignCompo/FormItem';
import Input from '../../antDesignCompo/Input';
import InputTextArea from '../../antDesignCompo/InputTextArea';

const ModelForAddItems = ({
    isModelForAddItemsOpen,
    setIsModelForAddItemsOpen,
}) => {

    const handleAddItems = () => {
        setIsModelForAddItemsOpen(true);
    };

    return (
        <>
            <Modal
                className='addAppoinmentModal'
                open={isModelForAddItemsOpen}
                onCancel={() => setIsModelForAddItemsOpen(false)}
                closeIcon={false}
                footer={false}>

                <div className={styles.modalHeader}>
                    <button onClick={() => setIsModelForAddItemsOpen(false)} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                    <p className={`fontBold ${styles.createappointment}`}>إضافة فيديو</p>
                </div>
                <div dir='rtl'>
                    <Form>
                        <div className={styles.createAppointmentFields}>
                            <FormItem
                                name={'videoTitle'}
                                rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder="عنوان الفيديو"
                                />
                            </FormItem>
                            <FormItem
                                name={'videoDescription'}>
                                <InputTextArea
                                    fontSize={16}
                                    height={76}
                                    width={352}
                                    placeholder="وصف الفيديو"
                                />
                            </FormItem>
                            <FormItem>
                                <div className={styles.uploadVideoWrapper}>
                                    <div className={styles.IconWrapper} >
                                        <div className={styles.uploadFileWrapper}><AllIconsComponenet iconName={'uploadFile'} height={20} width={20} color={'#000000'} />   </div>
                                        <p>تقييم الدورة</p>
                                    </div>
                                </div>
                            </FormItem>
                        </div>
                        <div className={styles.AppointmentFieldBorderBottom}>
                            <div className={styles.createAppointmentBtnBox}>
                                <button key='modalFooterBtn' className={styles.AddFolderBtn} type={'submit'} >إنشاء</button>
                            </div>
                            <div className={styles.deleteVideoBtn}>
                                <button className='deleteBtn' type={'submit'} onClick={handleAddItems}>حذف الفيديو</button>
                            </div>
                        </div>
                    </Form>
                </div>
            </Modal>
        </>
    );
}

export default ModelForAddItems;