import axios from "axios"

const registerUser = async (userData) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/user/register`,
      userData,
      {
        withCredentials: true,
      }
    )
    if (res.success) {
      return res.data
    }
  } catch (error) {
    return { error: error.res?.data || "Something went wrong" }
  }
}

const loginUser = async (userData) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/user/login`,
      userData,
      {
        withCredentials: true,
      }
    )

    if (res.success) {
      return res.data
    }

    return { error: "Unexpected response from server" }
  } catch (error) {
    return { error: error.res?.data || "Something went wrong" }
  }
}

export { registerUser, loginUser }
