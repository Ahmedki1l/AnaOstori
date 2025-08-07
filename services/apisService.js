import axios from 'axios';

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

export const uploadProfileImage = (data) => { return instance2.post('/userprofile/upload', data?.formData) }
export const uploadFileAPI = (data) => { return instance2.post('/file/upload', data) }

export const getPaymentInfoAPI = (data) => { return instance.post(`/orders/verifyPayment`, data) }
export const getFreePaymentInfoAPI = (data) => { return instance.post(`/orders/verifyFreePayment`, data) }
export const getTabbyPaymentInfoAPI = (data) => { return instance.post(`/orders/verifyTabbyPayment`, data) }
export const getTamaraPaymentInfoAPI = (data) => { return instance.post(`/orders/verifyTamaraPayment`, data) }

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