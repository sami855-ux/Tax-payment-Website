import { useNavigate, useRouteError } from "react-router-dom"
import sad from "@/assets/sad.png"

export default function Error() {
  const navigate = useNavigate()
  const error = useRouteError()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-8 text-center">
          <div className="flex justify-center mt-5">
            <img
              src={sad}
              alt="Sad face"
              className="w-40 h-40 animate-bounce"
              style={{ animationDuration: "3s" }}
            />
          </div>

          <h1 className="text-5xl font-bold text-red-500 mb-2">
            {error.status || "Oops!"}
          </h1>

          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            {error.statusText || "Something went wrong"}
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            {error.data || "We're sorry, but an unexpected error occurred."}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Go Back
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home Page
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a href="#" className="text-red-500 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
