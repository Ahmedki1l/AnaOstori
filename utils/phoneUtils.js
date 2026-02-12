/**
 * Converts Saudi phone number from user format (05xxxxxxxx) to backend format (+9665xxxxxxxx)
 * @param {string} phone - Phone number input (05xxxxxxxx or +9665xxxxxxxx)
 * @returns {string} - Backend-compatible format (+9665xxxxxxxx)
 */
export const convertPhoneToBackendFormat = (phone) => {
  if (!phone) return phone;
  
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // Already in correct format
  if (cleaned.startsWith('+9665') && cleaned.length === 13) {
    return cleaned;
  }
  
  // Convert 05xxxxxxxx to +9665xxxxxxxx
  if (cleaned.startsWith('05') && cleaned.length === 10) {
    return '+966' + cleaned.substring(1);
  }
  
  // Convert 5xxxxxxxx to +9665xxxxxxxx
  if (cleaned.startsWith('5') && cleaned.length === 9) {
    return '+966' + cleaned;
  }
  
  // Return as-is if unrecognized format
  return phone;
};
