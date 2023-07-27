import React, { useState } from 'react'
import styles from '../../../../styles/InstructorPanelStyleSheets/ManageLibrary.module.scss'
import { FormItem } from '../../../../components/antDesignCompo/FormItem'
import Input from '../../../../components/antDesignCompo/Input'
import { Form } from 'antd'
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet'
import ModelForAddFolder from '../../../../components/ManageLibraryComponent/ModelForAddFolder/ModelForAddFolder'
import CurriculumSectionComponent from '../../../../components/ManageLibraryComponent/CurriculumSectionComponent/CurriculumSectionComponent'


const CreateCoursePath = () => {

    const [courseForm] = Form.useForm();
    const [curriculmName, setCurriculumName] = useState()
    const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false)
    const [folderType, setFolderType] = useState("curriculum")
    const [sectionDetails, setSectionDetails] = useState([])

    const onFinishCreateCoursepath = (item) => {
        setCurriculumName(item)
        courseForm.resetFields()
    }
    const handleAddFolder = (values) => {
        setIsModelForAddFolderOpen(true);
    };



    return (
        <div>
            <Form form={courseForm} onFinish={onFinishCreateCoursepath} >
                <div className={styles.borderBottomNavbar}>
                    <div className='maxWidthDefault px-4'>
                        <div className={`${styles.headerWrapper}`}>
                            <h1 className={`head2 py-8`}>{curriculmName?.pathTitle ? curriculmName?.pathTitle : "إنشاء مقرر"}</h1>
                        </div>
                    </div>
                </div>
                <div className={styles.bodyWrapper}>
                    <div className='maxWidthDefault p-4'>
                        <div className={styles.bodysubWrapper}>
                            <FormItem
                                name={'pathTitle'}
                                rules={[{ required: true, message: 'ادخل عنوان الدورة' }]}>
                                <Input
                                    placeholder="عنوان المقرر"
                                />
                            </FormItem>

                            {(curriculmName && sectionDetails.length == 0) &&
                                <div>
                                    <div className={`head2 py-2`}>
                                        <p>الأقسام</p>
                                    </div>
                                    <div className={styles.addSectionWrapper}>
                                        <div className={styles.tableBodyArea}>
                                            <div className={styles.noDataMainArea}>
                                                <AllIconsComponenet height={92} width={92} iconName={'noData'} color={'#00000080'} />
                                                <p className={`font-semibold py-2 `}>باقي ما أنشئت قسم</p>
                                                <div className={styles.createCourseBtnBox}>
                                                    <button className='primarySolidBtn' onClick={() => handleAddFolder('addSection')}>إضافة قسم</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            <CurriculumSectionComponent onclose={onclose} folderType={folderType} sectionList={sectionDetails} />

                            <div className={`${styles.savePathTitle}`}>
                                {!curriculmName && <button className={`primarySolidBtn ${styles.btnText} `}>حفظ ومتابعة</button>}
                                {curriculmName && <button className={`primarySolidBtn ${styles.btnText}`}>حفظ</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
            <ModelForAddFolder
                isModelForAddFolderOpen={isModelForAddFolderOpen}
                setIsModelForAddFolderOpen={setIsModelForAddFolderOpen}
                folderType={'section'}
            />
        </div>
    )
}

export default CreateCoursePath