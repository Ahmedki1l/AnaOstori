import React, { useEffect, useMemo, useState } from 'react';
import { Form } from 'antd';
import { toast } from 'react-toastify';
import Select from '../../antDesignCompo/Select';
import { FormItem } from '../../antDesignCompo/FormItem';
import CustomButton from '../../CommonComponents/CustomButton';
import { getAuthRouteAPI, postAuthRouteAPI } from '../../../services/apisService';
import { getNewToken } from '../../../services/fireBaseAuthService';
import {
    manageLinkedCoursesConst,
    courseLanguageOptions,
    courseTypeOptions,
    courseLanguageLabel,
    courseTypeLabel,
} from '../../../constants/adminPanelConst/linkedCoursesConst/linkedCoursesConst';
import styles from '../../../styles/InstructorPanelStyleSheets/LinkedCourses.module.scss';

const LinkedCoursesDrawer = ({ courseId, existingLinkedIds, onClose, onCreated }) => {
    const [form] = Form.useForm();
    const [allCourses, setAllCourses] = useState([]);
    const [filterCategory, setFilterCategory] = useState(null);
    const [filterLanguage, setFilterLanguage] = useState(null);
    const [filterType, setFilterType] = useState(null);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, [courseId]);

    const fetchCourses = async () => {
        const body = { routeName: 'coursesForLinking', excludeCourseId: courseId };
        try {
            const res = await getAuthRouteAPI(body);
            setAllCourses(Array.isArray(res?.data) ? res.data : []);
        } catch (error) {
            if (error?.response?.status === 401) {
                try {
                    await getNewToken();
                    const res = await getAuthRouteAPI(body);
                    setAllCourses(Array.isArray(res?.data) ? res.data : []);
                } catch (retryError) {
                    console.error('coursesForLinking retry error:', retryError);
                    toast.error(manageLinkedCoursesConst.toastGenericError);
                }
            } else {
                console.error('coursesForLinking error:', error);
                toast.error(manageLinkedCoursesConst.toastGenericError);
            }
        }
    };

    const categoryOptions = useMemo(() => {
        const seen = new Map();
        allCourses.forEach((c) => {
            const id = c?.catagory?.id;
            const name = c?.catagory?.name;
            if (id && name && !seen.has(id)) seen.set(id, name);
        });
        return Array.from(seen, ([value, label]) => ({ value, label }));
    }, [allCourses]);

    const filteredOptions = useMemo(() => {
        return allCourses
            .filter((c) => !existingLinkedIds?.includes(c.id))
            .filter((c) => !filterCategory || c.catagoryId === filterCategory)
            .filter((c) => !filterLanguage || c.language === filterLanguage)
            .filter((c) => !filterType || c.type === filterType)
            .map((c) => ({
                value: c.id,
                label: `${c.name} — ${c?.catagory?.name || '—'} — ${courseLanguageLabel(c.language)} — ${courseTypeLabel(c.type)}`,
            }));
    }, [allCourses, filterCategory, filterLanguage, filterType, existingLinkedIds]);

    const handleSubmit = async (values) => {
        if (!values.linkedCourseIds || values.linkedCourseIds.length === 0) {
            toast.error(manageLinkedCoursesConst.targetsError);
            return;
        }
        setShowLoader(true);
        const body = {
            routeName: 'addLinkedCourse',
            courseId,
            linkedCourseIds: values.linkedCourseIds,
        };
        try {
            await postAuthRouteAPI(body);
            toast.success(manageLinkedCoursesConst.toastCreated);
            setShowLoader(false);
            onCreated?.();
            onClose?.();
        } catch (error) {
            setShowLoader(false);
            if (error?.response?.status === 401) {
                try {
                    await getNewToken();
                    await postAuthRouteAPI(body);
                    toast.success(manageLinkedCoursesConst.toastCreated);
                    onCreated?.();
                    onClose?.();
                } catch (retryError) {
                    console.error('addLinkedCourse retry error:', retryError);
                    toast.error(manageLinkedCoursesConst.toastGenericError);
                }
            } else {
                const message = error?.response?.data?.message;
                if (message && message.includes('نفسها')) {
                    toast.error(manageLinkedCoursesConst.toastSameCourseError);
                } else {
                    toast.error(manageLinkedCoursesConst.toastGenericError);
                }
            }
        }
    };

    const allOption = [{ value: null, label: manageLinkedCoursesConst.allOption }];

    return (
        <div dir="rtl" className={styles.drawerBody}>
            <p className={styles.helperText}>{manageLinkedCoursesConst.drawerHelper}</p>

            <div className={styles.drawerFilters}>
                <Select
                    width={150}
                    height={40}
                    fontSize={14}
                    placeholder={manageLinkedCoursesConst.filterCategoryLabel}
                    OptionData={[...allOption, ...categoryOptions]}
                    onChange={(v) => setFilterCategory(v)}
                    allowClear
                />
                <Select
                    width={130}
                    height={40}
                    fontSize={14}
                    placeholder={manageLinkedCoursesConst.filterLanguageLabel}
                    OptionData={[...allOption, ...courseLanguageOptions]}
                    onChange={(v) => setFilterLanguage(v)}
                    allowClear
                />
                <Select
                    width={150}
                    height={40}
                    fontSize={14}
                    placeholder={manageLinkedCoursesConst.filterTypeLabel}
                    OptionData={[...allOption, ...courseTypeOptions]}
                    onChange={(v) => setFilterType(v)}
                    allowClear
                />
            </div>

            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <FormItem
                    label={manageLinkedCoursesConst.targetsLabel}
                    name="linkedCourseIds"
                    rules={[{ required: true, message: manageLinkedCoursesConst.targetsError }]}
                >
                    <Select
                        mode="multiple"
                        width={420}
                        height={80}
                        fontSize={14}
                        placeholder={manageLinkedCoursesConst.targetsPlaceHolder}
                        OptionData={filteredOptions}
                        onChange={() => {}}
                    />
                </FormItem>

                <div className={styles.drawerFooter}>
                    <CustomButton
                        btnText={manageLinkedCoursesConst.saveBtn}
                        width={140}
                        height={40}
                        fontSize={16}
                        showLoader={showLoader}
                        type="submit"
                    />
                    <button type="button" className={styles.cancelBtn} onClick={onClose}>
                        {manageLinkedCoursesConst.cancelBtn}
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default LinkedCoursesDrawer;
