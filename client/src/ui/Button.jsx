export default function Button({ text }) {
  return (
    <button className="w-fit px-4 py-2 hover:bg-blue-600 border-gray-300 bg-blue-700 rounded-md text-white cursor-pointer">
      {text}
    </button>
  )
}
