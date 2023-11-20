import { Form, Modal } from 'antd';
import React, { useEffect } from 'react'
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import styles from './ModelForAddRegion.module.scss'
import { manageStateAndBranchConst } from '../../constants/adminPanelConst/manageStateAndBranch/manageStateAndBranch';
import { FormItem } from '../antDesignCompo/FormItem';
import Input from '../antDesignCompo/Input';

const ModelForManageRegion = ({
    isModelForRegion,
    setIsModelForRegion,
    editRegionData,
    setEditRegionData,
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
    const onFinish = (values) => {
        console.log(values)
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
                                name={'stateTitle'}
                                rules={[{ required: true, message: manageStateAndBranchConst.inputTextErrorMsg }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={manageStateAndBranchConst.inputTextPlaceHolder}
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