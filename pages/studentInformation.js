import React, { useEffect, useState } from 'react'
import styles from '../styles/StudentInformationForm.module.scss';
import { useSelector } from 'react-redux';
import { Form, FormItem } from '../components/antDesignCompo/FormItem';
import { studentInformationConst } from '../constants/studentInformationConst';
import Input from '../components/antDesignCompo/Input';
import Select from '../components/antDesignCompo/Select';
import ModelAfterFillStudentInfo from '../components/CommonComponents/ModelAfterFillStudentInfo/ModelAfterFillStudentInfo';
import { useRouter } from 'next/router';
import { getAuthRouteAPI, getRouteAPI, postAuthRouteAPI } from '../services/apisService';
import DatePicker from '../components/antDesignCompo/Datepicker';
import { getNewToken } from '../services/fireBaseAuthService';
import dayjs from 'dayjs';

const educationalLevelList = [
    { value: 'first_secondary_school', label: 'أول ثانوي' },
    { value: 'second_secondary_school', label: 'ثاني ثانوي' },
    { value: 'third_secondary_school', label: 'ثالث ثانوي' },
    { value: 'other', label: 'غير ذلك' },
];

const accountFoundFromList = [
    { value: 'friends', label: 'الأصدقاء' },
    { value: 'parents', label: 'الأهل' },
    { value: 'snap_ad', label: 'إعلان سناب' },
    { value: 'instagram_ad', label: 'إعلان إنستقرام' },
    { value: 'twitter_ad', label: 'إعلان تويتر' },
    { value: 'tiktok_ad', label: 'إعلان تيك توك' },
];

