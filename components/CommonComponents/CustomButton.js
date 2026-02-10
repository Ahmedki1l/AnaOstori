import Image from 'next/image';
import React from 'react'
import loader from '../../public/icons/loader.svg'


const CustomButton = (props) => {
    return (
        <div style={{ width: props.width, height: props.height }} >
            <button style={{ fontSize: props.fontSize }} onClick={props.onClick} className='primarySolidBtn' type={props.type || 'submit'} disabled={props.showLoader}>
                {props.showLoader ? <Image src={loader} width={30} height={30} alt={'loader'} /> : ""}
                {props.btnText}
            </button>
        </div>
    )
}

export default CustomButton