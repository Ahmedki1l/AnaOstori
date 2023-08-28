import React, { useEffect, useState } from 'react'
import useWindowSize from '../../../../hooks/useWindoSize'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux';
import { courseCurriculumAPI, getCompleteCourseItemIDAPI, getCourseItemAPI, getCourseProgressAPI, markItemCompleteAPI } from '../../../../services/apisService';
import { signOutUser } from '../../../../services/fireBaseAuthService';
import CCItemListComponent from '../../../../components/WatchCourseComponents/WatchMyCourse/WMC_Components/CCItemListComponent/CCItemListComponent'
import CCItemVideoComponent from '../../../../components/WatchCourseComponents/WatchMyCourse/WMC_Components/CCItemVideoComponent/CCItemVideoComponent';
import CCItemQuizComponent from '../../../../components/WatchCourseComponents/WatchMyCourse/WMC_Components/CCItemQuizComponent/CCItemQuizComponent';
import CCItemFileComponent from '../../../../components/WatchCourseComponents/WatchMyCourse/WMC_Components/CCItemFileComponent/CCItemFileComponent';
import CourseCompleteDialog from '../../../../components/WatchCourseComponents/WatchMyCourse/WMC_Components/CourseCompleteDialog/CourseCompleteDialog';
import styles from '../../../../styles/MyCourseWatch.module.scss'
import Spinner from '../../../../components/CommonComponents/spinner';
import MyCourseDetails from '../../../../components/WatchCourseComponents/MyCourseContent/MyCourseContent';
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet';
import { useSelector } from 'react-redux';



