import { Form, Modal } from 'antd'
import React, { useState } from 'react'
import { FormItem } from '../antDesignCompo/FormItem'
import Input from '../antDesignCompo/Input'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import styles from './ModelForStudentFeedBack.module.scss'
import { studentFeedBackConst } from '../../constants/adminPanelConst/manageStudentFeedBackConst/manageStudentFeedBackConst'
import Select from '../antDesignCompo/Select'
import { useSelector } from 'react-redux'

const ModelForStudentFeedBack = ({
    isEdit,
    isModelForStudentFeedBack,
    setIsModelForStudentFeedBack,
    studentFeedBackData
}) => {

    const [appVersionForm] = Form.useForm()
    const storeData = useSelector((state) => state?.globalStore);
    const [selectCourseName, setSelectCourseName] = useState()
    const isModelClose = () => {
        setIsModelForStudentFeedBack(false)
    }

    const course = storeData.catagories.flatMap((item) => {
        return item.courses.map((subItem) => {
            return { value: subItem.id, label: subItem.name };
        });
    })

    const onFinish = (values) => {
        console.log(values);
    }
    const handleSelectCourse = (value) => {
        setSelectCourseName(value);
    }

    const categoryName = storeData.catagories.find((selectCourseName) => {
        console.log(selectCourseName);

    })

    return (
        <div>
            <Modal
                className='addAppoinmentModal'
                open={isModelForStudentFeedBack}
                onCancel={isModelClose}
                closeIcon={false}
                footer={false}
            >
                <div className={styles.modalHeader}>
                    <button onClick={isModelClose} className={styles.closebutton}>
                        <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                    <p className={`fontBold ${styles.studentFeedBackTitle}`}>{isEdit ? studentFeedBackConst.editStudentFeedBackTitle : studentFeedBackConst.addStudentFeedBackTitle}</p>
                </div>
                <div dir='rtl'>
                    <Form form={appVersionForm} onFinish={onFinish}>
                        <div className={styles.studentFeedBackFields}>
                            <p className={`fontMedium text-lg`}>{studentFeedBackConst.studentName}</p>
                            <FormItem
                                name={'studentName'}
                                rules={[{ required: true, message: 'ereruhgie' }]}
                            >
                                <Input
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={studentFeedBackConst.studentNamePlaceHolder}
                                />
                            </FormItem>
                            <p className={`fontMedium text-lg`}>{studentFeedBackConst.selectCategories}</p>
                            <FormItem
                                name={'selectCategories'}
                                rules={[{ required: true, message: 'selectCategories' }]}
                            >
                                <Select
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder={studentFeedBackConst.selectCategories}
                                    OptionData={course}
                                    onChange={handleSelectCourse}
                                />
                            </FormItem>
                            <div className={styles.courseNames}>
                                <p>ewrew</p>
                            </div>
                            {/* <div className={styles.addSectionArea}>
                                <p className={`fontMedium text-lg`}>{studentFeedBackConst.addFeedBackPhoto}</p>
                                <p className={styles.addSections} onClick={() => handleAddSection()}>{studentFeedBackConst.addPhotoBtnText}</p>
                            </div>
                            <div className='flex'>
                                <div className='mt-2'>
                                    <AllIconsComponenet iconName={'dragIcon'} height={24} width={24} color={'#0000008a'} />
                                </div>
                                <div className={`m-2 ${styles.addItems}`}>
                                    <div className='flex'>
                                        <AllIconsComponenet iconName={'uploadDataIcon'} height={18} width={18} color={'#F26722'} />
                                        <p className='text-base mr-2'>{studentFeedBackConst.uploadPhotoTitle}</p>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        <div className='p-1'>
                            <div className={styles.studetnFeedBackBtnBox}>
                                <button className='primarySolidBtn'>{isEdit ? studentFeedBackConst.saveBtnText : studentFeedBackConst.addBtnText}</button>
                            </div>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div >
    )
}

export default ModelForStudentFeedBack