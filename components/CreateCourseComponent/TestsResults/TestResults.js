import React from 'react'
import { FormItem } from '../../antDesignCompo/FormItem'
import styles from './TestResults.module.scss'
import Select from '../../antDesignCompo/Select'
import { useSelector } from 'react-redux'
import ProgressBar from '../../CommonComponents/progressBar'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import * as PaymentConst from '../../../constants/PaymentConst'
import { dateRange } from '../../../constants/DateConverter'
import Input from '../../antDesignCompo/Input'
import { useState } from 'react'
import { Form } from 'antd'

const TestResults = () => {

    const [showStudentDetails, setShowStudentDetails] = useState(false)
    const [allStudentDetails, setAllStudentDetails] = useState([])


    const genders = PaymentConst.genders
    const storeData = useSelector((state) => state?.globalStore);
    const availabilityList = storeData?.availabilityList;
    console.log("allavailability", storeData);


    const allavailability = availabilityList?.map((obj) => {
        return {
            key: obj.id,
            label: dateRange(obj.dateFrom, obj.dateTo),
            value: obj.id,
        }
    });
    console.log("allavailability", allavailability);

    const handleStudentDetails = () => {
        setShowStudentDetails(true)
    }
    const saveStudentDetails = () => {
        setShowStudentDetails(false)
    }

    return (
        <div className='maxWidthDefault px-4'>
            <Form>
                <div className='flex'>
                    <FormItem
                        name={'selectperiod'}
                    >
                        <Select
                            fontSize={16}
                            width={175}
                            height={40}
                            placeholder="اختر الفترة"
                            OptionData={allavailability}
                        />
                    </FormItem>
                    <FormItem
                        name={'selectgender'}
                    >
                        <Select
                            fontSize={16}
                            width={133}
                            height={40}
                            placeholder="اختر الجنس "
                            OptionData={genders}
                        />
                    </FormItem>
                </div>
            </Form>

            {showStudentDetails &&
                <div>
                    <table className={styles.tableArea}>
                        <thead className={styles.tableHeaderArea}>
                            <tr>
                                <th className={styles.tableHead1}>الطالب</th>
                                <th className={styles.tableHead2}>معلومات التواصل</th>
                                <th className={styles.tableHead3}>مستوى التقدم</th>
                                <th className={styles.tableHead4}>نتائج الاختبارات</th>
                                <th className={styles.tableHead5}>تاريخ الاشتراك</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tableBodyArea}>
                            <tr className={styles.tableRow}>
                                <td className={styles.requesterDetails}>
                                    <AllIconsComponenet iconName={'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                    <p className={styles.requesterName}> عبدالإله مدخلي</p>
                                </td>
                                <td>0563974497 hisham@gmail.com</td>
                                <td>
                                    <div className={styles.progressbar}>
                                        <ProgressBar percentage={50} bgColor={'#2BB741'} height={14} fontSize={10} />
                                    </div>
                                </td>
                                <td>مشاهدة الدرجات</td>
                                <td>5 فبراير 2023</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            }
            <div>
                <div className={styles.studentDetailsTable}>
                    <p className={styles.studentDetails}>الطلاب</p>
                    <p>{'>'}</p>
                    <p className={styles.examResultsForStudents}> نتائج درجات</p>
                </div>
                <div>
                    <table className={styles.studentTableArea}>
                        <thead className={styles.tableHeaderArea}>
                            <tr>
                                <th className={styles.studentTableHead1}>عنوان الاختبار</th>
                                <th className={styles.studentTableHead2}>الدرجة</th>
                                <th className={styles.studentTableHead3}>الملاحظات</th>
                            </tr>
                        </thead>
                        <Form>
                            <tbody className={styles.studentTableBodyArea}>
                                {allStudentDetails?.map((index) => ([
                                    <tr className={styles.studentTableRow} key={`testResult${index}`}>
                                        <td>اختبار أ</td>
                                        <td>
                                            <Input
                                                fontSize={16}
                                                width={130}
                                                height={37}
                                                placeholder="اكتب الدرجة"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                fontSize={16}
                                                width={324}
                                                height={37}
                                                placeholder="إن وجدت"
                                            />
                                        </td>
                                    </tr>
                                ]))}
                            </tbody>
                        </Form>
                    </table>
                </div>
            </div>

            <div className='flex'>
                <button className={styles.studentDetailsSave} height={14} width={14} type={'submit'} onClick={() => saveStudentDetails()} >إنشاء</button>
                <button className={styles.studentDetailsSave} height={14} width={14} type={'submit'} onClick={() => handleStudentDetails()}>الطلاب</button>
            </div>
        </div>
    )
}

export default TestResults