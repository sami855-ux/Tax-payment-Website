export default function SaveButton({ children }) {
  return (
    <button
      className=" flex gap-2 mt-6 px-12 cursor-pointer py-2 text-[16px] bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      type="submit"
    >
      {children || "Save Changes"}
    </button>
  )
}
