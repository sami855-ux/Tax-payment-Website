import axios from "axios"

export const checkTaxSetup = async () => {
  try {
    axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/notifications/checkTaxSetup`,
      {
        withCredentials: true,
      }
    )
  } catch (error) {
    console.log(error)
  }
}

export const getUserNotification = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/notifications/getUserNotification`,
      {
        withCredentials: true,
      }
    )

    if (await res.data.success) {
      return res.data
    } else {
      return { error: res.data.message || "Failed" }
    }
  } catch (error) {
    console.log(error)
    return { error: error.response?.data || "Something went wrong" }
  }
}

export const markNotificationReadById = async (id) => {
  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/api/notifications/${id}/read`,
      {},
      {
        withCredentials: true,
      }
    )
    if (res.data.success) {
      return res.data
    } else {
      return {
        error: res.data.message || "Failed",
      }
    }
  } catch (err) {
    console.error("Error marking notification as read:", err)
    const message =
      err?.response?.data?.message || "Failed to mark notification as read."
    throw new Error(message)
  }
}

export const markAllNotificationsRead = async () => {
  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/api/notifications/read-all`,
      {
        withCredentials: true,
      }
    )
    if (res.data.success) {
      return res.data
    } else {
      return {
        error: res.data.message || "Failed",
      }
    }
  } catch (err) {
    console.error("Error marking all notifications as read:", err)
    const message =
      err?.response?.data?.message ||
      "Failed to mark all notifications as read."
    throw new Error(message)
  }
}

export const deleteNotificationById = async (id) => {
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/api/notifications/${id}`,
      { withCredentials: true }
    )

    return res.data
  } catch (err) {
    const message =
      err?.response?.data?.message || "Failed to delete notification."
    throw new Error(message)
  }
}

export const createNotificationAPI = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/notifications`,
      data,
      {
        withCredentials: true,
      }
    )
    return response.data
  } catch (err) {
    console.error("Failed to create notification:", err)
    const message =
      err?.response?.data?.message || "Unable to create notification."
    throw new Error(message)
  }
}
