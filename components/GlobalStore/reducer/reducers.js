var initialState = {
    viewProfileData: {},
    myCourses: [],
    accessToken: "",
    googleLogin: false,
    isUserInstructor: false,
    catagories: [],
    curriculumIds: [],
    instructorList: [],
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
                accessToken: ""
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
                googleLogin: action?.googleLogin
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

        default: return state;
    }
}
