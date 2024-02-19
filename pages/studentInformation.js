import React, { useEffect, useState } from 'react'
import styles from '../styles/StudentInformationForm.module.scss';
import { useSelector } from 'react-redux';
import { Form, FormItem } from '../components/antDesignCompo/FormItem';
import { studentInformationConst } from '../constants/studentInformationConst';
import Input from '../components/antDesignCompo/Input';
import Select from '../components/antDesignCompo/Select';
import ModelAfterFillStudentInfo from '../components/CommonComponents/ModelAfterFillStudentInfo/ModelAfterFillStudentInfo';
import { useRouter } from 'next/router';
import { getAuthRouteAPI, postAuthRouteAPI } from '../services/apisService';
import DatePicker from '../components/antDesignCompo/Datepicker';
import { getNewToken } from '../services/fireBaseAuthService';
import dayjs from 'dayjs';

const educationalLevelList = [
    { value: '1', label: 'أول ثانوي', value: 'first_secondary_school' },
    { value: '2', label: 'ثاني ثانوي', value: 'second_secondary_school' },
    { value: '3', label: 'ثالث ثانوي', value: 'third_secondary_school' },
    { value: '4', label: 'غير ذلك ', value: 'other' },
]
const accountFoundFromList = [
    { value: '1', label: 'الأصدقاء', value: 'friends' },
    { value: '2', label: 'الأهل', value: 'parents' },
    { value: '3', label: 'إعلان سناب', value: 'snap_ad' },
    { value: '4', label: 'إعلان إنستقرام', value: 'instagram_ad' },
    { value: '5', label: 'إعلان تويتر', value: 'twitter_ad' },
    { value: '6', label: 'إعلان تيك توك', value: 'tiktok_ad' },
]

