import { useRouter } from 'next/router';
import React from 'react'
import styles from '../../../../../styles/InstructorPanelStyleSheets/CreateCourse.module.scss'
import Select from '../../../../../components/antDesignCompo/Select';
import { Form } from 'antd';
import { FormItem } from '../../../../../components/antDesignCompo/FormItem';
import Input from '../../../../../components/antDesignCompo/Input';


export default function Index() {
    const { courseType, createCourse } = useRouter().query
    const onFinish = (values) => {
        console.log(values);
    };


    return (
        <>
            <div className={styles.headerWrapper}>
                <div className='maxWidthDefault px-4'>
                    <h1 className={`head2 ${styles.createCourseHeaderText}`}>
                        {courseType == "physicalCourse" ? "إنشاء دورة حضورية" : courseType == "onlineCourse" ? "إنشاء دورة مباشرة" : "إنشاء دورة مسجلة"}
                    </h1>
                    <p className={`fontBold ${styles.courseInfoText}`}>معلومات الدورة </p>
                </div>
            </div>
            <div className={styles.bodyWrapper}>
                <div className='maxWidthDefault p-4'>
                    <div className={styles.bodysubWrapper}>
                        <Form onFinish={onFinish}>
                            <FormItem
                                name={'courseName'}
                                rules={[{ required: true }]}
                            >
                                <Input
                                    placeholder="عنوان الدورة"
                                />
                            </FormItem>
                            <FormItem
                                name={'catagoriName'}
                                rules={[{ required: true }]}
                            >
                                <Input
                                    placeholder="عنوان الدورة"
                                />
                            </FormItem>
                            {/* <FormItem
                                name={['user', 'name', 'firstName']}
                            // rules={[
                            //     {
                            //         required: true,
                            //     },
                            // ]}
                            >
                                <Select
                                    placeholder="اختر تصنيف الدورة"
                                    OptionData={[
                                        {
                                            label: 'Chirag',
                                            value: 'chirag'
                                        },
                                        {
                                            label: 'Hiren',
                                            value: 'hiren'
                                        },
                                        {
                                            label: 'Mayur',
                                            value: 'mayur'
                                        },
                                        {
                                            label: 'Anand',
                                            value: 'anand'
                                        },
                                    ]}
                                    filterOption={false}
                                />
                            </FormItem> */}
                            <FormItem>
                                <button type="primary" htmltype="submit">Submit</button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div >
        </>
    )
}
