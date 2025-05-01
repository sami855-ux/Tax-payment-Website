export default function Toggle({ label }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 border border-gray-300 rounded-lg shadow-sm">
      <span className="text-gray-800">{label}</span>
      <input
        type="checkbox"
        className="w-6 h-6 rounded-full text-indigo-600  focus:ring-2 cursor-pointer"
      />
    </div>
  )
}
