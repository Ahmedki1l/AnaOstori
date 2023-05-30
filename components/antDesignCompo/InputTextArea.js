/* eslint-disable */
import React from 'react'
import { Input as AntdInput } from 'antd'
import styled from 'styled-components'

const { TextArea } = AntdInput;

const AntdInputTextAreaStyle = styled(TextArea)`
  ::placeholder {
    font-size: 20px;
    font-family: 'Tajawal-Regular';
  }
  font-size: 20px;
  font-family: 'Tajawal-Regular';
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
const InputTextArea = ({
  placeholder,
  disabled,
  width,
  height,
  padding,
  ...rest

}) => {
  console.log("hight", height);
  return (
    <>
      <AntdInputTextAreaStyle
        style={{ height: height }}
        placeholder={placeholder}
        disabled={disabled}
        height={height}
        width={width}
        padding={padding}
        {...rest}
      />
    </>
  )
}
export default InputTextArea
