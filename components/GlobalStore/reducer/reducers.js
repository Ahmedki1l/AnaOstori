var initialState = {
    viewProfileData: {},
    myCourses: [],
    accessToken: null,
    loginWithoutPassword: false,
    isUserInstructor: false,
    catagories: [],
    curriculumIds: [],
    instructorList: [],
    availabilityList: [],
    editCourseData: {},
    isCourseEdit: false,
    returnUrl: null,
    loginWithoutPassword: false,
};

export const globalStore = (state = initialState, action) => {

    switch (action.type) {
        case 'SET_PROFILE_DATA':
            return {
                ...state,
                viewProfileData: action?.viewProfileData
            }
        case 'EMPTY_STORE':
            return {
                ...state,
                viewProfileData: {},
                myCourses: [],
                editCourseData: {},
                accessToken: null,
            }
        case 'ADD_AUTH_TOKEN':
            return {
                ...state,
                accessToken: action?.accessToken
            }
        case 'SET_ALL_MYCOURSE':
            return {
                ...state,
                myCourses: action?.myCourses
            }
        case 'SET_CATAGORIES':
            return {
                ...state,
                catagories: action?.catagories
            }
        case 'SET_CURRICULUMIDS':
            return {
                ...state,
                curriculumIds: action?.curriculumIds
            }
        case 'IS_USER_FROM_GOOGLE':
            return {
                ...state,
                loginWithoutPassword: action?.loginWithoutPassword
            }
        case 'IS_USER_INSTRUCTOR':
            return {
                ...state,
                isUserInstructor: action?.isUserInstructor
            }
        case 'SET_INSTRUCTOR':
            return {
                ...state,
                instructorList: action?.instructorList
            }
        case 'SET_AllAVAILABILITY':
            return {
                ...state,
                availabilityList: action?.availabilityList
            }
        case 'SET_EDIT_COURSE_DATA':
            return {
                ...state,
                editCourseData: action?.editCourseData
            }
        case 'SET_IS_COURSE_EDIT':
            return {
                ...state,
                isCourseEdit: action?.isCourseEdit
            }
        case 'SET_RETURN_URL':
            return {
                ...state,
                returnUrl: action?.returnUrl
            }
        case 'LOGIN_WITHOUT_PASSWORD':
            return {
                ...state,
                loginWithoutPassword: action?.loginWithoutPassword
            }

        default: return state;
    }
}
