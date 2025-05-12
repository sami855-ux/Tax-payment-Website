import { configureStore } from "@reduxjs/toolkit"

import { userReducer } from "./slice/userSlice"
import notificationReducer from "./slice/notificationSlice"
import filledReducer from "./slice/taxschedule"

const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
    filled: filledReducer,
  },
})

export default store
