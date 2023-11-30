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

const ManegeUserListDrawer = ({ selectedUserDetails }) => {

    const [gender, setGender] = useState();
    const [avatarUploadResData, setAvtarUploadResData] = useState()
    const [userForm] = Form.useForm()
    const [enrolledCourseList, setEnrolledCourseList] = useState(selectedUserDetails.enrollments)

    useEffect(() => {
        userForm.setFieldsValue(selectedUserDetails)
        setGender(selectedUserDetails.gender)
    }, [])

    useEffect(() => {
        setEnrolledCourseList(enrolledCourseList)
    }, [enrolledCourseList])

    const handleSaveUserDetails = (values) => {
        if (avatarUploadResData) {
            values.avatarKey = avatarUploadResData?.key
            values.avatarBucket = avatarUploadResData?.bucket
            values.avatarMime = avatarUploadResData?.mime
        }
        values.enrolledCourse = enrolledCourseList
        console.log(values);
    }

    const addCourse = () => {
        let data = [...enrolledCourseList]
        data.push(JSON.parse(JSON.stringify({
            contentFileKey: '',
            contentFileMime: '',
            contentFileBucket: ''
        })))
        setEnrolledCourseList(data)
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
                {selectedUserDetails.enrollments.length > 0 ?
                    <>
                        <div className={`mt-6 ${styles.addCourseWrapper}`}>
                            <p className={`fontBold text-xl`}>{manageUserListConst.addCourseTitle}</p>
                            <p className={styles.addCourseBtnBox} onClick={() => addCourse()}>{manageUserListConst.addCourseBtn}</p>
                        </div>
                        <>
                            {enrolledCourseList.map((item, index) => {
                                return (
                                    <AddCourseInUserList
                                        key={`enrolledCourse${index}`}
                                        index={index}
                                        selectedUserDetails={selectedUserDetails}
                                        enrolledCourseList={enrolledCourseList}
                                        setEnrolledCourseList={setEnrolledCourseList}
                                    />
                                )
                            })}
                        </>
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
        </div>
    )
}

export default ManegeUserListDrawer