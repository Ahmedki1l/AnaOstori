import React from 'react'
import styles from '../../../styles/InstructorPanelStyleSheets/ManageInstructor.module.scss'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import ModelForAddInstructor from '../../../components/ManageInstructor/ModelForAddInstructor'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { fullDate } from '../../../constants/DateConverter'


const Index = () => {
    const storeData = useSelector((state) => state?.globalStore);
    const [isModelForAddInstructor, setIsModelForAddInstructor] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const instructorDetails = storeData?.instructorList

    const handleAddInstructor = () => {
        setIsModelForAddInstructor(true)
        setIsEdit(false)
    }
    const handleEditInstructor = () => {
        setIsModelForAddInstructor(true)
        setIsEdit(true)
    }

    return (
        <div>
            <div className='maxWidthDefault px-4'>
                <div>
                    <div dir='ltr'>
                        <button className={styles.createNewAvailability} onClick={() => handleAddInstructor()}>إضافة مدرب </button>
                    </div>
                    <table className={styles.tableArea}>
                        <thead className={styles.tableHeaderArea}>
                            <tr>
                                <th className={`${styles.tableHeadText} ${styles.tableHead1}`}>المدرب</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead2}`}>الايميل</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead3}`}>تاريخ الانشاء</th>
                                <th className={`${styles.tableHeadText} ${styles.tableHead4}`}>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tableBodyArea}>
                            {instructorDetails.map((instructor, index) => {
                                return (
                                    <tr key={`tableRow${index}`} className={styles.tableRow}>
                                        <td>{instructor.name}</td>
                                        <td>{instructor.email}</td>
                                        <td>{fullDate(instructor.createdAt)}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <div className='cursor-pointer' onClick={() => handleEditInstructor()}>
                                                    <AllIconsComponenet iconName={'editicon'} height={18} width={18} color={'#000000'} />
                                                </div>
                                                <div className='cursor-pointer'>
                                                    <AllIconsComponenet iconName={'deletecourse'} height={18} width={18} color={'#000000'} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <ModelForAddInstructor
                isModelForAddInstructor={isModelForAddInstructor}
                setIsModelForAddInstructor={setIsModelForAddInstructor}
                isEdit={isEdit}
            />
        </div>
    )
}

export default Index