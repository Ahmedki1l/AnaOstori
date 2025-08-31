import axios from 'axios';
import errorHandler from './errorHandlerService';

const baseUrl = process.env.API_BASE_URL;
const publicBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create axios instances with enhanced error handling
const createAxiosInstance = (baseURL, contentType = 'application/json') => {
  const instance = axios.create({
    baseURL,
    timeout: 30000, // 30 seconds timeout
    headers: {
      'Content-Type': contentType,
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add request timestamp for debugging
      config.metadata = { startTime: new Date() };
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor with error handling
  instance.interceptors.response.use(
    (response) => {
      // Log successful requests in development
      if (process.env.NODE_ENV === 'development') {
        const duration = new Date() - response.config.metadata.startTime;
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
      }
      return response;
    },
    async (error) => {
      // Handle errors through centralized error handler
      const errorResult = await errorHandler.handleError(error, 'API Request');
      
      // If error handler suggests retry, retry the request
      if (errorResult.shouldRetry && error.config) {
        try {
          const response = await instance.request(error.config);
          return response;
        } catch (retryError) {
          // If retry fails, throw the original error
          throw error;
        }
      }
      
      // If error handler suggests redirect, handle it
      if (errorResult.shouldRedirect) {
        // Redirect logic is handled in error handler
        return Promise.reject(error);
      }
      
      // For all other cases, reject with the error
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create instances
const authenticatedInstance = createAxiosInstance(baseUrl);
const publicInstance = createAxiosInstance(publicBaseUrl);
const multipartInstance = createAxiosInstance(baseUrl, 'multipart/form-data');

/**
 * Enhanced API methods with comprehensive error handling
 */
export const enhancedApiService = {
  // Generic request methods
  async get(url, config = {}) {
    try {
      const response = await authenticatedInstance.get(url, config);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async post(url, data = {}, config = {}) {
    try {
      const response = await authenticatedInstance.post(url, data, config);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async put(url, data = {}, config = {}) {
    try {
      const response = await authenticatedInstance.put(url, data, config);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async delete(url, config = {}) {
    try {
      const response = await authenticatedInstance.delete(url, config);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async patch(url, data = {}, config = {}) {
    try {
      const response = await authenticatedInstance.patch(url, data, config);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  // Public API methods (no authentication required)
  async publicGet(url, config = {}) {
    try {
      const response = await publicInstance.get(url, config);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async publicPost(url, data = {}, config = {}) {
    try {
      const response = await publicInstance.post(url, data, config);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  // Multipart form data methods
  async uploadFile(url, formData, config = {}) {
    try {
      const response = await multipartInstance.post(url, formData, config);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  // Route-based API methods (maintaining backward compatibility)
  async postRoute(data) {
    try {
      const response = await authenticatedInstance.post('/route', data);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async postAuthRoute(data) {
    try {
      const response = await authenticatedInstance.post('/auth/route/post', data);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async getRoute(params) {
    try {
      const queryParams = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      
      const response = await authenticatedInstance.get(`/route/fetch?${queryParams}`);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async getAuthRoute(params) {
    try {
      const queryParams = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      
      const response = await authenticatedInstance.get(`/auth/route/fetch?${queryParams}`);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  // Collection-based methods
  async getCollection(collectionName, params = {}) {
    try {
      const response = await publicInstance.get('/get-any', {
        params: { collection: collectionName, ...params }
      });
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  // Payment-related methods
  async verifyPayment(data) {
    try {
      const response = await authenticatedInstance.post('/orders/verifyPayment', data);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async verifyFreePayment(data) {
    try {
      const response = await authenticatedInstance.post('/orders/verifyFreePayment', data);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async verifyTabbyPayment(data) {
    try {
      const response = await authenticatedInstance.post('/orders/verifyTabbyPayment', data);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async verifyTamaraPayment(data) {
    try {
      const response = await authenticatedInstance.post('/orders/verifyTamaraPayment', data);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  // File upload methods
  async uploadProfileImage(formData) {
    try {
      const response = await multipartInstance.post('/userprofile/upload', formData);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async uploadFile(formData) {
    try {
      const response = await multipartInstance.post('/file/upload', formData);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  // Blog-specific methods
  async createBlog(data) {
    try {
      const response = await publicInstance.post('/create-blog', data);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async updateBlog(blogId, data) {
    try {
      const response = await publicInstance.put('/update-blog', { blogId, ...data });
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async deleteBlog(blogId) {
    try {
      const response = await publicInstance.delete('/delete-blog', { data: { blogId } });
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async createCategory(data) {
    try {
      const response = await publicInstance.post('/create-category', data);
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async updateCategory(categoryId, data) {
    try {
      const response = await publicInstance.put('/update-category', { categoryId, ...data });
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  async deleteCategory(categoryId) {
    try {
      const response = await publicInstance.put('/delete-category', { categoryId });
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  },

  // Utility methods
  async withRetry(operation, maxRetries = 3, delay = 1000) {
    return errorHandler.withRetry(operation, maxRetries, delay);
  },

  // Error handling utilities
  getErrorLog() {
    return errorHandler.getErrorLog();
  },

  clearErrorLog() {
    return errorHandler.clearErrorLog();
  },

  // Health check method
  async healthCheck() {
    try {
      const response = await publicInstance.get('/health');
      return response;
    } catch (error) {
      throw error; // Error already handled by interceptor
    }
  }
};

// Export individual methods for backward compatibility
export const {
  get,
  post,
  put,
  delete: deleteMethod,
  patch,
  publicGet,
  publicPost,
  uploadFile,
  postRoute,
  postAuthRoute,
  getRoute,
  getAuthRoute,
  getCollection,
  verifyPayment,
  verifyFreePayment,
  verifyTabbyPayment,
  verifyTamaraPayment,
  uploadProfileImage,
  createBlog,
  updateBlog,
  deleteBlog,
  createCategory,
  updateCategory,
  deleteCategory,
  withRetry,
  getErrorLog,
  clearErrorLog,
  healthCheck
} = enhancedApiService;

// Export the main service object
export default enhancedApiService;
