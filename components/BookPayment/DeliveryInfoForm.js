import React from 'react';
import styles from './DeliveryInfoForm.module.scss';
import { FormItem } from '../antDesignCompo/FormItem';
import Input from '../antDesignCompo/Input';

export default function DeliveryInfoForm({ formData, setFormData, errors }) {
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>بيانات المستلم</h2>
            
            <div className={styles.inputGroup}>
                <FormItem
                    name="buyerFullName"
                    validateStatus={errors?.buyerFullName ? 'error' : ''}
                    help={errors?.buyerFullName}
                >
                    <div className={styles.inputWrapper}>
                        <label className={styles.inputLabel}>الاسم الكامل *</label>
                        <Input
                            placeholder="أدخل اسمك الكامل"
                            value={formData.buyerFullName}
                            onChange={(e) => handleInputChange('buyerFullName', e.target.value)}
                            height={48}
                            fontSize={16}
                        />
                    </div>
                </FormItem>
            </div>

            <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                    <FormItem
                        name="buyerPhone"
                        validateStatus={errors?.buyerPhone ? 'error' : ''}
                        help={errors?.buyerPhone}
                    >
                        <div className={styles.inputWrapper}>
                            <label className={styles.inputLabel}>رقم الجوال *</label>
                            <Input
                                placeholder="+966501234567"
                                value={formData.buyerPhone}
                                onChange={(e) => handleInputChange('buyerPhone', e.target.value)}
                                height={48}
                                fontSize={16}
                            />
                        </div>
                    </FormItem>
                </div>

                <div className={styles.inputGroup}>
                    <FormItem
                        name="buyerEmail"
                        validateStatus={errors?.buyerEmail ? 'error' : ''}
                        help={errors?.buyerEmail}
                    >
                        <div className={styles.inputWrapper}>
                            <label className={styles.inputLabel}>البريد الإلكتروني *</label>
                            <Input
                                placeholder="example@email.com"
                                value={formData.buyerEmail}
                                onChange={(e) => handleInputChange('buyerEmail', e.target.value)}
                                height={48}
                                fontSize={16}
                            />
                        </div>
                    </FormItem>
                </div>
            </div>

            <div className={styles.sectionDivider}>
                <span>عنوان التوصيل</span>
            </div>

            <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                    <FormItem
                        name="city"
                        validateStatus={errors?.city ? 'error' : ''}
                        help={errors?.city}
                    >
                        <div className={styles.inputWrapper}>
                            <label className={styles.inputLabel}>المدينة *</label>
                            <Input
                                placeholder="الرياض"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                height={48}
                                fontSize={16}
                            />
                        </div>
                    </FormItem>
                </div>

                <div className={styles.inputGroup}>
                    <FormItem
                        name="district"
                        validateStatus={errors?.district ? 'error' : ''}
                        help={errors?.district}
                    >
                        <div className={styles.inputWrapper}>
                            <label className={styles.inputLabel}>الحي *</label>
                            <Input
                                placeholder="حي النرجس"
                                value={formData.district}
                                onChange={(e) => handleInputChange('district', e.target.value)}
                                height={48}
                                fontSize={16}
                            />
                        </div>
                    </FormItem>
                </div>
            </div>

            <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                    <FormItem
                        name="street"
                        validateStatus={errors?.street ? 'error' : ''}
                        help={errors?.street}
                    >
                        <div className={styles.inputWrapper}>
                            <label className={styles.inputLabel}>الشارع *</label>
                            <Input
                                placeholder="شارع الملك فهد"
                                value={formData.street}
                                onChange={(e) => handleInputChange('street', e.target.value)}
                                height={48}
                                fontSize={16}
                            />
                        </div>
                    </FormItem>
                </div>

                <div className={styles.inputGroup}>
                    <FormItem
                        name="buildingNumber"
                        validateStatus={errors?.buildingNumber ? 'error' : ''}
                        help={errors?.buildingNumber}
                    >
                        <div className={styles.inputWrapper}>
                            <label className={styles.inputLabel}>رقم المبنى *</label>
                            <Input
                                placeholder="1234"
                                value={formData.buildingNumber}
                                onChange={(e) => handleInputChange('buildingNumber', e.target.value)}
                                height={48}
                                fontSize={16}
                            />
                        </div>
                    </FormItem>
                </div>
            </div>

            <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                    <FormItem
                        name="additionalCode"
                        validateStatus={errors?.additionalCode ? 'error' : ''}
                        help={errors?.additionalCode}
                    >
                        <div className={styles.inputWrapper}>
                            <label className={styles.inputLabel}>الرمز الإضافي</label>
                            <Input
                                placeholder="1234"
                                value={formData.additionalCode}
                                onChange={(e) => handleInputChange('additionalCode', e.target.value)}
                                height={48}
                                fontSize={16}
                            />
                        </div>
                    </FormItem>
                </div>

                <div className={styles.inputGroup}>
                    <FormItem
                        name="postalCode"
                        validateStatus={errors?.postalCode ? 'error' : ''}
                        help={errors?.postalCode}
                    >
                        <div className={styles.inputWrapper}>
                            <label className={styles.inputLabel}>الرمز البريدي *</label>
                            <Input
                                placeholder="12345"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                height={48}
                                fontSize={16}
                            />
                        </div>
                    </FormItem>
                </div>
            </div>

            <div className={styles.inputGroup}>
                <FormItem
                    name="shortAddress"
                    validateStatus={errors?.shortAddress ? 'error' : ''}
                    help={errors?.shortAddress}
                >
                    <div className={styles.inputWrapper}>
                        <label className={styles.inputLabel}>العنوان المختصر</label>
                        <Input
                            placeholder="AAAA1234"
                            value={formData.shortAddress}
                            onChange={(e) => handleInputChange('shortAddress', e.target.value)}
                            height={48}
                            fontSize={16}
                        />
                    </div>
                </FormItem>
            </div>
        </div>
    );
}
