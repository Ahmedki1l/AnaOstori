import React, { useEffect, useState } from 'react'
import styles from './ExternalCourseCard.module.scss'
import { FormItem } from '../../antDesignCompo/FormItem';
import InputTextArea from '../../antDesignCompo/InputTextArea';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { Form } from 'antd';
import Input from '../../antDesignCompo/Input';
import PhysicalCourseCard from '../../TypesOfCourseComponents/PhysicalCourseCard';
import SelectIcon from '../../antDesignCompo/SelectIcon';
import { useDispatch, useSelector } from 'react-redux';
import { createCourseCardMetaDataAPI, deleteCourseTypeAPI, updateCourseCardMetaDataAPI } from '../../../services/apisService'
import { updateCourseDetailsAPI } from '../../../services/apisService';
import Image from 'next/image';
import loader from '../../../public/icons/loader.svg'
import { deleteNullFromObj } from '../../../constants/DataManupulation';



const ExternalCourseCard = ({ createCourseApiRes, setSelectedItem }) => {

    const storeData = useSelector((state) => state?.globalStore);
    const isCourseEdit = storeData?.isCourseEdit;
    const editCourseData = storeData?.editCourseData;
    const [courseDetail, setCourseDetail] = useState(isCourseEdit ? editCourseData : createCourseApiRes)
    const [showLoader, setShowLoader] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    console.log(isCourseEdit);

    useEffect(() => {
        if (!isCourseEdit) {
            setCourseCardMetaDataObj()
        } else {
            form.setFieldsValue(editCourseData)
        }
    }, [])

    const setCourseCardMetaDataObj = () => {
        let data = { ...courseDetail }

        if (data.CourseCardMetaData == undefined) {
            data.CourseCardMetaData = []
        }
        data.CourseCardMetaData.push(JSON.parse(JSON.stringify({
            icon: '',
            link: '',
            text: '',
            tailLinkName: '',
            tailLink: '',
            grayedText: '',
        })))
        setCourseDetail(data)
    }

    const onFinish = (values) => {
        setShowLoader(true)
        if (isCourseEdit) {
            editCourseCardMetaData(values)
        } else {
            createCourseCardMetaData(values)
        }
    };

    const createCourseCardMetaData = async (values) => {
        console.log(values);
        const cardDescription = values.cardDescription
        let courseCardMetadata = values.CourseCardMetaData.map((obj, index) => {
            return {
                order: (`${index + 1}`),
                icon: obj.icon,
                link: obj.link,
                text: obj.text,
                tailLinkName: obj.tailLinkName,
                tailLink: obj.tailLink,
                grayedText: obj.grayedText,
            }
        })
        let body = {
            data: {
                data: courseCardMetadata,
                courseId: courseDetail.id,
            },
            accessToken: storeData?.accessToken
        }
        let body2 = {
            data: {
                cardDescription: cardDescription,
                type: courseDetail.type
            },
            accessToken: storeData?.accessToken,
            courseId: courseDetail.id
        }
        console.log(body);
        try {
            const createCourseCardMetaDataReq = createCourseCardMetaDataAPI(body)
            const updateCardDiscriptionReq = updateCourseDetailsAPI(body2)
            const [createCourseCardMetaData, updateCardDiscription] = await Promise.all[createCourseCardMetaDataReq, updateCardDiscriptionReq]
            setShowLoader(false)
            setSelectedItem(3)
            form.resetFields()
        } catch (error) {
            setShowLoader(false)
            console.log(error);
            if (error?.response?.status == 401) {
                signOutUser()
                dispatch({
                    type: 'EMPTY_STORE'
                });
            }
        }
    }

    const editCourseCardMetaData = async (values) => {
        console.log(values);
        const cardDescription = values.cardDescription

        let CourseCardMetaData = values.CourseCardMetaData.map((obj, index) => {
            delete obj.createdAt
            delete obj.updatedAt
            obj.order = `${index + 1}`
            obj.courseId = editCourseData.id
            deleteNullFromObj(obj)
            return obj
        })
        let body = {
            data: {
                data: CourseCardMetaData,
            },
            accessToken: storeData?.accessToken
        }
        let body2 = {
            data: {
                cardDescription: cardDescription,
                type: courseDetail.type
            },
            accessToken: storeData?.accessToken,
            courseId: courseDetail.id
        }
        try {
            const updateCourseCardMetaDataReq = updateCourseCardMetaDataAPI(body)
            const updateCardDiscriptionReq = updateCourseDetailsAPI(body2)

            const [updateCourseCardMetaData, updateCardDiscription] = await Promise.all([updateCourseCardMetaDataReq, updateCardDiscriptionReq])
            dispatch({ type: 'SET_EDIT_COURSE_DATA', editCourseData: updateCourseCardMetaData.data })
            setShowLoader(false)
        } catch (error) {
            setShowLoader(false)
            console.log(error);
            if (error?.response?.status == 401) {
                signOutUser()
                dispatch({
                    type: 'EMPTY_STORE'
                });
            }
        }
    }

    const deleteCourseDetails = async (index, remove, name) => {
        let data = { ...courseDetail }
        console.log(data.CourseCardMetaData[index].id);
        if (data.CourseCardMetaData[index].id == undefined) {
            remove(name)
        } else {
            let body = {
                data: {
                    type: 'courseCard',
                    courseId: editCourseData.id,
                    id: data.CourseCardMetaData[index].id
                },
                accessToken: storeData?.accessToken
            }

            await deleteCourseTypeAPI(body).then((res) => {
                data.CourseCardMetaData.splice(index, 1)
                setCourseDetail(data)
                remove(name)
                dispatch({ type: 'SET_EDIT_COURSE_DATA', editCourseData: res.data })
                setShowLoader(false)
                console.log(res);
            }).catch((error) => {
                setShowLoader(false)
                console.log(error);
            })
        }
    }

    const handleCourseDetailDiscription = (e, fieldname, arrayName, index) => {
        let data = { ...courseDetail }
        if (arrayName == null) {
            data[fieldname] = e
        } else {
            data.CourseCardMetaData[index][fieldname] = e
        }
        setCourseDetail(data)
    }

    return (

        <div style={{ display: 'flex' }}>
            <div className='px-6'>
                <Form form={form} onFinish={onFinish}>
                    <div className={styles.cardmetaDataForm}>
                        <FormItem
                            name="cardDescription"
                            rules={[{ required: true }]}>
                            <InputTextArea
                                height={142}
                                width={549}
                                placeholder="وصف الدورة"
                                onChange={(e) => handleCourseDetailDiscription(e.target.value, "cardDescription", null, null)}
                            />
                        </FormItem>
                        <div className='w-[872px]'>
                            <div>
                                <Form.List name="CourseCardMetaData" initialValue={[{}]}>
                                    {(field, { add, remove }) => (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                                                <p className={styles.secDetails}>تفاصيل ثانية</p>
                                                <p className={styles.addDetails} onClick={() => { add(), setCourseCardMetaDataObj() }} >+ إضافة</p>
                                            </div>
                                            {field.map(({ name, key }, index) => (
                                                <div className={styles.courseDetails} key={key}>
                                                    <FormItem>
                                                        <div style={{ margin: '10px' }} >
                                                            <div className='flex justify-center items-center h-100'><AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#FFCD3C'} /></div>
                                                        </div>
                                                    </FormItem>
                                                    <div className='flex flex-wrap w-[95%]'>
                                                        <FormItem
                                                            name={[name, 'icon']}
                                                            rules={[{ required: true, message: 'Please Select Icon' }]} >
                                                            <SelectIcon
                                                                onChange={(e) => handleCourseDetailDiscription(e, "icon", 'CourseCardMetaData', index)}
                                                            />
                                                        </FormItem>
                                                        <FormItem
                                                            name={[name, 'text']}
                                                            rules={[{ required: true, message: 'Please Enter Text' }]} >
                                                            <Input
                                                                height={47}
                                                                width={216}
                                                                placeholder="النص"
                                                                value={field.text}
                                                                onChange={(e) => handleCourseDetailDiscription(e.target.value, "text", 'CourseCardMetaData', index)}
                                                            />
                                                        </FormItem>
                                                        <FormItem
                                                            name={[name, 'link']}>
                                                            <Input
                                                                height={47}
                                                                width={216}
                                                                placeholder="رابط"
                                                                value={field.link}
                                                                onChange={(e) => handleCourseDetailDiscription(e.target.value, "link", 'CourseCardMetaData', index)}
                                                            />
                                                        </FormItem>
                                                        <FormItem
                                                            name={[name, 'tailLinkName']} >
                                                            <Input
                                                                height={47}
                                                                width={216}
                                                                placeholder="نص منفصل"
                                                                value={field.tailLinkName}
                                                                onChange={(e) => handleCourseDetailDiscription(e.target.value, "tailLinkName", 'CourseCardMetaData', index)}
                                                            />
                                                        </FormItem>
                                                        <FormItem
                                                            name={[name, 'tailLink']}
                                                            rules={[{ required: field?.tailLinkName ? true : false, message: 'Please Enter TailLink' }]} >
                                                            <Input
                                                                height={47}
                                                                width={292}
                                                                placeholder="رابط للنص المنفصل"
                                                                value={field.tailLink}
                                                                onChange={(e) => handleCourseDetailDiscription(e.target.value, "tailLink", 'CourseCardMetaData', index)}
                                                            />
                                                        </FormItem>
                                                        <FormItem
                                                            name={[name, 'grayedText']}>
                                                            <Input
                                                                height={47}
                                                                width={216}
                                                                placeholder="النص الرمادي"
                                                                value={field.grayedText}
                                                                onChange={(e) => handleCourseDetailDiscription(e.target.value, "grayedText", 'CourseCardMetaData', index)}
                                                            />
                                                        </FormItem>
                                                    </div>
                                                    <div className={styles.DeleteIconWrapper}>
                                                        <div className='flex justify-center items-center h-100'
                                                            onClick={() => {
                                                                if (courseDetail.CourseCardMetaData.length - 1 == 0) return
                                                                deleteCourseDetails(index, remove, name)
                                                            }}
                                                        >
                                                            <AllIconsComponenet iconName={'deletecourse'} height={700} width={700} color={'#FFCD3C'} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </Form.List>
                            </div>

                            <FormItem>
                                <div className={styles.saveCourseBtnBox}>
                                    <button className='primarySolidBtn flex items-center' htmltype='submit' disabled={showLoader}>{showLoader ? <Image src={loader} width={30} height={30} alt={'loader'} /> : ""}حفظ</button>
                                </div>
                            </FormItem>
                        </div>
                    </div >
                </Form >
            </div >
            <div>
                <PhysicalCourseCard courseDetails={courseDetail} />
            </div>
        </div >
    )
}
export default ExternalCourseCard;



