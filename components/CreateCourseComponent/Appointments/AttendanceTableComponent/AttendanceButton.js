import React, { useState } from 'react'
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet'

export default function AttendanceButton({ attendanceType }) {

    const blank = <AllIconsComponenet iconName={'circleicon'} height={35} width={35} color={'#F1F2F1'} />
    const present = <AllIconsComponenet iconName={'present'} height={35} width={35} />
    const late = <AllIconsComponenet iconName={'late'} height={35} width={35} />
    const absent = <AllIconsComponenet iconName={'absent'} height={35} width={35} />
    const excused = <AllIconsComponenet iconName={'excused'} height={35} width={35} />

    const Attendancebuttons = [blank, present, late, absent, excused];
    let defaultIndex = attendanceType == 'present' ? 1 : attendanceType == 'late' ? 2 : attendanceType == 'absent' ? 3 : attendanceType == 'excused' ? 4 : 0
    const [currentButtonIndex, setCurrentButtonIndex] = useState(defaultIndex);

    const handleAttendaceClick = () => {
        setCurrentButtonIndex((index) => (index + 1) % Attendancebuttons.length);
    };

    return (
        <div onClick={handleAttendaceClick}>
            {Attendancebuttons[currentButtonIndex]}
        </div>
    )
}

