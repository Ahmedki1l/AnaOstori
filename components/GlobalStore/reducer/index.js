import { globalStore } from "./reducers";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    globalStore : globalStore,
})

export default rootReducer;