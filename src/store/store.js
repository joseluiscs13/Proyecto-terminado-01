import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { uiSlice } from "./ui/uiSlice";
import { authSlice } from "./auth/authSlice";
import { mdSlice } from "./musicdetect/mdSlice";


export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        md: mdSlice.reducer,
        ui: uiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})