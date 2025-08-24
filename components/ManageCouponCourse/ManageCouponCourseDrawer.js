import React, { useEffect, useState } from 'react'
import { Form, FormItem } from '../antDesignCompo/FormItem';
import Select from '../antDesignCompo/Select';
import Input from '../../components/antDesignCompo/Input'
import CustomButton from '../CommonComponents/CustomButton';
import { couponTypes, discountModes, manageCouponConst } from '../../constants/adminPanelConst/couponConst/couponConst';
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
    const [selectedDiscountMode, setSelectedDiscountMode] = useState('percentage');
    // ^ tracks whether we are using "percentage" or "fixedAmount"

    /**
     * Build an array of { value: courseId, label: courseName, price: coursePrice }
     * from the nested category/courses data.  This example assumes each course
     * has a price field (course.price). Modify as needed.
     */
    const courseOptions = category.flatMap((cat) =>
        cat.courses.map((subItem) => ({
            value: subItem.id,
            label: subItem.name,
            price: subItem.discount, // be sure that the course object includes "price"
        }))
    );

    useEffect(() => {
        // Determine discount mode from existing coupon data
        let discountMode = 'percentage';
        if (selectedCoupon?.discountMode) {
            discountMode = selectedCoupon.discountMode;
        } else if (selectedCoupon?.fixedAmount) {
            discountMode = 'fixedAmount';
        }
        
        const courseIds = selectedCoupon?.couponCourses.map((item) => {
            return item.course.id
        }) || [];
        
        couponCourseForm.setFieldsValue({
            expires: selectedCoupon?.expires ? dayjs(selectedCoupon?.expires, 'YYYY-MM-DD') : undefined,
            name: selectedCoupon?.name,
            couponCode: selectedCoupon?.couponCode,
            percentage: selectedCoupon?.percentage,
            fixedAmount: selectedCoupon?.fixedAmount,
            type: selectedCoupon?.type,
            limit: selectedCoupon?.limit,
            discountMode: discountMode,
            courseIds: courseIds,
        })
        
        setSelectedCourse(courseIds);
        
        // Ensure fixed amount coupons only have one course
        if (discountMode === 'fixedAmount' && courseIds.length > 1) {
            const singleCourse = [courseIds[0]];
            setSelectedCourse(singleCourse);
            couponCourseForm.setFieldsValue({ courseIds: singleCourse });
        }
        setSelectedCouponType(selectedCoupon?.type)
        setSelectedDiscountMode(discountMode)
    }, [selectedCoupon, couponCourseForm])

    const handleSelectDiscountModeChange = (value) => {
        setSelectedDiscountMode(value);
        // Clear the other field when switching modes
        if (value === 'percentage') {
            couponCourseForm.setFieldsValue({ fixedAmount: null });
        } else {
            couponCourseForm.setFieldsValue({ percentage: null });
            // If switching to fixed amount and multiple courses are selected, keep only one
            if (selectedCourse && selectedCourse.length > 1) {
                const singleCourse = [selectedCourse[0]];
                setSelectedCourse(singleCourse);
                couponCourseForm.setFieldsValue({ courseIds: singleCourse });
                toast.info("تم الاحتفاظ بالدورة الأولى فقط للكوبونات بقيمة ثابتة");
            }
        }
    };

    const handleSaveCouponDetails = async (values) => {
        setShowBtnLoader(true)
        values.expires = dayjs(values?.expires?.$d).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        values.global = true
        values.id = selectedCoupon?.id

        // Handle different discount modes properly
        if (values.discountMode === 'fixedAmount') {
            // For fixed amount, validate single course selection
            if (!selectedCourse || selectedCourse.length === 0) {
                setShowBtnLoader(false);
                toast.error("يجب اختيار دورة واحدة على الأقل للكوبونات بقيمة ثابتة");
                return;
            }
            if (selectedCourse.length > 1) {
                setShowBtnLoader(false);
                toast.error("لا يمكن استخدام خصم بقيمة ثابتة لدورات متعددة. اختر دورة واحدة فقط.");
                return;
            }
            
            // For fixed amount, percentage field is not used, fixedAmount field is already set
            // Clear percentage field for fixed amount coupons
            values.percentage = null;
        } else {
            // For percentage, clear fixed amount field
            values.fixedAmount = null;
        }

        // Keep the discount mode for backend processing
        // Don't delete values.discountMode;

        let data = {
            routeName: selectedCoupon?.id ? "updateCoupon" : "createCoupon",
            ...values,
            courseIds: selectedCourse // Use selectedCourse instead of values.courseIds
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
            
            // Handle specific error cases
            if (err?.response?.status === 400) {
                const errorMessage = err?.response?.data?.message || 'بيانات غير صحيحة';
                toast.error(errorMessage);
            } else if (err?.response?.status === 409) {
                toast.error('كود الكوبون مستخدم بالفعل');
            } else if (err?.response?.status === 422) {
                const errorMessage = err?.response?.data?.message || 'بيانات غير صحيحة';
                toast.error(errorMessage);
            } else {
                toast.error('حدث خطأ أثناء حفظ الكوبون');
            }
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
        
        // Validate fixed amount coupons can only have one course
        if (selectedDiscountMode === 'fixedAmount' && value.length > 1) {
            toast.warning("الكوبونات بقيمة ثابتة تعمل مع دورة واحدة فقط. سيتم إلغاء تحديد الدورات الإضافية.");
            // Keep only the first selected course
            const singleCourse = [value[0]];
            setSelectedCourse(singleCourse);
            couponCourseForm.setFieldsValue({ courseIds: singleCourse });
        }
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
                    initialValue="percentage"
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
                                            return Promise.reject('النسبة لا يمكن أن تتجاوز 100%');
                                        }
                                        if (val && val < 0) {
                                            return Promise.reject('النسبة لا يمكن أن تكون سالبة');
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
                            name="fixedAmount"
                            rules={[
                                { required: true, message: manageCouponConst.couponAmountError },
                                {
                                    validator: (_, val) => {
                                        if (val && val < 0) {
                                            return Promise.reject('القيمة لا يمكن أن تكون سالبة');
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
                                min={0}
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