import { Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { FormItem } from '../antDesignCompo/FormItem';
import Input from '../antDesignCompo/Input';
import UploadFileForModel from '../CommonComponents/UploadFileForModel/UploadFileForModel'
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import styles from './manageUserList.module.scss'
import { manageUserListConst } from '../../constants/adminPanelConst/manageUserListConst/manageUserListConst';
import Empty from '../CommonComponents/Empty';
import AddCourseInUserList from '../CommonComponents/AddCourseInUserList/AddCourseInUserList';
import { useSelector } from 'react-redux';
import { postAuthRouteAPI } from '../../services/apisService';

const ManegeUserListDrawer = ({ selectedUserDetails }) => {
    const [gender, setGender] = useState();
    const [avatarUploadResData, setAvtarUploadResData] = useState()
    const [userForm] = Form.useForm()
    const storeData = useSelector((state) => state?.globalStore);
    const category = storeData.catagories
    const [newEnrollCourseList, setNewEnrollCourseList] = useState()
    const [updatedEnrollCourseList, setUpdatedEnrollCourseList] = useState()
    const [enrolledCourseList, setEnrolledCourseList] = useState(selectedUserDetails.enrollments.map((item) => {
        return {
            courseId: item?.course?.id,
            type: item?.course?.type,
            regionId: item?.availability?.regionId,
            availabilityId: item?.availability?.id,
            enrollmentId: item.id
        }
    }))
    const allCourse = category.flatMap((item) => {
        return item.courses.map((subItem) => {
            return { value: subItem.id, label: subItem.name, type: subItem.type };
        });
    });
    useEffect(() => {
        if (selectedUserDetails) {
            userForm.setFieldsValue(selectedUserDetails)
        }
        if (selectedUserDetails.enrollments.length > 0) {
            userForm.setFieldsValue({
                enrolledCourseList: selectedUserDetails.enrollments.map((item) => {
                    return {
                        courseId: item?.course?.id,
                        type: item?.course?.type,
                        regionId: item?.availability?.regionId,
                        availabilityId: item?.availability?.id,
                        enrollmentId: item.id
                    }
                })
            })
        }
    }, [selectedUserDetails, selectedUserDetails.enrollments]);

    const handleSaveUserDetails = async (values) => {
        if (avatarUploadResData) {
            values.avatarKey = avatarUploadResData?.key
            values.avatarBucket = avatarUploadResData?.bucket
            values.avatarMime = avatarUploadResData?.mime
        }
        let newData = values.enrolledCourseList.map((enrollment) => {
            const course = allCourse.find((course) => course.value === enrollment.courseId);
            if (course) {
                return {
                    ...enrollment,
                    type: course.type,
                    userProfileId: selectedUserDetails.id,
                };
            }
            return enrollment;
        });
        values.enrolledCourseList = newData
        const courseIdsToDelete = enrolledCourseList.map((item) => item.courseId);
        const updatedEnrolledCourseList = values.enrolledCourseList.filter((enrollment) => {
            return !courseIdsToDelete.includes(enrollment.courseId);
        });
        values.updatesCourseList = updatedEnrolledCourseList
        let body = {
            routeName: 'adminEnroll',
            data: values.updatesCourseList
        }
        console.log(body);
        await postAuthRouteAPI(body).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div>
            <Form form={userForm} onFinish={handleSaveUserDetails}>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>{manageUserListConst.studentFullName}</p>
                <FormItem
                    name={'fullName'}>
                    <Input
                        disabled={true}
                        width={425}
                        height={40}
                        placeholder='studentName'
                    />
                </FormItem>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>{manageUserListConst.uploadFilePlaceHolder}</p>
                <UploadFileForModel
                    fileName={selectedUserDetails?.avatarKey}
                    fileType={'.jpg , .png'}
                    accept={"image"}
                    placeHolderName={'ارفق الصورة'}
                    uploadResData={setAvtarUploadResData}
                    disabledInput={true}
                />
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>{manageUserListConst.genderHeading}</p>
                <div className={styles.genderBtnBox}>
                    <button className={`${styles.maleBtn} ${gender == "male" ? `${styles.genderActiveBtn}` : ''}`} onClick={() => setGender("male")} disabled>
                        <AllIconsComponenet height={26} width={15} iconName={'male'} color={gender == "male" ? '#F06A25' : '#808080'} />
                        <span>ذكر</span>
                    </button>
                    <button className={`${styles.femaleBtn} ${gender == 'female' ? `${styles.genderActiveBtn}` : ''}`} onClick={() => setGender('female')} disabled>
                        <AllIconsComponenet height={26} width={15} iconName={'female'} color={gender == "female" ? '#F06A25' : '#808080'} />
                        <span>أنثى</span>
                    </button>
                </div>

                <p className='fontBold py-2' style={{ fontSize: '18px' }}>{manageUserListConst.emailHeading}</p>
                <FormItem
                    name={'email'}>
                    <Input
                        disabled={true}
                        width={425}
                        height={40}
                        placeholder='DisplayEmail'
                    />
                </FormItem>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>{manageUserListConst.phoneNoHeading}</p>
                <FormItem
                    name={'phone'}>
                    <Input
                        disabled={true}
                        width={425}
                        height={40}
                        placeholder='phoneNo'
                    />
                </FormItem>
                {enrolledCourseList.length > 0 ?
                    <>
                        <Form.List name="enrolledCourseList" initialValue={[{
                            name: '',
                            region: '',
                        }]}>
                            {(field, { add, remove }) => (
                                <>
                                    <div className={`mt-6 ${styles.addCourseWrapper}`}>
                                        <p className={`fontBold text-xl`}>{manageUserListConst.addCourseTitle}</p>
                                        <p className={styles.addCourseBtnBox} onClick={() => { add() }}>{manageUserListConst.addCourseBtn}</p>
                                    </div>
                                    <>
                                        {field.map(({ name, key, fieldKey, ...restField }, index) => {
                                            const enrollment = enrolledCourseList[index]
                                            return (
                                                <AddCourseInUserList
                                                    key={`enrolledCourse${name}${index}`}
                                                    index={index}
                                                    allCourse={allCourse}
                                                    name={name}
                                                    enrollment={enrollment}
                                                    enrolledCourseList={enrolledCourseList}
                                                    setEnrolledCourseList={setEnrolledCourseList}
                                                    newEnrollCourseList={newEnrollCourseList}
                                                    setNewEnrollCourseList={setNewEnrollCourseList}
                                                    updatedEnrollCourseList={updatedEnrollCourseList}
                                                    setUpdatedEnrollCourseList={setUpdatedEnrollCourseList}
                                                />
                                            )
                                        }
                                        )}
                                    </>
                                </>
                            )}
                        </Form.List>
                    </>
                    :
                    <p className={`fontBold mb-4 ${styles.addCourse}`}>{manageUserListConst.addCourseTitle}</p>
                }
                {selectedUserDetails.enrollments.length == 0 &&
                    <>
                        <Empty emptyText={manageUserListConst.emptyBtnPlaceHolder} containerhight={165} />
                        <div className={styles.userListBtnBox}>
                            <button className='primaryStrockedBtn mb-6' htmltype='submit' onClick={() => addCourse()}>{manageUserListConst.emptyBtnText}</button>
                        </div>
                    </>
                }
                <div className={styles.userListBtnBox}>
                    <button className='primarySolidBtn py-2 px-5 mt-5' htmltype='submit' >{manageUserListConst.saveBtn}</button>
                </div>
            </Form>
        </div >
    )
}

export default ManegeUserListDrawer