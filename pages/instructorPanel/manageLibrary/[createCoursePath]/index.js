import React, { useEffect, useState } from 'react'
import styles from '../../../../styles/InstructorPanelStyleSheets/ManageLibrary.module.scss'
import { FormItem } from '../../../../components/antDesignCompo/FormItem'
import Input from '../../../../components/antDesignCompo/Input'
import { Form } from 'antd'
import CurriculumSectionComponent from '../../../../components/ManageLibraryComponent/CurriculumSectionComponent/CurriculumSectionComponent'
import { useDispatch } from 'react-redux'
import { getCurriculumDetailsAPI, getCurriculumIdsAPI, getSectionListAPI, postRouteAPI, updateCurriculumAPI } from '../../../../services/apisService'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import BackToPath from '../../../../components/CommonComponents/BackToPath'
import { curriculumConst } from '../../../../constants/adminPanelConst/manageLibraryConst/manageLibraryConst'

export async function getServerSideProps(context) {
    const params = context.query
    if (!(params.createCoursePath == 'createCoursePath') && !(params.createCoursePath == 'editCoursePath')) {
        return {
            notFound: true,
        }
    }
    return {
        props: {
            params: params,
        }
    }
}

const CreateCoursePath = (props) => {
    const routeParams = props.params
    const [courseForm] = Form.useForm();
    const [curriculmName, setCurriculumName] = useState(routeParams?.coursePathId ? routeParams?.coursePathId : "")
    const [sectionDetails, setSectionDetails] = useState([])
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        if (routeParams.createCoursePath == 'editCoursePath') {
            courseForm.setFieldValue('pathTitle', curriculmName)
            getCurriculumDetails()
            getSectionList()
        }
    }, [curriculmName])

    const getCurriculumDetails = async () => {
        let body = {
            curriculumId: routeParams.coursePathId,
        }
        await getCurriculumDetailsAPI(body).then((res) => {
            courseForm.setFieldValue('pathTitle', res.data.name)
            setCurriculumName(res.data.name)
        }).catch((error) => {
            console.log(error);
        })
    }
    const getSectionList = async () => {
        let body = {
            curriculumId: routeParams.coursePathId,
        }
        await getSectionListAPI(body).then((res) => {
            setSectionDetails(res.data)
        }).catch((error) => {
            console.log(error);
        })
    }


    const updateCurriculumList = async () => {
        await getCurriculumIdsAPI().then((res) => {
            console.log(res);
            dispatch({
                type: 'SET_CURRICULUMIDS',
                curriculumIds: res.data,
            });
        })

    }

    const onFinishCreateCoursepath = async (item) => {
        if (routeParams.createCoursePath == 'createCoursePath') {
            let createBody = {
                routeName: "createCurriculum",
                name: item.pathTitle,
            }
            await postRouteAPI(createBody).then(async (res) => {
                toast.success(curriculumConst.curriculumToastMsgConst.addCurriCulumSuccessMsg)
                setCurriculumName(res.data.name)
                router.push({
                    pathname: `/instructorPanel/manageLibrary/editCoursePath`,
                    query: { coursePathId: res.data.id },
                });
                updateCurriculumList()
            }).catch((error) => {
                console.log(error);
                if (error.response.data.message == "Curriculum name already in use") {
                    toast.error(curriculumConst.curriculumToastMsgConst.curriculumNameDuplicateErrorMsg)
                }
            })
        }
        else {
            if (item.pathTitle == curriculmName) {
                router.push({
                    pathname: `/instructorPanel/manageLibrary`,
                    query: { folderType: 'curriculum' }
                });
                updateCurriculumList()
                toast.success(curriculumConst.curriculumToastMsgConst.editCurriculumSuccessMsg)
                return
            }
            let editBody = {
                routeName: "updateCurriculumHandler",
                name: item.pathTitle,
                id: routeParams.coursePathId,
            }
            console.log(editBody);
            await postRouteAPI(editBody).then((res) => {
                console.log(res);
                updateCurriculumList()
                router.push({
                    pathname: `/instructorPanel/manageLibrary`,
                    query: { folderType: 'curriculum' }
                });
                // courseForm.setFieldValue(item.pathTitle)
                // setCurriculumName(res.data.data.name)
                toast.success(curriculumConst.curriculumToastMsgConst.editCurriculumSuccessMsg)
            }).catch((error) => {
                console.log(error);
                if (error.response.data.message == "Curriculum name already in use") {
                    toast.error(curriculumConst.curriculumToastMsgConst.curriculumNameDuplicateErrorMsg)
                }
            })
        }
    }

    return (
        <div>
            <Form form={courseForm} onFinish={onFinishCreateCoursepath} >
                <div className={styles.borderBottomNavbar}>
                    <div className='maxWidthDefault px-4'>
                        <BackToPath
                            backpathForPage={true}
                            backPathArray={
                                [
                                    { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel' },
                                    { lable: 'إدارة المكتبة الرقمية', link: '/instructorPanel/manageLibrary?folderType=curriculum' },
                                    { lable: 'إدارة المكتبة الرقمية', link: null },
                                ]
                            }
                        />
                        <div className={`${styles.headerWrapper}`}>
                            <h1 className={`head2 py-8`}>{curriculmName ? curriculmName : 'إضافة مقرر'}</h1>
                        </div>
                    </div>
                </div>
                <div className={styles.bodyWrapper}>
                    <div className='maxWidthDefault p-4'>
                        <div className={styles.bodysubWrapper}>
                            <h1 className={` py-4`}>{curriculumConst.addCurriculumConst.addCurriculumTitle}</h1>
                            <FormItem
                                name={'pathTitle'}
                                rules={[{ required: true, message: curriculumConst.addCurriculumConst.curriculumTitleInputError }]}>
                                <Input
                                    placeholder={curriculumConst.addCurriculumConst.curriculumTitleInputPlaceholder}
                                    value={curriculmName}
                                />
                            </FormItem>
                            {(curriculmName && sectionDetails) &&
                                <CurriculumSectionComponent
                                    onclose={onclose}
                                    sectionList={sectionDetails}
                                />
                            }
                            <div className={`${styles.savePathTitle}`}>
                                {!curriculmName && <button className={`primarySolidBtn ${styles.btnText} `} type='submit'>حفظ ومتابعة</button>}
                                {curriculmName && <button className={`primarySolidBtn ${styles.btnText}`} type='submit'>حفظ</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default CreateCoursePath