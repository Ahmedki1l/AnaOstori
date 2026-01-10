/**
 * Form Persistence Utility
 * 
 * Centralized utility for managing payment/booking form data persistence
 * across page navigations and authentication flows.
 */

const STORAGE_KEY = 'paymentFormData';
const TTL_HOURS = 24;

/**
 * Check if we're running in a browser environment
 */
const isBrowser = () => typeof window !== 'undefined';

/**
 * Save payment form data to localStorage
 * @param {Object} data - Form data to save
 * @param {Array} data.studentsData - Array of student form data
 * @param {string} data.courseId - Course ID
 * @param {string} data.courseName - Course name for redirect URL construction
 * @param {string} data.courseType - Type of course (physical, online, on-demand)
 * @param {boolean} data.userAgree - Terms agreement checkbox state
 * @param {string} data.categoryName - Category name for URL construction
 * @param {Object} data.additionalData - Any additional form state to preserve
 */
export const savePaymentFormData = (data) => {
  if (!isBrowser()) return false;
  
  try {
    const payload = {
      ...data,
      timestamp: Date.now(),
      returnPath: window.location.pathname
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    console.log('[FormPersistence] Saved form data:', payload);
    return true;
  } catch (error) {
    console.error('[FormPersistence] Error saving form data:', error);
    return false;
  }
};

/**
 * Get saved payment form data from localStorage
 * @param {string} courseId - Optional course ID to validate against
 * @returns {Object|null} - Saved form data or null if not found/expired
 */
export const getPaymentFormData = (courseId = null) => {
  if (!isBrowser()) return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    
    // Check TTL (24 hours)
    const currentTime = Date.now();
    const timeDiff = currentTime - data.timestamp;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff >= TTL_HOURS) {
      console.log('[FormPersistence] Data expired (age:', hoursDiff.toFixed(2), 'hours)');
      clearPaymentFormData();
      return null;
    }
    
    // Optionally validate course ID matches
    if (courseId && data.courseId !== courseId) {
      console.log('[FormPersistence] Course ID mismatch, ignoring stored data');
      return null;
    }
    
    console.log('[FormPersistence] Retrieved form data:', data);
    return data;
  } catch (error) {
    console.error('[FormPersistence] Error retrieving form data:', error);
    clearPaymentFormData();
    return null;
  }
};

/**
 * Check if valid stored form data exists
 * @param {string} courseId - Optional course ID to validate against
 * @returns {boolean} - True if valid data exists
 */
export const shouldRestoreFormData = (courseId = null) => {
  const data = getPaymentFormData(courseId);
  return data !== null;
};

/**
 * Clear all payment form data from localStorage
 * Also cleans up any legacy keys for backwards compatibility
 */
export const clearPaymentFormData = () => {
  if (!isBrowser()) return;
  
  try {
    // Remove unified key
    localStorage.removeItem(STORAGE_KEY);
    
    // Clean up legacy keys for backwards compatibility
    const legacyKeys = [
      'isFromUserForm',
      'isBackToUserForm',
      'studentsData',
      'courseType',
      'userAgree',
      'courseRegistrationFormData',
      'isFromCourseRegistration',
      'courseBookingFormData',
      'isFromCourseBooking'
    ];
    
    legacyKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('[FormPersistence] Cleared all form data');
  } catch (error) {
    console.error('[FormPersistence] Error clearing form data:', error);
  }
};

/**
 * Get the return path for redirecting back to the form
 * @returns {string|null} - Return path or null if no stored data
 */
export const getReturnPath = () => {
  const data = getPaymentFormData();
  if (!data) return null;
  
  // Use stored returnPath if available
  if (data.returnPath) {
    return data.returnPath;
  }
  
  // Fallback: construct URL from course info
  if (data.courseName) {
    const coursePath = data.courseName.toLowerCase().replace(/\s+/g, '-');
    if (data.categoryName) {
      return `/${data.categoryName}/${coursePath}/bookSit`;
    }
    return `/${coursePath}/bookSit`;
  }
  
  return null;
};

/**
 * Check for any legacy localStorage keys and migrate to new format
 * Call this on app initialization
 */
export const migrateLegacyData = () => {
  if (!isBrowser()) return;
  
  try {
    // Check if we have legacy data
    const isFromUserForm = localStorage.getItem('isFromUserForm');
    const studentsData = localStorage.getItem('studentsData');
    
    if (isFromUserForm && studentsData) {
      console.log('[FormPersistence] Migrating legacy data');
      
      const data = {
        studentsData: JSON.parse(studentsData),
        courseType: JSON.parse(localStorage.getItem('courseType') || 'null'),
        userAgree: JSON.parse(localStorage.getItem('userAgree') || 'false'),
        timestamp: Date.now() // Use current time for migrated data
      };
      
      savePaymentFormData(data);
      clearPaymentFormData(); // This will clear legacy keys
    }
    
    // Also check for courseRegistrationFormData
    const courseRegData = localStorage.getItem('courseRegistrationFormData');
    if (courseRegData) {
      const parsed = JSON.parse(courseRegData);
      savePaymentFormData({
        studentsData: parsed.studentsData,
        courseId: parsed.courseId,
        courseName: parsed.courseName,
        courseType: parsed.courseType,
        userAgree: parsed.userAgree,
        timestamp: parsed.timestamp || Date.now()
      });
    }
  } catch (error) {
    console.error('[FormPersistence] Error migrating legacy data:', error);
    clearPaymentFormData();
  }
};

export default {
  savePaymentFormData,
  getPaymentFormData,
  shouldRestoreFormData,
  clearPaymentFormData,
  getReturnPath,
  migrateLegacyData,
  STORAGE_KEY,
  TTL_HOURS
};
