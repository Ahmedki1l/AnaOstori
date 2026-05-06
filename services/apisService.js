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
		const requestUrl = originalRequest?.url || 'unknown';

		// Handle 401 errors (expired token)
		if (error?.response?.status === 401 && !originalRequest._retry) {
			console.log(`[API] 401 received for ${requestUrl}, attempting token refresh...`);
			originalRequest._retry = true;

			try {
				// Refresh the token (uses singleton pattern, so concurrent calls wait)
				const newToken = await getNewToken();
				console.log(`[API] Token refresh successful, retrying ${requestUrl}`);
				
				// Update the failed request with new token
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				
				// Retry the original request
				return instance.request(originalRequest);
			} catch (refreshError) {
				// Token refresh failed, redirect to login
				console.error(`[API] Token refresh failed for ${requestUrl}:`, refreshError);

				// Preserve payment form data and any pending exam-result snapshots
				// across the forced logout. The exam snapshots are recovered
				// by _app.js after the user re-authenticates, so an in-flight
				// exam attempt is not lost when the token expires mid-exam.
				const paymentFormData = localStorage.getItem('paymentFormData');
				const pendingExamSnapshots = [];
				try {
					for (let i = 0; i < localStorage.length; i++) {
						const k = localStorage.key(i);
						if (k && k.startsWith('pendingExamResult:')) {
							pendingExamSnapshots.push([k, localStorage.getItem(k)]);
						}
					}
				} catch (e) { }

				localStorage.clear();
				sessionStorage.clear();

				if (paymentFormData) {
					localStorage.setItem('paymentFormData', paymentFormData);
				}
				for (const [k, v] of pendingExamSnapshots) {
					if (v != null) {
						try { localStorage.setItem(k, v); } catch (e) { }
					}
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

				// Preserve payment form data and pending exam snapshots
				// (recovered by _app.js after re-auth so exam progress isn't lost).
				const paymentFormData = localStorage.getItem('paymentFormData');
				const pendingExamSnapshots = [];
				try {
					for (let i = 0; i < localStorage.length; i++) {
						const k = localStorage.key(i);
						if (k && k.startsWith('pendingExamResult:')) {
							pendingExamSnapshots.push([k, localStorage.getItem(k)]);
						}
					}
				} catch (e) { }

				localStorage.clear();
				sessionStorage.clear();

				if (paymentFormData) {
					localStorage.setItem('paymentFormData', paymentFormData);
				}
				for (const [k, v] of pendingExamSnapshots) {
					if (v != null) {
						try { localStorage.setItem(k, v); } catch (e) { }
					}
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

	// Use the correct endpoint based on orderType
	const endpoint = data.orderType === 'book' 
		? '/order/bookPaymentGateway' 
		: '/order/testPaymentGateway';

	return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, payload);
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

// Book Order APIs
export const createBookOrderAPI = (data) => { return instance.post('/order/createBookOrder', data) }
export const getBookPaymentInfoAPI = (data) => { return instance.post('/orders/verifyBookPayment', data) }
export const createBookPaymentCheckoutAPI = (data) => { return instance.post('/order/bookPaymentGateway', data) }

// Phase 2: Coupon, Guest Checkout, Book Orders APIs
export const validateBookCouponAPI = (data) => { 
    return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/validateBookCoupon`, data);
}
export const createGuestBookOrderAPI = (data) => { 
    return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/createGuestBookOrder`, data);
}
export const getMyBookOrdersAPI = () => { 
    return instance.get('/order/myBookOrders');
}

// Torod Address APIs (for delivery city dropdown)
export const getTorodRegionsAPI = () => {
    return axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/torod/regions`);
}
export const getTorodCitiesAPI = (regionId) => {
    return axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/torod/cities?region_id=${regionId}`);
}