import React, { useEffect, useState } from 'react';
import styles from '../../../styles/MyCourse.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import useWindowSize from '../../../hooks/useWindoSize';
import { useRouter } from 'next/router';
import { getAuthRouteAPI } from '../../../services/apisService';
import { signOutUser } from '../../../services/fireBaseAuthService';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import Image from 'next/legacy/image';
import TrainerIntroCard from '../../../components/CommonComponents/TrainerIntroCard/TrainerIntroCard';
import CompleteCourseIndicator from '../../../components/CommonComponents/CompleteCourseIndicatior/CompleteCourseIndicator';
import Spinner from '../../../components/CommonComponents/spinner';
import { mediaUrl } from '../../../constants/DataManupulation';


export default function Index() {
    const storeData = useSelector((state) => state?.globalStore);
    const dispatch = useDispatch();
    const smallScreen = useWindowSize().smallScreen
    const [filesInCourse, setFilesInCourse] = useState([])
    const [courseCurriculum, setCourseCurriculum] = useState()
    const [courseProgressPrecentage, setCourseProgressPrecentage] = useState()
    const [subscriptionDaysLeft, setSubscriptionDaysLeft] = useState()
    const router = useRouter()
    const courseID = router?.query?.courseId
    const [currentItemId, setCurrentItemId] = useState()
    const [isUserEnrolled, setIsUserEnrolled] = useState(false)

    const selectedCourse = storeData.myCourses.find((enrollment) => {
        return enrollment.courseId == courseID
    })

    useEffect(() => {
        if (courseID) {
            const getPageProps = async () => {
                let couresCurriculumParams = {
                    routeName: 'getCourseCurriculum',
                    courseId: courseID,
                }
                let courseProgressParams = {
                    routeName: 'userCourseProgress',
                    courseId: courseID,
                    enrollmentId: selectedCourse.id,
                }
                let completedCourseItemParams = {
                    routeName: 'CourseProgress',
                    courseId: courseID,
                    enrollmentId: selectedCourse.id,
                }
                try {

                    const courseCurriculumReq = getAuthRouteAPI(couresCurriculumParams)
                    const courseProgressReq = getAuthRouteAPI(courseProgressParams)
                    const completedCourseItemReq = getAuthRouteAPI(completedCourseItemParams)

                    const [courseCurriculum, courseProgress, completedCourseItem] = await Promise.all([
                        courseCurriculumReq,
                        courseProgressReq,
                        completedCourseItemReq
                    ])
                    setCourseCurriculum(courseCurriculum.data)
                    if (courseCurriculum.data?.enrollment != null) { setIsUserEnrolled(true) }
                    setFilesInCourse(courseCurriculum?.data?.sections?.sort((a, b) => a.order - b.order)?.flatMap((section) => section?.items?.filter((item) => item.type === 'file')))
                    setCourseProgressPrecentage(courseProgress.data)
                    getCurrentItemId(completedCourseItem.data, courseCurriculum?.data?.sections?.sort((a, b) => a.order - b.order))
                } catch (error) {
                    if (error?.response?.status == 401) {
                        await getNewToken().then(async (token) => {
                            getPageProps()
                        })
                    }
                }
            }
            getPageProps()
        }
    }, [courseID])

    useEffect(() => {
        const date = new Date(courseCurriculum?.enrollment?.createdAt);
        date.setMonth(date.getMonth() + 6);

        const toady = new Date();
        const diffTime = Math.abs(date - toady);
        const remainingDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        setSubscriptionDaysLeft(remainingDays)
    }, [courseCurriculum])

    const downloadFileHandler = async (itemID) => {
        // if (courseID) {
        //     const params = {
        //         courseID,
        //         itemID,
        //     }
        //     await getCourseItemAPI(params).then((item) => {
        //         router.push(`${item?.data?.url}`)
        //     }).catch((error) => {
        //         console.log(error)
        //         if (error?.response?.status == 401) {
        //             signOutUser()
        //             dispatch({
        //                 type: 'EMPTY_STORE'
        //             });
        //         }
        //     })
        // }
    }

    const getCurrentItemId = (watchedItems, ccSections) => {
        console.log(watchedItems);
        if (watchedItems.length == 0) {
            setCurrentItemId(ccSections[0]?.items?.sort((a, b) => a.sectionItem.order - b.sectionItem.order)[0]?.id)
            router.push(`/myCourse/${courseID}/${ccSections[0]?.items?.sort((a, b) => a.sectionItem.order - b.sectionItem.order)[0]?.id}`)
        }
        else {
            for (let i = ccSections?.length; i > 0; i--) {
                const itemInSection = ccSections[i - 1]?.items?.sort((a, b) => a.sectionItem.order - b.sectionItem.order);
                for (let j = itemInSection?.length; j > 0; j--) {
                    const itemId = itemInSection[j - 1]?.id;
                    if (watchedItems?.some(watchedItem => watchedItem.itemId == itemId)) {
                        if ((j - 1) == ((itemInSection?.length) - 1) && (i - 1) == ((ccSections?.length) - 1)) {
                            setCurrentItemId(ccSections[0]?.items?.sort((a, b) => a.sectionItem.order - b.sectionItem.order)[0].id)
                            router.push(`/myCourse/${courseID}/${ccSections[0]?.items?.sort((a, b) => a.sectionItem.order - b.sectionItem.order)[0].id}`)
                            return
                        } else if ((j - 1) == ((itemInSection?.length) - 1)) {
                            setCurrentItemId(ccSections[i]?.items?.sort((a, b) => a.sectionItem.order - b.sectionItem.order)[0].id)
                            router.push(`/myCourse/${courseID}/${ccSections[i]?.items?.sort((a, b) => a.sectionItem.order - b.sectionItem.order)[0].id}`)
                            return
                        } else {
                            setCurrentItemId(itemInSection[j]?.id)
                            router.push(`/myCourse/${courseID}/${itemInSection[j]?.id}`)
                        }
                        return
                    }
                }
            }
        }
        return null;
    }
    return (
        <>
            {!courseCurriculum ?
                <div className='flex justify-center items-center'>
                    <Spinner />
                </div>
                : isUserEnrolled ?
                    <div className='flex justify-center items-center'>
                        <Spinner />
                    </div>
                    // <div className={`px-4 maxWidthDefault ${styles.myCourseContentMainWrapper}`}>
                    //     <div className={`${styles.myCourseDetailsWrapper} ${styles.boxBorder}`}>
                    //         <div className={styles.courseThumnailDiv}>
                    //             <Image src={courseCurriculum?.course?.pictureKey ? mediaUrl(courseCurriculum?.course?.pictureBucket, courseCurriculum?.course?.pictureKey) : '/images/anaOstori.png'} alt='My Course Image' layout='fill' objectFit="cover" priority />
                    //         </div>
                    //         <div className={styles.courseDetailTextWrapper}>
                    //             <h1 className={`fontBold ${styles.myCourseTitle}`}>{courseCurriculum?.course?.name}</h1>
                    //             <div className='flex items-center pt-2'>
                    //                 <AllIconsComponenet height={20} width={20} iconName={'calander'} color={'#808080'} />
                    //                 <p className='pr-2'>ينتهي الاشتراك بعد {subscriptionDaysLeft} يوم </p>
                    //             </div>
                    //             <div className={styles.watchCourseBtnBox}>
                    //                 <button className='primarySolidBtn' onClick={() => { router.push(`/myCourse/${courseID}/${currentItemId}`) }}>متابعة التقدم</button>
                    //             </div>
                    //         </div>
                    //     </div>
                    //     <div className={`${styles.myCourseInstructorWrapper} ${styles.boxBorder}`}>
                    //         <h1 className={`fontBold ${styles.myCourseInstructorWrapperHeader}`}>المدربين</h1>
                    //         <div className={styles.myCourseInstructorSubWrapper}>
                    //             {courseCurriculum?.course?.instructors?.map((instructor, index) => {
                    //                 return (
                    //                     <TrainerIntroCard instructor={instructor} key={`instructor${index}`} />
                    //                 )
                    //             })}
                    //         </div>
                    //     </div>
                    //     <div className={`${styles.myCourseSessionFilesWrapper} ${styles.boxBorder}`}>
                    //         <div className={styles.myCourseSessionFilesWrapperHeader}>
                    //             <h1 className={`fontBold ${styles.myCourseSessionFilesHeaderText}`}>ملفات الدورة</h1>
                    //         </div>
                    //         {filesInCourse?.map((fileItem, index) => {
                    //             return (
                    //                 <div key={`file${index}`} className={`flex items-center p-3.5 ${styles.fileWrapper}`} onClick={() => downloadFileHandler(fileItem?.id)}>
                    //                     <AllIconsComponenet height={24} width={24} iconName={'file'} color={'#F26722'} />
                    //                     <p className='fontMedium pr-2'>{fileItem.name}</p>
                    //                 </div>
                    //             )
                    //         })}
                    //     </div>
                    //     {courseProgressPrecentage &&
                    //         <div className={`${styles.myCourseStudentProgressWrapper} ${styles.boxBorder}`}>
                    //             <h1 className={`fontBold ${styles.myCourseStudentProgressWrapperHeader}`}>مستوى التقدم</h1>
                    //             <div className={styles.myCourseStudentProgressSubWrapper}>
                    //                 <div className={styles.itemProcessWrapper}>
                    //                     <div className='flex items-center pt-3.5 pl-4'>
                    //                         <div className={styles.iconDiv}>
                    //                             <AllIconsComponenet height={20} width={20} iconName={'playButton'} color={'#F26722'} />
                    //                         </div>
                    //                         <div className='pr-2'>
                    //                             <p className={`fontMedium ${styles.dataAnalyticHeader}`}>الدروس</p>
                    //                             <p className={`fontBold ${styles.proggresPercentage}`}>{parseFloat(courseProgressPrecentage?.videoProgress)?.toFixed(0)}%</p>
                    //                         </div>
                    //                     </div>
                    //                     <div className='flex items-center pt-3.5'>
                    //                         <div className={styles.iconDiv}>
                    //                             <AllIconsComponenet height={20} width={20} iconName={'quiz'} color={'#F26722'} />
                    //                         </div>
                    //                         <div className='pr-2'>
                    //                             <p className={`fontMedium ${styles.dataAnalyticHeader}`}>الاختبارات</p>
                    //                             <p className={`fontBold ${styles.proggresPercentage}`}>{parseFloat(courseProgressPrecentage?.quizProgress)?.toFixed(0)}%</p>
                    //                         </div>
                    //                     </div>
                    //                     <div className='flex items-center pt-3.5'>
                    //                         <div className={styles.iconDiv}>
                    //                             <AllIconsComponenet height={24} width={20} iconName={'file'} color={'#F26722'} />
                    //                         </div>
                    //                         <div className='pr-2'>
                    //                             <p className={`fontMedium ${styles.dataAnalyticHeader}`}>الاختبارات</p>
                    //                             <p className={`fontBold ${styles.proggresPercentage}`}>{parseFloat(courseProgressPrecentage?.fileProgress)?.toFixed(0)}%</p>
                    //                         </div>
                    //                     </div>
                    //                 </div>
                    //                 <div className='pl-8 md:pt-4'>
                    //                     <CompleteCourseIndicator percent={courseProgressPrecentage?.overallProgress} size={smallScreen ? 100 : 150} showExtraDetails={true} color={'#46BD84'} />
                    //                 </div>
                    //             </div>
                    //         </div>
                    //     }
                    // </div>
                    :
                    <div>Please Enrolled Your self to access this course</div>
            }
        </>
    )
}

