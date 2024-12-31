
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Spinner from '../../components/CommonComponents/spinner'
import { getAuthRouteAPI, postAuthRouteAPI } from '../../services/apisService'
import styles from '../../styles/MyCourseWatch.module.scss'
import useWindowSize from '../../hooks/useWindoSize'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import CCItemListComponent from '../../components/WatchCourseComponents/WatchMyCourse/WMC_Components/CCItemListComponent/CCItemListComponent'
import CCItemVideoComponent from '../../components/WatchCourseComponents/WatchMyCourse/WMC_Components/CCItemVideoComponent/CCItemVideoComponent'
import CCItemFileComponent from '../../components/WatchCourseComponents/WatchMyCourse/WMC_Components/CCItemFileComponent/CCItemFileComponent'
import CCItemQuizComponent from '../../components/WatchCourseComponents/WatchMyCourse/WMC_Components/CCItemQuizComponent/CCItemQuizComponent'
import CourseCompleteDialog from '../../components/WatchCourseComponents/WatchMyCourse/WMC_Components/CourseCompleteDialog/CourseCompleteDialog'
import { getNewToken } from '../../services/fireBaseAuthService'

const Index = () => {
    const router = useRouter()
    const courseID = router?.query?.courseId;
    const queryEnrollmentID = router?.query?.enrollmentId;
    const queryItemID = router?.query?.itemId;
    const storeData = useSelector((state) => state?.globalStore);
    const [courseCurriculum, setCourseCurriculum] = useState()
    const [currentItemId, setCurrentItemId] = useState()
    const [filesInCourse, setFilesInCourse] = useState()
    const [isUserEnrolled, setIsUserEnrolled] = useState(false)
    const [completedCourseItem, setCompletedCourseItem] = useState([])
    const [newSelectedCourseItem, setNewSelectedCourseItem] = useState()
    const [expandedSection, setExpandedSection] = useState()
    const [ccSections, setCCSections] = useState()
    const [isAllItemsCompleted, setIsAllItemsCompleted] = useState(false)
    const [selectedTab, setSelectedTab] = useState(1)
    const smallScreen = useWindowSize().smallScreen
    const enrollmentId = storeData?.myCourses?.find((course) => {
        return course.courseId = courseID
    })?.id

    const chagenCourseItemHendler = async (itemID) => {
        if (itemID) {
            let currentItemParams = {
                routeName: 'getItemById',
                courseId: courseID,
                itemId: itemID,
            }
            await getAuthRouteAPI(currentItemParams).then((res) => {
                setNewSelectedCourseItem(res.data)
                router.push(`/myCourse?courseId=${courseID}&enrollmentId=${enrollmentId}&itemId=${itemID}`)
            }).catch(async (error) => {
                console.log(error)
                if (error?.response?.status == 401) {
                    await getNewToken().then(async (token) => {
                        await getAuthRouteAPI(currentItemParams).then((res) => {
                            setNewSelectedCourseItem(res.data)
                            router.push(`/myCourse?courseId=${courseID}&enrollmentId=${enrollmentId}&itemId=${itemID}`)
                        }).catch((error) => console.log(error))
                    })
                }
            })
        }
    }

    

    const selectedCourse = storeData.myCourses.find((enrollment) => {
        return enrollment.courseId == courseID
    })
    const markCourseCompleteHandler = async (completedItems, curriculum) => {
        const filteredItems = completedItems.filter(item => item.pass !== false);
        const completedItemIds = new Set(filteredItems.map(item => item.itemId));
        const allItemsCompleted = curriculum.sections.every(section =>
            section.items.every(item => completedItemIds.has(item.id))
        );
        // const sectionItemNotQuiz = curriculum.sections.flatMap((section) =>
        //     section.items.filter((item) => item.type !== "quiz")
        // );
        // const completedSectionItems = [];
        // curriculum.sections.forEach((section) => {
        //     section.items.forEach((item) => {
        //         if (completedItems.some((completedItem) => completedItem.itemId === item.id)) {
        //             completedSectionItems.push(item);
        //         }
        //     });
        // });
        // const allItemsCompleted = completedSectionItems.length === sectionItemNotQuiz.length;

        setIsAllItemsCompleted(allItemsCompleted)
        if (allItemsCompleted) {
            const params = {
                routeName: 'markItemComplete',
                courseId: courseID,
                itemId: currentItemId,
                enrollmentId: selectedCourse?.id,
                type: 'markCourseComplete',
                value: true
            }
            await postAuthRouteAPI(params).then((res) => {
            }).catch((error) => {
                console.log(error);
            })
        }
    }
    const markItemCompleteHendler = async (itemID) => {
        if (!completedCourseItem?.some(watchedItem => watchedItem.itemId == itemID)) {
            const params = {
                routeName: 'markItemComplete',
                courseId: courseID,
                itemId: itemID,
                enrollmentId: selectedCourse?.id,
                type: 'item',
                value: false
            }
            await postAuthRouteAPI(params).then((res) => {
                let data = { itemId: itemID, pass: null }
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
            let currentItemParams = {
                routeName: 'getItemById',
                courseId: courseID,
                itemId: itemID,
            }
            await getAuthRouteAPI(currentItemParams).then((res) => {
                router.push(`${res.data.url}`)
            }).catch((error) => console.log(error))
        }
    }

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
                    enrollmentId: selectedCourse?.id,
                }
                let completedCourseItemParams = {
                    routeName: 'CourseProgress',
                    courseId: courseID,
                    enrollmentId: selectedCourse?.id,
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
                    setCCSections(courseCurriculum?.data?.sections?.sort((a, b) => a.order - b.order))
                    setCompletedCourseItem(completedCourseItem.data)
                    setFilesInCourse(courseCurriculum?.data?.sections?.sort((a, b) => a.order - b.order)?.flatMap((section) => section?.items?.filter((item) => item.type === 'file')))
                    markCourseCompleteHandler(completedCourseItem.data, courseCurriculum.data)
                    setNewSelectedCourseItem(courseCurriculum?.data?.sections?.sort((a, b) => a.order - b.order)[0]?.items?.sort((a, b) => a.sectionItem.order - b.sectionItem.order)[0])
                    getCurrentItemId(completedCourseItem.data, courseCurriculum?.data?.sections?.sort((a, b) => a.order - b.order))
                } catch (error) {
                    if (error?.response?.status == 401) {
                        await getNewToken().then(async (token) => {
                            getPageProps()
                        })
                    }
                }
            }
            setExpandedSection(0)
            getPageProps()

            if (queryItemID) {
                chagenCourseItemHendler(queryItemID); // If itemId exists, use it
            }
        }
    }, [courseID])

    const getCurrentItemId = (watchedItems, ccSections) => {
        if (queryItemID) {
            // If queryItemID exists, use it
            setCurrentItemId(queryItemID);
            return;
        }

        // If no queryItemID, set the first item from the curriculum
        if (watchedItems.length === 0) {
            setCurrentItemId(ccSections[0]?.items[0]?.id);
        } else {
            for (let i = 0; i < ccSections.length; i++) {
                const itemInSection = ccSections[i]?.items.sort((a, b) => a.sectionItem.order - b.sectionItem.order);
                for (let j = 0; j < itemInSection.length; j++) {
                    const itemId = itemInSection[j]?.id;
                    if (watchedItems.some(watchedItem => watchedItem.itemId == itemId)) {
                        setCurrentItemId(itemInSection[j]?.id);
                        return;
                    }
                }
            }
        }
    }

    return (
        <>
            {!courseCurriculum ?
                <div className='flex justify-center items-center'>
                    <Spinner />
                </div>
                :
                isUserEnrolled ?
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
                                            markItemCompleteHendler={markItemCompleteHendler}
                                        />
                                    }
                                </div>
                                <div className={styles.ccItemDetailsWrapper}>
                                    <h1 className={`font-bold pr-4 pt-4 ${styles.currentItemName}`}>{newSelectedCourseItem?.name}</h1>
                                    <p className={`pr-4 ${styles.currentItemDiscription}`}>{newSelectedCourseItem?.description}</p>
                                </div>
                            </div>
                        </div>
                        {(!courseCurriculum.enrollment.isCompleted && isAllItemsCompleted) &&
                            <div>
                                <CourseCompleteDialog />
                            </div>
                        }
                    </>
                    :
                    <div>Please Enrolled Your self to access this course</div>
            }
        </>
    )
}

export default Index
