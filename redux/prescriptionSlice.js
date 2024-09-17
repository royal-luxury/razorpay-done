import { createSlice } from '@reduxjs/toolkit'

const prescriptionSlice = createSlice({
  name: 'prescription',
  initialState: {
    imageBase64: ''
  },
  reducers: {
    setImageBase64(state, action) {
      state.imageBase64 = action.payload
    },
    resetPrescription(state) {
      state.imageBase64 = null;
    },
  }
})

export const { setImageBase64, resetPrescription } = prescriptionSlice.actions
export default prescriptionSlice.reducer
