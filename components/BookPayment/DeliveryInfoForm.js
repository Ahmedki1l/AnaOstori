import React, { useEffect, useState } from 'react';
import styles from './DeliveryInfoForm.module.scss';
import { FormItem } from '../antDesignCompo/FormItem';
import Input from '../antDesignCompo/Input';
import { getTorodRegionsAPI, getTorodCitiesAPI } from '../../services/apisService';

export default function DeliveryInfoForm({ formData, setFormData, errors }) {
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingRegions, setLoadingRegions] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);

    // Fetch regions on mount
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const res = await getTorodRegionsAPI();
                setRegions(res.data || []);
            } catch (err) {
                console.error('Error fetching Torod regions:', err);
                // If Torod API fails, allow free-text fallback
                setRegions([]);
            } finally {
                setLoadingRegions(false);
            }
        };
        fetchRegions();
    }, []);

    // Fetch cities when region changes
    useEffect(() => {
        if (!formData.regionId) {
            setCities([]);
            return;
        }
        const fetchCities = async () => {
            setLoadingCities(true);
            try {
                const res = await getTorodCitiesAPI(formData.regionId);
                setCities(res.data || []);
            } catch (err) {
                console.error('Error fetching Torod cities:', err);
                setCities([]);
            } finally {
                setLoadingCities(false);
            }
        };
        fetchCities();
    }, [formData.regionId]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRegionChange = (e) => {
        const regionId = e.target.value;
        const selectedRegion = regions.find(r => String(r.id) === regionId);
        setFormData(prev => ({
            ...prev,
            regionId: regionId,
            region: selectedRegion?.nameAr || selectedRegion?.name || '',
            // Reset city when region changes
            city: '',
            torodCityId: null
        }));
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        const selectedCity = cities.find(c => String(c.id) === cityId);
        setFormData(prev => ({
            ...prev,
            city: selectedCity?.nameAr || selectedCity?.name || '',
            torodCityId: selectedCity?.id || null
        }));
    };

    // Check if dropdowns are available (Torod API loaded successfully)
    const hasRegions = regions.length > 0;

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
                                placeholder="05xxxxxxxx"
                                value={formData.buyerPhone}
                                onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, '');
                                    if (digits.length <= 10) {
                                        handleInputChange('buyerPhone', digits);
                                    }
                                }}
                                maxLength={10}
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
                {/* Region Dropdown */}
                <div className={styles.inputGroup}>
                    <FormItem
                        name="region"
                        validateStatus={errors?.region ? 'error' : ''}
                        help={errors?.region}
                    >
                        <div className={styles.inputWrapper}>
                            <label className={styles.inputLabel}>المنطقة *</label>
                            {hasRegions ? (
                                <select
                                    value={formData.regionId || ''}
                                    onChange={handleRegionChange}
                                    className={styles.selectInput}
                                    disabled={loadingRegions}
                                >
                                    <option value="">
                                        {loadingRegions ? 'جاري التحميل...' : 'اختر المنطقة'}
                                    </option>
                                    {regions.map(region => (
                                        <option key={region.id} value={region.id}>
                                            {region.nameAr || region.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <Input
                                    placeholder="المنطقة"
                                    value={formData.region || ''}
                                    onChange={(e) => handleInputChange('region', e.target.value)}
                                    height={48}
                                    fontSize={16}
                                />
                            )}
                        </div>
                    </FormItem>
                </div>

                {/* City Dropdown */}
                <div className={styles.inputGroup}>
                    <FormItem
                        name="city"
                        validateStatus={errors?.city ? 'error' : ''}
                        help={errors?.city}
                    >
                        <div className={styles.inputWrapper}>
                            <label className={styles.inputLabel}>المدينة *</label>
                            {hasRegions ? (
                                <select
                                    value={formData.torodCityId || ''}
                                    onChange={handleCityChange}
                                    className={styles.selectInput}
                                    disabled={!formData.regionId || loadingCities}
                                >
                                    <option value="">
                                        {loadingCities ? 'جاري تحميل المدن...' : 
                                         !formData.regionId ? 'اختر المنطقة أولاً' : 'اختر المدينة'}
                                    </option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.id}>
                                            {city.nameAr || city.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <Input
                                    placeholder="الرياض"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    height={48}
                                    fontSize={16}
                                />
                            )}
                        </div>
                    </FormItem>
                </div>
            </div>

            <div className={styles.inputRow}>
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
            </div>

            <div className={styles.inputRow}>
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
            </div>

            <div className={styles.inputRow}>
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
        </div>
    );
}
