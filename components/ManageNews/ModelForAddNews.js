import { Form, Modal } from 'antd'
import React, { useEffect } from 'react'
import styles from './ModelForAddNews.module.scss'
import AllIconsComponenet from '../../Icons/AllIconsComponenet'
import { FormItem } from '../antDesignCompo/FormItem'
import Input from '../antDesignCompo/Input'
import { postRouteAPI } from '../../services/apisService'
import { toast } from 'react-toastify'
import { createAndEditBtnText } from '../../constants/ar'
import { getNewToken } from '../../services/fireBaseAuthService'
import { manageNewBarText } from '../../constants/adminPanelConst/manageNewBarText/manageNewBarText'

const ModelForAddNews = ({
    isModelForNews,
    setIsModelForNews,
    isEdit,
    editNews,
    setEditNews,
    getNewsList,
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
        toast.success(msg, { rtl: true, })
    }

    const addNews = async (values) => {
        let body = {
            routeName: "createNewsBar",
            content: values.content
        }
        await postRouteAPI(body).then((res) => {
            getNewsList()
            isModelClose();
            apiSuccessMsg(manageNewBarText.createNewsSuccessMsg)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postRouteAPI(values).then((res) => {
                        getNewsList()
                        isModelClose();
                        apiSuccessMsg(manageNewBarText.createNewsSuccessMsg)
                    })
                }).catch(error => {
                    console.error("Error:", error);
                });
            }
        })
    }

    const editNewsData = async (values) => {
        let body = {
            routeName: "updateNewsBar",
            id: editNews.id,
            content: values.content
        }
        await postRouteAPI(body).then((res) => {
            getNewsList()
            isModelClose()
            apiSuccessMsg(manageNewBarText.updatedNewsSuccessMsg)
        }).catch(async (error) => {
            if (error?.response?.status == 401) {
                await getNewToken().then(async (token) => {
                    await postRouteAPI(values).then((res) => {
                        getNewsList()
                        isModelClose()
                        apiSuccessMsg(manageNewBarText.updatedNewsSuccessMsg)
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
                <p className={`fontBold ${styles.addNews}`}>{isEdit ? manageNewBarText.editNewsTitle : manageNewBarText.addNewsTitle}</p>
            </div>
            <div dir='rtl'>
                <Form form={newsForm} onFinish={onFinish}>
                    <div className={styles.createNewsFields}>
                        <FormItem
                            name={'content'}
                            rules={[{ required: true, message: manageNewBarText.inputTextErrorMsg }]}
                        >
                            <Input
                                fontSize={16}
                                width={352}
                                height={40}
                                placeholder={manageNewBarText.inputText}
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