const StudentInformation = () => {

    const storeData = useSelector((state) => state?.globalStore);
    const fullName = storeData?.viewProfileData?.fullName;
    const [studentInfoForm] = Form.useForm();
    const [inputForOtherLevel, setInputForOtherLevel] = useState(false);
    const [modelAfterFillStudentInfo, setModelAfterFillStudentInfo] = useState(false);
    const router = useRouter()
    const courseId = router.query.courseId;
    const [studentInformationId, setStudentInformationId] = useState(null);
    const [selectedCityOther, setSelectedCityOther] = useState(false);
    const [inputForOtherSchoolName, setInputForOtherSchoolName] = useState(false);
    const [selectedDistrictOther, setSelectedDistrictOther] = useState(false);
    const [citiesList, setCitiesList] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [allDistrictList, setAllDistrictList] = useState([]);
    const [districtList, setDistrictList] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [schoolNameList, setSchoolNameList] = useState([]);

    useEffect(() => {
        if (router?.query?.editStudentInfo === 'true') {
            getStudentInfoForEdit()
        }
    }, [router.query.courseId])

    useEffect(() => {
        Promise.all([fetchData('listCity'), fetchData('listDistrict'), fetchData('listSchool')])
    }, [])

    const fetchData = async (routeName) => {
        let data = {
            routeName: routeName
        }
        await getRouteAPI(data).then((res) => {
            if (routeName === 'listCity') {
                const formattedData = res?.data?.map(item => ({
                    value: item.code,
                    label: item.nameAr,
                    key: item.id,
                }));
                formattedData?.push({ value: 'other', label: 'أخرى', value: 'other' });
                setCitiesList(formattedData);
            } else if (routeName === 'listDistrict') {
                const formattedData = res?.data?.map(item => ({
                    value: item.code,
                    label: item.nameAr,
                    key: item.id
                }));
                formattedData?.push({ value: 'other', label: 'أخرى', value: 'other' });
                setAllDistrictList(formattedData);
            } else if (routeName === 'listSchool') {
                const formattedData = res?.data?.map(item => ({
                    value: item.id,
                    label: item.nameAr,
                    key: item.id
                }));
                formattedData?.push({ value: 'other', label: 'أخرى', value: 'other' });
                setSchoolNameList(formattedData);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    const handleSaveInfo = async (values) => {
        values.courseId = courseId
        values.city = selectedCityOther ? values.otherCity : selectedCity;
        values.district = (selectedDistrictOther && !selectedCityOther) ? values.otherDistrict : selectedCityOther ? values.otherDistrictInput : selectedDistrict;
        values.schoolName = inputForOtherSchoolName ? values.otherSchoolName : values.schoolName;
        values.reference = JSON.stringify(values.reference);
        delete values.otherCity;
        delete values.otherSchoolName;
        delete values.otherDistrict;
        delete values.otherDistrictInput;
        if (studentInformationId) {
            values.id = studentInformationId;
        }
        values.routeName = 'createStudentInformation',
            await postAuthRouteAPI(values).then((res) => {
                if (res?.status === 200) {
                    setModelAfterFillStudentInfo(true);
                }
            }).catch(async (err) => {
                if (err?.response?.status === 401) {
                    await getNewToken().then(async () => {
                        await postAuthRouteAPI(values).then((res) => {
                            if (res?.status === 200) {
                                setModelAfterFillStudentInfo(true);
                            }
                        })
                    });
                }
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
                district: studentInfoToSet?.district,
                city: studentInfoToSet?.city,
                schoolName: studentInfoToSet?.schoolName,
                parentNumber: studentInfoToSet?.parentNumber,
                reference: JSON.parse(studentInfoToSet?.reference)
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleSelectEduCationalLevel = (value) => {
        if (value === 'other') {
            setInputForOtherLevel(true);
        } else {
            setInputForOtherLevel(false);
        }
    }

    const handleCityChange = (value) => {
        if (value === 'other') {
            setSelectedCityOther(true);
            setSelectedDistrict(null);
        } else {
            setSelectedCityOther(false);
            const selectedCity = citiesList.find(city => city.value === value);
            setSelectedCity(selectedCity?.label)
            const district = allDistrictList.filter(dist => dist.value === selectedCity?.value);
            const newDistrictList = [...district, { value: 'other', label: 'أخرى', value: 'other' }];
            setDistrictList(newDistrictList);
        }
    };

    const handleDistrictChange = (value) => {
        if (value === 'other') {
            setSelectedDistrictOther(true);
            setSelectedDistrict(null)
        } else {
            setSelectedDistrictOther(false);
            const district = districtList.find(dist => dist.value === value);
            setSelectedDistrict(district?.label);
        }
    }
    const handleSchoolNameChange = (value) => {
        if (value === 'other') {
            setInputForOtherSchoolName(true);
        } else {
            setInputForOtherSchoolName(false);
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
                            <FormItem
                                name={'otherSchoolLevel'}>
                                <Input
                                    width={358}
                                    height={46}
                                    placeholder={studentInformationConst.otherLevelPlaceHolder}
                                />
                            </FormItem>
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
                            <Select
                                width={358}
                                height={46}
                                placeholder={studentInformationConst.cityPlaceHolder}
                                OptionData={citiesList}
                                onChange={(e) => handleCityChange(e)}
                            />
                        </FormItem>
                        {selectedCityOther &&
                            <FormItem
                                name={'otherCity'}>
                                <Input
                                    width={358}
                                    height={46}
                                    placeholder={studentInformationConst.addOtherCityPlaceHolder}
                                />
                            </FormItem>
                        }
                        <p className='fontBold py-2' style={{ fontSize: '18px' }}>{studentInformationConst.districtHeading}</p>
                        {selectedCityOther ?
                            <FormItem
                                name={'otherDistrictInput'}>
                                <Input
                                    width={358}
                                    height={46}
                                    placeholder={studentInformationConst.otherDistrictPlaceHolder}
                                />
                            </FormItem>
                            :
                            <FormItem
                                name={'district'}>
                                <Select
                                    width={358}
                                    height={46}
                                    placeholder={studentInformationConst.districtPlaceHolder}
                                    OptionData={districtList}
                                    onChange={handleDistrictChange}
                                />
                            </FormItem>
                        }
                        {(selectedDistrictOther && !selectedCityOther) &&
                            <FormItem
                                name={'otherDistrict'}>
                                <Input
                                    width={358}
                                    height={46}
                                    placeholder={studentInformationConst.otherDistrictPlaceHolder}
                                />
                            </FormItem>
                        }
                        <p className='fontBold py-2' style={{ fontSize: '18px' }}>{studentInformationConst.schoolNameHeading}</p>
                        <FormItem
                            name={'schoolName'}>
                            <Select
                                width={358}
                                height={46}
                                placeholder={studentInformationConst.schoolNamePlaceHolder}
                                OptionData={schoolNameList}
                                onChange={handleSchoolNameChange}
                            />
                        </FormItem>
                        {inputForOtherSchoolName &&
                            <>
                                <FormItem
                                    name={'otherSchoolName'}>
                                    <Input
                                        width={358}
                                        height={46}
                                        placeholder={studentInformationConst.otherSchoolNamePlaceHolder}
                                    />
                                </FormItem>
                            </>
                        }
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