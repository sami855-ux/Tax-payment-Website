import UserTable from "@/components/UserTable"
import { useEffect } from "react"
import { motion } from "framer-motion"

export default function ManageUser() {
  useEffect(() => {
    document.title = "Manage users "
  }, [])

  return (
    <div className="bg-gray-200 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className=" pl-7 mb-10 pt-12"
      >
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Manage Users</h1>
        <p className="text-gray-500">
          Manage platform settings, profile, and preferences
        </p>
      </motion.div>
      <div className="min-h-screen overflow-x-auto bg-white mx-4 rounded-lg">
        <div className="min-w-full overflow-x-auto mb-7">
          <UserTable />
        </div>
      </div>
    </div>
  )
}
