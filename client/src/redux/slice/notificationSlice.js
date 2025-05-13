import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import {
  deleteNotificationById,
  getUserNotification,
  markNotificationReadById,
} from "@/services/notification"

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, thunkAPI) => {
    try {
      const response = await getUserNotification()
      return response.notifications
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.message || "Failed to fetch notifications"
      )
    }
  }
)

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, thunkAPI) => {
    try {
      await markNotificationReadById(id)
      return id
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.message || "Failed to mark notification as read"
      )
    }
  }
)

export const removeNotification = createAsyncThunk(
  "notifications/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteNotificationById(id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearNotifications: (state) => {
      state.items = []
      console.log(state.items)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error loading notifications"
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const id = action.payload
        const notif = state.items.find((n) => n._id === id)
        if (notif) notif.read = true
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(removeNotification.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n._id !== action.payload)
      })
      .addCase(removeNotification.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearNotifications } = notificationSlice.actions

export default notificationSlice.reducer
