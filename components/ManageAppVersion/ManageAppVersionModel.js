import { Modal } from 'antd'
import React from 'react'
import { Form, FormItem } from '../antDesignCompo/FormItem'
import Input from '../antDesignCompo/Input'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import styles from './ManageAppVersion.module.scss'


const ManageAppVersionModel = ({ isModelForAppVersion,
    setIsModelforAppVersion
}) => {

    const isModelClose = () => {
        setIsModelforAppVersion(false)
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
                    <p className={`fontBold ${styles.addCategory}`}>app version control</p>
                </div>
                <Form>
                    <FormItem
                        name={'name'}
                        rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                    >
                        <Input
                            fontSize={16}
                            width={352}
                            height={40}
                            placeholder="العنوان"
                        />
                    </FormItem>
                </Form>
            </Modal>
        </div>
    )
}

export default ManageAppVersionModel