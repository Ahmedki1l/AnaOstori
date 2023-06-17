// import React, { useState } from 'react';

// const AttendanceTable = () => {
//     // Sample data structure
//     const [attendanceData, setAttendanceData] = useState([
//         { name: 'Student 1', attendance: [{ date: '2023-06-14', state: 'present' }, { date: '2023-06-15', state: 'absent' }] },
//         { name: 'Student 2', attendance: [{ date: '2023-06-14', state: 'absent' }, { date: '2023-06-15', state: 'late' }] },
//         // Add more students and their attendance data as needed
//     ]);

//     const [selectedDate, setSelectedDate] = useState(null);

//     const toggleAttendanceState = (studentIndex, dateIndex) => {
//         setSelectedDate({ studentIndex, dateIndex });
//     };

//     const updateAttendanceState = (state) => {
//         const { studentIndex, dateIndex } = selectedDate;
//         const updatedAttendanceData = [...attendanceData];
//         updatedAttendanceData[studentIndex].attendance[dateIndex].state = state;
//         setAttendanceData(updatedAttendanceData);
//         setSelectedDate(null);
//     };

//     return (
//         <table>
//             <thead>
//                 <tr>
//                     <th style={{ border: '1px solid #000000' }}>Student</th>
//                     {attendanceData[0]?.attendance.map((attendance) => (
//                         <th
//                             key={attendance.date}
//                             colSpan={2}
//                             onClick={() => toggleAttendanceState(0, attendanceData[0].attendance.findIndex((a) => a.date === attendance.date))}
//                             styles={{ border: '1px solid #000000' }}
//                         >
//                             {attendance.date}
//                         </th>
//                     ))}
//                 </tr>
//                 <tr>
//                     <th style={{ border: '1px solid #000000' }}></th>
//                     {attendanceData[0]?.attendance.map((attendance) => (
//                         <React.Fragment key={attendance.date}>
//                             <th style={{ border: '1px solid #000000' }} onClick={() => updateAttendanceState('present')}>Present</th>
//                             <th style={{ border: '1px solid #000000' }} onClick={() => updateAttendanceState('absent')}>Absent</th>
//                             <th style={{ border: '1px solid #000000' }} onClick={() => updateAttendanceState('late')}>Late</th>
//                             <th style={{ border: '1px solid #000000' }} onClick={() => updateAttendanceState('excused')}>Excused</th>
//                         </React.Fragment>
//                     ))}
//                 </tr>
//             </thead>
//             <tbody>
//                 {attendanceData.map((student, studentIndex) => (
//                     <tr key={student.name}>
//                         <td style={{ border: '1px solid #000000' }}>{student.name}</td>
//                         {student.attendance.map((attendance, dateIndex) =>
//                             selectedDate?.studentIndex === studentIndex && selectedDate?.dateIndex === dateIndex ? (
//                                 <>
//                                     <td style={{ border: '1px solid #000000' }} onClick={() => updateAttendanceState('present')}>{attendance.state === 'present' ? '✓' : ''}</td>
//                                     <td style={{ border: '1px solid #000000' }} onClick={() => updateAttendanceState('absent')}>{attendance.state === 'absent' ? '✓' : ''}</td>
//                                     <td style={{ border: '1px solid #000000' }} onClick={() => updateAttendanceState('late')}>{attendance.state === 'late' ? '✓' : ''}</td>
//                                     <td style={{ border: '1px solid #000000' }} onClick={() => updateAttendanceState('excused')}>{attendance.state === 'excused' ? '✓' : ''}</td>
//                                 </>
//                             ) : (
//                                 <td
//                                     key={attendance.date}
//                                     rowSpan={2}
//                                     onClick={() => toggleAttendanceState(studentIndex, dateIndex)}
//                                     styles={{ border: '1px solid #000000' }}
//                                 >
//                                     {attendance.state === 'present' ? '✓' : ''}
//                                 </td>
//                             )
//                         )}
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//     );
// };

// export default AttendanceTable;

import React, { useState } from 'react';

const AttendanceTable = () => {
    // Sample data structure
    const [attendanceData, setAttendanceData] = useState([
        { name: 'Student 1', attendance: [{ date: '2023-06-14', state: 'present' }, { date: '2023-06-15', state: 'absent' }] },
        { name: 'Student 2', attendance: [{ date: '2023-06-14', state: 'absent' }, { date: '2023-06-15', state: 'late' }] },
        // Add more students and their attendance data as needed
    ]);

    const [selectedDate, setSelectedDate] = useState(null);

    const toggleAttendanceState = (studentIndex, dateIndex) => {
        setSelectedDate({ studentIndex, dateIndex });
    };

    const updateAttendanceState = (state) => {
        const { studentIndex, dateIndex } = selectedDate;
        const updatedAttendanceData = [...attendanceData];
        updatedAttendanceData[studentIndex].attendance[dateIndex].state = state;
        setAttendanceData(updatedAttendanceData);
        setSelectedDate(null);
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>Student</th>
                    {attendanceData[0]?.attendance.map((attendance) => (
                        <th
                            key={attendance.date}
                            colSpan={2}
                            onClick={() => toggleAttendanceState(0, attendanceData[0].attendance.findIndex((a) => a.date === attendance.date))}
                        >
                            {attendance.date}
                        </th>
                    ))}
                </tr>
                <tr>
                    <th></th>
                    {attendanceData[0]?.attendance.map((attendance, dateIndex) => (
                        <React.Fragment key={attendance.date}>
                            {selectedDate && selectedDate.dateIndex === dateIndex ? (
                                <>
                                    <th onClick={() => updateAttendanceState('present')}>Present</th>
                                    <th onClick={() => updateAttendanceState('absent')}>Absent</th>
                                    <th onClick={() => updateAttendanceState('late')}>Late</th>
                                    <th onClick={() => updateAttendanceState('excused')}>Excused</th>
                                </>
                            ) : (
                                <th></th>
                            )}
                        </React.Fragment>
                    ))}
                </tr>
            </thead>
            <tbody>
                {attendanceData.map((student, studentIndex) => (
                    <tr key={student.name}>
                        <td>{student.name}</td>
                        {student.attendance.map((attendance, dateIndex) => (
                            <React.Fragment key={attendance.date}>
                                {selectedDate && selectedDate.studentIndex === studentIndex && selectedDate.dateIndex === dateIndex ? (
                                    <>
                                        <td style={{ border: '1px solid #000000' }} onClick={() => updateAttendanceState('present')}>
                                            {attendance.state === 'present' ? 'present' : ''}
                                        </td>
                                        <td style={{ border: '1px solid #000000' }} onClick={() => updateAttendanceState('absent')}>
                                            {attendance.state === 'absent' ? 'absent' : ''}
                                        </td>
                                        <td style={{ border: '1px solid #000000' }} onClick={() => updateAttendanceState('late')}>
                                            {attendance.state === 'late' ? 'late' : ''}
                                        </td>
                                        <td style={{ border: '1px solid #000000' }} onClick={() => updateAttendanceState('excused')}>
                                            {attendance.state === 'excused' ? 'excused' : ''}
                                        </td>
                                    </>
                                ) : (
                                    <td
                                        rowSpan={2}
                                        onClick={() => toggleAttendanceState(studentIndex, dateIndex)}
                                    >
                                        {attendance.state === 'present' ? '✓' : ''}
                                    </td>
                                )}
                            </React.Fragment>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AttendanceTable;

