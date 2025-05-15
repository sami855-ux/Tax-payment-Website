import axios from "axios"

export const getPendingTaxSchedules = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/schedule/pendingTax`,
      {
        withCredentials: true,
      }
    )

    if (res.data.success) {
      return res.data
    } else {
      return { error: res.data.message || "failed" }
    }
  } catch (error) {
    console.log(error.response)
    return { error: error.response?.data || "Something went wrong h" }
  }
}

export const getFilledTaxSchedules = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/schedule/filed`,
      {
        withCredentials: true,
      }
    )

    if (res.data.success) {
      console.log(res.data)
      return res.data.schedules
    } else {
      return { error: res.data.message || "failed" }
    }
  } catch (error) {
    console.log(error.response)
    return { error: error.response?.data || "Something went wrong h" }
  }
}

export const getFilledPeriod = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/schedule/filled-period`,
      {
        withCredentials: true,
      }
    )

    if (res.data.success) {
      return res.data
    } else {
      return { error: res.data.message || "failed" }
    }
  } catch (error) {
    console.log(error.response)
    return { error: error.response?.data || "Something went wrong h" }
  }
}

export const createTaxFiling = async (formData) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/filling/create`,
      formData,
      {
        withCredentials: true,
      }
    )

    if (res.data.success) {
      return res.data
    } else {
      return { error: res.data.message || "Filing failed" }
    }
  } catch (error) {
    console.log(error)
    return {
      error:
        error.response?.data?.message ||
        error.response?.data ||
        "Something went wrong",
    }
  }
}

export const createTaxRule = async (formData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/rule/create`,
      formData,
      {
        withCredentials: true,
      }
    )
    if (response.data.success) {
      return response.data
    } else {
      return { error: response.data.message || "Filing failed" }
    }
  } catch (error) {
    console.log(error)
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(error.response.data.error || "Failed to create tax rule.")
    } else {
      // Network or unexpected error
      throw new Error("Network error or server not reachable.")
    }
  }
}

export const getAllTaxRules = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/rule`,
      {
        withCredentials: true,
      }
    )
    if (response.data.success) {
      return response.data.taxRules
    } else {
      return { error: response.data.message || "failed" }
    }
  } catch (error) {
    console.error("Failed to fetch tax rules:", error)
    return {
      success: false,
      error: error.response?.data?.error || "Unknown error",
    }
  }
}

export const updateTaxRule = async (id, updatedData) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/api/rule/${id}`,
      updatedData,
      { withCredentials: true }
    )
    if (response.data.success) {
      return response.data.taxRules
    } else {
      return { error: response.data.message || "failed" }
    }
  } catch (error) {
    console.error(
      "Error updating tax rule:",
      error.response?.data || error.message
    )
    throw error
  }
}

export const deleteTaxRule = async (id) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/api/rule/${id}`,
      { withCredentials: true }
    )
    if (response.data.success) {
      return response.data.taxRules
    } else {
      return { error: response.data.message || "failed" }
    }
  } catch (error) {
    console.error(
      "Error deleting tax rule:",
      error.response?.data || error.message
    )
    throw error
  }
}

export const assignedTaxFillings = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/filling/assigned`,
      { withCredentials: true }
    )
    console.log(response)
    if (response.data.success) {
      return response.data.filings
    } else {
      return { error: response.data.message || "failed" }
    }
  } catch (error) {
    console.error(
      "Error updating tax rule:",
      error.response?.data || error.message
    )
    throw error
  }
}

export const reviewTaxFiling = async (formData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/filling/review`,
      formData,
      {
        withCredentials: true,
      }
    )
    if (response.data.success) {
      return response.data
    } else {
      return { error: response.data.message || "Filing failed" }
    }
  } catch (error) {
    console.log(error)
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to review the filling."
      )
    } else {
      throw new Error("Network error or server not reachable.")
    }
  }
}
export const getApprovedTaxFilingsForUser = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/filling/approved`,
      {
        withCredentials: true,
      }
    )
    if (response.data.success) {
      return response.data
    } else {
      console.log(response)
      return { error: response.data.message || "Failed" }
    }
  } catch (error) {
    console.log(error)
    if (error.response) {
      throw new Error(
        error.response.data.error || "Failed to get approved filling."
      )
    } else {
      throw new Error("Network error or server not reachable.")
    }
  }
}

export const createPayment = async (formData) => {
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1])
  }
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/payment/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    )

    if (response.data.success) {
      console.log("Payment created:", response.data.payment)
      return response.data
    } else {
      console.error("Payment creation failed:", response.data.message)
      return { error: response.data.message || "Failed" }
    }
  } catch (error) {
    console.error("Error creating payment:", error.response?.data || error)
    throw error
  }
}

export const fetchUserPayments = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/payment/getall`,
      {
        withCredentials: true,
      }
    )

    return response.data.payments
  } catch (error) {
    console.error("Error fetching user payments:", error)
    throw error.response?.data || { message: "Failed to fetch payments." }
  }
}
export const getTaxPaymentTrends = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/filling/getPaymentTrend`,
      {
        withCredentials: true,
      }
    )

    return response.data.payment
  } catch (error) {
    console.error("Error fetching user payments:", error)
    throw error.response?.data || { message: "Failed to fetch payments." }
  }
}
export const fetchPendingTaxFilings = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/filling/pending`,
      {
        withCredentials: true,
      }
    )

    return response.data
  } catch (error) {
    console.error("Error fetching user payments:", error)
    throw error.response?.data || { message: "Failed to fetch payments." }
  }
}
export const getPaymentsForOfficial = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/payment/getassigned-payment`,
      {
        withCredentials: true,
      }
    )

    console.log("response")
    if (response.data.success) {
      return response.data.payment
    }
  } catch (error) {
    console.error("Error fetching user payments:", error)
    throw error.response?.data || { message: "Failed to fetch payments." }
  }
}

export const approvePayment = async (obj) => {
  const status = obj.status
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/api/payment/approve/${obj.paymentId}`,
      { status },
      {
        withCredentials: true,
      }
    )

    if (response.data.success) {
      console.log("Payment approved:", response.data.payment)
      return response.data
    } else {
      console.error("Approval failed:", response.data.message)
      return { error: response.data.message }
    }
  } catch (error) {
    console.error(
      "Axios error approving payment:",
      error.response?.data || error
    )
    return { error: "Something went wrong while approving payment" }
  }
}

export const fetchOfficialDashboardStats = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/user/dashboard`,
      {
        withCredentials: true,
      }
    )

    return response.data.data
  } catch (error) {
    console.error(
      "Error fetching dashboard stats:",
      error.response?.data || error
    )
    throw error
  }
}
export const getTaxTimeLine = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/filling/timeline`,
      {
        withCredentials: true,
      }
    )

    return response.data.timelineData
  } catch (error) {
    console.error(
      "Error fetching dashboard stats:",
      error.response?.data || error
    )
    throw error
  }
}
export const getRecentActivityFeed = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/filling/dashboard/activity-feed`,
      {
        withCredentials: true,
      }
    )

    return response.data.activityData
  } catch (error) {
    console.error(
      "Error fetching dashboard stats:",
      error.response?.data || error
    )
    throw error
  }
}
