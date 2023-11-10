import React, { useEffect, useState } from 'react'
import { Form, FormItem } from '../antDesignCompo/FormItem';
import Select from '../antDesignCompo/Select';
import Input from '../../components/antDesignCompo/Input'
import CustomButton from '../CommonComponents/CustomButton';
import { couponTypes, manageCouponConst } from '../../constants/adminPanelConst/couponConst/couponConst';
import { postRouteAPI } from '../../services/apisService';
import DatePicker from '../antDesignCompo/Datepicker';
import dayjs from 'dayjs';
import styles from '../../styles/InstructorPanelStyleSheets/ManageCouponCourse.module.scss'
import { toast } from 'react-toastify';

const ManageCouponCourseDrawer = ({ selectedCoupon, category, getCouponList, setDrawerForCouponCourse }) => {

    const [couponCourseForm] = Form.useForm()
    const [showBtnLoader, setShowBtnLoader] = useState(false)
    const [selectedCouponType, setSelectedCouponType] = useState()
    const [selectedCourse, setSelectedCourse] = useState()

    useEffect(() => {
        couponCourseForm.setFieldsValue({
            expires: selectedCoupon?.expires ? dayjs(selectedCoupon?.expires, 'YYYY-MM-DD') : undefined,
            name: selectedCoupon?.name,
            couponCode: selectedCoupon?.couponCode,
            percentage: selectedCoupon?.percentage,
            type: selectedCoupon?.type,
            limit: selectedCoupon?.limit,
            courseIds: selectedCoupon?.couponCourses.map((item) => { return item.course.id }),
        })
        setSelectedCourse(selectedCoupon?.couponCourses.map((item) => {
            return item.course.id
        }))
        setSelectedCouponType(selectedCoupon?.type)
    }, [])

    const handleSaveCouponDetails = async (values) => {
        setShowBtnLoader(true)
        values.expires = dayjs(values?.expires?.$d).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        values.global = true
        values.id = selectedCoupon?.id
        let data = {
            routeName: selectedCoupon?.id ? "updateCoupon" : "createCoupon",
            ...values
        }
        await postRouteAPI(data).then((res) => {
            setShowBtnLoader(false)
            toast.success(selectedCoupon?.id ? manageCouponConst.couponUpdateSuccessMsg : manageCouponConst.couponCreateSuccessMsg)
            setDrawerForCouponCourse(false)
            couponCourseForm.resetFields()
            getCouponList()
        }).catch((err) => {
            console.log(err);
            setShowBtnLoader(false)
        })
    }
    const handleSelectCouponChange = (value) => {
        setSelectedCouponType(value);
    }
    const course = category.flatMap((item) => {
        return item.courses.map((subItem) => {
            return { value: subItem.id, label: subItem.name };
        });
    });
    const handleSelectCourse = (value) => {
        setSelectedCourse(value);
    }


    return (
        <div >
            <Form form={couponCourseForm} onFinish={handleSaveCouponDetails}>
                <p className='fontMedium py-2' style={{ fontSize: '18px' }}>{manageCouponConst.couponNameHead}</p>
                <FormItem
                    name={'name'}
                    rules={[{ required: true, message: manageCouponConst.couponNameError }]}
                >
                    <Input
                        width={425}
                        height={47}
                        fontSize={16}
                        placeholder={manageCouponConst.couponNamePlaceHolder}
                    />
                </FormItem>
                <p className='fontMedium py-2' style={{ fontSize: '18px' }}>{manageCouponConst.couponCodeHead}</p>
                <FormItem
                    name={'couponCode'}
                    rules={[{ required: true, message: manageCouponConst.couponCodeError }]}
                >
                    <Input
                        width={425}
                        height={47}
                        fontSize={16}
                        placeholder={manageCouponConst.couponCodePlaceHolder}
                    />
                </FormItem>
                <p className='fontMedium py-2' style={{ fontSize: '18px' }}>{manageCouponConst.couponPercantageHead}</p>
                <FormItem
                    name={'percentage'}
                    rules={[{ required: true, message: manageCouponConst.couponPercantageError }]}
                >
                    <Input
                        width={425}
                        height={47}
                        fontSize={16}
                        placeholder={manageCouponConst.couponPercantagePlaceHolder}
                        type={'number'}
                        maxValue={100}
                    />
                </FormItem>
                <p className='fontMedium py-2' style={{ fontSize: '18px' }}>{manageCouponConst.couponDiscountType}</p>
                <FormItem
                    name={'type'}
                    rules={[{ required: true, message: manageCouponConst.couponDiscountTypeError }]}
                >
                    <Select
                        width={425}
                        height={47}
                        fontSize={16}
                        placeholder={manageCouponConst.couponDiscountTypePlaceHolder}
                        OptionData={couponTypes}
                        onChange={handleSelectCouponChange}
                    />
                </FormItem>
                {selectedCouponType == 'limited' &&
                    <>
                        <p className='fontMedium py-2' style={{ fontSize: '18px' }}>{manageCouponConst.couponLimitHead}</p>
                        <FormItem
                            name={'limit'}
                            rules={[{ required: true, message: manageCouponConst.couponLimitError }]}
                        >
                            <Input
                                width={425}
                                height={47}
                                fontSize={16}
                                placeholder={manageCouponConst.couponLimitPlaceHolder}
                            />
                        </FormItem>
                    </>
                }
                <p className='fontMedium py-2' style={{ fontSize: '18px' }}>{manageCouponConst.couponExpiryDate}</p>
                <FormItem
                    name={'expires'}
                    rules={[{ required: true, message: manageCouponConst.couponExpiryDateError }]}
                >
                    <>
                        <DatePicker
                            format={'YYYY-MM-DD'}
                            width={425}
                            height={40}
                            fontSize={16}
                            placeholder={manageCouponConst.couponExpiryDatePlaceHolder}
                            suFFixIconName="calander"
                        />
                    </>
                </FormItem>
                <p className='fontMedium py-2' style={{ fontSize: '18px' }}>{manageCouponConst.couponAppliedCourseHead}</p>
                <FormItem
                    name={'courseIds'}
                    rules={[{ required: true, message: manageCouponConst.couponAppliedCourseError }]}
                >
                    <Select
                        width={425}
                        height={47}
                        fontSize={16}
                        placeholder={manageCouponConst.couponAppliedCoursePlaceHolder}
                        OptionData={course}
                        mode='multiple'
                        maxTagCount='responsive'
                        onChange={handleSelectCourse}
                        defaultValue={selectedCoupon?.couponCourses.map((item) => {
                            return item.course.id
                        })}
                    />
                </FormItem>
                <div className={styles.courseNames}>
                    {
                        course.filter((item) => selectedCourse?.includes(item.value)).map((item, index) => {
                            return <p style={{ fontSize: '16px' }} key={item?.value}>{item?.label}</p>
                        })
                    }
                </div>
                <div className={styles.couponBtnBox}>
                    <CustomButton
                        btnText={selectedCoupon ? manageCouponConst.saveBtnText : manageCouponConst.addBtnText}
                        height={37}
                        showLoader={showBtnLoader}
                        fontSize={16}
                    />
                </div>
            </Form>
        </div>
    )
}

export default ManageCouponCourseDrawer