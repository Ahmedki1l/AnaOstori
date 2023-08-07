import React from "react";
import styled from "styled-components";

const SpinnerContainer = styled('div')`
    display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	margin: ${props => (props.margin ? props.margin : '1')}rem;
`

const SpinnerInner = styled('div')`
    border-width:${props => (props.borderwidth ? props.borderwidth : '4')}px !important;;
    border-style:solid;
    border-color:rgba(0, 0, 0, 0.1);
    border-top-color: #F26722;
    border-radius: 50%;
    width: ${props => (props.width ? props.width : '3')}rem !important; 
    height: ${props => (props.height ? props.height : '3')}rem !important; 

    animation: spin 1s ease-in-out infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`

function Spinner({
    borderwidth,
    width,
    height,
    margin
}) {
    return (
        <SpinnerContainer margin={margin}>
            <SpinnerInner
                borderwidth={borderwidth}
                width={width}
                height={height}
            />
        </SpinnerContainer>
    )
}

export default Spinner