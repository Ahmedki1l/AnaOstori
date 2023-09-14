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


export const createOrderAPI = (data) => { return instance.post(`/createOrder`, data?.orderData) }
export const getMyOrderAPI = (data) => { return instance.get(`/order/query`) }
export const getPaymentInfoAPI = (data) => { return instance.post(`/orders/verifyPayment/${data?.orderID}/${data?.transactionID}`) }
export const getCourseDetailsAPI = (data) => { return instance.get(`/courseByName/${data?.courseName}`) }
export const getCatagoriesAPI = () => { return instance.get(`/catagories`) }
export const courseCurriculumAPI = (data) => { return instance.get(`/course/curriculum/${data?.courseID}`) }
export const getCourseItemAPI = (data) => { return instance.get(`/course/${data?.courseID}/item/${data?.itemID}`) }
export const updateProfile = (data) => { return instance.post('/updateProfile', data?.data) }
export const myCoursesAPI = () => { return instance.get('/myCourses') }
export const viewProfileAPI = () => { return instance.get('/viewProfile') }
export const deleteAccount = () => { return instance.post('/deleteProfile') }
export const getCourseByNameAPI = (data) => { return instance.get(`/courseByName/${data?.name}`) }
export const accountRecovery = () => { return instance.post('/activateProfile') }
export const markItemCompleteAPI = (data) => { return instance.get(`course/markItemComplete/${data?.itemID}/${data?.courseID}/enrollment/${data.enrollmentId}`) }
export const getCompleteCourseItemIDAPI = (data) => { return instance.get(`course/progress/${data?.courseID}/enrollment/${data.enrollmentId}`) }
export const getCourseProgressAPI = (data) => { return instance.get(`course/getUserCourseProgress/${data?.courseID}/enrollment/${data.enrollmentId}`) }
export const subcribeNotificationAPI = (data) => { return instance.post(`course/subscribe/${data?.courseId}`, data?.data) }
export const getCurriculumIdsAPI = () => { return instance.get('/curriculum/list') }
export const generateAttendanceQRAPI = (data) => { return instance.get('/attendance/key') }
export const getInstructorListAPI = (data) => { return instance.get('/instructor/list') }

export const createCourseAvailabilityAPI = (data) => { return instance.post('/course/availability/create', data?.data) }
export const getAllAvailabilityAPI = (data) => { return instance.get(`/availibiltyByCourseId/${data?.courseId}/all`) }
export const editAvailabilityAPI = (data) => { return instance.post(`/course/availability/update/${data?.availabilityId}`, data?.data) }
export const getAllCourseByInstructor = (data) => { return instance.get(`/courseByInstructor?type=${data?.courseType}`) }

// **************** Create Course Apis **************//
export const createCourseByInstructorAPI = (data) => { return instance.post('/course/createCourseByInstructor', data?.data) }
export const createCourseMetaDataAPI = (data) => { return instance.post('/course/createCourseMetaData ', data?.data) }
export const createCourseCardMetaDataAPI = (data) => { return instance.post('/course/createCourseCardMetaData ', data?.data) }
export const createCourseDetailsMetaDataAPI = (data) => { return instance.post('/course/createCourseDetailsMetaData', data?.data) }

// ********* update Course details APIs ***********//
export const updateCourseDetailsAPI = (data) => { return instance.post(`/course/update/${data?.courseId}`, data?.data) }
export const updateCourseMetaDataAPI = (data) => { return instance.post(`/course/courseMetaData/update`, data?.data) }
export const updateCourseDetailsMetaDataAPI = (data) => { return instance.post(`/course/courseDetailsMetaData/update`, data?.data) }
export const updateCourseCardMetaDataAPI = (data) => { return instance.post(`/course/courseCardMetaData/update`, data?.data) }

// ********* delete Course metadata APIs ***********//
export const deleteCourseTypeAPI = (data) => { return instance.post(`/course/courseType/delete`, data?.data) }

// ********* Attendance APIs ***********//
export const getAttendanceListAPI = (data) => { return instance.get(`/attendance/list/${data?.availabilityId}`) }
export const updateAttendanceDataAPI = (data) => { return instance.post(`/attendance/update`, data?.data) }
export const getStudentListAPI = (data) => { return instance.get(`/students/course/${data?.courseId}/availability/${data?.availabilityId}`) }

export const createStudentExamDataAPI = (data) => { return instance.post(`/course/courseTrackBulk/create`, data) }
export const updateStudentExamDataAPI = (data) => { return instance.post(`/courseTrack/update`, data) }

export const getExamListAPI = (data) => { return instance.get(`/item/${data?.courseId}?type=${data.type}`) }

//implement baki
export const getStudentListByExamAPI = (data) => { return instance.get(`student/item/${data?.itemId}/availability/${data?.availabilityId}`) }



// ********* Manage Library APIs ***********//

export const getFolderListAPI = (data) => { return instance.post(`folder/list/${data.folderType}`) }

export const createFolderAPI = (data) => { return instance.post(`/folder/create`, data?.data) }
export const updateFolderAPI = (data) => { return instance.post(`/folder/update`, data?.data) }

export const addItemToFolderAPI = (data) => { return instance.post(`item/create/${data?.folderId}`, data?.data) }

export const updateItemToFolderAPI = (data) => { return instance.post(`item/update`, data?.data) }

export const getItemListAPI = (data) => { return instance.get(`item/list?folderId=${data?.folderId}`) }

// ********* Manage Curriculum APIs ***********//

export const createCurriculumAPI = (data) => { return instance.post(`/curriculum/create`, data?.data) }
export const updateCurriculumAPI = (data) => { return instance.post(`/curriculum/update`, data?.data) }
export const getCurriculumDetailsAPI = (data) => { return instance.get(`/curriculum/${data?.curriculumId}`, data?.data) }


// ********* Manage Curriculum Section APIs ***********//
export const getSectionListAPI = (data) => { return instance.get(`/section?curriculumId=${data.curriculumId}`) }
export const createCurriculumSectionAPI = (data) => { return instance.post(`/section/create`, data?.data) }
export const updateCurriculumSectionAPI = (data) => { return instance.post(`/section/update?type=single`, data?.data) }
export const updateMultipleSectionOrderAPI = (data) => { return instance.post(`/section/update?type=multipleOrder`, data) }


export const addItemIntoSectionAPI = (data) => { return instance.post(`/section/item`, data?.data) }
export const removeItemFromSectionAPI = (data) => { return instance.post(`/section/item/delete`, data) }
export const updateItemOfSectionAPI = (data) => { return instance.post(`/section/item/update`, data) }

// ********* Manage Instructor APIs ***********//
export const createInstroctorAPI = (data) => { return instance.post(`/instructor/create`, data) }
export const editInstroctorAPI = (data) => { return instance.post(`/instructor/update`, data) }

// ********* Manage category APIs ***********//
export const createCatagoryAPI = (data) => { return instance.post(`/catagory/create`, data) }
export const editCatagoryAPI = (data) => { return instance.post(`/catagory/update`, data) }

// ********* Manage News APIs ***********//
export const createNewsAPI = (data) => { return instance.post(`/newsBar/create`, data) }
export const editNewsAPI = (data) => { return instance.post(`/newsBar/update`, data) }

// ********* Manage Orders APIs ***********//
export const managePurchaseOrdersAPI = (data) => { return instance.get(`playground?page=${data.pageNo}&limit=${data.limit}&order=${data.order}`) }


