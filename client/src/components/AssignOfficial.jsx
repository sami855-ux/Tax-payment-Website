import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { assignOfficial, fetchAllOfficials } from "@/services/apiUser"
import toast from "react-hot-toast"

const AssignOfficialModal = ({ userName, taxpayerId, onCloseModal }) => {
  const { data } = useQuery({
    queryKey: ["officials"],
    queryFn: fetchAllOfficials,
  })

  const [selectedOfficial, setSelectedOfficial] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const maxAssignLimit = 20

  const handleAssign = async () => {
    try {
      const res = await assignOfficial(taxpayerId, selectedOfficial?._id)

      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.error)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="w-[100%] h-fit p-6 mx-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center pb-7">
                Assign Tax Official
              </h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-1">
                <label className="flex items-center text-gray-700 pb-2">
                  Taxpayer
                </label>
                <input
                  type="text"
                  value={userName}
                  disabled={true}
                  placeholder="Enter taxpayer name or ID"
                  className="w-full px-4 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1 relative">
                <label className="flex items-center text-gray-700 pb-2">
                  Assigned Official
                </label>
                <div
                  className="relative cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between">
                    {selectedOfficial ? (
                      <span>
                        {selectedOfficial.avatar} {selectedOfficial.fullName} (
                        {selectedOfficial.assignedCount} assigned)
                      </span>
                    ) : (
                      <span className="text-gray-400">Select an official</span>
                    )}
                    <span className="text-gray-500">▾</span>
                  </div>

                  {isDropdownOpen && (
                    <motion.div
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {data.map((official) => (
                        <div
                          key={official._id}
                          className={`px-4 py-3 hover:bg-blue-50 flex items-center ${
                            selectedOfficial?._id === official?._id
                              ? "bg-blue-100"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedOfficial(official)
                            setIsDropdownOpen(false)
                          }}
                        >
                          <img
                            src={data.profilePhoto}
                            className="mr-2 w-10 h-10 rounded-full"
                          ></img>
                          <span>
                            {official.fullName} ({official.assignedCount}{" "}
                            assigned)
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="w-full p-2 h-32 bg-red-50 rounded-2xl flex  justify-center flex-col text-gray-600">
                <p className="text-red-500">Remember</p>
                <span>
                  Max Assign Limit: {maxAssignLimit} taxpayers per official
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={onCloseModal}
                className="px-5 py-2 cursor-pointer rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!taxpayerId || !selectedOfficial}
                className={`px-5 py-2 rounded-lg cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition-colors ${
                  !taxpayerId || !selectedOfficial
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Assign
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AssignOfficialModal
