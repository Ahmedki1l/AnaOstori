var initialState = {
    viewProfileData: {},
    userDetails: [],
    myCourses: [],
    accessToken: "",
    googleLogin: false,
    isUserInstructor: false
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
                userDetails: [],
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
        default: return state;
    }
}
