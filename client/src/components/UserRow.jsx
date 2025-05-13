import Table from "@/ui/Table"
import { BadgeCheck, Trash2 } from "lucide-react"
import Menus from "@/ui/Menus"
import { HiPencil } from "react-icons/hi"
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

  return (
    <>
      <Table.Row>
        <p className="text-[15px] capitalize">{fullName}</p>
        <p className="text-[15px] capitalize">{gender}</p>
        <p className="text-[15px]">{email}</p>
        <p className="text-[15px]">{taxId}</p>
        <p className="text-[15px]">{`+251${phoneNumber}`}</p>
        <p
          className={`${
            userRole === "taxpayer"
              ? "text-blue-800 bg-blue-100"
              : userRole === "admin"
              ? "text-amber-800 bg-amber-100"
              : "text-green-800 bg-green-100"
          } text-[13px] rounded-2xl uppercase font-semibold text-center py-1`}
        >
          {userRole}
        </p>
        <div>
          <ModalMenu>
            <Menus.Menu>
              <Menus.Toggle id={userId} />

              <Menus.List id={userId}>
                <ModalMenu.Open opens={"edit"}>
                  <Menus.Button
                    icon={<HiPencil className="text-green-700" size={20} />}
                  >
                    Edit
                  </Menus.Button>
                </ModalMenu.Open>

                {userRole === "taxpayer" && (
                  <ModalMenu.Open opens={"assign"}>
                    <Menus.Button
                      icon={<BadgeCheck className="text-amber-700" size={20} />}
                    >
                      Assign tax official
                    </Menus.Button>
                  </ModalMenu.Open>
                )}

                <ModalMenu.Open opens={"delete"}>
                  <Menus.Button
                    icon={<Trash2 className="text-orange-700" size={20} />}
                  >
                    Delete
                  </Menus.Button>
                </ModalMenu.Open>
              </Menus.List>

              <ModalMenu.Window name="edit">
                <EditUserAdmin user={rowData} />
              </ModalMenu.Window>

              <ModalMenu.Window name="delete">
                <ConfirmDelete onConfirm={mutate} resourceName=" user" />
              </ModalMenu.Window>
              <ModalMenu.Window name="assign">
                <AssignOfficialModal userName={fullName} taxpayerId={userId} />
              </ModalMenu.Window>
            </Menus.Menu>
          </ModalMenu>
        </div>
      </Table.Row>
    </>
  )
}

export default UserRow
