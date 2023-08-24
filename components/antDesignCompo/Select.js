import React from 'react'
import styled from 'styled-components';
import { Select as AntdSelect } from "antd";

const StyledSelect = styled(AntdSelect)`
  height: ${props => (props.height ? props.height : '52')}px !important;
  width: ${props => (props.width ? props.width : '317')}px !important;
  font-size: ${props => (props.fontSize ? props.fontSize : '20')}px !important;
   
  .ant-select-selector{
    height:100% !important;
    border-radius: 4px;
    box-shadow: none;
    border: 0.5px solid #0000008a !important;
  }

  .ant-select-selection-search-input{
    height:100% !important;
  }

  .ant-select-selection-placeholder{
    font-size: ${props => (props.fontSize ? props.fontSize : '20')}px !important;
    color:#00000045;
    font-family: 'Tajawal-Regular';
    display:flex;
    align-items:center;
  }

  .ant-select-selection-item{
    font-size: ${props => (props.fontSize ? props.fontSize : '20')}px !important;
    display:flex;
    align-items:center;
  }  
`;

const Select = ({
  onChange,
  OptionData,
  placeholder,
  fontSize,
  ...rest
}) => {
  return (
    <StyledSelect
      options={OptionData}
      placeholder={placeholder}
      fontSize={fontSize}
      onChange={(e) => onChange(e)}
      dropdownStyle={{ direction: 'rtl' }}
      {...rest}
    />
  );
}

export default Select

