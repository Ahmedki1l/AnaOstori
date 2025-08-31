// src/components/BlogAdmin/BlogModal.js
import React, { useState } from 'react';
import styles from './BlogModal.module.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { uploadFileSevices } from '../../services/UploadFileSevices';

export default function BlogModal({ blog, categories, onSave, onClose }) {
    // 1) seed sections with an `id`
    const initialSections = (blog?.sections || []).map(sec => ({
        id: sec.id || Date.now().toString(),
        head: sec.head || '',
        content: sec.content || '',
        imagePreview: sec.image || '',
        imageFile: null
    }))

    const [title, setTitle] = useState(blog?.title || '')
    const [description, setDescription] = useState(blog?.description || '')
    const [categoryId, setCategoryId] = useState(blog?.categoryId || '')
    const [heroImageFile, setHeroImageFile] = useState(null)
    const [heroImagePreview, setHeroImagePreview] = useState(blog?.image || '')
    const [addingHeroImage, setAddingHeroImage] = useState(false)
    const [sections, setSections] = useState(initialSections)
    const [addingImageFor, setAddingImageFor] = useState(null)
    const [loading, setLoading] = useState(false)

    // add blank section
    const addSection = () => {
        setSections(s => [
            ...s,
            { id: Date.now().toString(), head: '', content: '', image: '' }
        ])
    }

    // update single section field
    const updateSection = (idx, field, val) => {
        setSections(s =>
            s.map((sec, i) => i === idx ? { ...sec, [field]: val } : sec)
        )
    }

    // remove a section
    const removeSection = idx => {
        setSections(s => s.filter((_, i) => i !== idx))
        if (addingImageFor === idx) setAddingImageFor(null)
    }

    // handle local file -> dataURL for sections
    const handleLocalImage = (evt, idx) => {
        const file = evt.target.files?.[0];
        if (!file) return;
        const newPreviews = URL.createObjectURL(file);
        updateSection(idx, 'imageFile', file);
        updateSection(idx, 'imagePreview', newPreviews);
        setAddingImageFor(null);
    }

    // handle local file -> dataURL for hero image
    const handleLocalHeroImage = evt => {
        const file = evt.target.files?.[0];
        if (!file) return;
        const newPreviews = URL.createObjectURL(file);
        setHeroImageFile(file);
        setHeroImagePreview(newPreviews);
        setAddingHeroImage(false);
    }

    // submit to your backend
    const handleSave = async () => {
        const sectionsWithoutId = sections.map(({ id, ...rest }) => rest);
        console.log("🚀 ~ handleSave ~ sectionsWithoutId:", sectionsWithoutId);

        // 1) validation (required fields…)
        if (!title.trim()) {
            toast.warn("العنوان مطلوب", { rtl: true });
            return;
        }
        if (!categoryId) {
            toast.warn("اختر تصنيفًا", { rtl: true });
            return;
        }

        setLoading(true);
        try {
            // 2) HERO IMAGE
            let finalHeroUrl = '';
            if (heroImagePreview) {
                // If already on S3, keep it
                if (heroImagePreview.includes("https://phase2anaostori.s3.eu-central-1.amazonaws.com/blog/")) {
                    finalHeroUrl = heroImagePreview;
                } else {
                    try {
                        finalHeroUrl = await uploadFileSevices(heroImageFile, () => { }, null, "blog");
                        console.log("🚀 ~ imageFiles.map ~ s3Url:", finalHeroUrl);
                    } catch (error) {
                        console.error("Error uploading new question image during update:", error);
                        toast.error("فشل تحميل صورة المدونة الجديدة", { rtl: true });
                        setLoading(false);
                        return;
                    }
                }
            }

            // 3) SECTION IMAGES
            const processedSections = await Promise.all(
                sectionsWithoutId.map(async sec => {
                    let imgUrl = '';
                    if (sec.imagePreview) {
                        if (typeof sec.imagePreview === 'string' && sec.imagePreview.includes("https://phase2anaostori.s3.eu-central-1.amazonaws.com/blog/")) {
                            imgUrl = sec.imagePreview;
                        } else {
                            try {
                                imgUrl = await uploadFileSevices(sec.imageFile, () => { }, null, "blog");
                            } catch (error) {
                                console.error("Error uploading new question image during update:", error);
                                toast.error("فشل تحميل صورة القسم الجديدة", { rtl: true });
                                setLoading(false);
                                return;
                            }
                        }
                    }
                    return {
                        head: sec.head.trim(),
                        content: sec.content.trim(),
                        image: imgUrl
                    };
                })
            );

            // 4) build payload
            const payload = {
                title,
                description,
                categoryId,
                image: finalHeroUrl,
                sections: processedSections
            };

            // 5) call your API
            let response;
            if (blog?._id) {
                // update
                response = await axios.put(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/update-blog`,
                    { blogId: blog._id, ...payload }
                );
                toast.success("تم تحديث المقال بنجاح", { rtl: true });
            } else {
                // create
                response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/create-blog`,
                    payload
                );
                toast.success("تم إضافة المقال بنجاح", { rtl: true });
            }

            onSave(response.data);
            onClose();
        } catch (error) {
            console.error("Blog upload error:", error);
            
            // Handle different error status codes
            if (error.response?.status === 400) {
                if (error.response.data?.message?.includes('duplicate')) {
                    toast.error('عنوان المقال موجود بالفعل', { rtl: true });
                } else {
                    toast.error('بيانات غير صحيحة، يرجى التحقق من المدخلات', { rtl: true });
                }
            } else if (error.response?.status === 404) {
                toast.error('المقال أو التصنيف غير موجود', { rtl: true });
            } else if (error.response?.status === 500) {
                toast.error('حدث خطأ في الخادم، يرجى المحاولة مرة أخرى', { rtl: true });
            } else if (error.response?.status === 405) {
                toast.error('طريقة الطلب غير مسموحة', { rtl: true });
            } else if (!error.response) {
                toast.error('خطأ في الاتصال بالشبكة، يرجى التحقق من اتصال الإنترنت', { rtl: true });
            } else {
                toast.error("فشل حفظ المقال، حاول مرة أخرى", { rtl: true });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose} dir="rtl">
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose}>✕</button>
                <h2 className={styles.title}>{blog ? 'تعديل مقال' : 'إضافة مقال'}</h2>

                <div className={styles.formGroup}>
                    <label>العنوان:</label>
                    <input 
                        value={title} 
                        onChange={e => setTitle(e.target.value)}
                        disabled={loading}
                        placeholder="أدخل عنوان المقال"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>الوصف:</label>
                    <textarea 
                        value={description} 
                        onChange={e => setDescription(e.target.value)}
                        disabled={loading}
                        placeholder="أدخل وصف المقال"
                    />
                </div>

                {/* — Hero Image — */}
                <div className={styles.formGroup}>
                    <label>صورة المقال الرئيسية:</label>
                    {heroImagePreview ? (
                        <div className={styles.imagePreviewContainer}>
                            <img src={heroImagePreview} alt="Hero" className={styles.imagePreview} />
                            <button
                                type="button"
                                className={styles.removeImageBtn}
                                onClick={() => setHeroImagePreview('')}
                                disabled={loading}
                            >
                                X
                            </button>
                        </div>
                    ) : addingHeroImage ? (
                        <div className={styles.imageInputGroup}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLocalHeroImage}
                                className={styles.imageFileInput}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className={styles.cancelImageBtn}
                                onClick={() => setAddingHeroImage(false)}
                                disabled={loading}
                            >
                                إلغاء
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className={styles.addImageBtn}
                            onClick={() => setAddingHeroImage(true)}
                            disabled={loading}
                        >
                            + إضافة صورة رئيسية
                        </button>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label>التصنيف:</label>
                    <select 
                        value={categoryId} 
                        onChange={e => setCategoryId(e.target.value)}
                        disabled={loading}
                    >
                        <option value=''>— اختر تصنيف —</option>
                        {categories.map(c => (
                            <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                    </select>
                </div>

                <h3 className={styles.subTitle}>أقسام المقال</h3>
                {sections.map((sec, idx) => (
                    <div key={sec.id} className={styles.sectionRow}>
                        <div className={styles.removeButtonHolder}>
                            <button
                                className={styles.removeSectionBtn}
                                onClick={() => removeSection(idx)}
                                disabled={loading}
                            >
                                X
                            </button>
                        </div>
                        <div className={styles.formGroup}>
                            <label>العنوان الفرعي:</label>
                            <input
                                value={sec.head}
                                onChange={e => updateSection(idx, 'head', e.target.value)}
                                disabled={loading}
                                placeholder="أدخل العنوان الفرعي"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>محتوى الفقرة:</label>
                            <textarea
                                value={sec.content}
                                onChange={e => updateSection(idx, 'content', e.target.value)}
                                disabled={loading}
                                placeholder="أدخل محتوى الفقرة"
                            />
                        </div>

                        {/* section image */}
                        {sec.imagePreview ? (
                            <div className={styles.imagePreviewContainer}>
                                <label>صورة القسم:</label>
                                <img src={sec.imagePreview} alt="صورة القسم" className={styles.imagePreview} />
                                <button
                                    className={styles.removeImageBtn}
                                    onClick={() => updateSection(idx, 'imagePreview', '')}
                                    disabled={loading}
                                >
                                    X
                                </button>
                            </div>
                        ) : addingImageFor === idx ? (
                            <div className={styles.imageInputGroup}>
                                <label>صورة القسم:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleLocalImage(e, idx)}
                                    className={styles.imageFileInput}
                                    disabled={loading}
                                />
                                <button
                                    className={styles.cancelImageBtn}
                                    onClick={() => setAddingImageFor(null)}
                                    disabled={loading}
                                >
                                    إلغاء
                                </button>
                            </div>
                        ) : (
                            <>
                                <label>صورة القسم:</label>
                                <button
                                    className={styles.addImageBtn}
                                    onClick={() => setAddingImageFor(idx)}
                                    disabled={loading}
                                >
                                    + إضافة صورة
                                </button>
                            </>
                        )}
                    </div>
                ))}

                <button 
                    className={styles.addSectionBtn} 
                    onClick={addSection}
                    disabled={loading}
                >
                    + إضافة قسم جديد
                </button>

                <div className={styles.actions}>
                    <button 
                        className={styles.cancelBtn} 
                        onClick={onClose}
                        disabled={loading}
                    >
                        إلغاء
                    </button>
                    <button 
                        className={styles.saveBtn} 
                        onClick={handleSave}
                        disabled={loading || !title.trim() || !categoryId}
                    >
                        {loading ? 'جاري الحفظ...' : 'حفظ'}
                    </button>
                </div>
            </div>
        </div>
    )
}
