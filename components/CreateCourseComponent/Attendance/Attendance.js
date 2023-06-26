import React, { useState } from 'react'
import styles from './Attendance.module.scss'
import { generateAttendanceQRAPI, getStudentListAPI } from '../../../services/apisService'
import { Modal } from 'antd'
import QRCode from '../../CommonComponents/QRCode/QRCode'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import { FormItem } from '../../antDesignCompo/FormItem'
import Select from '../../antDesignCompo/Select'
import AttendanceTable from './AttendanceTableComponent/AttendanceTable'
import { useSelector } from 'react-redux'
import { dateRange, dateWithDay } from '../../../constants/DateConverter'
import dayjs from 'dayjs'

export default function Attendance(props) {
    const [openQR, setOpenQR] = useState(false)
    const [attendanceKey, setAttendanceKey] = useState("")
    const courseId = props.courseId
    const courseType = props.courseType
    const [dateArray, setDateArray] = useState([])

    const storeData = useSelector((state) => state?.globalStore);
    const availabilityList = storeData?.availabilityList;


    const getAvailabilityDates = (id) => {
        const selectedAvailability = availabilityList.find((element) => {
            return element.id === id;
        });

        var datesArray = [];
        let currentDate = new Date(selectedAvailability.dateFrom)
        let dateTo = new Date(selectedAvailability.dateTo)
        while (currentDate <= dateTo) {
            datesArray.push({ date: dayjs(currentDate).format('DD MMMM') });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        setDateArray(datesArray)
    }

    const allavailability = availabilityList?.map((obj) => {
        return {
            key: obj.id,
            label: dateRange(obj.dateFrom, obj.dateTo),
            value: obj.id,
            DateFrom: obj.dateFrom,
            DateTo: obj.dateTo,
        }
    });
    console.log("allavailability", allavailability);

    const generateQR = async () => {
        setOpenQR(true)
        await generateAttendanceQRAPI().then((res) => {
            setAttendanceKey(res?.data?.key)
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleCancel = () => {
        setOpenQR(false);
    }
    const handlSelectAvailability = async (e) => {
        let body = {
            accessToken: storeData?.accessToken,
            availabilityId: "3804ead1-01b5-40b2-a460-b494923260d4"
        }
        await getStudentListAPI(body).then((res) => {
            getAvailabilityDates(e)
        }).catch((error) => {
            console.log(error);
        })
    }


    return (
        <div className='maxWidthDefault px-4'>
            <div className={styles.attendanceDetails}>
                <div>
                    <FormItem>
                        <Select
                            fontSize={16}
                            width={202}
                            height={40}
                            placeholder="دورة القدرات 27 مايو"
                            OptionData={allavailability}
                            onChange={(e) => handlSelectAvailability(e)}
                        />
                    </FormItem>
                </div>
                <div className={styles.createQRBtnBox}>
                    <button className='primaryStrockedBtn' onClick={() => generateQR()}>عرض كود التحضير</button>
                    <Modal
                        className='addAppoinmentModal'
                        open={openQR}
                        closeIcon={false}
                        footer={[]}
                        onCancel={handleCancel}
                    >
                        <div className={styles.modalHeader}>
                            <div className={styles.closeIcon}>
                                <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} onClick={handleCancel}></AllIconsComponenet>
                            </div>
                            <p className={`fontBold ${styles.createappointment}`}>{dateWithDay(new Date())}</p>
                        </div>
                        <QRCode attendanceKey={attendanceKey} courseId={courseId} />
                    </Modal>
                </div>
            </div>
            <AttendanceTable dateArray={dateArray} />
        </div>
    )
}