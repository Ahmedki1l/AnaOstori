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
import { postRouteAPI } from '../../../services/apisService';
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
import Image from 'next/legacy/image';
import InputWithLocation from '../../antDesignCompo/InputWithLocation';
import ProfilePicture from '../../CommonComponents/ProfilePicture';
import { mediaUrl } from '../../../constants/DataManupulation'

const Appointments = ({ courseId, courseType, getAllAvailability }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAvailabilityEdit, setIsAvailabilityEdit] = useState(false)
    const [editAvailability, setEditAvailability] = useState('')
    const storeData = useSelector((state) => state?.globalStore);
    const instructorList = storeData?.instructorList;
    const allAppointments = storeData?.availabilityList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const genders = PaymentConst.genders
    const [appointmentForm] = Form.useForm();
    const [showSwitchBtn, setShowSwitchBtn] = useState(false)
    const [isFieldDisable, setIsFieldDisable] = useState(false)
    const [showBtnLoader, setShowBtnLoader] = useState(false)
    const [isAppointmentPublished, setIAppointmentPublished] = useState(editAvailability ? editAvailability.published : true)
    const [isContentAccess, setIsContentAccess] = useState(editAvailability ? editAvailability.contentAccess : false)
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
        values.dateFrom = dayjs(values?.dateFrom?.$d).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        values.dateTo = dayjs(values?.dateTo?.$d).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        values.timeFrom = dayjs(values?.timeFrom?.$d).format('HH:mm:ss')
        values.timeTo = dayjs(values?.timeTo?.$d).format('HH:mm:ss')
        values.courseId = courseId
        values.published = isAppointmentPublished
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
                routeName: 'updateAvailability',
                ...values,
                availabilityId: editAvailability?.id
            }
            await postRouteAPI(body).then((res) => {
                setShowBtnLoader(false)
                availabilitySuccessRes(toastSuccessMessage.appoitmentUpdateSuccessMsg)
            }).catch(async (error) => {
                console.log(error);
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await postRouteAPI(body).then((res) => {
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
            values.routeName = "createAvailability"
            await postRouteAPI(values).then((res) => {
                availabilitySuccessRes(toastSuccessMessage.appoitmentCretedSuccessMsg)
            }).catch(async (error) => {
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await postRouteAPI(values).then((res) => {
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
        setEditAvailability()
    }

    const handlePublishedCategory = async (e, availabilityId) => {
        let body = {
            routeName: 'updateAvailability',
            published: e,
            availabilityId: availabilityId
        }
        await postRouteAPI(body).then((res) => {
            setShowBtnLoader(false)
            availabilitySuccessRes(toastSuccessMessage.appoitmentUpdateSuccessMsg)
            getAllAvailability()
        }).catch(async (error) => {
            console.log(error);
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postRouteAPI(body).then((res) => {
                        setShowBtnLoader(false)
                        availabilitySuccessRes(toastSuccessMessage.appoitmentUpdateSuccessMsg)
                        getAllAvailability()
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
            toast.error(toastErrorMessage.tryAgainErrorMsg)
            setShowBtnLoader(false)
            console.log(error);
        })
    }

    const onChangeContentAccess = async (checked) => {
        setIsContentAccess(checked)
    };

    const onChangePublish = async (checked) => {
        setIAppointmentPublished(checked)
    }


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
                            <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>حالة الظهور</th>
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
                                                {appointment.gender !== "mix" &&
                                                    <>
                                                        <div className={styles.genderDetails}>
                                                            {appointment.gender == "male" && <AllIconsComponenet iconName={'male'} height={17} width={17} color={'#0C5D96'} />}
                                                            {appointment.gender == "female" && <AllIconsComponenet iconName={'female'} height={17} width={17} color={'#E10768'} />}
                                                            {/* {appointment.gender == "mix" && <><AllIconsComponenet iconName={'male'} height={17} width={17} color={'#0C5D96'} /><AllIconsComponenet iconName={'female'} height={17} width={10} color={'#E10768'} /></>} */}
                                                            <span className='pr-1'>{appointment.gender == "male" ? genders[0].label : genders[1].label}</span>
                                                        </div><br />
                                                    </>
                                                }
                                                <div className={styles.genderDetails}>
                                                    <AllIconsComponenet iconName={'clockDoubleColor'} height={17} width={17} color={'#000000'} />
                                                    <p className='mr-1'>{timeDuration(appointment.timeFrom, appointment.timeTo)}</p>
                                                </div><br />
                                                <div className={styles.genderDetails}>
                                                    <AllIconsComponenet iconName={'locationDoubleColor'} height={17} width={17} color={'#000000'} />
                                                    {appointment.location ?
                                                        <Link className='mr-1' target='_blank' href={appointment.location}>{appointment.locationName}</Link>
                                                        :
                                                        <p className='mr-1'>{appointment.locationName}</p>
                                                    }
                                                </div><br />
                                                <div className={styles.genderDetails}>
                                                    {appointment.numberOfSeats > 5 ?
                                                        <div className={`${styles.outerCircle} ${styles.green}`}><div className={styles.innerCircle}></div></div>
                                                        :
                                                        <div className={styles.alretWrapper}>
                                                            <Image src={`/images/alert-blink.gif`} alt={'alert gif'} layout="fill" objectFit="cover" />
                                                        </div>
                                                    }
                                                    <p className='mr-1'> {appointment.numberOfSeats == 0 ? "جميع المقاعد محجوزة"
                                                        : appointment.numberOfSeats == 1 ? "مقعد واحد متبقي"
                                                            : appointment.numberOfSeats == 2 ? "مقعدين متبقيين"
                                                                : appointment.numberOfSeats > 3 && appointment.numberOfSeats < 10 ? `${appointment.numberOfSeats} مقاعد متبقية`
                                                                    : `${appointment.numberOfSeats} مقعد متبقي`}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.publishState}>
                                                <Switch defaultChecked={appointment.published} onChange={handlePublishedCategory} params={appointment.id} ></Switch>
                                                <p className='pr-2'>{appointment.published ? 'إظهار' : 'مخفي'}</p>
                                            </div>
                                        </td>
                                        <td className='py-2'>{appointment.instructors.map((instructor, index) => {

                                            return (
                                                <div key={`instructor${index}`} className={styles.instructorDetailsArea}>
                                                    <div>
                                                        <ProfilePicture height={34} width={34} alt={'avatar image'} pictureKey={(instructor.avatarKey == null || instructor.avatarBucket == null || instructor.avatarKey == '' || instructor.avatarBucket == '') ? '/images/anaOstori.png' : `${mediaUrl(instructor.avatarBucket, instructor.avatarKey)}`} />
                                                    </div>
                                                    <p className='pr-2'>{instructor.name}</p>
                                                </div>
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
                            <p className={`fontBold ${styles.createappointment}`}>{editAvailability ? 'تعديل بيانات الموعد' : 'إضافة موعد'}</p>
                        </div>
                        <Form form={appointmentForm} onFinish={onFinish}>
                            <div className={styles.createAppointmentFields}>
                                <p className={` ${styles.createappointmentFormFileds}`}>تفاصيل الموعد</p>
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
                                            placeholder='تبدأ يوم'
                                            suFFixIconName="calenderDoubleColorIcon"
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
                                            placeholder='تنتهي يوم'
                                            suFFixIconName="calenderDoubleColorIcon"
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
                                            placeholder='تبدأ ع الساعة'
                                            picker="time"
                                            suFFixIconName="clockDoubleColor"
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
                                            placeholder='تنتهي ع الساعة'
                                            picker="time"
                                            suFFixIconName="clockDoubleColor"
                                            disabled={isFieldDisable}
                                        />
                                    </FormItem>
                                </div>
                                <p className={`${styles.createappointmentFormFileds}`}>تفاصيل المكان</p>
                                {courseType != 'physical' &&
                                    <FormItem
                                        name={'locationName'}
                                        rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                                    >
                                        <InputWithLocation
                                            width={352}
                                            height={40}
                                            suFFixIconName='onlineDoubleColorIcon'
                                            placeholder='المكان'
                                            disabled={isFieldDisable}
                                        />
                                    </FormItem>
                                }
                                {courseType == 'physical' &&
                                    <div className='flex'>
                                        <FormItem
                                            name={'locationName'}
                                            rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                                        >
                                            <InputWithLocation
                                                width={171}
                                                height={40}
                                                suFFixIconName='locationDoubleColor'
                                                placeholder='الفرع والمدينة'
                                                disabled={isFieldDisable}
                                            />
                                        </FormItem>
                                        <FormItem
                                            name={'location'}
                                            rules={[{ required: true, message: "ادخل المكان (نص)" }]}
                                        >
                                            <InputWithLocation
                                                width={171}
                                                height={40}
                                                placeholder='رابط المركز'
                                                suFFixIconName="linkDoubleColorIcon"
                                                disabled={isFieldDisable}
                                            />
                                        </FormItem>
                                    </div>
                                }
                                <p className={`${styles.createappointmentFormFileds}`}>اختر المدربين</p>
                                <FormItem
                                    name={'instructors'}
                                    rules={[{ required: true, message: "اختر المدرب" }]}
                                >
                                    <Select
                                        fontSize={16}
                                        width={352}
                                        height={40}
                                        placeholder='اختار المدربين'
                                        OptionData={instructor}
                                        mode="multiple"
                                        maxTagCount='responsive'
                                        disabled={isFieldDisable}
                                    />
                                </FormItem>
                                {courseType == 'physical' &&
                                    <>
                                        <p className={`${styles.createappointmentFormFileds}`}>الدورة لمين؟</p>
                                        <FormItem
                                            name={'gender'}
                                            rules={[{ required: true, message: "حدد الجنس" }]}
                                        >
                                            <Select
                                                fontSize={16}
                                                width={352}
                                                height={40}
                                                placeholder='اختار الجنس'
                                                OptionData={genders}
                                                disabled={isFieldDisable}
                                            />
                                        </FormItem>
                                    </>
                                }
                                <p className={`${styles.createappointmentFormFileds}`}>تفاصيل المقاعد</p>
                                <FormItem
                                    name={'maxNumberOfSeats'}
                                    rules={[{ required: true, message: "ادخل عدد المقاعد" }]}
                                >
                                    <Input
                                        fontSize={16}
                                        width={352}
                                        height={40}
                                        placeholder='عدد المقاعد'
                                        disabled={isFieldDisable}
                                    />
                                </FormItem>
                                {showSwitchBtn &&
                                    <>
                                        {/* <div className='flex items-center'>
                                            <Switch defaultChecked={editAvailability.contentAccess} onChange={onChangeContentAccess}></Switch>
                                            <p className={styles.recordedcourse}>إظهار المقرر للطلاب</p>
                                        </div> */}
                                        <div className='flex items-center'>
                                            <Switch defaultChecked={editAvailability.published} onChange={onChangePublish}></Switch>
                                            <p className={styles.recordedcourse}>إخفاء الموعد</p>
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
