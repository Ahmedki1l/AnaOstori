import React, { useEffect, useState } from 'react'
import BackToPath from '../../../components/CommonComponents/BackToPath'
import styles from '../../../styles/InstructorPanelStyleSheets/ManageStateAndBranch.module.scss'
import Empty from '../../../components/CommonComponents/Empty'
import ModelForManageRegion from '../../../components/ManageRegion/ModelForAddRegion'
import { manageStateAndBranchConst } from '../../../constants/adminPanelConst/manageStateAndBranch/manageStateAndBranch'
import AllIconsComponenet from '../../../Icons/AllIconsComponenet'
import ModelForManageBranch from '../../../components/ManageBranch/ModelForManageBranch'
import { fullDate } from '../../../constants/DateConverter'
import { useRouter } from 'next/router'
import { getRouteAPI } from '../../../services/apisService'

const branchDataList = [
    {
        id: "611433e4-b461-4bb2-be5e-3a5b89e9f4af",
        districtTitle: 'district001',
        branchName: 'branch001',
        link: 'https://forms.office.com/r/95nZRZrzy6',
        createdAt: "2023-10-13T04:04:08.000Z",
        updatedAt: "2023-10-13T04:06:32.000Z"
    },
    {
        id: "611433e4-b461-4bb2-be5e-3a5b89e9f4af",
        districtTitle: 'district002',
        branchName: 'branch002',
        link: 'https://forms.office.com/r/95nZRZrzy6',
        createdAt: "2023-10-13T04:04:08.000Z",
        updatedAt: "2023-10-13T04:06:32.000Z"
    }
]

