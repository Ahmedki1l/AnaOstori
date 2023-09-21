import { Drawer, Form } from 'antd'
import React from 'react'
import styled from 'styled-components';
import { FormItem } from '../antDesignCompo/FormItem';
import Select from '../antDesignCompo/Select';
import Input from '../../components/antDesignCompo/Input'

const ManageCouponCourseDrawer = () => {

    const [couponCourseForm] = Form.useForm()


    return (
        <div>
            <Form form={couponCourseForm}>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>عنوان الكوبون</p>
                <FormItem
                    name={'status'}>
                    <Input
                        width={425}
                        height={47}
                        placeholder='حالة الحجز'
                    />
                </FormItem>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>الكود</p>
                <FormItem
                    name={'status'}>
                    <Input
                        width={425}
                        height={47}
                        placeholder='coupon code'
                    />
                </FormItem>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>نسبة الخصم</p>
                <FormItem
                    name={'percantage'}>
                    <Input
                        width={425}
                        height={47}
                        placeholder='Number%'
                    />
                </FormItem>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>نوع الخصم</p>
                <FormItem
                    name={'couponType'}>
                    <Select
                        width={425}
                        height={47}
                        placeholder='coupon Type'
                    />
                </FormItem>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>تاريخ الانتهاء</p>
                <FormItem
                    name={'expiredDate'}>
                    <Input
                        width={425}
                        height={47}
                        placeholder='expired date'
                    />
                </FormItem>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>تطبق على هذه الدورات</p>
                <FormItem
                    name={'appliedCourse'}>
                    <Select
                        width={425}
                        height={47}
                        placeholder='SelectCoursesAsMulti'
                    />
                </FormItem>
            </Form>
        </div>
    )
}

export default ManageCouponCourseDrawer