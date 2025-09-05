import {configureStore} from "@reduxjs/toolkit"
import authSliceReducer from "./authslice"
import chatSliceReducer from "./chatSlice"
const store=configureStore({
    reducer:{
        auth:authSliceReducer,
        chat:chatSliceReducer
    }
})
export default store;