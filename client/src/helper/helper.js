import axios from "axios"

const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/register`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )
    console.log("Registration successful:", response.data)
    return response.data
  } catch (error) {
    console.error("Registration failed:", error.response?.data || error.message)
    return { error: error.response?.data || "Something went wrong" }
  }
}

const validateEthiopianPhoneNumber = (phone) => {
  phone = phone.replace(/\s+/g, "")

  const ethiopianPhoneRegex = /^(?:\+251|251|0)?(9[0-9]{8})$/

  const match = phone.match(ethiopianPhoneRegex)

  if (match) return true

  return false
}

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  if (emailRegex.test(email)) return true

  return false
}

export { validateEthiopianPhoneNumber, validateEmail, registerUser }
