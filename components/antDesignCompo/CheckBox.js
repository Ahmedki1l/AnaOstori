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
    }
    .ant-checkbox-inner:after {
        width: 7px;
        height: 15px;
        top: 43%;
    }
    .ant-checkbox:hover .ant-checkbox-inner {
        border-color:  #F26722 !important;
    }
    .ant-checkbox-checked .ant-checkbox-inner {
        background-color: #F26722 !important;
        border-color: #F26722 !important;
    }   
    .ant-checkbox-checked:after{
        border: #F26722 !important;
    }
`
const CheckBoxLabel = styled('p')`
    font-size: 20px;
    font-family: 'Tajawal-Regular';
`
const CheckBox = ({
    label,
    onChange,
    defaultChecked,
    ...rest
}) => {
    return (
        <>
            <AntdCheckboxStyle
                onChange={onChange}
                defaultChecked={defaultChecked}
                {...rest}
            >
                <CheckBoxLabel>{label}</CheckBoxLabel>
            </AntdCheckboxStyle>
        </>
    )
}
export default CheckBox
