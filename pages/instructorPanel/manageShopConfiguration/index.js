import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Button, Card, message, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import axios from 'axios';
import BackToPath from '../../../components/CommonComponents/BackToPath';
import styles from '../../../styles/InstructorPanelStyleSheets/ManageBooks.module.scss';

export default function ManageShopConfigurationPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [configId, setConfigId] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchConfiguration();
    }, []);

    const fetchConfiguration = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-any`, {
                params: { collection: 'ShopConfiguration' }
            });

            if (response.data && response.data.length > 0) {
                const config = response.data[0];
                setConfigId(config._id || config.id);
                form.setFieldsValue({
                    deliveryFee: config.deliveryFee || 30,
                    vatPercentage: config.vatPercentage || 15
                });
            } else {
                // Set default values if no config exists
                form.setFieldsValue({
                    deliveryFee: 30,
                    vatPercentage: 15
                });
            }
        } catch (error) {
            console.error('Error fetching configuration:', error);
            message.error('خطأ في تحميل الإعدادات');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (values) => {
        setSaving(true);
        try {
            if (configId) {
                // Update existing config
                await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/update-any`, {
                    collection: 'ShopConfiguration',
                    _id: configId,
                    deliveryFee: values.deliveryFee,
                    vatPercentage: values.vatPercentage
                });
            } else {
                // Create new config
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/insert-any`, {
                    collection: 'ShopConfiguration',
                    deliveryFee: values.deliveryFee,
                    vatPercentage: values.vatPercentage,
                    currency: 'SAR'
                });
                setConfigId(response.data?._id || response.data?.id);
            }
            message.success('تم حفظ الإعدادات بنجاح');
        } catch (error) {
            console.error('Error saving configuration:', error);
            message.error('حدث خطأ أثناء حفظ الإعدادات');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="maxWidthDefault px-4">
            <div style={{ height: 40 }}>
                <BackToPath
                    backpathForPage={true}
                    backPathArray={[
                        { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                        { lable: 'إعدادات المتجر', link: null }
                    ]}
                />
            </div>

            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>إعدادات المتجر</h1>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <div style={{ maxWidth: 600 }}>
                    <Card title="رسوم التوصيل والضريبة" bordered={false}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSave}
                        >
                            <Form.Item
                                name="deliveryFee"
                                label="رسوم التوصيل (ر.س)"
                                rules={[{ required: true, message: 'رسوم التوصيل مطلوبة' }]}
                                extra="سيتم إضافة هذا المبلغ لكل طلب"
                            >
                                <InputNumber
                                    min={0}
                                    step={5}
                                    style={{ width: '100%' }}
                                    placeholder="30"
                                />
                            </Form.Item>

                            <Form.Item
                                name="vatPercentage"
                                label="نسبة ضريبة القيمة المضافة (%)"
                                rules={[{ required: true, message: 'نسبة الضريبة مطلوبة' }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={100}
                                    style={{ width: '100%' }}
                                    placeholder="15"
                                />
                            </Form.Item>

                            <Form.Item style={{ marginTop: 32 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    loading={saving}
                                    size="large"
                                    style={{ 
                                        backgroundColor: '#F26722',
                                        borderColor: '#F26722',
                                        width: '100%'
                                    }}
                                >
                                    حفظ الإعدادات
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            )}
        </div>
    );
}
