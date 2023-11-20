import { Form, Modal } from 'antd'
import React, { useEffect } from 'react'
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import styles from './ModelForManageBranch.module.scss'
import { manageStateAndBranchConst } from '../../constants/adminPanelConst/manageStateAndBranch/manageStateAndBranch';
import { FormItem } from '../antDesignCompo/FormItem';
import Input from '../antDesignCompo/Input';
import InputWithLocation from '../antDesignCompo/InputWithLocation';

const ModelForManageBranch = ({
    isModelForAddBranch,
    setIsModelForAddBranch,
    isEdit,
    editBranchData,
    setEditBranchData
}) => {
    useEffect(() => {
        branchForm.setFieldsValue(editBranchData)
    }, [])

    const [branchForm] = Form.useForm()
    const isModelClose = () => {
        setEditBranchData()
        setIsModelForAddBranch(false)
    }
    const onFinish = (values) => {
        console.log(values)
    }
    return (
        <div>
            <Modal
                className='addAppoinmentModal'
                open={isModelForAddBranch}
                onCancel={isModelClose}
                closeIcon={false}
                footer={false}>

                <div className={styles.modalHeader}>
                    <button onClick={isModelClose} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                    <p className={`fontBold ${styles.addBranch}`}>{manageStateAndBranchConst.addBranchTitle}</p>
                </div>
                <div dir='rtl'>
                    <Form form={branchForm} onFinish={onFinish}>
                        <div className={styles.createBranchFields}>
                            <p className='mb-1 font-medium text-sm'>{manageStateAndBranchConst.NeighborhoodAddress}</p>
                            <FormItem
                                name={'branchName'}
                                rules={[{ required: true, message: manageStateAndBranchConst.districtTitleinputErrorMsg }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={manageStateAndBranchConst.districtTitlePlaceholder}
                                />
                            </FormItem>
                            <p className='mb-1 font-medium text-sm'>{manageStateAndBranchConst.districtBranchTitle}</p>
                            <FormItem
                                name={'districtTitle'}
                                rules={[{ required: true, message: manageStateAndBranchConst.branchMapinputErrorMsg }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={manageStateAndBranchConst.districtBranchPlaceholder}
                                />
                            </FormItem>
                            <p className='mb-1 font-medium text-sm'>{manageStateAndBranchConst.branchMapTitle}</p>
                            <FormItem
                                name={'link'}
                                rules={[{ required: true, message: manageStateAndBranchConst.branchMapinputErrorMsg }]}
                            >
                                <InputWithLocation
                                    width={352}
                                    height={40}
                                    placeholder={manageStateAndBranchConst.branchMapPlaceholder}
                                    suFFixIconName="linkDoubleColorIcon"
                                />
                            </FormItem>
                        </div>
                        <div className={styles.branchModelBottomArea}>
                            <button key='modalFooterBtn' className='primarySolidBtn' type={'submit'} >{editBranchData ? manageStateAndBranchConst.saveBtnText : manageStateAndBranchConst.addBtnText}</button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    )
}

export default ModelForManageBranch