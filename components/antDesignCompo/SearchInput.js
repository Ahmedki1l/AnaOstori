import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Input as AntdInput, ConfigProvider } from 'antd'

const { Search } = AntdInput;
const SearchInputField = styled(Search)`
    direction: ltr;
    position: relative;
    .ant-input-group:hover .ant-input{
        border-color #7c7c7c7c !important;
    }
    .ant-input-group {
        width: ${props => (props.width ? props.width : '100%')};
    }
    :where(.css-dev-only-do-not-override-xu9wm8).ant-input-group-wrapper {
        display: contents;
    }
    .ant-input-group .ant-input {
        height: ${props => (props.height ? props.height : '30')}px !important;
        width: 100%;
        font-size: 16px;
        margin-bottom: 0;
        text-align: right;
        ::placeholder {
            font-size: 16px;
            font-family: 'Tajawal-Regular';
        } 
    }
    .ant-input-affix-wrapper{
       width:20rem;
    }
    .ant-btn{
        height:40px;
    }
    .ant-input-clear-icon{
        position: absolute;
        left: 10px;
        bottom: 5px;
        z-index: 1;
    }
`

const SearchInput = ({
    width,
    onChange,
    placeholder,
    onSearch,
    allowClear,
    ...rest
}) => {
    return (
        <SearchInputField
            placeholder={placeholder}
            onChange={onChange}
            width={width}
            onSearch={onSearch}
            allowClear={allowClear}
            {...rest}
        />
    )
}

export default SearchInput
