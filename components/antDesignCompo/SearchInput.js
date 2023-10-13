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
        height: ${props => (props.height ? props.height : '30')}px !important;
        // height:30px;
        width: 100%;
        font-size: 16px;
        margin-bottom: 0;
        text-align: right;
        ::placeholder {
            font-size: 16px;
            font-family: 'Tajawal-Regular';
        } 
    }

    .ant-btn{
        height:40px;
        // border-left:none
    }
`

const SearchInput = ({
    width,
    onChange,
    placeholder,
    ...rest
}) => {
    return (
        <SearchInputField
            placeholder={placeholder}
            onChange={onChange}
            width={width}
            {...rest}
        />

    )
}

export default SearchInput