const Index = () => {

    const [isModelForRegion, setIsModelForRegion] = useState(false)
    const [editRegionData, setEditRegionData] = useState()
    const [editBranchData, setEditBranchData] = useState()
    const [isModelForAddBranch, setIsModelForAddBranch] = useState(false)
    const [showRegionDetails, setShowRegionDetails] = useState(false)
    const [showBranchDetails, setShowBranchDetails] = useState(false)
    const [branchData, setBranchData] = useState()
    const [regionDataList, setRegionDataList] = useState()

    const router = useRouter()

    useEffect(() => {
        if (router.query.region == 'all') {
            setShowRegionDetails(true)
            setShowBranchDetails(false)
        } else {
            setShowBranchDetails(true)
            setShowRegionDetails(false)
        }
    }, [router])

    useEffect(() => {
        getRegionAndBranchList()
    }, [])

    const getRegionAndBranchList = async () => {
        let body = {
            routeName: 'listRegion',
        }
        await getRouteAPI(body).then((res) => {
            setRegionDataList(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        }).catch((err) => {
            console.log(err)
        })
    }
    const handleBranchAndAddRegion = () => {
        if (showBranchDetails) {
            setIsModelForAddBranch(true)
        } else {
            setIsModelForRegion(true)
        }
    }
    const handleEditStateAndRegion = (item) => {
        setIsModelForRegion(true)
        setEditRegionData(item)
    }
    const handleAddBranch = (item) => {
        setShowRegionDetails(false)
        setBranchData(item)
        router.push({
            pathname: `/instructorPanel/manageBranches/`,
            query: { region: item.region },
        });
        setShowBranchDetails(true)
    }

    const handleEditBranch = (item) => {
        setIsModelForAddBranch(true)
        setEditBranchData(item)
    }

    return (
        <div>
            <div className="maxWidthDefault">
                <div style={{ height: 40 }}>
                    {showRegionDetails ?
                        <BackToPath
                            backpathForPage={true}
                            backPathArray={
                                [
                                    { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                                    { lable: 'إضافة المناطق', link: null },
                                ]
                            }
                        />
                        :
                        <BackToPath
                            backpathForPage={true}
                            backPathArray={
                                [
                                    { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                                    { lable: 'إضافة المناطق', link: `/instructorPanel/manageBranches?region=all` },
                                    { lable: `فروع منطقة  ${branchData?.region}`, link: null },
                                ]
                            }
                        />
                    }
                </div>
                <div className={`${styles.headerWrapper}`}>
                    <h1 className={`head2 py-4`}>{showBranchDetails ? `منطقة ${branchData?.region}` : 'المناطق'}</h1>
                    <div className={styles.createNewInstructorBtnBox}>
                        <button className='primarySolidBtn' onClick={() => handleBranchAndAddRegion()}>إضافة منطقة</button>
                    </div>
                </div>
                {showRegionDetails &&
                    <table className={styles.tableArea}>
                        <thead className={styles.tableHeaderArea}>
                            <tr>
                                <th className={styles.tableHead1}>{manageStateAndBranchConst.stateTitle}</th>
                                <th className={styles.tableHead2}>{manageStateAndBranchConst.branchTitle}</th>
                                <th className={styles.tableHead3}>{manageStateAndBranchConst.createdAt}</th>
                                <th className={styles.tableHead4}>{manageStateAndBranchConst.updatedAt}</th>
                                <th className={styles.tableHead5}>{manageStateAndBranchConst.action}</th>
                            </tr>
                        </thead>
                        {regionDataList?.length > 0 &&
                            <tbody className={styles.tableBodyArea}>
                                {regionDataList?.map((item, index) => {
                                    return (
                                        <tr key={`tableRow${index}`} className={styles.tableRow}>
                                            <td className='cursor-pointer' onClick={() => handleAddBranch(item)}>{item.nameAr}</td>
                                            <td>branchName</td>
                                            <td>{fullDate(item.createdAt)}</td>
                                            <td>{fullDate(item.updatedAt)}</td>
                                            <td>
                                                <div className='cursor-pointer' onClick={() => handleEditStateAndRegion(item)}>
                                                    <AllIconsComponenet iconName={'newEditIcon'} height={18} width={18} color={'#000000'} />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>}
                    </table>
                }
                {showBranchDetails &&
                    <table className={styles.tableArea}>
                        <thead className={styles.tableHeaderArea}>
                            <tr>
                                <th className={styles.tableHead1}>{manageStateAndBranchConst.branchAddressTitle}</th>
                                <th className={styles.tableHead3}>{manageStateAndBranchConst.createdAt}</th>
                                <th className={styles.tableHead4}>{manageStateAndBranchConst.updatedAt}</th>
                                <th className={styles.tableHead5}>{manageStateAndBranchConst.action}</th>
                            </tr>
                        </thead>
                        {branchDataList.length > 0 &&
                            <tbody className={styles.tableBodyArea}>
                                {branchDataList.map((item, index) => {
                                    return (
                                        <tr key={`tableRow${index}`} className={styles.tableRow}>
                                            <td>{item.districtTitle}</td>
                                            <td>{fullDate(item.createdAt)}</td>
                                            <td>{fullDate(item.updatedAt)}</td>
                                            <td>
                                                <div className='cursor-pointer' onClick={() => handleEditBranch(item)}>
                                                    <AllIconsComponenet iconName={'newEditIcon'} height={18} width={18} color={'#000000'} />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>}
                    </table>
                }
                {regionDataList?.length == 0 &&
                    <div className={styles.tableBodyArea}>
                        <Empty buttonText={manageStateAndBranchConst.emptyBtnText} emptyText={manageStateAndBranchConst.emptyTitleText} containerhight={500} onClick={() => handleBranchAndAddRegion()} />
                    </div>
                }
                {showBranchDetails && branchDataList.length == 0 &&
                    <div className={styles.tableBodyArea}>
                        <Empty buttonText={manageStateAndBranchConst.noBranchBtnText} emptyText={manageStateAndBranchConst.noBranchEmptyText} containerhight={500} onClick={() => handleBranchAndAddRegion()} />
                    </div>
                }
            </div>
            {isModelForRegion &&
                <ModelForManageRegion
                    isModelForRegion={isModelForRegion}
                    setIsModelForRegion={setIsModelForRegion}
                    editRegionData={editRegionData}
                    setEditRegionData={setEditRegionData}
                    getRegionAndBranchList={getRegionAndBranchList}
                />
            }
            {isModelForAddBranch &&
                <ModelForManageBranch
                    isModelForAddBranch={isModelForAddBranch}
                    setIsModelForAddBranch={setIsModelForAddBranch}
                    editBranchData={editBranchData}
                    setEditBranchData={setEditBranchData}
                />
            }
        </div>
    )
}

export default Index