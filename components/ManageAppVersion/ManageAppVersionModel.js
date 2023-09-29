import { Modal } from 'antd'
import React, { useState } from 'react'
import { Form, FormItem } from '../antDesignCompo/FormItem'
import Input from '../antDesignCompo/Input'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import styles from './ManageAppVersion.module.scss'
import axios from 'axios'
import { appVersionConst } from '../../constants/adminPanelConst/appVersionConst/appVersionConst'


const ManageAppVersionModel = ({ isModelForAppVersion,
    setIsModelforAppVersion
}) => {

    const [appVersionForm] = Form.useForm()
    const [formValues, setFormValues] = useState({
        androidCurrentVersion: '',
        androidMinVersion: '',
        iosCurrentVersion: '',
        iosMinVersion: '',
    });


    useState(async () => {
        axios.get(`${process.env.API_BASE_URL}/home/metadata`).then((res) => {
            const updatedFormValues = {};
            res?.data.forEach(item => {
                updatedFormValues[item.key] = item.value;
            });
            setFormValues(updatedFormValues);
            appVersionForm.setFieldsValue(updatedFormValues)
        }).catch((err) => {
            console.log(err);
        })
    }, [])

    const isModelClose = () => {
        setIsModelforAppVersion(false)
    }

    const onFinish = (values) => {
        console.log(values);
    }

    return (
        <div>
            <Modal
                className='addAppoinmentModal'
                open={isModelForAppVersion}
                closeIcon={false}
                footer={false}
                onCancel={isModelClose}
            >
                <div className={styles.modalHeader}>
                    <button onClick={isModelClose} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                    <p className={`fontBold ${styles.appVersionHeadText}`}>{appVersionConst.appVersionTitle}</p>
                </div>
                <div dir='rtl'>
                    <Form form={appVersionForm} onFinish={onFinish}>
                        <div className={styles.createAppVersionFields}>
                            <div className={styles.checkBoxHead}>
                                <AllIconsComponenet iconName={'androidStore'} height={24} width={24} color={'#2D2E2D'} />
                                <p className={styles.appleVersionText}>{appVersionConst.androidVersionText}</p>
                            </div>
                            <p className={` ${styles.addVersion}`}>{appVersionConst.curruentVersionText}</p>
                            <FormItem
                                name={'androidCurrentVersion'}
                                rules={[{ required: true, message: appVersionConst.currurentVersionInputError }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={appVersionConst.currentVersionPlaceHolder}
                                />
                            </FormItem>
                            <p className={` ${styles.addVersion}`}>{appVersionConst.minimumVersionText}</p>
                            <FormItem
                                name={'androidMinVersion'}
                                rules={[{ required: true, message: appVersionConst.minimumVersionInputError }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={appVersionConst.minimumVersionPlaceHolder}
                                />
                            </FormItem>
                            <div className={styles.checkBoxHead}>
                                <AllIconsComponenet iconName={'appleStore'} height={24} width={24} color={'#2D2E2D'} />
                                <p className={styles.appleVersionText}>{appVersionConst.appleVersionText}</p>
                            </div>
                            <p className={` ${styles.addVersion}`}>{appVersionConst.curruentVersionText}</p>
                            <FormItem
                                name={'iosCurrentVersion'}
                                rules={[{ required: true, message: appVersionConst.currurentVersionInputError }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={appVersionConst.currentVersionPlaceHolder}
                                />
                            </FormItem>
                            <p className={` ${styles.addVersion}`}>{appVersionConst.minimumVersionText}</p>
                            <FormItem
                                name={'iosMinVersion'}
                                rules={[{ required: true, message: appVersionConst.minimumVersionInputError }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={appVersionConst.minimumVersionPlaceHolder}
                                />
                            </FormItem>
                        </div>
                        <div className={styles.AppVersionBorderBottom}>
                            <div className={styles.createAppointmentBtnBox}>
                                <button className='primarySolidBtn' type={'submit'}>حفظ</button>
                            </div>
                        </div>
                    </Form>
                </div>
            </Modal >
        </div >
    )
}

export default ManageAppVersionModel