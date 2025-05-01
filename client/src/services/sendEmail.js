import axios from "axios"

export const sendEmail = async (data) => {
  try {
    const res = axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/email/send`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    if (res.success) {
      return res.data
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: "Failed to send email. Please try again.",
    }
  }
}
