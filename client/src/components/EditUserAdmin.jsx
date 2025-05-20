import { updateUserRole } from "@/services/apiUser"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function EditUserAdmin({ user, onCloseModal }) {
  const [role, setRole] = useState(user?.role)
  const queryClient = useQueryClient()

  const { isLoading, mutate } = useMutation({
    mutationFn: () => updateUserRole(user?._id, role),
    onSuccess: () => {
      onCloseModal()
      queryClient.invalidateQueries({
        queryKey: ["users-admin"],
      })
    },
  })

  const roleOptions = [
    { value: "taxpayer", label: "Tax Payer" },
    { value: "official", label: "Tax Official" },
    { value: "admin", label: "Administrator" },
  ]

  return (
    <div className="w-[500px] bg-white p-8 rounded-xl shadow-lg">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Update User Role</h2>
          <p className="text-gray-500 mt-1">
            Assign a new role for {user?.fullName}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            mutate()
          }}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="role-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Role
            </label>
            <div className="relative">
              <select
                id="role-select"
                className="appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCloseModal}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Role"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
