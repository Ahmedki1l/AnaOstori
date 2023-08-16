
import { Form, Modal } from 'antd'
import React, { useState } from 'react'
import styles from './ModelForAddInstructor.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import { FormItem } from '../antDesignCompo/FormItem'
import Input from '../antDesignCompo/Input'
import InputTextArea from '../antDesignCompo/InputTextArea'


const ModelForAddInstructor = ({
    isModelForAddInstructor,
    setIsModelForAddInstructor,
    isEdit,
    instructorDetails
}) => {
    console.log(instructorDetails);

    const [form] = Form.useForm();

    const addInstructor = (values) => {
        console.log(values);
        form.resetFields()
        setIsModelForAddInstructor(false)
    }
    const handleDelete = (values) => {
        console.log(values);
    };

    return (
        <div>
            <Modal
                className='addAppoinmentModal'
                open={isModelForAddInstructor}
                onCancel={() => setIsModelForAddInstructor(false)}
                closeIcon={false}
                footer={false}>

                <div className={styles.modalHeader}>
                    <button onClick={() => setIsModelForAddItemOpen(false)} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                    <p className={`fontBold ${styles.addInstructor}`}>إضافة مدرب</p>
                </div>
                <div dir='rtl'>
                    <Form form={form} onFinish={addInstructor}>
                        <div className={styles.createAppointmentFields}>
                            <FormItem
                                name={'name'}
                                rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder="اسم المدرب"
                                />
                            </FormItem>
                            <div className="flex">
                                <div>
                                    <FormItem
                                        name={'email'}
                                        rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                                    >
                                        <Input
                                            fontSize={16}
                                            width={170}
                                            height={40}
                                            placeholder="الايميل"
                                        />
                                    </FormItem>
                                </div>
                                <div>
                                    <FormItem
                                        name={'phoneNo'}
                                        rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                                    >
                                        <Input
                                            fontSize={16}
                                            width={170}
                                            height={40}
                                            placeholder="رقم الجوال"
                                        />
                                    </FormItem>
                                </div>
                            </div>
                            <FormItem
                                name={'role'}
                                rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder="المنصب"
                                />
                            </FormItem>
                            <FormItem
                                name={'bio'}>
                                <InputTextArea
                                    fontSize={16}
                                    height={132}
                                    width={352}
                                    placeholder="الوصف"
                                />
                            </FormItem>
                            <p className={`mb-3 fontBold ${styles.addInstructor}`}>الصورة الشخصية</p>
                            <>
                                <input type={'file'} id='uploadFileInput' className={styles.uploadFileInput} />
                                <label className={styles.uploadVideoWrapper} htmlFor='uploadFileInput'>
                                    <div className={styles.IconWrapper}>
                                        <div className={styles.uploadFileWrapper}>
                                            <AllIconsComponenet iconName={'uploadFile'} height={20} width={20} color={'#6D6D6D'} />
                                        </div>
                                        <p>ارفق الملف</p>
                                    </div>
                                    <div className={styles.uploadFileNameWrapper}>
                                        <div className={styles.closeIconWrapper}><AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#FF0000'} /></div>
                                        <p>video title here</p>
                                    </div>
                                </label>
                            </>
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

export default ModelForAddInstructor