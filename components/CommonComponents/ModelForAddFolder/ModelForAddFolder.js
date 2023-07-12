import React, { useEffect } from 'react';
import { Form, Modal } from 'antd';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import styles from './ModelForAddFolder.module.scss'
import { FormItem } from '../../antDesignCompo/FormItem';
import Input from '../../antDesignCompo/Input';
import { createFolderAPI, updateFolderAPI } from '../../../services/apisService';
import { useSelector } from 'react-redux';

const ModelForAddFolder = ({
    isModelForAddFolderOpen,
    setIsModelForAddFolderOpen,
    folderType,
    selectedItem,
    onclose
}) => {

    const [form] = Form.useForm();
    const storeData = useSelector((state) => state?.globalStore);
    const isEdit = selectedItem != undefined ? true : false

    useEffect(() => {
        console.log(isEdit);
        form.setFieldValue('folderTitle', selectedItem?.name)
    }, [selectedItem?.name])

    const handleCreateFolder = async (values) => {
        if (!isEdit) {
            let addFolderbody = {
                name: values.folderTitle,
                type: folderType,
            }
            let data = {
                accessToken: storeData?.accessToken,
                data: addFolderbody
            }
            await createFolderAPI(data).then((res) => {
                console.log(res);
                setIsModelForAddFolderOpen(false)
            })
            form.resetFields()
        } else {
            let editFolderBody = {
                id: selectedItem?.id,
                name: values.folderTitle,
                type: selectedItem?.type,
            }
            let data = {
                accessToken: storeData?.accessToken,
                data: editFolderBody
            }
            await updateFolderAPI(data).then((res) => {
                setIsModelForAddFolderOpen(false)
            }).catch((error) => {
                console.log(error);
            })
        }
    }


    return (
        <>
            <Modal
                className='addAppoinmentModal'
                open={isModelForAddFolderOpen}
                onCancel={() => setIsModelForAddFolderOpen(false)}
                closeIcon={false}
                footer={false}
                afterClose={onclose}
            >

                <div className={styles.modalHeader}>
                    <button onClick={() => setIsModelForAddFolderOpen(false)} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                    <p className={`fontBold ${styles.createappointment}`}> إضافة مجلد</p>
                </div>
                <div dir='rtl'>
                    <Form form={form} onFinish={handleCreateFolder}>
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
                            <div className={styles.createAppointmentBtnBox}>
                                <button key='modalFooterBtn' className={styles.AddFolderBtn} type={'submit'} >{isEdit ? "حفظ" : "إنشاء"}</button>
                            </div>
                            {isEdit && <div className={styles.deleteVideoBtn}>
                                <button className='deleteBtn' type={'submit'} >حذف المجلد </button>
                            </div>}
                        </div>
                    </Form>
                </div>
            </Modal>
        </>
    );
}

export default ModelForAddFolder