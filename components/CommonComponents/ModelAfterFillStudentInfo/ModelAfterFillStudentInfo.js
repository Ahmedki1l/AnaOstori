import { Modal } from 'antd'
import React from 'react'
import styles from './ModelAfterFillStudentInfo.module.scss'
import styled from 'styled-components'
import { studentInformationConst } from '../../../constants/studentInformationConst'
import { useRouter } from 'next/router'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'

const StylesModal = styled(Modal)`
    .ant-modal-content {
        padding: 0;
        border-radius: 4px;
    }
`

const ModelAfterFillStudentInfo = ({
    modelAfterFillStudentInfo,
    setModelAfterFillStudentInfo,
    courseId,
    courseType,
}) => {

    const router = useRouter()

    const isModelClose = () => {
        if (courseType === "on-demand") {
            router.push(`/myCourse?courseId=${courseId}`)
        } else {
            return setModelAfterFillStudentInfo(false)
        }
    }

    return (
        <StylesModal
            open={modelAfterFillStudentInfo}
            onCancel={() => setModelAfterFillStudentInfo(false)}
            closeIcon={false}
            width={358}
            centered={true}
            footer={false}>
            <div onClick={() => setModelAfterFillStudentInfo(false)} className={styles.modalHeader}>
                <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} />
            </div>
            <div className={styles.modelWrapper}>
                <div className={styles.circle}>
                    <AllIconsComponenet iconName={'checkCircleRoundIcon'} height={20} width={24} color={'#FFFFFF'} />
                </div>
                <p className={`fontBold my-2 text-xl`}>{studentInformationConst.headingOfTheModel}</p>
                <p className='text-base	'> 🧡 {studentInformationConst.blessingMsgForModel}</p>
                {/* {router.query.courseType == 'on-demand' && */}
                <div className={`${styles.buttonModalDiv}`}>
                    <button className={`primarySolidBtn ${styles.cancelBtn}`} onClick={isModelClose}>{studentInformationConst.btnTextForModel}</button>
                </div>
                {/* } */}
            </div>
        </StylesModal>
    )
}

export default ModelAfterFillStudentInfo