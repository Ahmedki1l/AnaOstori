/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Input as AntdInput } from 'antd'
import styled from 'styled-components'


const AntdInputStyle = styled(AntdInput)`
font-size: ${props => (props.fontSize ? props.fontSize : '20')}px !important;

  ::placeholder {
    font-size: ${props => (props.fontSize ? props.fontSize : '20')}px !important;
    font-family: 'Tajawal-Regular';
    color:#00000045;
  }
  font-family: 'Tajawal-Regular';
  height: ${props => (props.height ? props.height : '52')}px;
  width:${props => (props.width ? props.width : '317')}px;
  border-radius: 4px;
  border: 0.5px solid #0000008a;
  box-shadow: none;
 
  :focus {
    border-color: #0000008a;
    box-shadow: none;
  }
  :hover {
    border-color: #0000008a;
  }
 
`
const Input = ({
  type,
  placeholder,
  disabled,
  width,
  height,
  padding,
  fontSize,
  value,
  maxValue,
  ...rest
}) => {


  return (
    <AntdInputStyle
      {...rest}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      height={height}
      width={width}
      padding={padding}
      fontSize={fontSize}
      value={value}
    />
  )
}
export default Input
