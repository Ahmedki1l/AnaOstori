import React from 'react'
import styled from 'styled-components';
import { Switch as AntdSwitch } from "antd";

const StyledSwitch = styled(AntdSwitch)`
    direction: ltr;
    .ant-switch.ant-switch-checked {
        background: #00CF0Fff;

        &:hover {
            background: #00CF0Fff;
        }
    }

    :where(.css-dev-only-do-not-override-w8mnev).ant-switch.ant-switch-checked {
        background: #00cf0f;
        &:hover {
            background: #00cf0f;
        }
    }
  
}

`
const Switch = ({
    size,
    ...rest
}) => {
    return (
        <StyledSwitch
            size={size}
            {...rest}
        />
    );
}

export default Switch