const StudentInformation = () => {
    const storeData = useSelector((state) => state?.globalStore);
    const fullName = storeData?.viewProfileData?.fullName;
    const [studentInfoForm] = Form.useForm();
    const [inputForOtherLevel, setInputForOtherLevel] = useState(false);
    const [modelAfterFillStudentInfo, setModelAfterFillStudentInfo] = useState(false);
    const router = useRouter()
    const courseId = router.query.courseId;
    const [studentInformationId, setStudentInformationId] = useState(null);

    useEffect(() => {
        if (router?.query?.editStudentInfo === 'true') {
            getStudentInfoForEdit()
        }
    }, [router.query.courseId])

    const handleSaveInfo = async (values) => {
        values.courseId = courseId
        values.reference = JSON.stringify(values.reference);
        if (studentInformationId) {
            values.id = studentInformationId;
        }
        values.routeName = 'createStudentInformation',
            await postAuthRouteAPI(values).then((res) => {
                console.log(res);
                if (res?.response?.status !== 400) {
                    setModelAfterFillStudentInfo(true);
                }
            }).catch((err) => {
                console.log(err);
            });
    }
    const getStudentInfoForEdit = async () => {
        const data = {
            routeName: "viewProfile",
            courseId: courseId
        };
        try {
            const res = await getAuthRouteAPI(data);
            setStudentInformationId(res?.data?.studentInformations[0]?.id);
            const studentInfos = res?.data?.studentInformations;
            const studentInfoToSet = studentInfos[0];
            studentInfoForm.setFieldsValue({
                schoolLevel: studentInfoToSet?.schoolLevel,
                examResult: studentInfoToSet?.examResult,
                examDate: dayjs(studentInfoToSet?.examDate, 'YYYY-MM-DD'),
                city: studentInfoToSet?.city,
                schoolName: studentInfoToSet?.schoolName,
                parentNumber: studentInfoToSet?.parentNumber,
                reference: JSON.parse(studentInfoToSet?.reference)
            });
        } catch (error) {
            console.log(error);
            if (error?.response?.status === 401) {
                await getNewToken();
                await getStudentInfoForEdit();
            }
        }
    };

    const handleSelectEduCationalLevel = (value) => {
        if (value === 'other') {
            setInputForOtherLevel(true);
        } else {
            setInputForOtherLevel(false);
        }
    }
    return (
        <div className={`maxWidthDefault ${styles.studentInfoFormArea}`}>
            <div className={styles.studentInfoFormDiv}>
                <Form form={studentInfoForm} onFinish={handleSaveInfo}>
                    <h1>حياك الله {fullName}</h1>
                    <p style={{ fontSize: '18px' }}>{studentInformationConst.appropriateText}</p>
                    <div className='mt-2'>
                        <p className='fontBold py-2' style={{ fontSize: '18px' }}>{studentInformationConst.educationalLevelHeading}</p>
                        <FormItem
                            name={'schoolLevel'}
                        >
                            <Select
                                width={358}
                                height={46}
                                placeholder={studentInformationConst.educationalLevelPlaceHolder}
                                onChange={handleSelectEduCationalLevel}
                                OptionData={educationalLevelList}
                            />
                        </FormItem>
                        {inputForOtherLevel &&
                            <>
                                <p className='fontBold py-2' style={{ fontSize: '18px' }}>{studentInformationConst.otherLevelHeading}</p>
                                <FormItem
                                    name={'email'}>
                                    <Input
                                        width={358}
                                        height={46}
                                        placeholder={studentInformationConst.otherLevelPlaceHolder}
                                    />
                                </FormItem>
                            </>
                        }
                        <p className='fontBold py-2' style={{ fontSize: '18px' }}>{studentInformationConst.examResultsText}</p>
                        <FormItem
                            name={'examResult'}>
                            <Input
                                width={358}
                                height={46}
                                placeholder={studentInformationConst.examResultPlaceHolder}
                            />
                        </FormItem>
                        <p className='fontBold py-2' style={{ fontSize: '18px' }}>{studentInformationConst.nextExamDateHeading}</p>
                        <FormItem
                            name={'examDate'}
                        // rules={[{ required: true, message: "ادخل تاريخ البداية" }]}
                        >
                            <DatePicker
                                format={'YYYY-MM-DD'}
                                width={358}
                                height={46}
                                placeholder={studentInformationConst.nextExamDatePlaceHolder}
                                suFFixIconName="calenderDoubleColorIcon"
                            />
                        </FormItem>
                        <p className='fontBold py-2' style={{ fontSize: '18px' }}>{studentInformationConst.cityHeading}</p>
                        <FormItem
                            name={'city'}>
                            <Input
                                width={358}
                                height={46}
                                placeholder={studentInformationConst.cityPlaceHolder}
                            />
                        </FormItem>
                        <p className='fontBold py-2' style={{ fontSize: '18px' }}>{studentInformationConst.schoolNameHeading}</p>
                        <FormItem
                            name={'schoolName'}>
                            <Input
                                width={358}
                                height={46}
                                placeholder={studentInformationConst.schoolNamePlaceHolder}
                            />
                        </FormItem>
                        <p className='fontBold py-2' style={{ fontSize: '18px' }}>{studentInformationConst.parentNumberHeading}</p>
                        <FormItem
                            name={'parentNumber'}>
                            <Input
                                width={358}
                                height={46}
                                placeholder={studentInformationConst.parentNumberPlaceHolder}
                            />
                        </FormItem>
                        <p className='fontBold py-2' style={{ fontSize: '18px' }}>{studentInformationConst.whereYouFoundAccountHeading}</p>
                        <FormItem
                            name={'reference'}
                        >
                            <Select
                                mode="multiple"
                                maxTagCount='responsive'
                                width={358}
                                height={46}
                                placeholder={studentInformationConst.whereYouFoundAccountPlaceHolder}
                                onChange={handleSelectEduCationalLevel}
                                OptionData={accountFoundFromList}
                            />
                        </FormItem>
                        <div className={styles.saveStudentInfoBtn}>
                            <button className='primarySolidBtn py-2 px-5 mt-5' htmltype='submit' >{studentInformationConst.saveInformation}</button>
                        </div>
                    </div>
                </Form>
                {modelAfterFillStudentInfo &&
                    <ModelAfterFillStudentInfo
                        modelAfterFillStudentInfo={modelAfterFillStudentInfo}
                        setModelAfterFillStudentInfo={setModelAfterFillStudentInfo}
                    />
                }
            </div>
        </div>
    )
}

export default StudentInformation