
import React from 'react'
import { FormItem } from '../../antDesignCompo/FormItem'
import styles from './TheStudenet.module.scss'
import Select from '../../antDesignCompo/Select'
import { useDispatch, useSelector } from 'react-redux'
import ProgressBar from '../../CommonComponents/progressBar'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import * as PaymentConst from '../../../constants/PaymentConst'
import { dateRange } from '../../../constants/DateConverter'
import { useState } from 'react'
import { getStudentListAPI } from '../../../services/apisService'
import Input from '../../antDesignCompo/Input'
import { Form } from 'antd'
import { signOutUser } from '../../../services/fireBaseAuthService'
import Image from 'next/legacy/image'
import dayjs from 'dayjs';
import { fullDate } from '../../../constants/DateConverter';
import * as LinkConst from '../../../constants/LinkConst';
import ProfilePicture from '../../CommonComponents/ProfilePicture';



const TheStudenet = (props) => {

    const [showStudentDetails, setShowStudentDetails] = useState(false)
    const [notShowStudentDetails, setNotShowStudentDetails] = useState(true)
    const [allStudentDetails, setAllStudentDetails] = useState([])
    const [showStudentList, setShowStudentList] = useState(false)
    const courseId = props.courseId
    const genders = PaymentConst.genders
    const dispatch = useDispatch();
    const storeData = useSelector((state) => state?.globalStore);
    const availabilityList = storeData?.availabilityList;
    console.log("allavailability", storeData);

    const baseUrl = LinkConst.File_Base_Url2


    const allavailability = availabilityList?.map((obj) => {
        return {
            key: obj.id,
            label: dateRange(obj.dateFrom, obj.dateTo),
            value: obj.id,
        }
    });
    console.log("allavailability", allavailability);

    const saveStudentDetails = () => {
        setShowStudentDetails(false)
        setNotShowStudentDetails(true)
    }
    const showSelectedStudentDetails = () => {
        setShowStudentDetails(true)
        setNotShowStudentDetails(false)
    }
    const getAllStudentList = async (e) => {
        console.log(availabilityList);
        let data = {
            accessToken: storeData?.accessToken,
            availabilityId: e,
            courseId: courseId,
            // availabilityId: "0914b5e6-0976-4ff0-9512-72af7526592b",
            //  courseId: "65ab9b76-e59f-4a36-a28d-46f18f1383eb",
        }
        console.log(data);
        await getStudentListAPI(data).then((res) => {
            console.log(res);
            setShowStudentList(true)
            setAllStudentDetails(res?.data)
        }).catch((error) => {
            console.log(error);
            if (error?.response?.status == 401) {
                signOutUser()
                dispatch({
                    type: 'EMPTY_STORE'
                });
            }
        })
    }

    return (
        <div className='maxWidthDefault px-4'>
            {notShowStudentDetails &&
                <div>
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
                                    onChange={(e) => getAllStudentList(e)}
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
                    {showStudentList &&
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
                                    {allStudentDetails?.map((studentList, index) => {
                                        return (
                                            <tr key={`studentTableRow${index}`} className={styles.tableRow}>
                                                <td>
                                                    <div className='flex'>
                                                        <div className={styles.requesterDetails} onClick={() => showSelectedStudentDetails()}>
                                                            <div className={styles.StudentListImage}>
                                                                <ProfilePicture height={34} width={34} alt={'avatar image'} pictureKey={studentList.avatarKey == null ? studentList.avatar : `${baseUrl}/${studentList.avatarKey}`} />
                                                            </div>
                                                            <p className={styles.requesterName}>{studentList.fullName == "" ? studentList.fullName : `${studentList.firstName} ${studentList.lastName}`}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <p>{studentList.phone} </p>
                                                    <p>{studentList.email}</p>
                                                </td>
                                                <td>
                                                    <div className={styles.progressbar}>
                                                        <ProgressBar percentage={studentList.progress} bgColor={'#2BB741'} height={14} fontSize={10} />
                                                    </div>
                                                </td>
                                                <td>مشاهدة الدرجات</td>
                                                <td>{fullDate(studentList.createdAt)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>

                            </table>
                        </div>
                    }
                </div>
            }
            {showStudentDetails &&
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
                            <tbody className={styles.studentTableBodyArea}>
                                <tr className={styles.studentTableRow}>
                                    <td>اختبار أ</td>
                                    <td>
                                        <Input
                                            fontSize={16}
                                            width={125}
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
                            </tbody>
                        </table>
                    </div>
                </div>
            }
            {
                showStudentDetails &&
                <div className='flex'>
                    <button className={styles.studentDetailsSave} height={14} width={14} type={'submit'}  >إنشاء</button>
                    <button className={styles.studentDetailsSave} height={14} width={14} type={'submit'} onClick={() => saveStudentDetails()}>الطلاب</button>
                </div>
            }
        </div >
    )
}

export default TheStudenet