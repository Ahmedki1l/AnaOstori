import React, { useState } from 'react'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import styles from './Appointment.module.scss'
import { useSelector } from 'react-redux';
import { Modal } from 'antd';
import { Form, FormItem } from '../../antDesignCompo/FormItem';
import Select from '../../antDesignCompo/Select';
import DatePicker from '../../antDesignCompo/Datepicker';
import Input from '../../antDesignCompo/Input';
import * as PaymentConst from '../../../constants/PaymentConst';
import { createCourseAvailabilityAPI, editAvailabilityAPI } from '../../../services/apisService';
import Link from 'next/link';
import { dateRange, fullDate, timeDuration } from '../../../constants/DateConverter';
import dayjs from 'dayjs';
import TimePicker from '../../antDesignCompo/TimePicker';
import Switch from '../../../components/antDesignCompo/Switch';
import CustomButton from '../../CommonComponents/CustomButton';
import { toast } from 'react-toastify';
import { toastErrorMessage, toastSuccessMessage } from '../../../constants/ar';
import { getNewToken } from '../../../services/fireBaseAuthService';
import Empty from '../../CommonComponents/Empty';

const Appointments = ({ courseId, courseType, getAllAvailability }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAvailabilityEdit, setIsAvailabilityEdit] = useState(false)
    const [editAvailability, setEditAvailability] = useState('')
    const storeData = useSelector((state) => state?.globalStore);
    const instructorList = storeData?.instructorList;
    const allAppointments = storeData?.availabilityList;
    const genders = PaymentConst.genders
    const [appointmentForm] = Form.useForm();
    const [showSwitchBtn, setShowSwitchBtn] = useState(false)
    const [isFieldDisable, setIsFieldDisable] = useState(false)
    const [showBtnLoader, setShowBtnLoader] = useState(false)
    // const [isAppointmentPublished, setIAppointmentPublished] = useState(editAvailability ? editAvailability.published : false)
    const [isContentAccess, setIsContentAccess] = useState(editAvailability ? editAvailability.contentAccess : false)

    console.log("editAvailability", editAvailability);

    const instructor = instructorList?.map((obj) => {
        return {
            key: obj.id,
            label: obj.name,
            value: obj.id,
        }
    });
    const calculateNumberOfSeats = (newMaxSeats) => {
        return editAvailability?.numberOfSeats + (newMaxSeats - editAvailability.maxNumberOfSeats)
    }
    const availabilitySuccessRes = (msg) => {
        toast.success(msg)
        setIsModalOpen(false)
        getAllAvailability()
        setShowBtnLoader(false)
    }
    const onFinish = async (values) => {
        setShowBtnLoader(true)
        values.dateFrom = dayjs(values?.dateFrom?.$d).format('YYYY-MM-DD HH:mm:ss');
        values.dateTo = dayjs(values?.dateTo?.$d).format('YYYY-MM-DD HH:mm:ss');
        values.timeFrom = dayjs(values?.timeFrom?.$d).format('HH:mm:ss')
        values.timeTo = dayjs(values?.timeTo?.$d).format('HH:mm:ss')
        values.courseId = courseId
        // values.published = isAppointmentPublished
        if (isAvailabilityEdit) values.contentAccess = isContentAccess
        values.numberOfSeats = isAvailabilityEdit ? calculateNumberOfSeats(values.maxNumberOfSeats) : values.maxNumberOfSeats
        if (!values.gender) values.gender = 'mix'
        if (isAvailabilityEdit) {
            if (values.maxNumberOfSeats < (editAvailability.maxNumberOfSeats - editAvailability?.numberOfSeats)) {
                toast.error('max number of seates are not less then number of enrolled students')
                setShowBtnLoader(false)
                return
            }
            let body = {
                data: values,
                availabilityId: editAvailability?.id
            }
            await editAvailabilityAPI(body).then((res) => {
                setShowBtnLoader(false)
                availabilitySuccessRes(toastSuccessMessage.appoitmentUpdateSuccessMsg)
            }).catch(async (error) => {
                console.log(error);
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await editAvailabilityAPI(body).then((res) => {
                            availabilitySuccessRes(toastSuccessMessage.appoitmentUpdateSuccessMsg)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
                toast.error(toastErrorMessage.tryAgainErrorMsg)
                setShowBtnLoader(false)
                console.log(error);
            })
        } else {
            let body = {
                data: values,
            }
            await createCourseAvailabilityAPI(body).then((res) => {
                availabilitySuccessRes(toastSuccessMessage.appoitmentCretedSuccessMsg)
            }).catch(async (error) => {
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await createCourseAvailabilityAPI(body).then((res) => {
                            availabilitySuccessRes(toastSuccessMessage.appoitmentCretedSuccessMsg)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
                toast.error(toastErrorMessage.tryAgainErrorMsg)
                console.log(error);
                setShowBtnLoader(false)
            })
        }
        appointmentForm.resetFields()
    }

    const editAppointment = (appointment) => {
        setIsModalOpen(true)
        setShowSwitchBtn(true)
        setIsAvailabilityEdit(true)
        setEditAvailability(appointment)
        // setIsFieldDisable(((dayjs(appointment.dateFrom).startOf('day') < dayjs(new Date())) || (appointment.maxNumberOfSeats > appointment.numberOfSeats)) ? true : false)
        const instructorsList = appointment?.instructors?.map((obj) => {
            return obj.id
        });
        appointmentForm.setFieldsValue({
            instructors: instructorsList,
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
        setShowSwitchBtn(false)
        setIsAvailabilityEdit(false)
        setIsFieldDisable(false)
    }

    const handelModalClose = () => {
        appointmentForm.resetFields()
        setIsModalOpen(false)
    }

    // const onChange = async (e, params) => {
    //     let body = {
    //         data: params == "published" ? { published: e } : { contentAccess: e },
    //         availabilityId: editAvailability?.id
    //     }
    //     await editAvailabilityAPI(body).then((res) => {
    //     }).catch((error) => {
    //         console.log(error);
    //         setShowBtnLoader(false)
    //     })
    // };
    const onChangeContentAccess = async (checked) => {
        if (checked == true) {
            toast.success("content accesss true")
        } else {
            toast.success('content access false')
        }
        setIsContentAccess(checked)
    };

    // for Appointment Publish
    // const onChangeCatagoryPublished = async (checked) => {
    //     if (checked == true) {
    //         toast.success("Catagory Published")
    //     } else {
    //         toast.success('Catagory Not Published')
    //     }
    //     setIAppointmentPublished(checked)
    // };

    return (
        <div className='maxWidthDefault px-4'>
            <div>
                <div dir='ltr'>
                    <div className={styles.createAppointmentBtnBox}>
                        <button className='primarySolidBtn' onClick={() => handleCreateAvailability()}>إنشاء موعد</button>
                    </div>
                </div>
                <table className={styles.tableArea}>
                    <thead className={styles.tableHeaderArea}>
                        <tr>
                            <th className={`${styles.tableHeadText} ${styles.tableHead1}`}>بيانات الفترة</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>المدربين</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead3}`}>تاريخ الإنشاء</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead4}`}>اخر تعديل</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead5}`}>المسجلين</th>
                            <th className={`${styles.tableHeadText} ${styles.tableHead6}`}>الإجراءات</th>
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
                                                {/* <div className={styles.genderDetails}>
                                                    {appointment.gender == "male" && <AllIconsComponenet iconName={'male'} height={17} width={10} color={'#0C5D96'} />}
                                                    {appointment.gender == "female" && <AllIconsComponenet iconName={'female'} height={17} width={10} color={'#E10768'} />}
                                                    {appointment.gender == "mix" && <><AllIconsComponenet iconName={'male'} height={17} width={10} color={'#0C5D96'} /><AllIconsComponenet iconName={'female'} height={17} width={10} color={'#E10768'} /></>}
                                                    <span className='pr-1'>{appointment.gender == "male" ? "شاب" : "بنت"}</span>
                                                </div><br /> */}
                                                <p>{timeDuration(appointment.timeFrom, appointment.timeTo)}</p>
                                                <Link target='_blank' href={appointment.location}>{appointment.locationName}</Link>
                                                <p>{appointment.numberOfSeats} مقعد مخصص</p>
                                            </div>
                                        </td>
                                        <td className='py-2'>{appointment.instructors.map((instructor, index) => {
                                            return (
                                                <p key={`instructor${index}`} className='pb-3 text-right pr-20 '>
                                                    {instructor.name}
                                                </p>
                                            )
                                        })}</td>
                                        <td>{fullDate(appointment?.createdAt)}</td>
                                        <td>{fullDate(appointment?.updatedAt)}</td>
                                        <td>
                                            <div className={styles.personeDetails}>
                                                <AllIconsComponenet iconName={'personegroup'} height={18} width={24} color={'#F26722'} backColor={'#000000'} />
                                                <p>{appointment.maxNumberOfSeats - appointment.numberOfSeats} طالب</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div onClick={() => editAppointment(appointment)} className='cursor-pointer'>
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
                    <Empty buttonText={'إضافة موعد'} emptyText={'ما أضفت أي موعد'} containerhight={500} onClick={() => handleCreateAvailability()} />
                }
                {isModalOpen &&
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
                        <Form form={appointmentForm} onFinish={onFinish}>
                            <div className={styles.createAppointmentFields}>
                                <FormItem
                                    name={'instructors'}
                                    rules={[{ required: true, message: "اختر المدرب" }]}
                                >
                                    <Select
                                        fontSize={16}
                                        width={352}
                                        height={40}
                                        placeholder="اختر المدرب"
                                        OptionData={instructor}
                                        mode="multiple"
                                        maxTagCount='responsive'
                                        disabled={isFieldDisable}
                                    />
                                </FormItem>
                                {courseType == 'physical' &&
                                    <FormItem
                                        name={'gender'}
                                        rules={[{ required: true, message: "حدد الجنس" }]}
                                    >
                                        <Select
                                            fontSize={16}
                                            width={352}
                                            height={40}
                                            placeholder="اختر الجنس"
                                            OptionData={genders}
                                            disabled={isFieldDisable}
                                        />
                                    </FormItem>
                                }
                                <div className='flex'>
                                    <FormItem
                                        name={'dateFrom'}
                                        rules={[{ required: true, message: "ادخل تاريخ البداية" }]}
                                    >
                                        <DatePicker
                                            format={'YYYY-MM-DD'}
                                            width={172}
                                            height={40}
                                            disabled={isFieldDisable}
                                            placeholder="تاريخ البداية"
                                            suFFixIconName="calander"
                                        />
                                    </FormItem>
                                    <FormItem
                                        name={'dateTo'}
                                        rules={[{ required: true, message: "ادخل تاريخ النهاية" }]}
                                    >
                                        <DatePicker
                                            format={'YYYY-MM-DD'}
                                            width={172}
                                            height={40}
                                            placeholder="تاريخ النهاية"
                                            suFFixIconName="calander"
                                            disabled={isFieldDisable}
                                        />
                                    </FormItem>
                                </div>
                                <div className='flex'>
                                    <FormItem
                                        name={'timeFrom'}
                                        rules={[{ required: true, message: "ادخل ساعة البداية " }]}
                                    >
                                        <TimePicker
                                            width={172}
                                            height={40}
                                            placeholder="من الساعة"
                                            picker="time"
                                            suFFixIconName="clock"
                                            disabled={isFieldDisable}
                                        />
                                    </FormItem>
                                    <FormItem
                                        name={'timeTo'}
                                        rules={[{ required: true, message: "ادخل ساعة النهاية" }]}
                                    >
                                        <TimePicker
                                            width={172}
                                            height={40}
                                            placeholder="إلى الساعة"
                                            picker="time"
                                            suFFixIconName="clock"
                                            disabled={isFieldDisable}
                                        />
                                    </FormItem>
                                </div>
                                <div className='flex'>
                                    <FormItem
                                        name={'locationName'}
                                        rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                                    >
                                        <Input
                                            fontSize={16}
                                            width={172}
                                            height={40}
                                            placeholder="الموقع"
                                            disabled={isFieldDisable}
                                        />
                                    </FormItem>
                                    <FormItem
                                        name={'location'}
                                        rules={[{ required: true, message: "ادخل المكان (نص)" }]}
                                    >
                                        <Input
                                            fontSize={16}
                                            width={172}
                                            height={40}
                                            placeholder="الرابط"
                                            disabled={isFieldDisable}
                                        />
                                    </FormItem>
                                </div>
                                <FormItem
                                    name={'maxNumberOfSeats'}
                                    rules={[{ required: true, message: "ادخل عدد المقاعد" }]}
                                >
                                    <Input
                                        fontSize={16}
                                        width={172}
                                        height={40}
                                        placeholder="عدد المقاعد"
                                        disabled={isFieldDisable}
                                    />
                                </FormItem>
                                {showSwitchBtn &&
                                    <>
                                        {/* <div className='flex items-center'>
                                        <Switch defaultChecked={isAppointmentPublished} onChange={onChangeCatagoryPublished}></Switch>
                                        <p className={styles.recordedcourse}>إخفاء بطاقة الموعد</p>
                                    </div> */}
                                        <div className='flex items-center'>
                                            <Switch defaultChecked={editAvailability.contentAccess} onChange={onChangeContentAccess}></Switch>
                                            <p className={styles.recordedcourse}>تفعيل محتوى الدورة المسجلة</p>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className={styles.saveBtnBox}>
                                <CustomButton
                                    btnText={'إنشاء'}
                                    width={80}
                                    height={37}
                                    showLoader={showBtnLoader}
                                    fontSize={16}
                                />
                            </div>
                        </Form>
                    </Modal>
                }
            </div >
        </div >
    )
}

export default Appointments;
