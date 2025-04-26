import { useNavigate, useRouteError } from "react-router-dom"

import sad from "@/assets/sad.png"

export default function Error() {
  const navigate = useNavigate()
  const error = useRouteError()

  return (
    <div className="w-full h-full ">
      <div className="p-7 w-screen flex space-y-2 items-center flex-col justify-center">
        <h2 className="w-[40%] text-center text-3xl py-5 font-semibold border-b border-stone-400">
          Something went wrong
        </h2>

        <p className="py-2">{error.data}</p>

        <img src={sad} alt="" className="w-56 h-56 my-16" />
        <button
          className="border border-gray-300 outline-none px-12 hover:bg-red-100 py-1 rounded-md cursor-pointer text-[#ef1919]"
          onClick={() => {
            navigate(-1)
          }}
        >
          &larr; Go back
        </button>
      </div>
    </div>
  )
}