export default function Index() {
    const dispatch = useDispatch();
    const smallScreen = useWindowSize().smallScreen
    const [selectedTab, setSelectedTab] = useState(1)
    const router = useRouter()
    const courseID = router?.query?.courseId
    const currentItemId = router?.query?.itemId
    const [courseCurriculum, setCourseCurriculum] = useState()
    const [courseProgressPrecentage, setCourseProgressPrecentage] = useState()
    const [filesInCourse, setFilesInCourse] = useState([])
    const [ccSections, setCCSections] = useState([])
    const [expandedSection, setExpandedSection] = useState(null);
    const [newSelectedCourseItem, setNewSelectedCourseItem] = useState()
    const [completedCourseItem, setCompletedCourseItem] = useState([])
    const [loading, setLoading] = useState(false)
    const [isUserEnrolled, setIsUserEnrolled] = useState(false)
    console.log(courseID);
    const storeData = useSelector((state) => state?.globalStore);
    const selectedCourse = storeData.myCourses.find((enrollment) => {
        return enrollment.courseId == courseID
    })
    console.log(selectedCourse);


    const chagenCourseItemHendler = (itemId) => {
        getCourseItemHendler(itemId)
    }

    const getCourseItemHendler = async (itemID) => {
        if (itemID) {
            const params = {
                courseID,
                itemID,
            }
            await getCourseItemAPI(params).then((res) => {
                setNewSelectedCourseItem(res.data)
                router.push(`/myCourse/${courseID}/${itemID}`)
            }).catch(error => console.log(error))
        }
    }

    useEffect(() => {
        if (courseID && currentItemId) {
            setLoading(true)
            const getPageProps = async () => {
                try {
                    const params = {
                        courseID,
                        itemID: currentItemId,
                        enrollmentId: selectedCourse.id
                    }
                    console.log(params);
                    const courseCurriculumReq = courseCurriculumAPI(params)
                    const completedCourseItemReq = getCompleteCourseItemIDAPI(params)
                    const courseProgressPrecentageReq = getCourseProgressAPI(params)
                    const currentItemContentReq = getCourseItemAPI(params)

                    const [courseCurriculum, completedCourseItem, courseProgressPrecentage, currentItemContent] = await Promise.all([
                        courseCurriculumReq,
                        completedCourseItemReq,
                        courseProgressPrecentageReq,
                        currentItemContentReq
                    ])
                    setCourseCurriculum(courseCurriculum.data)
                    setFilesInCourse(courseCurriculum?.data?.sections?.sort((a, b) => a.order - b.order)?.flatMap((section) => section?.items?.filter((item) => item.type === 'file')))
                    setCCSections(courseCurriculum?.data?.sections?.sort((a, b) => a.order - b.order))
                    setCourseProgressPrecentage(courseProgressPrecentage.data)
                    setCompletedCourseItem(completedCourseItem.data)
                    setNewSelectedCourseItem(currentItemContent.data)
                    getCurrentItemId(completedCourseItem.data, courseCurriculum?.data?.sections?.sort((a, b) => a.order - b.order))
                    setLoading(false)
                    setIsUserEnrolled(true)
                } catch (error) {
                    if (error?.response?.data?.message == "Enrollment not found") {
                        setLoading(false)
                        setIsUserEnrolled(false)
                    }
                    if (error?.response?.status == 401) {
                        setLoading(false)
                        signOutUser()
                        dispatch({
                            type: 'EMPTY_STORE'
                        });
                    }
                }
            }
            getPageProps()
        }
    }, [courseID, currentItemId])

    useEffect(() => {
        if (!smallScreen) setSelectedTab(1)
    }, [smallScreen])


    const getCurrentItemId = (watchedItems, ccSections) => {
        if (watchedItems.length == 0) {
            setExpandedSection(0)
        }
        else {
            for (let i = ccSections?.length; i > 0; i--) {
                const itemInSection = ccSections[i - 1]?.items?.sort((a, b) => a.sectionItem.order - b.sectionItem.order);
                for (let j = itemInSection?.length; j > 0; j--) {
                    const itemId = itemInSection[j - 1]?.id;
                    if (watchedItems?.some(watchedItem => watchedItem.itemId == itemId)) {
                        if ((j - 1) == ((itemInSection?.length) - 1) && (i - 1) == ((ccSections?.length) - 1)) {
                            setExpandedSection(0)
                            return
                        } else if ((j - 1) == ((itemInSection?.length) - 1)) {
                            setExpandedSection(i)
                            return
                        }
                        else {
                            setExpandedSection(i - 1)
                        }
                        return
                    }
                }
            }
        }
        return null;
    }


    const markItemCompleteHendler = async (itemID) => {
        if (!completedCourseItem?.some(watchedItem => watchedItem.itemId == itemID)) {
            const params = {
                courseID,
                itemID,
                enrollmentId: selectedCourse.id
            }
            await markItemCompleteAPI(params).then((res) => {
                let data = { itemId: itemID }
                setCompletedCourseItem([...completedCourseItem, data])
            }).catch((error) => {
                console.log(error);
            })
        }
        for (let i = 0; i < ccSections?.length; i++) {
            const itemInSection = ccSections[i]?.items?.sort((a, b) => a?.sectionItem?.order - b?.sectionItem?.order);
            for (let j = 0; j < itemInSection?.length; j++) {
                if (itemID == itemInSection[j]?.id) {
                    if (j == ((itemInSection?.length) - 1) && i == ((ccSections?.length) - 1)) {
                        chagenCourseItemHendler(ccSections[0].items.sort((a, b) => a.sectionItem.order - b.sectionItem.order)[0].id)
                        setExpandedSection(0)
                        return
                    }
                    if (j == ((itemInSection?.length) - 1)) {
                        chagenCourseItemHendler(ccSections[i + 1].items.sort((a, b) => a.sectionItem.order - b.sectionItem.order)[0].id)
                        setExpandedSection(i + 1)
                        return
                    }
                    else {
                        chagenCourseItemHendler(itemInSection[j + 1]?.id)
                        setExpandedSection(i)
                    }
                }
            }
        }
    }

    const downloadFileHandler = async (itemID) => {
        if (courseID) {
            await getCourseItemAPI(courseID, itemID).then(async (item) => {
                router.push(`${item.data.url}`)
            }).catch((error) => console.log(error))
        }
    }

    return (
        <>
            {loading ?
                <div className='flex justify-center items-center'>
                    <Spinner />
                </div>
                : isUserEnrolled ?
                    <>
                        <div className={styles.courseCurriculumMainArea}>
                            {selectedTab == 1 && <div className={styles.ccSectionsMainArea}>
                                {ccSections?.map((section, i) => {
                                    return (
                                        <div key={`ccSection${i}`}>
                                            <div className={styles.ccSectionHeaders} onClick={() => setExpandedSection(expandedSection === i ? null : i)}>
                                                <p className={`font-bold ${styles.ccSectionName}`}>{section.name}</p>
                                                <div style={{ height: '18px' }}>
                                                    <div className={expandedSection === i ? `${styles.rotateArrow}` : ''}>
                                                        <AllIconsComponenet iconName={'keyBoardDownIcon'} height={18} width={30} color={'#00A3FF'} />
                                                    </div>
                                                </div>
                                            </div>
                                            {expandedSection === i &&
                                                <div>
                                                    {section?.items?.sort((a, b) => a.sectionItem.order - b.sectionItem.order).map((item, j) => {
                                                        return (
                                                            <div key={`ccSectionItem${j}`}>
                                                                <CCItemListComponent
                                                                    item={item}
                                                                    courseID={courseID}
                                                                    currentItem={item.id == newSelectedCourseItem?.id}
                                                                    chagenCourseItemHendler={chagenCourseItemHendler}
                                                                    completedCourseItem={completedCourseItem}
                                                                />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            }
                                        </div>
                                    )
                                })}
                            </div>}
                            {smallScreen && selectedTab == 2 && <MyCourseDetails courseCurriculum={courseCurriculum} courseID={courseID} courseProgressPrecentage={courseProgressPrecentage} />}
                            {smallScreen && selectedTab == 3 && <>
                                {filesInCourse?.map((fileItem, index) => {
                                    return (
                                        <div key={`file${index}`} className={`flex items-center px-3.5 pb-3.5 pt-4`} onClick={() => downloadFileHandler(fileItem?.id)}>
                                            <AllIconsComponenet height={28} width={28} iconName={'file'} color={'#F26722'} />
                                            <p className='fontMedium pr-2'>{fileItem.name}</p>
                                        </div>
                                    )
                                })}
                            </>}
                            {smallScreen &&
                                <div className={styles.navItemsWrapper}>
                                    <p className={`fontMedium ${styles.navItemText} ${selectedTab == '1' ? `${styles.selectedTab}` : ``}`} onClick={() => setSelectedTab(1)}>المحتوى</p>
                                    <p className={`fontMedium ${styles.navItemText} ${selectedTab == '2' ? `${styles.selectedTab}` : ``}`} onClick={() => setSelectedTab(2)}>الملفات</p>
                                    <p className={`fontMedium ${styles.navItemText} ${selectedTab == '3' ? `${styles.selectedTab}` : ``}`} onClick={() => setSelectedTab(3)}>نظرة عامة</p>
                                </div>
                            }
                            <div className={styles.ccItemDisplayMainArea}>
                                <div className={styles.ccItemContentMainArea}>
                                    {newSelectedCourseItem?.type == "video" &&
                                        <CCItemVideoComponent
                                            newSelectedCourseItem={newSelectedCourseItem}
                                            markItemCompleteHendler={markItemCompleteHendler}
                                        />
                                    }
                                    {newSelectedCourseItem?.type == "file" &&
                                        <CCItemFileComponent
                                            newSelectedCourseItem={newSelectedCourseItem}
                                            markItemCompleteHendler={markItemCompleteHendler}
                                        />
                                    }
                                    {newSelectedCourseItem?.type == "quiz" &&
                                        <CCItemQuizComponent
                                            newSelectedCourseItem={newSelectedCourseItem}
                                        />
                                    }
                                </div>
                                <div className={styles.ccItemDetailsWrapper}>
                                    <h1 className={`font-bold pr-4 pt-4 ${styles.currentItemName}`}>{newSelectedCourseItem?.name}</h1>
                                    <p className={`pr-4 ${styles.currentItemDiscription}`}>{newSelectedCourseItem?.description}</p>
                                    <div className={styles.currentItemBtnBox}>
                                        <button className={`primarySolidBtn ${styles.currentItemBtn}`}>نص ينكتب هنا</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {courseProgressPrecentage?.overallProgress == "100.00" && <div>
                            <CourseCompleteDialog />
                        </div>}
                    </>
                    :
                    <div>Please Enrolled Your self to access this course</div>
            }
        </>
    )
}
