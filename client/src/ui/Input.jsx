export default function Input({ label, type = "text", placeholder, ...rest }) {
  return (
    <div>
      <label className="block mb-3 text-sm text-gray-700 font-semibold">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...rest}
        className="w-[90%] p-3 border rounded-lg border-gray-300  focus:border-gray-500 outline-none"
        // required
      />
    </div>
  )
}
