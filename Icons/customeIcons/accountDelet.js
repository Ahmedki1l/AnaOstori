import React from 'react'

const AccountDelet = ({ height, width, color }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_5206_125235)">
                <path d="M17.4712 0.47168C19.1376 0.537733 20.7096 1.24981 21.843 2.45207C22.9765 3.65434 23.5792 5.24889 23.5192 6.88677C23.5192 13.8679 16.4152 16.0283 11.9992 23.1132C7.32974 15.9877 0.479185 14.0981 0.479185 6.88677C0.419182 5.24889 1.02186 3.65434 2.15533 2.45207C3.2888 1.24981 4.86075 0.537733 6.52718 0.47168C7.9023 0.527447 9.20092 1.10866 10.1464 2.09149L8.40014 5.05658L13.4401 8.11319L10.5601 15.7547L18.4801 6.58583L13.4401 3.53206L14.8331 1.31508C15.608 0.783377 16.5262 0.489835 17.4712 0.47168Z" stroke={color} />
            </g>
            <defs><clipPath id="clip0_5206_125235"><rect width={width} height={height} fill="white" /></clipPath></defs>
        </svg>

    )
}

export default AccountDelet