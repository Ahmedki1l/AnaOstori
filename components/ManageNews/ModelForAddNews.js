import { Form, Modal } from 'antd'
import React, { useEffect } from 'react'
import styles from './ModelForAddNews.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import { FormItem } from '../antDesignCompo/FormItem'
import Input from '../antDesignCompo/Input'
import { createNewsAPI, editNewsAPI } from '../../services/apisService'
import { toast } from 'react-toastify'
import { createAndEditBtnText, manageNewsConst, toastSuccessMessage } from '../../constants/ar'
import { getNewToken } from '../../services/fireBaseAuthService'

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

    const apiSuccessMsg = (msg) => {
        toast.success(msg)
    }

    const addNews = async (values) => {
        await createNewsAPI(values).then((res) => {
            apiSuccessMsg(toastSuccessMessage.createNewsSuccessMsg)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await createNewsAPI(values).then((res) => {
                        apiSuccessMsg(toastSuccessMessage.createNewsSuccessMsg)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }

    const editNewsData = async (values) => {
        console.log(values);
        values.id = editNews.id
        await editNewsAPI(values).then((res) => {
            apiSuccessMsg(toastSuccessMessage.updatedNewsSuccessMsg)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await editNewsAPI(values).then((res) => {
                        apiSuccessMsg(toastSuccessMessage.updatedNewsSuccessMsg)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
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
                <p className={`fontBold ${styles.addNews}`}>{isEdit ? manageNewsConst.editNewsTitle : manageNewsConst.addNewsTitle}</p>
            </div>
            <div dir='rtl'>
                <Form form={newsForm} onFinish={onFinish}>
                    <div className={styles.createNewsFields}>
                        <FormItem
                            name={'content'}
                            rules={[{ required: true, message: manageNewsConst.addNewsErrorMsg }]}
                        >
                            <Input
                                fontSize={16}
                                width={352}
                                height={40}
                                placeholder='النص'
                            />
                        </FormItem>
                    </div>
                    <div className={styles.newsFieldBorderBottom}>
                        <button key='modalFooterBtn' className='primarySolidBtn' type={'submit'} >{isEdit ? createAndEditBtnText.saveBtnText : createAndEditBtnText.addBtnText}</button>
                    </div>
                </Form>
            </div>
        </Modal>
    )
}

export default ModelForAddNews
