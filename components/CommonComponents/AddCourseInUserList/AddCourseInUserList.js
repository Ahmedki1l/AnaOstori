import React, { useEffect, useState } from 'react';
import { manageUserListConst } from '../../../constants/adminPanelConst/manageUserListConst/manageUserListConst';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import Select from '../../antDesignCompo/Select';
import { FormItem } from '../../antDesignCompo/FormItem';
import { getAuthRouteAPI, getRouteAPI, postAuthRouteAPI } from '../../../services/apisService';
import styles from './AddCourseInUserList.module.scss'
import ModelForDeleteItems from '../../ManageLibraryComponent/ModelForDeleteItems/ModelForDeleteItems';
import { dateRange } from '../../../constants/DateConverter';
import { getNewToken } from '../../../services/fireBaseAuthService';


const AddCourseInUserList = ({
    allCourse,
    name,
    enrollment,
    getUserList,
    setDrawerForUsers
}) => {
    const [selectedCourseId, setSelectedCourseId] = useState(enrollment?.courseId)
    const [selectedCourseType, setSelectedCourseType] = useState(enrollment?.type)
    const [regionDataList, setRegionDataList] = useState()
    const [availabilityList, setAvailabilityList] = useState()
    const [selectedRegion, setSelectedRegion] = useState()
    const [selectedAvailability, setSelectedAvailability] = useState()
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)
    const [deleteEnrollmentId, setDeleteEnrollmentId] = useState()

    useEffect(() => {
        getRegionLIst()
        if (enrollment) {
            getAllAvailability(enrollment.courseId)
        }
    }, [])

    useEffect(() => {
        if (enrollment) {
            const selectedAvailabilityDate = availabilityList?.find((date) => date.value === enrollment.availabilityId);
            setSelectedAvailability(selectedAvailabilityDate?.label)
            const selectedRegionData = regionDataList?.find((region) => region.value == enrollment.regionId);
            setSelectedRegion(selectedRegionData?.value)
        }
    }, [])
    const getRegionLIst = async () => {
        await getRouteAPI({ routeName: 'listRegion' }).then((res) => {
            setRegionDataList(res.data.map((obj) => {
                return {
                    key: obj.id,
                    label: obj.nameAr,
                    value: obj.id,
                }
            }))
        }).catch((err) => {
            console.log(err)
        })
    }
    const getAllAvailability = async (courseId) => {
        let body = {
            routeName: 'availabilityByCourse',
            courseId: courseId,
            gender: "all"
        }
        await getAuthRouteAPI(body).then(res => {
            setAvailabilityList(res?.data?.map((obj) => {
                return {
                    key: obj.id,
                    label: dateRange(obj.dateFrom, obj.dateTo),
                    value: obj.id,
                }
            }))
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await getAuthRouteAPI(body).then(res => {
                        setAvailabilityList(res?.data?.map((obj) => {
                            return {
                                key: obj.id,
                                label: dateRange(obj.dateFrom, obj.dateTo),
                                value: obj.id,
                            }
                        }))
                    })
                })
            }
            console.error("Error:", error);
        })
    }
    const handleSelectregion = (value) => {
        setSelectedRegion(value);
    }
    const handleOnSelectCourse = (value, option) => {
        setSelectedCourseId(value)
        setSelectedCourseType(option.type)
        getAllAvailability(value)
    }
    const handleDeleteCourse = (value) => {
        setIsmodelForDeleteItems(true)
        setDeleteEnrollmentId(value)
    }
    const onCloseModal = () => {
        setIsmodelForDeleteItems(false)
    }
    const handleDeleteFolderItems = async () => {
        let deleteEnrollmentBody = {
            routeName: 'updateAdminEnroll',
            data: [{
                id: deleteEnrollmentId.id,
                isDeleted: true
            }]
        }
        await postAuthRouteAPI(deleteEnrollmentBody).then((res) => {
            setDrawerForUsers(false)
            setIsmodelForDeleteItems(false)
            getUserList(1)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postAuthRouteAPI(deleteEnrollmentBody).then((res) => {
                        setIsmodelForDeleteItems(false)
                    })
                })
            }
            console.error("Error:", error);
        })
    }

    const handleSelectAvailability = (value) => {
        setSelectedAvailability(value);
    }

    return (
        <div>
            <div className={`my-4 ${styles.addCourseWrapper}`}>
                <p className={`fontMedium`} style={{ fontSize: '18px' }}>{manageUserListConst.courseTitle}</p>
                <div className='flex cursor-pointer' onClick={() => handleDeleteCourse(enrollment)}>
                    <div style={{ height: '20px' }}>
                        <AllIconsComponenet height={20} width={24} iconName={'newDeleteIcon'} color={'#FF0000'} />
                    </div>
                    <p className={styles.deleteCourseBtn} >{manageUserListConst.deleteCourseBtnText}</p>
                </div>
            </div>
            <FormItem
                name={[name, 'courseId']}
            >
                <Select
                    width={425}
                    height={47}
                    placeholder='selectCourse'
                    onSelect={(value, option) => handleOnSelectCourse(value, option)}
                    OptionData={allCourse}
                    defaultValue={selectedCourseId}
                />
            </FormItem>
            {(selectedCourseType == 'physical') &&
                <>
                    <p className='fontMedium pb-2' style={{ fontSize: '18px' }}>{manageUserListConst.regionHeading}</p>
                    <FormItem
                        name={[name, 'regionId']}
                    >
                        <Select
                            width={425}
                            height={47}
                            placeholder={manageUserListConst.selectRegion}
                            onChange={handleSelectregion}
                            OptionData={regionDataList}
                            defaultValue={selectedRegion}
                        />
                    </FormItem>
                </>

            }
            {(selectedCourseId && selectedCourseType != 'on-demand') &&
                <>
                    <p className='fontMedium pb-2' style={{ fontSize: '18px' }}>{manageUserListConst.datesHeading}</p>
                    <FormItem
                        name={[name, 'availabilityId']}
                    >
                        <Select
                            width={425}
                            height={47}
                            placeholder={manageUserListConst.selectAvailability}
                            onChange={handleSelectAvailability}
                            OptionData={availabilityList}
                            defaultValue={selectedAvailability}
                        />
                    </FormItem>
                </>
            }
            {
                ismodelForDeleteItems &&
                <ModelForDeleteItems
                    ismodelForDeleteItems={ismodelForDeleteItems}
                    onCloseModal={onCloseModal}
                    deleteItemType={'enrolledCourse'}
                    onDelete={handleDeleteFolderItems}
                />
            }
        </div>
    )
}

export default AddCourseInUserList