
import React from 'react'
import { FormItem } from '../../antDesignCompo/FormItem'
import styles from './TheStudenet.module.scss'
import Select from '../../antDesignCompo/Select'
import { useDispatch, useSelector } from 'react-redux'
import ProgressBar from '../../CommonComponents/progressBar'
import * as PaymentConst from '../../../constants/PaymentConst'
import { dateRange } from '../../../constants/DateConverter'
import { useState } from 'react'
import { createStudentExamDataAPI, getStudentListAPI } from '../../../services/apisService'
import Input from '../../antDesignCompo/Input'
import { Form } from 'antd'
import { signOutUser } from '../../../services/fireBaseAuthService'
import { fullDate } from '../../../constants/DateConverter';
import ProfilePicture from '../../CommonComponents/ProfilePicture';
import { mediaUrl } from '../../../constants/DataManupulation'



const TheStudent = (props) => {

    const [showStudentDetails, setShowStudentDetails] = useState(false)
    const [allStudentDetails, setAllStudentDetails] = useState([])
    const [displayedStudentList, setDisplayedStudentList] = useState([])
    const [showStudentList, setShowStudentList] = useState(false)
    const courseId = props.courseId
    const genders = PaymentConst.genders
    const dispatch = useDispatch();
    const storeData = useSelector((state) => state?.globalStore);
    const availabilityList = storeData?.availabilityList;
    const [examList, setExamList] = useState()
    const [oldExamList, setOldExamList] = useState()
    const [selectedStudent, setSelectedStudent] = useState()
    const [selectedAvailabilityId, setSelectedAvailabilityId] = useState()

    const allavailability = availabilityList?.map((obj) => {
        return {
            key: obj.id,
            label: dateRange(obj.dateFrom, obj.dateTo),
            value: obj.id,
        }
    });

    const selectedCourse = storeData.myCourses.find((enrollment) => {
        return enrollment.courseId == courseId
    })
    console.log(selectedCourse);

    const onInputChange = (e, index, fieldeName) => {
        const updatedExamData = [...examList]
        if (fieldeName == 'grade') {
            updatedExamData[index].grade = e.target.value
        } else {
            updatedExamData[index].note = e.target.value
        }
        setExamList(updatedExamData)
    }
    console.log(selectedStudent);

    const saveStudentExamDetails = async (index) => {

        // if (fieldeName == 'grade') {
        //     if(oldExamList[index].grade == examList[index].grade && ){

        //     }
        // } else {

        // }

        // const data = examList.map((exam) => {
        //     return {
        //         userProfileId: selectedStudent.userProfile.id,
        //         enrollmentId: selectedStudent.enrollmentId,
        //         itemId: exam.id,
        //         courseId: courseId,
        //         grade: exam.grade ?? null,
        //         note: exam.note ?? null
        //     }
        // })
        // let body = {
        //     data: data
        // }
        // await createStudentExamDataAPI(body).then((res) => {
        //     console.log(res);
        //     setShowStudentDetails(false)
        // }).catch((error) => {
        //     console.log(error)
        // })
    }

    const showSelectedStudentExamDetails = (student) => {
        setShowStudentDetails(true)
        const nonCompletedQuizItems = student?.userProfile?.nonCompletedQuizItems.map((quiz, index) => {
            return {
                key: quiz.id,
                quizId: quiz.id,
                quizName: quiz.name,
                grade: '',
                note: ''
            }
        })

        const completedQuizItems = student?.userProfile.quizExams.map((quiz, index) => {
            return {
                key: quiz.item.id,
                quizId: quiz.item.id,
                quizName: quiz.item.name,
                grade: quiz.grade,
                note: quiz.note
            }
        })
        setOldExamList([...nonCompletedQuizItems, ...completedQuizItems])
        setExamList([...nonCompletedQuizItems, ...completedQuizItems])
        setSelectedStudent(student)
    }
    const getAllStudentList = async (e) => {
        console.log(e);
        let data = {
            availabilityId: e,
            courseId: courseId,
        }
        await getStudentListAPI(data).then((res) => {
            console.log(res);
            setSelectedAvailabilityId(e)
            setShowStudentList(true)
            setAllStudentDetails(res?.data)
            setDisplayedStudentList(res?.data)
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

    const selectGenderFilter = (value) => {
        const newStudentList = [...allStudentDetails]
        setDisplayedStudentList(newStudentList.filter((student) => value == student.gender));
    }

    return (
        <div className='maxWidthDefault px-4'>
            {!showStudentDetails &&
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
                                    onChange={selectGenderFilter}
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
                                    {displayedStudentList?.map((student, index) => {
                                        return (
                                            <tr key={`studentTableRow${index}`} className={styles.tableRow}>
                                                <td>
                                                    <div className='flex'>
                                                        <div className={styles.requesterDetails} >
                                                            <div className={styles.StudentListImage}>
                                                                <ProfilePicture height={34} width={34} alt={'avatar image'} pictureKey={student?.userProfile?.avatarKey == null ? student?.userProfile?.avatar : `${mediaUrl(student?.userProfile?.avatarBucket, student?.userProfile?.avatarKey)}`} />
                                                            </div>
                                                            <p className={styles.requesterName}>{student?.userProfile?.fullName == "" ? student?.userProfile?.fullName : `${student?.userProfile?.firstName} ${student?.userProfile?.lastName}`}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <p>{student?.userProfile?.phone} </p>
                                                    <p>{student?.userProfile?.email}</p>
                                                </td>
                                                <td>
                                                    <div className={styles.progressbar}>
                                                        <ProgressBar percentage={student?.userProfile?.progress} bgColor={'#2BB741'} height={14} fontSize={10} />
                                                    </div>
                                                </td>
                                                <td className={`${styles.examText} link`} onClick={() => showSelectedStudentExamDetails(student)}>مشاهدة الدرجات</td>
                                                <td>{fullDate(student?.userProfile?.createdAt)}</td>
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
                        <p className={`${styles.studentDetails}`} onClick={() => setShowStudentDetails(false)}> الطلاب </p>
                        <p className='pl-2'>{'>'}</p>
                        <p className={styles.examResultsForStudents}>  نتائج درجات {selectedStudent.fullName}</p>
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
                            {console.log(examList)}
                            <tbody className={styles.studentTableBodyArea}>
                                {examList.map((exam, index) => {
                                    return (
                                        <tr className={styles.studentTableRow} key={exam.id}>
                                            <td>{exam.quizName}</td>
                                            <td>
                                                <Input
                                                    fontSize={16}
                                                    width={125}
                                                    height={37}
                                                    placeholder="اكتب الدرجة"
                                                    value={exam.grade}
                                                    onChange={(e) => onInputChange(e, index, 'grade')}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    fontSize={16}
                                                    width={324}
                                                    height={37}
                                                    value={exam.note}
                                                    placeholder="إن وجدت"
                                                    onChange={(e) => onInputChange(e, index, 'note')}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            }
            {showStudentDetails &&
                <div className='flex'>
                    <button className={styles.studentDetailsSave} height={14} width={14} type={'submit'} onClick={() => saveStudentExamDetails()}> حفظ </button>
                </div>
            }
        </div >
    )
}

export default TheStudent


// const saveStudentExamDetails = async () => {
//     const data = examList.map((exam) => {
//         return {
//             userProfileId: selectedStudent.userProfile.id,
//             enrollmentId: selectedStudent.enrollmentId,
//             itemId: exam.id,
//             courseId: courseId,
//             grade: exam.grade ?? null,
//             note: exam.note ?? null
//         }
//     })
//     let body = {
//         data: data
//     }
//     await createStudentExamDataAPI(body).then((res) => {
//         console.log(res);
//         setShowStudentDetails(false)
//     }).catch((error) => {
//         console.log(error)
//     })
// }