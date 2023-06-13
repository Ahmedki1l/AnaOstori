import React, { use, useEffect } from 'react'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import styles from './Appointment.module.scss'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Switch } from 'antd';
import { Form, FormItem } from '../../antDesignCompo/FormItem';
import Select from '../../antDesignCompo/Select';
import DatePicker from '../../antDesignCompo/Datepicker';
import Input from '../../antDesignCompo/Input';
import * as PaymentConst from '../../../constants/PaymentConst';
import { createCourseAvailabilityAPI, editAvailabilityAPI, getAllAvailabilityAPI } from '../../../services/apisService';
import Link from 'next/link';
import { dateRange, fullDate, timeDuration } from '../../../constants/DateConverter';
import dayjs from 'dayjs';

const Appointments = ({ courseId }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAvailabilityEdit, setIsAvailabilityEdit] = useState(false)
    const [editAvailability, setEditAvailability] = useState('')
    const storeData = useSelector((state) => state?.globalStore);
    const instructorList = storeData?.instructorList;
    const genders = PaymentConst.genders
    const [allAppointments, setAllAppointments] = useState([])
    const [form] = Form.useForm();
    const dispatch = useDispatch();


    const instructor = instructorList?.map((obj) => {
        return {
            key: obj.id,
            label: obj.name,
            value: obj.id
        }
    });

    useEffect(() => {
        getAllAvailability()
    }, [])

    const onChange = (checked) => {
        console.log(`switch to ${checked}`);
    };

    const onFinish = async (values) => {

        console.log(values, 47);
        values.dateFrom = dayjs(values?.dateFrom?.$d).format('YYYY-MM-DD HH:mm:ss');
        values.dateTo = dayjs(values?.dateTo?.$d).format('YYYY-MM-DD HH:mm:ss');
        values.timeFrom = dayjs(values?.timeFrom?.$d).format('HH:mm:ss')
        values.timeTo = dayjs(values?.timeTo?.$d).format('HH:mm:ss')
        values.courseId = '74e845ef-ef1a-4e05-9f80-1ef682eaa4c3';
        values.numberOfSeats = '0';
        console.log(values, 54);

        let body = {
            data: values,
            accessToken: storeData?.accessToken,
            availabilityId: editAvailability?.id
        }
        if (isAvailabilityEdit) {
            await editAvailabilityAPI(body).then((res) => {
                console.log(res);
                setIsModalOpen(false)
                getAllAvailability()
            }).catch((error) => {
                console.log(error);
            })
        } else {
            await createCourseAvailabilityAPI(body).then((res) => {
                console.log(res);
                setIsModalOpen(false)
                getAllAvailability()
            }).catch((error) => {
                console.log(error);
            })
        }
        console.log(values);
        form.resetFields()
    }

    const getAllAvailability = async () => {
        let body = {
            accessToken: storeData?.accessToken,
            // courseId: courseId
            courseId: "74e845ef-ef1a-4e05-9f80-1ef682eaa4c3"
        }
        await getAllAvailabilityAPI(body).then((res) => {
            console.log(res);
            setAllAppointments(res?.data)
            dispatch({
                type: 'SET_AllAVAILABILITY',
                availabilityList: res?.data,
            })
        }).catch((error) => {
            console.log(error);
        })
    }

    const editAppointment = (appointment) => {
        console.log(appointment);
        setIsModalOpen(true)
        setIsAvailabilityEdit(true)
        setEditAvailability(appointment)
        form.setFieldsValue({
            instructorId: appointment?.instructorId,
            location: appointment?.location,
            locationName: appointment?.locationName,
            gender: appointment?.gender,
            maxNumberOfSeats: appointment?.maxNumberOfSeats,
            dateFrom: dayjs(appointment?.dateFrom, 'YYYY-MM-DD'),
            dateTo: dayjs(appointment?.dateTo, 'YYYY-MM-DD'),
            timeFrom: dayjs(appointment?.timeFrom, 'HH:mm:ss'),
            timeTo: dayjs(appointment?.timeTo, 'HH:mm:ss'),
        });
    }
    const handleCreateAvailability = () => {
        setIsModalOpen(true)
        setIsAvailabilityEdit(false)
    }
    const handelModalClose = () => {
        form.resetFields()
        setIsModalOpen(false)
    }
    return (
        <div className='maxWidthDefault px-4'>
            <div>
                <div dir='ltr'>
                    <button className={styles.createNewAvailability} onClick={() => handleCreateAvailability()}>إنشاء موعد</button>
                </div>
                <table className={styles.tableArea}>
                    <thead className={styles.tableHeaderArea}>
                        <tr>
                            <th className={`${styles.tableHeadText} ${styles.tableHead1}`}>بيانات الفترة</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>المدرب</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead3}`}>تاريخ الإنشاء</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead4}`}>اخر تعديل</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead5}`}> الطلاب المسجلين</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead6}`}>الاختبارات</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead7}`}>الإجراءات</th>
                        </tr>
                    </thead>
                    {allAppointments?.length > 0 &&
                        <tbody className={styles.tableBodyArea}>
                            {allAppointments?.map((appointment, index) => {
                                return (
                                    <tr key={`tableRow${index}`} className={styles.tableRow}>
                                        <td>
                                            <div className={styles.PeriodDataDetails}>
                                                <p className={`head2`}>{dateRange(appointment.dateFrom, appointment.dateTo)}</p>
                                                <div className={styles.genderDetails}>
                                                    {appointment.gender == "male" && <AllIconsComponenet iconName={'male'} height={17} width={10} color={'#0C5D96'} />}
                                                    {appointment.gender == "female" && <AllIconsComponenet iconName={'female'} height={17} width={10} color={'#E10768'} />}
                                                    <span className='pr-1'>{appointment.gender == "male" ? "ولد" : "بنت"}</span>
                                                </div><br />
                                                <p>{timeDuration(appointment.timeFrom, appointment.timeTo)}</p>
                                                <Link href={'appointment.location'}>{appointment.locationName}</Link>
                                                <p>{appointment.numberOfSeats} الرياض</p>
                                            </div>
                                        </td>
                                        <td>{appointment.instructor.name}</td>
                                        <td>{fullDate(appointment?.createdAt)}</td>
                                        <td>{fullDate(appointment?.updatedAt)}</td>
                                        <td className={styles.personeDetails}>
                                            <AllIconsComponenet iconName={'personegroup'} height={18} width={24} />
                                            <p>30 طالب</p>
                                        </td>
                                        <td>5 اختبارات</td>
                                        <td>
                                            <div onClick={() => editAppointment(appointment)}>
                                                <AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#000000'} />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    }
                </table>
                {allAppointments?.length == 0 &&
                    <div className={styles.tableBodyArea}>
                        <div className={styles.noDataManiArea} >
                            <div className={styles.noDataSubArea} >
                                <AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
                                <p className='fontBold py-2' style={{ fontSize: '20px' }}>ما أنشئت أي موعد</p>
                                <div>
                                    <button className='primarySolidBtn' onClick={() => handleCreateAvailability()}>إنشاء موعد</button>
                                </div>
                            </div>
                        </div>
                    </div >
                }
                <Modal
                    className='addAppoinmentModal'
                    open={isModalOpen}
                    onCancel={() => handelModalClose()}
                    closeIcon={false}
                    footer={false}
                >
                    <div className={styles.modalHeader}>
                        <button onClick={() => handelModalClose()} className={styles.closebutton}>
                            <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                        <p className={`fontBold ${styles.createappointment}`}>إنشاء موعد</p>
                    </div>
                    <Form form={form} onFinish={onFinish}>
                        <div className={styles.createAppointmentFields}>
                            <FormItem
                                name={'instructorId'}
                            >
                                <Select
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder="اختر المدرب"
                                    OptionData={instructor}
                                />
                            </FormItem>
                            <FormItem
                                name={'gender'}
                            >
                                <Select
                                    fontSize={16}
                                    width={352}
                                    height={40}
                                    placeholder="اختر الجنس"
                                    OptionData={genders}
                                />
                            </FormItem>
                            <div className='flex'>
                                <FormItem
                                    name={'dateFrom'}
                                >
                                    <DatePicker
                                        format={'YYYY-MM-DD'}
                                        width={172}
                                        height={40}
                                        placeholder="تاريخ النهاية"
                                        picker=""
                                        suFFixIconName="calander"
                                    />
                                </FormItem>
                                <FormItem
                                    name={'dateTo'}
                                >
                                    <DatePicker
                                        format={'YYYY-MM-DD'}
                                        width={172}
                                        height={40}
                                        placeholder="تاريخ البداية"
                                        picker=""
                                        suFFixIconName="calander"
                                    />
                                </FormItem>
                            </div>
                            <div className='flex'>
                                <FormItem
                                    name={'timeFrom'}
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
                                    name={'timeTo'}
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
                                    name={'locationName'}
                                >
                                    <Input
                                        fontSize={16}
                                        width={172}
                                        height={40}
                                        placeholder="الرابط"
                                    />
                                </FormItem>
                                <FormItem
                                    name={'location'}
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
                                name={'maxNumberOfSeats'}
                            >
                                <Input
                                    fontSize={16}
                                    width={172}
                                    height={40}
                                    placeholder="عدد المقاعد"
                                />
                            </FormItem>
                            <div className='flex items-center'>
                                <Switch defaultChecked onChange={onChange}></Switch>
                                <p className={styles.recordedcourse}>تفعيل محتوى الدورة المسجلة</p>
                            </div>
                        </div>
                        <div className={styles.createAppointmentBtnBox}>
                            <button key='modalFooterBtn' className={styles.construction} type={'submit'} >إنشاء</button>
                        </div>
                    </Form>
                </Modal>
            </div >
        </div >
    )
}

export default Appointments;