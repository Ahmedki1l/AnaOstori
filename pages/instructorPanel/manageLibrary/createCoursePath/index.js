import React, { useState } from 'react'
import styles from '../../../../styles/InstructorPanelStyleSheets/ManageLibrary.module.scss'
import { FormItem } from '../../../../components/antDesignCompo/FormItem'
import Input from '../../../../components/antDesignCompo/Input'
import { Form } from 'antd'
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet'


const CreateCoursePath = () => {

    const [courseForm] = Form.useForm();
    const [curriculmName, setCurriculumName] = useState()

    const onFinishCreateCoursepath = (item) => {
        setCurriculumName(item)
    }

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

                            {curriculmName && <div>
                                <div className={`head2 py-2`}>
                                    <p>الأقسام</p>
                                </div>
                                <div className={styles.addSectionWrapper}>
                                    <div className={styles.tableBodyArea}>
                                        <div className={styles.noDataMainArea}>
                                            <AllIconsComponenet height={92} width={92} iconName={'noData'} color={'#00000080'} />
                                            <p className={`font-semibold py-2 `}>باقي ما أنشئت قسم</p>
                                            <div className={styles.createCourseBtnBox}>
                                                <button className='primarySolidBtn'>إضافة قسم</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }

                            <div className={`${styles.savePathTitle}`}>
                                {!curriculmName && <button className={`primarySolidBtn ${styles.btnText} `}>حفظ ومتابعة</button>}
                                {curriculmName && <button className={`primarySolidBtn ${styles.btnText} `}>حفظ</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default CreateCoursePath