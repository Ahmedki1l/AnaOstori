import { createStore } from "redux";
import rootReducer from "./reducer/index";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage
}

let persistedReducer = persistReducer(persistConfig, rootReducer)

let store = createStore(persistedReducer);

let persistor = persistStore(store);

export { store, persistor }