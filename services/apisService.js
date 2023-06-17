import axios from 'axios';

const baseUrl = process.env.API_BASE_URL;

const instance = (accessToken) => {
	return axios.create({
		baseURL: baseUrl,
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		}
	})
}

const instance2 = (accessToken) => {
	console.log('instance2s');
	return axios.create({
		baseURL: baseUrl,
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'multipart/form-data'
		}
	})
}

// export const uploadProfileImage = (data) => {
// 	return axios.post(`${baseUrl}/userprofile/upload`, data?.formData, {
// 		headers: {
// 			'Authorization': `Bearer ${data?.accessToken}`,
// 			'Content-Type': 'multipart/form-data'
// 		}
// 	})
// }

export const uploadProfileImage = (data) => { return instance2(data?.accessToken).post('/userprofile/upload', data?.formData) }
export const uploadCourseFileAPI = (data) => { return instance2(data?.accessToken).post('/file/upload', data?.formData) }


export const createOrderAPI = (data) => { return instance(data?.accessToken).post(`/createOrder`, data?.orderData) }
export const getMyOrderAPI = (data) => { return instance(data?.accessToken).get(`/order/query`) }
export const getPaymentInfoAPI = (data) => { return instance(data?.accessToken).post(`/orders/verifyPayment/${data?.orderID}/${data?.transactionID}`) }
export const getCourseDetailsAPI = (data) => { return instance(data?.accessToken).get(`/courseByName/${data?.courseName}`) }
export const getCatagoriesAPI = (data) => { return instance(data?.accessToken).get(`/catagories`) }
export const courseCurriculumAPI = (data) => { return instance(data?.accessToken).get(`/course/curriculum/${data?.courseID}`) }
export const getCourseItemAPI = (data) => { return instance(data?.accessToken).get(`/course/${data?.courseID}/item/${data?.itemID}`) }
export const updateProfile = (data) => { return instance(data?.accessToken).post('/updateProfile', data?.data) }
export const myCoursesAPI = (accessToken) => { return instance(accessToken).get('/myCourses') }
export const viewProfileAPI = (accessToken) => { return instance(accessToken).get('/viewProfile') }
export const deleteAccount = (accessToken) => { return instance(accessToken).post('/deleteProfile') }
export const getCourseByNameAPI = (data) => { return instance(data?.accessToken).get(`/courseByName/${data?.name}`) }
export const accountRecovery = (accessToken) => { return instance(accessToken).post('/activateProfile') }
export const markItemCompleteAPI = (data) => { return instance(data?.accessToken).get(`course/markItemComplete/${data?.itemID}/${data?.courseID}`) }
export const getCompleteCourseItemIDAPI = (data) => { return instance(data?.accessToken).get(`course/progress/${data?.courseID}`) }
export const getCourseProgressAPI = (data) => { return instance(data?.accessToken).get(`course/getUserCourseProgress/${data?.courseID}`) }
export const subcribeNotificationAPI = (data) => { return instance(data?.accessToken).post(`course/subscribe/${data?.courseId}`, data?.data) }
export const getCurriculumIdsAPI = (data) => { return instance(data?.accessToken).get('/curriculum/list') }
export const createCourseByInstructorAPI = (data) => { return instance(data?.accessToken).post('/course/createCourseByInstructor', data?.data) }
export const createCourseMetaDataAPI = (data) => { return instance(data?.accessToken).post('/course/createCourseMetaData ', data?.data) }
export const createCourseCardMetaDataAPI = (data) => { return instance(data?.accessToken).post('/course/createCourseCardMetaData ', data?.data) }
export const createCourseDetailsMetaDataAPI = (data) => { return instance(data?.accessToken).post('/course/createCourseDetailsMetaData', data?.data) }
export const generateAttendanceQRAPI = (data) => { return instance(data?.accessToken).get('/attendance/key') }
export const getInstructorListAPI = (data) => { return instance(data?.accessToken).get('/instructor/list') }
export const createCourseAvailabilityAPI = (data) => { return instance(data?.accessToken).post('/course/availability/create', data?.data) }
export const getAllAvailabilityAPI = (data) => { return instance(data?.accessToken).get(`/availibiltyByCourseId/${data?.courseId}/all `) }
export const editAvailabilityAPI = (data) => { return instance(data?.accessToken).post(`/course/availability/update/${data?.availabilityId}`, data?.data) }
export const getAllCourseByInstructor = (data) => { return instance(data?.accessToken).get(`/courseByInstructor?type=${data?.courseType}`) }







