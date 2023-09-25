import React, { useState } from 'react';
import styled from 'styled-components';

const StyledLabel = styled(`label`)`
    height: 17px;
    width: 31px;
	position: relative;
	display: inline-block;

    .input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 34px
    }
    
    .slider:before {
        position: absolute;
        content: "";
        height: 12.5px;
        width: 12.5px;
        left: 2.5px;
        bottom: 2.5px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 50%;
    }
    
    input:checked+.slider {
        background-color:#00CF0F;
    }
    
    input:focus+.slider {
        box-shadow: 0 0 1px #2196F3;
    }
    
    input:checked+.slider:before {
        -webkit-transform: translateX(13.5  px);
        -ms-transform: translateX(13.5px);
        transform: translateX(13.5px);
    }
    
`

const Switch = ({ onChange, params, defaultChecked }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked ? defaultChecked : false)

    const handleChange = () => {
        onChange(!isChecked, params)
        setIsChecked(!isChecked);
    };


    return (
        <StyledLabel>
            <input
                id={params}
                type="checkbox"
                className='hidden'
                checked={isChecked}
                onChange={handleChange}
            />
            <span className="slider"></span>
        </StyledLabel>
    );
};

export default Switch;


