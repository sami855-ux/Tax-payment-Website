import React from "react"

const Input = React.forwardRef(
  ({ label, type = "text", placeholder, ...rest }, ref) => {
    return (
      <div>
        <label className="block mb-3 text-sm text-gray-700 font-semibold">
          {label}
        </label>
        <input
          type={type}
          placeholder={placeholder}
          {...rest}
          ref={ref} // Forward ref for React Hook Form
          className="w-[90%] p-3 border rounded-lg border-gray-300 focus:border-gray-500 outline-none"
          required
        />
      </div>
    )
  }
)

export default Input
