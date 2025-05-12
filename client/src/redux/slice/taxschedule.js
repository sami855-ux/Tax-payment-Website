import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getFilledPeriod, getFilledTaxSchedules } from "../../services/Tax"

export const fetchFiledTaxSchedules = createAsyncThunk(
  "taxSchedules/fetchFiled",
  async (_, { thunkAPI }) => {
    try {
      console.log("hi")
      const schedules = await getFilledTaxSchedules()
      console.log("Fetched schedules:", schedules)
      return schedules
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.message || "Failed to fetch notifications"
      )
    }
  }
)

export const fetchFiledPeriods = createAsyncThunk(
  "taxSchedule/fetchFiledPeriods",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getFilledPeriod()
      return res.data.filings
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch")
    }
  }
)

const initialState = {
  schedules: [],
  status: "idle",
  filedPeriods: [],
}

const taxSchedulesSlice = createSlice({
  name: "taxSchedules",
  initialState,
  reducers: {
    resetSchedules: (state) => {
      state.schedules = []
      state.status = "idle"
    },
    resetPeriods: (state) => {
      state.filedPeriods = []
      state.status = "idle"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiledTaxSchedules.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchFiledTaxSchedules.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.schedules = action.payload
      })
      .addCase(fetchFiledTaxSchedules.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(fetchFiledPeriods.fulfilled, (state, action) => {
        state.filedPeriods = action.payload
      })
      .addCase(fetchFiledPeriods.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { resetSchedules, resetPeriods } = taxSchedulesSlice.actions
export default taxSchedulesSlice.reducer
