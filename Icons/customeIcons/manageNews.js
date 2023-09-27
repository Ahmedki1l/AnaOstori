import React from 'react'

const ManageNews = ({ width, height, color }) => {
    return (
        <div>
            <svg width={width} height={height} viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_9_10615)">
                    <path opacity="0.3" d="M5.25 4.75H8.41667V7.91667H5.25V4.75ZM30.5833 30.0833H33.75V33.25H30.5833V30.0833ZM30.5833 4.75H33.75V7.91667H30.5833V4.75ZM5.25 30.0833H8.41667V33.25H5.25V30.0833Z" fill={color} />
                    <path d="M18.3755 11.0835L12.9922 25.3335H15.5572L16.713 22.1668H22.2388L23.4105 25.3335H25.9913L20.5922 11.0835H18.3755ZM17.4255 20.1718L19.4997 14.1077L21.558 20.1718H17.4255ZM27.4163 4.75016H11.583V1.5835H2.08301V11.0835H5.24967V26.9168H2.08301V36.4168H11.583V33.2502H27.4163V36.4168H36.9163V26.9168H33.7497V11.0835H36.9163V1.5835H27.4163V4.75016ZM5.24967 4.75016H8.41634V7.91683H5.24967V4.75016ZM8.41634 33.2502H5.24967V30.0835H8.41634V33.2502ZM33.7497 33.2502H30.583V30.0835H33.7497V33.2502ZM30.583 4.75016H33.7497V7.91683H30.583V4.75016ZM30.583 26.9168H27.4163V30.0835H11.583V26.9168H8.41634V11.0835H11.583V7.91683H27.4163V11.0835H30.583V26.9168Z" fill={color} />
                </g>
                <defs>
                    <clipPath id="clip0_9_10615">
                        <rect width="38" height="38" fill="white" transform="translate(0.5)" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    )
}

export default ManageNews