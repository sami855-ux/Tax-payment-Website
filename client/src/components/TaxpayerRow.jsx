import { BadgeCheck, Bell, Eye, Trash2 } from "lucide-react"
import { HiPencil } from "react-icons/hi"

import ConfirmDelete from "@/ui/ConfirmDelete"
import ModalMenu from "@/ui/ModalMenu"
import Table from "@/ui/Table"
import Menus from "@/ui/Menus"
import UserProfilePage from "./userView"
import SendReminder from "./SendReminder"

function TaxpayerRow({ rowData }) {
  const {
    fullName,
    taxId,
    kebele,
    phone,
    lastFilingDate,
    noticesSent,
    isTaxSetupComplete,
  } = rowData

  return (
    <>
      <Table.Row>
        <p className="text-[14px]">{fullName}</p>
        <p className="text-[14px] font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
          {taxId}
        </p>
        <p className="text-[14px]">{kebele}</p>
        <p className="text-[14px]">+251 {phone}</p>
        <p
          className={`text-[13px] text-center py-1 w-fit px-3 rounded-2xl font-medium ${
            isTaxSetupComplete
              ? "text-green-600 bg-green-100"
              : "text-red-600 bg-red-200"
          }`}
        >
          {isTaxSetupComplete ? "Complete" : "Not complete"}
        </p>

        <p className="text-[14px]">{new Date(lastFilingDate).toDateString()}</p>
        <p className="text-[14px]">{noticesSent || 0}</p>
        <div>
          <ModalMenu>
            <Menus.Menu>
              <Menus.Toggle id={taxId} />

              <Menus.List id={taxId}>
                <ModalMenu.Open opens={"reminder"}>
                  <Menus.Button
                    icon={<Bell className="text-green-700" size={20} />}
                  >
                    Sent Reminder
                  </Menus.Button>
                </ModalMenu.Open>

                <ModalMenu.Open opens={"view"}>
                  <Menus.Button
                    icon={<Eye className="text-amber-700" size={20} />}
                  >
                    View Details
                  </Menus.Button>
                </ModalMenu.Open>
              </Menus.List>
              <ModalMenu.Window name="reminder">
                <SendReminder data={rowData} />
              </ModalMenu.Window>
              <ModalMenu.Window name="view">
                <UserProfilePage data={rowData} />
              </ModalMenu.Window>
            </Menus.Menu>
          </ModalMenu>
        </div>
      </Table.Row>
    </>
  )
}

export default TaxpayerRow
