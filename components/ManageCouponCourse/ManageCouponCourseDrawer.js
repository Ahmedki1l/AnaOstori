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

// New constant for discount modes
const discountModes = [
    { label: 'نسبة', value: 'نسبة' },
    { label: 'قيمة', value: 'قيمة' },
];

const ManageCouponCourseDrawer = ({ selectedCoupon, category, getCouponList, setDrawerForCouponCourse }) => {

    const [couponCourseForm] = Form.useForm()
    const [showBtnLoader, setShowBtnLoader] = useState(false)
    const [selectedCouponType, setSelectedCouponType] = useState()
    const [selectedCourse, setSelectedCourse] = useState()
    const [selectedDiscountMode, setSelectedDiscountMode] = useState('نسبة');
    // ^ tracks whether we are using "percentage" or "amount"

    /**
     * Build an array of { value: courseId, label: courseName, price: coursePrice }
     * from the nested category/courses data.  This example assumes each course
     * has a price field (course.price). Modify as needed.
     */
    const courseOptions = category.flatMap((cat) =>
        cat.courses.map((subItem) => ({
            value: subItem.id,
            label: subItem.name,
            price: subItem.price, // be sure that the course object includes "price"
        }))
    );

    useEffect(() => {
        couponCourseForm.setFieldsValue({
            expires: selectedCoupon?.expires ? dayjs(selectedCoupon?.expires, 'YYYY-MM-DD') : undefined,
            name: selectedCoupon?.name,
            couponCode: selectedCoupon?.couponCode,
            percentage: selectedCoupon?.percentage,
            type: selectedCoupon?.type,
            limit: selectedCoupon?.limit,
            discountMode: 'نسبة',
            courseIds: selectedCoupon?.couponCourses.map((item) => { return item.course.id }),
        })
        setSelectedCourse(selectedCoupon?.couponCourses.map((item) => {
            return item.course.id
        }))
        setSelectedCouponType(selectedCoupon?.type)
    }, [selectedCoupon, couponCourseForm])

    const handleSelectDiscountModeChange = (value) => {
        setSelectedDiscountMode(value);
    };

    const handleSaveCouponDetails = async (values) => {
        setShowBtnLoader(true)
        values.expires = dayjs(values?.expires?.$d).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        values.global = true
        values.id = selectedCoupon?.id

        // If user selected 'amount', convert the entered "percentage" field 
        // to an actual fixed amount (or vice versa, whichever you prefer).
        // In the snippet below, let's say we repurpose "percentage" field in the Form 
        // to store the numeric discount. We'll rename it to avoid confusion:
        let discountValue = values.percentage; // rename this in your form to "discountValue" for clarity

        if (values.discountMode === 'قيمة') {
            // If you only allow 1 course for "amount"
            if (selectedCourse.length > 1) {
                setShowBtnLoader(false);
                toast.error("Cannot use 'Amount' discount for multiple courses. Select only 1 course.");
                return;
            }
            // Find the selected course and its price
            const selectedCourseObj = courseOptions.find(
                (course) => course.value === selectedCourse[0]
            );
            if (!selectedCourseObj || !selectedCourseObj.price) {
                setShowBtnLoader(false);
                toast.error("Selected course does not have a valid price!");
                return;
            }

            // Convert "discountValue" to percentage
            // (Example formula: discountValue / coursePrice * 100)
            const { price } = selectedCourseObj;
            let convertedPercentage = (discountValue / price) * 100;

            // If your schema strictly wants a number 0-100 in "percentage"
            values.percentage = +convertedPercentage.toFixed(2);

            // Optionally clamp the discount if > 100%
            if (values.percentage > 100) {
                values.percentage = 100;
            }
        }

        // Remove discountMode from the values object
        delete values.discountMode;

        // else if 'percentage', we keep it as is
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
                {/* Choose Discount Mode (Percentage or Amount) */}
                <p className="fontMedium py-2" style={{ fontSize: '18px' }}>
                    اختر طريقة الخصم
                </p>
                <FormItem
                    name="discountMode"
                    initialValue="نسبة"
                    rules={[{ required: true, message: 'إختر نوع الخصم' }]}
                >
                    <Select
                        width={425}
                        height={47}
                        fontSize={16}
                        OptionData={discountModes}
                        onChange={handleSelectDiscountModeChange}
                    />
                </FormItem>

                {/* If discountMode = 'percentage', show percentage input; else show amount input */}
                {selectedDiscountMode === 'percentage' ? (
                    <>
                        <p className="fontMedium py-2" style={{ fontSize: '18px' }}>
                            {manageCouponConst.couponPercantageHead}
                        </p>
                        <FormItem
                            name="percentage"
                            rules={[
                                { required: true, message: manageCouponConst.couponPercantageError },
                                {
                                    validator: (_, val) => {
                                        if (val && val > 100) {
                                            return Promise.reject('Percentage cannot exceed 100');
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input
                                width={425}
                                height={47}
                                fontSize={16}
                                placeholder={manageCouponConst.couponPercantagePlaceHolder}
                                type="number"
                                maxValue={100}
                            />
                        </FormItem>
                    </>
                ) : (
                    <>
                        <p className="fontMedium py-2" style={{ fontSize: '18px' }}>
                            {manageCouponConst.couponAmountHead}
                        </p>
                        <FormItem
                            name="percentage"
                            // rename to "discountValue" in your form if you prefer
                            rules={[
                                { required: true, message: manageCouponConst.couponAmountError },
                                {
                                    validator: (_, val) => {
                                        if (val && val < 0) {
                                            return Promise.reject('Amount cannot be negative');
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input
                                width={425}
                                height={47}
                                fontSize={16}
                                placeholder={manageCouponConst.couponAmountPlaceHolder}
                                type="number"
                            />
                        </FormItem>
                    </>
                )}

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