import { useNavigate, useRouteError } from "react-router-dom"

export default function Error() {
  const navigate = useNavigate()
  const error = useRouteError()

  return (
    <div className="p-7">
      <h2 className="text-3xl py-3 font-semibold">Something went wrong</h2>

      <p className="py-2">{error.data}</p>
      <button
        className="border border-gray-300 outline-none px-7 py-1 rounded-md cursor-pointer"
        onClick={() => {
          navigate(-1)
        }}
      >
        &larr; Go back
      </button>
    </div>
  )
}
