import React, { useEffect, useState } from 'react'
import styles from '../../../../styles/InstructorPanelStyleSheets/ManageLibrary.module.scss'
import { FormItem } from '../../../../components/antDesignCompo/FormItem'
import Input from '../../../../components/antDesignCompo/Input'
import { Form } from 'antd'
import AllIconsComponenet from '../../../../Icons/AllIconsComponenet'
import CurriculumSectionComponent from '../../../../components/ManageLibraryComponent/CurriculumSectionComponent/CurriculumSectionComponent'
import { useDispatch, useSelector } from 'react-redux'
import { createCurriculumAPI, createCurriculumSectionAPI, getCurriculumDetailsAPI, getCurriculumIdsAPI, getSectionListAPI, updateCurriculumAPI } from '../../../../services/apisService'
import { useRouter } from 'next/router'
import { toastErrorMessage } from '../../../../constants/ar'
import { toast } from 'react-toastify'
import ModelWithOneInput from '../../../../components/CommonComponents/ModelWithOneInput/ModelWithOneInput'

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
    const [curriculmName, setCurriculumName] = useState()
    const [isModelForAddFolderOpen, setIsModelForAddFolderOpen] = useState(false)
    const [sectionDetails, setSectionDetails] = useState([])
    const storeData = useSelector((state) => state?.globalStore);
    const router = useRouter()
    const dispatch = useDispatch()

    console.log(sectionDetails);

    useEffect(() => {
        courseForm.setFieldValue('pathTitle', curriculmName)
        getCurriculumDetails()
        getSectionList()
    }, [curriculmName])

    const getCurriculumDetails = async () => {
        let body = {
            accessToken: storeData?.accessToken,
            curriculumId: routeParams.coursePathId,
        }
        await getCurriculumDetailsAPI(body).then((res) => {
            courseForm.setFieldValue('pathTitle', res.data.name)
            setCurriculumName(res.data.name)
            updateCurriculumList()
        }).catch((error) => {
            console.log(error);
        })
    }

    const getSectionList = async () => {
        let body = {
            accessToken: storeData?.accessToken,
            curriculumId: routeParams.coursePathId,
        }
        console.log(body);
        await getSectionListAPI(body).then((res) => {
            setSectionDetails(res.data)
        }).catch((error) => {
            console.log(error);
        })
    }


    const updateCurriculumList = async () => {
        let data = {
            accessToken: storeData?.accessToken,
        }
        await getCurriculumIdsAPI(data).then((res) => {
            dispatch({
                type: 'SET_CURRICULUMIDS',
                curriculumIds: res.data,
            });
        })

    }

    const onFinishCreateCoursepath = async (item) => {
        if (routeParams.createCoursePath == 'createCoursePath') {
            let addCurriculum = {
                name: item.pathTitle,
            }
            let data = {
                accessToken: storeData?.accessToken,
                data: addCurriculum
            }
            await createCurriculumAPI(data).then((res) => {
                setCurriculumName(res.data.name)
                router.push({
                    pathname: `/instructorPanel/manageLibrary/editCoursePath`,
                    query: { coursePathId: res.data.id },
                });
            }).catch((error) => {
                console.log(error);
                if (error.response.data.message == "Curriculum name already in use") {
                    toast.error(toastErrorMessage.curriculumNameError)
                }
            })
        }
        else {
            let editCurriclum = {
                name: item.pathTitle,
                id: routeParams.coursePathId,
            }
            let body = {
                accessToken: storeData.accessToken,
                data: editCurriclum
            }
            await updateCurriculumAPI(body).then((res) => {
                courseForm.setFieldValue(item.pathTitle)
                setCurriculumName(res.data.data.name)
                courseForm.resetFields()
            }).catch((error) => {
                console.log(error);
                if (error.response.data.message == "Curriculum name already in use") {
                    toast.error(toastErrorMessage.curriculumNameError)
                }
            })
        }
    }
    const handleAddSectionModal = () => {
        // let addSection = {
        //     name: values.name,
        // }
        // console.log(addSection);
        setIsModelForAddFolderOpen(true);
    };

    const handleSection = async ({ name }) => {
        let data = {
            accessToken: storeData.accessToken,
            data: {
                name: name,
                curriculumId: routeParams.coursePathId,
                order: 4
            }
        }
        console.log(data);
        await createCurriculumSectionAPI(data).then((res) => {
            console.log(res);
            setIsModelForAddFolderOpen(false)
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleDeleteSection = () => {
        // don't delete 
    }


    return (
        <div>
            <Form form={courseForm} onFinish={onFinishCreateCoursepath} >
                <div className={styles.borderBottomNavbar}>
                    <div className='maxWidthDefault px-4'>
                        <div className={`${styles.headerWrapper}`}>
                            <h1 className={`head2 py-8`}>{curriculmName ? curriculmName : "إنشاء مقرر"}</h1>
                        </div>
                    </div>
                </div>
                <div className={styles.bodyWrapper}>
                    <div className='maxWidthDefault p-4'>
                        <div className={styles.bodysubWrapper}>
                            <FormItem
                                name={'pathTitle'}
                                rules={[{ required: true, message: 'ادخل عنوان الدورة' }]}>
                                <Input
                                    placeholder="عنوان المقرر"
                                />
                            </FormItem>

                            {(curriculmName && sectionDetails.length == 0) &&
                                <div>
                                    <div className={`head2 py-2`}>
                                        <p>الأقسام</p>
                                    </div>
                                    <div className={styles.addSectionWrapper}>
                                        <div className={styles.tableBodyArea}>
                                            <div className={styles.noDataMainArea}>
                                                <AllIconsComponenet height={92} width={92} iconName={'noData'} color={'#00000080'} />
                                                <p className={`font-semibold py-2 `}>باقي ما أنشئت قسم</p>
                                                <div className={styles.createCourseBtnBox}>
                                                    <button className='primarySolidBtn' onClick={() => handleAddSectionModal()}>إضافة قسم</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            {sectionDetails.length > 0 &&
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
            <ModelWithOneInput
                open={isModelForAddFolderOpen}
                setOpen={setIsModelForAddFolderOpen}
                onSave={handleSection}
                onDelete={handleDeleteSection}
                isEdit={true}
            />
        </div>
    )
}

export default CreateCoursePath