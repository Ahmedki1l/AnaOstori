import React, { useEffect, useState } from 'react'
import styles from '../../../../styles/InstructorPanelStyleSheets/ManageLibrary.module.scss'
import { FormItem } from '../../../../components/antDesignCompo/FormItem'
import Input from '../../../../components/antDesignCompo/Input'
import { Form } from 'antd'
import CurriculumSectionComponent from '../../../../components/ManageLibraryComponent/CurriculumSectionComponent/CurriculumSectionComponent'
import { useDispatch } from 'react-redux'
import { getRouteAPI, postRouteAPI } from '../../../../services/apisService'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import BackToPath from '../../../../components/CommonComponents/BackToPath'
import { curriculumConst } from '../../../../constants/adminPanelConst/manageLibraryConst/manageLibraryConst'
import { getNewToken } from '../../../../services/fireBaseAuthService'

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
    const [curriculmName, setCurriculumName] = useState('')
    const [sectionDetails, setSectionDetails] = useState([])
    const router = useRouter()
    const dispatch = useDispatch()
    const [oldCurriculumName, setOldCurriculumName] = useState('')

    useEffect(() => {
        if (routeParams.createCoursePath == 'editCoursePath') {
            courseForm.setFieldValue('pathTitle', curriculmName)
            getCurriculumDetails()
            getSectionList()
        }
    }, [])
    const getCurriculumDetails = async () => {
        let body = {
            routeName: "getCurriculum",
            curriculumId: routeParams.coursePathId,
        }
        await getRouteAPI(body).then((res) => {
            courseForm.setFieldValue('pathTitle', res.data.name)
            setCurriculumName(res.data.name)
            setOldCurriculumName(res.data.name)
        }).catch(async (error) => {
            console.log(error);
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getRouteAPI(body).then((res) => {
                        courseForm.setFieldValue('pathTitle', res.data.name)
                        setCurriculumName(res.data.name)
                    })
                })
            }
        })
    }
    const getSectionList = async () => {
        let body = {
            routeName: 'getSection',
            curriculumId: routeParams.coursePathId,
        }
        await getRouteAPI(body).then((res) => {
            setSectionDetails(res.data)
        }).catch(async (error) => {
            console.log(error);
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getRouteAPI(body).then((res) => {
                        setSectionDetails(res.data)
                    })
                })
            }
        })
    }


    const updateCurriculumList = async () => {
        await getRouteAPI({ routeName: 'getAllCurriculum' }).then((res) => {
            dispatch({
                type: 'SET_CURRICULUMIDS',
                curriculumIds: res.data,
            });
        })
    }
    const onFinishCreateCoursepath = async () => {
        if (routeParams.createCoursePath == 'createCoursePath') {
            let createBody = {
                routeName: "createCurriculum",
                name: curriculmName,
            }
            await postRouteAPI(createBody).then((res) => {
                toast.success(curriculumConst.curriculumToastMsgConst.addCurriCulumSuccessMsg)
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
            if (oldCurriculumName == curriculmName) {
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
                name: curriculmName,
                id: routeParams.coursePathId,
            }
            await postRouteAPI(editBody).then((res) => {
                setCurriculumName(res.data.name)
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
        <>
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
                        <Form form={courseForm}>
                            <FormItem
                                name={'pathTitle'}
                                rules={[{ required: true, message: curriculumConst.addCurriculumConst.curriculumTitleInputError }]}>
                                <Input
                                    placeholder={curriculumConst.addCurriculumConst.curriculumTitleInputPlaceholder}
                                    value={curriculmName}
                                    onChange={(e) => setCurriculumName(e.target.value)}
                                />
                            </FormItem>
                        </Form>
                        {!(routeParams.createCoursePath == 'createCoursePath') &&
                            <CurriculumSectionComponent
                                onclose={onclose}
                                sectionList={sectionDetails}
                            />
                        }
                        <div className={`${styles.savePathTitle}`}>
                            <button className={`primarySolidBtn ${styles.btnText} `} type='submit' form='courseForm' onClick={onFinishCreateCoursepath}>{curriculmName ? 'حفظ' : 'حفظ ومتابعة'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateCoursePath