import { Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { FormItem } from '../antDesignCompo/FormItem';
import Select from '../antDesignCompo/Select';
import Input from '../../components/antDesignCompo/Input'
import CustomButton from '../CommonComponents/CustomButton';
import { couponTypes } from '../../constants/adminPanelConst/couponConst/couponConst';
import { routeAPI } from '../../services/apisService';
import DatePicker from '../antDesignCompo/Datepicker';
import dayjs from 'dayjs';
import styles from '../../styles/InstructorPanelStyleSheets/ManageCouponCourse.module.scss'

const ManageCouponCourseDrawer = ({ selectedCoupon, category }) => {

    const [couponCourseForm] = Form.useForm()
    const [showBtnLoader, setShowBtnLoader] = useState(false)
    const [selectedCouponType, setSelectedCouponType] = useState()
    const [selectedCourse, setSelectedCourse] = useState()
    console.log(couponTypes);
    useEffect(() => {
        couponCourseForm.setFieldsValue({
            expires: selectedCoupon?.expires ? dayjs(selectedCoupon?.expires, 'YYYY-MM-DD') : undefined,
            name: selectedCoupon?.name,
            couponCode: selectedCoupon?.couponCode,
            percentage: selectedCoupon?.percentage,
            type: selectedCoupon?.type,
            limit: selectedCoupon?.limit,
            courseIds: selectedCoupon?.courseIds,
        }
        )
    }, [])

    const handleSaveCouponDetails = async (values) => {
        setShowBtnLoader(true)
        values.expires = dayjs(values?.expires?.$d).format('YYYY-MM-DD HH:mm:ss');
        values.global = true
        let body = {
            routeName: "createCoupon",
            ...values
        }
        await routeAPI(body).then((res) => {
            setShowBtnLoader(false)
        }).catch((err) => {
            console.log(err);
            setShowBtnLoader(false)
        })
    }
    const handleSelectCouponChange = (value) => {
        setSelectedCouponType(value);
    }

    const multipleCourse = category.map((item, index) => {
        return item.courses.map((subItem, index) => {
            return { value: subItem.id, label: subItem.name }
        })
    })

    const course = multipleCourse.flat().map((course, index) => {
        return course
    })
    const handleSelectCourse = (value) => {
        setSelectedCourse(value);
    }
    const selectedCourseName = course.filter((item) => {
        return selectedCourse?.includes(item.value)
    })
    const courseName = selectedCourseName.map((item, index) => {
        return item.label
    })

    return (
        <div>
            <Form form={couponCourseForm} onFinish={handleSaveCouponDetails}>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>عنوان الكوبون*</p>
                <FormItem
                    name={'name'}>
                    <Input
                        width={425}
                        height={47}
                        placeholder='حالة الحجز'
                    />
                </FormItem>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>الكود*</p>
                <FormItem
                    name={'couponCode'}>
                    <Input
                        width={425}
                        height={47}
                        placeholder='coupon code'
                    />
                </FormItem>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>نسبة الخصم*</p>
                <FormItem
                    name={'percentage'}>
                    <Input
                        width={425}
                        height={47}
                        placeholder='Number%'
                    />
                </FormItem>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>نوع الخصم*</p>
                <FormItem
                    name={'type'}>
                    <Select
                        width={425}
                        height={47}
                        placeholder='coupon Type'
                        OptionData={couponTypes}
                        onChange={handleSelectCouponChange}
                    />
                </FormItem>

                {selectedCouponType == 'limited' &&
                    <>
                        <p className='fontBold py-2' style={{ fontSize: '18px' }}>number</p>
                        <FormItem
                            name={'limit'}>
                            <Input
                                width={425}
                                height={47}
                                placeholder='number'
                            />
                        </FormItem>
                    </>}

                <p className='fontBold py-2' style={{ fontSize: '18px' }}>تاريخ الانتهاء*</p>
                <FormItem
                    name={'expires'}
                    rules={[{ required: true, message: "ادخل ساعة البداية " }]}
                >
                    <DatePicker
                        format={'YYYY-MM-DD'}
                        width={425}
                        height={40}
                        placeholder="تاريخ النهاية"
                        suFFixIconName="calander"
                    />
                </FormItem>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>تطبق على هذه الدورات*</p>
                <FormItem
                    name={'courseIds'}>
                    <Select
                        width={425}
                        height={47}
                        placeholder='SelectCoursesAsMulti'
                        OptionData={course}
                        mode='multiple'
                        maxTagCount='responsive'
                        onChange={handleSelectCourse}
                    />
                </FormItem>
                <FormItem
                    name={'couponCourses'}
                >
                    <div className={styles.courseNames}>
                        {courseName.map((item, index) => {
                            return <p key={`courseName${index}`}>{item}</p>
                        })}
                    </div>
                </FormItem>

                <div className='pt-5'>
                    <CustomButton
                        btnText='حفظ'
                        height={37}
                        showLoader={showBtnLoader}
                        fontSize={16}
                    />
                </div>
            </Form>
        </div >
    )
}

export default ManageCouponCourseDrawer