import { getAuthRouteAPI, postAuthRouteAPI } from './apisService'
import { getNewToken } from './fireBaseAuthService'

/**
 * Service for handling QR Code operations
 */
export const qrCodeService = {
    /**
     * Generate a new QR code
     * @param {string} bookName - Name of the book
     * @param {string} url - Target URL for the QR code
     * @param {boolean} regenerate - Whether to regenerate existing QR code
     * @returns {Promise<Object>} - API response with QR code data
     */
    async generateQRCode(bookName, url, regenerate = false) {
        try {
            const requestData = {
                routeName: 'generateQRCode',
                bookName: bookName,
                url: url,
                regenerate: regenerate
            }

            const response = await postAuthRouteAPI(requestData)
            const result = JSON.parse(response.body)
            
            if (result.success) {
                return result.data
            } else {
                throw new Error(result.message || 'Failed to generate QR code')
            }
        } catch (error) {
            console.error('Error generating QR code:', error)
            
            // Handle 401 authentication error with token refresh
            if (error?.response?.status === 401) {
                try {
                    console.log('Token expired, attempting to refresh...')
                    await getNewToken()
                    // Retry once after token refresh
                    const requestData = {
                        routeName: 'generateQRCode',
                        bookName: bookName,
                        url: url,
                        regenerate: regenerate
                    }
                    const response = await postAuthRouteAPI(requestData)
                    const result = JSON.parse(response.body)
                    
                    if (result.success) {
                        return result.data
                    } else {
                        throw new Error(result.message || 'Failed to generate QR code')
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError)
                    throw refreshError
                }
            }
            
            throw error
        }
    },

    /**
     * Get all QR codes with pagination and search
     * @param {number} page - Page number (default: 1)
     * @param {number} limit - Items per page (default: 20)
     * @param {string} search - Search query for book name
     * @returns {Promise<Object>} - API response with paginated QR codes
     */
    async getAllQRCodes(page = 1, limit = 20, search = '') {
        try {
            const requestData = {
                routeName: 'getAllQRCodes',
                page: page,
                limit: limit,
                search: search
            }

            const response = await getAuthRouteAPI(requestData)
            const result = JSON.parse(response.body)
            
            if (result.success) {
                return result.data
            } else {
                throw new Error(result.message || 'Failed to fetch QR codes')
            }
        } catch (error) {
            console.error('Error fetching QR codes:', error)
            
            // Handle 401 authentication error with token refresh
            if (error?.response?.status === 401) {
                try {
                    console.log('Token expired, attempting to refresh...')
                    await getNewToken()
                    // Retry once after token refresh
                    const requestData = {
                        routeName: 'getAllQRCodes',
                        page: page,
                        limit: limit,
                        search: search
                    }
                    const response = await getAuthRouteAPI(requestData)
                    const result = JSON.parse(response.body)
                    
                    if (result.success) {
                        return result.data
                    } else {
                        throw new Error(result.message || 'Failed to fetch QR codes')
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError)
                    throw refreshError
                }
            }
            
            throw error
        }
    },

    /**
     * Delete a QR code
     * @param {string} qrCodeId - QR Code ID (MongoDB ObjectId)
     * @param {boolean} deleteFromS3 - Whether to delete from S3 (default: true)
     * @returns {Promise<Object>} - API response
     */
    async deleteQRCode(qrCodeId, deleteFromS3 = true) {
        try {
            const requestData = {
                routeName: 'deleteQRCode',
                qrCodeId: qrCodeId,
                deleteFromS3: deleteFromS3
            }

            const response = await postAuthRouteAPI(requestData)
            const result = JSON.parse(response.body)
            
            if (result.success) {
                return result
            } else {
                throw new Error(result.message || 'Failed to delete QR code')
            }
        } catch (error) {
            console.error('Error deleting QR code:', error)
            
            // Handle 401 authentication error with token refresh
            if (error?.response?.status === 401) {
                try {
                    console.log('Token expired, attempting to refresh...')
                    await getNewToken()
                    // Retry once after token refresh
                    const requestData = {
                        routeName: 'deleteQRCode',
                        qrCodeId: qrCodeId,
                        deleteFromS3: deleteFromS3
                    }
                    const response = await postAuthRouteAPI(requestData)
                    const result = JSON.parse(response.body)
                    
                    if (result.success) {
                        return result
                    } else {
                        throw new Error(result.message || 'Failed to delete QR code')
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError)
                    throw refreshError
                }
            }
            
            throw error
        }
    }
}

