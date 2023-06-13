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


const CourseInitial =
{
    courseDetailsMetaData: [{
        text: '',
        link: '',
        textSeprate: '',
        linkToSeprateText: '',
    },],
}

const ExternalCourseCard = ({ createCourseApiRes }) => {

    const storeData = useSelector((state) => state?.globalStore);
    console.log(storeData);

    const [courseDetail, setCourseDetail] = useState('')
    const [iconValue, setIconValue] = useState('')
    const [createdCourceCard, setCreatedCourceCard] = useState()

    useEffect(() => {
        createCourseApiRes.CourseCardMetaData = []
        createCourseApiRes.CourseCardMetaData.push(JSON.parse(JSON.stringify({
            icon: '',
            link: '',
            text: '',
            grayedText: '',
        })))
        setCourseDetail(createCourseApiRes)
    }, [createCourseApiRes])

    const handleAdd = () => {
        let data = { ...courseDetail }
        let obj = {
            icon: '',
            link: '',
            text: '',
            grayedText: '',
        }
        data.CourseCardMetaData.push(JSON.parse(JSON.stringify(obj)))
        console.log(data);
        setCourseDetail(data)
    }

    const handleRemove = (arrayName, id) => {
        if (id == 0) return
        let data = { ...courseDetail }
        data.CourseCardMetaData.splice(id, 1)
        setCourseDetail(data)
    }

    const onFinish = async (values) => {
        console.log(values);
        const arrayOfValues = Object.values(values).map(obj => obj);
        console.log(arrayOfValues);
        let courseCardMetadata = arrayOfValues.map((obj, index) => {
            return {
                order: (`${index + 1}`),
                icon: obj.icon,
                link: obj.link,
                text: obj.text,
                sepratetext: obj.sepratetext,
                separatetextlink: obj.separatetextlink,
                graytext: obj.graytext,
            }
        })
        const cardDescription = arrayOfValues[arrayOfValues.length - 1]
        courseCardMetadata.splice(courseCardMetadata.length - 1, 1)
        let body = {
            data: {
                data: courseCardMetadata,
                courseId: courseDetail.id,
                cardDescription: cardDescription
            },
            accessToken: storeData?.accessToken
        }
        console.log(body);
        // await createCourseCardMetaDataAPI(body).then((res) => {
        //     setCreatedCourceCard(res.data)
        // })
        // console.log(res);
    };

    const handleCourseDetailDiscription = (e, fieldname, arrayName, index) => {
        let data = { ...courseDetail }
        console.log(e, index);
        console.log(data);
        if (arrayName == null) {
            data[fieldname] = e
        } else {
            console.log(e, fieldname);
            // if (fieldname == 'icon') {
            data.CourseCardMetaData[index][fieldname] = e
            // }
        }
        console.log(data);
        setCourseDetail(data)
    }

    return (

        <div style={{ display: 'flex' }}>
            <div className='px-6'>
                <Form onFinish={onFinish} >
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
                        <div className='w-[870px]'>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <p className={styles.secDetails}>تفاصيل ثانية</p>
                                <p className={styles.addDetails} onClick={() => handleAdd('courseDetailsMetaData')} >+ إضافة</p>
                            </div>
                            {courseDetail && courseDetail?.CourseCardMetaData?.map((field, index) => (
                                <div className={styles.courseDetails} key={`courseDetailsMetaData${index}`}>
                                    <div style={{ margin: '10px' }} >
                                        <div className='flex justify-center items-center h-100'>  <AllIconsComponenet iconName={'updownarrow'} height={27} width={27} color={'#FFCD3C'}
                                        ></AllIconsComponenet></div>
                                    </div>

                                    <div className='flex flex-wrap w-[95%]'>
                                        <FormItem
                                            name={[index, 'icon']}
                                            rules={[{ required: true }]} >
                                            <SelectIcon
                                                value={iconValue}
                                                width={68}
                                                height={47}
                                                setIconValue={setIconValue}
                                                onChange={(e) => handleCourseDetailDiscription(e, "icon", 'CourseCardMetaData', index)}
                                            />
                                        </FormItem>
                                        <FormItem
                                            name={[index, 'text']}
                                            rules={[{ required: true }]} >
                                            <Input
                                                height={47}
                                                width={216}
                                                placeholder="النص"
                                                value={field.text}
                                                onChange={(e) => handleCourseDetailDiscription(e.target.value, "text", 'CourseCardMetaData', index)}
                                            />
                                        </FormItem>
                                        <FormItem
                                            name={[index, 'link']}
                                            rules={[{ required: true }]} >
                                            <Input
                                                height={47}
                                                width={216}
                                                placeholder="رابط"
                                                value={field.link}
                                                onChange={(e) => handleCourseDetailDiscription(e.target.value, "link", 'CourseCardMetaData', index)}
                                            />
                                        </FormItem>
                                        <FormItem
                                            name={[index, 'tailLinkName']}
                                            rules={[{ required: true }]} >
                                            <Input
                                                height={47}
                                                width={216}
                                                placeholder="نص منفصل"
                                                value={field.tailLinkName}
                                            />
                                        </FormItem>
                                        <FormItem
                                            name={[index, 'tailLink']}
                                            rules={[{ required: true }]} >
                                            <Input
                                                height={47}
                                                width={292}
                                                placeholder="رابط للنص المنفصل"
                                                value={field.tailLink} />
                                        </FormItem>
                                        <FormItem
                                            name={[index, 'grayedText']}
                                            rules={[{ required: true }]} >
                                            <Input
                                                height={47}
                                                width={216}
                                                placeholder="النص الرمادي"
                                                value={field.grayedText}
                                                onChange={(e) => handleCourseDetailDiscription(e.target.value, "grayedText", 'CourseCardMetaData', index)}
                                            />
                                        </FormItem>
                                    </div>
                                    <div className={styles.DeleteIconWrapper} >
                                        <div className='flex justify-center items-center h-100' onClick={() => handleRemove("courseDetailsMetaData", index)}>  <AllIconsComponenet iconName={'deletecourse'} height={700} width={700} color={'#FFCD3C'} ></AllIconsComponenet></div>
                                    </div>
                                </div>
                            ))}
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