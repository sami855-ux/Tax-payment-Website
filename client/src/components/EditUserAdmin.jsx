import { updateUserRole } from "@/services/apiUser"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader, Loader2 } from "lucide-react"
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

  return (
    <div className="w-[600px] h-[50vh] bg-gray-100 p-7 border border-gray-300 rounded-2xl">
      <h2 className="font-semibold text-gray-800 pb-6 text-2xl">
        Assign new role
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          mutate()
        }}
      >
        <label htmlFor="" className="py-3 block text-[14px] text-gray-800">
          Select the role
        </label>
        <select
          className="block py-2 border border-gray-300 w-full rounded-md mb-9 px-4"
          onChange={(e) => {
            setRole(e.target.value)
          }}
          value={role}
        >
          <option value="taxpayer">Tax payer</option>
          <option value="official">Official</option>
          <option value="admin">Admin</option>
        </select>

        <button
          className="py-1 px-9 border border-red-200 rounded-lg text-white cursor-pointer bg-red-400 mr-7"
          onClick={onCloseModal}
        >
          Cancel
        </button>
        <button
          className="py-1 px-10 bg-blue-500 hover:bg-blue-400 text-white rounded-lg cursor-pointer"
          type="submit"
        >
          {isLoading ? (
            <div className="flex items-center gap-1.5">
              {" "}
              <Loader className="animate-spin"></Loader> ...Changing Role
            </div>
          ) : (
            "Change Role"
          )}
        </button>
      </form>
    </div>
  )
}
