const validatePhoneNumber = (phone) => {
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

export { validatePhoneNumber, validateEmail }
