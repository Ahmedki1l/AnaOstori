/* eslint-disable */
import React from 'react'
import { Input as AntdInput } from 'antd'
import styled from 'styled-components'


const AntdInputStyle = styled(AntdInput)`
  ::placeholder {
    font-size: 20px;
    font-family: 'Tajawal-Regular';
  }
  font-size: 20px;
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
  ...rest
}) => {
  return (
    <>
      <AntdInputStyle
        {...rest}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        height={height}
        padding={padding}
      />
    </>
  )
}
export default Input
