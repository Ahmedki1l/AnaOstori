import { Drawer, Form } from 'antd'
import React from 'react'
import styled from 'styled-components';
import { FormItem } from '../antDesignCompo/FormItem';
import Select from '../antDesignCompo/Select';


const ManageCouponCourseDrawer = () => {

    const [couponCourseForm] = Form.useForm()


    return (
        <div>
            <Form form={couponCourseForm}>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>عنوان الكوبون</p>
                <FormItem
                    name={'status'}>
                    <Select
                        width={425}
                        height={47}
                        placeholder='حالة الحجز'
                    />
                </FormItem>
                <p className='fontBold py-2' style={{ fontSize: '18px' }}>الكود</p>
                <FormItem
                    name={'status'}>
                    <Select
                        width={425}
                        height={47}
                        placeholder='حالة الحجز'
                    />
                </FormItem>
            </Form>
        </div>
    )
}

export default ManageCouponCourseDrawer