import React from 'react'
import styled from 'styled-components';
import { DatePicker as AntdDatePicker } from "antd";
import AllIconsComponenet from '../../Icons/AllIconsComponenet';
import dayjs from 'dayjs';

const StyledDatePicker = styled(AntdDatePicker)`
  height: ${props => (props.height ? props.height : '40')}px !important;
  width: ${props => (props.width ? props.width : '172')}px !important;
  align-items:center;

  .ant-picker-input > input {
    font-size: 16px;
    font-family: 'Tajawal-Regular';
    padding:0 20px;
    margin-top: 4px;
  }
  .ant-picker-input > input::placeholder {
    font-size: 16px;
    font-family: 'Tajawal-Regular';
    padding:5px;
    color:#00000045;
  }
  .ant-picker-suffix{
    position: absolute;
    right:-6px;
  }
`;
const onChange = (date, dateString) => {
  console.log(date, dateString);
};
const disabledDate = (current) => {
  return current < dayjs().endOf('day');
};

const DatePicker = ({
  OptionData,
  placeholder,
  picker,
  suFFixIconName,
  disabled = false,
  ...rest
}) => {
  return (
    <StyledDatePicker
      onChange={onChange}
      placeholder={placeholder}
      picker={picker}
      disabledDate={disabledDate}
      disabled={disabled}
      suffixIcon={<AllIconsComponenet height={16} width={16} iconName={suFFixIconName} color={'#00000080'} />}
      {...rest}
    />
  );
}

export default DatePicker;

