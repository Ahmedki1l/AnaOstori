import React, { useEffect, useState } from 'react'
import { FormItem } from '../../antDesignCompo/FormItem'
import Select from '../../antDesignCompo/Select'
import { useSelector } from 'react-redux'
import { dateRange } from '../../../constants/DateConverter'
import { getExamListAPI, getStudentListAPI } from '../../../services/apisService'
import Input from '../../antDesignCompo/Input'
import { Form } from 'antd'
import styles from './TestResults.module.scss'
import ProfilePicture from '../../CommonComponents/ProfilePicture'
import { mediaUrl } from '../../../constants/DataManupulation'
import SearchInput from '../../antDesignCompo/SearchInput'

const TestResults = (props) => {

    const courseId = props.courseId
    const storeData = useSelector((state) => state?.globalStore);
    const [examList, setExamList] = useState()
    const availabilityList = storeData?.availabilityList;
    const [showStudentList, setShowStudentList] = useState(false)
    const [selectedExam, setSelectedExam] = useState()
    const [selectedAvailability, setSelectedAvailability] = useState()


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
            courseId: courseId,
            type: 'quiz'
        }
        await getExamListAPI(body).then((res) => {
            console.log(res);
            const allExamList = res.data?.map((exam) => {
                return {
                    key: exam.id,
                    label: exam.name,
                    value: exam.id,
                }
            })
            setExamList(allExamList)
        }).catch((error) => {
            console.log(error);
        })
    }

    const onParamsSelect = (e, type) => {
        if (type == 'exam') {
            setSelectedExam(e)
            getStudentList(e, selectedAvailability)
        } else {
            setSelectedAvailability(e)
            getStudentList(selectedExam, e)
        }
        setShowStudentList(true)
    }

    const getStudentList = async (examId, availabilityId) => {
        if (!examId || !availabilityId) return
        await getStudentListAPI().then((res) => {
            console.log(res)
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <div className='maxWidthDefault px-4'>
            <Form>
                <div className='flex'>
                    <FormItem>
                        <SearchInput
                            fontSize={16}
                            width={331}
                            placeholder={'بحث باسم الطالب'}
                            suffix
                        />
                    </FormItem>
                    <FormItem
                        name={'examList'}
                    >
                        <Select
                            fontSize={16}
                            width={150}
                            height={40}
                            OptionData={examList}
                            placeholder="اختر المدرب"
                            onChange={(e) => onParamsSelect(e, 'exam')}
                        />
                    </FormItem>
                    <FormItem
                        name={'selectAvailability'}
                    >
                        <Select
                            fontSize={16}
                            width={150}
                            height={40}
                            OptionData={allavailability}
                            placeholder="اختر الجنس"
                            onChange={(e) => onParamsSelect(e, 'availability')}
                        />
                    </FormItem>
                </div>
            </Form>
            {showStudentList &&
                <table className={styles.examTableArea}>
                    <thead className={styles.tableHeaderArea}>
                        <tr>
                            <th className={styles.examTableHead1}>الطالب</th>
                            <th className={styles.examTableHead2}>الدرجة</th>
                            <th className={styles.examTableHead3}>الملاحظات</th>
                        </tr>
                    </thead>
                    <tbody className={styles.examTableBodyArea}>
                        <tr className={styles.examTableRow}>
                            <td>
                                <div className='flex'>
                                    <div className={styles.studentDetails} >
                                        <div className={styles.StudentListImage}>
                                            {/* <ProfilePicture height={34} width={34} alt={'avatar image'} pictureKey={student?.userProfile?.avatarKey == null ? student?.userProfile?.avatar : `${mediaUrl(student?.userProfile?.avatarBucket, student?.userProfile?.avatarKey)}`} /> */}
                                        </div>
                                        <p>wefwf</p>
                                        {/* <p className={styles.studentName}>{student?.userProfile?.fullName == "" ? student?.userProfile?.fullName : `${student?.userProfile?.firstName} ${student?.userProfile?.lastName}`}</p> */}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <Input
                                    fontSize={16}
                                    width={125}
                                    height={37}
                                    placeholder='اكتب الدرجة'
                                    onChange={(e) => onInputChange(e, index, 'result')}
                                />
                            </td>
                            <td>
                                <Input
                                    fontSize={16}
                                    width={324}
                                    height={37}
                                    placeholder='إن وجدت'
                                    onChange={(e) => onInputChange(e, index, 'note')}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            }
        </div>
    )
}

export default TestResults
