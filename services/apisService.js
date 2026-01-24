import axios from 'axios';
import { getNewToken } from './fireBaseAuthService';

const baseUrl = process.env.API_BASE_URL;

const instance = axios.create({
	baseURL: baseUrl,
	headers: () => ({
		Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
		'Content-Type': 'application/json',
	}),
})


instance.interceptors.request.use(
	(config) => {
		config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for automatic token refresh on 401 errors
instance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Handle 401 errors (expired token)
		if (error?.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Refresh the token
				const newToken = await getNewToken();
				
				// Update the failed request with new token
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				
				// Retry the original request
				return instance.request(originalRequest);
			} catch (refreshError) {
				// Token refresh failed, redirect to login
				console.error('Token refresh failed:', refreshError);
				
				// Preserve payment form data before clearing
				const paymentFormData = localStorage.getItem('paymentFormData');
				
				localStorage.clear();
				sessionStorage.clear();
				
				if (paymentFormData) {
					localStorage.setItem('paymentFormData', paymentFormData);
				}
				
				if (typeof window !== 'undefined') {
					window.location.href = '/login';
				}
				
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

const instance2 = axios.create({
	baseURL: baseUrl,
	headers: () => ({
		Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
		'Content-Type': 'multipart/form-data',
	}),
})
instance2.interceptors.request.use(
	(config) => {
		config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for automatic token refresh on 401 errors (multipart instance)
instance2.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Handle 401 errors (expired token)
		if (error?.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Refresh the token
				const newToken = await getNewToken();
				
				// Update the failed request with new token
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				
				// Retry the original request
				return instance2.request(originalRequest);
			} catch (refreshError) {
				// Token refresh failed, redirect to login
				console.error('Token refresh failed:', refreshError);
				
				// Preserve payment form data before clearing
				const paymentFormData = localStorage.getItem('paymentFormData');
				
				localStorage.clear();
				sessionStorage.clear();
				
				if (paymentFormData) {
					localStorage.setItem('paymentFormData', paymentFormData);
				}
				
				if (typeof window !== 'undefined') {
					window.location.href = '/login';
				}
				
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export const uploadProfileImage = (data) => { return instance2.post('/userprofile/upload', data?.formData) }
export const uploadFileAPI = (data) => { return instance2.post('/file/upload', data) }

export const getPaymentInfoAPI = (data) => { return instance.post(`/orders/verifyPayment`, data) }
export const getFreePaymentInfoAPI = (data) => { return instance.post(`/orders/verifyFreePayment`, data) }
export const getTabbyPaymentInfoAPI = (data) => { return instance.post(`/orders/verifyTabbyPayment`, data) }
export const getTamaraPaymentInfoAPI = (data) => { return instance.post(`/orders/verifyTamaraPayment`, data) }
export const createTamaraCheckoutAPI = (data = {}) => {
	const payload = {
		...data,
		type: 'tamara',
	};

	return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/testPaymentGateway`, payload);
}

export const postRouteAPI = (data) => { return instance.post(`/route`, data) }

export const postAuthRouteAPI = (data) => { return instance.post(`/auth/route/post`, data) }

export const getRouteAPI = (data) => {
	const queryParams = Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&');

	return instance.get(`/route/fetch?${queryParams}`)
}

export const getAuthRouteAPI = (data) => {
	const queryParams = Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&');

	return instance.get(`/auth/route/fetch?${queryParams}`)
}