import React, { useEffect, useState } from 'react';
import { Drawer, Table } from 'antd';
import { toast } from 'react-toastify';
import AllIconsComponenet from '../../../Icons/AllIconsComponenet';
import Empty from '../../CommonComponents/Empty';
import ModelForDeleteItems from '../../ManageLibraryComponent/ModelForDeleteItems/ModelForDeleteItems';
import LinkedCoursesDrawer from './LinkedCoursesDrawer';
import { getAuthRouteAPI, postAuthRouteAPI } from '../../../services/apisService';
import { getNewToken } from '../../../services/fireBaseAuthService';
import { fullDate } from '../../../constants/DateConverter';
import { mediaUrl } from '../../../constants/DataManupulation';
import {
    manageLinkedCoursesConst,
    courseLanguageLabel,
    courseTypeLabel,
} from '../../../constants/adminPanelConst/linkedCoursesConst/linkedCoursesConst';
import styles from '../../../styles/InstructorPanelStyleSheets/LinkedCourses.module.scss';

const LinkedCourses = ({ courseId }) => {
    const [links, setLinks] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (courseId) fetchLinks();
    }, [courseId]);

    const fetchLinks = async () => {
        const body = { routeName: 'listLinkedCourses', courseId };
        try {
            const res = await getAuthRouteAPI(body);
            setLinks(Array.isArray(res?.data) ? res.data : []);
        } catch (error) {
            if (error?.response?.status === 401) {
                try {
                    await getNewToken();
                    const res = await getAuthRouteAPI(body);
                    setLinks(Array.isArray(res?.data) ? res.data : []);
                } catch (retryError) {
                    console.error('listLinkedCourses retry error:', retryError);
                    toast.error(manageLinkedCoursesConst.toastGenericError);
                }
            } else {
                console.error('listLinkedCourses error:', error);
                toast.error(manageLinkedCoursesConst.toastGenericError);
            }
        }
    };

    const handleOpenDrawer = () => setDrawerOpen(true);
    const handleCloseDrawer = () => setDrawerOpen(false);

    const handleOpenDelete = (record) => {
        setDeleteTarget(record);
        setDeleteModalOpen(true);
    };
    const handleCloseDelete = () => {
        setDeleteModalOpen(false);
        setDeleteTarget(null);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const body = { routeName: 'removeLinkedCourse', id: deleteTarget.id };
        try {
            await postAuthRouteAPI(body);
            toast.success(manageLinkedCoursesConst.toastDeleted);
            fetchLinks();
        } catch (error) {
            if (error?.response?.status === 401) {
                try {
                    await getNewToken();
                    await postAuthRouteAPI(body);
                    toast.success(manageLinkedCoursesConst.toastDeleted);
                    fetchLinks();
                } catch (retryError) {
                    console.error('removeLinkedCourse retry error:', retryError);
                    toast.error(manageLinkedCoursesConst.toastGenericError);
                }
            } else {
                console.error('removeLinkedCourse error:', error);
                toast.error(manageLinkedCoursesConst.toastGenericError);
            }
        }
    };

    const existingLinkedIds = links.map((l) => l?.linkedCourse?.id).filter(Boolean);

    const columns = [
        {
            key: 'courseCell',
            title: manageLinkedCoursesConst.columnCourse,
            dataIndex: 'linkedCourse',
            render: (linkedCourse) => (
                <div className={styles.courseCell}>
                    {linkedCourse?.pictureKey && (
                        <img
                            className={styles.thumbnail}
                            src={mediaUrl(linkedCourse.pictureBucket, linkedCourse.pictureKey)}
                            alt={linkedCourse.name}
                        />
                    )}
                    <span className="fontBold">{linkedCourse?.name}</span>
                </div>
            ),
        },
        {
            key: 'category',
            title: manageLinkedCoursesConst.columnCategory,
            dataIndex: 'linkedCourse',
            render: (linkedCourse) => <span>{linkedCourse?.catagory?.name || '—'}</span>,
        },
        {
            key: 'language',
            title: manageLinkedCoursesConst.columnLanguage,
            dataIndex: 'linkedCourse',
            render: (linkedCourse) => <span>{courseLanguageLabel(linkedCourse?.language)}</span>,
        },
        {
            key: 'type',
            title: manageLinkedCoursesConst.columnType,
            dataIndex: 'linkedCourse',
            render: (linkedCourse) => <span>{courseTypeLabel(linkedCourse?.type)}</span>,
        },
        {
            key: 'createdAt',
            title: manageLinkedCoursesConst.columnCreatedAt,
            dataIndex: 'createdAt',
            render: (createdAt) => <span>{fullDate(createdAt)}</span>,
        },
        {
            key: 'action',
            title: manageLinkedCoursesConst.columnActions,
            dataIndex: 'action',
            render: (_, record) => (
                <div className={styles.actionWrapper}>
                    <div className="cursor-pointer" onClick={() => handleOpenDelete(record)}>
                        <AllIconsComponenet iconName="newDeleteIcon" height={18} width={18} color="#000000" />
                    </div>
                </div>
            ),
        },
    ];

    const tableData = links.map((item) => ({ ...item, key: item.id }));

    const emptyState = (
        <Empty
            emptyText={manageLinkedCoursesConst.emptyText}
            containerhight={400}
            buttonText={manageLinkedCoursesConst.addButton}
            onClick={handleOpenDrawer}
        />
    );

    return (
        <div className={`${styles.wrapper} maxWidthDefault`}>
            <div className={styles.headerArea}>
                <h2 className={`head2 ${styles.headerText}`}>{manageLinkedCoursesConst.sectionHeading}</h2>
                <div className={styles.addBtnBox}>
                    <button className="primarySolidBtn" onClick={handleOpenDrawer}>
                        {manageLinkedCoursesConst.addButton}
                    </button>
                </div>
            </div>
            <p className={styles.helperText}>{manageLinkedCoursesConst.helperText}</p>

            <Table
                columns={columns}
                dataSource={tableData}
                pagination={tableData.length > 10 ? { pageSize: 10 } : false}
                locale={{ emptyText: emptyState }}
            />

            {drawerOpen && (
                <Drawer
                    closable={false}
                    open={drawerOpen}
                    onClose={handleCloseDrawer}
                    width={520}
                    placement="right"
                    title={
                        <p className={`fontBold ${styles.drawerTitleText}`}>
                            {manageLinkedCoursesConst.drawerTitle}
                        </p>
                    }
                >
                    <LinkedCoursesDrawer
                        courseId={courseId}
                        existingLinkedIds={existingLinkedIds}
                        onClose={handleCloseDrawer}
                        onCreated={fetchLinks}
                    />
                </Drawer>
            )}

            {deleteModalOpen && (
                <ModelForDeleteItems
                    ismodelForDeleteItems={deleteModalOpen}
                    onCloseModal={handleCloseDelete}
                    deleteItemType="linkedCourse"
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default LinkedCourses;
