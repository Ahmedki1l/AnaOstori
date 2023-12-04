import React, { useEffect, useState } from 'react'
import AllIconsComponenet from '../../../../../Icons/AllIconsComponenet'
import styles from '../../../../../styles/AttendanceQr.module.scss'
import { useRouter } from 'next/router'
import { postAuthRouteAPI } from '../../../../../services/apisService'
import Spinner from '../../../../../components/CommonComponents/spinner'

export async function getServerSideProps(contex) {
    if (contex?.query.courseId == undefined && contex?.query.attendanceKey == undefined) {
        return {
            notFound: true,
        };
    }
    return {
        props: {
            courseId: contex?.query.courseId,
            attendanceKey: contex?.query.attendanceKey
        }
    }
}


export default function Index(props) {
    const { courseId, attendanceKey } = props
    const router = useRouter()
    useEffect(() => {
        setLoading(true)
        getAttendanceKey()
    }, [])

    const [markAttendanceType, setMarkAttendanceType] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()

    const getAttendanceKey = async () => {
        if (attendanceKey) {
            let body = {
                routeName: 'markAttendance',
                attendanceKey: attendanceKey,
                courseId: courseId
            }
            await postAuthRouteAPI(body).then((res) => {
                setLoading(false)
                setMarkAttendanceType(res.data.message);
            }).catch((error) => {
                setError(error)
                setLoading(false)
                console.log(error);
            })
        }
    }

    const handleBtnClick = () => {
        setLoading(true)
        router.push('/')
    }

    return (
        <>
            {loading ?
                <div className={`relative ${styles.mainLoadingPage}`}>
                    <Spinner borderwidth={7} width={6} height={6} />
                </div>
                :
                !error ?
                    <div className={`maxWidthDefault ${styles.mainArea}`}>
                        <div className={styles.circle}>
                            <AllIconsComponenet iconName={'checkCircleRoundIcon'} height={25} width={25} color={'#FFFFFF'} />
                        </div>
                        <h1 className={`head1 ${styles.pageHeader}`}>كفو، حضرناك 😎</h1>
                        <p className={`fontMedium ${styles.note1}`}>{markAttendanceType}</p>
                        <div className='p-6'>
                            <button className={`primarySolidBtn ${styles.btnBoxWrapper}`} onClick={() => handleBtnClick()}>الرجوع إلى الرئيسية</button>
                        </div>
                    </div>
                    :
                    <div className={`maxWidthDefault ${styles.mainArea}`}>
                        <div className={styles.alertCircle}>
                            <AllIconsComponenet iconName={'alertIcon'} height={56} width={56} color={'#E5342F'} />
                        </div>
                        <h1 className={`head1 ${styles.pageHeader}`}>ما تحضرت 😅</h1>
                        <p className={` ${styles.note1}`}>نعتذر حصلت مشكلة، ارجع حاول أو تواصل مع طاقم أنا أسطوري</p>
                        <div className='p-6'>
                            <button className={`primarySolidBtn ${styles.btnBoxWrapper}`} onClick={() => handleBtnClick()}>الرجوع إلى الرئيسية</button >
                        </div>
                    </div>
            }
        </>
    )
}
