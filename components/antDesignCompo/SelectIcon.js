import React, { useState } from 'react'
import styled from 'styled-components';
import { Select as AntdSelect } from "antd";
import Icon from '../CommonComponents/Icon';
import AllIconsComponenet from '../../Icons/AllIconsComponenet';

const { Option } = AntdSelect;

const StyledSelect = styled(AntdSelect)`

  .ant-select-selector{
    height:100% !important;
    width:100% !important;
    border-radius: 4px;
    box-shadow: none;
    border: none !important;
    padding:  0  !important;
  }

  .ant-select-item{
    padding: 5px 7px !important;
  }

  .ant-select-selection-item{
    padding-inline-end: 0 !important;
    display:flex;
    justify-content:center;
    align-items: center;
  }
`;

const IconWrapper = styled('div')`
  width: 70px;
  height: 47px;
  border: 0.5px solid rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  display: grid;  
  grid-template-columns: 22px auto;
  overflow: hidden;
`

const DropDownIconWrapper = styled('div')`{
  display: grid;
  place-items: center;
  background: #EFEFEF;
  border-left: 0.5px solid rgba(0, 0, 0, 0.5);
}`

const iconList = [
  { iconName: "clockIcon", height: '25', width: '25' },
  { iconName: "bookIcon", height: '25', width: '25' },
  { iconName: "giftIcon", height: '25', width: '25' },
  { iconName: "maleFemaleIcon", height: '25', width: '25' },
  { iconName: "shildIcon", height: '28', width: '25' },
  { iconName: "allDeviceIcon", height: '25', width: '25' },
  { iconName: "calendarIcon", height: '25', width: '25' },
  { iconName: "playIcon", height: '25', width: '25' },
  { iconName: "liveCourseBlackIcon", height: '25', width: '25' },
  { iconName: "locationIcon", height: '25', width: '25' },
]

const SelectIcon = ({ value, setIconValue, ...rest }) => {

  const handleChange = (value) => {
    setIconValue(value)
  };

  return (
    <IconWrapper>
      <DropDownIconWrapper>
        <AllIconsComponenet height={7} width={13} iconName={'dropDown'} color={'#000000'} />
      </DropDownIconWrapper>
      <StyledSelect
        onChange={handleChange}
        optionLabelProp="label"
        showArrow={false}

        value={value}
        {...rest}
      >
        {iconList.map((icon, index) => {
          return (
            <Option
              className='iconSelectDropDownMenuWrapper'
              key={`icon0${index}`}
              value={icon.iconName}
              label={<Icon height={icon.height} width={icon.width} iconName={icon.iconName} alt={icon.iconName} />}
            >
              <Icon height={icon.height} width={icon.width} iconName={icon.iconName} alt={icon.iconName} />
            </Option>
          )
        })}
      </StyledSelect>
    </IconWrapper>
  );
}

export default SelectIcon

