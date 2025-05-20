import Table from "@/ui/Table"
import { BadgeCheck, Trash2, Pencil, UserCog } from "lucide-react"
import Menus from "@/ui/Menus"
import ModalMenu from "@/ui/ModalMenu"
import EditUserAdmin from "./EditUserAdmin"
import ConfirmDelete from "@/ui/ConfirmDelete"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteUserAdmin } from "@/services/apiUser"
import AssignOfficialModal from "./AssignOfficial"

function UserRow({ rowData }) {
  const {
    _id: userId,
    fullName,
    gender,
    email,
    phoneNumber,
    role: userRole,
    taxId,
  } = rowData
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationKey: ["user-admin"],
    mutationFn: () => deleteUserAdmin(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["user-admin"])
    },
  })

  const roleStyles = {
    taxpayer: "bg-blue-50 text-blue-800 border-blue-200",
    admin: "bg-amber-50 text-amber-800 border-amber-200",
    official: "bg-green-50 text-green-800 border-green-200",
  }

  return (
    <Table.Row className="hover:bg-gray-50 transition-colors">
      <div className="py-1 px-4">
        <p className="text-sm font-medium text-gray-900 capitalize">
          {fullName}
        </p>
      </div>

      <div className="py-1 px-4">
        <p className="text-sm text-gray-600 capitalize">{gender}</p>
      </div>

      <div className="py-1">
        <p className="text-sm text-gray-600 truncate max-w-[180px]">{email}</p>
      </div>

      <div className="py-1 px-4">
        <p className="text-sm font-mono text-gray-600">{taxId}</p>
      </div>

      <div className="py-1 px-4">
        <p className="text-sm text-gray-600">{`+251 ${phoneNumber?.replace(
          /(\d{3})(\d{3})(\d{4})/,
          "$1 $2 $3"
        )}`}</p>
      </div>

      <div className="py-1 px-4">
        <span
          className={`${roleStyles[userRole] || "bg-gray-100 text-gray-800"} 
          text-[14px] px-3 py-1 rounded-full border font-medium inline-flex items-center gap-1`}
        >
          {userRole === "official" && <UserCog className="h-3 w-3" />}
          {userRole}
        </span>
      </div>

      <div className="py-1 px-4">
        <ModalMenu>
          <Menus.Menu>
            <Menus.Toggle
              id={userId}
              className="p-1.5 hover:bg-gray-100 rounded-md"
            />

            <Menus.List id={userId} className="min-w-[200px]">
              <ModalMenu.Open opens="edit">
                <Menus.Button
                  icon={<Pencil className="h-4 w-4 text-green-600" />}
                  className="hover:bg-green-50"
                >
                  Edit User
                </Menus.Button>
              </ModalMenu.Open>

              {userRole === "taxpayer" && (
                <ModalMenu.Open opens="assign">
                  <Menus.Button
                    icon={<BadgeCheck className="h-4 w-4 text-amber-600" />}
                    className="hover:bg-amber-50"
                  >
                    Assign Official
                  </Menus.Button>
                </ModalMenu.Open>
              )}

              <ModalMenu.Open opens="delete">
                <Menus.Button
                  icon={<Trash2 className="h-4 w-4 text-red-600" />}
                  className="hover:bg-red-50"
                >
                  Delete User
                </Menus.Button>
              </ModalMenu.Open>
            </Menus.List>

            <ModalMenu.Window name="edit">
              <EditUserAdmin user={rowData} />
            </ModalMenu.Window>

            <ModalMenu.Window name="delete">
              <ConfirmDelete onConfirm={mutate} resourceName="user" />
            </ModalMenu.Window>

            <ModalMenu.Window name="assign">
              <AssignOfficialModal userName={fullName} taxpayerId={userId} />
            </ModalMenu.Window>
          </Menus.Menu>
        </ModalMenu>
      </div>
    </Table.Row>
  )
}

export default UserRow
