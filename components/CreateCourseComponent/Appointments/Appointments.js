import React from 'react'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import styles from './Appointments.module.scss'
import { useState } from 'react';
import { Modal, Space, Switch } from 'antd';
import { Form, FormItem } from '../../antDesignCompo/FormItem';
import Select from '../../antDesignCompo/Select';
import DatePicker from '../../antDesignCompo/Datepicker';
import Input from '../../antDesignCompo/Input';


const Appointments = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const allAppointments = []

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    }
    const onChange = (checked) => {
        console.log(`switch to ${checked}`);
    };

    return (
        <div className='maxWidthDefault px-4'>
            <div>
                <table className={styles.tableArea}>
                    <thead className={styles.tableHeaderArea}>
                        <tr>
                            <th className={`${styles.tableHeadText} ${styles.appointTableHead1}`}>بيانات الفترة</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>المدرب</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead3}`}>تاريخ الإنشاء</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead4}`}>اخر تعديل</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead5}`}>الطلاب المسجلين</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead6}`}>الإجراءات</th>
                        </tr>
                    </thead>
                    {allPhysicalCourses.length > 0 &&
                        <tbody className={styles.tableBodyArea}>
                            {allAppointments?.map((course, index) => {
                                return (
                                    <tr key={`tableRow${index}`}>
                                        <td className={`${styles.tableBodyText} ${styles.tableBody1}`}></td>
                                        <td className={`${styles.tableBodyText} ${styles.tableBody2}`}></td>
                                        <td className={`${styles.tableBodyText} ${styles.tableBody3}`}></td>
                                        <td className={`${styles.tableBodyText} ${styles.tableBody4}`}></td>
                                        <td className={`${styles.tableBodyText} ${styles.tableBody5}`}></td>
                                        <td className={`${styles.tableBodyText} ${styles.tableBody6}`}></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    }
                </table>
                {allPhysicalCourses.length == 0 &&
                    <div className={styles.tableBodyArea}>
                        <div className={styles.noDataManiArea} >
                            <div className={styles.noDataSubArea} >
                                <AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
                                <p className='fontBold py-2' style={{ fontSize: '20px' }}>ما أنشئت أي موعد</p>
                                <div>
                                    <button className='primarySolidBtn' onClick={showModal}>إنشاء موعد</button>
                                    <Modal
                                        className='addAppoinmentModal'
                                        open={isModalOpen}
                                        onCancel={handleCancel}
                                        closeIcon={false}
                                        footer={[
                                            <button className={styles.construction} height={14} width={14} onClick={handleCancel}>إنشاء</button>
                                        ]}
                                    >
                                        <div className={styles.modalHeader}>
                                            <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'}></AllIconsComponenet>
                                            <p className={`fontBold ${styles.createappointment}`}>إنشاء موعد</p>
                                        </div>
                                        <div className={styles.createappointmentfields}>
                                            <Form>
                                                <FormItem
                                                    name={'choosethecoach'}
                                                >
                                                    <Select
                                                        fontSize={16}
                                                        width={352}
                                                        height={40}
                                                        placeholder="اختر المدرب"
                                                    />
                                                </FormItem>
                                                <FormItem
                                                    name={'choosethegender'}
                                                >
                                                    <Select
                                                        fontSize={16}
                                                        width={352}
                                                        height={40}
                                                        placeholder="اختر الجنس"
                                                    />
                                                </FormItem>
                                                <div className='flex'>
                                                    <FormItem
                                                        name={'expiryDate'}
                                                    >
                                                        <DatePicker
                                                            width={172}
                                                            height={40}
                                                            placeholder="تاريخ النهاية"
                                                            picker=""
                                                            suFFixIconName="calander"
                                                        />
                                                    </FormItem>
                                                    <FormItem
                                                        name={'startDate'}
                                                    >
                                                        <Space>
                                                            <DatePicker
                                                                width={172}
                                                                height={40}
                                                                placeholder="تاريخ البداية"
                                                                picker=""
                                                                suFFixIconName="calander"
                                                            />
                                                        </Space>
                                                    </FormItem>
                                                </div>
                                                <div className='flex'>
                                                    <FormItem
                                                        name={'tothehour'}
                                                    >
                                                        <DatePicker
                                                            width={172}
                                                            height={40}
                                                            placeholder="إلى الساعة"
                                                            picker="time"
                                                            suFFixIconName="clock"
                                                        />
                                                    </FormItem>
                                                    <FormItem
                                                        name={'fromthehour'}
                                                    >
                                                        <DatePicker
                                                            width={172}
                                                            height={40}
                                                            placeholder="من الساعة"
                                                            picker="time"
                                                            suFFixIconName="clock"
                                                        />
                                                    </FormItem>
                                                </div>
                                                <div className='flex'>
                                                    <FormItem
                                                        name={'link'}
                                                    >
                                                        <Input
                                                            fontSize={16}
                                                            width={172}
                                                            height={40}
                                                            placeholder="الرابط"
                                                        />
                                                    </FormItem>
                                                    <FormItem
                                                        name={'thesite'}
                                                    >
                                                        <Input
                                                            fontSize={16}
                                                            width={172}
                                                            height={40}
                                                            placeholder="الموقع"
                                                        />
                                                    </FormItem>
                                                </div>
                                                <FormItem
                                                    name={'numberofseats'}
                                                >
                                                    <Input
                                                        fontSize={16}
                                                        width={172}
                                                        height={40}
                                                        placeholder="عدد المقاعد"
                                                    />
                                                </FormItem>
                                                <div className='flex'>
                                                    <Switch defaultChecked onChange={onChange}></Switch>
                                                    <p className={styles.recordedcourse}>تفعيل محتوى الدورة المسجلة</p>
                                                </div>
                                            </Form>
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div >
                }
            </div >
        </div >
    )
}

export default Appointments;