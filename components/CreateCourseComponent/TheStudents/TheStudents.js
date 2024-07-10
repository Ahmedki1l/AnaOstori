
import React, { useEffect } from 'react'
import { FormItem } from '../../antDesignCompo/FormItem'
import styles from './TheStudenet.module.scss'
import Select from '../../antDesignCompo/Select'
import * as PaymentConst from '../../../constants/PaymentConst'
import { useState } from 'react'
import { getAuthRouteAPI, postRouteAPI } from '../../../services/apisService'
import Input from '../../antDesignCompo/Input'
import { Form } from 'antd'
import { getNewToken } from '../../../services/fireBaseAuthService'
import { dateRange, fullDate } from '../../../constants/DateConverter';
import ProfilePicture from '../../CommonComponents/ProfilePicture';
import { mediaUrl } from '../../../constants/DataManupulation'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import CustomButton from '../../CommonComponents/CustomButton'
import { toastSuccessMessage } from '../../../constants/ar'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { studentsExamsConst } from '../../../constants/adminPanelConst/studentsExamsConst/studentsExamsConst'
import { useRouter } from 'next/router'
import Spinner from '../../CommonComponents/spinner'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux'

const accountFoundFromList = [
    { value: '1', label: 'الأصدقاء', value: 'friends' },
    { value: '2', label: 'الأهل', value: 'parents' },
    { value: '3', label: 'إعلان سناب', value: 'snap_ad' },
    { value: '4', label: 'إعلان إنستقرام', value: 'instagram_ad' },
    { value: '5', label: 'إعلان تويتر', value: 'twitter_ad' },
    { value: '6', label: 'إعلان تيك توك', value: 'tiktok_ad' },
]

