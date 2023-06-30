import React from 'react'
import { FormItem } from '../../antDesignCompo/FormItem'
import Select from '../../antDesignCompo/Select'
import { Input } from 'antd'

const TestResults = () => {

    const { Search } = Input;
    const onSearch = (value) => console.log(value);

    return (
        <div className='maxWidthDefault px-4'>
            <div className='flex'>
                <FormItem>
                    <Input
                        fontSize={16}
                        width={331}
                        height={40}
                        suffix
                    />
                </FormItem>
                <FormItem
                    name={'instructorId'}
                >
                    <Select
                        fontSize={16}
                        width={128}
                        height={40}
                        placeholder="اختر المدرب"
                    />
                </FormItem>
                <FormItem
                    name={'gender'}
                >
                    <Select
                        fontSize={16}
                        width={128}
                        height={40}
                        placeholder="اختر الجنس"
                    />
                </FormItem>
            </div>
        </div>
    )
}

export default TestResults
