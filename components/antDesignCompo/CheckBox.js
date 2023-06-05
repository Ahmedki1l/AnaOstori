/* eslint-disable */
import React from 'react'
import { Checkbox as AntdCheckbox } from 'antd'
import styled from 'styled-components'


const AntdCheckboxStyle = styled(AntdCheckbox)`
    input[type="checkbox"] {
        width: 26px !important;
        height: 26px !important;
    }
    .ant-checkbox-inner{
        width: 26px;
        height: 26px;
        border:0.5px solid #0000008a;
    }
    .ant-checkbox-inner:after {
        width: 7px;
        height: 13px;
        top: 47%;
    }
    .ant-checkbox-wrapper:hover .ant-checkbox-inner {
        border-color: #0000008a !important;
    }
    .ant-checkbox:hover .ant-checkbox-inner {
        border-color: #0000008a !important;
    }
    .ant-checkbox-checked .ant-checkbox-inner {
        background-color: #F26722;
        border-color: #F26722;
    }   
    .ant-checkbox-wrapper:hover .ant-checkbox-checked .ant-checkbox-inner {
        border-color: #F26722 !important;
        background-color: #F26722 !important;
    }
    .ant-checkbox:hover .ant-checkbox-checked > .ant-checkbox-inner {
        border-color: #F26722 !important;
        background-color: #F26722 !important;
    }
   
`
const CheckBoxLabel = styled('p')`
    font-size: 20px;
    font-family: 'Tajawal-Regular';
`
const CheckBox = ({
    label,
    onChange,
    ...rest
}) => {
    return (
        <>
            <AntdCheckboxStyle
                onChange={onChange}
                {...rest}
            >
                <CheckBoxLabel>{label}</CheckBoxLabel>
            </AntdCheckboxStyle>
        </>
    )
}
export default CheckBox