const TheStudent = (props) => {
    const [showStudentDetails, setShowStudentDetails] = useState(false)
    const [allStudentDetails, setAllStudentDetails] = useState([])
    const [displayedStudentList, setDisplayedStudentList] = useState([])
    const courseId = props.courseId
    const courseType = props.courseType
    const genders = PaymentConst.genders
    const [examList, setExamList] = useState()
    const [oldExamList, setOldExamList] = useState()
    const [selectedStudent, setSelectedStudent] = useState()
    const [studentDetailsForm] = Form.useForm()
    const [showBtnLoader, setShowBtnLoader] = useState(false)
    const router = useRouter()
    const [showLoader, setShowLoader] = useState(false)
    const [showStudentInfo, setShowStudentInfo] = useState(false)
    const [showSelectedStudentInfo, setShowSelectedStudentInfo] = useState()
    const storeData = useSelector((state) => state?.globalStore);
    const editCourseData = storeData?.editCourseData;
    const availabilityId = router?.query?.availabilityId
    const selectedaAvailability = props?.availabilityList?.filter((item) => availabilityId?.includes(item.id))[0]

    useEffect(() => {
        if (router.query.availabilityId == undefined && courseType != 'onDemand')
            return
        if (courseType == 'onDemand') {
            getAllStudentList("007")
        } else {
            getAllStudentList(router?.query?.availabilityId)
        }
    }, [router])

    const onInputChange = (e, index, fieldeName) => {
        const updatedExamData = [...examList]
        if (fieldeName == 'grade') {
            updatedExamData[index].grade = e.target.value
        } else {
            updatedExamData[index].note = e.target.value
        }
        setExamList(updatedExamData)
    }
    const studentDetailsSuccessRes = (msg) => {
        toast.success(studentsExamsConst?.toastSuccess, { rtl: true, })
        setShowBtnLoader(false)
    }
    const saveStudentExamDetails = async () => {
        setShowBtnLoader(true)
        let createDataBody = []
        let updateDataBody = []
        examList.forEach((newObj) => {
            const oldObj = oldExamList.find((old) => old.quizId === newObj.quizId);
            const oldGrade = oldObj?.grade;
            const newGrade = newObj?.grade;

            const oldNote = oldObj?.note;
            const newNote = newObj?.note

            const oldPresent = oldObj?.present;
            const newPresent = newObj?.present;

            const oldAbsent = oldObj?.absent;
            const newAbsent = newObj?.absent;

            if (newObj.old == false && ((oldGrade == undefined && newGrade != undefined) ||
                (oldNote == undefined && newNote != undefined) ||
                (oldPresent == undefined && newPresent != undefined) ||
                (oldAbsent == undefined && newAbsent != undefined))) {
                createDataBody.push({
                    userProfileId: selectedStudent.userProfile.id,
                    enrollmentId: selectedStudent.enrollmentId,
                    courseId: courseId,
                    itemId: newObj.quizId,
                    grade: newObj.grade,
                    note: newObj.note,
                    pass: newObj.present ? true : newObj.absent ? false : null
                });
            } else if (newObj.old == true && (oldGrade != newGrade || oldNote != newNote || oldPresent != newPresent || oldAbsent != newAbsent)) {
                updateDataBody.push({
                    userProfileId: selectedStudent.userProfile.id,
                    enrollmentId: selectedStudent.enrollmentId,
                    courseId: courseId,
                    itemId: newObj.quizId,
                    grade: newObj.grade,
                    note: newObj.note,
                    pass: newObj.present ? true : newObj.absent ? false : null
                });
            }
        });
        if (updateDataBody.length == 0 && createDataBody.length == 0) {
            setShowBtnLoader(false)
            return
        }
        let createAPIBody = {
            data: createDataBody,
            routeName: 'createCourseTrackBulk'
        }
        let updateAPIBody = {
            data: updateDataBody,
            routeName: "updateCourseTrackHandler"
        }
        if (createDataBody.length > 0) {
            await postRouteAPI(createAPIBody).then((res) => {
                createDataBody = []
                studentDetailsSuccessRes(toastSuccessMessage.examCreateSuccessMsg)
                setShowBtnLoader(false)
            }).catch(async (error) => {
                setShowBtnLoader(false)
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await postRouteAPI(createAPIBody).then((res) => {
                            studentDetailsSuccessRes(toastSuccessMessage.examCreateSuccessMsg)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
            })
        }
        if (updateDataBody.length > 0) {
            await postRouteAPI(updateAPIBody).then((res) => {
                updateDataBody = []
                studentDetailsSuccessRes(toastSuccessMessage.examUpdateSuccessMsg)
                setShowBtnLoader(false)
            }).catch(async (error) => {
                setShowBtnLoader(false)
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await postRouteAPI(updateAPIBody).then((res) => {
                            studentDetailsSuccessRes(toastSuccessMessage.examUpdateSuccessMsg)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
            })
        }
    }
    const getAllStudentList = async (id) => {
        setShowLoader(true)
        let data = {
            routeName: 'getStudentByAvailability',
            availabilityId: id,
            courseId: courseId,
        }
        await getAuthRouteAPI(data).then((res) => {
            setShowLoader(false)
            setAllStudentDetails(res?.data)
            setDisplayedStudentList(res?.data)
            studentDetailsForm.resetFields(['selectgender'])
        }).catch(async (error) => {
            setShowLoader(false)
            console.log(error);
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getAuthRouteAPI(data).then((res) => {
                        setAllStudentDetails(res?.data)
                        setDisplayedStudentList(res?.data)
                        studentDetailsForm.resetFields(['selectgender'])
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }
    const selectGenderFilter = (value) => {
        const newStudentList = [...allStudentDetails]
        setDisplayedStudentList(newStudentList.filter((student) => value == student.userProfile.gender));
    }
    const changeStatusForIndividualType = (type, index) => {
        let tempStudentExamList = [...examList]
        if (type == 'present') {
            if (tempStudentExamList[index].present == true) {
                tempStudentExamList[index].present = false
                tempStudentExamList[index].absent = false
            } else {
                tempStudentExamList[index].present = true
                tempStudentExamList[index].absent = false
            }
        }
        if (type == 'absent') {
            if (tempStudentExamList[index].absent == true) {
                tempStudentExamList[index].present = false
                tempStudentExamList[index].absent = false
            } else {
                tempStudentExamList[index].present = false
                tempStudentExamList[index].absent = true
            }
        }
        setExamList(tempStudentExamList)
    }
    const showSelectedStudentExamDetails = (student) => {
        setShowStudentDetails(true)
        const nonCompletedQuizItems = student?.userProfile?.nonCompletedQuizItems?.map((quiz, index) => {
            return {
                key: quiz.id,
                quizId: quiz.id,
                quizName: quiz.name,
                grade: undefined,
                note: undefined,
                present: undefined,
                absent: undefined,
                old: false
            }
        })

        const completedQuizItems = student?.userProfile?.quizExams?.map((quiz, index) => {
            return {
                key: quiz.item.id,
                quizId: quiz.item.id,
                quizName: quiz.item.name,
                grade: quiz.grade,
                note: quiz.note,
                present: quiz.pass == true ? true : false,
                absent: quiz.pass == false ? true : false,
                old: true
            }
        })
        // setOldExamList(JSON.parse(JSON.stringify([...nonCompletedQuizItems, ...completedQuizItems])))
        // setExamList(JSON.parse(JSON.stringify([...nonCompletedQuizItems, ...completedQuizItems])))
        setOldExamList(JSON.parse(JSON.stringify([...(Array.isArray(nonCompletedQuizItems) ? nonCompletedQuizItems : []), ...(Array.isArray(completedQuizItems) ? completedQuizItems : [])])))
        setExamList(JSON.parse(JSON.stringify([...(Array.isArray(nonCompletedQuizItems) ? nonCompletedQuizItems : []), ...(Array.isArray(completedQuizItems) ? completedQuizItems : [])])))
        setSelectedStudent(student)
    }
    const showSelectedStudentInformation = (student, courseId) => {
        setShowStudentInfo(true);
        const studentInfoBasedOnCoursed = student?.userProfile?.studentInformations?.length > 0 && student?.userProfile?.studentInformations?.find(info => info.courseId === router.query.courseId);
        if (studentInfoBasedOnCoursed) {
            const studentInfo = {
                phone: `${student?.userProfile?.phone}`,
                email: student?.userProfile?.email,
                schoolLevel: studentInfoBasedOnCoursed?.schoolLevel === 'other' ? studentInfoBasedOnCoursed?.otherSchoolLevel : studentSchoolLevel(studentInfoBasedOnCoursed?.schoolLevel),
                examResult: studentInfoBasedOnCoursed?.examResult,
                examDate: studentInfoBasedOnCoursed?.examDate ? fullDate(studentInfoBasedOnCoursed?.examDate) : '-',
                city: studentInfoBasedOnCoursed?.city === 'other' ? studentInfoBasedOnCoursed?.otherCity : studentInfoBasedOnCoursed?.city,
                district: studentInfoBasedOnCoursed?.district === 'other' ? studentInfoBasedOnCoursed?.otherDistrict : studentInfoBasedOnCoursed?.district,
                schoolName: studentInfoBasedOnCoursed?.schoolName === 'other' ? studentInfoBasedOnCoursed?.otherSchoolName : studentInfoBasedOnCoursed?.schoolName,
                parentNumber: studentInfoBasedOnCoursed?.parentNumber,
                reference: JSON.parse(studentInfoBasedOnCoursed?.reference).join(', '),
                otherReference: studentInfoBasedOnCoursed?.otherReference
            };
            setShowSelectedStudentInfo(studentInfo);
        } else {
            setShowSelectedStudentInfo();
        }
    }
    const studentSchoolLevel = (level) => {
        if (level === 'first_secondary_school') {
            return 'أول ثانوي'
        } else if (level === 'second_secondary_school') {
            return 'ثاني ثانوي'
        } else {
            return 'ثالث ثانوي'
        }
    }
    const availabilityDateRange = (dateFrom, dateTo) => {
        const fromDate = new Date(dateFrom)?.toLocaleDateString({ timeZone: "UTC", day: 'numeric', month: 'long' });
        const toDate = new Date(dateTo)?.toLocaleDateString({ timeZone: "UTC", day: 'numeric', month: 'long' });
        return `${fromDate} - ${toDate}`;
    };
    const downloadExcel = () => {
        const downloadDataForExcel = displayedStudentList.map((student) => {
            return {
                "اسم الطالب": student?.userProfile?.fullName ? student?.userProfile?.fullName : student?.userProfile?.firstName ? student?.userProfile?.firstName : null,
                "رقم الجوال": student?.userProfile?.phone ? student?.userProfile?.phone : null,
                "الايميل": student?.userProfile?.email ? student?.userProfile?.email : null,
                "تاريخ الاشتراك": fullDate(student?.userProfile?.createdAt) ? fullDate(student?.userProfile?.createdAt) : null,
            }
        });
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(downloadDataForExcel);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Quiz Items');
        const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        if (selectedaAvailability?.dateFrom && selectedaAvailability?.dateTo) {
            saveAs(blob, `${editCourseData.name}-${availabilityDateRange(selectedaAvailability.dateFrom, selectedaAvailability.dateTo)}.xlsx`);
        } else {
            saveAs(blob, `${editCourseData.name}.xlsx`);
        }
    }

    return (
        <div className='maxWidthDefault px-4'>
            {/* {(!showStudentDetails && !showStudentInfo) &&
                <div style={{ direction: 'ltr', marginBottom: '2rem' }}>
                    <CustomButton
                        btnText='تنزيل بيانات الطلاب'
                        width={190}
                        height={40}
                        fontSize={16}
                        onClick={() => downloadExcel()}
                    />
                </div>
            } */}
            {(!showStudentDetails && !showStudentInfo) &&
                <div>
                    <div style={{ direction: 'ltr', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <CustomButton
                            btnText='تنزيل بيانات الطلاب'
                            width={190}
                            height={40}
                            fontSize={16}
                            onClick={() => downloadExcel()}
                        />
                        <Form form={studentDetailsForm} className='pt-4  pr-4' >
                            {courseType == 'online' &&
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
                                </FormItem>}
                        </Form>
                    </div>
                    {showLoader ?
                        <div className={styles.tableBodyArea}>
                            <div className={styles.noDataManiArea} >
                                <div className={`relative ${styles.loadingWrapper}`}>
                                    <Spinner borderwidth={7} width={6} height={6} />
                                </div>
                            </div>
                        </div>
                        :
                        <div>
                            <table className={styles.tableArea}>
                                <thead className={styles.tableHeaderArea}>
                                    <tr>
                                        <th className={styles.tableHead1}>اسم الطالب</th>
                                        <th className={styles.tableHead2}>رقم الجوال</th>
                                        <th className={styles.tableHead3}>الايميل</th>
                                        <th className={styles.tableHead4}>بيانات الاشتراك</th>
                                        <th className={styles.tableHead5}>نتائج الاختبارات</th>
                                        <th className={styles.tableHead6}>تاريخ الاشتراك</th>
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
                                                            <p className={styles.requesterName}>{student?.userProfile?.fullName ? student?.userProfile?.fullName : student?.userProfile?.firstName}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <Link className='link' target={'_blank'} href={`https://api.whatsapp.com/send/?phone=${student?.userProfile?.phone}&text&type=phone_number&app_absent=0`}>{student?.userProfile?.phone}</Link>
                                                </td>
                                                <td>{student?.userProfile?.email}</td>
                                                <td className={`${styles.examText} link`} onClick={() => showSelectedStudentInformation(student)}>عرض البيانات</td>
                                                <td className={`${styles.examText} link`} onClick={() => showSelectedStudentExamDetails(student)}>مشاهدة الدرجات</td>
                                                <td>{fullDate(student?.userProfile?.createdAt)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {displayedStudentList?.length == 0 &&
                                <div className={styles.tableBodyArea}>
                                    <div className={styles.noDataManiArea} >
                                        <div>
                                            <AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
                                            <p className='fontBold py-2' style={{ fontSize: '18px' }}>ما أنشئت أي موعد</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </div>
            }
            {(showStudentDetails && !showStudentInfo) &&
                <div>
                    <div className={styles.studentDetailsTable}>
                        <p className={`${styles.studentDetails}`} onClick={() => setShowStudentDetails(false)}> الطلاب </p>
                        <p className='pl-2'>{'>'}</p>
                        <p className={styles.examResultsForStudents}>درجات الطالب {selectedStudent?.userProfile?.fullName}</p>
                    </div>
                    <div>
                        <table className={styles.studentTableArea}>
                            <thead className={styles.tableHeaderArea}>
                                <tr>
                                    <th className={styles.studentTableHead1}>عنوان الاختبار</th>
                                    <th className={styles.studentTableHead2}>الدرجة</th>
                                    <th className={styles.studentTableHead3}>مجتاز</th>
                                    <th className={styles.studentTableHead4}>غير مجتاز</th>
                                    <th className={styles.studentTableHead5}>الملاحظات</th>
                                </tr>
                            </thead>
                            <tbody className={styles.studentTableBodyArea}>
                                {examList?.map((exam, index) => {
                                    return (
                                        <tr className={styles.studentTableRow} key={`studentExamTable ${index}`}>
                                            <td>{exam.quizName}</td>
                                            <td>
                                                <Input
                                                    fontSize={16}
                                                    width={125}
                                                    height={37}
                                                    placeholder={studentsExamsConst?.grades}
                                                    value={exam.grade}
                                                    onChange={(e) => onInputChange(e, index, 'grade')}
                                                />
                                            </td>
                                            <td>
                                                <div className="cursor-pointer" onClick={() => changeStatusForIndividualType('present', index)}>
                                                    <AllIconsComponenet iconName={exam.present == true ? 'present' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cursor-pointer" onClick={() => changeStatusForIndividualType('absent', index)}>
                                                    <AllIconsComponenet iconName={exam.absent == true ? 'absent' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                </div>
                                            </td>
                                            <td>
                                                <Input
                                                    fontSize={16}
                                                    width={270}
                                                    height={37}
                                                    value={exam.note}
                                                    placeholder={studentsExamsConst?.notes}
                                                    onChange={(e) => onInputChange(e, index, 'note')}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
            {showStudentInfo &&
                <div>
                    <div className={styles.studentDetailsTable}>
                        <p className={`${styles.studentDetails}`} onClick={() => setShowStudentInfo(false)}>بيانات </p>
                        <p className='pl-2'>{'>'}</p>
                        <p className={styles.examResultsForStudents}>بيانات الطالب {selectedStudent?.userProfile?.fullName}</p>
                    </div>
                    <table className={`mt-4 ${styles.tableArea} `}>
                        <thead className={styles.tableHeaderArea}>
                            <tr>
                                <th className={styles.studentInfoTableHead}>رقم الجوال</th>
                                <th className={styles.studentInfoTableHead}>الايميل</th>
                                <th className={styles.studentInfoTableHead}>المرحلة الدراسية</th>
                                <th className={styles.studentInfoTableHead}>درجة الطالب</th>
                                <th className={styles.studentInfoTableHead}>موعد الاختبار</th>
                                <th className={styles.studentInfoTableHead}>المدينة</th>
                                <th className={styles.studentInfoTableHead}>الحي</th>
                                <th className={styles.studentInfoTableHead}>المدرسة</th>
                                <th className={styles.studentInfoTableHead}>رقم ولي الأمر</th>
                                <th className={styles.studentInfoTableHead}>من وين عرفنا</th>
                            </tr>
                        </thead>
                        {showSelectedStudentInfo &&
                            <tbody className={styles.studentTableBodyArea}>
                                <tr className={styles.studentTableRow}>
                                    <td><Link className='link' style={{ textDecoration: 'none' }} target={'_blank'} href={`https://api.whatsapp.com/send/?phone=${showSelectedStudentInfo?.phone}&text&type=phone_number&app_absent=0`}>{showSelectedStudentInfo?.phone}+</Link></td>
                                    <td><Link className='link' style={{ textDecoration: 'none' }} target={'_blank'} href={`mailto:${showSelectedStudentInfo?.email}`}>{showSelectedStudentInfo?.email}</Link></td>
                                    <td>{showSelectedStudentInfo?.schoolLevel}</td>
                                    <td>{showSelectedStudentInfo?.examResult}</td>
                                    <td>{showSelectedStudentInfo?.examDate}</td>
                                    <td>{showSelectedStudentInfo?.city}</td>
                                    <td>{showSelectedStudentInfo?.district}</td>
                                    <td>{showSelectedStudentInfo?.schoolName}</td>
                                    <td>{showSelectedStudentInfo?.parentNumber}</td>
                                    <td>
                                        {accountFoundFromList.filter((item) =>
                                            showSelectedStudentInfo?.reference?.includes(item.value)).map((item, index) => {
                                                return (
                                                    <div key={index}>
                                                        <p>{item.label}</p>
                                                    </div>
                                                )
                                            })}{showSelectedStudentInfo?.otherReference}
                                    </td>
                                </tr>
                            </tbody>
                        }
                    </table>
                    {displayedStudentList?.length == 0 || !showSelectedStudentInfo &&
                        <div className={styles.tableBodyArea}>
                            <div className={styles.noDataManiArea} >
                                <div className='flex columns items-center flex-col'>
                                    <AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
                                    <p className='fontBold py-2' style={{ fontSize: '18px' }}>{!showSelectedStudentInfo ? 'لا توجد بيانات' : 'ما أنشئت أي موعد'}</p>
                                </div>
                            </div>
                        </div>}
                </div>
            }
            {showStudentDetails &&
                <div className='pt-5'>
                    <CustomButton
                        btnText='حفظ'
                        width={80}
                        height={37}
                        showLoader={showBtnLoader}
                        fontSize={16}
                        onClick={saveStudentExamDetails}
                    />
                </div>}
        </div>
    )
}

export default TheStudent

