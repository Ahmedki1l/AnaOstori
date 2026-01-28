import React, { useEffect, useState } from 'react';
import { ConfigProvider, Table, Modal, Form, Input, InputNumber, Switch, Upload, Button, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import styled from 'styled-components';
import BackToPath from '../../../components/CommonComponents/BackToPath';
import { uploadFileSevices } from '../../../services/UploadFileSevices';
import { mediaUrl } from '../../../constants/DataManupulation';
import styles from '../../../styles/InstructorPanelStyleSheets/ManageBooks.module.scss';

const StyledTable = styled(Table)`
    .ant-table-thead > tr > th {
        background-color: #FAFAFA;
        font-weight: 600;
    }
`;

export default function ManageBooksPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-any`, {
                params: { collection: 'Books' }
            });
            setBooks(response.data || []);
        } catch (error) {
            console.error('Error fetching books:', error);
            message.error('خطأ في تحميل الكتب');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (book = null) => {
        setEditingBook(book);
        if (book) {
            form.setFieldsValue({
                title: book.title,
                description: book.description,
                price: book.price,
                stock: book.stock,
                published: book.published
            });
            if (book.pictureKey && book.pictureBucket) {
                setImagePreview(mediaUrl(book.pictureBucket, book.pictureKey));
            }
        } else {
            form.resetFields();
            setImagePreview('');
        }
        setImageFile(null);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setEditingBook(null);
        form.resetFields();
        setImageFile(null);
        setImagePreview('');
    };

    const handleImageChange = (info) => {
        const file = info.file.originFileObj || info.file;
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (values) => {
        setSubmitting(true);
        try {
            let pictureKey = editingBook?.pictureKey || '';
            let pictureBucket = editingBook?.pictureBucket || '';

            // Upload image if new file selected
            if (imageFile) {
                try {
                    const uploadedUrl = await uploadFileSevices(
                        imageFile, 
                        (progress) => console.log('Upload progress:', progress),
                        null,
                        'book' // type for books
                    );
                    
                    // Extract key from the uploaded URL
                    if (uploadedUrl) {
                        // The URL format is: https://bucket.s3.amazonaws.com/key
                        const urlParts = uploadedUrl.split('.s3.');
                        if (urlParts.length > 1) {
                            const pathParts = urlParts[1].split('/');
                            pictureBucket = urlParts[0].replace('https://', '');
                            pictureKey = pathParts.slice(1).join('/').split('?')[0];
                        }
                    }
                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                    message.error('خطأ في رفع الصورة');
                    setSubmitting(false);
                    return;
                }
            }

            const bookData = {
                collection: 'Books',
                title: values.title,
                description: values.description,
                price: values.price,
                stock: values.stock || 0,
                published: values.published || false,
                pictureKey,
                pictureBucket
            };

            if (editingBook) {
                // Update book
                await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/update-any`, {
                    ...bookData,
                    _id: editingBook._id || editingBook.id
                });
                message.success('تم تحديث الكتاب بنجاح');
            } else {
                // Create new book
                await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/insert-any`, bookData);
                message.success('تم إضافة الكتاب بنجاح');
            }

            handleCloseModal();
            fetchBooks();
        } catch (error) {
            console.error('Error saving book:', error);
            message.error('حدث خطأ أثناء حفظ الكتاب');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (bookId) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/delete-any`, {
                data: { collection: 'Books', _id: bookId }
            });
            message.success('تم حذف الكتاب بنجاح');
            fetchBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
            message.error('حدث خطأ أثناء حذف الكتاب');
        }
    };

    const columns = [
        {
            title: 'الصورة',
            dataIndex: 'pictureKey',
            width: 80,
            render: (_, record) => (
                <div className={styles.bookThumbnail}>
                    {record.pictureKey ? (
                        <img 
                            src={mediaUrl(record.pictureBucket, record.pictureKey)} 
                            alt={record.title}
                            className={styles.thumbnailImage}
                        />
                    ) : (
                        <div className={styles.noImage}>📚</div>
                    )}
                </div>
            )
        },
        {
            title: 'عنوان الكتاب',
            dataIndex: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title)
        },
        {
            title: 'السعر',
            dataIndex: 'price',
            width: 120,
            sorter: (a, b) => a.price - b.price,
            render: (price) => `${price} ر.س`
        },
        {
            title: 'المخزون',
            dataIndex: 'stock',
            width: 100,
            sorter: (a, b) => a.stock - b.stock,
            render: (stock) => (
                <span style={{ color: stock > 0 ? '#00BD5D' : '#DC3545' }}>
                    {stock || 0}
                </span>
            )
        },
        {
            title: 'الحالة',
            dataIndex: 'published',
            width: 100,
            render: (published) => (
                <span className={published ? styles.statusActive : styles.statusInactive}>
                    {published ? 'منشور' : 'مسودة'}
                </span>
            )
        },
        {
            title: 'الإجراءات',
            dataIndex: 'actions',
            width: 120,
            render: (_, record) => (
                <div className={styles.actionButtons}>
                    <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => handleOpenModal(record)}
                    />
                    <Popconfirm
                        title="هل أنت متأكد من حذف هذا الكتاب؟"
                        onConfirm={() => handleDelete(record._id || record.id)}
                        okText="نعم"
                        cancelText="لا"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            )
        }
    ];

    return (
        <div className="maxWidthDefault px-4">
            <div style={{ height: 40 }}>
                <BackToPath
                    backpathForPage={true}
                    backPathArray={[
                        { lable: 'صفحة الأدمن الرئيسية', link: '/instructorPanel/' },
                        { lable: 'إدارة الكتب', link: null }
                    ]}
                />
            </div>

            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>إدارة الكتب</h1>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenModal()}
                    className={styles.addButton}
                >
                    إضافة كتاب جديد
                </Button>
            </div>

            <ConfigProvider direction="rtl">
                <StyledTable
                    columns={columns}
                    dataSource={books}
                    loading={loading}
                    rowKey={(record) => record._id || record.id}
                    pagination={{
                        pageSize: 10,
                        position: ['bottomCenter']
                    }}
                />

                <Modal
                    title={editingBook ? 'تعديل الكتاب' : 'إضافة كتاب جديد'}
                    open={modalVisible}
                    onCancel={handleCloseModal}
                    footer={null}
                    width={600}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        className={styles.bookForm}
                    >
                        <Form.Item
                            name="title"
                            label="عنوان الكتاب"
                            rules={[{ required: true, message: 'عنوان الكتاب مطلوب' }]}
                        >
                            <Input placeholder="أدخل عنوان الكتاب" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="وصف الكتاب"
                            rules={[{ required: true, message: 'وصف الكتاب مطلوب' }]}
                        >
                            <Input.TextArea rows={4} placeholder="أدخل وصف الكتاب" />
                        </Form.Item>

                        <div className={styles.formRow}>
                            <Form.Item
                                name="price"
                                label="السعر (ر.س)"
                                rules={[{ required: true, message: 'السعر مطلوب' }]}
                            >
                                <InputNumber 
                                    min={0} 
                                    placeholder="150" 
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="stock"
                                label="المخزون"
                            >
                                <InputNumber 
                                    min={0} 
                                    placeholder="100" 
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </div>

                        <Form.Item label="صورة الكتاب">
                            <Upload
                                accept="image/*"
                                showUploadList={false}
                                beforeUpload={() => false}
                                onChange={handleImageChange}
                            >
                                <Button icon={<UploadOutlined />}>اختر صورة</Button>
                            </Upload>
                            {imagePreview && (
                                <div className={styles.imagePreview}>
                                    <img src={imagePreview} alt="Preview" />
                                </div>
                            )}
                        </Form.Item>

                        <Form.Item
                            name="published"
                            label="نشر الكتاب"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="منشور" unCheckedChildren="مسودة" />
                        </Form.Item>

                        <div className={styles.formActions}>
                            <Button onClick={handleCloseModal}>إلغاء</Button>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                {editingBook ? 'تحديث' : 'إضافة'}
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </ConfigProvider>
        </div>
    );
}
