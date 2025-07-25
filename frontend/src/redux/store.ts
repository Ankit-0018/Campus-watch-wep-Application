import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../redux/auth/authSlice'
import issueReducer from '../redux/issue/issueSlice'
import lostFoundReducer from '../redux/lostfound/lostFoundSlice'

const store = configureStore({
reducer : {
    auth : authReducer,
    issue : issueReducer,
    lostFound : lostFoundReducer
}
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;