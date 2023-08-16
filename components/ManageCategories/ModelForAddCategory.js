

import { Form, Modal } from 'antd'
import React, { useEffect } from 'react'
import styles from './ModelForAddCategory.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import { FormItem } from '../antDesignCompo/FormItem';
import Input from '../antDesignCompo/Input';
import InputTextArea from '../antDesignCompo/InputTextArea';
import Switch from '../antDesignCompo/Switch';

const ModelForAddCategory = ({
    isModelForAddCategory,
    setIsModelForAddCategory,
    isEdit,
    categoriesDetails,
}) => {

    console.log(categoriesDetails);

    useEffect(() => {
        // form.setFieldValue('categoryTitle', categoriesDetails.name)
        // form.setFieldValue('order', categoriesDetails.order)
        // form.setFieldValue('discription', categoriesDetails.description)
    }, [categoriesDetails])

    const [form] = Form.useForm();

    const addInstructor = (values) => {
        console.log(values);
        form.resetFields()
        setIsModelForAddCategory(false)
    }
    const handleDelete = (values) => {
        console.log(values);
    };
    const onChange = (checked) => {
        console.log(`switch to ${checked}`);
    };

    return (
        <div>
            <Modal
                className='addAppoinmentModal'
                open={isModelForAddCategory}
                onCancel={() => setIsModelForAddCategory(false)}
                closeIcon={false}
                footer={false}>

                <div className={styles.modalHeader}>
                    <button onClick={() => setIsModelForAddItemOpen(false)} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                    <p className={`fontBold ${styles.addCategory}`}>إضافة مجال</p>
                </div>
                <div dir='rtl'>
                    <Form form={form} onFinish={addInstructor}>
                        <div className={styles.createAppointmentFields}>
                            <FormItem
                                name={'categoryTitle'}
                                rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder="عنوان المجال"
                                />
                            </FormItem>
                            <FormItem
                                name={'order'}
                                rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder="الترتيب"
                                />
                            </FormItem>
                            <FormItem
                                name={'discription'}>
                                <InputTextArea
                                    fontSize={16}
                                    height={132}
                                    width={352}
                                    placeholder="الوصف"
                                />
                            </FormItem>
                            <p className={`mb-3 fontBold ${styles.addInstructor}`}>صورة المجال</p>
                            <>
                                <input type={'file'} id='uploadFileInput' className={styles.uploadFileInput} />
                                <label className={styles.uploadVideoWrapper} htmlFor='uploadFileInput'>
                                    <div className={styles.IconWrapper}>
                                        <div className={styles.uploadFileWrapper}>
                                            <AllIconsComponenet iconName={'uploadFile'} height={20} width={20} color={'#6D6D6D'} />
                                        </div>
                                        <p>ارفق الصورة</p>
                                    </div>
                                    <div className={styles.uploadFileNameWrapper}>
                                        <div className={styles.closeIconWrapper}><AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#FF0000'} /></div>
                                        <p>video title here</p>
                                    </div>
                                </label>
                            </>
                            <div className='flex items-center mb-2'>
                                <Switch defaultChecked onChange={onChange} ></Switch>
                                <p className={styles.recordedcourse}>إظهار المجال</p>
                            </div>
                        </div>

                        <div className={styles.AppointmentFieldBorderBottom}>
                            <div className={styles.createAppointmentBtnBox}>
                                <button key='modalFooterBtn' className={styles.AddFolderBtn} type={'submit'}>حفظ</button>
                            </div>
                            {isEdit &&
                                <div className={styles.deleteVideoBtn}>
                                    <button className='deleteBtn' type={'submit'} onClick={handleDelete}>حذف المدرب</button>
                                </div>
                            }
                        </div>
                    </Form>
                </div>
            </Modal>
        </div >
    )
}

export default ModelForAddCategory