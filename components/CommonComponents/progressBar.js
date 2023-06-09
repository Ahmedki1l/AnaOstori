import React from 'react';

const ProgressBar = ({ percentage, bgColor, height }) => {
    const progressBarDiv = {
        width: 'inherit',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: '10px',
        backgroundColor: 'rgba(217, 217, 217, 0.3)',
    }
    const barStyle = {
        width: `${percentage}%`,
        height: height ? height : '20px',
        backgroundColor: `${bgColor}`,
        transition: 'width 0.5s ease-in-out'
    };
    const percentageText = {
        position: 'absolute',
        top: '0',
        right: '45%',
        color: '#000000',
        zIndex: 10
    };

    return (
        <div style={progressBarDiv}>
            <div style={barStyle}></div>
            <div style={percentageText}>{percentage}%</div>
        </div>
    );
};

export default ProgressBar;