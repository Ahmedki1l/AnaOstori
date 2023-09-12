import { Form, Modal } from 'antd'
import React, { useEffect } from 'react'
import styles from './ModelForAddNews.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import { FormItem } from '../antDesignCompo/FormItem'
import Input from '../antDesignCompo/Input'
import { createNewsAPI, editNewsAPI } from '../../services/apisService'

const ModelForAddNews = ({
    isModelForNews,
    setIsModelForNews,
    isEdit,
    editNews,
    setEditNews,
    getNewsList
}) => {
    const [newsForm] = Form.useForm()

    useEffect(() => {
        newsForm.setFieldsValue(editNews)
    }, [])

    const isModelClose = () => {
        newsForm.resetFields()
        setEditNews()
        setIsModelForNews(false)
    }
    const onFinish = (values) => {
        if (isEdit) {
            editNewsData(values)
        } else {
            addNews(values)
        }
    };

    const addNews = async (values) => {
        await createNewsAPI(values).then((res) => {
            setIsModelForNews(false)
            newsForm.resetFields()
            getNewsList()
        }).catch((err) => {
            console.log(err);
        })
    }

    const editNewsData = async (values) => {
        values.id = editNews.id
        await editNewsAPI(values).then((res) => {
            setIsModelForNews(false)
            newsForm.resetFields()
            getNewsList()
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <Modal
            className='addAppoinmentModal'
            open={isModelForNews}
            onCancel={isModelClose}
            closeIcon={false}
            footer={false}>

            <div className={styles.modalHeader}>
                <button onClick={isModelClose} className={styles.closebutton}>
                    <AllIconsComponenet iconName={'closeicon'} height={14} width={14} color={'#000000'} /></button>
                <p className={`fontBold ${styles.addNews}`}>إضافة مدرب</p>
            </div>
            <div dir='rtl'>
                <Form form={newsForm} onFinish={onFinish}>
                    <div className={styles.createNewsFields}>
                        <FormItem
                            name={'content'}
                            rules={[{ required: true, message: "ادخل رابط الفرع" }]}
                        >
                            <Input
                                fontSize={16}
                                width={352}
                                height={40}
                                placeholder='اسم المدرب'
                            />
                        </FormItem>
                        <FormItem
                            name={'link'}
                        >
                            <Input
                                fontSize={16}
                                width={352}
                                height={40}
                                placeholder='الايميل'
                            />
                        </FormItem>
                    </div>
                    <div className={styles.newsFieldBorderBottom}>
                        <button key='modalFooterBtn' className={styles.AddFolderBtn} type={'submit'} >حفظ</button>
                    </div>
                </Form>
            </div>
        </Modal>
    )
}

export default ModelForAddNews
