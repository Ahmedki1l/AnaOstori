import React from 'react'
import styled from 'styled-components'
import { Input as AntdInput } from 'antd'

const { Search } = AntdInput;
const SearchInputField = styled(Search)`
    direction: ltr;
    .ant-input-group:hover .ant-input{
        border-color #7c7c7c7c !important;
    }
    .ant-input-group .ant-input {
        height:46px;
        width: 100%;
        font-size: 16px;
        margin-bottom: 0;
        text-align: right;
        ::placeholder {
            font-size: 20px;
            font-family: 'Tajawal-Regular';
        } 
    }

    .ant-btn{
        height:46px;
        border-left:none
    }
`
const onSearch = (value) => console.log(value);

const SearchInput = ({
    height,
    width,
    placeholder,
}) => {
    return (
        <SearchInputField
            placeholder={placeholder}
            onSearch={onSearch}
            height={'46px'}
            width={width}
        />

    )
}

export default SearchInput
