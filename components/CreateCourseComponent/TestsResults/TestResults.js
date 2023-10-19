import React, { useEffect, useState } from 'react'
import { FormItem } from '../../antDesignCompo/FormItem'
import Select from '../../antDesignCompo/Select'
import { useSelector } from 'react-redux'
import { dateRange } from '../../../constants/DateConverter'
import { getRouteAPI, postRouteAPI } from '../../../services/apisService'
import Input from '../../antDesignCompo/Input'
import { Form } from 'antd'
import styles from './TestResults.module.scss'
import ProfilePicture from '../../CommonComponents/ProfilePicture'
import { mediaUrl } from '../../../constants/DataManupulation'
import SearchInput from '../../antDesignCompo/SearchInput'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import CustomButton from '../../CommonComponents/CustomButton'
import { toastSuccessMessage } from '../../../constants/ar'
import { toast } from 'react-toastify'
import { getNewToken } from '../../../services/fireBaseAuthService'

const TestResults = (props) => {

    const courseId = props.courseId
    const courseType = props.courseType
    const storeData = useSelector((state) => state?.globalStore);
    const [examList, setExamList] = useState()
    const availabilityList = storeData?.availabilityList;
    const [showStudentList, setShowStudentList] = useState(false)
    const [selectedExam, setSelectedExam] = useState()
    const [selectedAvailability, setSelectedAvailability] = useState()
    const [studentList, setStudentList] = useState()
    const [updatedStudentList, setUpdatedStudentList] = useState()
    const [showBtnLoader, setShowBtnLoader] = useState(false)

    const allavailability = availabilityList?.map((obj) => {
        return {
            key: obj.id,
            label: dateRange(obj.dateFrom, obj.dateTo),
            value: obj.id,
        }
    });

    useEffect(() => {
        getExamList()
    }, [])

    const getExamList = async () => {
        let body = {
            routeName: 'getItemByCourseId',
            courseId: courseId,
            type: 'quiz'
        }
        await getRouteAPI(body).then((res) => {
            const allExamList = res.data?.map((exam) => {
                return {
                    key: exam.id,
                    label: exam.name,
                    value: exam.id,
                }
            })
            setExamList(allExamList)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getRouteAPI(body).then((res) => {
                        const allExamList = res.data?.map((exam) => {
                            return {
                                key: exam.id,
                                label: exam.name,
                                value: exam.id,
                            }
                        })
                        setExamList(allExamList)
                    })
                })
            }
            console.log(error);
        })
    }

    const createUpdatedList = (list) => {
        const updatedList = list.map(item => {
            if (item.userProfile.exam.length == 0) {
                const updatedExam = {
                    grade: null,
                    note: null,
                    present: null,
                    absent: null,
                    old: false,
                    courseId: courseId,
                    enrollmentId: item.enrollmentId,
                    itemId: selectedExam,
                    userProfileId: item.userProfile.id
                }
                return {
                    ...item,
                    userProfile: {
                        ...item.userProfile,
                        exam: [updatedExam]
                    }
                }
            }
            else {
                const updatedExam = item.userProfile.exam.map(examItem => {
                    return {
                        ...examItem,
                        present: examItem.pass === true ? true : null,
                        absent: examItem.pass === false ? true : null,
                        old: true,
                    };
                });
                return {
                    ...item,
                    userProfile: {
                        ...item.userProfile,
                        exam: updatedExam
                    }
                };
            }
        });
        setStudentList(JSON.parse(JSON.stringify(updatedList)))
        setUpdatedStudentList(JSON.parse(JSON.stringify(updatedList)))
    }
    const onParamsSelect = (e, type) => {
        if (courseType == "onDemand") {
            setSelectedExam(e)
            getStudentList(e, "007")
        } else {
            if (type == 'exam') {
                setSelectedExam(e)
                getStudentList(e, selectedAvailability)
            } else {
                setSelectedAvailability(e)
                getStudentList(selectedExam, e)
            }
        }
    }

    const getStudentList = async (examId, availabilityId) => {
        if (!examId || !availabilityId) return
        if (courseType == "onDemand") {
            let params = {
                routeName: 'getStudentExamByItem',
                availabilityId: availabilityId,
                itemId: examId,
                courseId: courseId
            }
            await getRouteAPI(params).then((res) => {
                // await getStudentListByExamOnDemandAPI(params).then((res) => {
                createUpdatedList(res.data)
                setShowStudentList(true)
            }).catch(async (error) => {
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        // await getStudentListByExamOnDemandAPI(params).then((res) => {
                        await getRouteAPI(params).then((res) => {
                            createUpdatedList(res.data)
                            setShowStudentList(true)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
            })
        } else {
            let params = {
                routeName: 'getStudentExamByItem',
                itemId: examId,
                availabilityId: availabilityId,
                courseId: courseId
            }
            await getRouteAPI(params).then((res) => {
                createUpdatedList(res.data)
                setShowStudentList(true)
            }).catch(async (error) => {
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await getRouteAPI(params).then((res) => {
                            createUpdatedList(res.data)
                            setShowStudentList(true)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
            })
        }
    }

    const saveStudentExamDetails = async () => {
        setShowBtnLoader(true)
        const createDataBody = [];
        const updateDataBody = [];

        const oldExamMap = {};
        studentList.forEach((item) => {
            oldExamMap[item.userProfile.id] = item.userProfile.exam;
        });

        updatedStudentList.forEach((newItem) => {
            const oldItem = studentList.find((item) => item.enrollmentId === newItem.enrollmentId);

            const oldExam = oldItem?.userProfile?.exam[0]
            const newExam = newItem?.userProfile?.exam[0]

            const oldGrade = oldExam?.grade;
            const newGrade = newExam?.grade;

            const oldPresent = oldExam?.present;
            const newPresent = newExam?.present;

            const oldAbsent = oldExam?.absent;
            const newAbsent = newExam?.absent;

            const oldNote = oldExam?.note;
            const newNote = newExam?.note;

            if (newExam?.old == false && ((oldGrade == null && newGrade != null) ||
                (oldNote == null && newNote != null) ||
                (oldPresent == null && newPresent != null) ||
                (oldAbsent == null && newAbsent != null))) {
                createDataBody.push({
                    userProfileId: newItem.userProfile.id,
                    enrollmentId: newItem.enrollmentId,
                    itemId: selectedExam,
                    courseId: courseId,
                    grade: newGrade,
                    note: newItem.userProfile.exam[0].note,
                    pass: newExam.present ? true : newExam.absent ? false : null
                });
            } else if (newExam?.old == true && (oldGrade != newGrade || oldNote != newNote || oldPresent != newPresent || oldAbsent != newAbsent)) {
                updateDataBody.push({
                    userProfileId: newItem.userProfile.id,
                    enrollmentId: newItem.enrollmentId,
                    itemId: selectedExam,
                    courseId: courseId,
                    grade: newGrade,
                    note: newItem.userProfile.exam[0].note,
                    pass: newExam.present ? true : newExam.absent ? false : null
                });
            }
        });

        let createAPIBody = {
            data: createDataBody,
            routeName: "createCourseTrackBulk"
        }
        let updateAPIBody = {
            data: updateDataBody,
            routeName: "updateCourseTrackHandler"
        }

        if (createDataBody.length > 0) {
            await postRouteAPI(createAPIBody).then((res) => {
                toast.success(toastSuccessMessage.examCreateSuccessMsg, { rtl: true, })
                setShowBtnLoader(false)
            }).catch(async (error) => {
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await postRouteAPI(createAPIBody).then((res) => {
                            toast.success(toastSuccessMessage.examCreateSuccessMsg, { rtl: true, })
                            setShowBtnLoader(false)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
                setShowBtnLoader(false)
            })
        }
        else if (updateDataBody.length > 0) {
            await postRouteAPI(updateAPIBody).then((res) => {
                toast.success(toastSuccessMessage.examUpdateSuccessMsg, { rtl: true, })
                setShowBtnLoader(false)
            }).catch(async (error) => {
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await postRouteAPI(updateAPIBody).then((res) => {
                            toast.success(toastSuccessMessage.examUpdateSuccessMsg, { rtl: true, })
                            setShowBtnLoader(false)
                        })
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                }
                setShowBtnLoader(false)
            })
        }
    }

    const onInputChange = (e, index, type, student) => {
        const list = [...updatedStudentList]
        if (type == 'result') {
            if (list[index].userProfile.exam.length == 0) {
                list[index].userProfile.exam.push({
                    grade: e.target.value,
                    note: null,
                    present: null,
                    absent: null,
                    old: false,
                    courseId: courseId,
                    enrollmentId: student.enrollmentId,
                    itemId: selectedExam,
                    userProfileId: student.userProfile.id
                })
            } else {
                list[index].userProfile.exam[0].grade = e.target.value
            }
        } else if (type == 'note') {
            if (list[index].userProfile.exam.length == 0) {
                list[index].userProfile.exam.push({
                    grade: null,
                    note: e.target.value,
                    present: null,
                    absent: null,
                    old: false,
                    courseId: courseId,
                    enrollmentId: student.enrollmentId,
                    itemId: selectedExam,
                    userProfileId: student.userProfile.id
                })
            } else {
                list[index].userProfile.exam[0].note = e.target.value
            }
        }
        setUpdatedStudentList(list)
    }

    const handleSearchName = (e) => {
        const newStudentList = [...studentList]
        const filteredList = newStudentList.filter((student) => {
            const fullName = student.userProfile.fullName.toLowerCase();
            const searchName = e.target.value.toLowerCase();
            return fullName.includes(searchName);
        });
        setUpdatedStudentList(filteredList)
    }

    const handlePassOrFaild = (type, index) => {
        const list = [...updatedStudentList]
        if (type == 'present') {
            if (list[index].userProfile.exam.length == 0) {
                // list[index].userProfile.exam.push({
                //     grade: null,
                //     note: '',
                //     present: true,
                //     absent: false,
                //     old: false,
                //     courseId: courseId,
                //     enrollmentId: list[index].enrollmentId,
                //     itemId: selectedExam,
                //     userProfileId: list[index].userProfile.id
                // })
            } else if (list[index].userProfile.exam[0]?.present && list[index].userProfile.exam[0].present == true) {
                list[index].userProfile.exam[0].present = false
                list[index].userProfile.exam[0].absent = false
            } else {
                list[index].userProfile.exam[0].present = true
                list[index].userProfile.exam[0].absent = false
            }
        } else {
            if (list[index].userProfile.exam[0].absent && list[index].userProfile.exam[0].absent == true) {
                list[index].userProfile.exam[0].present = false
                list[index].userProfile.exam[0].absent = false
            } else {
                list[index].userProfile.exam[0].present = false
                list[index].userProfile.exam[0].absent = true
            }
        }
        setUpdatedStudentList(list)
    }

    return (
        <div className='maxWidthDefault px-4'>
            <Form>
                <div className='flex'>
                    {courseType !== "onDemand" &&
                        <FormItem
                            name={'selectAvailability'}
                        >
                            <Select
                                fontSize={16}
                                width={200}
                                height={40}
                                OptionData={allavailability}
                                placeholder="اختر الجنس"
                                onChange={(e) => onParamsSelect(e, 'availability')}
                            />
                        </FormItem>
                    }
                    <FormItem
                        name={'examList'}
                    >
                        <Select
                            fontSize={16}
                            width={150}
                            height={40}
                            OptionData={examList}
                            placeholder='اختار الاختبار'
                            onChange={(e) => onParamsSelect(e, 'exam')}
                        />
                    </FormItem>
                    <FormItem>
                        <SearchInput
                            fontSize={16}
                            width={331}
                            placeholder={'بحث باسم الطالب'}
                            suffix
                            onChange={(e) => handleSearchName(e)}
                        />
                    </FormItem>
                </div>
            </Form>
            {showStudentList &&
                <div>
                    <table className={styles.examTableArea}>
                        <thead className={styles.tableHeaderArea}>
                            <tr>
                                <th className={styles.examTableHead1}>عنوان الاختبار</th>
                                <th className={styles.examTableHead2}>الدرجة</th>
                                <th className={styles.examTableHead3}>مجتاز</th>
                                <th className={styles.examTableHead4}>غير مجتاز</th>
                                <th className={styles.examTableHead5}>الملاحظات</th>
                            </tr>
                        </thead>
                        {updatedStudentList.length > 0 &&
                            <tbody className={styles.examTableBodyArea}>
                                {updatedStudentList?.map((student, index) => {
                                    return (
                                        <tr className={styles.examTableRow} key={student.enrollmentId} >
                                            <td>
                                                <div className='flex'>
                                                    <div className={styles.studentDetails} >
                                                        <div className={styles.StudentListImage}>
                                                            <ProfilePicture height={34} width={34} alt={'avatar image'} pictureKey={student?.userProfile?.avatarKey == null ? student?.userProfile?.avatar : `${mediaUrl(student?.userProfile?.avatarBucket, student?.userProfile?.avatarKey)}`} />
                                                        </div>
                                                        <p className={styles.studentName}>{student?.userProfile?.fullName ? student?.userProfile?.fullName : student?.userProfile?.firstName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <Input
                                                    fontSize={16}
                                                    width={125}
                                                    height={37}
                                                    value={student?.userProfile?.exam[0]?.grade ? student?.userProfile?.exam[0]?.grade : ''}
                                                    placeholder='اكتب الدرجة'
                                                    onChange={(e) => onInputChange(e, index, 'result', student)}
                                                />
                                            </td>
                                            <td>
                                                <div className="cursor-pointer" onClick={() => handlePassOrFaild('present', index)}>
                                                    <AllIconsComponenet iconName={student?.userProfile?.exam[0]?.present == true ? 'present' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cursor-pointer" onClick={() => handlePassOrFaild('absent', index)}>
                                                    <AllIconsComponenet iconName={student?.userProfile?.exam[0]?.absent == true ? 'absent' : 'circleicon'} height={34} width={34} color={'#D9D9D9'} />
                                                </div>
                                            </td>
                                            <td>
                                                <Input
                                                    fontSize={16}
                                                    width={324}
                                                    height={37}
                                                    value={student?.userProfile?.exam[0]?.note ? student?.userProfile?.exam[0]?.note : ''}
                                                    placeholder='إن وجدت'
                                                    onChange={(e) => onInputChange(e, index, 'note', student)}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        }
                    </table>
                    {updatedStudentList.length > 0 &&
                        <div className='flex'>
                            <div className='pt-5'>
                                <CustomButton
                                    btnText='حفظ'
                                    width={80}
                                    height={37}
                                    showLoader={showBtnLoader}
                                    fontSize={16}
                                    onClick={saveStudentExamDetails}
                                />
                            </div>
                        </div>
                    }
                </div>
            }
            {updatedStudentList?.length == 0 &&
                <div className={styles.tableBodyArea}>
                    <div className={styles.noDataManiArea}>
                        <div>
                            <AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
                            <p className='fontBold py-2' style={{ fontSize: '18px' }}>ما أنشئت أي موعد</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default TestResults
