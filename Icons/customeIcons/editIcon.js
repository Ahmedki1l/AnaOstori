import React from 'react'

const EditIcon = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 14.2504V18.0004H3.75L14.815 6.93543L11.065 3.18543L0 14.2504ZM17.705 4.04543C18.095 3.65543 18.095 3.02043 17.705 2.63043L15.37 0.29543C14.98 -0.0945703 14.345 -0.0945703 13.955 0.29543L12.125 2.12543L15.875 5.87543L17.705 4.04543Z" fill={color} />
        </svg>
    )
}

export default EditIcon;