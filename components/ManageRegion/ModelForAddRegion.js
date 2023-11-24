import { Form, Modal } from 'antd';
import React, { use, useEffect } from 'react'
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import styles from './ModelForAddRegion.module.scss'
import { manageStateAndBranchConst } from '../../constants/adminPanelConst/manageStateAndBranch/manageStateAndBranch';
import { FormItem } from '../antDesignCompo/FormItem';
import Input from '../antDesignCompo/Input';
import { postAuthRouteAPI } from '../../services/apisService';

const ModelForManageRegion = ({
    isModelForRegion,
    setIsModelForRegion,
    editRegionData,
    setEditRegionData,
    getRegionAndBranchList,
}) => {

    useEffect(() => {
        regionForm.setFieldsValue(editRegionData)
    }, [])

    const [regionForm] = Form.useForm()

    const isModelClose = () => {
        setIsModelForRegion(false)
        setEditRegionData()
        regionForm.resetFields()
    }
    const onFinish = async (values) => {
        let createBody = {
            routeName: 'createRegion',
            ...values,
        }
        let updateBody = {
            routeName: 'updateRegion',
            ...values,
            id: editRegionData?.id
        }
        await postAuthRouteAPI(editRegionData ? updateBody : createBody).then((res) => {
            setIsModelForRegion(false)
            getRegionAndBranchList()
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <>
            <Modal
                className='addAppoinmentModal'
                open={isModelForRegion}
                onCancel={isModelClose}
                closeIcon={false}
                footer={false}>
                <div className={styles.modalHeader}>
                    <button onClick={isModelClose} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                    <p className={`fontBold ${styles.addRegion}`}>{manageStateAndBranchConst.addRegionModelTitle}</p>
                </div>
                <div dir='rtl'>
                    <Form form={regionForm} onFinish={onFinish}>
                        <div className={styles.createNewsFields}>
                            <p className='mb-1 font-medium text-sm'>{manageStateAndBranchConst.regionAddressTitle}</p>
                            <FormItem
                                name={'nameAr'}
                                rules={[{ required: true, message: manageStateAndBranchConst.inputTextErrorMsg }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={manageStateAndBranchConst.inputTextPlaceHolder}
                                />
                            </FormItem>
                            <p className='mb-1 font-medium text-sm'>regionName</p>
                            <FormItem
                                name={'nameEn'}
                                rules={[{ required: true, message: 'regionName' }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder='regionName'
                                />
                            </FormItem>
                        </div>
                        <div className={styles.newsFieldBorderBottom}>
                            <button key='modalFooterBtn' className='primarySolidBtn' type={'submit'} >{editRegionData ? manageStateAndBranchConst.saveBtnText : manageStateAndBranchConst.addBtnText}</button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default ModelForManageRegion