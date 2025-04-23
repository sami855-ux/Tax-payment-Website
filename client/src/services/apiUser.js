import axios from "axios"

const registerUser = async (userData) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/register`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )
    return res.data
  } catch (error) {
    return { error: error.res?.data || "Something went wrong" }
  }
}

export { registerUser }
