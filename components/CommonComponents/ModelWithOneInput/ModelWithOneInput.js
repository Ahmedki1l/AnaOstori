import React, { useEffect } from 'react';
import { Form, Modal } from 'antd';
import styles from './ModelWithOneInput.module.scss'
import { FormItem } from '../../antDesignCompo/FormItem';
import Input from '../../antDesignCompo/Input';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';

const ModelWithOneInput = ({
    open,
    setOpen,
    isEdit,
    onSave,
    onDelete,
    itemName,
}) => {

    useEffect(() => {
        form.setFieldValue('name', itemName)
    }, [itemName])

    const [form] = Form.useForm();

    const handleCreateFolder = async (values) => {
        onSave(values)
        form.resetFields()
    }

    const handleDelete = () => {
        onDelete()
    }


    return (
        <>
            <Modal
                className='addAppoinmentModal'
                open={open}
                onCancel={() => setOpen(false)}
                closeIcon={false}
                footer={false}
                afterClose={onclose}
            >
                <div className={styles.modalHeader}>
                    <button onClick={() => setOpen(false)} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} />
                    </button>
                    <p className={`fontBold ${styles.createappointment}`}> إضافة مجلد</p>
                </div>
                <div dir='rtl'>
                    <Form form={form} onFinish={handleCreateFolder}>
                        <div className={styles.createAppointmentFields}>
                            <FormItem
                                name={'name'}
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
                                <button className='deleteBtn' onClick={() => handleDelete()} >حذف المجلد </button>
                            </div>}
                        </div>
                    </Form>
                </div>
            </Modal>
        </>
    );
}

export default ModelWithOneInput