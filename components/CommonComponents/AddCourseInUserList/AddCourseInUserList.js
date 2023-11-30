import React, { useEffect, useState } from 'react';
import { manageUserListConst } from '../../../constants/adminPanelConst/manageUserListConst/manageUserListConst';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import Select from '../../antDesignCompo/Select';
import { FormItem } from '../../antDesignCompo/FormItem';
import { getRouteAPI } from '../../../services/apisService';
import styles from './AddCourseInUserList.module.scss'
import ModelForDeleteItems from '../../ManageLibraryComponent/ModelForDeleteItems/ModelForDeleteItems';
import { dateRange, fullDate } from '../../../constants/DateConverter';


const AddCourseInUserList = ({
    selectedUserDetails,
    enrolledCourseList,
    setEnrolledCourseList,
    category,

}) => {
    const [selectedCourse, setSelectedCourse] = useState()
    const [regionDataList, setRegionDataList] = useState()
    const [selectedRegion, setSelectedRegion] = useState()
    const [ismodelForDeleteItems, setIsmodelForDeleteItems] = useState(false)

    useEffect(() => {
        getRegionLIst()
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
    const handleSelectregion = (value) => {
        setSelectedRegion(value);
    }
    const handleSelectCourse = (value) => {
        setSelectedCourse(value);
    }
    const enrolledCourse = selectedUserDetails?.enrollments.map((item) => {
        return { label: item.course.name, value: item.course.id }
    })
    const selectedCourseType = selectedUserDetails?.enrollments.filter((item) => selectedCourse?.includes(item.course.id)).map((item, index) => {
        return item.course.type
    })

    const handleDeleteCourse = () => {
        setIsmodelForDeleteItems(true)
    }
    const onCloseModal = () => {
        setIsmodelForDeleteItems(false)
    }
    const handleDeleteFolderItems = async () => {
        console.log('delete');
    }
    const allCourse = category.flatMap((item) => {
        return item.courses.map((subItem) => {
            return { value: subItem.id, label: subItem.name };
        });
    });
    return (
        <div>
            <div className={`my-4 ${styles.addCourseWrapper}`}>
                <p className={`fontMedium`} style={{ fontSize: '18px' }}>{manageUserListConst.courseTitle}</p>
                <div className='flex cursor-pointer' onClick={handleDeleteCourse}>
                    <div style={{ height: '20px' }}>
                        <AllIconsComponenet height={20} width={24} iconName={'newDeleteIcon'} color={'#FF0000'} />
                    </div>
                    <p className={styles.deleteCourseBtn} >{manageUserListConst.deleteCourseBtnText}</p>
                </div>
            </div>
            <FormItem
                name={'allCourses'}>
                <Select
                    width={425}
                    height={47}
                    placeholder='selectCourse'
                    onChange={handleSelectCourse}
                    OptionData={allCourse}
                    defaultValue={selectedCourse}
                />
            </FormItem>
            <div className={styles.courseNames}>
                {selectedUserDetails?.enrollments.filter((item) => selectedCourse?.includes(item.course.id)).map((item, index) => {
                    return (
                        <p key={index} style={{ fontSize: '16px' }}>{item.course.type}</p>
                    )
                })}
            </div>
            {selectedCourseType == 'physical' &&
                <>
                    <p className='fontMedium pb-2' style={{ fontSize: '18px' }}>{manageUserListConst.regionHeading}</p>
                    <FormItem
                        name={'regionId'}>
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
            {selectedCourseType.length > 0 && selectedCourseType != 'on-demand' &&
                <>
                    <p className='fontMedium pb-2' style={{ fontSize: '18px' }}>{manageUserListConst.datesHeading}</p>
                    <div className={styles.courseNames}>
                        {selectedUserDetails?.enrollments.filter((item) => selectedCourse?.includes(item.course.id)).map((item, index) => {
                            return (
                                <p key={index} style={{ fontSize: '16px' }}>{item?.availability?.dateFrom ? dateRange(item?.availability?.dateFrom, item?.availability?.dateTo) : 'اختار الموعد'}</p>
                            )
                        })}
                    </div>
                </>
            }
            {ismodelForDeleteItems &&
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