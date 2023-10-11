import React from 'react'
import styled from 'styled-components'
import { Input as AntdInput } from 'antd'
import AllIconsComponenet from '../../Icons/AllIconsComponenet';

const SearchInputField = styled(AntdInput)`

::placeholder {
    font-size: ${props => (props.fontSize ? props.fontSize : '20')}px !important;
    font-family: 'Tajawal-Regular';
    color:#00000045;
  }
  
height: ${props => (props.height ? props.height : '40')}px !important;
width: ${props => (props.width ? props.width : '172')}px !important;
    direction: rtl;
    .ant-input-group:hover .ant-input{
        border-color #7c7c7c7c !important;
    }
   
    .ant-input-group .ant-input {
        height:40px;
        width: 100%;
        font-size: 16px;
        margin-bottom: 0;
        text-align: right;
        :placeholder {
            font-size: 16px;
            font-family: 'Tajawal-Regular';
            padding:5px;
            color:#00000045;
          } 
    }

    .ant-btn{
        height:40px;
        border-left:none
    }
    
`

const InputWithLocation = ({
    width,
    onChange,
    placeholder,
    suFFixIconName,
    ...rest
}) => {
    return (
        <SearchInputField
            placeholder={placeholder}
            onChange={onChange}
            width={width}
            prefix={<AllIconsComponenet height={13} width={13} iconName={suFFixIconName} color={'#00000080'} />}
            {...rest}
        />

    )
}

export default InputWithLocation
