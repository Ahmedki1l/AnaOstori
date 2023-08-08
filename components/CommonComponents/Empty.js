import React from "react";
import styled from "styled-components";
import AllIconsComponenet from "../../Icons/AllIconsComponenet";

const IconContainer = styled('div')`
    height:${props => (props.containerhight ? props.containerhight : '300')}px; 
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
`

const EmptyText = styled('p')`
    font-size: ${props => (props.fontSize ? props.fontSize : '3')}px !important; 
    margin:10px 0;
`

const StyledButton = styled('button')`
    font-size:16px;
    height:auto;
    width:auto;
`

function Empty({
    onClick,
    buttonText,
    emptyText,
    containerhight
}) {
    return (
        <>
            <IconContainer containerhight={containerhight}>
                <AllIconsComponenet height={118} width={118} iconName={'noData'} color={'#00000080'} />
                <EmptyText fontSize={16}>{emptyText}</EmptyText>
                <StyledButton className={'primarySolidBtn'} onClick={onClick}>{buttonText}</StyledButton>
            </IconContainer >
        </>
    )
}

export default Empty
