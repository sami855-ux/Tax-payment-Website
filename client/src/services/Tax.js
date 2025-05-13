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

export const createTaxFiling = async (filingData) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/filling/create`,
      filingData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (res.data.success) {
      return res.data
    } else {
      return { error: res.data.message || "Filing failed" }
    }
  } catch (error) {
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
      // Server responded with a status other than 2xx
      throw new Error(
        error.response.data.error || "Failed to review the filling."
      )
    } else {
      // Network or unexpected error
      throw new Error("Network error or server not reachable.")
    }
  }
}
