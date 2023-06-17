import React, { useEffect, useState } from 'react'
import styles from './ExternalCourseCard.module.scss'
import { FormItem } from '../../antDesignCompo/FormItem';
import InputTextArea from '../../antDesignCompo/InputTextArea';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import { Form } from 'antd';
import Input from '../../antDesignCompo/Input';
import PhysicalCourseCard from '../../TypesOfCourseComponents/PhysicalCourseCard';
import SelectIcon from '../../antDesignCompo/SelectIcon';
import { useSelector } from 'react-redux';
import { createCourseCardMetaDataAPI } from '../../../services/apisService'


const ExternalCourseCard = ({ createCourseApiRes, setSelectedItem }) => {

    const storeData = useSelector((state) => state?.globalStore);
    const isCourseEdit = storeData?.isCourseEdit;
    const editCourseData = storeData?.editCourseData;
    const [courseDetail, setCourseDetail] = useState(createCourseApiRes)
    const [form] = Form.useForm();

    useEffect(() => {
        setCourseCardMetaDataObj()
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

    const deleteCourseDetails = (index) => {
        let data = { ...courseDetail }
        if (index == 0) return
        data.CourseCardMetaData.splice(index, 1)
        setCourseDetail(data)
    }

    const onFinish = async (values) => {
        // const cardDescription = values.cardDescription
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
                // cardDescription: cardDescription
            },
            accessToken: storeData?.accessToken
        }
        await createCourseCardMetaDataAPI(body).then((res) => {
            setSelectedItem(3)
            form.resetFields()
        }).catch((error) => {
            console.log(error);
        })
    };

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
                                                                if (index == 0) return
                                                                remove(name), deleteCourseDetails(index)
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
                                    <button className='primarySolidBtn' htmltype='submit' >حفظ</button>
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



