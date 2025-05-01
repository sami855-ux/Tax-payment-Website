import axios from "axios"
import toast from "react-hot-toast"

export const registerUser = async (userData) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/user/register`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )
    if (res.data.success) {
      return res.data
    } else {
      return { error: res.data.message || "Registration failed" }
    }
  } catch (error) {
    return { error: error.response?.data || "Something went wrong" }
  }
}

export const loginUser = async (userData) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/user/login`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )

    if (res.data.success) {
      return res.data
    } else {
      return { error: res.data.message || "Login failed" }
    }
  } catch (error) {
    return { error: error.response?.data || "Something went wrong" }
  }
}

export const logoutUser = async () => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/user/logout`,
      {
        withCredentials: true,
      }
    )

    if (res.data.success) {
      return res.data
    } else {
      return { error: res.data.message || "Logout failed" }
    }
  } catch (error) {
    return { error: error.response?.data || "Something went wrong" }
  }
}

export const getUserById = async () => {
  const userId = localStorage.getItem("userId")

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/user/${userId}`,
      {
        withCredentials: true,
      }
    )
    if (res.data.success) {
      return res.data
    } else {
      return { error: res.data.message || "User not found" }
    }
  } catch (error) {
    return { error: error.response?.data || "Something went wrong" }
  }
}

export const updateUserById = async (userData) => {
  const userId = localStorage.getItem("userId")

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/api/user/${userId}`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )
    if (res.data.success) {
      return res.data
    } else {
      console.log("hi")
      return res.data
    }
  } catch (error) {
    console.log(error.response.data)
    return { error: error.response?.data || "Something went wrong" }
  }
}

export const exportUserToPDF = async () => {
  const userId = localStorage.getItem("userId")

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/export/${userId}`,
      {
        responseType: "blob", // Important: Set responseType to 'blob' for file download
      }
    )

    // Create a URL for the PDF blob
    const blob = response.data
    const url = window.URL.createObjectURL(new Blob([blob]))

    // Create a link element to trigger the download
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `user-data-${userId}.pdf`)
    document.body.appendChild(link)
    link.click()

    // Cleanup: remove the link after the download
    document.body.removeChild(link)
  } catch (error) {
    console.error("Error exporting user data to PDF:", error)
  }
}

export const deleteUser = async () => {
  try {
    const userId = localStorage.getItem("userId")

    const res = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/api/user/${userId}`,
      {
        withCredentials: true,
      }
    )
    if (res.data.success) {
      return res.data
    } else {
      return { error: res.data.message || "Delete failed" }
    }
  } catch (error) {
    return { error: error.response?.data || "Something went wrong" }
  }
}

export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user`, {
      withCredentials: true,
    })
    if (res.data.success) {
      return res.data
    } else {
      return []
    }
  } catch (error) {
    return { error: error.response?.data || "Something went wrong" }
  }
}
export const updateUserRole = async (userId, role) => {
  try {
    console.log(role)
    const res = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/api/user/role/${userId}`,
      { newRole: role },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )

    if (res.data.success) {
      toast.success(res.data.message)
      return res.data
    } else {
      return { error: res.data.message || "Update failed" }
    }
  } catch (error) {
    console.log(error.response)
    return { error: error.response?.data || "Something went wrong" }
  }
}

export const deleteUserAdmin = async (userId) => {
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/api/user/${userId}`,
      {
        withCredentials: true,
      }
    )

    if (res.data.success) {
      return res.data
    }
  } catch (error) {
    return { error: error.response?.data || "Something went wrong" }
  }
}
