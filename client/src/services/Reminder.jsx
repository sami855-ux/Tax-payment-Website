import axios from "axios"

export const sendDailyReminder = async () => {
  try {
    const lastReminderDate = localStorage.getItem("lastReminderCheck")
    const today = new Date().toISOString().split("T")[0]

    if (lastReminderDate !== today) {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/schedule/reminders`,
        {
          withCredentials: true,
        }
      )

      if (response.data.success) {
        localStorage.setItem("lastReminderCheck", today) // Mark reminder as checked for today
        console.log("✅ Daily reminder check sent:", response.data.message)
      }
    } else {
      console.log("⏳ Reminder already checked today.")
    }
  } catch (error) {
    console.error("❌ Error in sending reminder:", error)
  }
}
