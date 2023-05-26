/* eslint-disable */
import React from 'react'
import { Checkbox as AntdCheckbox } from 'antd'
import styled from 'styled-components'


const AntdCheckboxStyle = styled(AntdCheckbox)`
 
  .ant-checkbox-inner{
    // background-color: #F26722;
    // border-color: #F26722;
    width: 26px;
    height: 26px;
    border:0.5px solid #0000008a;
  }

  .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover .ant-checkbox-checked:not(.ant-checkbox-disabled) .ant-checkbox-inner {
    background-color: #F26722;
    border-color: #F26722;
  }
`
const CheckBoxLabel = styled('p')`
    font-size: 20px;
    font-family: 'Tajawal-Regular';
`
const CheckBox = ({
    label,
    ...rest
}) => {
    return (
        <>
            <AntdCheckboxStyle
                {...rest}
            >
                <CheckBoxLabel>{label}</CheckBoxLabel>
            </AntdCheckboxStyle>
        </>
    )
}
export default CheckBox
