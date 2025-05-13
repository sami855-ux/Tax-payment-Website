import axios from "axios"

export const sendEmail = async (data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/email/send`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    if (res.data.success) {
      return res.data
    } else {
      return { error: res.message || "Failed to send email" }
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: "Failed to send email. Please try again.",
    }
  }
}
