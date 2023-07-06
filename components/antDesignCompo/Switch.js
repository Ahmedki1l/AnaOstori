import React from 'react'
import styled from 'styled-components';
import { Switch as AntdSwitch } from "antd";

const StyledSwitch = styled(AntdSwitch)`
    direction: ltr;

    :where(.css-dev-only-do-not-override-w8mnev).ant-switch.ant-switch-checked {
        background:#00CF0F !important;
        &:hover {
            background:#00CF0F !important;
        }
    }
`
const Switch = ({

    size,
    ...rest
}) => {
    return (
        <StyledSwitch
            // style={{ backgroundColor: 'orange' }}
            size={size}
            {...rest}
        />
    );
}

export default Switch