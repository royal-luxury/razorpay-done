import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import cartSlice from './cartSlice'
import prescriptionSlice from './prescriptionSlice'

export const store = configureStore({
    reducer: {
        authSlice: authSlice,
        cartSlice: cartSlice,
        prescriptionSlice: prescriptionSlice,
    },
})