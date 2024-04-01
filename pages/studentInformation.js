import React, { useEffect, useState } from 'react'
import styles from '../styles/StudentInformationForm.module.scss';
import { useSelector } from 'react-redux';
import { Form, FormItem } from '../components/antDesignCompo/FormItem';
import { accountFoundFromList, educationalLevelList, studentInformationConst } from '../constants/studentInformationConst';
import Input from '../components/antDesignCompo/Input';
import Select from '../components/antDesignCompo/Select';
import ModelAfterFillStudentInfo from '../components/CommonComponents/ModelAfterFillStudentInfo/ModelAfterFillStudentInfo';
import { useRouter } from 'next/router';
import { getAuthRouteAPI, getRouteAPI, postAuthRouteAPI } from '../services/apisService';
import DatePicker from '../components/antDesignCompo/Datepicker';
import { getNewToken } from '../services/fireBaseAuthService';
import dayjs from 'dayjs';

const StudentInformation = () => {

    const storeData = useSelector((state) => state?.globalStore);
    const fullName = storeData?.viewProfileData?.fullName;
    const [studentInfoForm] = Form.useForm();
    const [inputForOtherLevel, setInputForOtherLevel] = useState(false);
    const [modelAfterFillStudentInfo, setModelAfterFillStudentInfo] = useState(false);
    const router = useRouter()
    const courseId = router.query.courseId;
    const courseType = router.query.courseType;
    const [studentInformationId, setStudentInformationId] = useState(null);
    const [selectedCityOther, setSelectedCityOther] = useState(false);
    const [inputForOtherSchoolName, setInputForOtherSchoolName] = useState(false);
    const [selectedDistrictOther, setSelectedDistrictOther] = useState(false);
    const [citiesList, setCitiesList] = useState([]);
    const [allDistrictList, setAllDistrictList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [schoolNameList, setSchoolNameList] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [inputForOtherReferances, setInputForOtherReferances] = useState(false);
    // const [parentNoError, setParentNoError] = useState('');

    useEffect(() => {
        Promise.all([fetchData('listCity'), fetchData('listDistrict'), fetchData('listSchool')])
        if (router.query.editStudentInfo === 'true') {
            getStudentInfoForEdit();
        }
    }, [router.query.courseId]);


    const fetchData = async (routeName) => {
        let data = {
            routeName: routeName
        }
        await getRouteAPI(data).then((res) => {
            if (routeName === 'listCity') {
                const formattedData = res?.data?.sort((a, b) => parseInt(a.code) - parseInt(b.code)).map(item => ({
                    value: item.nameAr,
                    label: item.nameAr,
                    key: item.id,
                    cityCode: item.code
                }));
                formattedData?.push({ value: 'other', label: 'أخرى', value: 'other' });
                setCitiesList(formattedData);
            } else if (routeName === 'listDistrict') {
                const formattedData = res?.data?.sort((a, b) => parseInt(a.cityCode) - parseInt(b.cityCode)).map(item => ({
                    value: item.nameAr,
                    label: item.nameAr,
                    key: item.id,
                    cityCode: item.cityCode,
                    districtCode: item.code
                }));
                formattedData?.push({ value: 'other', label: 'أخرى', value: 'other' });
                setAllDistrictList(formattedData);
            } else if (routeName === 'listSchool') {
                const formattedData = res?.data?.sort((a, b) => parseInt(a.code) - parseInt(b.code)).map(item => ({
                    value: item.nameAr,
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
        values.reference = JSON.stringify(values.reference);
        values.otherCity = values.city == 'other' ? values.otherCity : null;
        values.otherDistrict = values.district == 'other' || values.otherDistrict ? values.otherDistrict : null;
        values.otherSchoolName = values.schoolName == 'other' ? values.otherSchoolName : null;
        values.otherSchoolLevel = values.schoolLevel == 'other' ? values.otherSchoolLevel : null;
        values.otherReference = values.reference.includes('other') ? values.otherReference : null;
        if (studentInformationId) {
            values.id = studentInformationId;
        }
        values.routeName = 'createStudentInformation',
            await postAuthRouteAPI(values).then((res) => {
                if (res?.data?.statusCode !== 400) {
                    setModelAfterFillStudentInfo(true);
                }
            }).catch(async (err) => {
                if (err?.response?.status === 401) {
                    await getNewToken().then(async () => {
                        await postAuthRouteAPI(values).then((res) => {
                            if (res?.data?.statusCode !== 400) {
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
                otherSchoolLevel: studentInfoToSet?.otherSchoolLevel,
                examResult: studentInfoToSet?.examResult,
                examDate: dayjs(studentInfoToSet?.examDate, 'YYYY-MM-DD'),
                city: studentInfoToSet?.city,
                otherCity: studentInfoToSet?.otherCity,
                district: studentInfoToSet?.district,
                otherDistrict: studentInfoToSet?.otherDistrict,
                schoolName: studentInfoToSet?.schoolName,
                otherSchoolName: studentInfoToSet?.otherSchoolName,
                parentNumber: studentInfoToSet?.parentNumber,
                reference: JSON.parse(studentInfoToSet?.reference),
                otherReference: studentInfoToSet?.otherReference

            });
            setInputForOtherSchoolName(studentInfoToSet?.otherSchoolName ? true : false);
            setSelectedDistrictOther(studentInfoToSet?.otherDistrict ? true : false);
            setSelectedCityOther(studentInfoToSet?.otherCity ? true : false);
            setInputForOtherLevel(studentInfoToSet?.otherSchoolLevel ? true : false);
            setInputForOtherReferances(studentInfoToSet?.otherReference ? true : false);
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
    const handleOnSelectCity = (value, option) => {
        if (value === 'other') {
            setSelectedCityOther(true);
            setDistrictList([]);
        } else {
            setSelectedCityOther(false);
            const selectedCityCode = (option.cityCode === '001' ? '01' : option.cityCode);
            const filteredDistricts = allDistrictList.filter(dist => dist.cityCode === selectedCityCode && dist.value !== null && dist.label !== null);
            const newDistrictList = [...filteredDistricts, { value: 'other', label: 'أخرى' }];
            if (filteredDistricts.length > 0) {
                setDistrictList(newDistrictList);
                setSelectedDistrictOther(false);
            } else {
                setDistrictList([]);
            }
        }
    }

    const handleOnSelecDistricts = (value, option) => {
        if (value === 'other') {
            setSelectedDistrictOther(true);
            setSelectedCityOther(false);
        } else {
            setSelectedDistrictOther(false);
        }
    }

    const handleOnSchoolNameChange = (value, option) => {
        if (value === 'other') {
            setInputForOtherSchoolName(true);
        } else {
            setInputForOtherSchoolName(false);
        }
    }
    const handleOnSelectReferances = (value, option) => {
        if (value.includes('other')) {
            setInputForOtherReferances(true);
        } else {
            setInputForOtherReferances(false);
        }
    }
    const handlePhoneChange = (event) => {
        const newValue = event.target.value;
        if (newValue.length > 10) {
            return
        } else {
            setPhoneNumber(newValue);
        }
    }
    const validateMobileNumber = (rule, value, callback) => {
        const mobileRegex = /^05\d{8}$/;
        if (!value) {
            setParentNoError('Please input your mobile number!');
            callback('Please input your mobile number!');
        } else if (!mobileRegex.test(value)) {
            setParentNoError('Mobile number should start with 05 and have exactly 10 digits.');
            callback('Mobile number should start with 05 and have exactly 10 digits.');
        } else {
            setParentNoError('');
            callback();
        }
    };

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
                                onSelect={(value, option) => handleOnSelectCity(value, option)}
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
                        {(districtList?.length > 0) &&
                            <>
                                <p className='fontBold py-2' style={{ fontSize: '18px' }}>{studentInformationConst.districtHeading}</p>
                                <FormItem
                                    name={'district'}>
                                    <Select
                                        width={358}
                                        height={46}
                                        placeholder={studentInformationConst.districtPlaceHolder}
                                        OptionData={districtList}
                                        onSelect={(value, option) => handleOnSelecDistricts(value, option)}
                                    />
                                </FormItem>
                            </>
                        }
                        {(selectedCityOther || selectedDistrictOther || (districtList && districtList.length === 0)) &&
                            <>
                                {(!selectedDistrictOther || (studentInformationId && selectedDistrictOther)) && <p className='fontBold py-2' style={{ fontSize: '18px' }}>{studentInformationConst.districtHeading}</p>}
                                <FormItem
                                    name={'otherDistrict'}>
                                    <Input
                                        width={358}
                                        height={46}
                                        placeholder={studentInformationConst.otherDistrictPlaceHolder}
                                    />
                                </FormItem>
                            </>
                        }
                        <p className='fontBold py-2' style={{ fontSize: '18px' }}>{studentInformationConst.schoolNameHeading}</p>
                        <FormItem
                            name={'schoolName'}>
                            <Select
                                width={358}
                                height={46}
                                placeholder={studentInformationConst.schoolNamePlaceHolder}
                                OptionData={schoolNameList}
                                onSelect={(value, option) => handleOnSchoolNameChange(value, option)}
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
                        <p className='fontBold pt-2' style={{ fontSize: '18px' }}>{studentInformationConst.parentNumberHeading}</p>
                        <FormItem
                            className='formInputBox'
                            name={'parentNumber'}>
                            <Input
                                type={'number'}
                                width={358}
                                height={46}
                                value={phoneNumber}
                                placeholder={studentInformationConst.parentNumberPlaceHolder}
                                onChange={event => handlePhoneChange(event)}
                                maxLength={10}
                            />
                        </FormItem>
                        {/* <FormItem
                            overlayClassName="numeric-input"
                            className='formInputBox'
                            name={'parentNumber'}
                            rules={[
                                { required: true, message: 'Please input your mobile number!' },
                                { validator: validateMobileNumber }
                            ]}
                            validateStatus={parentNoError ? 'parentNoError' : ''}
                            help={<h8 style={{ color: 'red' }}> {parentNoError}</h8>}
                        >

                            <Input
                                type={'number'}
                                width={358}
                                height={46}
                                onChange={(e) => setPhoneNumber(e)}
                                value={phoneNumber}
                                placeholder={studentInformationConst.parentNumberPlaceHolder}
                                maxLength={10}
                            />
                        </FormItem> */}
                        <p className='fontBold pb-2' style={{ fontSize: '18px' }}>{studentInformationConst.whereYouFoundAccountHeading}</p>
                        <FormItem
                            name={'reference'}
                        >
                            <Select
                                mode="multiple"
                                maxTagCount='responsive'
                                width={358}
                                height={46}
                                placeholder={studentInformationConst.whereYouFoundAccountPlaceHolder}
                                OptionData={accountFoundFromList}
                                onSelect={(value, option) => handleOnSelectReferances(value, option)}

                            />
                        </FormItem>
                        {inputForOtherReferances &&
                            <>
                                <FormItem
                                    name={'otherReference'}>
                                    <Input
                                        width={358}
                                        height={46}
                                        placeholder={studentInformationConst.whereYouFoundAccountPlaceHolder}
                                    />
                                </FormItem>
                            </>
                        }
                        <div className={styles.saveStudentInfoBtn}>
                            <button className='primarySolidBtn py-2 px-5 mt-5' htmltype='submit' >{studentInformationConst.saveInformation}</button>
                        </div>
                    </div>
                </Form>
                {modelAfterFillStudentInfo &&
                    <ModelAfterFillStudentInfo
                        modelAfterFillStudentInfo={modelAfterFillStudentInfo}
                        setModelAfterFillStudentInfo={setModelAfterFillStudentInfo}
                        courseId={courseId}
                        courseType={courseType}
                    />
                }
            </div>
        </div>
    )
}

export default StudentInformation